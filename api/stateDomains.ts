/**
 * State → official tax domains (Tier 1). Keep in sync with src/content/sources/stateDomains.ts
 */
export const STATE_TAX_DOMAINS: Record<string, string[]> = {
  AL: ["revenue.alabama.gov"], AK: ["tax.alaska.gov"], AZ: ["azdor.gov"], AR: ["dfa.arkansas.gov"],
  CA: ["ftb.ca.gov"], CO: ["tax.colorado.gov"], CT: ["portal.ct.gov/DRS"], DE: ["revenue.delaware.gov"],
  FL: ["floridarevenue.com"], GA: ["dor.georgia.gov"], HI: ["tax.hawaii.gov"], ID: ["tax.idaho.gov"],
  IL: ["tax.illinois.gov"], IN: ["dor.in.gov"], IA: ["tax.iowa.gov"], KS: ["ksrevenue.gov"],
  KY: ["revenue.ky.gov"], LA: ["revenue.louisiana.gov"], ME: ["maine.gov/revenue"], MD: ["marylandtaxes.gov"],
  MA: ["mass.gov/orgs/massachusetts-department-of-revenue"], MI: ["michigan.gov/taxes"], MN: ["revenue.state.mn.us"],
  MS: ["dor.ms.gov"], MO: ["dor.mo.gov"], MT: ["mtrevenue.gov"], NE: ["revenue.nebraska.gov"],
  NV: ["tax.nv.gov"], NH: ["revenue.nh.gov"], NJ: ["nj.gov/treasury/taxation"], NM: ["tax.newmexico.gov"],
  NY: ["tax.ny.gov"], NC: ["ncdor.gov"], ND: ["tax.nd.gov"], OH: ["tax.ohio.gov"],
  OK: ["oklahoma.gov/tax"], OR: ["oregon.gov/dor"], PA: ["revenue.pa.gov"], RI: ["tax.ri.gov"],
  SC: ["dor.sc.gov"], SD: ["dor.sd.gov"], TN: ["tn.gov/revenue"], TX: ["comptroller.texas.gov"],
  UT: ["tax.utah.gov"], VT: ["tax.vermont.gov"], VA: ["tax.virginia.gov"], WA: ["dor.wa.gov"],
  WV: ["tax.wv.gov"], WI: ["revenue.wi.gov"], WY: ["revenue.wyo.gov"], DC: ["otr.cfo.dc.gov"],
};

function normalize(host: string): string {
  const lower = host.toLowerCase().replace(/^www\./, "");
  return lower;
}

export function getStateDomains(stateCode: string): string[] {
  const code = stateCode?.toUpperCase().trim();
  if (!code || code === "PREFER_NOT") return [];
  return STATE_TAX_DOMAINS[code] ?? [];
}
