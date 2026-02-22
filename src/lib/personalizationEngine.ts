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

/* ── Numeric proxies for range enums (for comparisons) ──── */

const SAVINGS_VALUE: Record<string, number> = {
  zero: 0, under_1k: 500, "1k_5k": 3_000, "5k_20k": 12_500, "20k_plus": 25_000,
};
const DEBT_VALUE: Record<string, number> = {
  zero: 0, under_1k: 500, "1k_10k": 5_000, "10k_50k": 30_000, "50k_plus": 60_000,
};
const INCOME_VALUE: Record<string, number> = {
  under_15k: 7_500, "15_30k": 22_500, "30_60k": 45_000,
  "60_100k": 80_000, "100k_plus": 130_000,
};

/* ── Derive experience level ─────────────────────────────── */

function deriveLevel(data: Partial<OnboardingData>): ExperienceLevel {
  const confidence = data.confidence ?? 3;
  const savings = data.savingsRange ?? "zero";
  const investingExp = data.investingExp;
  const income = data.incomeRange;

  // Advanced: invests regularly + high confidence + solid income
  if (
    investingExp === "yes_regularly" &&
    confidence >= 4 &&
    (income === "60_100k" || income === "100k_plus")
  ) {
    return "advanced";
  }

  // Beginner: no savings, never invested, or low confidence
  if (savings === "zero" || investingExp === "never" || confidence <= 2) {
    return "beginner";
  }

  // Intermediate: some savings, a little experience, medium confidence
  if (
    (SAVINGS_VALUE[savings] ?? 0) >= 1_000 &&
    investingExp === "a_little" &&
    confidence >= 3
  ) {
    return "intermediate";
  }

  return "beginner";
}

/* ── Derive focus areas ──────────────────────────────────── */

function deriveFocusAreas(data: Partial<OnboardingData>): string[] {
  const areas: string[] = [];

  const savings = SAVINGS_VALUE[data.savingsRange ?? "zero"] ?? 0;
  const debt    = DEBT_VALUE[data.debtRange ?? "zero"] ?? 0;
  const income  = INCOME_VALUE[data.incomeRange ?? "under_15k"] ?? 0;

  const goalsYear = data.goalsThisYear ?? [];
  const goals35   = data.goals3to5 ?? [];
  const benefits  = data.benefits ?? [];
  const stressors = data.moneyStressors ?? [];

  /* ── Budgeting (always for beginners / low income) ── */
  if ((data.confidence ?? 3) <= 3 || income < 30_000) {
    areas.push("budgeting");
  }

  /* ── Debt management: debt outweighs savings ── */
  if (debt > savings) areas.push("debt-management");

  /* ── Emergency fund: not in goals and low savings ── */
  const hasEmergencyGoal =
    goalsYear.includes("emergency_fund") || goals35.includes("emergency_fund");
  if (!hasEmergencyGoal && savings < 1_000) areas.push("emergency-fund");

  /* ── Investing fundamentals ── */
  if (
    data.investingExp === "never" ||
    goalsYear.includes("start_investing") ||
    goals35.includes("build_investments")
  ) {
    areas.push("investing-fundamentals");
  }

  /* ── Tax planning for freelancers ── */
  if (data.incomeType === "1099" || data.incomeType === "both") {
    areas.push("tax-planning");
  }

  /* ── Benefits optimization ── */
  if (benefits.includes("401k")) areas.push("retirement-401k");
  if (benefits.includes("hsa"))  areas.push("hsa-optimization");

  /* ── Credit & stressor-based ── */
  if (stressors.includes("credit_cards"))  areas.push("credit-management");
  if (stressors.includes("retirement"))    areas.push("retirement-planning");
  if (stressors.includes("taxes"))         areas.push("tax-planning");
  if (stressors.includes("budgeting"))     areas.push("budgeting");

  /* ── Home / large purchase ── */
  if (goals35.includes("save_home_down_payment")) areas.push("home-buying");

  return [...new Set(areas)]; // deduplicate
}

/* ── Urgency score (1–10) ────────────────────────────────── */

function deriveUrgency(data: Partial<OnboardingData>): number {
  let score = 5;

  const savings   = SAVINGS_VALUE[data.savingsRange ?? "zero"] ?? 0;
  const debt      = DEBT_VALUE[data.debtRange ?? "zero"] ?? 0;
  const confidence = data.confidence ?? 3;

  if (savings === 0)           score += 2;
  if (debt > 10_000)           score += 2;
  if (confidence <= 2)         score += 1;
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
