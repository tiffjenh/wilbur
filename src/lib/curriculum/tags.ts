/**
 * Canonical tag sets for curriculum lessons. Use these constants only — no free-typed tag strings.
 */

export const DomainTags = {
  investing: "investing",
  credit: "credit",
  taxes: "taxes",
  real_estate: "real_estate",
  retirement: "retirement",
  budgeting: "budgeting",
  banking: "banking",
  behavior: "behavior",
  debt: "debt",
  benefits: "benefits",
  income: "income",
  money_foundations: "money_foundations",
  cashflow: "cashflow",
  savings: "savings",
  automation: "automation",
  stocks: "stocks",
  bonds: "bonds",
  funds: "funds",
  etfs: "etfs",
  index_funds: "index_funds",
  risk: "risk",
  time_horizon: "time_horizon",
  compound_growth: "compound_growth",
  asset_allocation: "asset_allocation",
  diversification: "diversification",
  brokerage: "brokerage",
  dividends: "dividends",
  reits: "reits",
  options: "options",
  advanced_investing: "advanced_investing",
  housing: "housing",
  mortgage: "mortgage",
  rental: "rental",
  rent_vs_buy: "rent_vs_buy",
  down_payment: "down_payment",
  pmi: "pmi",
  financial_planning: "financial_planning",
  goals: "goals",
  withdrawals: "withdrawals",
  habits: "habits",
  biases: "biases",
  spending: "spending",
  tracking: "tracking",
  employer_match: "employer_match",
  ira: "ira",
  roth_ira: "roth_ira",
  "401k": "401k",
  hsa: "hsa",
  fsa: "fsa",
  withholding: "withholding",
  filing: "filing",
  emergency_fund: "emergency_fund",
  student_loans: "student_loans",
  priorities: "priorities",
  apy: "apy",
  cds: "cds",
  fdic: "fdic",
  ncua: "ncua",
  dca: "dca",
  life_stage: "life_stage",
  family: "family",
  employment: "employment",
  credit_score: "credit_score",
  bills: "bills",
  systems_habits: "systems_habits",
  irregular_income: "irregular_income",
  "1099": "1099",
  payoff: "payoff",
} as const;

export const DOMAIN_TAGS: readonly string[] = Object.values(DomainTags);

export const GoalTags = {
  home_down_payment: "home_down_payment",
  pay_off_debt: "pay_off_debt",
  build_emergency_fund: "build_emergency_fund",
  grow_investments: "grow_investments",
  start_business: "start_business",
  passive_income: "passive_income",
  financial_independence: "financial_independence",
} as const;

export const GOAL_TAGS: readonly string[] = Object.values(GoalTags);

export const LifeStageTags = {
  student: "student",
  early_career: "early_career",
  mid_career: "mid_career",
  near_retirement: "near_retirement",
} as const;

export const LIFE_STAGE_TAGS: readonly string[] = Object.values(LifeStageTags);

export const ComplexityTags = {
  foundations: "foundations",
  intermediate: "intermediate",
  advanced: "advanced",
} as const;

export const COMPLEXITY_TAGS: readonly string[] = Object.values(ComplexityTags);

export type DomainTag = (typeof DomainTags)[keyof typeof DomainTags];
export type GoalTag = (typeof GoalTags)[keyof typeof GoalTags];
export type LifeStageTag = (typeof LifeStageTags)[keyof typeof LifeStageTags];
export type ComplexityTag = (typeof ComplexityTags)[keyof typeof ComplexityTags];
export type LessonTag = DomainTag | GoalTag | LifeStageTag | ComplexityTag;

export const FormatHintTags = {
  bullets: "bullets",
  comparison_table: "comparison-table",
  chart: "chart",
  scenario: "scenario",
  checklist: "checklist",
} as const;

export const FORMAT_HINT_TAGS: readonly string[] = Object.values(FormatHintTags);
export type FormatHintTag = (typeof FormatHintTags)[keyof typeof FormatHintTags];
