// MVP: just "has income tax" boolean + official URL.
// You can expand later with brackets/credits/etc.
export type StateTaxProfile = {
  stateCode: string;            // "CA"
  hasStateIncomeTax: boolean;   // true/false
  stateTaxAgencyUrl: string;    // official site
};

export const STATE_TAX: Record<string, StateTaxProfile> = {
  AL: { stateCode: "AL", hasStateIncomeTax: true,  stateTaxAgencyUrl: "https://www.revenue.alabama.gov" },
  AK: { stateCode: "AK", hasStateIncomeTax: false, stateTaxAgencyUrl: "https://www.revenue.alaska.gov" },
  AZ: { stateCode: "AZ", hasStateIncomeTax: true,  stateTaxAgencyUrl: "https://azdor.gov" },
  AR: { stateCode: "AR", hasStateIncomeTax: true,  stateTaxAgencyUrl: "https://www.dfa.arkansas.gov" },
  CA: { stateCode: "CA", hasStateIncomeTax: true,  stateTaxAgencyUrl: "https://www.ftb.ca.gov/" },
  CO: { stateCode: "CO", hasStateIncomeTax: true,  stateTaxAgencyUrl: "https://tax.colorado.gov" },
  CT: { stateCode: "CT", hasStateIncomeTax: true,  stateTaxAgencyUrl: "https://portal.ct.gov/DRS" },
  DE: { stateCode: "DE", hasStateIncomeTax: true,  stateTaxAgencyUrl: "https://revenue.delaware.gov" },
  FL: { stateCode: "FL", hasStateIncomeTax: false, stateTaxAgencyUrl: "https://floridarevenue.com" },
  GA: { stateCode: "GA", hasStateIncomeTax: true,  stateTaxAgencyUrl: "https://dor.georgia.gov" },
  HI: { stateCode: "HI", hasStateIncomeTax: true,  stateTaxAgencyUrl: "https://tax.hawaii.gov" },
  ID: { stateCode: "ID", hasStateIncomeTax: true,  stateTaxAgencyUrl: "https://tax.idaho.gov" },
  IL: { stateCode: "IL", hasStateIncomeTax: true,  stateTaxAgencyUrl: "https://www2.illinois.gov/rev" },
  IN: { stateCode: "IN", hasStateIncomeTax: true,  stateTaxAgencyUrl: "https://www.in.gov/dor" },
  IA: { stateCode: "IA", hasStateIncomeTax: true,  stateTaxAgencyUrl: "https://tax.iowa.gov" },
  KS: { stateCode: "KS", hasStateIncomeTax: true,  stateTaxAgencyUrl: "https://www.ksrevenue.gov" },
  KY: { stateCode: "KY", hasStateIncomeTax: true,  stateTaxAgencyUrl: "https://revenue.ky.gov" },
  LA: { stateCode: "LA", hasStateIncomeTax: true,  stateTaxAgencyUrl: "https://www.revenue.louisiana.gov" },
  ME: { stateCode: "ME", hasStateIncomeTax: true,  stateTaxAgencyUrl: "https://www.maine.gov/revenue" },
  MD: { stateCode: "MD", hasStateIncomeTax: true,  stateTaxAgencyUrl: "https://www.marylandtaxes.gov" },
  MA: { stateCode: "MA", hasStateIncomeTax: true,  stateTaxAgencyUrl: "https://www.mass.gov/orgs/massachusetts-department-of-revenue" },
  MI: { stateCode: "MI", hasStateIncomeTax: true,  stateTaxAgencyUrl: "https://www.michigan.gov/treasury" },
  MN: { stateCode: "MN", hasStateIncomeTax: true,  stateTaxAgencyUrl: "https://www.revenue.state.mn.us" },
  MS: { stateCode: "MS", hasStateIncomeTax: true,  stateTaxAgencyUrl: "https://www.dor.ms.gov" },
  MO: { stateCode: "MO", hasStateIncomeTax: true,  stateTaxAgencyUrl: "https://dor.mo.gov" },
  MT: { stateCode: "MT", hasStateIncomeTax: true,  stateTaxAgencyUrl: "https://mtrevenue.gov" },
  NE: { stateCode: "NE", hasStateIncomeTax: true,  stateTaxAgencyUrl: "https://revenue.nebraska.gov" },
  NV: { stateCode: "NV", hasStateIncomeTax: false, stateTaxAgencyUrl: "https://tax.nv.gov" },
  NH: { stateCode: "NH", hasStateIncomeTax: false, stateTaxAgencyUrl: "https://www.revenue.nh.gov" },
  NJ: { stateCode: "NJ", hasStateIncomeTax: true,  stateTaxAgencyUrl: "https://www.njtaxation.org" },
  NM: { stateCode: "NM", hasStateIncomeTax: true,  stateTaxAgencyUrl: "https://www.tax.newmexico.gov" },
  NY: { stateCode: "NY", hasStateIncomeTax: true,  stateTaxAgencyUrl: "https://www.tax.ny.gov" },
  NC: { stateCode: "NC", hasStateIncomeTax: true,  stateTaxAgencyUrl: "https://www.ncdor.gov" },
  ND: { stateCode: "ND", hasStateIncomeTax: true,  stateTaxAgencyUrl: "https://www.nd.gov/tax" },
  OH: { stateCode: "OH", hasStateIncomeTax: true,  stateTaxAgencyUrl: "https://tax.ohio.gov" },
  OK: { stateCode: "OK", hasStateIncomeTax: true,  stateTaxAgencyUrl: "https://www.oktax.state.ok.us" },
  OR: { stateCode: "OR", hasStateIncomeTax: true,  stateTaxAgencyUrl: "https://www.oregon.gov/dor" },
  PA: { stateCode: "PA", hasStateIncomeTax: true,  stateTaxAgencyUrl: "https://www.revenue.pa.gov" },
  RI: { stateCode: "RI", hasStateIncomeTax: true,  stateTaxAgencyUrl: "https://tax.ri.gov" },
  SC: { stateCode: "SC", hasStateIncomeTax: true,  stateTaxAgencyUrl: "https://dor.sc.gov" },
  SD: { stateCode: "SD", hasStateIncomeTax: false, stateTaxAgencyUrl: "https://dor.sd.gov" },
  TN: { stateCode: "TN", hasStateIncomeTax: false, stateTaxAgencyUrl: "https://www.tn.gov/revenue" },
  TX: { stateCode: "TX", hasStateIncomeTax: false, stateTaxAgencyUrl: "https://comptroller.texas.gov/" },
  UT: { stateCode: "UT", hasStateIncomeTax: true,  stateTaxAgencyUrl: "https://tax.utah.gov" },
  VT: { stateCode: "VT", hasStateIncomeTax: true,  stateTaxAgencyUrl: "https://tax.vermont.gov" },
  VA: { stateCode: "VA", hasStateIncomeTax: true,  stateTaxAgencyUrl: "https://www.tax.virginia.gov" },
  WA: { stateCode: "WA", hasStateIncomeTax: false, stateTaxAgencyUrl: "https://dor.wa.gov/" },
  WV: { stateCode: "WV", hasStateIncomeTax: true,  stateTaxAgencyUrl: "https://tax.wv.gov" },
  WI: { stateCode: "WI", hasStateIncomeTax: true,  stateTaxAgencyUrl: "https://www.revenue.wi.gov" },
  WY: { stateCode: "WY", hasStateIncomeTax: false, stateTaxAgencyUrl: "https://revenue.wyo.gov" },
  DC: { stateCode: "DC", hasStateIncomeTax: true,  stateTaxAgencyUrl: "https://otr.cfo.dc.gov" },
};

export function getStateTaxProfile(stateCode: string): StateTaxProfile | null {
  return STATE_TAX[stateCode.toUpperCase()] ?? null;
}
