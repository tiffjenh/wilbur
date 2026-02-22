/**
 * Prefill values for Resources tools from onboarding profile (if completed).
 * Educational only; no advice.
 */
import type { OnboardingData } from "./onboardingSchema";

const LS_KEY = "wilbur_onboarding_profile";

const INCOME_MIDPOINT: Record<string, number> = {
  under_15k: 12_000,
  "15_30k": 22_500,
  "30_60k": 45_000,
  "60_100k": 80_000,
  "100k_plus": 120_000,
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
    const incomeType = data.incomeType;
    const is1099 = incomeType === "1099" || incomeType === "both";
    const isW2 = incomeType === "w2" || incomeType === "both";
    const benefits = data.benefits ?? [];
    const has401k = benefits.includes("401k");
    return {
      hasProfile: !!(data.age && data.workStatus && data.incomeType && data.incomeRange),
      stateCode: data.stateCode && data.stateCode !== "prefer_not" ? data.stateCode : undefined,
      annualSalary: salary,
      incomeType: is1099 && !isW2 ? "1099" : "w2",
      has401k,
      confidenceLevel: data.confidence,
    };
  } catch {
    return { hasProfile: false };
  }
}
