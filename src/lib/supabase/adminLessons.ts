/**
 * Admin-only CMS lesson operations.
 * All functions require the current user to be in admin_allowlist (enforced by RLS).
 */
import { supabase } from "@/lib/supabaseClient";
import type { CMSLessonRecord } from "@/lib/lessonBlocks/types";
import { validateLessonContent } from "@/lib/lessonBlocks/schema";

export type AdminAllowlistRow = { user_id: string; email: string | null; role: string };

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
 * Check if the given user ID is in admin_allowlist. Uses RLS (user can only select own row).
 */
export async function requireAdmin(userId: string | undefined): Promise<boolean> {
  if (!supabase || !userId) return false;
  const { data, error } = await supabase
    .from("admin_allowlist")
    .select("user_id")
    .eq("user_id", userId)
    .maybeSingle();
  return !error && data != null;
}

/**
 * List all lessons for admin (any status). RLS allows only if user is in admin_allowlist.
 */
export async function listLessonsAdmin(): Promise<CMSLessonRecord[]> {
  if (!supabase) return [];
  const { data, error } = await supabase
    .from("cms_lessons")
    .select("*")
    .order("updated_at", { ascending: false });
  if (error || !data) return [];
  return (data as Record<string, unknown>[]).map((row) => rowToLesson(row));
}

/**
 * Get a single lesson by ID (draft or published). Admin only.
 */
export async function getLessonByIdAdmin(id: string): Promise<CMSLessonRecord | null> {
  if (!supabase) return null;
  const { data, error } = await supabase
    .from("cms_lessons")
    .select("*")
    .eq("id", id)
    .maybeSingle();
  if (error || !data) return null;
  return rowToLesson(data as Record<string, unknown>);
}

/**
 * Upsert a lesson as draft. Sets status=draft, updated_at, updated_by. RLS enforces admin.
 */
export async function upsertLessonDraftAdmin(
  lesson: Partial<CMSLessonRecord> & { id?: string; slug: string; title: string; category: string; level: CMSLessonRecord["level"] }
): Promise<{ data: CMSLessonRecord | null; error: string | null }> {
  if (!supabase) return { data: null, error: "Supabase not configured" };
  const userId = (await supabase.auth.getUser()).data.user?.id ?? null;
  const payload = {
    slug: lesson.slug,
    title: lesson.title,
    subtitle: lesson.subtitle ?? null,
    category: lesson.category,
    track: lesson.track ?? null,
    level: lesson.level,
    estimated_minutes: lesson.estimated_minutes ?? 8,
    hero_takeaways: lesson.hero_takeaways ?? [],
    content_blocks: lesson.content_blocks ?? [],
    example_blocks: lesson.example_blocks ?? [],
    video_blocks: lesson.video_blocks ?? [],
    quiz: lesson.quiz ?? null,
    source_citations: lesson.source_citations ?? [],
    status: "draft" as const,
    updated_at: new Date().toISOString(),
    updated_by: userId,
  };
  if (lesson.id) {
    const { data, error } = await supabase
      .from("cms_lessons")
      .update(payload)
      .eq("id", lesson.id)
      .select()
      .single();
    if (error) return { data: null, error: error.message };
    return { data: rowToLesson(data as Record<string, unknown>), error: null };
  }
  const { data, error } = await supabase.from("cms_lessons").insert({ ...payload }).select().single();
  if (error) return { data: null, error: error.message };
  return { data: rowToLesson(data as Record<string, unknown>), error: null };
}

/**
 * Publish a lesson: validate, require ≥1 citation, create snapshot, set status=published, revision+1.
 */
export async function publishLessonAdmin(id: string): Promise<{ data: CMSLessonRecord | null; error: string | null }> {
  if (!supabase) return { data: null, error: "Supabase not configured" };
  const lesson = await getLessonByIdAdmin(id);
  if (!lesson) return { data: null, error: "Lesson not found" };
  const validation = validateLessonContent({
    hero_takeaways: lesson.hero_takeaways,
    content_blocks: lesson.content_blocks,
    example_blocks: lesson.example_blocks,
    video_blocks: lesson.video_blocks,
    quiz: lesson.quiz,
    source_citations: lesson.source_citations,
  });
  if (!validation.success) return { data: null, error: validation.errors.join(". ") };
  if (!lesson.source_citations?.length) return { data: null, error: "At least one citation is required to publish." };
  const userId = (await supabase.auth.getUser()).data.user?.id ?? null;
  const nextRevision = lesson.revision + 1;
  const snapshot = {
    slug: lesson.slug,
    title: lesson.title,
    subtitle: lesson.subtitle,
    category: lesson.category,
    track: lesson.track,
    level: lesson.level,
    estimated_minutes: lesson.estimated_minutes,
    hero_takeaways: lesson.hero_takeaways,
    content_blocks: lesson.content_blocks,
    example_blocks: lesson.example_blocks,
    video_blocks: lesson.video_blocks,
    quiz: lesson.quiz,
    source_citations: lesson.source_citations,
  };
  const { error: insertErr } = await supabase.from("cms_lesson_versions").insert({
    lesson_id: id,
    revision: nextRevision,
    status: "published",
    snapshot,
    created_by: userId,
  });
  if (insertErr) return { data: null, error: insertErr.message };
  const { data: updated, error: updateErr } = await supabase
    .from("cms_lessons")
    .update({
      status: "published",
      published_at: new Date().toISOString(),
      revision: nextRevision,
      updated_at: new Date().toISOString(),
      updated_by: userId,
    })
    .eq("id", id)
    .select()
    .single();
  if (updateErr) return { data: null, error: updateErr.message };
  return { data: rowToLesson(updated as Record<string, unknown>), error: null };
}

export type LessonVersionRow = {
  id: string;
  lesson_id: string;
  revision: number;
  status: string;
  snapshot: Record<string, unknown>;
  created_at: string;
  created_by: string | null;
};

/**
 * List version history for a lesson. Admin only.
 */
export async function listLessonVersionsAdmin(id: string): Promise<LessonVersionRow[]> {
  if (!supabase) return [];
  const { data, error } = await supabase
    .from("cms_lesson_versions")
    .select("id, lesson_id, revision, status, snapshot, created_at, created_by")
    .eq("lesson_id", id)
    .order("revision", { ascending: false });
  if (error || !data) return [];
  return data as LessonVersionRow[];
}

/**
 * Rollback lesson to a prior revision: restore snapshot into cms_lessons and create a new version row (rollback).
 */
export async function rollbackLessonAdmin(
  id: string,
  revision: number
): Promise<{ data: CMSLessonRecord | null; error: string | null }> {
  if (!supabase) return { data: null, error: "Supabase not configured" };
  const { data: versions } = await supabase
    .from("cms_lesson_versions")
    .select("snapshot, revision")
    .eq("lesson_id", id)
    .eq("revision", revision)
    .maybeSingle();
  const row = versions as { snapshot: Record<string, unknown>; revision: number } | null;
  if (!row?.snapshot) return { data: null, error: "Revision not found" };
  const snap = row.snapshot as Record<string, unknown>;
  const lesson = await getLessonByIdAdmin(id);
  if (!lesson) return { data: null, error: "Lesson not found" };
  const userId = (await supabase.auth.getUser()).data.user?.id ?? null;
  const nextRevision = lesson.revision + 1;
  const { error: insertErr } = await supabase.from("cms_lesson_versions").insert({
    lesson_id: id,
    revision: nextRevision,
    status: "draft",
    snapshot: {
      ...snap,
      _rollback_from_revision: revision,
    },
    created_by: userId,
  });
  if (insertErr) return { data: null, error: insertErr.message };
  const updatePayload = {
    hero_takeaways: snap.hero_takeaways ?? lesson.hero_takeaways,
    content_blocks: snap.content_blocks ?? lesson.content_blocks,
    example_blocks: snap.example_blocks ?? lesson.example_blocks,
    video_blocks: snap.video_blocks ?? lesson.video_blocks,
    quiz: snap.quiz ?? lesson.quiz,
    source_citations: snap.source_citations ?? lesson.source_citations,
    title: snap.title ?? lesson.title,
    subtitle: snap.subtitle ?? lesson.subtitle,
    category: snap.category ?? lesson.category,
    track: snap.track ?? lesson.track,
    level: snap.level ?? lesson.level,
    estimated_minutes: snap.estimated_minutes ?? lesson.estimated_minutes,
    status: "draft" as const,
    revision: nextRevision,
    updated_at: new Date().toISOString(),
    updated_by: userId,
  };
  const { data: updated, error: updateErr } = await supabase
    .from("cms_lessons")
    .update(updatePayload)
    .eq("id", id)
    .select()
    .single();
  if (updateErr) return { data: null, error: updateErr.message };
  return { data: rowToLesson(updated as Record<string, unknown>), error: null };
}
