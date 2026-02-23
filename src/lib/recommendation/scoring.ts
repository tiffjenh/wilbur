import type { Lesson, QuestionnaireAnswers, LessonTag, LessonFeedback } from "./types";
import { getStateTaxProfile } from "./stateTax";

type ScoreResult = { score: number; reasons: string[] };

const add = (res: ScoreResult, points: number, reason: string) => {
  res.score += points;
  res.reasons.push(`${points > 0 ? "+" : ""}${points} ${reason}`);
};

function debtToTier(debt: QuestionnaireAnswers["debt"]): "none" | "low" | "mid" | "high" {
  if (debt === "0") return "none";
  if (debt === "<1k" || debt === "1k-10k") return "low";
  if (debt === "10k-50k") return "mid";
  return "high";
}

function savingsToTier(s: QuestionnaireAnswers["savings"]): "none" | "low" | "mid" | "high" {
  if (s === "0") return "none";
  if (s === "<1k" || s === "1k-5k") return "low";
  if (s === "5k-20k") return "mid";
  return "high";
}

/** Learning tier derived from answers — used for path diversity and stability penalty. */
export type LearningTier = "beginner" | "intermediate" | "advanced";

export function getLearningTier(a: QuestionnaireAnswers): LearningTier {
  const debtTier = debtToTier(a.debt);
  const invested = a.investedBefore;
  const conf = a.confidence;

  if (
    (invested === "regularly" || invested === "a-little") &&
    conf >= 4 &&
    debtTier === "none"
  ) {
    return "advanced";
  }
  if (
    invested === "regularly" ||
    (invested === "a-little" && conf >= 3) ||
    (conf >= 4 && debtTier === "none")
  ) {
    return "intermediate";
  }
  return "beginner";
}

function hasTag(lesson: Lesson, tag: LessonTag) {
  return lesson.tags.includes(tag);
}

function matchesAny(lesson: Lesson, tags: LessonTag[]) {
  return tags.some(t => lesson.tags.includes(t));
}

/** True if this lesson is "advanced" relative to profile — used for soft warning on Lesson page, not for excluding. */
export function shouldWarnLesson(
  lesson: Lesson,
  a: QuestionnaireAnswers,
  feedbackMap: Record<string, LessonFeedback | undefined> = {},
): boolean {
  if (lesson.level !== "level-5") {
    // Also warn for advanced-investing when user never invested / low confidence
    if (lesson.tags.includes("advanced-investing")) {
      if (a.investedBefore === "never" || a.confidence <= 2) return true;
      const debtTier = debtToTier(a.debt);
      const savingsTier = savingsToTier(a.savings);
      if (savingsTier === "none" || debtTier === "high") return true;
    }
    return false;
  }

  const debtTier = debtToTier(a.debt);
  const savingsTier = savingsToTier(a.savings);

  const thumbsUpOnInvesting = Object.entries(feedbackMap).some(([lessonId, fb]) => {
    if (fb !== "more_like_this") return false;
    return lessonId.includes("invest") || lessonId.includes("stock") || lessonId.includes("retire");
  });

  const okByProfile =
    a.confidence >= 4 &&
    savingsTier !== "none" &&
    (debtTier === "none" || debtTier === "low");

  return !(okByProfile || thumbsUpOnInvesting);
}

/** Legacy: true if lesson would have been gated (used only for soft score penalty). */
function isLessonAdvancedForProfile(lesson: Lesson, a: QuestionnaireAnswers, feedbackMap: Record<string, LessonFeedback | undefined>): boolean {
  return shouldWarnLesson(lesson, a, feedbackMap);
}

export function scoreLesson(
  lesson: Lesson,
  a: QuestionnaireAnswers,
  feedbackMap: Record<string, LessonFeedback | undefined>,
  allLessons: Lesson[] = [],
): ScoreResult {
  const res: ScoreResult = { score: 0, reasons: [] };

  const debtTierForTier = debtToTier(a.debt);
  const learningTier = getLearningTier(a);
  const wantsStability =
    debtTierForTier !== "none" ||
    a.confidence <= 2 ||
    a.stressors.includes("budgeting") ||
    a.goalsThisYear.some((g) => g === "emergency_fund" || g === "pay_off_debt") ||
    a.goals3to5.some((g) => g === "emergency_fund" || g === "pay_off_debt");

  // Base priorities by topic (stability first) — reduce stability base for advanced/intermediate when they don't need it
  if (matchesAny(lesson, ["money-basics", "budgeting", "emergency-fund"])) {
    if (learningTier === "advanced" && !wantsStability) {
      add(res, -12, "advanced: deprioritize stability");
    } else if (learningTier === "intermediate" && !wantsStability) {
      add(res, 2, "intermediate: light stability");
    } else {
      add(res, 15, "stability base");
    }
  }
  if (matchesAny(lesson, ["debt", "credit", "student-loans"])) add(res, 12, "risk/avoid mistakes base");
  if (matchesAny(lesson, ["investing-basics", "retirement", "benefits"])) add(res, 10, "growth base");
  if (matchesAny(lesson, ["taxes-federal", "taxes-state"])) add(res, 8, "tax base");
  if (matchesAny(lesson, ["insurance", "fraud-protection"])) add(res, 6, "protection base");

  // Age
  if (a.ageRange === "under-18") {
    if (matchesAny(lesson, ["money-basics", "budgeting", "emergency-fund"])) add(res, 10, "under 18 focus");
    if (matchesAny(lesson, ["home-buying", "advanced-investing"])) add(res, -10, "under 18 not relevant");
  } else if (a.ageRange === "18-22" || a.ageRange === "23-27") {
    if (matchesAny(lesson, ["credit", "investing-basics", "retirement"])) add(res, 6, "early career focus");
  } else if (a.ageRange === "28-34" || a.ageRange === "35-44") {
    if (hasTag(lesson, "home-buying")) add(res, 8, "prime home window");
    if (matchesAny(lesson, ["investing-basics", "retirement"])) add(res, 6, "prime growth window");
    if (hasTag(lesson, "retirement")) add(res, 4, "retirement planning");
    if (hasTag(lesson, "insurance")) add(res, 4, "insurance relevance");
  } else if (a.ageRange === "45+") {
    if (hasTag(lesson, "retirement")) add(res, 12, "retirement priority");
    if (hasTag(lesson, "insurance")) add(res, 8, "insurance relevance");
    if (matchesAny(lesson, ["taxes-federal", "taxes-state"])) add(res, 6, "tax planning");
    if (hasTag(lesson, "level-4")) add(res, 6, "optimization priority");
  }

  // Work status
  if (a.workStatus === "school") {
    if (hasTag(lesson, "student-loans")) add(res, 8, "student loans relevance");
    if (matchesAny(lesson, ["budgeting", "emergency-fund"])) add(res, 6, "student stability");
  } else if (a.workStatus === "working") {
    if (matchesAny(lesson, ["retirement", "benefits"])) add(res, 6, "work benefits relevance");
  } else if (a.workStatus === "both") {
    if (matchesAny(lesson, ["irregular-income", "taxes-federal"])) add(res, 6, "mixed income relevance");
  } else {
    if (matchesAny(lesson, ["budgeting", "emergency-fund"])) add(res, 8, "no income stability");
  }

  // Income type
  if (a.incomeType === "w2") {
    if (matchesAny(lesson, ["retirement", "benefits"])) add(res, 6, "W2 benefits");
    if (hasTag(lesson, "taxes-federal")) add(res, 4, "W2 tax basics");
  }
  if (a.incomeType === "1099") {
    if (matchesAny(lesson, ["irregular-income", "taxes-federal"])) add(res, 10, "1099 tax & cashflow");
  }
  if (a.incomeType === "both") {
    if (matchesAny(lesson, ["irregular-income", "taxes-federal"])) add(res, 8, "W2+1099 complexity");
  }
  if (a.incomeType === "none") {
    if (matchesAny(lesson, ["money-basics", "budgeting"])) add(res, 10, "no income fundamentals");
  }

  // Savings / debt tiers
  const debtTier = debtTierForTier;
  const savingsTier = savingsToTier(a.savings);

  if (savingsTier === "none") {
    if (hasTag(lesson, "emergency-fund")) add(res, 15, "no savings: emergency fund");
    if (hasTag(lesson, "budgeting")) add(res, 10, "no savings: budget");
    if (hasTag(lesson, "advanced-investing")) add(res, -8, "no savings: avoid advanced");
  } else if (savingsTier === "low") {
    if (hasTag(lesson, "emergency-fund")) add(res, 10, "low savings: emergency fund");
  } else {
    if (matchesAny(lesson, ["investing-basics", "retirement"])) add(res, 6, "savings supports growth");
  }

  if (debtTier === "low") {
    if (matchesAny(lesson, ["debt", "credit"])) add(res, 10, "has debt: learn payoff");
  } else if (debtTier === "mid") {
    if (matchesAny(lesson, ["debt", "credit"])) add(res, 15, "mid debt: prioritize payoff");
    if (hasTag(lesson, "advanced-investing")) add(res, -5, "mid debt: deprioritize advanced");
  } else if (debtTier === "high") {
    if (matchesAny(lesson, ["debt", "credit", "student-loans"])) add(res, 20, "high debt: focus payoff");
    if (hasTag(lesson, "advanced-investing")) add(res, -10, "high debt: avoid advanced");
  }

  // Benefits
  const benefits = new Set(a.benefits);
  if (benefits.has("401k") && hasTag(lesson, "retirement")) add(res, 10, "has 401k");
  if ((benefits.has("hsa") || benefits.has("fsa")) && hasTag(lesson, "benefits")) add(res, 8, "has HSA/FSA");
  if (benefits.has("equity_comp") && matchesAny(lesson, ["equity-comp", "advanced-investing"])) add(res, 10, "has equity comp");

  // Investing experience
  const skipInvesting101 =
    (a.investedBefore === "regularly" || (a.investedBefore === "a-little" && a.confidence >= 3)) &&
    lesson.id === "investing-101";
  if (skipInvesting101) {
    add(res, -25, "you've invested before: skipping beginner investing");
  }
  if (a.investedBefore === "never") {
    if (hasTag(lesson, "investing-basics")) add(res, 15, "never invested");
    if (hasTag(lesson, "advanced-investing")) add(res, -10, "never invested: avoid advanced");
    if (hasTag(lesson, "level-1")) add(res, 6, "beginner sequencing");
  } else if (a.investedBefore === "a-little") {
    if (hasTag(lesson, "investing-basics")) add(res, 10, "some investing");
    if (hasTag(lesson, "retirement")) add(res, 4, "retirement pairing");
  } else {
    if (hasTag(lesson, "advanced-investing")) add(res, 10, "regular investor");
    if (hasTag(lesson, "level-3")) add(res, 8, "growth readiness");
  }

  // Goals
  for (const g of a.goalsThisYear) {
    if (g === "emergency_fund" && hasTag(lesson, "emergency-fund")) add(res, 15, "goal: emergency fund");
    if (g === "pay_off_debt" && hasTag(lesson, "debt")) add(res, 15, "goal: pay off debt");
    if (g === "start_investing" && hasTag(lesson, "investing-basics")) add(res, 12, "goal: start investing");
    if (g === "buy_car" && hasTag(lesson, "car-buying")) add(res, 12, "goal: buy car");
    if (g === "travel" && hasTag(lesson, "budgeting")) add(res, 6, "goal: travel");
    if (g === "nothing_specific" && hasTag(lesson, "money-basics")) add(res, 5, "goal: foundations");
  }

  for (const g of a.goals3to5) {
    if (g === "home_down_payment" && hasTag(lesson, "home-buying")) add(res, 18, "goal: home down payment");
    if (g === "home_down_payment" && hasTag(lesson, "credit")) add(res, 10, "goal: credit for mortgage");
    if (g === "buy_car" && hasTag(lesson, "car-buying")) add(res, 10, "goal: car");
    if (g === "start_business" && matchesAny(lesson, ["irregular-income", "taxes-federal"])) add(res, 12, "goal: business");
    if (g === "build_investments" && matchesAny(lesson, ["investing-basics", "advanced-investing"])) add(res, 15, "goal: build investments");
    if (g === "pay_off_debt" && hasTag(lesson, "debt")) add(res, 15, "goal: pay off debt");
    if (g === "emergency_fund" && hasTag(lesson, "emergency-fund")) add(res, 12, "goal: emergency fund");
    if (g === "not_sure" && hasTag(lesson, "money-basics")) add(res, 6, "goal: not sure");
  }

  // Stressors
  for (const s of a.stressors) {
    if (s === "investing" && hasTag(lesson, "investing-basics")) add(res, 12, "stressor: investing");
    if (s === "taxes" && matchesAny(lesson, ["taxes-federal", "taxes-state"])) add(res, 12, "stressor: taxes");
    if (s === "credit_cards" && hasTag(lesson, "credit")) add(res, 12, "stressor: credit cards");
    if (s === "budgeting" && hasTag(lesson, "budgeting")) add(res, 12, "stressor: budgeting");
    if (s === "retirement" && hasTag(lesson, "retirement")) add(res, 12, "stressor: retirement");
    if (s === "everything" && hasTag(lesson, "level-1")) add(res, 8, "stressor: everything");
  }

  // Confidence
  if (a.confidence <= 2) {
    if (hasTag(lesson, "level-1")) add(res, 15, "confidence low: foundations");
    if (hasTag(lesson, "level-5")) add(res, -10, "confidence low: avoid advanced");
    if (hasTag(lesson, "visual-heavy")) add(res, 10, "confidence low: visual-heavy");
  } else if (a.confidence === 3) {
    if (hasTag(lesson, "level-2")) add(res, 8, "confidence mid: setup");
  } else if (a.confidence === 4) {
    if (hasTag(lesson, "level-3")) add(res, 8, "confidence high: growth");
  } else {
    if (hasTag(lesson, "level-4")) add(res, 10, "confidence very high: optimization");
    if (hasTag(lesson, "level-5")) add(res, 8, "confidence very high: advanced ok");
  }

  // State tax
  const state = getStateTaxProfile(a.stateCode);
  if (state) {
    if (hasTag(lesson, "taxes-state")) add(res, state.hasStateIncomeTax ? 10 : 6, "state tax relevance");
  }

  // Tag-based feedback: boost/penalize lessons that share tags with 👍/👎/🧠 lessons
  if (allLessons.length) {
    const tagsFromMoreLike = new Set<string>();
    const tagsFromNotRelevant = new Set<string>();
    const tagsFromAlreadyKnow = new Set<string>();
    for (const [lid, fb] of Object.entries(feedbackMap)) {
      if (!fb) continue;
      const found = allLessons.find((l) => l.id === lid);
      if (!found) continue;
      if (fb === "more_like_this") found.tags.forEach((t) => tagsFromMoreLike.add(t));
      else if (fb === "not_relevant") found.tags.forEach((t) => tagsFromNotRelevant.add(t));
      else if (fb === "already_know_this") found.tags.forEach((t) => tagsFromAlreadyKnow.add(t));
    }
    const lessonTags = new Set(lesson.tags);
    for (const t of tagsFromMoreLike) {
      if (lessonTags.has(t as LessonTag)) {
        add(res, 8, "similar to lesson you liked");
        break;
      }
    }
    for (const t of tagsFromNotRelevant) {
      if (lessonTags.has(t as LessonTag)) {
        add(res, -10, "similar to lesson you said not relevant");
        break;
      }
    }
    for (const t of tagsFromAlreadyKnow) {
      if (lessonTags.has(t as LessonTag)) {
        add(res, -6, "similar to topic you already know");
        break;
      }
    }
  }

  // Per-lesson feedback (direct hit: this lesson was rated)
  for (const [lessonId, fb] of Object.entries(feedbackMap)) {
    if (!fb || lessonId !== lesson.id) continue;
    if (fb === "not_relevant") add(res, -15, "you said not relevant");
    if (fb === "already_know_this") add(res, -20, "you said already know");
    if (fb === "more_like_this") add(res, +5, "you said more like this");
  }

  // Soft penalty for advanced lessons (do not exclude — just rank lower)
  if (isLessonAdvancedForProfile(lesson, a, feedbackMap)) add(res, -50, "advanced for profile");

  return res;
}
