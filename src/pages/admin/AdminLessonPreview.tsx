import React, { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { getLessonByIdAdmin } from "@/lib/supabase/adminLessons";
import { LessonRenderer } from "@/components/lesson/LessonRenderer";
import type { CMSLessonRecord } from "@/lib/lessonBlocks/types";

export const AdminLessonPreview: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const [lesson, setLesson] = useState<CMSLessonRecord | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!id) return;
    getLessonByIdAdmin(id)
      .then(setLesson)
      .finally(() => setLoading(false));
  }, [id]);

  if (!id) return null;
  if (loading) return <p style={{ padding: "var(--space-8)", color: "var(--color-text-muted)" }}>Loading…</p>;
  if (!lesson) return <p style={{ padding: "var(--space-8)", color: "var(--color-text-secondary)" }}>Lesson not found.</p>;

  return (
    <div style={{ padding: "var(--space-8)", maxWidth: "var(--content-max)", margin: "0 auto" }}>
      <div style={{ marginBottom: "var(--space-4)", display: "flex", alignItems: "center", gap: "var(--space-3)" }}>
        <Link
          to={`/admin/lessons/${id}`}
          style={{ fontFamily: "var(--font-sans)", color: "var(--color-primary)", fontWeight: 600, textDecoration: "none" }}
        >
          ← Back to edit
        </Link>
        <span style={{ color: "var(--color-text-muted)", fontSize: "var(--text-sm)" }}>Preview (draft or published)</span>
      </div>
      <LessonRenderer lesson={lesson} />
    </div>
  );
};
