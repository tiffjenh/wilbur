/**
 * Single source-of-truth for approved educational sources.
 * Used by: /api/wilbur, lesson content, retrieval, validation.
 */
import { getStateDomains } from "./stateDomains";

/** Tier 1: Primary (government, regulators). Prefer these for tax/legal. */
export const TIER1_DOMAINS: readonly string[] = [
  "irs.gov",
  "sec.gov",
  "investor.gov",
  "finra.org",
  "fdic.gov",
  "consumerfinance.gov",
  "federalreserve.gov",
  "treasury.gov",
  "ssa.gov",
  "healthcare.gov",
  "cms.gov",
  "bls.gov",
  "ncua.gov",
  "studentaid.gov",
  "usa.gov",
  "cfpb.gov", // alias
  // State domains are added per-request via stateDomains.ts
] as const;

/** Tier 2: Secondary (reputable explainers). Never sole source for tax/legal. */
export const TIER2_DOMAINS: readonly string[] = [
  "investopedia.com",
  "bogleheads.org",
] as const;

export const APPROVED_TIERS = {
  tier1: [...TIER1_DOMAINS],
  tier2: [...TIER2_DOMAINS],
} as const;

/** Domains we never cite. */
export const DISALLOWED_DOMAINS: readonly string[] = [
  "reddit.com",
  "twitter.com",
  "x.com",
  "facebook.com",
  "youtube.com",
  "tiktok.com",
  "medium.com",
  "substack.com",
  "blogspot.com",
  "wordpress.com",
  "quora.com",
  "yahoo.com",
  "marketwatch.com", // can be opinion; use primary for rules
  "cnbc.com",
  "bloomberg.com",
  "forbes.com",
  "motleyfool.com",
  "seekingalpha.com",
] as const;

const tier1Set = new Set(TIER1_DOMAINS.map((d) => d.toLowerCase()));
const tier2Set = new Set(TIER2_DOMAINS.map((d) => d.toLowerCase()));
const disallowedSet = new Set(DISALLOWED_DOMAINS.map((d) => d.toLowerCase()));

/**
 * Normalize URL to a comparable domain (hostname, lowercased, no www).
 */
export function normalizeDomain(url: string): string {
  try {
    const u = new URL(url.startsWith("http") ? url : `https://${url}`);
    let host = u.hostname.toLowerCase();
    if (host.startsWith("www.")) host = host.slice(4);
    return host;
  } catch {
    return "";
  }
}

/**
 * True if the URL's domain is in Tier 1 or Tier 2 and not disallowed.
 */
export function isApprovedUrl(url: string, stateDomains: string[] = []): boolean {
  const domain = normalizeDomain(url);
  if (!domain) return false;
  if (disallowedSet.has(domain)) return false;
  if (tier1Set.has(domain) || tier2Set.has(domain)) return true;
  if (stateDomains.some((d) => normalizeDomain(d) === domain)) return true;
  return false;
}

/**
 * 1 = primary, 2 = secondary, null = not approved.
 */
export function getTierForUrl(url: string, stateDomains: string[] = []): 1 | 2 | null {
  const domain = normalizeDomain(url);
  if (!domain || disallowedSet.has(domain)) return null;
  if (tier1Set.has(domain)) return 1;
  if (stateDomains.some((d) => normalizeDomain(d) === domain)) return 1;
  if (tier2Set.has(domain)) return 2;
  return null;
}

export interface EnforceResult {
  approved: string[];
  rejected: string[];
}

/**
 * Split a list of URLs into approved vs rejected (by domain).
 */
export function enforceApprovedSources(
  urls: string[],
  stateCode?: string
): EnforceResult {
  const stateDomains = stateCode ? getStateDomains(stateCode) : [];
  const approved: string[] = [];
  const rejected: string[] = [];
  for (const u of urls) {
    const url = typeof u === "string" ? u : (u as { url?: string }).url;
    if (!url) continue;
    if (isApprovedUrl(url, stateDomains)) approved.push(url);
    else rejected.push(url);
  }
  return { approved, rejected };
}

/**
 * All Tier 1 domains including optional state domains for a given state.
 */
export function getTier1DomainsForState(stateCode?: string): string[] {
  const list = [...TIER1_DOMAINS];
  if (stateCode) list.push(...getStateDomains(stateCode));
  return list;
}
