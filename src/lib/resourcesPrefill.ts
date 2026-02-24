/**
 * Prefill values for Resources tools from onboarding profile (if completed).
 * Educational only; no advice.
 */
import type { OnboardingData } from "./onboardingSchema";

const LS_KEY = "wilbur_onboarding_profile";

const INCOME_MIDPOINT: Record<string, number> = {
  under_40k: 25_000,
  "40_80k": 60_000,
  "80_150k": 115_000,
  "150k_plus": 175_000,
};

export interface ResourcesPrefill {
  hasProfile: boolean;
  stateCode?: string;
  annualSalary?: number;
  incomeType?: "w2" | "1099";
  has401k?: boolean;
  confidenceLevel?: number;
}

export function getResourcesPrefill(): ResourcesPrefill {
  try {
    const raw = localStorage.getItem(LS_KEY);
    if (!raw) return { hasProfile: false };
    const data = JSON.parse(raw) as Partial<OnboardingData>;
    const incomeRange = data.incomeRange;
    const salary = incomeRange && INCOME_MIDPOINT[incomeRange] ? INCOME_MIDPOINT[incomeRange] : undefined;
    const workSituation = data.workSituation;
    const is1099 = workSituation === "self_employed";
    const isW2 = workSituation === "w2" || workSituation === "w2_and_side";
    return {
      hasProfile: !!(data.stageOfLife && data.workSituation && data.incomeRange),
      stateCode: data.stateCode && data.stateCode !== "prefer_not" ? data.stateCode : undefined,
      annualSalary: salary,
      incomeType: is1099 && !isW2 ? "1099" : "w2",
      has401k: false,
      confidenceLevel: data.confidence,
    };
  } catch {
    return { hasProfile: false };
  }
}
