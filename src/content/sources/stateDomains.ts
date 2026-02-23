/**
 * State → official tax/finance agency domains (Tier 1 primary sources).
 * Used for state-aware retrieval and citation validation.
 *
 * Implementation tip (retrieval): When userState is set and the query includes
 * income tax, deductions, state tax, filing, capital gains, add site: filters
 * for the state domain(s) and site:irs.gov.
 *
 * Enforcement rule: When the query contains state income tax, state capital gains,
 * state deductions, or "filing in [state]", require at least 1 IRS source and
 * 1 state Tier 1 source. If no Tier 1 state result is found, do not answer from
 * Tier 2 (e.g. Investopedia); say "I couldn't verify this from the official state source."
 */

export const STATE_TAX_DOMAINS: Record<string, string[]> = {
  AL: ["revenue.alabama.gov"],
  AK: ["tax.alaska.gov"],
  AZ: ["azdor.gov"],
  AR: ["dfa.arkansas.gov"],
  CA: ["ftb.ca.gov"],
  CO: ["tax.colorado.gov"],
  CT: ["portal.ct.gov/DRS"],
  DE: ["revenue.delaware.gov"],
  FL: ["floridarevenue.com"],
  GA: ["dor.georgia.gov"],
  HI: ["tax.hawaii.gov"],
  ID: ["tax.idaho.gov"],
  IL: ["tax.illinois.gov"],
  IN: ["dor.in.gov"],
  IA: ["tax.iowa.gov"],
  KS: ["ksrevenue.gov"],
  KY: ["revenue.ky.gov"],
  LA: ["revenue.louisiana.gov"],
  ME: ["maine.gov/revenue"],
  MD: ["marylandtaxes.gov"],
  MA: ["mass.gov/orgs/massachusetts-department-of-revenue"],
  MI: ["michigan.gov/taxes"],
  MN: ["revenue.state.mn.us"],
  MS: ["dor.ms.gov"],
  MO: ["dor.mo.gov"],
  MT: ["mtrevenue.gov"],
  NE: ["revenue.nebraska.gov"],
  NV: ["tax.nv.gov"],
  NH: ["revenue.nh.gov"],
  NJ: ["nj.gov/treasury/taxation"],
  NM: ["tax.newmexico.gov"],
  NY: ["tax.ny.gov"],
  NC: ["ncdor.gov"],
  ND: ["tax.nd.gov"],
  OH: ["tax.ohio.gov"],
  OK: ["oklahoma.gov/tax"],
  OR: ["oregon.gov/dor"],
  PA: ["revenue.pa.gov"],
  RI: ["tax.ri.gov"],
  SC: ["dor.sc.gov"],
  SD: ["dor.sd.gov"],
  TN: ["tn.gov/revenue"],
  TX: ["comptroller.texas.gov"],
  UT: ["tax.utah.gov"],
  VT: ["tax.vermont.gov"],
  VA: ["tax.virginia.gov"],
  WA: ["dor.wa.gov"],
  WV: ["tax.wv.gov"],
  WI: ["revenue.wi.gov"],
  WY: ["revenue.wyo.gov"],
  DC: ["otr.cfo.dc.gov"],
};

/** @deprecated Use STATE_TAX_DOMAINS. Kept for backward compatibility. */
export const STATE_TAX_FINANCE_DOMAINS = STATE_TAX_DOMAINS;

/**
 * States with no state income tax (on wages).
 * Still include them in STATE_TAX_DOMAINS so we can cite the official site when
 * answering e.g. "Does Washington have state income tax?" (sales, property, etc.).
 */
export const STATE_NO_INCOME_TAX: readonly string[] = [
  "AK", "FL", "NV", "NH", "SD", "TN", "TX", "WA", "WY",
] as const;

/** State code → display name for citations (e.g. "According to the California Franchise Tax Board…"). */
export const STATE_NAMES: Record<string, string> = {
  AL: "Alabama",
  AK: "Alaska",
  AZ: "Arizona",
  AR: "Arkansas",
  CA: "California",
  CO: "Colorado",
  CT: "Connecticut",
  DE: "Delaware",
  FL: "Florida",
  GA: "Georgia",
  HI: "Hawaii",
  ID: "Idaho",
  IL: "Illinois",
  IN: "Indiana",
  IA: "Iowa",
  KS: "Kansas",
  KY: "Kentucky",
  LA: "Louisiana",
  ME: "Maine",
  MD: "Maryland",
  MA: "Massachusetts",
  MI: "Michigan",
  MN: "Minnesota",
  MS: "Mississippi",
  MO: "Missouri",
  MT: "Montana",
  NE: "Nebraska",
  NV: "Nevada",
  NH: "New Hampshire",
  NJ: "New Jersey",
  NM: "New Mexico",
  NY: "New York",
  NC: "North Carolina",
  ND: "North Dakota",
  OH: "Ohio",
  OK: "Oklahoma",
  OR: "Oregon",
  PA: "Pennsylvania",
  RI: "Rhode Island",
  SC: "South Carolina",
  SD: "South Dakota",
  TN: "Tennessee",
  TX: "Texas",
  UT: "Utah",
  VT: "Vermont",
  VA: "Virginia",
  WA: "Washington",
  WV: "West Virginia",
  WI: "Wisconsin",
  WY: "Wyoming",
  DC: "District of Columbia",
};

export function getStateDomains(stateCode: string): string[] {
  const code = stateCode?.toUpperCase().trim();
  if (!code || code === "PREFER_NOT") return [];
  return STATE_TAX_DOMAINS[code] ?? [];
}

/** Whether this state has no state income tax (on wages). NH taxes interest/dividends. */
export function isStateNoIncomeTax(stateCode: string): boolean {
  return STATE_NO_INCOME_TAX.includes(stateCode?.toUpperCase().trim() as (typeof STATE_NO_INCOME_TAX)[number]);
}
