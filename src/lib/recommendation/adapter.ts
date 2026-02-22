/**
 * Adapter: converts the app's OnboardingData (Zod-validated form state)
 * into QuestionnaireAnswers (canonical type used by the scoring engine).
 *
 * Field names and enum values differ between the two; this is the single
 * place where that mapping lives.
 */
import type { OnboardingData } from "@/lib/onboardingSchema";
import type {
  QuestionnaireAnswers,
  AgeRange,
  WorkStatus,
  IncomeType,
  SavingsRange,
  DebtRange,
  Benefit,
  InvestedBefore,
  GoalThisYear,
  Goal3to5,
  Stressor,
} from "./types";

/* ── Field-level mappers ──────────────────────────────────── */

const AGE_MAP: Record<string, AgeRange> = {
  under_18: "under-18",
  "18_22":  "18-22",
  "23_27":  "23-27",
  "28_34":  "28-34",
  "35_44":  "35-44",
  "45_plus": "45+",
};

const WORK_MAP: Record<string, WorkStatus> = {
  in_school: "school",
  working:   "working",
  both:      "both",
  neither:   "neither",
};

const INCOME_TYPE_MAP: Record<string, IncomeType> = {
  w2:        "w2",
  "1099":    "1099",
  both:      "both",
  no_income: "none",
};

const INCOME_RANGE_MAP: Record<string, QuestionnaireAnswers["annualIncome"]> = {
  under_15k:  "under-15k",
  "15_30k":   "15-30k",
  "30_60k":   "30-60k",
  "60_100k":  "60-100k",
  "100k_plus": "100-200k",  // OnboardingData has no 200k+ bucket; map to closest
};

const SAVINGS_MAP: Record<string, SavingsRange> = {
  zero:     "0",
  under_1k: "<1k",
  "1k_5k":  "1k-5k",
  "5k_20k": "5k-20k",
  "20k_plus": "20k+",
};

const DEBT_MAP: Record<string, DebtRange> = {
  zero:     "0",
  under_1k: "<1k",
  "1k_10k": "1k-10k",
  "10k_50k": "10k-50k",
  "50k_plus": "50k+",
};

function mapBenefit(b: string): Benefit | null {
  switch (b) {
    case "401k":         return "401k";
    case "hsa":          return "hsa";
    case "fsa":          return "fsa";
    case "stock_options":
    case "rsu":          return "equity_comp";
    case "none":         return "none";
    default:             return null;
  }
}

const INVESTING_EXP_MAP: Record<string, InvestedBefore> = {
  never:         "never",
  a_little:      "a-little",
  yes_regularly: "regularly",
};

const GOAL_YEAR_MAP: Record<string, GoalThisYear> = {
  emergency_fund:  "emergency_fund",
  pay_debt:        "pay_off_debt",
  start_investing: "start_investing",
  buy_car:         "buy_car",
  save_travel:     "travel",
  nothing:         "nothing_specific",
};

const GOAL_35_MAP: Record<string, Goal3to5> = {
  save_home_down_payment: "home_down_payment",
  buy_car:                "buy_car",
  start_business:         "start_business",
  build_investments:      "build_investments",
  pay_off_debt:           "pay_off_debt",
  emergency_fund:         "emergency_fund",
};

const STRESSOR_MAP: Record<string, Stressor> = {
  investing:    "investing",
  taxes:        "taxes",
  credit_cards: "credit_cards",
  budgeting:    "budgeting",
  retirement:   "retirement",
  everything:   "everything",
};

/* ── DEFAULTS used when questionnaire fields are missing ─── */

const DEFAULTS: QuestionnaireAnswers = {
  ageRange:      "23-27",
  workStatus:    "working",
  incomeType:    "w2",
  annualIncome:  "30-60k",
  savings:       "0",
  debt:          "0",
  benefits:      ["none"],
  investedBefore: "never",
  goalsThisYear: ["nothing_specific"],
  goals3to5:     ["not_sure"],
  stressors:     [],
  confidence:    3,
  stateCode:     "",
};

/* ── Main adapter function ─────────────────────────────────── */

/**
 * Convert an OnboardingData object (partial or complete) into a
 * QuestionnaireAnswers object ready for the scoring engine.
 *
 * Fields that are undefined/missing fall back to sensible defaults.
 */
export function toQuestionnaireAnswers(data: Partial<OnboardingData>): QuestionnaireAnswers {
  const benefits: Benefit[] = (data.benefits ?? [])
    .map(mapBenefit)
    .filter((b): b is Benefit => b !== null);

  const stateCode =
    data.stateCode && data.stateCode !== "prefer_not" ? data.stateCode : "";

  return {
    ageRange:      AGE_MAP[data.age ?? ""] ?? DEFAULTS.ageRange,
    workStatus:    WORK_MAP[data.workStatus ?? ""] ?? DEFAULTS.workStatus,
    incomeType:    INCOME_TYPE_MAP[data.incomeType ?? ""] ?? DEFAULTS.incomeType,
    annualIncome:  INCOME_RANGE_MAP[data.incomeRange ?? ""] ?? DEFAULTS.annualIncome,
    savings:       SAVINGS_MAP[data.savingsRange ?? ""] ?? DEFAULTS.savings,
    debt:          DEBT_MAP[data.debtRange ?? ""] ?? DEFAULTS.debt,
    benefits:      benefits.length > 0 ? benefits : DEFAULTS.benefits,
    investedBefore: INVESTING_EXP_MAP[data.investingExp ?? ""] ?? DEFAULTS.investedBefore,
    goalsThisYear: (data.goalsThisYear ?? [])
      .map(g => GOAL_YEAR_MAP[g])
      .filter((g): g is GoalThisYear => Boolean(g)),
    goals3to5: (data.goals3to5 ?? [])
      .map(g => GOAL_35_MAP[g])
      .filter((g): g is Goal3to5 => Boolean(g)),
    stressors: (data.moneyStressors ?? [])
      .map(s => STRESSOR_MAP[s])
      .filter((s): s is Stressor => Boolean(s)),
    confidence: (data.confidence as 1 | 2 | 3 | 4 | 5) ?? DEFAULTS.confidence,
    stateCode,
  };
}

/**
 * Load questionnaire answers from localStorage and convert.
 * Returns null if no saved answers exist.
 */
export function loadAnswersFromStorage(): QuestionnaireAnswers | null {
  try {
    const raw = localStorage.getItem("wilbur_onboarding_profile");
    if (!raw) return null;
    const parsed = JSON.parse(raw) as Partial<OnboardingData>;
    return toQuestionnaireAnswers(parsed);
  } catch {
    return null;
  }
}
