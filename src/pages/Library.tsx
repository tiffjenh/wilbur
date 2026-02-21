import React from "react";
import { Link, useParams } from "react-router-dom";
import { categories } from "@/lib/stubData";
import { Sidebar } from "@/components/layout/Sidebar";
import { Icon, IconBox } from "@/components/ui/Icon";

const StatusDot: React.FC<{ status: string }> = ({ status }) => {
  if (status === "completed") return (
    <span style={{ width: "18px", height: "18px", borderRadius: "50%", backgroundColor: "var(--color-primary)", display: "inline-flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
      <Icon name="check" size={10} color="#fff" strokeWidth={2.5} />
    </span>
  );
  if (status === "locked") return (
    <span style={{ width: "18px", height: "18px", borderRadius: "50%", backgroundColor: "var(--color-locked-bg)", border: "1.5px solid var(--color-locked)", display: "inline-flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
      <Icon name="lock" size={9} color="var(--color-locked)" strokeWidth={2} />
    </span>
  );
  return (
    <span style={{ width: "18px", height: "18px", borderRadius: "50%", border: "2px solid var(--color-border)", display: "inline-flex", flexShrink: 0 }} />
  );
};

export const Library: React.FC = () => (
  <div className="page-enter" style={{ maxWidth: "var(--page-max)", margin: "0 auto", padding: "var(--space-8) var(--space-6)" }}>
    <h1 style={{ fontFamily: "var(--font-serif)", fontSize: "var(--text-2xl)", fontWeight: 600, marginBottom: "10px" }}>
      Library
    </h1>
    <p style={{ color: "var(--color-text-muted)", fontSize: "var(--text-base)", marginBottom: "var(--space-8)" }}>
      Explore all our lessons organized by topic. Click any category to dive into structured learning paths.
    </p>

    <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(252px, 1fr))", gap: "var(--space-5)" }}>
      {categories.map((cat) => (
        <Link
          key={cat.id}
          to={`/library/${cat.slug}`}
          className="stagger-item"
          style={{
            display: "block", textDecoration: "none",
            backgroundColor: "var(--color-surface)",
            borderRadius: "var(--radius-lg)",
            padding: "var(--space-5)",
            border: "1px solid var(--color-border-light)",
            boxShadow: "var(--shadow-sm)",
            transition: "transform var(--duration-fast) var(--ease-out), box-shadow var(--duration-fast) var(--ease-out)",
          }}
          onMouseEnter={(e) => { (e.currentTarget as HTMLElement).style.transform = "translateY(-2px)"; (e.currentTarget as HTMLElement).style.boxShadow = "var(--shadow-md)"; }}
          onMouseLeave={(e) => { (e.currentTarget as HTMLElement).style.transform = "translateY(0)"; (e.currentTarget as HTMLElement).style.boxShadow = "var(--shadow-sm)"; }}
        >
          <IconBox name={cat.icon} size={20} boxSize={44} />
          <h3 style={{ fontFamily: "var(--font-serif)", fontSize: "var(--text-lg)", fontWeight: 600, marginBottom: "6px", marginTop: "var(--space-4)" }}>
            {cat.title}
          </h3>
          <p style={{ fontSize: "var(--text-sm)", color: "var(--color-text-muted)", marginBottom: "var(--space-4)", lineHeight: 1.5 }}>
            {cat.description}
          </p>
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
            <span style={{ fontSize: "var(--text-xs)", color: "var(--color-text-muted)" }}>
              {cat.lessonCount} lessons
            </span>
            <span style={{ display: "inline-flex", alignItems: "center", gap: "4px", fontSize: "var(--text-sm)", color: "var(--color-primary)", fontWeight: 600 }}>
              Explore <Icon name="arrow-right" size={14} color="var(--color-primary)" strokeWidth={2} />
            </span>
          </div>
        </Link>
      ))}
    </div>
  </div>
);

export const LibraryCategory: React.FC = () => {
  const { slug } = useParams<{ slug: string }>();
  const category = categories.find((c) => c.slug === slug);

  if (!category) {
    return (
      <div style={{ padding: "var(--space-8) var(--space-6)", textAlign: "center" }}>
        <h2>Category not found</h2>
        <Link to="/library" style={{ color: "var(--color-primary)" }}>← Back to Library</Link>
      </div>
    );
  }

  const completedCount = category.lessons.filter((l) => l.status === "completed").length;
  const grouped = category.lessons.reduce<Record<string, typeof category.lessons>>((acc, lesson) => {
    if (!acc[lesson.category]) acc[lesson.category] = [];
    acc[lesson.category].push(lesson);
    return acc;
  }, {});

  return (
    <div className="page-enter" style={{ display: "flex" }}>
      <Sidebar title={category.title} lessons={category.lessons} />
      <div style={{ flex: 1, minWidth: 0, padding: "var(--space-8) var(--space-8)" }}>
        <Link to="/library" style={{ display: "inline-flex", alignItems: "center", gap: "6px", fontSize: "var(--text-sm)", color: "var(--color-text-muted)", marginBottom: "var(--space-5)", textDecoration: "none" }}>
          <Icon name="chevron-left" size={13} strokeWidth={2} />
          Back to Library
        </Link>

        <div style={{ display: "flex", alignItems: "center", gap: "14px", marginBottom: "8px" }}>
          <IconBox name={category.icon} size={20} boxSize={42} />
          <h1 style={{ fontFamily: "var(--font-serif)", fontSize: "var(--text-2xl)", fontWeight: 600 }}>
            {category.title}
          </h1>
        </div>
        <p style={{ color: "var(--color-text-muted)", fontSize: "var(--text-base)", marginBottom: "var(--space-5)", lineHeight: 1.6 }}>
          {category.description}
        </p>

        {/* Progress */}
        <div className="card" style={{ padding: "var(--space-4) var(--space-5)", marginBottom: "var(--space-6)" }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "10px" }}>
            <span style={{ fontSize: "var(--text-sm)", fontWeight: 600 }}>Your Progress</span>
            <span style={{ fontSize: "var(--text-sm)", color: "var(--color-text-muted)" }}>
              {completedCount} of {category.lessons.length} completed
            </span>
          </div>
          <div style={{ height: "6px", backgroundColor: "var(--color-border-light)", borderRadius: "var(--radius-full)", overflow: "hidden" }}>
            <div style={{
              height: "100%",
              width: `${(completedCount / category.lessons.length) * 100}%`,
              backgroundColor: "var(--color-primary)",
              borderRadius: "var(--radius-full)",
              animation: "progressGrow 1s var(--ease-out)",
            }} />
          </div>
        </div>

        {/* Lesson groups */}
        {Object.entries(grouped).map(([groupTitle, lessons]) => (
          <div key={groupTitle} style={{ marginBottom: "var(--space-6)" }}>
            <h3 style={{ fontFamily: "var(--font-serif)", fontSize: "var(--text-base)", fontWeight: 600, marginBottom: "var(--space-3)", paddingBottom: "var(--space-2)", borderBottom: "1px solid var(--color-border-light)", color: "var(--color-text-secondary)" }}>
              {groupTitle}
            </h3>
            <div style={{ display: "flex", flexDirection: "column", gap: "6px" }}>
              {lessons.map((lesson) => (
                <Link
                  key={lesson.id}
                  to={lesson.status !== "locked" ? `/lesson/${lesson.slug}` : "#"}
                  style={{
                    display: "flex", alignItems: "center", justifyContent: "space-between",
                    padding: "13px var(--space-4)",
                    borderRadius: "var(--radius-md)",
                    backgroundColor: "var(--color-surface)",
                    border: "1px solid var(--color-border-light)",
                    textDecoration: "none",
                    opacity: lesson.status === "locked" ? 0.55 : 1,
                    cursor: lesson.status === "locked" ? "default" : "pointer",
                    transition: "background-color var(--duration-fast)",
                  }}
                  onMouseEnter={(e) => { if (lesson.status !== "locked") (e.currentTarget as HTMLElement).style.backgroundColor = "var(--color-surface-hover)"; }}
                  onMouseLeave={(e) => { (e.currentTarget as HTMLElement).style.backgroundColor = "var(--color-surface)"; }}
                >
                  <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
                    <StatusDot status={lesson.status} />
                    <div>
                      <div style={{ fontSize: "var(--text-sm)", fontWeight: 500, color: "var(--color-text)" }}>{lesson.title}</div>
                      <div style={{ display: "flex", alignItems: "center", gap: "4px", fontSize: "11px", color: "var(--color-text-muted)", marginTop: "2px" }}>
                        <Icon name="clock" size={11} strokeWidth={1.8} />
                        {lesson.duration}
                      </div>
                    </div>
                  </div>
                  {lesson.status !== "locked" && (
                    <button style={{
                      padding: "5px 14px", borderRadius: "var(--radius-full)",
                      backgroundColor: lesson.status === "completed" ? "transparent" : "var(--color-primary)",
                      color: lesson.status === "completed" ? "var(--color-primary)" : "#fff",
                      border: lesson.status === "completed" ? "1px solid var(--color-primary)" : "none",
                      cursor: "pointer", fontSize: "var(--text-xs)",
                      fontFamily: "var(--font-sans)", fontWeight: 600,
                    }}>
                      {lesson.status === "completed" ? "Review" : "Start"}
                    </button>
                  )}
                </Link>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
