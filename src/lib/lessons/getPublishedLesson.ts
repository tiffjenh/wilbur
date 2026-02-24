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

function isObject(v: unknown): v is Record<string, unknown> {
  return v != null && typeof v === "object" && !Array.isArray(v);
}

/** Legacy: snapshot already has title/content_blocks/etc */
function isLegacySnapshot(snapshot: Record<string, unknown>): boolean {
  return (
    "content_blocks" in snapshot ||
    "title" in snapshot ||
    "example_blocks" in snapshot ||
    "video_blocks" in snapshot ||
    "source_citations" in snapshot
  );
}

/** New: snapshot uses hero/sections/bottom */
function isNewSnapshot(snapshot: Record<string, unknown>): boolean {
  const hero = snapshot.hero;
  const sections = snapshot.sections;
  const bottom = snapshot.bottom;
  return isObject(hero) || Array.isArray(sections) || isObject(bottom);
}

function devLog(...args: unknown[]): void {
  if (process.env.NODE_ENV !== "production") console.log(...args);
}

/** Minimal section shape from snapshot.sections (id, type, title, content). */
export type MapSnapshotSection = {
  id: string;
  type: string;
  title: string | null;
  content: string;
};

/** Minimal mapped lesson (hero/sections/bottom only). Use mapSnapshotToLesson() for full CMSLessonRecord. */
export type MapSnapshotMinimalResult = {
  title: string;
  content_blocks: MapSnapshotSection[];
  example: unknown;
  video: unknown;
  quiz: unknown;
};

/**
 * Map snapshot (hero, sections, bottom) to a minimal lesson shape.
 * Returns null if snapshot is missing. For full CMSLessonRecord use mapSnapshotToLesson().
 */
export function mapSnapshotToLessonMinimal(snapshot: Record<string, unknown> | null | undefined): MapSnapshotMinimalResult | null {
  if (!snapshot) return null;

  const hero = (snapshot.hero != null && typeof snapshot.hero === "object" ? snapshot.hero : {}) as Record<string, unknown>;
  const sections = Array.isArray(snapshot.sections) ? snapshot.sections : [];
  const bottom = (snapshot.bottom != null && typeof snapshot.bottom === "object" ? snapshot.bottom : {}) as Record<string, unknown>;

  const title =
    str(hero.headline) ||
    str(hero.title) ||
    "Untitled";

  const content_blocks: MapSnapshotSection[] =
    sections.length > 0
      ? sections.map((section: unknown, index: number) => {
          const s = section != null && typeof section === "object" ? (section as Record<string, unknown>) : {};
          return {
            id: `section-${index}`,
            type: str(s.type, "text"),
            title: s.title != null ? str(s.title) : null,
            content: str(s.content ?? s.body ?? s.text),
          };
        })
      : [
          {
            id: "empty-placeholder",
            type: "text",
            title: null,
            content: "",
          },
        ];

  return {
    title,
    content_blocks,
    example: bottom.example ?? null,
    video: bottom.video ?? null,
    quiz: bottom.quiz ?? null,
  };
}

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

/** Map snapshot shape { hero, sections, bottom } or legacy { content_blocks, ... } to CMSLessonRecord for LessonRenderer. */
export function mapSnapshotToLesson(
  snapshot: Record<string, unknown>,
  lessonId: string,
  published_at: string | null,
  updated_at: string | null
): CMSLessonRecord {
  if (isLegacySnapshot(snapshot)) {
    return snapshotToRecordLegacy(lessonId, snapshot, published_at, updated_at);
  }
  const minimal = mapSnapshotToLessonMinimal(snapshot);
  const hero = isObject(snapshot.hero) ? (snapshot.hero as Record<string, unknown>) : {};
  const headline =
    (hero.headline != null ? String(hero.headline) : "") ||
    (hero.title != null ? String(hero.title) : "");

  const title = headline.trim() || "Untitled";
  const bottom = snapshot.bottom != null && typeof snapshot.bottom === "object" ? (snapshot.bottom as Record<string, unknown>) : {};
  const subtitle = hero.subhead != null || hero.subtitle != null ? str(hero.subhead ?? hero.subtitle) : snapshot.subtitle != null ? str(snapshot.subtitle) : null;
  const hero_takeaways = arr(hero.takeaways ?? hero.items ?? hero.bullets).map((t) => (typeof t === "string" ? t : String(t))).filter(Boolean);

  const content_blocks: CMSBlock[] = minimal
    ? minimal.content_blocks.flatMap((section) => {
        const blocks: CMSBlock[] = [];
        if (section.title) blocks.push({ type: "heading", level: 2, text: section.title });
        if (section.content) blocks.push({ type: "paragraph", text: section.content });
        if (blocks.length === 0) blocks.push({ type: "paragraph", text: " " });
        return blocks;
      })
    : (() => {
        const out: CMSBlock[] = [];
        for (const section of arr(snapshot.sections)) out.push(...sectionToBlocks(section));
        if (out.length === 0) out.push({ type: "paragraph", text: " " });
        return out;
      })();
  if (content_blocks.length === 0) {
    content_blocks.push({ type: "paragraph", text: " " });
  }

  const exampleArr = minimal?.example != null ? (Array.isArray(minimal.example) ? minimal.example : [minimal.example]) : arr(bottom.examples ?? bottom.example_blocks);
  const example_blocks: CMSBlock[] = [];
  for (const ex of exampleArr) {
    example_blocks.push(...sectionToBlocks(ex));
  }

  const videoArr = minimal?.video != null ? (Array.isArray(minimal.video) ? minimal.video : [minimal.video]) : arr(bottom.video ?? bottom.video_blocks);
  const video_blocks: CMSBlock[] = [];
  for (const v of videoArr) {
    video_blocks.push(...sectionToBlocks(v));
  }

  let quiz: QuizSpec | null = null;
  const quizRaw = (minimal?.quiz != null ? minimal.quiz : null) ?? bottom.quiz ?? snapshot.quiz;
  if (quizRaw != null && typeof quizRaw === "object") {
    const q = quizRaw as Record<string, unknown>;
    const questionsRaw = arr(q.questions) as unknown[];
    if (questionsRaw.length >= 3) {
      const q0 = questionsRaw[0];
      const q1 = questionsRaw[1];
      const q2 = questionsRaw[2];
      const mapQ = (oq: unknown): QuizQuestion => {
        const o = (oq != null && typeof oq === "object" ? oq : {}) as Record<string, unknown>;
        const choicesArr = arr(o.choices).map((c) => (typeof c === "string" ? c : String(c))).filter(Boolean) as string[];
        const choices =
          choicesArr.length >= 3
            ? choicesArr
            : [str((o.choices as unknown[])?.[0]), str((o.choices as unknown[])?.[1]), str((o.choices as unknown[])?.[2])].map((c) => c || "Option");
        return {
          prompt: str(o.prompt),
          choices,
          correctIndex: Math.max(0, Math.min(num(o.correctIndex, 0), choices.length - 1)),
          explanation: str(o.explanation),
        };
      };
      quiz = {
        title: str(q.title, "Quiz"),
        questions: [mapQ(q0), mapQ(q1), mapQ(q2)],
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

  devLog("Mapped lesson shape:", { title: record.title, content_blocks: record.content_blocks.length, example_blocks: record.example_blocks.length, video_blocks: record.video_blocks.length, quiz: !!record.quiz });
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

function snapshotToRecord(
  lessonId: string,
  snapshot: Record<string, unknown>,
  published_at: string | null,
  updated_at: string | null
): CMSLessonRecord {
  const shape = isLegacySnapshot(snapshot) ? "legacy" : isNewSnapshot(snapshot) ? "new" : "unknown";

  devLog("[getPublishedLesson] Loaded lesson", lessonId);
  devLog("[getPublishedLesson] snapshot shape:", shape);
  devLog("[getPublishedLesson] snapshot keys:", Object.keys(snapshot));

  if (shape === "legacy") {
    return snapshotToRecordLegacy(lessonId, snapshot, published_at, updated_at);
  }

  if (shape === "new") {
    return mapSnapshotToLesson(snapshot, lessonId, published_at, updated_at);
  }

  return snapshotToRecordLegacy(lessonId, snapshot, published_at, updated_at);
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
    const record = snapshotToRecord(row.lesson_id, row.snapshot as any, row.published_at ?? null, row.updated_at ?? null);

    return {
      lessonId: row.lesson_id,
      version: row.version,
      snapshot: row.snapshot as Record<string, unknown>,
      published_at: row.published_at ?? null,
      updated_at: row.updated_at ?? null,
      record,
    };
  } catch (e) {
    if (isDev) console.warn("[getPublishedLesson] Exception:", e);
    return null;
  }
}
