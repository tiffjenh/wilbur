import React, { useState, useCallback, useEffect } from "react";
import { Link, useParams } from "react-router-dom";
import { Sidebar } from "@/components/layout/Sidebar";
import { Icon, IconBox } from "@/components/ui/Icon";
import { CURRICULUM } from "@/lib/curriculum/curriculum";
import type { DomainCategory, Lesson as CurriculumLesson } from "@/lib/curriculum/curriculum";
import { getLessonsByDomain } from "@/lib/curriculum/curriculum";
import { isLessonAvailable } from "@/lib/catalog/auditCatalog";
import { addLesson, loadUserAddedSync } from "@/lib/storage/userAddedLessons";
import type { IconName } from "@/components/ui/Icon";

/** Map curriculum category id → icon for Library cards (design unchanged). */
const CATEGORY_ICON: Record<string, IconName> = {
  "money-foundations": "book-open",
  "budgeting-cash-flow": "wallet",
  "banking-safe-money": "piggy-bank",
  "credit-debt": "credit-card",
  "income-taxes-benefits": "graduation-cap",
  "investing-fundamentals": "trend-up",
  "retirement-accounts": "sunset",
  "advanced-investing": "bar-chart",
  "real-estate-property": "home",
  "life-stage-planning": "target",
  "behavioral-finance": "brain",
  "tools-simulations": "clipboard",
};

const StatusDot: React.FC<{ status: string }> = ({ status }) => {
  if (status === "completed") return (
    <span style={{ width: "18px", height: "18px", borderRadius: "50%", backgroundColor: "var(--color-primary)", display: "inline-flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
      <Icon name="check" size={10} color="#fff" strokeWidth={2.5} />
    </span>
  );
  return (
    <span style={{ width: "18px", height: "18px", borderRadius: "50%", border: "2px solid var(--color-border)", display: "inline-flex", flexShrink: 0 }} />
  );
};

export const Library: React.FC = () => {
  const categoriesSorted = [...CURRICULUM.categories].sort((a, b) => a.order - b.order);
  const categoriesWithCount = categoriesSorted.map((cat) => ({
    ...cat,
    slug: cat.id,
    icon: CATEGORY_ICON[cat.id] ?? "book-open",
    lessonCount: CURRICULUM.lessons.filter((l) => l.domainId === cat.id && isLessonAvailable(l.id)).length,
  }));

  return (
    <div className="page-enter" style={{ maxWidth: "var(--page-max)", margin: "0 auto", padding: "var(--space-8) var(--space-6)" }}>
      <h1 style={{ fontFamily: "var(--font-serif)", fontSize: "var(--text-2xl)", fontWeight: 600, marginBottom: "10px" }}>
        Library
      </h1>
      <p style={{ color: "var(--color-text-muted)", fontSize: "var(--text-base)", marginBottom: "var(--space-8)" }}>
        Explore all our lessons organized by topic. Click any category to dive into structured learning paths.
      </p>

      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(252px, 1fr))", gap: "var(--space-5)" }}>
        {categoriesWithCount.map((cat) => (
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
                {cat.lessonCount} lesson{cat.lessonCount !== 1 ? "s" : ""}
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
};

function levelLabel(level: CurriculumLesson["level"]): string {
  return level.charAt(0).toUpperCase() + level.slice(1);
}

export const LibraryCategory: React.FC = () => {
  const { slug } = useParams<{ slug: string }>();
  const category: DomainCategory | null = slug ? CURRICULUM.categories.find((c) => c.id === slug) ?? null : null;
  const categoryLessons = slug ? getLessonsByDomain(slug).filter((l) => isLessonAvailable(l.id)) : [];
  const [addedIds, setAddedIds] = useState<Set<string>>(() => new Set(loadUserAddedSync()));

  useEffect(() => {
    setAddedIds(new Set(loadUserAddedSync()));
  }, [slug]);

  const handleAddToLearning = useCallback((e: React.MouseEvent, lessonId: string) => {
    e.preventDefault();
    e.stopPropagation();
    addLesson(lessonId);
    setAddedIds((prev) => new Set(prev).add(lessonId));
  }, []);

  if (!category) {
    return (
      <div style={{ padding: "var(--space-8) var(--space-6)", textAlign: "center" }}>
        <h2>Category not found</h2>
        <Link to="/library" style={{ color: "var(--color-primary)" }}>← Back to Library</Link>
      </div>
    );
  }

  const icon = CATEGORY_ICON[category.id] ?? "book-open";

  const sidebarLessons = categoryLessons.map((l, i) => ({
    id: l.id,
    slug: l.id,
    title: l.title,
    category: category.title,
    duration: `${l.estimatedMinutes} min`,
    status: "available" as const,
    order: i + 1,
  }));

  return (
    <div className="page-enter" style={{ display: "flex" }}>
      <Sidebar title={category.title} lessons={sidebarLessons} />
      <div style={{ flex: 1, minWidth: 0, padding: "var(--space-8) var(--space-8)" }}>
        <Link to="/library" style={{ display: "inline-flex", alignItems: "center", gap: "6px", fontSize: "var(--text-sm)", color: "var(--color-text-muted)", marginBottom: "var(--space-5)", textDecoration: "none" }}>
          <Icon name="chevron-left" size={13} strokeWidth={2} />
          Back to Library
        </Link>

        <div style={{ display: "flex", alignItems: "center", gap: "14px", marginBottom: "8px" }}>
          <IconBox name={icon} size={20} boxSize={42} />
          <h1 style={{ fontFamily: "var(--font-serif)", fontSize: "var(--text-2xl)", fontWeight: 600 }}>
            {category.title}
          </h1>
        </div>
        <p style={{ color: "var(--color-text-muted)", fontSize: "var(--text-base)", marginBottom: "var(--space-5)", lineHeight: 1.6 }}>
          {category.description}
        </p>

        <p style={{ fontSize: "var(--text-sm)", color: "var(--color-text-muted)", marginBottom: "var(--space-6)" }}>
          All lessons in this category. Use <strong>+ Add to Learning</strong> to add any lesson to your Learning path.
        </p>

        {/* All lessons visible — no locks */}
        {categoryLessons.length === 0 ? (
          <p style={{ fontSize: "var(--text-sm)", color: "var(--color-text-muted)" }}>
            No lessons in this category yet. This section may contain resources only.
          </p>
        ) : (
          <div style={{ display: "flex", flexDirection: "column", gap: "6px" }}>
            {categoryLessons.map((lesson) => {
              const isAdded = addedIds.has(lesson.id);
              return (
                <div
                  key={lesson.id}
                  style={{
                    display: "flex", alignItems: "center", justifyContent: "space-between",
                    padding: "13px var(--space-4)",
                    borderRadius: "var(--radius-md)",
                    backgroundColor: "var(--color-surface)",
                    border: "1px solid var(--color-border-light)",
                    transition: "background-color var(--duration-fast)",
                  }}
                >
                  <Link
                    to={`/lesson/${lesson.id}`}
                    style={{
                      display: "flex", alignItems: "center", gap: "12px",
                      flex: 1, minWidth: 0, textDecoration: "none", color: "inherit",
                    }}
                    onMouseEnter={(e) => { (e.currentTarget as HTMLElement).closest("div")!.style.backgroundColor = "var(--color-surface-hover)"; }}
                    onMouseLeave={(e) => { (e.currentTarget as HTMLElement).closest("div")!.style.backgroundColor = "var(--color-surface)"; }}
                  >
                    <StatusDot status="available" />
                    <div>
                      <div style={{ fontSize: "var(--text-sm)", fontWeight: 500, color: "var(--color-text)" }}>{lesson.title}</div>
                      <div style={{ display: "flex", alignItems: "center", gap: "8px", fontSize: "11px", color: "var(--color-text-muted)", marginTop: "2px" }}>
                        <span>{levelLabel(lesson.level)}</span>
                        <span>·</span>
                        <span style={{ display: "inline-flex", alignItems: "center", gap: "4px" }}>
                          <Icon name="clock" size={11} strokeWidth={1.8} />
                          {lesson.estimatedMinutes} min
                        </span>
                      </div>
                    </div>
                  </Link>
                  <button
                    type="button"
                    onClick={(e) => handleAddToLearning(e, lesson.id)}
                    disabled={isAdded}
                    aria-label={isAdded ? "Added to Learning" : "Add to Learning"}
                    style={{
                      display: "inline-flex", alignItems: "center", justifyContent: "center",
                      width: 32, height: 32, borderRadius: "50%",
                      border: isAdded ? "1.5px solid var(--color-primary)" : "1.5px solid var(--color-border)",
                      backgroundColor: isAdded ? "rgba(14,92,76,0.08)" : "transparent",
                      color: isAdded ? "var(--color-primary)" : "var(--color-text-muted)",
                      cursor: isAdded ? "default" : "pointer",
                      flexShrink: 0,
                      transition: "border-color var(--duration-fast), background-color var(--duration-fast)",
                    }}
                  >
                    {isAdded ? (
                      <Icon name="check" size={14} color="var(--color-primary)" strokeWidth={2.5} />
                    ) : (
                      <Icon name="plus" size={16} color="var(--color-text-muted)" strokeWidth={2.5} />
                    )}
                  </button>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};
