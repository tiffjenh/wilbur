/**
 * Catalog hygiene: compare Library-referenced lesson IDs to LESSON_REGISTRY and content.
 *
 * Handling policy (fast, deterministic):
 * A) Missing in registry → hide from Library (isLessonAvailable = false). Do not create fake entries.
 * B) In registry but render empty → hide from Library; direct URL shows "Coming soon" (Lesson page).
 * C) In registry but not in Library → ignore (backlog visibility only).
 */
import { LESSON_REGISTRY } from "@/lib/stubData";
import { getLessonContent } from "@/lib/lessons/content";

/** Slug IDs that have local snapshot content only (no CONTENT_BY_LESSON_ID). V1 placeholders included until Step 8 content. */
const SNAPSHOT_ONLY_SLUGS = new Set([
  "adult-money-game-plan",
  "budgeting-in-10-minutes",
  "emergency-fund-basics",
  "credit-cards-statement-balance",
  "paycheck-basics",
  "work-benefits-101",
  "investing-basics-no-stock-picking",
  "how-interest-works",
  "compound-growth-basics",
  "taxes-how-to-file",
  "tax-brackets-explained",
  "write-offs-explained",
  "brokerage-account-basics",
  "etfs-and-index-funds",
  "rent-vs-buy",
  "mortgage-basics",
  "insurance-basics",
  "checking-vs-savings",
  "credit-score-basics",
  "student-loans-basics",
  "w2-vs-1099",
  "what-is-investing",
  "dollar-cost-averaging",
]);

export type CatalogAuditReport = {
  libraryCount: number;
  registryCount: number;
  missingInRegistry: string[];
  missingContent: string[];
  orphanRegistryLessons: string[];
  orphanSnapshots: string[];
};

/**
 * Heuristic: lesson has content if it has local blocks or is a known snapshot-only lesson.
 * (Supabase-published content is not checked in this sync audit.)
 */
export function hasLessonContent(lessonId: string): boolean {
  const lesson = (LESSON_REGISTRY as Record<string, unknown>)[lessonId];
  if (!lesson) return false;

  if (SNAPSHOT_ONLY_SLUGS.has(lessonId)) return true;

  const content = getLessonContent(lessonId);
  if (content?.blocks && Array.isArray(content.blocks) && content.blocks.length > 0) return true;

  return false;
}

/**
 * Main audit. Provide the list of lesson IDs referenced by the Library UI.
 */
export function auditCatalog(libraryLessonIds: string[]): CatalogAuditReport {
  const registryIds = Object.keys(LESSON_REGISTRY);
  const registrySet = new Set(registryIds);

  const missingInRegistry = libraryLessonIds.filter((id) => !registrySet.has(id));

  const missingContent = libraryLessonIds
    .filter((id) => registrySet.has(id))
    .filter((id) => !hasLessonContent(id));

  const orphanRegistryLessons = registryIds.filter((id) => !libraryLessonIds.includes(id));

  const orphanSnapshots = [...SNAPSHOT_ONLY_SLUGS].filter((id) => !registrySet.has(id));

  return {
    libraryCount: libraryLessonIds.length,
    registryCount: registryIds.length,
    missingInRegistry,
    missingContent,
    orphanRegistryLessons,
    orphanSnapshots,
  };
}

/**
 * Use in the Library UI to hide broken lessons (missing from registry or empty content).
 */
export function isLessonAvailable(lessonId: string): boolean {
  if (!(lessonId in (LESSON_REGISTRY as Record<string, unknown>))) return false;
  return hasLessonContent(lessonId);
}

/** True if lessonId exists in LESSON_REGISTRY (for direct-URL "Coming soon" handling). */
export function isInRegistry(lessonId: string): boolean {
  return lessonId in (LESSON_REGISTRY as Record<string, unknown>);
}
