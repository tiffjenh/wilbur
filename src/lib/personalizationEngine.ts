/**
 * Personalization Engine
 * Computes a LearningProfile from questionnaire answers and generates
 * a lesson roadmap using the deterministic scoring system.
 */
import type { OnboardingData } from "./onboardingSchema";
import { toQuestionnaireAnswers } from "./recommendation/adapter";
import { LESSON_CATALOG } from "@/content/lessons/lessonCatalog";
import { generateLearningPath } from "./recommendation/generatePath";

/* ── Types ──────────────────────────────────────────────── */

export type ExperienceLevel = "beginner" | "intermediate" | "advanced";

export interface LearningProfile {
  level: ExperienceLevel;
  focusAreas: string[];
  urgencyScore: number;       // 1–10
  recommendedPath: string[];  // ordered lesson slugs
  confidenceScore: number;    // 1–5 from Q12
  generatedAt: string;        // ISO timestamp
}

/** QuestionnaireAnswers mirrors OnboardingData — alias for external clarity */
export type QuestionnaireAnswers = OnboardingData;

/* ── Storage keys ────────────────────────────────────────── */

export const LS_PROFILE_KEY = "wilbur_learning_profile";

/* ── Derive experience level from new schema ─────────────────────────────── */

function deriveLevel(data: Partial<OnboardingData>): ExperienceLevel {
  const confidence = data.confidence ?? 3;
  const emergencySavings = data.emergencySavings ?? "zero";
  const investingExp = data.investingExp;
  const topics = data.topics ?? [];

  if (topics.includes("dont_know") || investingExp === "never" || confidence <= 2) {
    return "beginner";
  }
  if (emergencySavings === "zero" || emergencySavings === "less_than_1mo") {
    return "beginner";
  }
  if (
    (investingExp === "regularly" || investingExp === "advanced") &&
    confidence >= 4 &&
    (emergencySavings === "3_6mo" || emergencySavings === "6_plus")
  ) {
    return "advanced";
  }
  if (
    investingExp === "a_little" &&
    confidence >= 3 &&
    (emergencySavings === "3_6mo" || emergencySavings === "6_plus")
  ) {
    return "intermediate";
  }
  return "beginner";
}

/* ── Derive focus areas from new schema ──────────────────────────────────── */

function deriveFocusAreas(data: Partial<OnboardingData>): string[] {
  const areas: string[] = [];
  const goals35 = data.goals3to5 ?? [];
  const topics = data.topics ?? [];
  const debtTypes = data.debtTypes ?? [];
  const hasDebt = debtTypes.length > 0 && !debtTypes.includes("no_debt");

  if ((data.confidence ?? 3) <= 3) areas.push("budgeting");
  if (hasDebt) areas.push("debt-management");
  const emergencySavings = data.emergencySavings ?? "zero";
  if (emergencySavings === "zero" || emergencySavings === "less_than_1mo") areas.push("emergency-fund");
  if (data.investingExp === "never" || goals35.includes("grow_investments")) areas.push("investing-fundamentals");
  if (data.workSituation === "self_employed" || data.workSituation === "w2_and_side") areas.push("tax-planning");
  if (topics.includes("budgeting")) areas.push("budgeting");
  if (topics.includes("credit_debt")) areas.push("credit-management");
  if (topics.includes("retirement_accounts") || topics.includes("financial_independence")) areas.push("retirement-planning");
  if (topics.includes("taxes")) areas.push("tax-planning");
  if (goals35.includes("home_down_payment")) areas.push("home-buying");

  return [...new Set(areas)];
}

/* ── Urgency score (1–10) ────────────────────────────────── */

function deriveUrgency(data: Partial<OnboardingData>): number {
  let score = 5;
  const confidence = data.confidence ?? 3;
  const emergencySavings = data.emergencySavings ?? "zero";
  const debtTypes = data.debtTypes ?? [];
  const hasDebt = debtTypes.length > 0 && !debtTypes.includes("no_debt");

  if (emergencySavings === "zero" || emergencySavings === "less_than_1mo") score += 2;
  if (hasDebt) score += 2;
  if (confidence <= 2) score += 1;
  if (data.investingExp === "never") score += 1;

  return Math.min(10, Math.max(1, score));
}

/* ── Focus area → ordered lesson slugs ──────────────────── */

const FOCUS_TO_LESSONS: Record<string, string[]> = {
  budgeting:               ["budgeting-101", "50-30-20-rule", "tracking-spending"],
  "emergency-fund":        ["emergency-fund"],
  "debt-management":       ["paying-off-debt", "credit-score-101"],
  "investing-fundamentals":["what-is-investing", "risk-vs-return", "compound-interest"],
  "tax-planning":          ["w2-vs-1099"],
  "retirement-401k":       ["roth-ira"],
  "hsa-optimization":      ["health-insurance-101"],
  "credit-management":     ["credit-vs-debit", "credit-score-101"],
  "retirement-planning":   ["roth-ira"],
  "home-buying":           ["renting-vs-buying"],
};

/* ── Foundation lessons by level ────────────────────────── */

const FOUNDATION_BY_LEVEL: Record<ExperienceLevel, string[]> = {
  beginner:     ["banking-basics", "budgeting-101", "emergency-fund"],
  intermediate: ["budgeting-101",  "credit-score-101", "what-is-investing"],
  advanced:     ["risk-vs-return", "compound-interest", "roth-ira"],
};

/* ── Build the recommended path ─────────────────────────── */

function generateRecommendedPath(
  level: ExperienceLevel,
  focusAreas: string[],
  data: Partial<OnboardingData>,
): string[] {
  // Use the new deterministic scoring engine
  try {
    const answers = toQuestionnaireAnswers(data);
    const scored = generateLearningPath(LESSON_CATALOG, answers, { maxLessons: 8 });
    if (scored.length > 0) {
      return scored.map((l) => l.id);
    }
  } catch {
    // Fall back to legacy path
  }

  // Legacy fallback
  const path: string[] = [...FOUNDATION_BY_LEVEL[level]];
  for (const area of focusAreas) {
    for (const slug of FOCUS_TO_LESSONS[area] ?? []) {
      if (!path.includes(slug)) path.push(slug);
    }
  }
  return path.slice(0, 8);
}

/* ── Public API ──────────────────────────────────────────── */

/** Compute a full LearningProfile from questionnaire answers. */
export function computeLearningProfile(
  data: Partial<OnboardingData>,
): LearningProfile {
  const level           = deriveLevel(data);
  const focusAreas      = deriveFocusAreas(data);
  const urgencyScore    = deriveUrgency(data);
  const recommendedPath = generateRecommendedPath(level, focusAreas, data);
  const confidenceScore = data.confidence ?? 3;

  return {
    level,
    focusAreas,
    urgencyScore,
    recommendedPath,
    confidenceScore,
    generatedAt: new Date().toISOString(),
  };
}

/** Persist profile to localStorage (and Supabase stub for future auth). */
export function saveProfile(profile: LearningProfile): void {
  try {
    localStorage.setItem(LS_PROFILE_KEY, JSON.stringify(profile));
  } catch {
    /* ignore */
  }
  // Supabase stub: when auth is added, call saveProfileToSupabase(profile) here
}

/** Load profile from localStorage. Returns null if absent or invalid. */
export function loadProfile(): LearningProfile | null {
  try {
    const raw = localStorage.getItem(LS_PROFILE_KEY);
    if (!raw) return null;
    return JSON.parse(raw) as LearningProfile;
  } catch {
    return null;
  }
}

/** Clear stored profile (call when user restarts questionnaire). */
export function clearProfile(): void {
  try {
    localStorage.removeItem(LS_PROFILE_KEY);
  } catch {
    /* ignore */
  }
}

/** Return a human-readable label for the experience level. */
export function levelLabel(level: ExperienceLevel): string {
  return { beginner: "Beginner", intermediate: "Builder", advanced: "Advanced" }[level];
}
