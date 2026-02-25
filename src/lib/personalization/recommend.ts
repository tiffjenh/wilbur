/**
 * Recommend lesson order from personalization profile and curriculum.
 * Deterministic, persona-based ordered paths. No sort, no merge, no domain-score ordering.
 */
import type { PersonalizationProfile } from "./scoring";
import type { PersonaId } from "@/personalization/types";
import { toTraits } from "./deriveTraits";
import { buildLearningPlan } from "./buildLearningPlan";
import type { LearningPlan } from "./traits";

/** Profile for recommend: may include persona for deterministic path selection. */
export type RecommendProfile = PersonalizationProfile & { persona?: PersonaId };

/** Minimal lesson shape for scoring (curriculum Lesson). */
export interface CurriculumLessonForRecommend {
  id: string;
  level: "beginner" | "intermediate" | "advanced";
  tags: string[];
  prerequisites: string[];
}

/** Map curriculum tag (snake_case) to profile weight key. */
const TAG_TO_WEIGHT_KEY: Record<string, string> = {
  money_foundations: "money-basics",
  emergency_fund: "emergency-fund",
  housing: "home-buying",
  rent_vs_buy: "home-buying",
  mortgage: "home-buying",
  down_payment: "down_payment",
  real_estate: "real-estate",
  advanced_investing: "advanced-investing",
  credit_score: "credit",
  student_loans: "student-loans",
  index_funds: "etfs",
  diversification: "investing-basics",
  systems_habits: "budgeting",
  payoff: "payoff",
};

function weightKey(tag: string): string {
  return TAG_TO_WEIGHT_KEY[tag] ?? tag.replace(/_/g, "-");
}

function getWeight(weights: Record<string, number>, tag: string): number {
  const key = weightKey(tag);
  return weights[key] ?? weights[tag] ?? 0;
}

function getDeprioritize(deprioritize: Record<string, number>, tag: string): number {
  const key = weightKey(tag);
  return deprioritize[key] ?? deprioritize[tag] ?? 0;
}

/** Level distance: 0 = match, 1 = one step, 2 = two steps. */
function levelDistance(
  lessonLevel: "beginner" | "intermediate" | "advanced",
  targetLevel: "beginner" | "intermediate" | "advanced"
): number {
  const order = ["beginner", "intermediate", "advanced"];
  return Math.abs(order.indexOf(lessonLevel) - order.indexOf(targetLevel));
}

const LEVEL_MATCH_BONUS = 20;
const LEVEL_ONE_STEP_BONUS = 8;
const LEVEL_FAR_PENALTY = -5;

function levelScore(
  lessonLevel: "beginner" | "intermediate" | "advanced",
  targetLevel: "beginner" | "intermediate" | "advanced"
): number {
  const d = levelDistance(lessonLevel, targetLevel);
  if (d === 0) return LEVEL_MATCH_BONUS;
  if (d === 1) return LEVEL_ONE_STEP_BONUS;
  return LEVEL_FAR_PENALTY;
}

const GOAL_TAG_BOOST = 10;

/** Goals boost: if lesson has tags that look like goal-related (high weight in profile), add bonus. */
function goalBoost(lesson: CurriculumLessonForRecommend, profile: PersonalizationProfile): number {
  let boost = 0;
  for (const tag of lesson.tags) {
    const w = getWeight(profile.weights, tag);
    if (w >= GOAL_TAG_BOOST) boost += GOAL_TAG_BOOST;
  }
  return boost;
}

function scoreLesson(lesson: CurriculumLessonForRecommend, profile: PersonalizationProfile): number {
  let score = 0;
  for (const tag of lesson.tags) {
    score += getWeight(profile.weights, tag);
    score -= getDeprioritize(profile.deprioritize, tag);
  }
  score += levelScore(lesson.level, profile.targetLevel);
  score += goalBoost(lesson, profile);
  return score;
}

/** Human-readable reasons for "Why recommended". */
const REASON_LEVEL_MATCH = "Matches your level";
const REASON_LEVEL_NEAR = "Right level for your path";
const REASON_GOAL = "Aligned with your goals";
const REASON_FOUNDATIONS = "Part of your foundations path";

/** Return score and reasons for a lesson (for display in Learning page). */
export function getLessonScoreAndReasons(
  lesson: CurriculumLessonForRecommend,
  profile: PersonalizationProfile
): { score: number; reasons: string[] } {
  const reasons: string[] = [];
  const levelDist = levelDistance(lesson.level, profile.targetLevel);
  if (levelDist === 0) reasons.push(REASON_LEVEL_MATCH);
  else if (levelDist === 1) reasons.push(REASON_LEVEL_NEAR);
  if (goalBoost(lesson, profile) > 0) reasons.push(REASON_GOAL);
  if (profile.targetLevel === "beginner" && (lesson.tags.some((t) => getWeight(profile.weights, t) > 0))) {
    reasons.push(REASON_FOUNDATIONS);
  }
  const score = scoreLesson(lesson, profile);
  return { score, reasons };
}

// NEW: plan-based recommendation (chunked + reasons)
export function recommendPlan(
  profile: RecommendProfile
): { recommendedLessonIds: string[]; plan: LearningPlan; lessonReasons: Record<string, string[]> } {
  const traits = toTraits(profile);
  const plan = buildLearningPlan(traits);
  return {
    recommendedLessonIds: plan.recommendedLessonIds,
    plan,
    lessonReasons: plan.lessonReasons,
  };
}

export function recommendLessons(
  profile: RecommendProfile,
  _curriculumLessons: CurriculumLessonForRecommend[]
): string[] {
  return recommendPlan(profile).recommendedLessonIds;
}
