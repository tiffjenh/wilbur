import { z } from "zod";

/* ── Step 1 ── */
export const AgeRange = z.enum(["under_18", "18_22", "23_27", "28_34", "35_44", "45_plus"]);
export const WorkStatus = z.enum(["in_school", "working", "both", "neither"]);

/* ── Step 2 ── */
export const IncomeType = z.enum(["w2", "1099", "both", "no_income"]);
export const IncomeRange = z.enum([
  "under_15k", "15_30k", "30_60k", "60_100k", "100_200k", "200k_plus",
]);

/* ── Step 3 ── */
export const SavingsRange = z.enum(["zero", "under_1k", "1k_5k", "5k_20k", "20k_plus"]);
export const DebtRange = z.enum(["zero", "under_1k", "1k_10k", "10k_50k", "50k_plus"]);

/* ── Step 4 ── */
export const BenefitOption = z.enum(["401k", "hsa", "fsa", "rsu", "none"]);
export const InvestingExp = z.enum(["never", "a_little", "yes_regularly"]);

/* ── Step 5 ── */
export const GoalThisYear = z.enum([
  "emergency_fund", "pay_debt", "start_investing",
  "buy_car", "save_travel", "nothing",
]);
export const Goal3to5 = z.enum([
  "buy_home", "career_growth", "start_business",
  "build_investments", "not_sure",
]);

/* ── Step 6 ── */
export const MoneyStressor = z.enum([
  "investing", "taxes", "credit_cards", "budgeting", "retirement", "everything",
]);
export const ConfidenceLevel = z.union([
  z.literal(1), z.literal(2), z.literal(3), z.literal(4), z.literal(5),
]);

/* ─────────────────────────────────────────────────────────
   Full onboarding schema.
   Required: age, workStatus, incomeType, incomeRange.
   All others optional (validated when provided).
──────────────────────────────────────────────────────────── */
export const onboardingSchema = z.object({
  // Step 1 — both required
  age: AgeRange,
  workStatus: WorkStatus,

  // Step 2 — both required
  incomeType: IncomeType,
  incomeRange: IncomeRange,

  // Step 3 — optional
  savingsRange: SavingsRange.optional(),
  debtRange: DebtRange.optional(),

  // Step 4 — optional (arrays must not be empty if provided)
  benefits: z.array(BenefitOption).min(1, "Select at least one").optional(),
  investingExp: InvestingExp.optional(),

  // Step 5 — optional
  goalsThisYear: z.array(GoalThisYear).min(1).optional(),
  goals3to5: z.array(Goal3to5).min(1).optional(),

  // Step 6 — optional
  moneyStressors: z.array(MoneyStressor).min(1).optional(),
  confidence: ConfidenceLevel.optional(),
});

export type OnboardingData = z.infer<typeof onboardingSchema>;

/* Per-step required field keys (used to gate "Next" button) */
export const STEP_REQUIRED_FIELDS: (keyof OnboardingData)[][] = [
  ["age", "workStatus"],
  ["incomeType", "incomeRange"],
  [],
  [],
  [],
  [],
];

export const TOTAL_STEPS = 6;

/* LocalStorage key */
export const LS_KEY = "wilbur_onboarding_profile";

/* Human-readable labels for each enum (used for display in cards) */
export const AGE_LABELS: Record<z.infer<typeof AgeRange>, string> = {
  under_18: "Under 18",
  "18_22": "18–22",
  "23_27": "23–27",
  "28_34": "28–34",
  "35_44": "35–44",
  "45_plus": "45+",
};

export const WORK_STATUS_LABELS: Record<z.infer<typeof WorkStatus>, string> = {
  in_school: "In school",
  working: "Working",
  both: "Both",
  neither: "Neither",
};

export const INCOME_TYPE_LABELS: Record<z.infer<typeof IncomeType>, string> = {
  w2: "W2",
  "1099": "1099 / Freelance",
  both: "Both",
  no_income: "No income",
};

export const INCOME_RANGE_LABELS: Record<z.infer<typeof IncomeRange>, string> = {
  under_15k: "Under $15k",
  "15_30k": "$15k–$30k",
  "30_60k": "$30k–$60k",
  "60_100k": "$60k–$100k",
  "100_200k": "$100k–$200k",
  "200k_plus": "$200k+",
};

export const SAVINGS_RANGE_LABELS: Record<z.infer<typeof SavingsRange>, string> = {
  zero: "$0",
  under_1k: "Under $1k",
  "1k_5k": "$1k–$5k",
  "5k_20k": "$5k–$20k",
  "20k_plus": "$20k+",
};

export const DEBT_RANGE_LABELS: Record<z.infer<typeof DebtRange>, string> = {
  zero: "$0",
  under_1k: "Under $1k",
  "1k_10k": "$1k–$10k",
  "10k_50k": "$10k–$50k",
  "50k_plus": "$50k+",
};

export const BENEFIT_LABELS: Record<z.infer<typeof BenefitOption>, string> = {
  "401k": "401(k)",
  hsa: "HSA",
  fsa: "FSA",
  rsu: "Stock options / RSUs",
  none: "None",
};

export const INVESTING_EXP_LABELS: Record<z.infer<typeof InvestingExp>, string> = {
  never: "Never",
  a_little: "A little",
  yes_regularly: "Yes, regularly",
};

export const GOALS_YEAR_LABELS: Record<z.infer<typeof GoalThisYear>, string> = {
  emergency_fund: "Build emergency fund",
  pay_debt: "Pay off debt",
  start_investing: "Start investing",
  buy_car: "Buy a car",
  save_travel: "Save for travel",
  nothing: "Nothing specific",
};

export const GOALS_3_5_LABELS: Record<z.infer<typeof Goal3to5>, string> = {
  buy_home: "Buy a home",
  career_growth: "Career growth",
  start_business: "Start a business",
  build_investments: "Build investments",
  not_sure: "Not sure",
};

export const STRESSOR_LABELS: Record<z.infer<typeof MoneyStressor>, string> = {
  investing: "Investing",
  taxes: "Taxes",
  credit_cards: "Credit cards",
  budgeting: "Budgeting",
  retirement: "Retirement",
  everything: "Everything",
};
