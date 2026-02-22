/**
 * Library catalog: full list of lessons per category from LESSON_CATALOG.
 * No locks — all lessons are accessible. Used by Library category pages.
 */
import type { Lesson } from "@/lib/recommendation/types";
import { LESSON_CATALOG } from "@/content/lessons/lessonCatalog";
import { categories } from "@/lib/stubData";

/** Map category slug to lesson tags that belong in that category. */
const CATEGORY_TAGS: Record<string, string[]> = {
  investing: ["investing-basics", "advanced-investing", "retirement"],
  budgeting: ["budgeting"],
  "credit-debt": ["credit", "debt", "student-loans"],
  housing: ["home-buying"],
  "career-income": ["irregular-income", "benefits", "taxes-federal"],
  insurance: ["insurance"],
  retirement: ["retirement"],
  "money-basics": ["money-basics", "cashflow", "emergency-fund"],
};

/** All lessons from the catalog that match a library category (by tag). */
export function getLessonsForLibraryCategory(categorySlug: string): Lesson[] {
  const tags = CATEGORY_TAGS[categorySlug];
  if (!tags?.length) return [];
  return LESSON_CATALOG.filter((lesson) =>
    lesson.tags.some((t) => tags.includes(t)),
  );
}

/** All library category slugs (from stubData categories). */
export function getLibraryCategorySlugs(): string[] {
  return categories.map((c) => c.slug);
}
