/**
 * Phase 1 CMS read path: load lesson content from Supabase view lesson_latest_published.
 * Returns published snapshot for a lesson_id (e.g. slug like "stocks-101").
 * Supports snapshot shape: { hero, sections, bottom } via mapSnapshotToLesson().
 */
import { supabase } from "@/lib/supabaseClient";
import type { CMSLessonRecord, CMSBlock, QuizSpec, QuizQuestion } from "@/lib/lessonBlocks/types";

export type PublishedLessonRow = {
  lesson_id: string;
  lesson_version_id: string;
  version: number;
  snapshot: Record<string, unknown>;
  published_at: string | null;
  updated_at: string | null;
};

export type GetPublishedLessonResult = {
  lessonId: string;
  version: number;
  snapshot: Record<string, unknown>;
  published_at: string | null;
  updated_at: string | null;
  /** Mapped for existing LessonRenderer (CMSLessonRecord shape). */
  record: CMSLessonRecord;
};

const isDev =
  typeof import.meta !== "undefined" &&
  (import.meta as { env?: { DEV?: boolean } }).env?.DEV === true;

const str = (v: unknown, d = ""): string => (typeof v === "string" ? v : d);
const num = (v: unknown, d: number): number => (typeof v === "number" && !Number.isNaN(v) ? v : d);
const arr = (v: unknown): unknown[] => (Array.isArray(v) ? v : []);

/** Map a single section item (from snapshot.sections) to one or more CMSBlocks. */
function sectionToBlocks(section: unknown): CMSBlock[] {
  if (section == null) return [];
  if (typeof section === "string") {
    return section.trim() ? [{ type: "paragraph", text: section }] : [];
  }
  if (typeof section !== "object") return [];
  const s = section as Record<string, unknown>;
  const type = str(s.type);
  const text = str(s.text ?? s.body ?? s.content);
  const items = arr(s.items ?? s.bullets).map((x) => (typeof x === "string" ? x : String(x))).filter(Boolean);

  if (type === "heading" || s.heading != null) {
    const headingText = type === "heading" ? str(s.text) : str(s.heading);
    if (headingText) return [{ type: "heading", level: (num(s.level, 2) === 3 ? 3 : 2) as 2 | 3, text: headingText }];
  }
  if (type === "paragraph" || (text && !items.length)) {
    if (text) return [{ type: "paragraph", text }];
  }
  if (type === "bullets" || items.length > 0) {
    if (items.length) return [{ type: "bullets", items }];
  }
  if (type === "callout") {
    if (text) return [{ type: "callout", variant: (["tip", "note", "warning"].includes(str(s.variant)) ? s.variant : "note") as "tip" | "note" | "warning", title: str(s.title) || undefined, text }];
  }
  if (type === "divider") return [{ type: "divider" }];
  if (type === "chips" && items.length) return [{ type: "chips", items }];

  if (s.title && text) return [{ type: "heading", level: 2, text: str(s.title) }, { type: "paragraph", text }];
  if (text) return [{ type: "paragraph", text }];
  return [];
}

/** Map snapshot shape { hero, sections, bottom } to CMSLessonRecord for LessonRenderer. */
export function mapSnapshotToLesson(
  snapshot: Record<string, unknown>,
  lessonId: string,
  published_at: string | null,
  updated_at: string | null
): CMSLessonRecord {
  const hero = snapshot.hero != null && typeof snapshot.hero === "object" ? (snapshot.hero as Record<string, unknown>) : {};
  const sections = arr(snapshot.sections);
  const bottom = snapshot.bottom != null && typeof snapshot.bottom === "object" ? (snapshot.bottom as Record<string, unknown>) : {};

  const title = str(hero.headline ?? hero.title ?? snapshot.title, "Untitled");
  const subtitle = hero.subhead != null || hero.subtitle != null ? str(hero.subhead ?? hero.subtitle) : snapshot.subtitle != null ? str(snapshot.subtitle) : null;
  const hero_takeaways = arr(hero.takeaways ?? hero.items ?? hero.bullets).map((t) => (typeof t === "string" ? t : String(t))).filter(Boolean);

  const content_blocks: CMSBlock[] = [];
  for (const section of sections) {
    content_blocks.push(...sectionToBlocks(section));
  }
  if (content_blocks.length === 0) {
    content_blocks.push({ type: "paragraph", text: " " });
  }

  const exampleArr = arr(bottom.examples ?? bottom.example_blocks);
  const example_blocks: CMSBlock[] = [];
  for (const ex of exampleArr) {
    example_blocks.push(...sectionToBlocks(ex));
  }

  const videoArr = arr(bottom.video ?? bottom.video_blocks);
  const video_blocks: CMSBlock[] = [];
  for (const v of videoArr) {
    video_blocks.push(...sectionToBlocks(v));
  }

  let quiz: QuizSpec | null = null;
  const quizRaw = bottom.quiz ?? snapshot.quiz;
  if (quizRaw != null && typeof quizRaw === "object") {
    const q = quizRaw as Record<string, unknown>;
    const questions = arr(q.questions);
    if (questions.length >= 3) {
      const mapQ = (oq: unknown): QuizQuestion => {
        const o = (oq != null && typeof oq === "object" ? oq : {}) as Record<string, unknown>;
        const choices = arr(o.choices).map((c) => (typeof c === "string" ? c : String(c))).filter(Boolean);
        return {
          prompt: str(o.prompt),
          choices: choices.length >= 3 ? choices : [str(o.choices?.[0]), str(o.choices?.[1]), str(o.choices?.[2])].map((c) => c || "Option"),
          correctIndex: Math.max(0, Math.min(num(o.correctIndex, 0), 2)),
          explanation: str(o.explanation),
        };
      };
      quiz = {
        title: str(q.title, "Quiz"),
        questions: [mapQ(questions[0]), mapQ(questions[1]), mapQ(questions[2])],
      };
    }
  }

  const source_citations = arr(snapshot.source_citations ?? bottom.sources).map((c) => {
    const o = (c != null && typeof c === "object" ? c : {}) as Record<string, unknown>;
    return {
      title: str(o.title),
      url: str(o.url),
      domain: str(o.domain),
      tier: (o.tier === 2 ? 2 : 1) as 1 | 2,
    };
  }).filter((c) => c.title && c.url);

  const now = updated_at ?? new Date().toISOString();
  const record: CMSLessonRecord = {
    id: lessonId,
    slug: str(snapshot.slug, lessonId),
    title,
    subtitle: subtitle || null,
    category: str(snapshot.category, "investing"),
    track: snapshot.track != null ? str(snapshot.track) : null,
    level: (["beginner", "intermediate", "advanced"].includes(str(snapshot.level)) ? snapshot.level : "beginner") as "beginner" | "intermediate" | "advanced",
    estimated_minutes: num(snapshot.estimated_minutes, 8),
    hero_takeaways: hero_takeaways.length ? hero_takeaways : [title],
    content_blocks,
    example_blocks,
    video_blocks,
    quiz,
    source_citations,
    status: "published",
    created_at: str(snapshot.created_at, now),
    updated_at: now,
    published_at,
    updated_by: snapshot.updated_by != null ? str(snapshot.updated_by) : null,
    revision: num(snapshot.revision, 1),
  };

  if (isDev) {
    console.log("Mapped lesson shape:", { title: record.title, content_blocks: record.content_blocks.length, example_blocks: record.example_blocks.length, video_blocks: record.video_blocks.length, quiz: !!record.quiz });
  }
  return record;
}

/** Legacy: snapshot already has title, content_blocks, etc. */
function snapshotToRecordLegacy(lessonId: string, snapshot: Record<string, unknown>, published_at: string | null, updated_at: string | null): CMSLessonRecord {
  const now = updated_at ?? new Date().toISOString();
  return {
    id: lessonId,
    slug: str(snapshot.slug, lessonId),
    title: str(snapshot.title, "Untitled"),
    subtitle: snapshot.subtitle != null ? str(snapshot.subtitle) : null,
    category: str(snapshot.category, "investing"),
    track: snapshot.track != null ? str(snapshot.track) : null,
    level: (["beginner", "intermediate", "advanced"].includes(str(snapshot.level)) ? snapshot.level : "beginner") as "beginner" | "intermediate" | "advanced",
    estimated_minutes: num(snapshot.estimated_minutes, 8),
    hero_takeaways: arr(snapshot.hero_takeaways).map((t) => (typeof t === "string" ? t : String(t))),
    content_blocks: arr(snapshot.content_blocks) as CMSLessonRecord["content_blocks"],
    example_blocks: arr(snapshot.example_blocks) as CMSLessonRecord["example_blocks"],
    video_blocks: arr(snapshot.video_blocks) as CMSLessonRecord["video_blocks"],
    quiz: snapshot.quiz != null && typeof snapshot.quiz === "object" ? (snapshot.quiz as CMSLessonRecord["quiz"]) : null,
    source_citations: arr(snapshot.source_citations) as CMSLessonRecord["source_citations"],
    status: "published",
    created_at: str(snapshot.created_at, now),
    updated_at: now,
    published_at,
    updated_by: snapshot.updated_by != null ? str(snapshot.updated_by) : null,
    revision: num(snapshot.revision, 1),
  };
}

/**
 * Fetch the latest published lesson snapshot by lesson_id (e.g. slug "stocks-101").
 * Returns null on 404, network error, or missing/invalid snapshot (friendly fallback).
 */
export async function getPublishedLesson(lessonId: string): Promise<GetPublishedLessonResult | null> {
  if (!supabase) return null;
  try {
    const { data, error } = await supabase
      .from("lesson_latest_published")
      .select("*")
      .eq("lesson_id", lessonId)
      .maybeSingle();

    if (error) {
      if (isDev) console.warn("[getPublishedLesson] Supabase error:", error.message);
      return null;
    }
    if (!data || !data.snapshot || typeof data.snapshot !== "object") {
      if (isDev) console.info("[getPublishedLesson] No row or missing snapshot for lesson_id:", lessonId);
      return null;
    }

    const row = data as unknown as PublishedLessonRow;
    const snapshot = row.snapshot as Record<string, unknown>;
    const hasHeroSectionsBottom =
      snapshot.hero != null || snapshot.sections != null || snapshot.bottom != null;
    const record = hasHeroSectionsBottom
      ? mapSnapshotToLesson(snapshot, lessonId, row.published_at ?? null, row.updated_at ?? null)
      : snapshotToRecordLegacy(lessonId, snapshot, row.published_at ?? null, row.updated_at ?? null);

    if (isDev) {
      const snapshotKeys = Object.keys(snapshot);
      console.log("Loaded lesson", lessonId);
      console.log("Version:", row.version);
      console.log("Snapshot keys:", snapshotKeys);
    }

    return {
      lessonId: row.lesson_id,
      version: row.version,
      snapshot,
      published_at: row.published_at ?? null,
      updated_at: row.updated_at ?? null,
      record,
    };
  } catch (e) {
    if (isDev) console.warn("[getPublishedLesson] Exception:", e);
    return null;
  }
}
