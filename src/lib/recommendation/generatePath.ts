/**
 * Learning path generation engine.
 * Scores all lessons and returns a personalized ordered list.
 */
import type { BlockLesson } from "@/content/lessonTypes";
import { ALL_LESSONS } from "@/content/lessons";
import { scoreLesson, type UserProfile } from "./scoreLesson";

export type FeedbackType = "thumbs-up" | "thumbs-down" | "already-know";

export interface FeedbackEntry {
  lessonId: string;
  type: FeedbackType;
  timestamp: string;
}

const LS_FEEDBACK_KEY = "wilbur_lesson_feedback";
const LS_COMPLETED_KEY = "wilbur_completed_lessons";
const LS_FEEDBACK_WEIGHTS_KEY = "wilbur_feedback_weights";

/* ── Feedback persistence ─────────────────────────────── */

export function recordFeedback(entry: FeedbackEntry): void {
  try {
    const existing = loadFeedback();
    existing.push(entry);
    localStorage.setItem(LS_FEEDBACK_KEY, JSON.stringify(existing));

    // Update weights
    const weights = loadFeedbackWeights();
    switch (entry.type) {
      case "thumbs-up":    weights[entry.lessonId] = (weights[entry.lessonId] ?? 0) + 15; break;
      case "thumbs-down":  weights[entry.lessonId] = (weights[entry.lessonId] ?? 0) - 20; break;
      case "already-know": weights[entry.lessonId] = -999; break;
    }
    localStorage.setItem(LS_FEEDBACK_WEIGHTS_KEY, JSON.stringify(weights));
  } catch { /* ignore */ }
}

export function loadFeedback(): FeedbackEntry[] {
  try {
    const raw = localStorage.getItem(LS_FEEDBACK_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch { return []; }
}

export function loadFeedbackWeights(): Record<string, number> {
  try {
    const raw = localStorage.getItem(LS_FEEDBACK_WEIGHTS_KEY);
    return raw ? JSON.parse(raw) : {};
  } catch { return {}; }
}

export function markLessonCompleted(slug: string): void {
  try {
    const completed = loadCompletedLessons();
    if (!completed.includes(slug)) {
      completed.push(slug);
      localStorage.setItem(LS_COMPLETED_KEY, JSON.stringify(completed));
    }
  } catch { /* ignore */ }
}

export function loadCompletedLessons(): string[] {
  try {
    const raw = localStorage.getItem(LS_COMPLETED_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch { return []; }
}

/* ── Apply feedback weights to tag-based scoring ─────── */

/**
 * When users thumbs-up investing lessons, boost investing-adjacent tags.
 * When they thumbs-down, lower related tags.
 */
function applyFeedbackWeights(
  lessonId: string,
  feedbackType: FeedbackType,
  weights: Record<string, number>,
): Record<string, number> {
  const updated = { ...weights };

  if (feedbackType === "thumbs-up") {
    // If it's an investing lesson, enable level-5 unlocking
    if (lessonId.startsWith("e") || lessonId.includes("invest")) {
      updated["investing-thumbs-up"] = (updated["investing-thumbs-up"] ?? 0) + 5;
    }
  }

  return updated;
}

export { applyFeedbackWeights };

/* ── Diversity check ─────────────────────────────────── */

const DIVERSITY_CATEGORIES = [
  { tags: ["budgeting", "emergency-fund", "money-basics"], label: "stability" },
  { tags: ["investing-basics", "retirement"], label: "growth" },
  { tags: ["credit", "debt"], label: "protection" },
];

function ensureDiversity(ranked: BlockLesson[], count: number): BlockLesson[] {
  const result: BlockLesson[] = [];
  const covered = new Set<string>();
  const remaining: BlockLesson[] = [];

  // First pass: pick top lesson from each diversity category
  for (const category of DIVERSITY_CATEGORIES) {
    if (result.length >= count) break;
    const pick = ranked.find(
      (l) =>
        !result.includes(l) &&
        l.tags.some((t) => category.tags.includes(t)),
    );
    if (pick) {
      result.push(pick);
      covered.add(category.label);
    }
  }

  // Second pass: fill remaining slots with top-scored lessons
  for (const lesson of ranked) {
    if (result.length >= count) break;
    if (!result.includes(lesson)) {
      remaining.push(lesson);
    }
  }

  for (const lesson of remaining) {
    if (result.length >= count) break;
    result.push(lesson);
  }

  return result;
}

/* ── Main path generation ─────────────────────────────── */

export interface PathOptions {
  count?: number; // default 8
  includeLocked?: boolean;
  forceModuleA?: boolean; // always include at least 1 Module A lesson (foundational)
}

/**
 * Generate a personalized ordered lesson path.
 * Scores all lessons, removes gated/completed, ensures diversity, returns top N.
 */
export function generateLearningPath(
  profile: UserProfile,
  options: PathOptions = {},
): BlockLesson[] {
  const { count = 8, forceModuleA = true } = options;

  const completedLessons = loadCompletedLessons();
  const feedbackWeights = loadFeedbackWeights();

  const fullProfile: UserProfile = {
    ...profile,
    completedLessons,
    feedbackWeights,
  };

  // Score all lessons
  const scored = ALL_LESSONS
    .map((lesson) => ({ lesson, score: scoreLesson(lesson, fullProfile) }))
    .filter(({ score }) => score > -999) // remove gated & completed
    .sort((a, b) => b.score - a.score);

  const ranked = scored.map(({ lesson }) => lesson);

  // Ensure Module A foundation is included for new users
  if (forceModuleA && completedLessons.length === 0) {
    const moduleALesson = ranked.find((l) => l.module === "module-a");
    if (moduleALesson && !ranked.slice(0, 2).includes(moduleALesson)) {
      // Inject as second lesson
      const idx = ranked.indexOf(moduleALesson);
      if (idx > 0) {
        ranked.splice(idx, 1);
        ranked.splice(1, 0, moduleALesson);
      }
    }
  }

  return ensureDiversity(ranked, count);
}

/**
 * Generate "next pack" — next 6 lessons after completing initial pack.
 * Excludes completed lessons, adjusts for feedback.
 */
export function generateNextPack(profile: UserProfile): BlockLesson[] {
  return generateLearningPath(profile, { count: 6, forceModuleA: false });
}
