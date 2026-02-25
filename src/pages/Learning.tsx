import React, { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import { Sidebar } from "@/components/layout/Sidebar";
import type { Lesson as SidebarLesson } from "@/lib/stubData";
import { useAuth } from "@/contexts/AuthContext";
import { AccountPopup } from "@/components/ui/Modal";
import { POST_ONBOARDING_PROMPT_SIGNUP } from "@/lib/onboardingSchema";
import { useLearningPath } from "@/hooks/useLearningPath";
import { isLessonAvailable } from "@/lib/catalog/auditCatalog";
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

  const {
    lessons,
    recommendedLessons,
    savedLessons,
    isLoading,
    completed,
    debugInfo,
    pathError,
  } = useLearningPath({ maxLessons: 8 });
  const [debugOpen, setDebugOpen] = useState(false);

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

  /* Safety: only show lessons that exist in registry and have content (no broken links) */
  const visibleLessons = lessons.filter((l) => isLessonAvailable(l.id));
  const visibleRecommended = recommendedLessons.filter((l) => isLessonAvailable(l.id));
  const visibleSaved = savedLessons.filter((l) => isLessonAvailable(l.id));

  /* Convert to Sidebar Lesson shape — no locks; all are available or completed */
  const sidebarLessons: SidebarLesson[] = visibleLessons.map((l, i) => ({
    id: l.id,
    slug: l.id,
    title: l.title,
    category: l.tags[0] ?? "General",
    duration: `${l.estimatedMinutes} min`,
    status: completed.has(l.id) ? "completed" : "available",
    order: i + 1,
  }));

  const completedCount = sidebarLessons.filter((l) => l.status === "completed").length;

  return (
    <>
      <div style={{ display: "flex", position: "relative" }}>
        {/* Sidebar */}
        <Sidebar
          title="Your Path"
          subtitle={`${completedCount} of ${visibleLessons.length} lessons personalized for you`}
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
              {/* Error banner when path generation fails */}
              {pathError && (
                <div style={{
                  marginBottom: 16,
                  padding: "12px 16px",
                  backgroundColor: "rgba(217,83,79,0.1)",
                  border: "1px solid rgba(217,83,79,0.3)",
                  borderRadius: 8,
                  fontSize: "var(--text-sm)",
                  color: "var(--color-text-secondary)",
                }}>
                  <strong>Couldn&apos;t build your path.</strong> {pathError} Check the console for details.
                </div>
              )}

              {/* Dev-only: collapsible debug panel */}
              {debugInfo && (
                <div style={{ marginBottom: 20 }}>
                  <button
                    type="button"
                    onClick={() => setDebugOpen((o) => !o)}
                    style={{
                      fontSize: 12,
                      fontWeight: 600,
                      color: "#7a7a6e",
                      background: "#f5f3ee",
                      border: "1px solid #e2dcd2",
                      borderRadius: 6,
                      padding: "6px 12px",
                      cursor: "pointer",
                    }}
                  >
                    {debugOpen ? "▼" : "▶"} Debug: answers, tier, path, top 10 scores
                  </button>
                  {debugOpen && (
                    <div style={{
                      marginTop: 8,
                      padding: 12,
                      backgroundColor: "#faf8f5",
                      border: "1px solid #e2dcd2",
                      borderRadius: 8,
                      fontSize: 11,
                      fontFamily: "monospace",
                      overflow: "auto",
                      maxHeight: 360,
                    }}>
                      <div style={{ marginBottom: 8 }}>
                        <strong>Tier:</strong> {debugInfo.tier}
                      </div>
                      <div style={{ marginBottom: 8 }}>
                        <strong>Path lessons (why selected):</strong>
                        <ul style={{ margin: "4px 0 0", paddingLeft: 18 }}>
                          {debugInfo.pathLessons.map((p) => (
                            <li key={p.id} style={{ marginBottom: 4 }}>
                              {p.id} — {p.title}
                              {p.reasons.length > 0 && (
                                <div style={{ marginLeft: 8, color: "#6b6b5c" }}>
                                  {p.reasons.slice(0, 2).join("; ")}
                                </div>
                              )}
                            </li>
                          ))}
                        </ul>
                      </div>
                      <div style={{ marginBottom: 8 }}>
                        <strong>Raw answers:</strong>
                        <pre style={{ margin: "4px 0 0", whiteSpace: "pre-wrap", wordBreak: "break-all" }}>
                          {JSON.stringify(debugInfo.rawAnswers, null, 2)}
                        </pre>
                      </div>
                      <div style={{ marginBottom: 8 }}>
                        <strong>Persona tags:</strong> {debugInfo.personaTags.join(", ") || "(none)"}
                      </div>
                      <div>
                        <strong>Top 10 lesson scores:</strong>
                        <ul style={{ margin: "4px 0 0", paddingLeft: 18 }}>
                          {debugInfo.top10Scores.map((l) => (
                            <li key={l.id} style={{ marginBottom: 4 }}>
                              {l.id} (score: {l.score}) — {l.title}
                              {l.reasons.length > 0 && (
                                <div style={{ marginLeft: 8, color: "#6b6b5c" }}>
                                  {l.reasons.slice(0, 3).join("; ")}
                                </div>
                              )}
                            </li>
                          ))}
                        </ul>
                      </div>
                    </div>
                  )}
                </div>
              )}

              {/* Personalized path heading */}
              <div style={{ marginBottom: 28 }}>
                <h2 style={{ fontFamily: "var(--font-serif)", fontSize: "var(--text-2xl)", fontWeight: 400, color: "var(--color-text)", margin: "0 0 6px" }}>
                  Your Learning Path
                </h2>
                <p style={{ fontFamily: "var(--font-sans)", fontSize: "var(--text-sm)", color: "var(--color-text-muted)", margin: 0 }}>
                  {completedCount > 0
                    ? `${completedCount} of ${visibleLessons.length} complete · keep going!`
                    : `${visibleLessons.length} lessons in your path · updated based on your feedback`}
                </p>
              </div>

              {/* Recommended section */}
              {(() => {
                const firstIncompleteId = visibleLessons.find((l) => !completed.has(l.id))?.id;
                return (
              <div style={{ display: "flex", flexDirection: "column", gap: 12, maxWidth: "100%", marginBottom: visibleSaved.length > 0 ? 32 : 0 }}>
                {visibleRecommended.map((lesson, i) => {
                  const isCompleted = completed.has(lesson.id);
                  const isFirst = !isCompleted && lesson.id === firstIncompleteId;
                  void activeLesson; // reserved for future expanded view

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
                              {lesson.estimatedMinutes} min
                            </span>
                            <span style={{
                              fontSize: 10, fontWeight: 600,
                              padding: "1px 6px", borderRadius: 4,
                              backgroundColor: lesson.level === "beginner" ? "rgba(14,92,76,0.08)" : lesson.level === "intermediate" ? "rgba(255,214,176,0.4)" : "rgba(200,170,255,0.3)",
                              color: lesson.level === "beginner" ? "#0E5C4C" : lesson.level === "intermediate" ? "#b07020" : "#6b46c1",
                              fontFamily: "var(--font-sans)",
                            }}>
                              {lesson.level === "beginner" ? "L1" : lesson.level === "intermediate" ? "L2" : "L3"}
                            </span>
                          </div>
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

                    </div>
                  );
                })}
              </div>
                );
              })()}

              {/* Saved / Added by you */}
              {visibleSaved.length > 0 && (
                <div style={{ marginTop: 8 }}>
                  <h3 style={{ fontFamily: "var(--font-serif)", fontSize: "var(--text-lg)", fontWeight: 600, color: "var(--color-text)", margin: "0 0 12px" }}>
                    Saved / Added by you
                  </h3>
                  <div style={{ display: "flex", flexDirection: "column", gap: 12, maxWidth: "100%" }}>
                    {visibleSaved.map((lesson, i) => {
                      const isCompleted = completed.has(lesson.id);
                      const firstIncompleteId = visibleLessons.find((l) => !completed.has(l.id))?.id;
                      const idxInAll = visibleRecommended.length + i;
                      const isFirst = !isCompleted && lesson.id === firstIncompleteId;

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
                                  {lesson.estimatedMinutes} min
                                </span>
                                <span style={{
                                  fontSize: 10, fontWeight: 600,
                                  padding: "1px 6px", borderRadius: 4,
                                  backgroundColor: lesson.level === "beginner" ? "rgba(14,92,76,0.08)" : lesson.level === "intermediate" ? "rgba(255,214,176,0.4)" : "rgba(200,170,255,0.3)",
                                  color: lesson.level === "beginner" ? "#0E5C4C" : lesson.level === "intermediate" ? "#b07020" : "#6b46c1",
                                  fontFamily: "var(--font-sans)",
                                }}>
                                  {lesson.level === "beginner" ? "L1" : lesson.level === "intermediate" ? "L2" : "L3"}
                                </span>
                              </div>
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
        onSignUp={() => { setShowAccountPopup(false); navigate("/auth?mode=signup"); }}
        onLogin={() => { setShowAccountPopup(false); navigate("/auth?mode=login"); }}
      />
    </>
  );
};
