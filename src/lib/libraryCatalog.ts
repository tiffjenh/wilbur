/**
 * Library catalog: categories and lessons derived from LESSON_CATALOG and lesson tags.
 * No hardcoded lesson lists — all lessons come from the catalog; categories are defined by tag mapping.
 */
import type { Lesson } from "@/lib/recommendation/types";
import type { IconName } from "@/components/ui/Icon";
import { LESSON_CATALOG } from "@/content/lessons/lessonCatalog";

/** Category slug → tags that place a lesson in this category. Derived from lesson tags. */
const CATEGORY_TAGS: Record<string, string[]> = {
  investing: [
    "investing-basics",
    "advanced-investing",
    "retirement",
    "stocks",
    "bonds",
    "etfs",
    "cds",
    "brokerage",
    "dividends",
    "options",
    "asset-allocation",
    "real-estate",
  ],
  budgeting: ["budgeting"],
  "credit-debt": ["credit", "debt", "student-loans"],
  housing: ["home-buying", "real-estate"],
  "career-income": ["irregular-income", "benefits", "taxes-federal"],
  insurance: ["insurance"],
  retirement: ["retirement"],
  "money-basics": ["money-basics", "cashflow", "emergency-fund"],
};

/** Display metadata for each category (slug, title, description, icon). */
const CATEGORY_DISPLAY: Record<
  string,
  { title: string; description: string; icon: IconName }
> = {
  investing: {
    title: "Investing",
    description: "Stocks, bonds, ETFs, real estate, and more.",
    icon: "trend-up",
  },
  budgeting: {
    title: "Budgeting",
    description: "Managing your money wisely.",
    icon: "wallet",
  },
  "credit-debt": {
    title: "Credit & Debt",
    description: "Building credit and managing debt.",
    icon: "credit-card",
  },
  housing: {
    title: "Housing",
    description: "Renting, buying, mortgages, and real estate.",
    icon: "home",
  },
  "career-income": {
    title: "Career & Income",
    description: "Negotiating salary, side hustles, taxes.",
    icon: "graduation-cap",
  },
  insurance: {
    title: "Insurance",
    description: "Health, life, auto insurance.",
    icon: "heart",
  },
  retirement: {
    title: "Retirement Planning",
    description: "401(k), IRA, and long-term planning.",
    icon: "sunset",
  },
  "money-basics": {
    title: "Money Basics",
    description: "Financial fundamentals for beginners.",
    icon: "book-open",
  },
};

/** All lessons from the catalog that match a library category (by tag). */
export function getLessonsForLibraryCategory(categorySlug: string): Lesson[] {
  const tags = CATEGORY_TAGS[categorySlug];
  if (!tags?.length) return [];
  return LESSON_CATALOG.filter((lesson) =>
    lesson.tags.some((t) => tags.includes(t)),
  );
}

/** Categories derived from catalog: only those with at least one lesson. No category references lessons that don't exist. */
export function getLibraryCategories(): {
  id: string;
  slug: string;
  title: string;
  description: string;
  icon: IconName;
  lessonCount: number;
}[] {
  const slugs = Object.keys(CATEGORY_TAGS);
  return slugs
    .map((slug) => {
      const lessons = getLessonsForLibraryCategory(slug);
      const meta = CATEGORY_DISPLAY[slug];
      if (!meta || lessons.length === 0) return null;
      return {
        id: slug,
        slug,
        title: meta.title,
        description: meta.description,
        icon: meta.icon,
        lessonCount: lessons.length,
      };
    })
    .filter((c): c is NonNullable<typeof c> => c !== null);
}

/** All library category slugs that have at least one lesson. */
export function getLibraryCategorySlugs(): string[] {
  return getLibraryCategories().map((c) => c.slug);
}
