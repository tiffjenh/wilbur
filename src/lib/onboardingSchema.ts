import { z } from "zod";

/* ── Step 8 — State of residence ── */
export const US_STATE_CODES = [
  "AL","AK","AZ","AR","CA","CO","CT","DE","FL","GA","HI","ID","IL","IN","IA",
  "KS","KY","LA","ME","MD","MA","MI","MN","MS","MO","MT","NE","NV","NH","NJ",
  "NM","NY","NC","ND","OH","OK","OR","PA","RI","SC","SD","TN","TX","UT","VT",
  "VA","WA","WV","WI","WY","DC",
] as const;
export const StateCode = z.enum([...US_STATE_CODES, "prefer_not"] as const);

/* ── Step 1 — Learning mode ── */
export const LearningMode = z.enum(["personalized", "browse"]);

/* ── Step 2 — Stage of life + Work situation ── */
export const StageOfLife = z.enum([
  "in_school",
  "early_career",
  "mid_career",
  "established",
  "nearing_retirement",
]);
export const WorkSituation = z.enum([
  "w2",
  "self_employed",
  "w2_and_side",
  "not_working",
]);

/* ── Step 3 — Income + Debt ── */
export const IncomeRangeNew = z.enum([
  "under_40k",
  "40_80k",
  "80_150k",
  "150k_plus",
]);
export const DebtType = z.enum([
  "no_debt",
  "credit_card",
  "student_loans",
  "auto_loan",
  "mortgage",
  "business_debt",
]);

/* ── Step 4 — Emergency savings + Investing experience ── */
export const EmergencySavings = z.enum([
  "zero",
  "less_than_1mo",
  "1_3mo",
  "3_6mo",
  "6_plus",
]);
export const InvestingExp = z.enum([
  "never",
  "a_little",
  "regularly",
  "advanced",
]);

/* ── Step 5 — Financial goals (max 3) ── */
export const Goal3to5New = z.enum([
  "home_down_payment",
  "buy_car",
  "start_business",
  "passive_income",
  "grow_investments",
  "pay_off_debt",
  "emergency_fund",
  "financial_independence",
]);

/* ── Step 6 — Topics of interest ── */
export const TopicInterest = z.enum([
  "budgeting",
  "credit_debt",
  "taxes",
  "retirement_accounts",
  "stock_investing",
  "real_estate",
  "options_trading",
  "passive_income",
  "starting_business",
  "financial_independence",
  "estate_planning",
  "insurance",
  "dont_know",
  "everything",
]);

/* ── Step 7 — Confidence ── */
export const ConfidenceLevel = z.union([
  z.literal(1), z.literal(2), z.literal(3), z.literal(4), z.literal(5),
]);

/* ── Full onboarding schema (8 steps) ── */
export const onboardingSchema = z.object({
  learningMode: LearningMode.optional(),

  stageOfLife: StageOfLife.optional(),
  workSituation: WorkSituation.optional(),

  incomeRange: IncomeRangeNew.optional(),
  debtTypes: z.array(DebtType).optional(),

  emergencySavings: EmergencySavings.optional(),
  investingExp: InvestingExp.optional(),

  goals3to5: z.array(Goal3to5New).max(3).optional(),

  topics: z.array(TopicInterest).optional(),

  confidence: ConfidenceLevel.optional(),

  stateCode: StateCode.optional(),
});

export type OnboardingData = z.infer<typeof onboardingSchema>;

export const STEP_REQUIRED_FIELDS: (keyof OnboardingData)[][] = [
  ["learningMode"],
  ["stageOfLife", "workSituation"],
  ["incomeRange", "debtTypes"],
  ["emergencySavings", "investingExp"],
  ["goals3to5"],
  ["topics"],
  ["confidence"],
  [],
];

export const TOTAL_STEPS = 8;

export const LS_KEY = "wilbur_onboarding_profile";
export const LS_LEARNING_MODE = "wilbur_learning_mode";

export const POST_ONBOARDING_PROMPT_SIGNUP = "wilbur_post_onboarding_prompt_signup";

export const STEP_SLIDER_DEFAULTS: Record<number, Partial<OnboardingData>> = {
  7: { confidence: 3 },
};

/* ── Labels ── */
export const LEARNING_MODE_LABELS: Record<z.infer<typeof LearningMode>, string> = {
  personalized: "Personalized learning path (recommended)",
  browse: "Browse all lessons now",
};

export const LEARNING_MODE_DESCRIPTIONS: Record<z.infer<typeof LearningMode>, string> = {
  personalized:
    "We'll ask a few quick questions and build a roadmap tailored to your situation and goals.",
  browse:
    "Skip the questionnaire and explore the full library. You can build your own roadmap.",
};

export const STAGE_OF_LIFE_LABELS: Record<z.infer<typeof StageOfLife>, string> = {
  in_school: "In school",
  early_career: "Early career\n(0–5 years working)",
  mid_career: "Mid-career\n(5–15 years working)",
  established: "Established career\n(15+ years)",
  nearing_retirement: "Nearing retirement (55+)",
};

export const WORK_SITUATION_LABELS: Record<z.infer<typeof WorkSituation>, string> = {
  w2: "W2 employee",
  self_employed: "Self-employed / 1099",
  w2_and_side: "Both W2 + side income",
  not_working: "Not currently working",
};

export const INCOME_RANGE_NEW_LABELS: Record<z.infer<typeof IncomeRangeNew>, string> = {
  under_40k: "Under $40,000",
  "40_80k": "$40,000 – $80,000",
  "80_150k": "$80,000 – $150,000",
  "150k_plus": "$150,000+",
};

export const DEBT_TYPE_LABELS: Record<z.infer<typeof DebtType>, string> = {
  no_debt: "No debt",
  credit_card: "Credit card debt",
  student_loans: "Student loans",
  auto_loan: "Auto loan",
  mortgage: "Mortgage",
  business_debt: "Business debt",
};

export const EMERGENCY_SAVINGS_LABELS: Record<z.infer<typeof EmergencySavings>, string> = {
  zero: "$0",
  less_than_1mo: "Less than 1 month of expenses",
  "1_3mo": "1–3 months",
  "3_6mo": "3–6 months",
  "6_plus": "6+ months",
};

export const INVESTING_EXP_LABELS: Record<z.infer<typeof InvestingExp>, string> = {
  never: "I've never invested",
  a_little: "I've invested a little (ETFs, retirement accounts)",
  regularly: "I invest regularly",
  advanced: "I trade advanced products (options, crypto, individual stocks)",
};

export const GOAL_3_5_NEW_LABELS: Record<z.infer<typeof Goal3to5New>, string> = {
  home_down_payment: "Save for a home down payment",
  buy_car: "Buy a car",
  start_business: "Start a business",
  passive_income: "Build passive income",
  grow_investments: "Grow my investments",
  pay_off_debt: "Pay off debt",
  emergency_fund: "Build an emergency fund",
  financial_independence: "Financial independence / early retirement",
};

export const TOPIC_INTEREST_LABELS: Record<z.infer<typeof TopicInterest>, string> = {
  budgeting: "Budgeting & money systems",
  credit_debt: "Credit & debt",
  taxes: "Taxes",
  retirement_accounts: "Retirement accounts",
  stock_investing: "Stock market investing",
  real_estate: "Real estate",
  options_trading: "Options & advanced trading",
  passive_income: "Passive income",
  starting_business: "Starting a business",
  financial_independence: "Financial independence",
  estate_planning: "Estate planning",
  insurance: "Insurance basics",
  dont_know: "I don't know what any of these are",
  everything: "I want to learn about everything",
};
