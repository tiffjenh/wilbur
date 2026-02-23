/**
 * Retrieval from approved sources only (serverless).
 * Uses static excerpts; plug in Serper/Tavily/Bing with site: filters for production.
 */
import { getTierForUrl, normalizeDomain } from "./sources";
import { getStateDomains } from "./stateDomains";

const TAX_LEGAL = /tax|irs|withholding|deduction|credit|state\s+revenue|legal|regulation|sec\s+rule|fdic|cfpb/i;
const STATE_TAX_QUERY = /state\s+income\s+tax|state\s+capital\s+gains|state\s+deductions|filing\s+in\s+\[?state|state\s+tax\s+(?:rules?|rates?|filing)|(?:income\s+)?tax\s+in\s+my\s+state/i;

function isStateTaxQuery(query: string): boolean {
  return STATE_TAX_QUERY.test(query.trim()) || (TAX_LEGAL.test(query) && /\bstate\b/i.test(query.trim()));
}

export interface Excerpt {
  text: string;
  title: string;
  url: string;
  domain: string;
  tier: 1 | 2;
}

export interface Citation {
  title: string;
  url: string;
  domain: string;
  tier: 1 | 2;
}

const STATIC: Array<{ trigger: RegExp; title: string; url: string; text: string; domain: string }> = [
  { trigger: /\bfdic\b/i, title: "FDIC — Deposit Insurance", url: "https://www.fdic.gov/resources/deposit-insurance/", domain: "fdic.gov", text: "The FDIC protects depositors by insuring deposits up to $250,000 per depositor, per insured bank." },
  { trigger: /\bapy\b|annual\s+percentage\s+yield/i, title: "CFPB — Savings and APY", url: "https://www.consumerfinance.gov/consumer-tools/savings/", domain: "consumerfinance.gov", text: "APY (Annual Percentage Yield) is the rate you actually earn on savings in a year, including compound interest." },
  { trigger: /\bsec\b|securities\s+and\s+exchange/i, title: "SEC — Investor.gov", url: "https://www.investor.gov/", domain: "investor.gov", text: "The SEC protects investors and maintains fair markets. Investor.gov provides free educational resources." },
  { trigger: /\b401k\b|401\s*k\b/i, title: "IRS — 401(k) Plans", url: "https://www.irs.gov/retirement-plans/401k-plans", domain: "irs.gov", text: "A 401(k) is an employer-sponsored retirement plan. Contributions may be tax-deferred or Roth." },
  { trigger: /\broth\s+ira\b/i, title: "IRS — Roth IRAs", url: "https://www.irs.gov/retirement-plans/roth-iras", domain: "irs.gov", text: "A Roth IRA uses after-tax contributions; qualified withdrawals in retirement are tax-free." },
  { trigger: /\bcompound\s+interest\b|compounding/i, title: "SEC — Compound Interest", url: "https://www.investor.gov/", domain: "investor.gov", text: "Compound interest means earning returns on initial investment plus past earnings." },
];

export function retrieveApproved(opts: {
  query: string;
  userState?: string;
  maxSources?: number;
  requireTier1ForTax?: boolean;
}): { excerpts: Excerpt[]; citations: Citation[]; tier1RequiredNotMet?: boolean; stateTier1RequiredNotMet?: boolean } {
  const { query, userState, maxSources = 5, requireTier1ForTax = true } = opts;
  const stateDomains = userState ? getStateDomains(userState) : [];
  const excerpts: Excerpt[] = [];
  const seen = new Set<string>();

  for (const ex of STATIC) {
    if (excerpts.length >= maxSources) break;
    if (!ex.trigger.test(query) || seen.has(ex.url)) continue;
    const tier = getTierForUrl(ex.url);
    if (tier === null) continue;
    seen.add(ex.url);
    excerpts.push({
      text: ex.text,
      title: ex.title,
      url: ex.url,
      domain: ex.domain,
      tier: tier as 1 | 2,
    });
  }

  const hasTier1 = excerpts.some((e) => e.tier === 1);
  if (requireTier1ForTax && TAX_LEGAL.test(query) && !hasTier1 && excerpts.length > 0) {
    return { excerpts: [], citations: [], tier1RequiredNotMet: true };
  }

  // State tax query + userState: require at least one state Tier 1 source (do not answer from Investopedia alone)
  if (userState && stateDomains.length > 0 && isStateTaxQuery(query)) {
    const stateSet = new Set(stateDomains.map((d) => normalizeDomain(d)));
    const hasStateTier1 = excerpts.some((e) => stateSet.has(e.domain));
    if (!hasStateTier1) {
      return { excerpts: [], citations: [], stateTier1RequiredNotMet: true };
    }
  }

  const citations: Citation[] = excerpts.map((e) => ({ title: e.title, url: e.url, domain: e.domain, tier: e.tier }));
  return { excerpts, citations };
}
