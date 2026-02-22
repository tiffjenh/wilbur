/**
 * Compound growth calculations (deterministic, educational only).
 * FV = P(1+r)^t + PMT_annual * [((1+r)^t - 1) / r]
 * Assumes: r = annual rate, compounded annually; PMT_annual = 12 * monthly.
 */

export interface CompoundInputs {
  initialAmount: number;
  monthlyContribution: number;
  years: number;
  annualReturnPct: number;
}

export interface CompoundResult {
  totalInvested: number;
  totalGrowth: number;
  finalValue: number;
  byYear: { year: number; balance: number; invested: number; growth: number }[];
}

export function compoundGrowth(inputs: CompoundInputs): CompoundResult {
  const P = inputs.initialAmount;
  const monthlyContribution = inputs.monthlyContribution;
  const years = inputs.years;
  const r = inputs.annualReturnPct / 100;
  const PMT_annual = monthlyContribution * 12;

  const byYear: CompoundResult["byYear"] = [];
  let balance = P;

  for (let t = 0; t <= years; t++) {
    const invested = P + PMT_annual * t;
    const growth = balance - invested;
    byYear.push({ year: t, balance: Math.round(balance), invested, growth: Math.round(growth) });
    if (t < years) balance = balance * (1 + r) + PMT_annual;
  }

  const finalBalance = byYear[byYear.length - 1]?.balance ?? 0;
  const totalInvestedFinal = P + PMT_annual * years;
  return {
    totalInvested: totalInvestedFinal,
    totalGrowth: Math.round(finalBalance - totalInvestedFinal),
    finalValue: finalBalance,
    byYear,
  };
}
