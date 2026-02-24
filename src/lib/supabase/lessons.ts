/**
 * CMS lessons from Supabase (cms_lessons table).
 * getLessonBySlug / listLessons. Validates content before return; invalid => null (fallback to legacy).
 */
import { supabase } from "@/lib/supabaseClient";
import type { CMSLessonRecord } from "@/lib/lessonBlocks/types";
import { validateLessonContent } from "@/lib/lessonBlocks/schema";

const isDev = typeof import.meta !== "undefined" && (import.meta as { env?: { DEV?: boolean } }).env?.DEV === true;

function rowToLesson(row: Record<string, unknown>): CMSLessonRecord {
  return {
    id: String(row.id),
    slug: String(row.slug),
    title: String(row.title),
    subtitle: row.subtitle != null ? String(row.subtitle) : null,
    category: String(row.category),
    track: row.track != null ? String(row.track) : null,
    level: row.level as "beginner" | "intermediate" | "advanced",
    estimated_minutes: Number(row.estimated_minutes) || 8,
    hero_takeaways: Array.isArray(row.hero_takeaways) ? (row.hero_takeaways as string[]) : [],
    content_blocks: Array.isArray(row.content_blocks) ? (row.content_blocks as CMSLessonRecord["content_blocks"]) : [],
    example_blocks: Array.isArray(row.example_blocks) ? (row.example_blocks as CMSLessonRecord["example_blocks"]) : [],
    video_blocks: Array.isArray(row.video_blocks) ? (row.video_blocks as CMSLessonRecord["video_blocks"]) : [],
    quiz: row.quiz != null && typeof row.quiz === "object" ? (row.quiz as CMSLessonRecord["quiz"]) : null,
    source_citations: Array.isArray(row.source_citations) ? (row.source_citations as CMSLessonRecord["source_citations"]) : [],
    status: (row.status as "draft" | "published") ?? "draft",
    created_at: String(row.created_at),
    updated_at: String(row.updated_at),
    published_at: row.published_at != null ? String(row.published_at) : null,
    updated_by: row.updated_by != null ? String(row.updated_by) : null,
    revision: Number(row.revision) || 1,
  };
}

/**
 * Fetch a published CMS lesson by slug. Returns null if not found, Supabase fails, or content validation fails.
 * On validation failure logs to console in dev and returns null so the app can fall back to legacy.
 */
export async function getLessonBySlug(slug: string): Promise<CMSLessonRecord | null> {
  if (!supabase) return null;
  try {
    const { data, error } = await supabase
      .from("cms_lessons")
      .select("*")
      .eq("slug", slug)
      .eq("status", "published")
      .maybeSingle();
    if (error || !data) return null;
    const row = data as Record<string, unknown>;
    const lesson = rowToLesson(row);
    const payload = {
      hero_takeaways: lesson.hero_takeaways,
      content_blocks: lesson.content_blocks,
      example_blocks: lesson.example_blocks,
      video_blocks: lesson.video_blocks,
      quiz: lesson.quiz,
      source_citations: lesson.source_citations,
    };
    const validation = validateLessonContent(payload);
    if (!validation.success) {
      if (isDev) console.error("[CMS] Lesson validation failed:", slug, validation.errors);
      return null;
    }
    return lesson;
  } catch (e) {
    if (isDev) console.error("[CMS] getLessonBySlug error:", e);
    return null;
  }
}

/**
 * List published CMS lessons, optionally by category or track.
 * Invalid lessons are skipped (not returned) so the list may be shorter than DB rows.
 */
export async function listLessons(options?: { category?: string; track?: string }): Promise<CMSLessonRecord[]> {
  if (!supabase) return [];
  try {
    let q = supabase.from("cms_lessons").select("*").eq("status", "published").order("created_at", { ascending: true });
    if (options?.category) q = q.eq("category", options.category);
    if (options?.track) q = q.eq("track", options.track);
    const { data, error } = await q;
    if (error || !data) return [];
    const out: CMSLessonRecord[] = [];
    for (const row of data as Record<string, unknown>[]) {
      const lesson = rowToLesson(row);
      const validation = validateLessonContent({
        hero_takeaways: lesson.hero_takeaways,
        content_blocks: lesson.content_blocks,
        example_blocks: lesson.example_blocks,
        video_blocks: lesson.video_blocks,
        quiz: lesson.quiz,
        source_citations: lesson.source_citations,
      });
      if (validation.success) out.push(lesson);
    }
    return out;
  } catch {
    return [];
  }
}
