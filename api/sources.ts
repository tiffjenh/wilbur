/**
 * Approved sources for Wilbur AI (serverless).
 * Keep in sync with src/content/sources/approvedSources.ts
 */
const TIER1 = new Set([
  "irs.gov", "sec.gov", "investor.gov", "finra.org", "fdic.gov",
  "consumerfinance.gov", "federalreserve.gov", "treasury.gov", "ssa.gov",
  "healthcare.gov", "cms.gov", "bls.gov", "ncua.gov", "studentaid.gov", "usa.gov",
]);
const TIER2 = new Set(["investopedia.com", "bogleheads.org"]);
const DISALLOWED = new Set([
  "reddit.com", "twitter.com", "x.com", "medium.com", "forbes.com", "cnbc.com",
  "marketwatch.com", "motleyfool.com", "seekingalpha.com",
]);

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

export function getTierForUrl(url: string): 1 | 2 | null {
  const d = normalizeDomain(url);
  if (!d || DISALLOWED.has(d)) return null;
  if (TIER1.has(d)) return 1;
  if (TIER2.has(d)) return 2;
  return null;
}

export const APPROVED_TIERS = { tier1: [...TIER1], tier2: [...TIER2] };
