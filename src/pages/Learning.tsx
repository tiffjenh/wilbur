import React, { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import { Sidebar } from "@/components/layout/Sidebar";
import type { Lesson as SidebarLesson } from "@/lib/stubData";
import { useAuth } from "@/contexts/AuthContext";
import { AccountPopup } from "@/components/ui/Modal";
import { POST_ONBOARDING_PROMPT_SIGNUP } from "@/lib/onboardingSchema";
import { useLearningPath } from "@/hooks/useLearningPath";
import type { LessonFeedback } from "@/lib/recommendation/types";
import { Icon } from "@/components/ui/Icon";

/**
 * Learning page — personalized lesson path with "why recommended" labels.
 * Uses the deterministic scoring engine to order lessons based on
 * questionnaire answers + ongoing feedback.
 */
export const Learning: React.FC = () => {
  const navigate = useNavigate();
  const [showAccountPopup, setShowAccountPopup] = useState(false);
  const [activeLesson] = useState<string | null>(null); // reserved for future expanded view
  const [showReasonFor, setShowReasonFor] = useState<string | null>(null);

  const {
    lessons,
    recommendedLessons,
    savedLessons,
    isLoading,
    completed,
    getReasons,
    getTopReason,
    handleFeedback,
  } = useLearningPath({ maxLessons: 8 });

  const { user } = useAuth();
  /* Show signup popup once after completing onboarding without signing in */
  useEffect(() => {
    try {
      if (!user && sessionStorage.getItem(POST_ONBOARDING_PROMPT_SIGNUP) === "1") {
        sessionStorage.removeItem(POST_ONBOARDING_PROMPT_SIGNUP);
        setShowAccountPopup(true);
      }
    } catch { /* ignore */ }
  }, [user]);

  /* Convert to Sidebar Lesson shape — no locks; all are available or completed */
  const sidebarLessons: SidebarLesson[] = lessons.map((l, i) => ({
    id: l.id,
    slug: l.id,
    title: l.title,
    category: l.tags[0] ?? "General",
    duration: `${l.estimatedTimeMin} min`,
    status: completed.has(l.id) ? "completed" : "available",
    order: i + 1,
  }));

  const completedCount = sidebarLessons.filter(l => l.status === "completed").length;

  return (
    <>
      <div style={{ display: "flex", position: "relative" }}>
        {/* Sidebar */}
        <Sidebar
          title="Your Path"
          subtitle={`${completedCount} of ${lessons.length} lessons personalized for you`}
          lessons={sidebarLessons}
        />

        {/* Main content */}
        <div style={{ flex: 1, minWidth: 0 }}>
          {isLoading ? (
            <div style={{ padding: "48px 32px", fontFamily: "var(--font-sans)", color: "#7a7a6e", fontSize: 14 }}>
              Building your path…
            </div>
          ) : (
            <div style={{ padding: "32px 32px 0" }}>
              {/* Personalized path heading */}
              <div style={{ marginBottom: 28 }}>
                <h2 style={{ fontFamily: "var(--font-serif)", fontSize: "var(--text-2xl)", fontWeight: 400, color: "var(--color-text)", margin: "0 0 6px" }}>
                  Your Learning Path
                </h2>
                <p style={{ fontFamily: "var(--font-sans)", fontSize: "var(--text-sm)", color: "var(--color-text-muted)", margin: 0 }}>
                  {completedCount > 0
                    ? `${completedCount} of ${lessons.length} complete · keep going!`
                    : `${lessons.length} lessons in your path · updated based on your feedback`}
                </p>
              </div>

              {/* Recommended section */}
              <div style={{ display: "flex", flexDirection: "column", gap: 12, maxWidth: "100%", marginBottom: savedLessons.length > 0 ? 32 : 0 }}>
                {recommendedLessons.map((lesson, i) => {
                  const isCompleted = completed.has(lesson.id);
                  const globalFirstIndex = lessons.findIndex(l => !completed.has(l.id));
                  const isFirst = !isCompleted && globalFirstIndex === i;
                  const topReason = getTopReason(lesson.id);
                  void activeLesson; // reserved for future expanded view
                  const showingReason = showReasonFor === lesson.id;

                  return (
                    <div
                      key={lesson.id}
                      style={{
                        backgroundColor: "#fff",
                        border: `1.5px solid ${isCompleted ? "rgba(14,92,76,0.25)" : isFirst ? "#0E5C4C" : "var(--color-border)"}`,
                        borderRadius: 12,
                        padding: "16px 20px",
                        transition: "box-shadow 0.15s",
                        boxShadow: isFirst ? "0 2px 12px rgba(14,92,76,0.1)" : "var(--shadow-xs)",
                      }}
                    >
                      {/* Card top row */}
                      <div style={{ display: "flex", alignItems: "flex-start", gap: 12 }}>
                        {/* Status indicator */}
                        <div style={{
                          flexShrink: 0,
                          width: 28, height: 28,
                          borderRadius: "50%",
                          backgroundColor: isCompleted ? "#0E5C4C" : isFirst ? "rgba(14,92,76,0.1)" : "#f8f6f0",
                          border: isFirst && !isCompleted ? "2px solid #0E5C4C" : "none",
                          display: "flex", alignItems: "center", justifyContent: "center",
                          fontSize: 12,
                        }}>
                          {isCompleted
                            ? <span style={{ color: "#fff", fontWeight: 700 }}>✓</span>
                            : <span style={{ color: isFirst ? "#0E5C4C" : "#b0ab9e", fontWeight: 600, fontFamily: "var(--font-sans)" }}>{i + 1}</span>
                          }
                        </div>

                        {/* Title + meta */}
                        <div style={{ flex: 1, minWidth: 0 }}>
                          <div style={{ display: "flex", alignItems: "center", gap: 8, flexWrap: "wrap", marginBottom: 4 }}>
                            <span style={{
                              fontFamily: "var(--font-sans)",
                              fontSize: "var(--text-base)",
                              fontWeight: 600,
                              color: isCompleted ? "#7a7a6e" : "var(--color-text)",
                              textDecoration: isCompleted ? "line-through" : "none",
                            }}>
                              {lesson.title}
                            </span>
                            {isFirst && !isCompleted && (
                              <span style={{ fontSize: 10, fontWeight: 700, backgroundColor: "#0E5C4C", color: "#fff", padding: "2px 7px", borderRadius: 4, textTransform: "uppercase", letterSpacing: "0.05em" }}>
                                Up next
                              </span>
                            )}
                          </div>
                          <div style={{ display: "flex", alignItems: "center", gap: 10, flexWrap: "wrap" }}>
                            <span style={{ fontSize: "var(--text-xs)", color: "#7a7a6e", fontFamily: "var(--font-sans)", display: "flex", alignItems: "center", gap: 4 }}>
                              <Icon name="clock" size={11} strokeWidth={1.8} />
                              {lesson.estimatedTimeMin} min
                            </span>
                            <span style={{
                              fontSize: 10, fontWeight: 600,
                              padding: "1px 6px", borderRadius: 4,
                              backgroundColor: lesson.level === "level-1" ? "rgba(14,92,76,0.08)" : lesson.level === "level-2" ? "rgba(255,214,176,0.4)" : "rgba(200,170,255,0.3)",
                              color: lesson.level === "level-1" ? "#0E5C4C" : lesson.level === "level-2" ? "#b07020" : "#6b46c1",
                              fontFamily: "var(--font-sans)",
                            }}>
                              {lesson.level.replace("level-", "L")}
                            </span>
                            {/* "Why recommended" inline label */}
                            {topReason && !isCompleted && (
                              <button
                                onClick={() => setShowReasonFor(showingReason ? null : lesson.id)}
                                style={{
                                  display: "inline-flex", alignItems: "center", gap: 4,
                                  fontSize: 11, color: "#7a7a6e", background: "none",
                                  border: "1px solid #eae5db", borderRadius: 4,
                                  padding: "1px 7px", cursor: "pointer", fontFamily: "var(--font-sans)",
                                }}
                              >
                                <span>Why?</span>
                                <span style={{ fontSize: 9 }}>{showingReason ? "▲" : "▼"}</span>
                              </button>
                            )}
                          </div>

                          {/* Expanded "Why recommended" reasons */}
                          {showingReason && (
                            <div style={{
                              marginTop: 8,
                              padding: "8px 12px",
                              backgroundColor: "rgba(14,92,76,0.05)",
                              borderRadius: 8,
                              border: "1px solid rgba(14,92,76,0.12)",
                            }}>
                              <div style={{ fontSize: 11, fontWeight: 700, color: "#0E5C4C", marginBottom: 5, fontFamily: "var(--font-sans)", textTransform: "uppercase", letterSpacing: "0.04em" }}>
                                Why this is in your path
                              </div>
                              <ul style={{ listStyle: "none", padding: 0, margin: 0, display: "flex", flexDirection: "column", gap: 4 }}>
                                {getReasons(lesson.id).map((r, ri) => (
                                  <li key={ri} style={{ fontSize: 12, color: "#3d3d35", fontFamily: "var(--font-sans)", display: "flex", gap: 6 }}>
                                    <span style={{ color: "#0E5C4C" }}>·</span>
                                    {r}
                                  </li>
                                ))}
                              </ul>
                            </div>
                          )}
                        </div>

                        {/* Action button */}
                        {isCompleted ? (
                          <span style={{ fontSize: 11, color: "#0E5C4C", fontWeight: 600, fontFamily: "var(--font-sans)", whiteSpace: "nowrap" }}>Done</span>
                        ) : (
                          <Link
                            to={`/lesson/${lesson.id}`}
                            style={{
                              flexShrink: 0,
                              display: "inline-flex", alignItems: "center", gap: 5,
                              padding: "7px 14px",
                              backgroundColor: isFirst ? "#0E5C4C" : "transparent",
                              color: isFirst ? "#fff" : "#0E5C4C",
                              border: isFirst ? "none" : "1.5px solid rgba(14,92,76,0.4)",
                              borderRadius: 8,
                              fontSize: "var(--text-sm)", fontWeight: 600,
                              fontFamily: "var(--font-sans)",
                              textDecoration: "none",
                            }}
                          >
                            {isFirst ? "Start" : "Go"}
                            <Icon name="arrow-right" size={12} color={isFirst ? "#fff" : "#0E5C4C"} strokeWidth={2.5} />
                          </Link>
                        )}
                      </div>

                      {/* Inline feedback row (visible for non-completed lessons) */}
                      {!isCompleted && (
                        <div style={{ display: "flex", gap: 8, marginTop: 12, paddingTop: 10, borderTop: "1px solid #f0ece4" }}>
                          {(
                            [
                              { icon: "thumbs-up" as const, label: "More like this", type: "more_like_this" as LessonFeedback },
                              { icon: "thumbs-down" as const, label: "Not relevant",  type: "not_relevant" as LessonFeedback },
                              { icon: "brain" as const, label: "Already know",  type: "already_know_this" as LessonFeedback },
                            ] as const
                          ).map(({ icon, label, type }) => (
                            <button
                              key={type}
                              onClick={() => handleFeedback(lesson.id, type)}
                              style={{
                                display: "inline-flex", alignItems: "center", gap: 5,
                                padding: "4px 10px",
                                backgroundColor: "transparent",
                                border: "1px solid #eae5db",
                                borderRadius: 6,
                                fontSize: 11, color: "#7a7a6e",
                                cursor: "pointer", fontFamily: "var(--font-sans)",
                                transition: "background-color 0.1s",
                              }}
                              onMouseEnter={(e) => { (e.currentTarget as HTMLElement).style.backgroundColor = "#f8f6f0"; }}
                              onMouseLeave={(e) => { (e.currentTarget as HTMLElement).style.backgroundColor = "transparent"; }}
                            >
                              <Icon name={icon} size={11} strokeWidth={1.8} />
                              {label}
                            </button>
                          ))}
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>

              {/* Saved / Added by you */}
              {savedLessons.length > 0 && (
                <div style={{ marginTop: 8 }}>
                  <h3 style={{ fontFamily: "var(--font-serif)", fontSize: "var(--text-lg)", fontWeight: 600, color: "var(--color-text)", margin: "0 0 12px" }}>
                    Saved / Added by you
                  </h3>
                  <div style={{ display: "flex", flexDirection: "column", gap: 12, maxWidth: "100%" }}>
                    {savedLessons.map((lesson, i) => {
                      const isCompleted = completed.has(lesson.id);
                      const globalFirstIndex = lessons.findIndex(l => !completed.has(l.id));
                      const idxInAll = recommendedLessons.length + i;
                      const isFirst = !isCompleted && globalFirstIndex === idxInAll;
                      const topReason = getTopReason(lesson.id);
                      const showingReason = showReasonFor === lesson.id;

                      return (
                        <div
                          key={lesson.id}
                          style={{
                            backgroundColor: "#fff",
                            border: `1.5px solid ${isCompleted ? "rgba(14,92,76,0.25)" : isFirst ? "#0E5C4C" : "var(--color-border)"}`,
                            borderRadius: 12,
                            padding: "16px 20px",
                            transition: "box-shadow 0.15s",
                            boxShadow: isFirst ? "0 2px 12px rgba(14,92,76,0.1)" : "var(--shadow-xs)",
                          }}
                        >
                          <div style={{ display: "flex", alignItems: "flex-start", gap: 12 }}>
                            <div style={{
                              flexShrink: 0,
                              width: 28, height: 28,
                              borderRadius: "50%",
                              backgroundColor: isCompleted ? "#0E5C4C" : isFirst ? "rgba(14,92,76,0.1)" : "#f8f6f0",
                              border: isFirst && !isCompleted ? "2px solid #0E5C4C" : "none",
                              display: "flex", alignItems: "center", justifyContent: "center",
                              fontSize: 12,
                            }}>
                              {isCompleted
                                ? <span style={{ color: "#fff", fontWeight: 700 }}>✓</span>
                                : <span style={{ color: isFirst ? "#0E5C4C" : "#b0ab9e", fontWeight: 600, fontFamily: "var(--font-sans)" }}>{idxInAll + 1}</span>}
                            </div>
                            <div style={{ flex: 1, minWidth: 0 }}>
                              <div style={{ display: "flex", alignItems: "center", gap: 8, flexWrap: "wrap", marginBottom: 4 }}>
                                <span style={{
                                  fontFamily: "var(--font-sans)",
                                  fontSize: "var(--text-base)",
                                  fontWeight: 600,
                                  color: isCompleted ? "#7a7a6e" : "var(--color-text)",
                                  textDecoration: isCompleted ? "line-through" : "none",
                                }}>
                                  {lesson.title}
                                </span>
                                {isFirst && !isCompleted && (
                                  <span style={{ fontSize: 10, fontWeight: 700, backgroundColor: "#0E5C4C", color: "#fff", padding: "2px 7px", borderRadius: 4, textTransform: "uppercase", letterSpacing: "0.05em" }}>
                                    Up next
                                  </span>
                                )}
                              </div>
                              <div style={{ display: "flex", alignItems: "center", gap: 10, flexWrap: "wrap" }}>
                                <span style={{ fontSize: "var(--text-xs)", color: "#7a7a6e", fontFamily: "var(--font-sans)", display: "flex", alignItems: "center", gap: 4 }}>
                                  <Icon name="clock" size={11} strokeWidth={1.8} />
                                  {lesson.estimatedTimeMin} min
                                </span>
                                <span style={{
                                  fontSize: 10, fontWeight: 600,
                                  padding: "1px 6px", borderRadius: 4,
                                  backgroundColor: lesson.level === "level-1" ? "rgba(14,92,76,0.08)" : lesson.level === "level-2" ? "rgba(255,214,176,0.4)" : "rgba(200,170,255,0.3)",
                                  color: lesson.level === "level-1" ? "#0E5C4C" : lesson.level === "level-2" ? "#b07020" : "#6b46c1",
                                  fontFamily: "var(--font-sans)",
                                }}>
                                  {lesson.level.replace("level-", "L")}
                                </span>
                                {topReason && !isCompleted && (
                                  <button
                                    onClick={() => setShowReasonFor(showingReason ? null : lesson.id)}
                                    style={{
                                      display: "inline-flex", alignItems: "center", gap: 4,
                                      fontSize: 11, color: "#7a7a6e", background: "none",
                                      border: "1px solid #eae5db", borderRadius: 4,
                                      padding: "1px 7px", cursor: "pointer", fontFamily: "var(--font-sans)",
                                    }}
                                  >
                                    <span>Why?</span>
                                    <span style={{ fontSize: 9 }}>{showingReason ? "▲" : "▼"}</span>
                                  </button>
                                )}
                              </div>
                              {showingReason && (
                                <div style={{
                                  marginTop: 8,
                                  padding: "8px 12px",
                                  backgroundColor: "rgba(14,92,76,0.05)",
                                  borderRadius: 8,
                                  border: "1px solid rgba(14,92,76,0.12)",
                                }}>
                                  <div style={{ fontSize: 11, fontWeight: 700, color: "#0E5C4C", marginBottom: 5, fontFamily: "var(--font-sans)", textTransform: "uppercase", letterSpacing: "0.04em" }}>
                                    Why this is in your path
                                  </div>
                                  <ul style={{ listStyle: "none", padding: 0, margin: 0, display: "flex", flexDirection: "column", gap: 4 }}>
                                    {getReasons(lesson.id).map((r, ri) => (
                                      <li key={ri} style={{ fontSize: 12, color: "#3d3d35", fontFamily: "var(--font-sans)", display: "flex", gap: 6 }}>
                                        <span style={{ color: "#0E5C4C" }}>·</span>
                                        {r}
                                      </li>
                                    ))}
                                  </ul>
                                </div>
                              )}
                            </div>
                            {isCompleted ? (
                              <span style={{ fontSize: 11, color: "#0E5C4C", fontWeight: 600, fontFamily: "var(--font-sans)", whiteSpace: "nowrap" }}>Done</span>
                            ) : (
                              <Link
                                to={`/lesson/${lesson.id}`}
                                style={{
                                  flexShrink: 0,
                                  display: "inline-flex", alignItems: "center", gap: 5,
                                  padding: "7px 14px",
                                  backgroundColor: isFirst ? "#0E5C4C" : "transparent",
                                  color: isFirst ? "#fff" : "#0E5C4C",
                                  border: isFirst ? "none" : "1.5px solid rgba(14,92,76,0.4)",
                                  borderRadius: 8,
                                  fontSize: "var(--text-sm)", fontWeight: 600,
                                  fontFamily: "var(--font-sans)",
                                  textDecoration: "none",
                                }}
                              >
                                {isFirst ? "Start" : "Go"}
                                <Icon name="arrow-right" size={12} color={isFirst ? "#fff" : "#0E5C4C"} strokeWidth={2.5} />
                              </Link>
                            )}
                          </div>
                          {!isCompleted && (
                            <div style={{ display: "flex", gap: 8, marginTop: 12, paddingTop: 10, borderTop: "1px solid #f0ece4" }}>
                              {(
                                [
                                  { icon: "thumbs-up" as const, label: "More like this", type: "more_like_this" as LessonFeedback },
                                  { icon: "thumbs-down" as const, label: "Not relevant",  type: "not_relevant" as LessonFeedback },
                                  { icon: "brain" as const, label: "Already know",  type: "already_know_this" as LessonFeedback },
                                ] as const
                              ).map(({ icon, label, type }) => (
                                <button
                                  key={type}
                                  onClick={() => handleFeedback(lesson.id, type)}
                                  style={{
                                    display: "inline-flex", alignItems: "center", gap: 5,
                                    padding: "4px 10px",
                                    backgroundColor: "transparent",
                                    border: "1px solid #eae5db",
                                    borderRadius: 6,
                                    fontSize: 11, color: "#7a7a6e",
                                    cursor: "pointer", fontFamily: "var(--font-sans)",
                                    transition: "background-color 0.1s",
                                  }}
                                  onMouseEnter={(e) => { (e.currentTarget as HTMLElement).style.backgroundColor = "#f8f6f0"; }}
                                  onMouseLeave={(e) => { (e.currentTarget as HTMLElement).style.backgroundColor = "transparent"; }}
                                >
                                  <Icon name={icon} size={11} strokeWidth={1.8} />
                                  {label}
                                </button>
                              ))}
                            </div>
                          )}
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      </div>

      <AccountPopup
        open={showAccountPopup}
        onClose={() => setShowAccountPopup(false)}
        onSignUp={() => { setShowAccountPopup(false); navigate("/signup"); }}
        onLogin={() => { setShowAccountPopup(false); navigate("/login"); }}
      />
    </>
  );
};
