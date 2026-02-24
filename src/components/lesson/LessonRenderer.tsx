/**
 * Renders a CMS lesson (from Supabase cms_lessons).
 * Hero + content blocks + accordions + Last updated / Sources footer.
 * Matches existing Wilbur design tokens; no redesign.
 */
import React, { useState, useRef } from "react";
import { Icon } from "@/components/ui/Icon";
import type { CMSLessonRecord } from "@/lib/lessonBlocks/types";
import { BlockRenderer } from "@/components/lesson/BlockRenderer";
import { QuizMini } from "@/components/lesson/QuizMini";

const BLOCK_RADIUS = 12;
const BLOCK_MB = 16;

function formatDate(iso: string | null): string {
  if (!iso) return "";
  try {
    const d = new Date(iso);
    return d.toLocaleDateString(undefined, { year: "numeric", month: "short", day: "numeric" });
  } catch {
    return "";
  }
}

export const LessonRenderer: React.FC<{ lesson: CMSLessonRecord }> = ({ lesson }) => {
  const [openAccordion, setOpenAccordion] = useState<"example" | "video" | "quiz" | null>(null);
  const sourcesRef = useRef<HTMLDivElement>(null);
  const lastUpdated = lesson.published_at ?? lesson.updated_at;
  const tier1Count = lesson.source_citations?.filter((c) => c.tier === 1).length ?? 0;
  const tier2Count = lesson.source_citations?.filter((c) => c.tier === 2).length ?? 0;
  const sourcesLabel = [tier1Count && "Tier 1", tier2Count && "Tier 2"].filter(Boolean).join(" + ") || "Sources";

  const levelColors =
    lesson.level === "beginner"
      ? { bg: "rgba(14,92,76,0.1)", color: "#0E5C4C" }
      : lesson.level === "intermediate"
        ? { bg: "rgba(255,214,176,0.4)", color: "#b07020" }
        : { bg: "rgba(217,83,79,0.08)", color: "#c0392b" };

  return (
    <article>
      {/* Meta row */}
      <div
        style={{
          display: "flex",
          alignItems: "center",
          gap: "var(--space-4)",
          marginBottom: "var(--space-6)",
          paddingBottom: "var(--space-5)",
          borderBottom: "1px solid var(--color-border-light)",
        }}
      >
        <span style={{ display: "inline-flex", alignItems: "center", gap: 5, fontSize: "var(--text-sm)", color: "var(--color-text-muted)" }}>
          <Icon name="clock" size={14} strokeWidth={1.8} />
          {lesson.estimated_minutes} min
        </span>
        <span style={{ display: "inline-flex", alignItems: "center", gap: 5, fontSize: "var(--text-sm)", color: "var(--color-text-muted)" }}>
          <Icon name="graduation-cap" size={14} strokeWidth={1.8} />
          {lesson.category}
        </span>
        <span
          style={{
            display: "inline-flex",
            alignItems: "center",
            padding: "2px 8px",
            borderRadius: 4,
            backgroundColor: levelColors.bg,
            fontSize: "var(--text-xs)",
            fontWeight: 600,
            color: levelColors.color,
            textTransform: "capitalize",
          }}
        >
          {lesson.level}
        </span>
      </div>

      {/* Transparency footer: Last updated + Sources */}
      <div
        style={{
          display: "flex",
          flexWrap: "wrap",
          alignItems: "center",
          gap: "var(--space-4)",
          marginBottom: "var(--space-5)",
          fontSize: "var(--text-xs)",
          color: "var(--color-text-muted)",
          fontFamily: "var(--font-sans)",
        }}
      >
        {lastUpdated && (
          <span>Last updated: {formatDate(lastUpdated)}</span>
        )}
        <span>{sourcesLabel}</span>
        <button
          type="button"
          onClick={() => sourcesRef.current?.scrollIntoView({ behavior: "smooth" })}
          style={{
            background: "none",
            border: "none",
            padding: 0,
            font: "inherit",
            color: "var(--color-primary)",
            textDecoration: "underline",
            cursor: "pointer",
          }}
        >
          View sources
        </button>
      </div>

      {/* Hero */}
      <div
        style={{
          background: "linear-gradient(135deg, #0E5C4C 0%, #1a7a68 100%)",
          borderRadius: BLOCK_RADIUS,
          padding: "32px 28px",
          marginBottom: BLOCK_MB,
          textAlign: "center",
          color: "#fff",
        }}
      >
        <h1
          style={{
            fontFamily: "var(--font-serif)",
            fontSize: "var(--text-2xl)",
            fontWeight: 400,
            margin: "0 0 8px",
            color: "#fff",
            lineHeight: 1.25,
          }}
        >
          {lesson.title}
        </h1>
        {lesson.subtitle && (
          <p style={{ fontFamily: "var(--font-sans)", fontSize: "var(--text-base)", color: "rgba(255,255,255,0.8)", margin: 0, lineHeight: 1.55 }}>
            {lesson.subtitle}
          </p>
        )}
        {lesson.hero_takeaways?.length > 0 && (
          <div style={{ display: "flex", flexWrap: "wrap", justifyContent: "center", gap: 8, marginTop: 16 }}>
            {lesson.hero_takeaways.map((t, i) => (
              <span
                key={i}
                style={{
                  padding: "6px 12px",
                  borderRadius: "var(--radius-full)",
                  backgroundColor: "rgba(255,255,255,0.2)",
                  fontSize: "var(--text-sm)",
                  fontFamily: "var(--font-sans)",
                  color: "#fff",
                }}
              >
                {t}
              </span>
            ))}
          </div>
        )}
      </div>

      {/* Diagram placeholder */}
      <div
        style={{
          backgroundColor: "var(--color-surface)",
          border: "1px solid var(--color-border-light)",
          borderRadius: BLOCK_RADIUS,
          padding: "24px",
          marginBottom: BLOCK_MB,
          textAlign: "center",
          color: "var(--color-text-muted)",
          fontSize: "var(--text-sm)",
        }}
      >
        [Diagram placeholder]
      </div>

      {/* Content blocks */}
      <BlockRenderer blocks={lesson.content_blocks ?? []} />

      {/* Accordions: Example | Video Animation | Quiz Yourself */}
      <div style={{ marginTop: "var(--space-8)", display: "flex", flexDirection: "column", gap: 0 }}>
        {["example", "video", "quiz"].map((key) => {
          const id = key as "example" | "video" | "quiz";
          const isOpen = openAccordion === id;
          const labels = { example: "Example", video: "Video Animation", quiz: "Quiz Yourself" };

          return (
            <div
              key={id}
              style={{
                border: "1px solid var(--color-border-light)",
                borderTop: key !== "example" ? "none" : undefined,
                borderRadius: key === "example" ? "var(--radius-md) var(--radius-md) 0 0" : key === "quiz" ? "0 0 var(--radius-md) var(--radius-md)" : 0,
                overflow: "hidden",
              }}
            >
              <button
                type="button"
                onClick={() => setOpenAccordion(isOpen ? null : id)}
                style={{
                  width: "100%",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                  padding: "14px var(--space-5)",
                  backgroundColor: isOpen ? "var(--color-surface-hover)" : "var(--color-surface)",
                  border: "none",
                  fontFamily: "var(--font-sans)",
                  fontSize: "var(--text-base)",
                  fontWeight: 600,
                  color: "var(--color-text)",
                  cursor: "pointer",
                  textAlign: "left",
                }}
              >
                {labels[id]}
                <Icon name="chevron-down" size={18} strokeWidth={2} style={{ transform: isOpen ? "rotate(180deg)" : undefined }} />
              </button>
              {isOpen && (
                <div style={{ padding: "var(--space-4) var(--space-5)", borderTop: "1px solid var(--color-border-light)", backgroundColor: "var(--color-surface)" }}>
                  {id === "example" && <BlockRenderer blocks={lesson.example_blocks ?? []} />}
                  {id === "video" && <BlockRenderer blocks={lesson.video_blocks ?? []} />}
                  {id === "quiz" && lesson.quiz && <QuizMini quiz={lesson.quiz} />}
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* Sources section */}
      <div
        ref={sourcesRef}
        style={{
          marginTop: "var(--space-8)",
          paddingTop: "var(--space-5)",
          borderTop: "1px solid var(--color-border-light)",
        }}
      >
        <h3
          style={{
            fontFamily: "var(--font-sans)",
            fontSize: "var(--text-base)",
            fontWeight: 600,
            color: "var(--color-text)",
            margin: "0 0 var(--space-3)",
          }}
        >
          Sources
        </h3>
        <div style={{ display: "flex", flexWrap: "wrap", gap: 8 }}>
          {(lesson.source_citations ?? []).map((c, i) => (
            <a
              key={i}
              href={c.url}
              target="_blank"
              rel="noopener noreferrer"
              style={{
                display: "inline-flex",
                alignItems: "center",
                gap: 6,
                padding: "8px 12px",
                borderRadius: "var(--radius-md)",
                backgroundColor: "var(--color-surface)",
                border: "1px solid var(--color-border-light)",
                fontSize: "var(--text-sm)",
                fontFamily: "var(--font-sans)",
                color: "var(--color-text-secondary)",
                textDecoration: "none",
              }}
            >
              <span style={{ fontWeight: 600, color: "var(--color-text)" }}>{c.title}</span>
              <span style={{ color: "var(--color-text-muted)" }}>({c.domain})</span>
            </a>
          ))}
        </div>
      </div>

      {/* Disclaimer */}
      <div
        style={{
          marginTop: "var(--space-6)",
          padding: "var(--space-4) var(--space-5)",
          backgroundColor: "var(--color-accent-light)",
          borderRadius: "var(--radius-md)",
          border: "1px solid var(--color-accent-border)",
          fontSize: "var(--text-sm)",
          color: "var(--color-text-secondary)",
          lineHeight: 1.6,
        }}
      >
        <strong>Educational Content Only:</strong> All examples are hypothetical and for learning purposes only. This is not financial advice. Consult a licensed financial professional for advice specific to your situation.
      </div>
    </article>
  );
};
