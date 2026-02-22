/**
 * Credit score impact simulator (simplified educational model).
 * Not a real score — approximate range change only. Real scores vary.
 */

export type CreditScenario =
  | "missed_payment"
  | "high_utilization"
  | "pay_off_balance"
  | "new_account";

export interface CreditImpactInput {
  /** Approximate current score (e.g. 700). Used as baseline. */
  currentScore: number;
  scenario: CreditScenario;
}

export interface CreditImpactResult {
  /** Approximate score after scenario (range low–high for display) */
  estimatedScoreLow: number;
  estimatedScoreHigh: number;
  /** Short explanation */
  explanation: string;
  /** Delta from current (negative = drop) */
  deltaLow: number;
  deltaHigh: number;
}

const SCENARIO_IMPACT: Record<
  CreditScenario,
  { deltaLow: number; deltaHigh: number; explanation: string }
> = {
  missed_payment: {
    deltaLow: -130,
    deltaHigh: -80,
    explanation:
      "A single missed payment can lower your score significantly. Payment history is the largest factor in most credit models. Setting up autopay can help avoid this.",
  },
  high_utilization: {
    deltaLow: -50,
    deltaHigh: -20,
    explanation:
      "Using a high percentage of your available credit (e.g. over 30%) can lower your score. Paying down balances or requesting a credit limit increase can help utilization.",
  },
  pay_off_balance: {
    deltaLow: 15,
    deltaHigh: 45,
    explanation:
      "Paying off a balance can improve your utilization and may boost your score. The effect depends on your overall credit profile.",
  },
  new_account: {
    deltaLow: -15,
    deltaHigh: 5,
    explanation:
      "Opening a new account can cause a small, temporary dip (hard inquiry, lower average age). Over time, more available credit can help if you keep utilization low.",
  },
};

export function creditImpact(input: CreditImpactInput): CreditImpactResult {
  const { currentScore, scenario } = input;
  const impact = SCENARIO_IMPACT[scenario];
  const clamp = (n: number) => Math.max(300, Math.min(850, n));
  const low = clamp(currentScore + impact.deltaLow);
  const high = clamp(currentScore + impact.deltaHigh);
  return {
    estimatedScoreLow: low,
    estimatedScoreHigh: high,
    explanation: impact.explanation,
    deltaLow: impact.deltaLow,
    deltaHigh: impact.deltaHigh,
  };
}
