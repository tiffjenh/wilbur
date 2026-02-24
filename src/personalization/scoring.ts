/**
 * Step 4: Deterministic scoring, tiers, persona, priorities, and gating.
 * No ML; all logic from questionnaire answers only.
 */
import {
  DEFAULT_DOMAIN_VISIBILITY,
  DOMAIN_DISPLAY_ORDER,
  type DomainId,
} from "@/content/domains";
import type {
  QuestionnaireAnswers,
  ScoreDimensions,
  DerivedTiers,
  PersonaId,
  PriorityArea,
  PriorityScores,
  GatingFlags,
  DomainVisibilityMap,
} from "./types";

function clamp(n: number, min: number, max: number) {
  return Math.max(min, Math.min(max, n));
}

function hasTopic(a: QuestionnaireAnswers, pattern: RegExp): boolean {
  return a.topicsInterestedIn.some((t) => pattern.test(t));
}

export function scoreAnswers(a: QuestionnaireAnswers): ScoreDimensions {
  const s: ScoreDimensions = {
    lifeStage: 0,
    incomeStability: 0,
    resourceLevel: 0,
    debtUrgency: 0,
    emergencyPreparedness: 2,
    investmentReadiness: 0,
    confidence: a.confidence, // 1-5
  };

  // Life stage
  s.lifeStage = (() => {
    switch (a.lifeStage) {
      case "high_school": return 0;
      case "college": return 1;
      case "early_career": return 2;
      case "mid_career": return 3;
      case "self_employed": return 3;
      case "career_change": return 2;
      case "retired": return 4;
      case "prefer_not": return 2;
    }
  })();

  // Income stability heuristic
  if (a.incomeType.includes("w2")) s.incomeStability += 3;
  if (a.incomeType.includes("1099")) s.incomeStability += 1;
  if (a.incomeType.includes("business_owner")) s.incomeStability += 1;
  if (a.incomeType.includes("investment_income")) s.incomeStability += 1;
  s.incomeStability = clamp(s.incomeStability, 0, 5);

  // Resource level
  s.resourceLevel = (() => {
    switch (a.incomeRange) {
      case "under_25": return 0;
      case "25_50": return 1;
      case "50_100": return 2;
      case "100_200": return 3;
      case "200_plus": return 4;
      case "prefer_not": return 2;
    }
  })();

  const fs = new Set(a.financialSituation);

  // Conflict resolution: if "no_debt" + any debt, ignore "no_debt"
  const hasDebtFlag = fs.has("credit_card_debt") || fs.has("student_loans");
  const effectiveNoDebt = fs.has("no_debt") && !hasDebtFlag;

  // Debt urgency
  if (fs.has("credit_card_debt")) s.debtUrgency += 4;
  if (fs.has("student_loans")) s.debtUrgency += 2;
  if (effectiveNoDebt) s.debtUrgency += 0;
  s.debtUrgency = clamp(s.debtUrgency, 0, 5);

  // Emergency preparedness
  if (fs.has("emergency_fund")) s.emergencyPreparedness += 2;
  else s.emergencyPreparedness -= 1;
  s.emergencyPreparedness = clamp(s.emergencyPreparedness, 0, 5);

  // Investment readiness
  s.investmentReadiness = (() => {
    switch (a.investingExperience) {
      case "never": return 0;
      case "brokerage_app": return 1;
      case "understand_etfs": return 2;
      case "actively_trade": return 3;
      case "options": return 4;
    }
  })();

  if (fs.has("invest_regularly")) s.investmentReadiness += 1;
  if (fs.has("never_invested")) s.investmentReadiness = Math.min(s.investmentReadiness, 1);
  s.investmentReadiness = clamp(s.investmentReadiness, 0, 5);

  return s;
}

export function deriveTiers(s: ScoreDimensions): DerivedTiers {
  const investmentReadinessTier =
    s.investmentReadiness <= 0 ? "new"
    : s.investmentReadiness === 1 ? "beginner"
    : s.investmentReadiness === 2 ? "beginner_plus"
    : "ready_deep_dives";

  const debtUrgencyTier =
    s.debtUrgency >= 4 ? "high" : s.debtUrgency >= 2 ? "medium" : "low";

  const stabilityTier =
    s.incomeStability >= 3 ? "stable" : s.incomeStability >= 2 ? "somewhat_stable" : "unstable";

  return { investmentReadinessTier, debtUrgencyTier, stabilityTier };
}

export function pickPersona(a: QuestionnaireAnswers, s: ScoreDimensions): PersonaId {
  const fs = new Set(a.financialSituation);

  // Students first
  if (a.lifeStage === "college" || a.lifeStage === "high_school") return "student_starter";

  // Independent earners
  const isIndependent = a.incomeType.includes("1099") || a.incomeType.includes("business_owner");
  if (isIndependent) return "independent_earner";

  // Debt stabilizer
  const highDebt = s.debtUrgency >= 4 && !fs.has("emergency_fund");
  if (highDebt) return "debt_stabilizer";

  // Home buyer
  const wantsHome = fs.has("want_buy_home") || a.primaryGoal === "save_for_home";
  if (wantsHome && s.incomeStability >= 2) return "home_buyer_planner";

  // Growth
  const growth = a.primaryGoal === "grow_faster" || a.primaryGoal === "retire_early";
  if (growth && s.investmentReadiness >= 2 && s.debtUrgency <= 2) return "growth_oriented_builder";

  // Catch-up
  if ((a.lifeStage === "mid_career" || a.lifeStage === "retired") && s.investmentReadiness <= 1) {
    return "catch_up_builder";
  }

  // Default
  if (a.lifeStage === "early_career") return "early_career_builder";
  return "early_career_builder";
}

export function scorePriorities(a: QuestionnaireAnswers, s: ScoreDimensions): PriorityScores {
  const p: PriorityScores = {
    stabilize: 0,
    high_interest_debt: 0,
    student_loans: 0,
    work_benefits: 0,
    investing_basics: 0,
    stocks_deep_dive: 0,
    crypto: 0,
    real_estate_home_buying: 0,
    short_term_rentals: 0,
    taxes: 0,
    insurance: 0,
    side_income: 0,
  };

  const fs = new Set(a.financialSituation);

  // Stabilize
  p.stabilize += (5 - s.emergencyPreparedness);
  p.stabilize += (6 - s.confidence); // confidence is 1-5

  // Debt
  if (fs.has("credit_card_debt")) p.high_interest_debt += 6;
  p.high_interest_debt += s.debtUrgency;

  if (fs.has("student_loans")) p.student_loans += 5;

  // Work benefits
  if (a.incomeType.includes("w2")) p.work_benefits += 3;
  if (a.lifeStage === "early_career" || a.lifeStage === "mid_career") p.work_benefits += 2;

  // Investing basics
  p.investing_basics += 3;
  if (a.primaryGoal === "start_investing") p.investing_basics += 3;

  // Taxes
  if (a.incomeType.includes("1099") || a.incomeType.includes("business_owner")) p.taxes += 6;
  else p.taxes += 2;

  // Real estate
  if (fs.has("want_buy_home") || a.primaryGoal === "save_for_home") p.real_estate_home_buying += 6;

  // Side income
  if (hasTopic(a, /side income|entrepreneur/i) || a.primaryGoal === "passive_income") p.side_income += 4;

  // Topic interest (light bias only)
  if (hasTopic(a, /stocks/i)) p.stocks_deep_dive += 2;
  if (hasTopic(a, /crypto/i)) p.crypto += 2;
  if (hasTopic(a, /short-term rentals|airbnb|vrbo/i)) p.short_term_rentals += 2;

  // Insurance (light)
  p.insurance += s.confidence <= 2 ? 2 : 1;

  return p;
}

export function computeGating(s: ScoreDimensions): GatingFlags {
  const unlockStocksDeepDive =
    s.investmentReadiness >= 2 && s.confidence >= 3 && s.debtUrgency <= 3;

  const unlockCrypto =
    s.investmentReadiness >= 2 && s.confidence >= 3 && s.debtUrgency <= 3;

  const unlockSTR =
    s.investmentReadiness >= 2 && s.confidence >= 3 && s.debtUrgency <= 2;

  const unlockAdvancedInvesting =
    s.investmentReadiness >= 3 && s.confidence >= 4 && s.debtUrgency <= 2;

  return { unlockStocksDeepDive, unlockCrypto, unlockSTR, unlockAdvancedInvesting };
}

export function computeDomainVisibility(
  a: QuestionnaireAnswers,
  s: ScoreDimensions,
  gating: GatingFlags
): DomainVisibilityMap {
  const v: DomainVisibilityMap = { ...DEFAULT_DOMAIN_VISIBILITY };
  const fs = new Set(a.financialSituation);

  // Always required
  v.moneyFoundations = "required";
  v.investingBasics = "required";

  // Often required
  v.budgetingCashFlow = (s.emergencyPreparedness <= 2 || s.debtUrgency >= 2) ? "required" : "recommended";
  v.creditDebt = fs.has("credit_card_debt") ? "required" : "recommended";

  // Conditional
  v.studentLoans = fs.has("student_loans") ? "recommended" : "optional";
  // Work Benefits & Retirement: at least recommended for W-2 (core early-career need)
  v.workBenefitsRetirement = a.incomeType.includes("w2") ? "recommended" : "optional";
  v.taxes = (a.incomeType.includes("1099") || a.incomeType.includes("business_owner")) ? "recommended" : "optional";

  v.realEstateHomeBuying = (fs.has("want_buy_home") || a.primaryGoal === "save_for_home") ? "recommended" : "optional";

  // Gated domains (visibility depends on learningMode too)
  const applyGating = a.learningMode === "tailored";
  v.stocksDeepDive = (applyGating && gating.unlockStocksDeepDive) ? "optional" : "suppressed";
  v.cryptocurrency = (applyGating && gating.unlockCrypto) ? "optional" : "suppressed";
  v.shortTermRentals = (applyGating && gating.unlockSTR) ? "optional" : "locked";
  v.advancedInvesting = (applyGating && gating.unlockAdvancedInvesting) ? "optional" : "locked";

  v.stateGuides = a.state ? "optional" : "suppressed";

  return v;
}

export function topN<T extends string>(scores: Record<T, number>, n: number): T[] {
  return (Object.keys(scores) as T[])
    .sort((a, b) => (scores[b] ?? 0) - (scores[a] ?? 0))
    .slice(0, n);
}

export const PRIORITY_ORDER: PriorityArea[] = [
  "stabilize",
  "high_interest_debt",
  "student_loans",
  "work_benefits",
  "investing_basics",
  "taxes",
  "insurance",
  "real_estate_home_buying",
  "stocks_deep_dive",
  "crypto",
  "short_term_rentals",
  "side_income",
];

/** Map PriorityArea to primary DomainId for recommended/explore order. */
export const PRIORITY_AREA_TO_DOMAIN: Record<PriorityArea, DomainId> = {
  stabilize: "moneyFoundations",
  high_interest_debt: "creditDebt",
  student_loans: "studentLoans",
  work_benefits: "workBenefitsRetirement",
  investing_basics: "investingBasics",
  stocks_deep_dive: "stocksDeepDive",
  crypto: "cryptocurrency",
  real_estate_home_buying: "realEstateHomeBuying",
  short_term_rentals: "shortTermRentals",
  taxes: "taxes",
  insurance: "insuranceRisk",
  side_income: "sideIncomeEntrepreneurship",
};

/** Ordered list of domains for "recommended" (from top priorities + next by score). */
export function getRecommendedDomainsOrdered(
  topPriorities: PriorityArea[],
  priorityScores: PriorityScores,
  gating: GatingFlags
): DomainId[] {
  const seen = new Set<DomainId>();
  const out: DomainId[] = [];

  for (const area of topPriorities) {
    const domain = PRIORITY_AREA_TO_DOMAIN[area];
    if (domain && !seen.has(domain)) {
      if (area === "stocks_deep_dive" && !gating.unlockStocksDeepDive) continue;
      if (area === "crypto" && !gating.unlockCrypto) continue;
      if (area === "short_term_rentals" && !gating.unlockSTR) continue;
      seen.add(domain);
      out.push(domain);
    }
  }

  const rest = PRIORITY_ORDER.filter((a) => !topPriorities.includes(a))
    .sort((a, b) => priorityScores[b] - priorityScores[a]);

  for (const area of rest) {
    if (out.length >= 8) break;
    const domain = PRIORITY_AREA_TO_DOMAIN[area];
    if (domain && !seen.has(domain)) {
      if (area === "stocks_deep_dive" && !gating.unlockStocksDeepDive) continue;
      if (area === "crypto" && !gating.unlockCrypto) continue;
      if (area === "short_term_rentals" && !gating.unlockSTR) continue;
      seen.add(domain);
      out.push(domain);
    }
  }

  return out;
}

/** Domains for "explore later" (next 2–3 by score, not in top priorities). */
export function getExploreLaterDomains(
  topPriorities: PriorityArea[],
  priorityScores: PriorityScores,
  gating: GatingFlags
): DomainId[] {
  const recommended = getRecommendedDomainsOrdered(topPriorities, priorityScores, gating);
  const recommendedSet = new Set(recommended);
  const rest = DOMAIN_DISPLAY_ORDER.filter((d) => !recommendedSet.has(d));
  return rest.slice(0, 3);
}
