import { z } from "zod";

/* ── Step 9 — State of residence ── */
export const US_STATE_CODES = [
  "AL","AK","AZ","AR","CA","CO","CT","DE","FL","GA","HI","ID","IL","IN","IA",
  "KS","KY","LA","ME","MD","MA","MI","MN","MS","MO","MT","NE","NV","NH","NJ",
  "NM","NY","NC","ND","OH","OK","OR","PA","RI","SC","SD","TN","TX","UT","VT",
  "VA","WA","WV","WI","WY","DC",
] as const;
export const StateCode = z.enum([...US_STATE_CODES, "prefer_not"] as const);

/* ── Step 1 ── */
export const AgeRange = z.enum(["under_18", "18_22", "23_27", "28_34", "35_44", "45_plus"]);
export const WorkStatus = z.enum(["in_school", "working", "both", "neither"]);

/* ── Step 2 ── */
export const IncomeType = z.enum(["w2", "1099", "both", "no_income"]);
export const IncomeRange = z.enum([
  "under_15k", "15_30k", "30_60k", "60_100k", "100k_plus",
]);

/* ── Step 3 ── */
export const SavingsRange = z.enum(["zero", "under_1k", "1k_5k", "5k_20k", "20k_plus"]);
export const DebtRange = z.enum(["zero", "under_1k", "1k_10k", "10k_50k", "50k_plus"]);

/* ── Step 4 ── */
export const BenefitOption = z.enum(["401k", "hsa", "fsa", "stock_options", "rsu", "none"]);
export const InvestingExp = z.enum(["never", "a_little", "yes_regularly"]);

/* ── Step 5 ── */
export const GoalThisYear = z.enum([
  "emergency_fund", "pay_debt", "start_investing",
  "buy_car", "save_travel", "nothing",
]);
export const Goal3to5 = z.enum([
  "save_home_down_payment", "buy_car", "start_business",
  "build_investments", "pay_off_debt", "emergency_fund",
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

  // Step 9 — state of residence (optional)
  stateCode: StateCode.optional(),
});

export type OnboardingData = z.infer<typeof onboardingSchema>;

/**
 * Per-step required field keys.
 * "Next" is disabled until every field in the step's array is non-empty.
 *
 * Step 3 (savings / debt) uses slider defaults that are set automatically when the
 * user enters the step, so no fields need to be explicitly required here.
 * Steps 4–8 gate on their primary selection to ensure the user engages.
 */
export const STEP_REQUIRED_FIELDS: (keyof OnboardingData)[][] = [
  ["age", "workStatus"],         // Step 1 — platform cards
  ["incomeType", "incomeRange"], // Step 2 — platform cards + slider
  [],                            // Step 3 — optional sliders (defaults injected on entry)
  ["benefits"],                  // Step 4 — multi-select (at least 1, "none" counts)
  ["goalsThisYear"],             // Step 5 — multi-select (at least 1)
  ["goals3to5"],                 // Step 6 — multi-select (at least 1)
  ["moneyStressors"],            // Step 7 — multi-select (at least 1)
  ["investingExp", "confidence"],// Step 8 — platform card + confidence slider
  [],                            // Step 9 — state (optional, can skip)
];

export const TOTAL_STEPS = 9;

/* LocalStorage key */
export const LS_KEY = "wilbur_onboarding_profile";

/** SessionStorage key: set when redirecting from onboarding complete; show create-account popup once when landing on learning/lesson if not signed up */
export const POST_ONBOARDING_PROMPT_SIGNUP = "wilbur_post_onboarding_prompt_signup";

/**
 * Default values injected silently when entering a step that has sliders.
 * Ensures the user can proceed without explicitly touching the slider,
 * while still recording a meaningful answer.
 */
export const STEP_SLIDER_DEFAULTS: Record<number, Partial<OnboardingData>> = {
  3: { savingsRange: "zero", debtRange: "zero" }, // Step 3 — savings & debt
  8: { confidence: 3 },                           // Step 8 — confidence (midpoint)
};

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
  under_15k: "Under $15K",
  "15_30k": "$15 - 30K",
  "30_60k": "$30 - 60K",
  "60_100k": "$60 - 100K",
  "100k_plus": "$100K+",
};

export const SAVINGS_RANGE_LABELS: Record<z.infer<typeof SavingsRange>, string> = {
  zero: "$0",
  under_1k: "Under $1K",
  "1k_5k": "$1 - 5K",
  "5k_20k": "$5 - 20K",
  "20k_plus": "$20K+",
};

export const DEBT_RANGE_LABELS: Record<z.infer<typeof DebtRange>, string> = {
  zero: "$0",
  under_1k: "Under $1K",
  "1k_10k": "$1 - 10K",
  "10k_50k": "$10 - 50K",
  "50k_plus": "$50K+",
};

export const BENEFIT_LABELS: Record<z.infer<typeof BenefitOption>, string> = {
  "401k": "401(k)",
  hsa: "HSA",
  fsa: "FSA",
  stock_options: "Stock options",
  rsu: "RSUs",
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
  save_home_down_payment: "Save for a home down payment",
  buy_car: "Buy a car",
  start_business: "Start a business",
  build_investments: "Build investments",
  pay_off_debt: "Pay off debt",
  emergency_fund: "Build an emergency fund",
};

export const STRESSOR_LABELS: Record<z.infer<typeof MoneyStressor>, string> = {
  investing: "Investing",
  taxes: "Taxes",
  credit_cards: "Credit cards",
  budgeting: "Budgeting",
  retirement: "Retirement",
  everything: "Everything",
};
