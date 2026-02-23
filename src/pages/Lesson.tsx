import React, { useState, useRef, useCallback, useEffect } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import { lessonContents, roadmapLessons, categories } from "@/lib/stubData";
import { useAuth } from "@/contexts/AuthContext";
import { getBlockLesson } from "@/content/lessons";
import { Sidebar } from "@/components/layout/Sidebar";
import { TutorPanel } from "@/components/layout/TutorPanel";
import { Icon } from "@/components/ui/Icon";
import { AccountPopup } from "@/components/ui/Modal";
import { POST_ONBOARDING_PROMPT_SIGNUP } from "@/lib/onboardingSchema";
import { BlockRenderer } from "@/components/lessonBlocks/BlockRenderer";
import { HighlightAI } from "@/components/highlightAI/HighlightAI";
import { markComplete, saveFeedback } from "@/lib/storage/lessonProgress";
import { shouldWarnLesson } from "@/lib/recommendation/scoring";
import { LESSON_CATALOG_BY_ID } from "@/content/lessons/lessonCatalog";
import { loadAnswersFromStorage, toQuestionnaireAnswers } from "@/lib/recommendation/adapter";
import { loadFeedbackSync } from "@/lib/storage/lessonProgress";

export const Lesson: React.FC = () => {
  const { slug } = useParams<{ slug: string }>();
  const navigate = useNavigate();
  const [selectedText, setSelectedText] = useState<string | undefined>();
  const [showAccountPopup, setShowAccountPopup] = useState(false);
  const [dismissedAdvancedWarning, setDismissedAdvancedWarning] = useState(false);
  const [tutorOpen, setTutorOpen] = useState(false);
  const contentRef = useRef<HTMLDivElement>(null);

  // When user highlights text, open the tutor panel so content pushes left
  useEffect(() => {
    if (selectedText?.trim()) setTutorOpen(true);
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

  // Try block-based lesson first, fall back to legacy
  const blockLesson = slug ? getBlockLesson(slug) : null;
  const legacyLesson = slug ? lessonContents[slug] : null;

  const allLessons = categories.flatMap((c) => c.lessons);
  const sidebarLessons = legacyLesson
    ? allLessons.filter((l) => l.category === legacyLesson.category).length > 2
      ? allLessons.filter((l) => l.category === legacyLesson.category)
      : roadmapLessons
    : roadmapLessons;

  const handleTextSelect = useCallback((text: string) => {
    setSelectedText(text);
  }, []);

  const handleLegacyTextSelect = useCallback(() => {
    const selection = window.getSelection();
    const text = selection?.toString().trim();
    if (text && text.length > 1 && text.length < 60) {
      setSelectedText(text);
    }
  }, []);

  const handleMarkComplete = useCallback(() => {
    if (slug) markComplete(slug);
    navigate("/learning");
  }, [slug, navigate]);

  const handleFeedback = useCallback(async (type: "more_like_this" | "not_relevant" | "already_know_this") => {
    if (!slug) return;
    await saveFeedback(slug, type);
    if (type === "already_know_this") {
      await markComplete(slug);
    }
  }, [slug]);

  const catalogLesson = slug ? LESSON_CATALOG_BY_ID[slug] : null;
  const answers = loadAnswersFromStorage() ?? toQuestionnaireAnswers({});
  const feedbackMap = loadFeedbackSync();
  const showAdvancedWarning =
    catalogLesson &&
    shouldWarnLesson(catalogLesson, answers, feedbackMap) &&
    !dismissedAdvancedWarning;

  /* ── Lesson not found ── */
  if (!blockLesson && !legacyLesson) {
    return (
      <div style={{ padding: "var(--space-8) var(--space-6)", textAlign: "center" }}>
        <h2 style={{ fontFamily: "var(--font-serif)", marginBottom: "var(--space-4)" }}>Lesson not found</h2>
        <Link to="/library" style={{ color: "var(--color-primary)" }}>← Back to Library</Link>
      </div>
    );
  }

  const lessonTitle = blockLesson?.title ?? legacyLesson?.title ?? "";
  const lessonCategory = blockLesson?.tags[0] ?? legacyLesson?.category ?? "";
  const lessonDuration = blockLesson ? `${blockLesson.estimatedTime} min` : legacyLesson?.duration ?? "";

  return (
    <>
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
          onMouseUp={blockLesson ? undefined : handleLegacyTextSelect}
          style={{ flex: 1, minWidth: 0, overflowY: "auto", padding: "var(--space-8)" }}
        >
          {/* Soft warning when lesson is advanced for profile */}
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

          {/* Feedback action row */}
          <div style={{ display: "flex", alignItems: "center", gap: "var(--space-3)", marginBottom: "var(--space-6)", flexWrap: "wrap" }}>
            {[
              { icon: "thumbs-up" as const, label: "more like this", type: "more_like_this" as const },
              { icon: "thumbs-down" as const, label: "not relevant", type: "not_relevant" as const },
              { icon: "brain" as const, label: "already know this", type: "already_know_this" as const },
            ].map(({ icon, label, type }) => (
              <button
                key={label}
                type="button"
                onClick={() => handleFeedback(type)}
                style={{
                  display: "inline-flex", alignItems: "center", gap: "7px",
                  padding: "9px 16px", borderRadius: "var(--radius-full)",
                  border: "1px solid var(--color-border)", backgroundColor: "var(--color-surface)",
                  fontSize: "var(--text-sm)", fontWeight: 500, color: "var(--color-text)",
                  cursor: "pointer", fontFamily: "var(--font-sans)", boxShadow: "var(--shadow-sm)",
                  transition: "box-shadow var(--duration-fast), background-color var(--duration-fast)",
                }}
                onMouseEnter={(e) => { (e.currentTarget as HTMLElement).style.backgroundColor = "var(--color-surface-hover)"; }}
                onMouseLeave={(e) => { (e.currentTarget as HTMLElement).style.backgroundColor = "var(--color-surface)"; }}
              >
                <Icon name={icon} size={14} strokeWidth={1.8} />
                {label}
              </button>
            ))}
          </div>

          {/* ── Block-based lesson ── */}
          {blockLesson && (
            <article style={{ maxWidth: tutorOpen ? "var(--content-max)" : "100%" }}>
              {/* Metadata row */}
              <div style={{ display: "flex", alignItems: "center", gap: "var(--space-4)", marginBottom: "var(--space-6)", paddingBottom: "var(--space-5)", borderBottom: "1px solid var(--color-border-light)" }}>
                <span style={{ display: "inline-flex", alignItems: "center", gap: "5px", fontSize: "var(--text-sm)", color: "var(--color-text-muted)" }}>
                  <Icon name="clock" size={14} strokeWidth={1.8} />
                  {lessonDuration}
                </span>
                <span style={{ display: "inline-flex", alignItems: "center", gap: "5px", fontSize: "var(--text-sm)", color: "var(--color-text-muted)" }}>
                  <Icon name="graduation-cap" size={14} strokeWidth={1.8} />
                  {blockLesson.module.replace("module-", "Module ").toUpperCase()}
                </span>
                <span style={{
                  display: "inline-flex", alignItems: "center",
                  padding: "2px 8px", borderRadius: 4,
                  backgroundColor: blockLesson.level === "beginner" ? "rgba(14,92,76,0.1)" : blockLesson.level === "intermediate" ? "rgba(255,214,176,0.4)" : "rgba(217,83,79,0.08)",
                  fontSize: "var(--text-xs)", fontWeight: 600,
                  color: blockLesson.level === "beginner" ? "#0E5C4C" : blockLesson.level === "intermediate" ? "#b07020" : "#c0392b",
                  textTransform: "capitalize",
                }}>
                  {blockLesson.level}
                </span>
              </div>

              {/* Block renderer */}
              <BlockRenderer
                blocks={blockLesson.blocks}
                onTextSelect={handleTextSelect}
              />

              {/* Sources */}
              {blockLesson.sources.length > 0 && (
                <div style={{
                  marginTop: "var(--space-8)",
                  padding: "var(--space-4) var(--space-5)",
                  backgroundColor: "#f8f6f0",
                  borderRadius: "var(--radius-md)",
                  border: "1px solid var(--color-border-light)",
                }}>
                  <div style={{ fontSize: "var(--text-xs)", fontWeight: 700, color: "#7a7a6e", marginBottom: 8, textTransform: "uppercase", letterSpacing: "0.05em" }}>
                    Sources
                  </div>
                  {blockLesson.sources.map((source, i) => (
                    <div key={i} style={{ marginBottom: 4 }}>
                      <a
                        href={source.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        style={{ fontSize: "var(--text-sm)", color: "var(--color-primary)", textDecoration: "none" }}
                        onMouseEnter={(e) => { (e.currentTarget as HTMLElement).style.textDecoration = "underline"; }}
                        onMouseLeave={(e) => { (e.currentTarget as HTMLElement).style.textDecoration = "none"; }}
                      >
                        {source.name}
                      </a>
                      <span style={{ fontSize: "var(--text-xs)", color: "#b0ab9e", marginLeft: 6 }}>
                        ({source.type})
                      </span>
                    </div>
                  ))}
                </div>
              )}

              {/* Disclaimer */}
              <div style={{
                marginTop: "var(--space-6)", padding: "var(--space-4) var(--space-5)",
                backgroundColor: "var(--color-accent-light)",
                borderRadius: "var(--radius-md)", border: "1px solid var(--color-accent-border)",
                fontSize: "var(--text-sm)", color: "var(--color-text-secondary)", lineHeight: 1.6,
              }}>
                <strong>Educational Content Only:</strong> All examples are hypothetical and for learning purposes only. This is not financial advice. Consult a licensed financial professional for advice specific to your situation.
              </div>

              {/* Navigation */}
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
          )}

          {/* ── Legacy text-based lesson (fallback) ── */}
          {!blockLesson && legacyLesson && (
            <article style={{ maxWidth: tutorOpen ? "var(--content-max)" : "100%" }}>
              <h1 style={{ fontFamily: "var(--font-serif)", fontSize: "var(--text-3xl)", fontWeight: 400, marginBottom: "var(--space-3)", lineHeight: 1.2, color: "var(--color-text)" }}>
                {lessonTitle}
              </h1>
              <h2 style={{ fontFamily: "var(--font-serif)", fontSize: "var(--text-xl)", fontWeight: 600, marginBottom: "var(--space-5)", color: "var(--color-text)", lineHeight: 1.3 }}>
                {legacyLesson.subtitle}
              </h2>

              <div style={{ display: "flex", alignItems: "center", gap: "var(--space-4)", marginBottom: "var(--space-6)", paddingBottom: "var(--space-5)", borderBottom: "1px solid var(--color-border-light)" }}>
                <span style={{ display: "inline-flex", alignItems: "center", gap: "5px", fontSize: "var(--text-sm)", color: "var(--color-text-muted)" }}>
                  <Icon name="clock" size={14} strokeWidth={1.8} />
                  {lessonDuration}
                </span>
                <span style={{ display: "inline-flex", alignItems: "center", gap: "5px", fontSize: "var(--text-sm)", color: "var(--color-text-muted)" }}>
                  <Icon name="graduation-cap" size={14} strokeWidth={1.8} />
                  {lessonCategory}
                </span>
              </div>

              {legacyLesson.sections.map((section, i) => (
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

              <div style={{
                marginTop: "var(--space-8)", padding: "var(--space-4) var(--space-5)",
                backgroundColor: "var(--color-accent-light)",
                borderRadius: "var(--radius-md)", border: "1px solid var(--color-accent-border)",
                fontSize: "var(--text-sm)", color: "var(--color-text-secondary)", lineHeight: 1.6,
              }}>
                <strong>Educational Example Only:</strong> All numbers and scenarios are hypothetical and for learning purposes only. This is not financial advice.
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
          )}
        </div>

        {/* Right TutorPanel — always persist on lesson, not closable; scrolls with content */}
        <TutorPanel
          key={slug}
          lessonId={slug}
          selectedText={selectedText}
          visible
          open={tutorOpen}
          onClose={() => setTutorOpen(false)}
          closable={false}
        />
      </div>

      {/* HighlightAI — floating "Ask Wilbur" near selection; onAsk opens panel and sends text to AI */}
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
        onSignUp={() => { setShowAccountPopup(false); navigate("/signup"); }}
        onLogin={() => { setShowAccountPopup(false); navigate("/login"); }}
      />
    </>
  );
};
