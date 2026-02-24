import React, { useState, useRef, useEffect, useCallback } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import { CURRICULUM } from "@/lib/curriculum/curriculum";
import { getLessonContent, buildLessonExcerpt } from "@/lib/lessons/content";
import type { LessonBlock } from "@/lib/lessons/content";
import { useAuth } from "@/contexts/AuthContext";
import { Sidebar } from "@/components/layout/Sidebar";
import { TutorPanel } from "@/components/layout/TutorPanel";
import { Icon } from "@/components/ui/Icon";
import { AccountPopup } from "@/components/ui/Modal";
import { POST_ONBOARDING_PROMPT_SIGNUP } from "@/lib/onboardingSchema";
import { BlockRenderer } from "@/components/lessonBlocks/BlockRenderer";
import { HighlightAI } from "@/components/highlightAI/HighlightAI";
import { markComplete } from "@/lib/storage/lessonProgress";
import { shouldWarnLesson } from "@/lib/recommendation/scoring";
import { LESSON_CATALOG_BY_ID } from "@/content/lessons/lessonCatalog";
import { loadAnswersFromStorage, toQuestionnaireAnswers } from "@/lib/recommendation/adapter";
import { loadFeedbackSync } from "@/lib/storage/lessonProgress";
import type { LessonBlock as LegacyLessonBlock } from "@/content/lessonTypes";

/** Map lib/lessons/content blocks to content/lessonTypes blocks for BlockRenderer. */
function contentBlockToLegacy(block: LessonBlock): LegacyLessonBlock | null {
  switch (block.type) {
    case "bullets":
      return { type: "bullet-list", heading: block.heading, items: block.items, icon: block.icon };
    case "callout":
      return { type: "callout", tone: block.tone, heading: block.heading, text: block.text };
    case "comparisonTable":
      return { type: "comparison", heading: block.heading, left: block.left, right: block.right, note: block.note };
    case "steps":
      return {
        type: "bullet-list",
        heading: block.heading,
        items: block.steps.map((s, i) => `${i + 1}. ${s}`),
        icon: "arrow",
      };
    case "scenario":
      return {
        type: "example",
        heading: block.heading,
        scenario: block.scenario,
        breakdown: block.breakdown,
        outcome: block.outcome,
      };
    case "keyTakeaways":
      return {
        type: "bullet-list",
        heading: block.heading ?? "Key takeaways",
        items: block.items,
        icon: "check",
      };
    case "chartPlaceholder":
      return { type: "chart-placeholder", title: block.title, subtitle: block.subtitle };
    default:
      return null;
  }
}

const BLOCK_RADIUS = 12;
const BLOCK_PADDING = "20px 24px";
const BLOCK_MB = 16;

export const Lesson: React.FC = () => {
  const { slug } = useParams<{ slug: string }>();
  const navigate = useNavigate();
  const [selectedText, setSelectedText] = useState<string | undefined>();
  const [showAccountPopup, setShowAccountPopup] = useState(false);
  const [dismissedAdvancedWarning, setDismissedAdvancedWarning] = useState(false);
  const WILBUR_HELPER_OPEN_KEY = "wilbur_helper_open";

  const [tutorOpen, setTutorOpen] = useState(() => {
    try {
      const stored = localStorage.getItem(WILBUR_HELPER_OPEN_KEY);
      return stored !== "false";
    } catch {
      return true;
    }
  });
  const contentRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (selectedText?.trim()) {
      setTutorOpen(true);
      try {
        localStorage.setItem(WILBUR_HELPER_OPEN_KEY, "true");
      } catch { /* ignore */ }
    }
  }, [selectedText]);

  const { user } = useAuth();
  useEffect(() => {
    try {
      if (!user && sessionStorage.getItem(POST_ONBOARDING_PROMPT_SIGNUP) === "1") {
        sessionStorage.removeItem(POST_ONBOARDING_PROMPT_SIGNUP);
        setShowAccountPopup(true);
      }
    } catch { /* ignore */ }
  }, [user]);

  const curriculumLesson = slug ? CURRICULUM.lessons.find((l) => l.id === slug) ?? null : null;
  const content = slug ? getLessonContent(slug) : null;
  const excerptBlock = content ? buildLessonExcerpt(content) : "";

  const sidebarLessons = curriculumLesson
    ? CURRICULUM.lessons.filter((l) => l.domainId === curriculumLesson.domainId)
    : CURRICULUM.lessons.slice(0, 12);
  const sidebarItems = sidebarLessons.map((l, i) => ({
    id: l.id,
    slug: l.id,
    title: l.title,
    category: l.tags[0] ?? "",
    duration: `${l.estimatedMinutes} min`,
    status: "available" as const,
    order: i + 1,
  }));

  const handleMarkComplete = useCallback(() => {
    if (slug) markComplete(slug);
    navigate("/learning");
  }, [slug, navigate]);

  const catalogLesson = slug ? LESSON_CATALOG_BY_ID[slug] : null;
  const answers = loadAnswersFromStorage() ?? toQuestionnaireAnswers({});
  const feedbackMap = loadFeedbackSync();
  const showAdvancedWarning =
    catalogLesson &&
    shouldWarnLesson(catalogLesson, answers, feedbackMap) &&
    !dismissedAdvancedWarning;

  if (!curriculumLesson) {
    return (
      <div style={{ padding: "var(--space-8) var(--space-6)", textAlign: "center" }}>
        <h2 style={{ fontFamily: "var(--font-serif)", marginBottom: "var(--space-4)" }}>Lesson not found</h2>
        <Link to="/library" style={{ color: "var(--color-primary)" }}>← Back to Library</Link>
      </div>
    );
  }

  const lessonTitle = curriculumLesson.title;
  const lessonCategory = curriculumLesson.tags[0] ?? curriculumLesson.domainId;
  const lessonDuration = `${curriculumLesson.estimatedMinutes} min`;
  const legacyBlocks = content ? content.blocks.map(contentBlockToLegacy).filter((b): b is LegacyLessonBlock => b != null) : [];

  return (
    <>
      <div className="page-enter" style={{ display: "flex", height: "calc(100vh - var(--nav-height))" }}>
        <Sidebar
          title="Your Path"
          subtitle={`${sidebarItems.length} lessons in this area`}
          lessons={sidebarItems}
        />

        <div
          ref={contentRef}
          style={{ flex: 1, minWidth: 0, overflowY: "auto", padding: "var(--space-8)" }}
        >
          {showAdvancedWarning && (
            <div
              style={{
                marginBottom: "var(--space-6)",
                padding: "var(--space-4) var(--space-5)",
                backgroundColor: "rgba(255,193,7,0.12)",
                border: "1px solid rgba(255,193,7,0.4)",
                borderRadius: "var(--radius-md)",
              }}
            >
              <p style={{ margin: 0, fontSize: "var(--text-sm)", color: "var(--color-text-secondary)", lineHeight: 1.6 }}>
                This lesson may feel advanced. Consider taking Investing 101 first.
              </p>
              <button
                type="button"
                onClick={() => setDismissedAdvancedWarning(true)}
                style={{
                  marginTop: 12,
                  padding: "8px 16px",
                  fontSize: "var(--text-sm)",
                  fontWeight: 600,
                  fontFamily: "var(--font-sans)",
                  color: "var(--color-primary)",
                  backgroundColor: "transparent",
                  border: "1.5px solid var(--color-primary)",
                  borderRadius: "var(--radius-full)",
                  cursor: "pointer",
                }}
              >
                Continue anyway
              </button>
            </div>
          )}

          <article style={{ maxWidth: tutorOpen ? "var(--content-max)" : "100%" }}>
            <div style={{ display: "flex", alignItems: "center", gap: "var(--space-4)", marginBottom: "var(--space-6)", paddingBottom: "var(--space-5)", borderBottom: "1px solid var(--color-border-light)" }}>
              <span style={{ display: "inline-flex", alignItems: "center", gap: "5px", fontSize: "var(--text-sm)", color: "var(--color-text-muted)" }}>
                <Icon name="clock" size={14} strokeWidth={1.8} />
                {lessonDuration}
              </span>
              <span style={{ display: "inline-flex", alignItems: "center", gap: "5px", fontSize: "var(--text-sm)", color: "var(--color-text-muted)" }}>
                <Icon name="graduation-cap" size={14} strokeWidth={1.8} />
                {lessonCategory}
              </span>
              <span style={{
                display: "inline-flex", alignItems: "center",
                padding: "2px 8px", borderRadius: 4,
                backgroundColor: curriculumLesson.level === "beginner" ? "rgba(14,92,76,0.1)" : curriculumLesson.level === "intermediate" ? "rgba(255,214,176,0.4)" : "rgba(217,83,79,0.08)",
                fontSize: "var(--text-xs)", fontWeight: 600,
                color: curriculumLesson.level === "beginner" ? "#0E5C4C" : curriculumLesson.level === "intermediate" ? "#b07020" : "#c0392b",
                textTransform: "capitalize",
              }}>
                {curriculumLesson.level}
              </span>
            </div>

            {content ? (
              <>
                {content.hero && (
                  <div style={{
                    background: "linear-gradient(135deg, #0E5C4C 0%, #1a7a68 100%)",
                    borderRadius: BLOCK_RADIUS,
                    padding: "32px 28px",
                    marginBottom: BLOCK_MB,
                    textAlign: "center",
                    color: "#fff",
                  }}>
                    <h2 style={{ fontFamily: "var(--font-serif)", fontSize: "var(--text-2xl)", fontWeight: 400, margin: "0 0 8px", color: "#fff", lineHeight: 1.25 }}>
                      {content.hero.title}
                    </h2>
                    {content.hero.subtitle && (
                      <p style={{ fontFamily: "var(--font-sans)", fontSize: "var(--text-base)", color: "rgba(255,255,255,0.8)", margin: 0, lineHeight: 1.55 }}>
                        {content.hero.subtitle}
                      </p>
                    )}
                  </div>
                )}
                <BlockRenderer blocks={legacyBlocks} />
              </>
            ) : (
              <>
                <h1 style={{ fontFamily: "var(--font-serif)", fontSize: "var(--text-2xl)", fontWeight: 400, marginBottom: "var(--space-4)", color: "var(--color-text)" }}>
                  {lessonTitle}
                </h1>
                <div style={{
                  backgroundColor: "#fff",
                  border: "1px solid var(--color-border-light)",
                  borderRadius: BLOCK_RADIUS,
                  padding: BLOCK_PADDING,
                  marginBottom: BLOCK_MB,
                  textAlign: "center",
                  color: "var(--color-text-muted)",
                  fontSize: "var(--text-base)",
                  fontFamily: "var(--font-sans)",
                  lineHeight: 1.6,
                }}>
                  Content coming soon
                </div>
              </>
            )}

            <div style={{
              marginTop: "var(--space-6)", padding: "var(--space-4) var(--space-5)",
              backgroundColor: "var(--color-accent-light)",
              borderRadius: "var(--radius-md)", border: "1px solid var(--color-accent-border)",
              fontSize: "var(--text-sm)", color: "var(--color-text-secondary)", lineHeight: 1.6,
            }}>
              <strong>Educational Content Only:</strong> All examples are hypothetical and for learning purposes only. This is not financial advice. Consult a licensed financial professional for advice specific to your situation.
            </div>

            <div style={{ display: "flex", justifyContent: "flex-end", marginTop: "var(--space-8)", paddingBottom: "var(--space-8)" }}>
              <button
                onClick={handleMarkComplete}
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

        <TutorPanel
          key={slug}
          lessonId={slug}
          excerptBlock={excerptBlock}
          selectedText={selectedText}
          visible
          open={tutorOpen}
          onClose={() => {
            setTutorOpen(false);
            try {
              localStorage.setItem(WILBUR_HELPER_OPEN_KEY, "false");
            } catch { /* ignore */ }
          }}
          closable
        />
      </div>

      <HighlightAI
        containerRef={contentRef}
        onAsk={(text) => {
          setSelectedText(text);
          setTutorOpen(true);
        }}
      />

      <AccountPopup
        open={showAccountPopup}
        onClose={() => setShowAccountPopup(false)}
        onSignUp={() => { setShowAccountPopup(false); navigate("/auth?mode=signup"); }}
        onLogin={() => { setShowAccountPopup(false); navigate("/auth?mode=login"); }}
      />
    </>
  );
};
