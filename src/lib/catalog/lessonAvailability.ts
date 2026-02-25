/**
 * Central lesson availability and "Coming Soon" metadata.
 * Uses LESSON_REGISTRY and the same "has content" heuristics as auditCatalog.
 */
import { LESSON_REGISTRY } from "@/lib/stubData";
import { hasLessonContent } from "@/lib/catalog/auditCatalog";
import { CURRICULUM_LIBRARY_IDS } from "@/content/curriculum/v1";

/** True if lessonId exists in LESSON_REGISTRY. */
export function isLessonInRegistry(id: string): boolean {
  return id in (LESSON_REGISTRY as Record<string, unknown>);
}

/** True if lesson is in registry AND has content (same heuristics as auditCatalog). */
export function isLessonAvailable(id: string): boolean {
  if (!isLessonInRegistry(id)) return false;
  return hasLessonContent(id);
}

/** True if lesson is not in registry OR is in registry but has no content. */
export function isLessonMissingOrEmpty(id: string): boolean {
  return !isLessonAvailable(id);
}

export type ComingSoonLessonMeta = {
  title: string;
  subtitle: string;
  recommendedNextIds: string[];
};

const DEFAULT_COMING_SOON_SUBTITLE =
  "We're building this lesson next. For now, here are the best lessons to take instead.";

/** First N available library lesson IDs to recommend when a lesson is missing/empty. */
const DEFAULT_RECOMMENDED_IDS = [
  "adult-money-game-plan",
  "budgeting-in-10-minutes",
  "checking-vs-savings",
] as const;

function getDefaultRecommendedIds(excludeId: string): string[] {
  const libraryIds = CURRICULUM_LIBRARY_IDS();
  const available = libraryIds.filter((id) => id !== excludeId && isLessonAvailable(id));
  if (available.length >= 3) return available.slice(0, 3);
  const fallbacks = DEFAULT_RECOMMENDED_IDS.filter((id) => id !== excludeId && isLessonAvailable(id));
  return [...available, ...fallbacks].slice(0, 3);
}

/**
 * Returns title, subtitle, and recommended lesson IDs for the Coming Soon page.
 */
export function getComingSoonLessonMeta(id: string): ComingSoonLessonMeta {
  const entry = (LESSON_REGISTRY as Record<string, { title?: string }>)[id];
  const title = entry?.title ?? id;
  return {
    title,
    subtitle: DEFAULT_COMING_SOON_SUBTITLE,
    recommendedNextIds: getDefaultRecommendedIds(id),
  };
}
