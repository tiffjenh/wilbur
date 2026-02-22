/**
 * Paycheck breakdown estimates (federal/state tax, 401k, take-home).
 * Simple progressive estimates only — not exact IRS/state calculations.
 * Educational use only. Cite IRS and state tax agency.
 */

export interface PaycheckInputs {
  annualSalary: number;
  contribution401kPct: number;
  stateCode: string;
  filingStatus: "single" | "married";
  is1099: boolean;
}

export interface PaycheckResult {
  grossAnnual: number;
  federalTax: number;
  stateTax: number;
  deduction401k: number;
  netTakeHome: number;
  /** For bar/pie: label + value in dollars */
  breakdown: { label: string; value: number; color?: string }[];
}

/** Simplified 2024-style federal brackets (single). Not exact — for education only. */
const FEDERAL_BRACKETS_SINGLE = [
  { max: 11600, rate: 0.10 },
  { max: 47150, rate: 0.12 },
  { max: 100525, rate: 0.22 },
  { max: 191950, rate: 0.24 },
  { max: 243725, rate: 0.32 },
  { max: 609350, rate: 0.35 },
  { max: Infinity, rate: 0.37 },
];

/** Married filing jointly — approximate. */
const FEDERAL_BRACKETS_MARRIED = [
  { max: 23200, rate: 0.10 },
  { max: 94300, rate: 0.12 },
  { max: 201050, rate: 0.22 },
  { max: 383900, rate: 0.24 },
  { max: 487450, rate: 0.32 },
  { max: 731200, rate: 0.35 },
  { max: Infinity, rate: 0.37 },
];

function federalTax(taxable: number, filingStatus: "single" | "married"): number {
  const brackets = filingStatus === "married" ? FEDERAL_BRACKETS_MARRIED : FEDERAL_BRACKETS_SINGLE;
  let tax = 0;
  let prev = 0;
  for (const { max, rate } of brackets) {
    if (taxable <= prev) break;
    const slice = Math.min(taxable, max) - prev;
    tax += slice * rate;
    prev = max;
  }
  return Math.round(tax);
}

/** State tax: very simplified. Assume flat ~5% of taxable for states that have income tax; 0 for no income tax. */
function stateTaxEstimate(taxable: number, stateCode: string): number {
  const noTaxStates = ["AK", "FL", "NV", "NH", "SD", "TN", "TX", "WA", "WY"];
  if (noTaxStates.includes(stateCode.toUpperCase())) return 0;
  const rate = 0.05;
  return Math.round(taxable * rate);
}

export function paycheckBreakdown(inputs: PaycheckInputs): PaycheckResult {
  const { annualSalary, contribution401kPct, stateCode, filingStatus, is1099 } = inputs;
  const deduction401k = Math.round(annualSalary * (contribution401kPct / 100));
  const taxable = is1099 ? annualSalary : annualSalary - deduction401k;

  const federal = federalTax(taxable, filingStatus);
  const state = stateTaxEstimate(taxable, stateCode);

  const netTakeHome = annualSalary - deduction401k - federal - state;

  const breakdown = [
    { label: "Take-home", value: Math.max(0, netTakeHome), color: "#0E5C4C" },
    { label: "Federal tax", value: federal, color: "#4A9B8A" },
    { label: "State tax", value: state, color: "#8FD4C6" },
    { label: "401(k)", value: deduction401k, color: "#C4EAE5" },
  ].filter((d) => d.value > 0);

  return {
    grossAnnual: annualSalary,
    federalTax: federal,
    stateTax: state,
    deduction401k,
    netTakeHome: Math.max(0, netTakeHome),
    breakdown,
  };
}
