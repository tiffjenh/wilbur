/**
 * Personalization scoring: deterministic profile from questionnaire answers.
 * No AI. Used to derive targetLevel, tag/domain/goal weights, and deprioritization.
 */

export type TargetLevel = "beginner" | "intermediate" | "advanced";

export type PersonalizationProfile = {
  targetLevel: TargetLevel;
  weights: Record<string, number>;
  deprioritize: Record<string, number>;
  stateCode: string;
};

/** Input: questionnaire/onboarding answers. All fields optional for partial data. */
export type PersonalizationInput = {
  /** Stage of life (onboarding: in_school, early_career, mid_career, established, nearing_retirement) */
  stageOfLife?: string;
  /** Income range (e.g. under_40k, 40_80k, 80_150k, 150k_plus) or legacy (30-60k, etc.) */
  incomeRange?: string;
  annualIncome?: string;
  /** Debt types from onboarding: no_debt, credit_card, student_loans, auto_loan, mortgage, business_debt */
  debtTypes?: string[];
  /** Legacy debt range: "0" | "<1k" | "1k-10k" | "10k-50k" | "50k+" */
  debt?: string;
  /** Emergency savings: zero, less_than_1mo, 1_3mo, 3_6mo, 6_plus */
  emergencySavings?: string;
  /** Investing experience: never, a_little, regularly, advanced */
  investingExp?: string;
  investedBefore?: string;
  /** Goals (3–5 year): home_down_payment, pay_off_debt, emergency_fund, etc. */
  goals3to5?: string[];
  goalsThisYear?: string[];
  /** Topic interests: budgeting, credit_debt, stock_investing, dont_know, everything, etc. */
  topics?: string[];
  /** Confidence 1–5 */
  confidence?: number;
  /** State of residence (e.g. CA, NY) or prefer_not */
  stateCode?: string;
};

function emergencyTier(em: string | undefined): "none" | "low" | "mid" | "high" {
  if (!em || em === "zero" || em === "less_than_1mo") return "none";
  if (em === "1_3mo") return "low";
  if (em === "3_6mo") return "mid";
  if (em === "6_plus") return "high";
  return "none";
}

function hasCreditCardDebt(input: PersonalizationInput): boolean {
  if (input.debtTypes?.length) return input.debtTypes.includes("credit_card");
  if (input.debt != null) return input.debt !== "0";
  return false;
}

function hasNoDebt(input: PersonalizationInput): boolean {
  if (input.debtTypes?.length) return input.debtTypes.length === 0 || input.debtTypes.includes("no_debt");
  if (input.debt != null) return input.debt === "0";
  return false;
}

/** Deterministic target level from triggers. */
function computeTargetLevel(input: PersonalizationInput): TargetLevel {
  const invested = input.investingExp ?? input.investedBefore ?? "never";
  const conf = input.confidence ?? 3;
  const em = input.emergencySavings;
  const tier = emergencyTier(em);
  const topics = input.topics ?? [];

  // Beginner: investing=never OR confidence<=2 OR emergencySavings<1mo OR interest includes "I don't know"
  if (
    invested === "never" ||
    conf <= 2 ||
    tier === "none" ||
    topics.includes("dont_know")
  ) {
    return "beginner";
  }

  // Advanced: investing=regular/advanced AND confidence>=4 AND emergencySavings>=3mo AND no credit card debt
  const emAtLeast3Mo = tier === "mid" || tier === "high";
  const noCCDebt = !hasCreditCardDebt(input);
  if (
    (invested === "regularly" || invested === "advanced") &&
    conf >= 4 &&
    emAtLeast3Mo &&
    noCCDebt
  ) {
    return "advanced";
  }

  // Intermediate: invested a little + confidence >= 3 + 3+ mo emergency
  if (
    invested === "a_little" &&
    conf >= 3 &&
    emAtLeast3Mo
  ) {
    return "intermediate";
  }

  return "beginner";
}

/** Goal → tag/domain keys to boost. */
const GOAL_WEIGHT_KEYS: Record<string, string[]> = {
  home_down_payment: ["home-buying", "real-estate", "housing", "down_payment"],
  pay_off_debt: ["debt", "credit", "payoff"],
  emergency_fund: ["emergency-fund", "savings", "money-basics"],
  grow_investments: ["investing", "investing-basics", "stocks", "etfs"],
  passive_income: ["investing", "investing-basics", "dividends"],
  financial_independence: ["retirement", "investing", "investing-basics"],
  start_business: ["irregular-income", "taxes", "income"],
  buy_car: ["debt", "budgeting"],
};

/** Topic interest → tag/domain keys to boost. */
const TOPIC_WEIGHT_KEYS: Record<string, string[]> = {
  budgeting: ["budgeting", "cashflow"],
  credit_debt: ["credit", "debt", "credit_score"],
  taxes: ["taxes", "taxes-federal"],
  retirement_accounts: ["retirement", "401k", "ira"],
  stock_investing: ["stocks", "investing", "investing-basics"],
  real_estate: ["real-estate", "housing", "home-buying"],
  options_trading: ["options", "advanced-investing"],
  passive_income: ["investing", "dividends"],
  starting_business: ["income", "irregular-income"],
  financial_independence: ["retirement", "investing"],
  estate_planning: ["retirement", "advanced-investing"],
  insurance: ["insurance"],
  everything: ["investing", "retirement", "budgeting", "credit", "debt", "real-estate"],
};

const WEIGHT_BOOST_GOAL = 12;
const WEIGHT_BOOST_TOPIC = 8;
const DEPRIORITIZE_PENALTY = 10;

/**
 * Compute personalization profile from questionnaire answers.
 * Deterministic; no AI.
 */
export function computePersonalizationProfile(input: PersonalizationInput): PersonalizationProfile {
  const targetLevel = computeTargetLevel(input);
  const weights: Record<string, number> = {};
  const deprioritize: Record<string, number> = {};

  // Goals boost weights
  const goals = input.goals3to5 ?? input.goalsThisYear ?? [];
  for (const g of goals) {
    const keys = GOAL_WEIGHT_KEYS[g];
    if (keys) {
      for (const k of keys) {
        weights[k] = (weights[k] ?? 0) + WEIGHT_BOOST_GOAL;
      }
    }
  }

  // Topic interests boost weights (skip dont_know and everything handled above)
  const topics = (input.topics ?? []).filter((t) => t !== "dont_know");
  for (const t of topics) {
    const keys = TOPIC_WEIGHT_KEYS[t];
    if (keys) {
      for (const k of keys) {
        weights[k] = (weights[k] ?? 0) + WEIGHT_BOOST_TOPIC;
      }
    } else if (t !== "everything") {
      weights[t] = (weights[t] ?? 0) + WEIGHT_BOOST_TOPIC;
    }
  }

  // Target-level base weights
  if (targetLevel === "beginner") {
    weights["money-basics"] = (weights["money-basics"] ?? 0) + 10;
    weights["budgeting"] = (weights["budgeting"] ?? 0) + 8;
    weights["emergency-fund"] = (weights["emergency-fund"] ?? 0) + 8;
    weights["level-1"] = (weights["level-1"] ?? 0) + 6;
    deprioritize["advanced-investing"] = DEPRIORITIZE_PENALTY;
    deprioritize["options"] = DEPRIORITIZE_PENALTY;
  } else if (targetLevel === "intermediate") {
    weights["investing-basics"] = (weights["investing-basics"] ?? 0) + 6;
    weights["retirement"] = (weights["retirement"] ?? 0) + 6;
    weights["level-2"] = (weights["level-2"] ?? 0) + 4;
  } else {
    weights["advanced-investing"] = (weights["advanced-investing"] ?? 0) + 8;
    weights["retirement"] = (weights["retirement"] ?? 0) + 6;
    weights["level-3"] = (weights["level-3"] ?? 0) + 4;
  }

  // Debt / credit card → boost debt and credit content
  if (hasCreditCardDebt(input) || !hasNoDebt(input)) {
    weights["debt"] = (weights["debt"] ?? 0) + 10;
    weights["credit"] = (weights["credit"] ?? 0) + 8;
  }

  // State
  const stateCode = input.stateCode ?? "";

  return {
    targetLevel,
    weights,
    deprioritize,
    stateCode,
  };
}
