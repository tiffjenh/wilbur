/**
 * Adapter: converts OnboardingData (new 8-step schema) into QuestionnaireAnswers
 * for the scoring engine.
 */
import type { OnboardingData } from "@/lib/onboardingSchema";
import type {
  QuestionnaireAnswers,
  AgeRange,
  WorkStatus,
  IncomeType,
  SavingsRange,
  DebtRange,
  InvestedBefore,
  Goal3to5,
  Stressor,
  EmergencySavings,
} from "./types";

/* ── Stage of life → age range (proxy for scoring) ── */
const STAGE_TO_AGE: Record<string, AgeRange> = {
  in_school: "18-22",
  early_career: "23-27",
  mid_career: "28-34",
  established: "35-44",
  nearing_retirement: "45+",
};

/* ── Work situation → work status + income type ── */
const WORK_SITUATION_TO_STATUS: Record<string, WorkStatus> = {
  w2: "working",
  self_employed: "working",
  w2_and_side: "both",
  not_working: "neither",
};

const WORK_SITUATION_TO_INCOME_TYPE: Record<string, IncomeType> = {
  w2: "w2",
  self_employed: "1099",
  w2_and_side: "both",
  not_working: "none",
};

/* ── Income range → annual income bucket ── */
const INCOME_RANGE_MAP: Record<string, QuestionnaireAnswers["annualIncome"]> = {
  under_40k: "under-15k",
  "40_80k": "30-60k",
  "80_150k": "60-100k",
  "150k_plus": "100-200k",
};

/* ── Debt types → debt tier (no_debt = 0, else low/mid) ── */
function debtTypesToRange(debtTypes: string[] | undefined): DebtRange {
  if (!debtTypes?.length || debtTypes.includes("no_debt")) return "0";
  if (debtTypes.includes("mortgage") || debtTypes.includes("business_debt")) return "10k-50k";
  return "1k-10k";
}

/* ── Emergency savings → savings range (for backward compat) ── */
const EMERGENCY_TO_SAVINGS: Record<string, SavingsRange> = {
  zero: "0",
  less_than_1mo: "0",
  "1_3mo": "<1k",
  "3_6mo": "1k-5k",
  "6_plus": "5k-20k",
};

/* ── Investing exp → investedBefore ── */
const INVESTING_MAP: Record<string, InvestedBefore> = {
  never: "never",
  a_little: "a-little",
  regularly: "regularly",
  advanced: "advanced",
};

/* ── Goals 3–5 (new enum) → Goal3to5 ── */
const GOAL_35_MAP: Record<string, Goal3to5> = {
  home_down_payment: "home_down_payment",
  buy_car: "buy_car",
  start_business: "start_business",
  passive_income: "build_investments",
  grow_investments: "build_investments",
  pay_off_debt: "pay_off_debt",
  emergency_fund: "emergency_fund",
  financial_independence: "build_investments",
};

/* ── Topics → stressors (map topic keys to stressor tags) ── */
const TOPIC_TO_STRESSOR: Record<string, Stressor> = {
  budgeting: "budgeting",
  credit_debt: "credit_cards",
  taxes: "taxes",
  retirement_accounts: "retirement",
  stock_investing: "investing",
  real_estate: "investing",
  options_trading: "investing",
  passive_income: "investing",
  starting_business: "investing",
  financial_independence: "retirement",
  estate_planning: "retirement",
  insurance: "retirement",
};

const DEFAULTS: QuestionnaireAnswers = {
  ageRange: "23-27",
  workStatus: "working",
  incomeType: "w2",
  annualIncome: "30-60k",
  savings: "0",
  debt: "0",
  benefits: [],
  investedBefore: "never",
  goalsThisYear: [],
  goals3to5: [],
  stressors: [],
  confidence: 3,
  stateCode: "",
};

export function toQuestionnaireAnswers(data: Partial<OnboardingData>): QuestionnaireAnswers {
  const stateCode =
    data.stateCode && data.stateCode !== "prefer_not" ? data.stateCode : "";

  const goals3to5: Goal3to5[] = (data.goals3to5 ?? [])
    .map((g) => GOAL_35_MAP[g])
    .filter((g): g is Goal3to5 => Boolean(g));

  const topics = data.topics ?? [];
  const stressors: Stressor[] = topics
    .filter((t) => t !== "dont_know" && t !== "everything")
    .map((t) => TOPIC_TO_STRESSOR[t])
    .filter((s): s is Stressor => Boolean(s));
  const stressorsDeduped = [...new Set(stressors)];

  const emergencySavings = data.emergencySavings as EmergencySavings | undefined;

  return {
    ageRange: STAGE_TO_AGE[data.stageOfLife ?? ""] ?? DEFAULTS.ageRange,
    workStatus: WORK_SITUATION_TO_STATUS[data.workSituation ?? ""] ?? DEFAULTS.workStatus,
    incomeType: WORK_SITUATION_TO_INCOME_TYPE[data.workSituation ?? ""] ?? DEFAULTS.incomeType,
    annualIncome: INCOME_RANGE_MAP[data.incomeRange ?? ""] ?? DEFAULTS.annualIncome,
    savings: EMERGENCY_TO_SAVINGS[data.emergencySavings ?? ""] ?? DEFAULTS.savings,
    debt: debtTypesToRange(data.debtTypes),
    benefits: [],
    investedBefore: INVESTING_MAP[data.investingExp ?? ""] ?? DEFAULTS.investedBefore,
    goalsThisYear: [],
    goals3to5: goals3to5.length > 0 ? goals3to5 : ["not_sure"],
    stressors: stressorsDeduped,
    confidence: (data.confidence as 1 | 2 | 3 | 4 | 5) ?? DEFAULTS.confidence,
    stateCode,
    emergencySavings,
    topics: topics.length > 0 ? topics : undefined,
  };
}

const LS_QUESTIONNAIRE_ANSWERS = "wilbur_questionnaire_answers";
const LS_ONBOARDING_PROFILE = "wilbur_onboarding_profile";

export function loadAnswersFromStorage(): QuestionnaireAnswers | null {
  try {
    const canonical = localStorage.getItem(LS_QUESTIONNAIRE_ANSWERS);
    if (canonical) {
      const parsed = JSON.parse(canonical) as unknown;
      if (parsed && typeof parsed === "object" && "goals3to5" in parsed) {
        return parsed as QuestionnaireAnswers;
      }
    }
    const draft = localStorage.getItem(LS_ONBOARDING_PROFILE);
    if (!draft) return null;
    const parsed = JSON.parse(draft) as Partial<OnboardingData>;
    return toQuestionnaireAnswers(parsed);
  } catch {
    return null;
  }
}

export function fromQuestionnaireAnswers(_q: QuestionnaireAnswers): Partial<OnboardingData> {
  return {};
}
