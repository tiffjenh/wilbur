/**
 * Unified retrieval from approved sources only.
 * Used by: /api/wilbur, lesson generation.
 *
 * To use a real search provider (Serper, Tavily, Bing):
 * - Use site: operator with approved domains from getTier1DomainsForState / APPROVED_TIERS
 * - Filter results with isApprovedUrl(); prefer Tier 1 for tax/legal
 * - Implement getExcerptsFromSearch() and call it from retrieveApproved()
 */
import {
  getTierForUrl,
  getTier1DomainsForState,
  enforceApprovedSources,
  normalizeDomain,
  type EnforceResult,
} from "@/content/sources/approvedSources";
import { getStateDomains } from "@/content/sources/stateDomains";

export interface RetrievalExcerpt {
  text: string;
  title: string;
  url: string;
  domain: string;
  tier: 1 | 2;
}

export interface RetrievalCitation {
  title: string;
  url: string;
  domain: string;
  tier: 1 | 2;
}

export interface RetrieveApprovedOptions {
  query: string;
  userState?: string;
  maxSources?: number;
  /** If true and query is tax/legal, require at least one Tier 1; otherwise refuse to answer from Tier 2 alone */
  requireTier1ForTax?: boolean;
}

export interface RetrieveApprovedResult {
  excerpts: RetrievalExcerpt[];
  citations: RetrievalCitation[];
  /** When requireTier1ForTax and no Tier 1 found for tax-like query */
  tier1RequiredNotMet?: boolean;
  /** When state tax query + userState but no state Tier 1 source found — do not answer from Investopedia */
  stateTier1RequiredNotMet?: boolean;
}

const TAX_LEGAL_KEYWORDS = /tax|irs|withholding|deduction|credit|state\s+revenue|ftb|dor\.|comptroller|legal|regulation|sec\s+rule|federal\s+reserve|fdic|ncua|cfpb/i;

/** Queries that require at least 1 IRS + 1 state Tier 1 source when userState is set. */
const STATE_TAX_QUERY_PATTERNS = /state\s+income\s+tax|state\s+capital\s+gains|state\s+deductions|filing\s+in\s+(?:my\s+)?\[?state|state\s+tax\s+(?:rules?|rates?|filing)|(?:income\s+)?tax\s+in\s+my\s+state/i;

/**
 * Whether the query is likely about tax/legal/regulatory topics.
 */
export function isTaxOrLegalQuery(query: string): boolean {
  return TAX_LEGAL_KEYWORDS.test(query.trim());
}

/**
 * Whether the query is about state-level tax (state income tax, state deductions, filing in state, etc.).
 * When true and userState is set, retrieval should require at least one state Tier 1 source.
 */
export function isStateTaxQuery(query: string): boolean {
  return STATE_TAX_QUERY_PATTERNS.test(query.trim()) || (isTaxOrLegalQuery(query) && /\bstate\b/i.test(query.trim()));
}

/** In-memory fallback: short excerpts for common terms (approved URLs only). No network. */
const STATIC_EXCERPTS: Array<{ trigger: RegExp; title: string; url: string; text: string; domain: string }> = [
  {
    trigger: /\bfdic\b/i,
    title: "FDIC — Deposit Insurance",
    url: "https://www.fdic.gov/resources/deposit-insurance/",
    domain: "fdic.gov",
    text: "The FDIC (Federal Deposit Insurance Corporation) protects depositors by insuring deposits up to $250,000 per depositor, per insured bank. Coverage is automatic when you open an account at an FDIC-insured bank.",
  },
  {
    trigger: /\bapy\b|annual\s+percentage\s+yield/i,
    title: "CFPB — Savings and APY",
    url: "https://www.consumerfinance.gov/consumer-tools/savings/",
    domain: "consumerfinance.gov",
    text: "APY (Annual Percentage Yield) is the rate you actually earn on savings in a year, including compound interest. It's higher than the stated interest rate when interest compounds more than once per year.",
  },
  {
    trigger: /\bsec\b|securities\s+and\s+exchange/i,
    title: "SEC — Investor.gov",
    url: "https://www.investor.gov/",
    domain: "investor.gov",
    text: "The SEC (Securities and Exchange Commission) protects investors, maintains fair markets, and facilitates capital formation. Investor.gov provides free educational resources on saving and investing.",
  },
  {
    trigger: /\b401k\b|401\s*k\b/i,
    title: "IRS — 401(k) Plans",
    url: "https://www.irs.gov/retirement-plans/401k-plans",
    domain: "irs.gov",
    text: "A 401(k) is an employer-sponsored retirement plan that lets you save from your paycheck, often with employer match. Contributions may be tax-deferred (traditional) or after-tax (Roth).",
  },
  {
    trigger: /\broth\s+ira\b|roth\s+ira\b/i,
    title: "IRS — Roth IRAs",
    url: "https://www.irs.gov/retirement-plans/roth-iras",
    domain: "irs.gov",
    text: "A Roth IRA is a retirement account where you contribute after-tax money; qualified withdrawals in retirement are tax-free. Income limits and contribution limits apply.",
  },
  {
    trigger: /\bcompound\s+interest\b|compounding/i,
    title: "SEC — Compound Interest",
    url: "https://www.investor.gov/additional-resources/general-resources/publications-resources/savings-calculator",
    domain: "investor.gov",
    text: "Compound interest means earning returns on your initial investment plus on past earnings. Over time it can grow savings significantly; the SEC and Investor.gov provide calculators and education.",
  },
];

/**
 * Retrieve excerpts and citations from approved sources only.
 * - Prefers Tier 1. Fills with Tier 2 only if needed.
 * - If requireTier1ForTax and query is tax/legal and no Tier 1 found, sets tier1RequiredNotMet and returns empty/minimal.
 * - State-aware: when userState is provided, that state's official domains count as Tier 1 for this request.
 */
export function retrieveApproved(options: RetrieveApprovedOptions): RetrieveApprovedResult {
  const {
    query,
    userState,
    maxSources = 5,
    requireTier1ForTax = true,
  } = options;

  const stateDomains = userState ? getStateDomains(userState) : [];
  const tier1Domains = getTier1DomainsForState(userState);
  const isTaxLegal = isTaxOrLegalQuery(query);

  const excerpts: RetrievalExcerpt[] = [];
  const seenUrls = new Set<string>();

  // Static fallback: match query to canned excerpts (all from approved Tier 1)
  for (const ex of STATIC_EXCERPTS) {
    if (excerpts.length >= maxSources) break;
    if (!ex.trigger.test(query)) continue;
    if (seenUrls.has(ex.url)) continue;
    const tier = getTierForUrl(ex.url, stateDomains);
    if (tier === null) continue;
    seenUrls.add(ex.url);
    excerpts.push({
      text: ex.text,
      title: ex.title,
      url: ex.url,
      domain: ex.domain,
      tier: tier as 1 | 2,
    });
  }

  const hasTier1 = excerpts.some((e) => e.tier === 1);
  if (requireTier1ForTax && isTaxLegal && !hasTier1 && excerpts.length > 0) {
    return {
      excerpts: [],
      citations: [],
      tier1RequiredNotMet: true,
    };
  }

  // Enforcement: state tax queries with userState require at least one state Tier 1 source
  const stateTaxQuery = isStateTaxQuery(query);
  if (userState && stateTaxQuery && stateDomains.length > 0) {
    const stateDomainSet = new Set(stateDomains.map((d) => normalizeDomain(d)));
    const hasStateTier1 = excerpts.some((e) => stateDomainSet.has(e.domain));
    if (!hasStateTier1) {
      return {
        excerpts: [],
        citations: [],
        stateTier1RequiredNotMet: true,
      };
    }
  }

  const citations: RetrievalCitation[] = excerpts.map((e) => ({
    title: e.title,
    url: e.url,
    domain: e.domain,
    tier: e.tier,
  }));

  return { excerpts, citations };
}

/**
 * Validate that a list of URLs are all approved (e.g. for lesson citations).
 */
export function validateUrlsApproved(
  urls: string[],
  stateCode?: string
): EnforceResult {
  return enforceApprovedSources(urls, stateCode);
}
