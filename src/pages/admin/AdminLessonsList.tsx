import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { listLessonsAdmin } from "@/lib/supabase/adminLessons";
import type { CMSLessonRecord } from "@/lib/lessonBlocks/types";

export const AdminLessonsList: React.FC = () => {
  const [lessons, setLessons] = useState<CMSLessonRecord[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    listLessonsAdmin()
      .then(setLessons)
      .finally(() => setLoading(false));
  }, []);

  return (
    <div style={{ padding: "var(--space-8) var(--page-px)", maxWidth: 900, margin: "0 auto" }}>
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "var(--space-6)" }}>
        <h1 style={{ fontFamily: "var(--font-serif)", margin: 0, color: "var(--color-text)" }}>Lessons</h1>
        <Link
          to="/admin/lessons/new"
          style={{
            padding: "8px 16px",
            backgroundColor: "var(--color-primary)",
            color: "#fff",
            borderRadius: "var(--radius-full)",
            fontFamily: "var(--font-sans)",
            fontSize: "var(--text-sm)",
            fontWeight: 600,
            textDecoration: "none",
          }}
        >
          New lesson
        </Link>
      </div>
      {loading ? (
        <p style={{ color: "var(--color-text-muted)" }}>Loading…</p>
      ) : lessons.length === 0 ? (
        <p style={{ color: "var(--color-text-secondary)" }}>No lessons yet.</p>
      ) : (
        <ul style={{ listStyle: "none", padding: 0, margin: 0, display: "flex", flexDirection: "column", gap: "var(--space-2)" }}>
          {lessons.map((l) => (
            <li key={l.id}>
              <Link
                to={`/admin/lessons/${l.id}`}
                style={{
                  display: "block",
                  padding: "var(--space-3) var(--space-4)",
                  backgroundColor: "var(--color-surface)",
                  border: "1px solid var(--color-border-light)",
                  borderRadius: "var(--radius-md)",
                  fontFamily: "var(--font-sans)",
                  color: "var(--color-text)",
                  textDecoration: "none",
                }}
              >
                <span style={{ fontWeight: 600 }}>{l.title}</span>
                <span style={{ color: "var(--color-text-muted)", marginLeft: "var(--space-2)" }}>/{l.slug}</span>
                <span
                  style={{
                    marginLeft: "var(--space-2)",
                    padding: "2px 8px",
                    borderRadius: 4,
                    fontSize: "var(--text-xs)",
                    fontWeight: 600,
                    backgroundColor: l.status === "published" ? "rgba(14,92,76,0.1)" : "var(--color-surface-hover)",
                    color: l.status === "published" ? "#0E5C4C" : "var(--color-text-muted)",
                  }}
                >
                  {l.status}
                </span>
              </Link>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};
