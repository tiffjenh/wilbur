import React, { useState, useRef, useCallback } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import { lessonContents, roadmapLessons, categories } from "@/lib/stubData";
import { Sidebar } from "@/components/layout/Sidebar";
import { TutorPanel } from "@/components/layout/TutorPanel";
import { Icon } from "@/components/ui/Icon";

export const Lesson: React.FC = () => {
  const { slug } = useParams<{ slug: string }>();
  const navigate = useNavigate();
  const [selectedText, setSelectedText] = useState<string | undefined>();
  const [tutorVisible, setTutorVisible] = useState(true);
  const contentRef = useRef<HTMLDivElement>(null);

  const lesson = slug ? lessonContents[slug] : null;

  const allLessons = categories.flatMap((c) => c.lessons);
  const sidebarLessons = lesson
    ? allLessons.filter((l) => l.category === lesson.category).length > 2
      ? allLessons.filter((l) => l.category === lesson.category)
      : roadmapLessons
    : roadmapLessons;

  const handleTextSelect = useCallback(() => {
    const selection = window.getSelection();
    const text = selection?.toString().trim();
    if (text && text.length > 1 && text.length < 60) {
      setSelectedText(text);
      setTutorVisible(true);
    }
  }, []);

  if (!lesson) {
    return (
      <div style={{ padding: "var(--space-8) var(--space-6)", textAlign: "center" }}>
        <h2 style={{ fontFamily: "var(--font-serif)", marginBottom: "var(--space-4)" }}>Lesson not found</h2>
        <Link to="/library" style={{ color: "var(--color-primary)" }}>← Back to Library</Link>
      </div>
    );
  }

  return (
    <div className="page-enter" style={{ display: "flex", height: "calc(100vh - var(--nav-height))" }}>
      {/* Left Sidebar */}
      <Sidebar
        title="Your Path"
        subtitle={`${roadmapLessons.filter(l => l.status === "completed").length} lessons personalized for you`}
        lessons={sidebarLessons}
      />

      {/* Main content */}
      <div
        ref={contentRef}
        onMouseUp={handleTextSelect}
        style={{ flex: 1, minWidth: 0, overflowY: "auto", padding: "var(--space-8)" }}
      >
        {/* Top action bar — matches class.png "Want to learn more?" + "Hide this" */}
        <div style={{ display: "flex", alignItems: "center", gap: "var(--space-3)", marginBottom: "var(--space-6)" }}>
          <button
            style={{
              display: "inline-flex", alignItems: "center", gap: "7px",
              padding: "9px 18px", borderRadius: "var(--radius-full)",
              border: "1px solid var(--color-border)", backgroundColor: "var(--color-surface)",
              fontSize: "var(--text-sm)", fontWeight: 600, color: "var(--color-text)",
              cursor: "pointer", fontFamily: "var(--font-sans)", boxShadow: "var(--shadow-sm)",
              transition: "box-shadow var(--duration-fast), background-color var(--duration-fast)",
            }}
            onMouseEnter={(e) => { (e.currentTarget as HTMLElement).style.backgroundColor = "var(--color-surface-hover)"; }}
            onMouseLeave={(e) => { (e.currentTarget as HTMLElement).style.backgroundColor = "var(--color-surface)"; }}
            onClick={() => navigate("/library")}
          >
            {/* Hand / cursor icon matching mock */}
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
              <path d="M18 11V6a2 2 0 0 0-2-2 2 2 0 0 0-2 2M14 10V4a2 2 0 0 0-2-2 2 2 0 0 0-2 2v2M10 10.5V6a2 2 0 0 0-2-2 2 2 0 0 0-2 2v8a6 6 0 0 0 6 6 6 6 0 0 0 6-6v-2.5" />
            </svg>
            Want to learn more?
          </button>
          <button
            style={{
              display: "inline-flex", alignItems: "center", gap: "6px",
              padding: "9px 18px", borderRadius: "var(--radius-full)",
              border: "1px solid var(--color-border)", backgroundColor: "var(--color-surface)",
              fontSize: "var(--text-sm)", fontWeight: 500, color: "var(--color-text-muted)",
              cursor: "pointer", fontFamily: "var(--font-sans)",
              transition: "background-color var(--duration-fast)",
            }}
            onMouseEnter={(e) => { (e.currentTarget as HTMLElement).style.backgroundColor = "var(--color-surface-hover)"; }}
            onMouseLeave={(e) => { (e.currentTarget as HTMLElement).style.backgroundColor = "var(--color-surface)"; }}
            onClick={() => setTutorVisible(!tutorVisible)}
          >
            <Icon name={tutorVisible ? "x" : "sparkle"} size={13} strokeWidth={2} />
            {tutorVisible ? "Hide this" : "Show helper"}
          </button>
        </div>

        {/* Lesson content */}
        <article style={{ maxWidth: "var(--content-max)" }}>
          <h1 style={{ fontFamily: "var(--font-serif)", fontSize: "var(--text-3xl)", fontWeight: 400, marginBottom: "var(--space-3)", lineHeight: 1.2, color: "var(--color-text)" }}>
            {lesson.title}
          </h1>
          <h2 style={{ fontFamily: "var(--font-serif)", fontSize: "var(--text-xl)", fontWeight: 600, marginBottom: "var(--space-5)", color: "var(--color-text)", lineHeight: 1.3 }}>
            {lesson.subtitle}
          </h2>

          {/* Metadata row */}
          <div style={{ display: "flex", alignItems: "center", gap: "var(--space-4)", marginBottom: "var(--space-6)", paddingBottom: "var(--space-5)", borderBottom: "1px solid var(--color-border-light)" }}>
            <span style={{ display: "inline-flex", alignItems: "center", gap: "5px", fontSize: "var(--text-sm)", color: "var(--color-text-muted)" }}>
              <Icon name="clock" size={14} strokeWidth={1.8} />
              {lesson.duration}
            </span>
            <span style={{ display: "inline-flex", alignItems: "center", gap: "5px", fontSize: "var(--text-sm)", color: "var(--color-text-muted)" }}>
              <Icon name="graduation-cap" size={14} strokeWidth={1.8} />
              {lesson.category}
            </span>
          </div>

          {lesson.sections.map((section, i) => (
            <div key={i} style={{ marginBottom: "var(--space-6)" }}>
              {section.heading && (
                <h3 style={{ fontFamily: "var(--font-serif)", fontSize: "var(--text-lg)", fontWeight: 600, marginBottom: "var(--space-3)", color: "var(--color-text)" }}>
                  {section.heading}
                </h3>
              )}
              {section.body && (
                <p style={{ fontSize: "var(--text-base)", lineHeight: 1.8, color: "var(--color-text-secondary)", marginBottom: section.bullets ? "var(--space-3)" : 0 }}>
                  {section.body}
                </p>
              )}
              {section.bullets && (
                <ul style={{ paddingLeft: "var(--space-5)", display: "flex", flexDirection: "column", gap: "var(--space-2)" }}>
                  {section.bullets.map((bullet, j) => (
                    <li key={j} style={{ fontSize: "var(--text-base)", lineHeight: 1.7, color: "var(--color-text-secondary)" }}>
                      {bullet}
                    </li>
                  ))}
                </ul>
              )}
            </div>
          ))}

          {/* Disclaimer */}
          <div style={{
            marginTop: "var(--space-8)", padding: "var(--space-4) var(--space-5)",
            backgroundColor: "var(--color-accent-light)",
            borderRadius: "var(--radius-md)", border: "1px solid var(--color-accent-border)",
            fontSize: "var(--text-sm)", color: "var(--color-text-secondary)", lineHeight: 1.6,
          }}>
            <strong>Educational Example Only:</strong> All numbers and scenarios are hypothetical and for learning purposes only. This is not financial advice.
          </div>

          {/* Next lesson navigation */}
          <div style={{ display: "flex", justifyContent: "flex-end", marginTop: "var(--space-8)", paddingBottom: "var(--space-8)" }}>
            <button
              onClick={() => navigate("/library")}
              style={{
                display: "inline-flex", alignItems: "center", gap: "8px",
                padding: "12px 28px", backgroundColor: "var(--color-primary)", color: "#fff",
                border: "none", borderRadius: "var(--radius-full)",
                cursor: "pointer", fontSize: "var(--text-base)", fontWeight: 600, fontFamily: "var(--font-sans)",
              }}
            >
              Mark as Complete
              <Icon name="arrow-right" size={16} color="#fff" strokeWidth={2} />
            </button>
          </div>
        </article>
      </div>

      {/* Right TutorPanel */}
      <TutorPanel
        selectedText={selectedText}
        visible={tutorVisible}
        onClose={() => setTutorVisible(false)}
      />
    </div>
  );
};
