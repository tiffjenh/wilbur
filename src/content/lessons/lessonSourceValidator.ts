/**
 * Validates lesson sources against approved-source policy.
 * Use at build time or when ingesting lesson content.
 */
import { enforceApprovedSources, getTierForUrl } from "@/content/sources/approvedSources";
import { getStateDomains } from "@/content/sources/stateDomains";
import type { BlockLesson, LessonSource } from "@/content/lessonTypes";

const TAX_LEGAL_TAGS = ["taxes-federal", "taxes-state", "student-loans", "benefits"];

export interface LessonSourceValidationResult {
  valid: boolean;
  errors: string[];
  warnings: string[];
}

/**
 * Validate a lesson's sources:
 * - All source URLs must be from approved domains.
 * - Prefer >= 2 citations where possible.
 * - Tax/legal-tagged lessons must have at least one Tier 1 citation.
 */
export function validateLessonSources(
  lesson: Pick<BlockLesson, "sources" | "tags" | "slug">,
  stateCode?: string
): LessonSourceValidationResult {
  const errors: string[] = [];
  const warnings: string[] = [];
  const stateDomains = stateCode ? getStateDomains(stateCode) : [];
  const urls = lesson.sources.map((s) => s.url);
  const { approved, rejected } = enforceApprovedSources(urls, stateCode);

  if (rejected.length > 0) {
    errors.push(`Lesson "${lesson.slug}": non-approved source URLs: ${rejected.join(", ")}`);
  }

  if (lesson.sources.length < 2 && lesson.sources.length > 0) {
    warnings.push(`Lesson "${lesson.slug}": consider adding at least 2 citations where possible.`);
  }

  const hasTaxLegalTag = lesson.tags.some((t) => TAX_LEGAL_TAGS.includes(t));
  if (hasTaxLegalTag && lesson.sources.length > 0) {
    const hasTier1 = lesson.sources.some((s) => getTierForUrl(s.url, stateDomains) === 1);
    if (!hasTier1) {
      errors.push(`Lesson "${lesson.slug}": tax/legal-related lesson must include at least one Tier 1 (primary) source.`);
    }
  }

  return {
    valid: errors.length === 0,
    errors,
    warnings,
  };
}

/**
 * Normalize lesson sources to include tier (from URL) when missing.
 */
export function normalizeLessonSources(sources: LessonSource[], stateCode?: string): LessonSource[] {
  const stateDomains = stateCode ? getStateDomains(stateCode) : [];
  return sources.map((s) => {
    const tier = getTierForUrl(s.url, stateDomains);
    return { ...s, tier: tier ?? undefined };
  });
}
