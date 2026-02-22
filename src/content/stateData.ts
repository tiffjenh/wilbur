/**
 * US State data for personalization engine.
 * Determines state income tax presence and official resource URLs.
 */

export interface StateProfile {
  stateCode: string;
  stateName: string;
  hasStateIncomeTax: boolean;
  stateTaxAgencyUrl: string;
  stateTaxAgencyName: string;
  notes?: string;
}

export const STATE_DATA: Record<string, StateProfile> = {
  AL: { stateCode: "AL", stateName: "Alabama",             hasStateIncomeTax: true,  stateTaxAgencyName: "Alabama Department of Revenue",          stateTaxAgencyUrl: "https://www.revenue.alabama.gov" },
  AK: { stateCode: "AK", stateName: "Alaska",              hasStateIncomeTax: false, stateTaxAgencyName: "Alaska Department of Revenue",           stateTaxAgencyUrl: "https://www.revenue.alaska.gov",       notes: "No state income tax" },
  AZ: { stateCode: "AZ", stateName: "Arizona",             hasStateIncomeTax: true,  stateTaxAgencyName: "Arizona Department of Revenue",          stateTaxAgencyUrl: "https://azdor.gov" },
  AR: { stateCode: "AR", stateName: "Arkansas",            hasStateIncomeTax: true,  stateTaxAgencyName: "Arkansas Department of Finance & Administration", stateTaxAgencyUrl: "https://www.dfa.arkansas.gov" },
  CA: { stateCode: "CA", stateName: "California",          hasStateIncomeTax: true,  stateTaxAgencyName: "California Franchise Tax Board",         stateTaxAgencyUrl: "https://www.ftb.ca.gov" },
  CO: { stateCode: "CO", stateName: "Colorado",            hasStateIncomeTax: true,  stateTaxAgencyName: "Colorado Department of Revenue",         stateTaxAgencyUrl: "https://tax.colorado.gov" },
  CT: { stateCode: "CT", stateName: "Connecticut",         hasStateIncomeTax: true,  stateTaxAgencyName: "Connecticut Department of Revenue Services", stateTaxAgencyUrl: "https://portal.ct.gov/DRS" },
  DE: { stateCode: "DE", stateName: "Delaware",            hasStateIncomeTax: true,  stateTaxAgencyName: "Delaware Division of Revenue",           stateTaxAgencyUrl: "https://revenue.delaware.gov" },
  FL: { stateCode: "FL", stateName: "Florida",             hasStateIncomeTax: false, stateTaxAgencyName: "Florida Department of Revenue",          stateTaxAgencyUrl: "https://floridarevenue.com",           notes: "No state income tax" },
  GA: { stateCode: "GA", stateName: "Georgia",             hasStateIncomeTax: true,  stateTaxAgencyName: "Georgia Department of Revenue",          stateTaxAgencyUrl: "https://dor.georgia.gov" },
  HI: { stateCode: "HI", stateName: "Hawaii",              hasStateIncomeTax: true,  stateTaxAgencyName: "Hawaii Department of Taxation",          stateTaxAgencyUrl: "https://tax.hawaii.gov" },
  ID: { stateCode: "ID", stateName: "Idaho",               hasStateIncomeTax: true,  stateTaxAgencyName: "Idaho State Tax Commission",             stateTaxAgencyUrl: "https://tax.idaho.gov" },
  IL: { stateCode: "IL", stateName: "Illinois",            hasStateIncomeTax: true,  stateTaxAgencyName: "Illinois Department of Revenue",         stateTaxAgencyUrl: "https://www2.illinois.gov/rev" },
  IN: { stateCode: "IN", stateName: "Indiana",             hasStateIncomeTax: true,  stateTaxAgencyName: "Indiana Department of Revenue",          stateTaxAgencyUrl: "https://www.in.gov/dor" },
  IA: { stateCode: "IA", stateName: "Iowa",                hasStateIncomeTax: true,  stateTaxAgencyName: "Iowa Department of Revenue",             stateTaxAgencyUrl: "https://tax.iowa.gov" },
  KS: { stateCode: "KS", stateName: "Kansas",              hasStateIncomeTax: true,  stateTaxAgencyName: "Kansas Department of Revenue",           stateTaxAgencyUrl: "https://www.ksrevenue.gov" },
  KY: { stateCode: "KY", stateName: "Kentucky",            hasStateIncomeTax: true,  stateTaxAgencyName: "Kentucky Department of Revenue",         stateTaxAgencyUrl: "https://revenue.ky.gov" },
  LA: { stateCode: "LA", stateName: "Louisiana",           hasStateIncomeTax: true,  stateTaxAgencyName: "Louisiana Department of Revenue",        stateTaxAgencyUrl: "https://www.revenue.louisiana.gov" },
  ME: { stateCode: "ME", stateName: "Maine",               hasStateIncomeTax: true,  stateTaxAgencyName: "Maine Revenue Services",                 stateTaxAgencyUrl: "https://www.maine.gov/revenue" },
  MD: { stateCode: "MD", stateName: "Maryland",            hasStateIncomeTax: true,  stateTaxAgencyName: "Maryland Comptroller of Maryland",       stateTaxAgencyUrl: "https://www.marylandtaxes.gov" },
  MA: { stateCode: "MA", stateName: "Massachusetts",       hasStateIncomeTax: true,  stateTaxAgencyName: "Massachusetts Department of Revenue",    stateTaxAgencyUrl: "https://www.mass.gov/orgs/massachusetts-department-of-revenue" },
  MI: { stateCode: "MI", stateName: "Michigan",            hasStateIncomeTax: true,  stateTaxAgencyName: "Michigan Department of Treasury",        stateTaxAgencyUrl: "https://www.michigan.gov/treasury" },
  MN: { stateCode: "MN", stateName: "Minnesota",           hasStateIncomeTax: true,  stateTaxAgencyName: "Minnesota Department of Revenue",        stateTaxAgencyUrl: "https://www.revenue.state.mn.us" },
  MS: { stateCode: "MS", stateName: "Mississippi",         hasStateIncomeTax: true,  stateTaxAgencyName: "Mississippi Department of Revenue",      stateTaxAgencyUrl: "https://www.dor.ms.gov" },
  MO: { stateCode: "MO", stateName: "Missouri",            hasStateIncomeTax: true,  stateTaxAgencyName: "Missouri Department of Revenue",         stateTaxAgencyUrl: "https://dor.mo.gov" },
  MT: { stateCode: "MT", stateName: "Montana",             hasStateIncomeTax: true,  stateTaxAgencyName: "Montana Department of Revenue",          stateTaxAgencyUrl: "https://mtrevenue.gov" },
  NE: { stateCode: "NE", stateName: "Nebraska",            hasStateIncomeTax: true,  stateTaxAgencyName: "Nebraska Department of Revenue",         stateTaxAgencyUrl: "https://revenue.nebraska.gov" },
  NV: { stateCode: "NV", stateName: "Nevada",              hasStateIncomeTax: false, stateTaxAgencyName: "Nevada Department of Taxation",          stateTaxAgencyUrl: "https://tax.nv.gov",                   notes: "No state income tax" },
  NH: { stateCode: "NH", stateName: "New Hampshire",       hasStateIncomeTax: false, stateTaxAgencyName: "New Hampshire Department of Revenue Administration", stateTaxAgencyUrl: "https://www.revenue.nh.gov", notes: "No wage income tax" },
  NJ: { stateCode: "NJ", stateName: "New Jersey",          hasStateIncomeTax: true,  stateTaxAgencyName: "New Jersey Division of Taxation",        stateTaxAgencyUrl: "https://www.njtaxation.org" },
  NM: { stateCode: "NM", stateName: "New Mexico",          hasStateIncomeTax: true,  stateTaxAgencyName: "New Mexico Taxation & Revenue Department", stateTaxAgencyUrl: "https://www.tax.newmexico.gov" },
  NY: { stateCode: "NY", stateName: "New York",            hasStateIncomeTax: true,  stateTaxAgencyName: "New York Department of Taxation and Finance", stateTaxAgencyUrl: "https://www.tax.ny.gov" },
  NC: { stateCode: "NC", stateName: "North Carolina",      hasStateIncomeTax: true,  stateTaxAgencyName: "North Carolina Department of Revenue",   stateTaxAgencyUrl: "https://www.ncdor.gov" },
  ND: { stateCode: "ND", stateName: "North Dakota",        hasStateIncomeTax: true,  stateTaxAgencyName: "North Dakota Office of State Tax Commissioner", stateTaxAgencyUrl: "https://www.nd.gov/tax" },
  OH: { stateCode: "OH", stateName: "Ohio",                hasStateIncomeTax: true,  stateTaxAgencyName: "Ohio Department of Taxation",            stateTaxAgencyUrl: "https://tax.ohio.gov" },
  OK: { stateCode: "OK", stateName: "Oklahoma",            hasStateIncomeTax: true,  stateTaxAgencyName: "Oklahoma Tax Commission",                stateTaxAgencyUrl: "https://www.oktax.state.ok.us" },
  OR: { stateCode: "OR", stateName: "Oregon",              hasStateIncomeTax: true,  stateTaxAgencyName: "Oregon Department of Revenue",           stateTaxAgencyUrl: "https://www.oregon.gov/dor" },
  PA: { stateCode: "PA", stateName: "Pennsylvania",        hasStateIncomeTax: true,  stateTaxAgencyName: "Pennsylvania Department of Revenue",     stateTaxAgencyUrl: "https://www.revenue.pa.gov" },
  RI: { stateCode: "RI", stateName: "Rhode Island",        hasStateIncomeTax: true,  stateTaxAgencyName: "Rhode Island Division of Taxation",      stateTaxAgencyUrl: "https://tax.ri.gov" },
  SC: { stateCode: "SC", stateName: "South Carolina",      hasStateIncomeTax: true,  stateTaxAgencyName: "South Carolina Department of Revenue",   stateTaxAgencyUrl: "https://dor.sc.gov" },
  SD: { stateCode: "SD", stateName: "South Dakota",        hasStateIncomeTax: false, stateTaxAgencyName: "South Dakota Department of Revenue",     stateTaxAgencyUrl: "https://dor.sd.gov",                   notes: "No state income tax" },
  TN: { stateCode: "TN", stateName: "Tennessee",           hasStateIncomeTax: false, stateTaxAgencyName: "Tennessee Department of Revenue",        stateTaxAgencyUrl: "https://www.tn.gov/revenue",           notes: "No state income tax since 2021" },
  TX: { stateCode: "TX", stateName: "Texas",               hasStateIncomeTax: false, stateTaxAgencyName: "Texas Comptroller of Public Accounts",   stateTaxAgencyUrl: "https://comptroller.texas.gov",        notes: "No state income tax" },
  UT: { stateCode: "UT", stateName: "Utah",                hasStateIncomeTax: true,  stateTaxAgencyName: "Utah State Tax Commission",              stateTaxAgencyUrl: "https://tax.utah.gov" },
  VT: { stateCode: "VT", stateName: "Vermont",             hasStateIncomeTax: true,  stateTaxAgencyName: "Vermont Department of Taxes",            stateTaxAgencyUrl: "https://tax.vermont.gov" },
  VA: { stateCode: "VA", stateName: "Virginia",            hasStateIncomeTax: true,  stateTaxAgencyName: "Virginia Department of Taxation",        stateTaxAgencyUrl: "https://www.tax.virginia.gov" },
  WA: { stateCode: "WA", stateName: "Washington",          hasStateIncomeTax: false, stateTaxAgencyName: "Washington Department of Revenue",       stateTaxAgencyUrl: "https://dor.wa.gov",                   notes: "No income tax on wages" },
  WV: { stateCode: "WV", stateName: "West Virginia",       hasStateIncomeTax: true,  stateTaxAgencyName: "West Virginia State Tax Department",     stateTaxAgencyUrl: "https://tax.wv.gov" },
  WI: { stateCode: "WI", stateName: "Wisconsin",           hasStateIncomeTax: true,  stateTaxAgencyName: "Wisconsin Department of Revenue",        stateTaxAgencyUrl: "https://www.revenue.wi.gov" },
  WY: { stateCode: "WY", stateName: "Wyoming",             hasStateIncomeTax: false, stateTaxAgencyName: "Wyoming Department of Revenue",          stateTaxAgencyUrl: "https://revenue.wyo.gov",              notes: "No state income tax" },
  DC: { stateCode: "DC", stateName: "Washington D.C.",     hasStateIncomeTax: true,  stateTaxAgencyName: "DC Office of Tax and Revenue",           stateTaxAgencyUrl: "https://otr.cfo.dc.gov" },
};

/** Sorted list for dropdown display */
export const STATE_OPTIONS = Object.values(STATE_DATA).sort((a, b) =>
  a.stateName.localeCompare(b.stateName),
);

/** Lookup state profile by code. Returns null if not found. */
export function getStateProfile(code: string): StateProfile | null {
  return STATE_DATA[code.toUpperCase()] ?? null;
}
