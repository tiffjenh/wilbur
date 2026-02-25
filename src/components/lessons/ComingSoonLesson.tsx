import React from "react";
import { Link } from "react-router-dom";
import { getComingSoonLessonMeta } from "@/lib/catalog/lessonAvailability";
import { LESSON_REGISTRY } from "@/lib/stubData";

export type ComingSoonCta = { label: string; href: string };

const DEFAULT_CTAS: ComingSoonCta[] = [
  { label: "Back to Learning Path", href: "/learning" },
  { label: "Browse Library", href: "/library" },
];

export type ComingSoonLessonProps = {
  lessonId: string;
  title?: string;
  subtitle?: string;
  ctas?: ComingSoonCta[];
};

export const ComingSoonLesson: React.FC<ComingSoonLessonProps> = ({
  lessonId,
  title: titleProp,
  subtitle: subtitleProp,
  ctas = DEFAULT_CTAS,
}) => {
  const meta = getComingSoonLessonMeta(lessonId);
  const title = titleProp ?? "Coming soon";
  const subtitle = subtitleProp ?? meta.subtitle;
  const recommendedIds = meta.recommendedNextIds.slice(0, 3);
  const registry = LESSON_REGISTRY as Record<string, { title?: string }>;

  return (
    <div
      style={{
        padding: "var(--space-8) var(--space-6)",
        maxWidth: 560,
        margin: "0 auto",
        textAlign: "center",
      }}
    >
      <h2
        style={{
          fontFamily: "var(--font-serif)",
          fontSize: "var(--text-2xl)",
          fontWeight: 600,
          marginBottom: "var(--space-4)",
          color: "var(--color-text)",
        }}
      >
        {title}
      </h2>
      <p
        style={{
          color: "var(--color-text-muted)",
          marginBottom: "var(--space-6)",
          lineHeight: 1.6,
          fontSize: "var(--text-base)",
        }}
      >
        {subtitle}
      </p>

      <div
        style={{
          display: "flex",
          flexWrap: "wrap",
          gap: 12,
          justifyContent: "center",
          marginBottom: "var(--space-8)",
        }}
      >
        {ctas.map((cta) => (
          <Link
            key={cta.href}
            to={cta.href}
            style={{
              color: "var(--color-primary)",
              fontWeight: 500,
              fontSize: "var(--text-base)",
              textDecoration: "none",
            }}
          >
            {cta.label}
          </Link>
        ))}
      </div>

      {recommendedIds.length > 0 && (
        <>
          <p
            style={{
              fontSize: "var(--text-sm)",
              color: "var(--color-text-muted)",
              marginBottom: "var(--space-4)",
              textAlign: "left",
            }}
          >
            Recommended lessons
          </p>
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              gap: "var(--space-3)",
              textAlign: "left",
            }}
          >
            {recommendedIds.map((id) => {
              const entry = registry[id];
              const lessonTitle = entry?.title ?? id;
              return (
                <Link
                  key={id}
                  to={`/lesson/${id}`}
                  style={{
                    display: "block",
                    padding: "var(--space-4) var(--space-5)",
                    backgroundColor: "var(--color-surface)",
                    border: "1px solid var(--color-border-light)",
                    borderRadius: "var(--radius-md)",
                    color: "var(--color-text)",
                    textDecoration: "none",
                    fontFamily: "var(--font-sans)",
                    fontSize: "var(--text-base)",
                    fontWeight: 500,
                    transition: "box-shadow var(--duration-fast) var(--ease-out)",
                  }}
                  onMouseEnter={(e) => {
                    (e.currentTarget as HTMLElement).style.boxShadow = "var(--shadow-sm)";
                  }}
                  onMouseLeave={(e) => {
                    (e.currentTarget as HTMLElement).style.boxShadow = "none";
                  }}
                >
                  {lessonTitle}
                </Link>
              );
            })}
          </div>
        </>
      )}
    </div>
  );
};
