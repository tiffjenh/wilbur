/**
 * Deterministic lesson scoring engine.
 * Scores each lesson based on user profile using the exact matrix from spec.
 */
import type { BlockLesson } from "@/content/lessonTypes";
import type { OnboardingData } from "@/lib/onboardingSchema";

export interface UserProfile extends Omit<Partial<OnboardingData>, "stateCode"> {
  stateCode?: string;
  hasStateIncomeTax?: boolean;
  completedLessons?: string[];
  feedbackWeights?: Record<string, number>;
}

type TagScoreMap = Record<string, number>;

/** Score a single lesson given the user profile. Returns a numeric score. */
export function scoreLesson(lesson: BlockLesson, profile: UserProfile): number {
  const tagScores = buildTagScores(profile);
  let score = 0;

  // Sum scores for each tag the lesson has
  for (const tag of lesson.tags) {
    score += tagScores[tag] ?? 0;
  }

  // Add recommendedFor bonus
  if (lesson.recommendedFor) {
    const userConditionTags = buildConditionTags(profile);
    for (const tag of lesson.recommendedFor) {
      if (userConditionTags.has(tag)) {
        score += 8;
      }
    }
  }

  // Apply gating penalty
  score -= gatingPenalty(lesson, profile);

  // Apply feedback weights
  if (profile.feedbackWeights) {
    const fw = profile.feedbackWeights[lesson.slug] ?? 0;
    score += fw;
  }

  // Skip already completed lessons
  if (profile.completedLessons?.includes(lesson.slug)) {
    return -999;
  }

  return score;
}

/* ── Build tag score map from profile ─────────────────── */

function buildTagScores(profile: UserProfile): TagScoreMap {
  const scores: TagScoreMap = {};

  const add = (tag: string, points: number) => {
    scores[tag] = (scores[tag] ?? 0) + points;
  };

  /* 1. AGE RANGE */
  switch (profile.age) {
    case "under_18":
      add("money-basics", 10); add("budgeting", 10); add("emergency-fund", 8);
      add("home-buying", -10); add("advanced-investing", -10);
      break;
    case "18_22":
    case "23_27":
      add("investing-basics", 6); add("retirement", 6); add("credit", 5);
      break;
    case "28_34":
    case "35_44":
      add("home-buying", 8); add("investing-basics", 6); add("retirement", 6);
      break;
    case "45_plus":
      add("retirement", 8); add("level-4", 6);
      break;
  }

  /* 2. WORK STATUS */
  switch (profile.workStatus) {
    case "in_school":
      add("student-loans", 8); add("budgeting", 6); add("emergency-fund", 6);
      break;
    case "working":
      add("retirement", 6); add("investing-basics", 6); add("benefits", 5);
      break;
    case "both":
      add("irregular-income", 6); add("taxes-federal", 6);
      break;
    case "neither":
      add("budgeting", 8); add("emergency-fund", 8);
      break;
  }

  /* 3. INCOME TYPE */
  switch (profile.incomeType) {
    case "w2":
      add("retirement", 6); add("benefits", 6); add("taxes-federal", 4);
      break;
    case "1099":
      add("irregular-income", 10); add("taxes-federal", 10); add("budgeting", 6);
      break;
    case "both":
      add("irregular-income", 8); add("taxes-federal", 8);
      break;
    case "no_income":
      add("budgeting", 10); add("money-basics", 10);
      break;
  }

  /* 4. SAVINGS RANGE */
  switch (profile.savingsRange) {
    case "zero":
      add("emergency-fund", 15); add("budgeting", 10); add("money-basics", 8);
      add("advanced-investing", -8);
      break;
    case "under_1k":
      add("emergency-fund", 10);
      break;
    case "1k_5k":
    case "5k_20k":
      add("investing-basics", 6);
      break;
    case "20k_plus":
      add("investing-basics", 6); add("retirement", 6); add("level-4", 5);
      break;
  }

  /* 5. DEBT RANGE */
  switch (profile.debtRange) {
    case "zero":
      break;
    case "under_1k":
    case "1k_10k":
      add("debt", 10); add("credit", 8);
      break;
    case "10k_50k":
      add("debt", 15); add("credit", 10); add("advanced-investing", -5);
      break;
    case "50k_plus":
      add("debt", 20); add("student-loans", 10); add("advanced-investing", -10);
      break;
  }

  /* 6. BENEFITS */
  for (const benefit of profile.benefits ?? []) {
    switch (benefit) {
      case "401k":
        add("retirement", 10); add("benefits", 6);
        break;
      case "hsa":
        add("benefits", 8);
        break;
      case "fsa":
        add("benefits", 6);
        break;
      case "stock_options":
      case "rsu":
        add("equity-comp", 10); add("advanced-investing", 8);
        break;
    }
  }

  /* 7. INVESTING EXPERIENCE */
  switch (profile.investingExp) {
    case "never":
      add("investing-basics", 15); add("advanced-investing", -10); add("level-1", 6);
      break;
    case "a_little":
      add("investing-basics", 10); add("retirement", 4);
      break;
    case "yes_regularly":
      add("level-3", 8); add("advanced-investing", 10);
      break;
  }

  /* 8. GOALS THIS YEAR */
  for (const goal of profile.goalsThisYear ?? []) {
    switch (goal) {
      case "emergency_fund":   add("emergency-fund", 15); break;
      case "pay_debt":         add("debt", 15); break;
      case "start_investing":  add("investing-basics", 12); break;
      case "buy_car":          add("car-buying", 12); break;
      case "save_travel":      add("budgeting", 6); break;
      case "nothing":          add("money-basics", 5); break;
    }
  }

  /* 9. GOALS 3–5 YEARS */
  for (const goal of profile.goals3to5 ?? []) {
    switch (goal) {
      case "save_home_down_payment":
        add("home-buying", 15); add("taxes-state", 8);
        break;
      case "start_business":
        add("irregular-income", 12); add("taxes-federal", 8);
        break;
      case "build_investments":
        add("investing-basics", 15); add("advanced-investing", 8);
        break;
      case "buy_car":          add("car-buying", 8); break;
      case "pay_off_debt":     add("debt", 10); break;
      case "emergency_fund":   add("emergency-fund", 8); break;
    }
  }

  /* 10. STRESS AREAS */
  for (const stressor of profile.moneyStressors ?? []) {
    switch (stressor) {
      case "investing":     add("investing-basics", 12); break;
      case "taxes":         add("taxes-federal", 12); add("taxes-state", 10); break;
      case "credit_cards":  add("credit", 12); break;
      case "budgeting":     add("budgeting", 12); break;
      case "retirement":    add("retirement", 12); break;
      case "everything":    add("level-1", 8); break;
    }
  }

  /* 11. CONFIDENCE */
  const conf = profile.confidence ?? 3;
  if (conf <= 2) {
    add("level-1", 15); add("level-5", -10); add("visual-heavy", 10);
  } else if (conf === 3) {
    add("level-2", 8);
  } else if (conf === 4) {
    add("level-3", 8);
  } else {
    add("level-4", 10); add("level-5", 8);
  }

  /* 12. STATE */
  if (profile.stateCode) {
    if (profile.hasStateIncomeTax) {
      add("taxes-state", 10);
    } else {
      add("taxes-state", 6);
    }
  }

  return scores;
}

/* ── Build active condition tags for recommendedFor matching ── */

function buildConditionTags(profile: UserProfile): Set<string> {
  const tags = new Set<string>();

  const savingsVal = { zero: 0, under_1k: 500, "1k_5k": 3000, "5k_20k": 12500, "20k_plus": 25000 };
  const debtVal = { zero: 0, under_1k: 500, "1k_10k": 5000, "10k_50k": 30000, "50k_plus": 60000 };

  const savings = savingsVal[profile.savingsRange as keyof typeof savingsVal] ?? 0;
  const debt = debtVal[profile.debtRange as keyof typeof debtVal] ?? 0;
  const conf = profile.confidence ?? 3;

  if (savings === 0) tags.add("no-savings");
  if (savings > 0 && savings < 5000) tags.add("low-savings");
  if (debt > 0) tags.add("has-debt");

  if (profile.workStatus === "in_school") tags.add("student");
  if (profile.workStatus === "working" || profile.workStatus === "both") tags.add("working");

  if (profile.incomeType === "w2" || profile.incomeType === "both") tags.add("w2-income");
  if (profile.incomeType === "1099" || profile.incomeType === "both") tags.add("1099-income");
  if (profile.incomeType === "no_income") tags.add("no-income");

  const benefits = profile.benefits ?? [];
  if (benefits.length > 0 && !benefits.includes("none")) tags.add("has-benefits");
  if (benefits.includes("401k")) tags.add("has-401k");
  if (benefits.includes("hsa")) tags.add("has-hsa");
  if (benefits.includes("fsa")) tags.add("has-fsa");
  if (benefits.includes("stock_options") || benefits.includes("rsu")) tags.add("has-equity-comp");

  if (conf <= 2) tags.add("confidence-low");
  else if (conf === 3) tags.add("confidence-mid");
  else tags.add("confidence-high");

  const goalsYear = profile.goalsThisYear ?? [];
  const goals35 = profile.goals3to5 ?? [];
  if (goalsYear.includes("emergency_fund") || goals35.includes("emergency_fund")) tags.add("goal-emergency");
  if (goalsYear.includes("pay_debt") || goals35.includes("pay_off_debt")) tags.add("goal-debt");
  if (goalsYear.includes("start_investing") || goals35.includes("build_investments")) tags.add("goal-investing");
  if (goals35.includes("save_home_down_payment")) tags.add("goal-home");
  if (goalsYear.includes("buy_car") || goals35.includes("buy_car")) tags.add("goal-car");
  if (goals35.includes("start_business")) tags.add("goal-business");

  if (profile.hasStateIncomeTax === true) tags.add("state-income-tax");
  if (profile.hasStateIncomeTax === false) tags.add("state-no-income-tax");

  return tags;
}

/* ── Gating penalty ─────────────────────────────────────── */

function gatingPenalty(lesson: BlockLesson, profile: UserProfile): number {
  const conf = profile.confidence ?? 3;
  const savings = { zero: 0, under_1k: 500, "1k_5k": 3000, "5k_20k": 12500, "20k_plus": 25000 };
  const debt = { zero: 0, under_1k: 500, "1k_10k": 5000, "10k_50k": 30000, "50k_plus": 60000 };

  const savingsAmt = savings[profile.savingsRange as keyof typeof savings] ?? 0;
  const debtAmt = debt[profile.debtRange as keyof typeof debt] ?? 0;

  // Level 5 is gated: require confidence >= 4, savings > 1k, debt < 10k
  if (lesson.tags.includes("level-5")) {
    const thumbsUpInvesting = (profile.feedbackWeights ?? {})["investing-thumbs-up"] ?? 0;
    const meetsGate = conf >= 4 && savingsAmt > 1000 && debtAmt < 10000;
    if (!meetsGate && thumbsUpInvesting < 10) {
      return 9999;
    }
  }

  return 0;
}
