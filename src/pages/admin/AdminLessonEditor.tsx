import React, { useEffect, useState, useCallback } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import { getLessonByIdAdmin, upsertLessonDraftAdmin, publishLessonAdmin, listLessonVersionsAdmin, rollbackLessonAdmin } from "@/lib/supabase/adminLessons";
import type { CMSLessonRecord, QuizSpec } from "@/lib/lessonBlocks/types";
import { validateLessonContent } from "@/lib/lessonBlocks/schema";
import { ALLOWED_CITATION_DOMAINS_TIER1, ALLOWED_CITATION_DOMAINS_TIER2 } from "@/lib/lessonBlocks/schema";
import { BlockBuilder } from "@/components/admin/BlockBuilder";
import { Icon } from "@/components/ui/Icon";

const emptyLesson = (): Partial<CMSLessonRecord> => ({
  slug: "",
  title: "",
  subtitle: null,
  category: "investing",
  track: null,
  level: "beginner",
  estimated_minutes: 8,
  hero_takeaways: [],
  content_blocks: [],
  example_blocks: [],
  video_blocks: [],
  quiz: null,
  source_citations: [],
  status: "draft",
  revision: 1,
});

function defaultQuiz(): QuizSpec {
  const emptyQ = () => ({ prompt: "", choices: ["", "", ""], correctIndex: 0, explanation: "" });
  return { title: "Quiz", questions: [emptyQ(), emptyQ(), emptyQ()] };
}

export const AdminLessonEditor: React.FC<{ mode: "create" | "edit" }> = ({ mode }) => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [lesson, setLesson] = useState<Partial<CMSLessonRecord> & { id?: string; slug: string; title: string; category: string; level: CMSLessonRecord["level"] }>(emptyLesson() as any);
  const [loading, setLoading] = useState(mode === "edit");
  const [saving, setSaving] = useState(false);
  const [validationErrors, setValidationErrors] = useState<string[]>([]);
  const [historyOpen, setHistoryOpen] = useState(false);
  const [versions, setVersions] = useState<Awaited<ReturnType<typeof listLessonVersionsAdmin>>>([]);
  const [rollbackRev, setRollbackRev] = useState<number | null>(null);

  useEffect(() => {
    if (mode === "edit" && id) {
      getLessonByIdAdmin(id).then((l) => {
        if (l) setLesson(l);
        setLoading(false);
      });
    }
  }, [mode, id]);

  const validate = useCallback(() => {
    const result = validateLessonContent({
      hero_takeaways: lesson.hero_takeaways ?? [],
      content_blocks: lesson.content_blocks ?? [],
      example_blocks: lesson.example_blocks ?? [],
      video_blocks: lesson.video_blocks ?? [],
      quiz: lesson.quiz ?? null,
      source_citations: lesson.source_citations ?? [],
    });
    setValidationErrors(result.success ? [] : result.errors);
    return result.success;
  }, [lesson.hero_takeaways, lesson.content_blocks, lesson.example_blocks, lesson.video_blocks, lesson.quiz, lesson.source_citations]);

  useEffect(() => {
    const t = setTimeout(validate, 400);
    return () => clearTimeout(t);
  }, [validate]);

  const handleSaveDraft = async () => {
    setSaving(true);
    const payload = {
      ...lesson,
      id: lesson.id,
      slug: lesson.slug!.trim(),
      title: lesson.title!.trim(),
      category: lesson.category!,
      level: lesson.level!,
      hero_takeaways: lesson.hero_takeaways ?? [],
      content_blocks: lesson.content_blocks ?? [],
      example_blocks: lesson.example_blocks ?? [],
      video_blocks: lesson.video_blocks ?? [],
      quiz: lesson.quiz ?? null,
      source_citations: lesson.source_citations ?? [],
    };
    const { data, error } = await upsertLessonDraftAdmin(payload);
    setSaving(false);
    if (error) {
      setValidationErrors((e) => [...e, error]);
      return;
    }
    if (data && !lesson.id) navigate(`/admin/lessons/${data.id}`, { replace: true });
    if (data) setLesson(data);
  };

  const handlePublish = async () => {
    if (!validate()) return;
    if ((lesson.source_citations?.length ?? 0) < 1) {
      setValidationErrors((e) => [...e, "At least one citation is required to publish."]);
      return;
    }
    if (!lesson.id) return;
    setSaving(true);
    const { data, error } = await publishLessonAdmin(lesson.id);
    setSaving(false);
    if (error) {
      setValidationErrors((e) => [...e, error]);
      return;
    }
    if (data) setLesson(data);
  };

  const handleRollback = async () => {
    if (rollbackRev == null || !lesson.id) return;
    setSaving(true);
    const { data, error } = await rollbackLessonAdmin(lesson.id, rollbackRev);
    setSaving(false);
    if (error) setValidationErrors((e) => [...e, error]);
    if (data) {
      setLesson(data);
      setHistoryOpen(false);
      setRollbackRev(null);
    }
  };

  const loadHistory = useCallback(() => {
    if (!lesson.id) return;
    listLessonVersionsAdmin(lesson.id).then(setVersions);
  }, [lesson.id]);

  if (loading) return <p style={{ padding: "var(--space-8)", color: "var(--color-text-muted)" }}>Loading…</p>;

  const inputStyle: React.CSSProperties = {
    width: "100%",
    padding: "8px 10px",
    fontFamily: "var(--font-sans)",
    fontSize: "var(--text-sm)",
    border: "1px solid var(--color-border-light)",
    borderRadius: "var(--radius-md)",
  };

  return (
    <div style={{ padding: "var(--space-6) var(--page-px)", maxWidth: 1200, margin: "0 auto" }}>
      <div style={{ display: "flex", alignItems: "center", gap: "var(--space-3)", marginBottom: "var(--space-6)" }}>
        <Link to={lesson.id ? "/admin/lessons" : "/admin"} style={{ color: "var(--color-primary)", fontWeight: 600, textDecoration: "none" }}>
          ← Back
        </Link>
        {lesson.id && (
          <Link to={`/admin/lessons/${lesson.id}/preview`} style={{ display: "inline-flex", alignItems: "center", gap: 6, color: "var(--color-text-secondary)", fontSize: "var(--text-sm)", textDecoration: "none" }}>
            <Icon name="eye" size={16} /> Preview
          </Link>
        )}
      </div>

      {validationErrors.length > 0 && (
        <div style={{ marginBottom: "var(--space-4)", padding: "var(--space-3)", backgroundColor: "rgba(217,83,79,0.08)", border: "1px solid rgba(217,83,79,0.3)", borderRadius: "var(--radius-md)" }}>
          <strong style={{ fontSize: "var(--text-sm)" }}>Validation errors:</strong>
          <ul style={{ margin: "8px 0 0", paddingLeft: 20, fontSize: "var(--text-sm)", color: "var(--color-text-secondary)" }}>
            {validationErrors.map((err, i) => (
              <li key={i}>{err}</li>
            ))}
          </ul>
        </div>
      )}

      <div style={{ display: "grid", gridTemplateColumns: "280px 1fr", gap: "var(--space-8)" }}>
        {/* Left: metadata */}
        <div>
          <h2 style={{ fontFamily: "var(--font-sans)", fontSize: "var(--text-lg)", fontWeight: 600, marginBottom: "var(--space-4)" }}>Metadata</h2>
          <div style={{ display: "flex", flexDirection: "column", gap: "var(--space-3)" }}>
            <label style={{ fontSize: "var(--text-xs)", fontWeight: 600 }}>Slug</label>
            <input
              value={lesson.slug ?? ""}
              onChange={(e) => setLesson((l) => ({ ...l, slug: e.target.value }))}
              style={inputStyle}
              placeholder="my-lesson"
            />
            <label style={{ fontSize: "var(--text-xs)", fontWeight: 600 }}>Title</label>
            <input value={lesson.title ?? ""} onChange={(e) => setLesson((l) => ({ ...l, title: e.target.value }))} style={inputStyle} />
            <label style={{ fontSize: "var(--text-xs)", fontWeight: 600 }}>Subtitle</label>
            <input value={lesson.subtitle ?? ""} onChange={(e) => setLesson((l) => ({ ...l, subtitle: e.target.value || null }))} style={inputStyle} />
            <label style={{ fontSize: "var(--text-xs)", fontWeight: 600 }}>Category</label>
            <input value={lesson.category ?? ""} onChange={(e) => setLesson((l) => ({ ...l, category: e.target.value }))} style={inputStyle} />
            <label style={{ fontSize: "var(--text-xs)", fontWeight: 600 }}>Track</label>
            <input value={lesson.track ?? ""} onChange={(e) => setLesson((l) => ({ ...l, track: e.target.value || null }))} style={inputStyle} />
            <label style={{ fontSize: "var(--text-xs)", fontWeight: 600 }}>Level</label>
            <select value={lesson.level ?? "beginner"} onChange={(e) => setLesson((l) => ({ ...l, level: e.target.value as "beginner" | "intermediate" | "advanced" }))} style={inputStyle}>
              <option value="beginner">Beginner</option>
              <option value="intermediate">Intermediate</option>
              <option value="advanced">Advanced</option>
            </select>
            <label style={{ fontSize: "var(--text-xs)", fontWeight: 600 }}>Estimated minutes</label>
            <input
              type="number"
              min={1}
              value={lesson.estimated_minutes ?? 8}
              onChange={(e) => setLesson((l) => ({ ...l, estimated_minutes: Number(e.target.value) || 8 }))}
              style={inputStyle}
            />
            <label style={{ fontSize: "var(--text-xs)", fontWeight: 600 }}>Hero takeaways (one per line)</label>
            <textarea
              value={(lesson.hero_takeaways ?? []).join("\n")}
              onChange={(e) => setLesson((l) => ({ ...l, hero_takeaways: e.target.value.split("\n").map((s) => s.trim()).filter(Boolean) }))}
              style={{ ...inputStyle, minHeight: 80 }}
              placeholder="Takeaway 1"
            />
          </div>
          <div style={{ marginTop: "var(--space-4)", paddingTop: "var(--space-4)", borderTop: "1px solid var(--color-border-light)", fontSize: "var(--text-sm)", color: "var(--color-text-muted)" }}>
            Status: {lesson.status ?? "draft"} · Revision: {lesson.revision ?? 1}
            {lesson.updated_at && <div>Updated: {new Date(lesson.updated_at).toLocaleString()}</div>}
            {lesson.published_at && <div>Published: {new Date(lesson.published_at).toLocaleString()}</div>}
          </div>
        </div>

        {/* Center: blocks + quiz + citations */}
        <div>
          <BlockBuilder
            title="Content blocks"
            blocks={lesson.content_blocks ?? []}
            onChange={(blocks) => setLesson((l) => ({ ...l, content_blocks: blocks }))}
            minBlocks={3}
          />
          <BlockBuilder title="Example blocks" blocks={lesson.example_blocks ?? []} onChange={(blocks) => setLesson((l) => ({ ...l, example_blocks: blocks }))} />
          <BlockBuilder title="Video blocks" blocks={lesson.video_blocks ?? []} onChange={(blocks) => setLesson((l) => ({ ...l, video_blocks: blocks }))} />

          {/* Quiz: exactly 3 questions, choices >= 3 */}
          <div style={{ marginBottom: "var(--space-6)" }}>
            <h3 style={{ fontFamily: "var(--font-sans)", fontSize: "var(--text-base)", fontWeight: 600, marginBottom: "var(--space-2)" }}>Quiz</h3>
            {(() => {
              const quiz: QuizSpec = lesson.quiz ?? defaultQuiz();
              const setQuiz = (q: QuizSpec) => setLesson((l) => ({ ...l, quiz: q }));
              return (
                <>
                  <label style={{ display: "block", marginBottom: 4, fontSize: "var(--text-xs)", fontWeight: 600 }}>Quiz title</label>
                  <input value={quiz.title} onChange={(e) => setQuiz({ ...quiz, title: e.target.value })} style={{ ...inputStyle, marginBottom: 12 }} />
                  {([0, 1, 2] as const).map((qi) => (
                    <div key={qi} style={{ padding: "var(--space-3)", border: "1px solid var(--color-border-light)", borderRadius: "var(--radius-md)", marginBottom: "var(--space-2)" }}>
                      <label style={{ fontSize: "var(--text-xs)", fontWeight: 600 }}>Q{qi + 1} prompt</label>
                      <input
                        value={quiz.questions[qi]?.prompt ?? ""}
                        onChange={(e) => {
                          const qs = [...quiz.questions];
                          qs[qi] = { ...qs[qi], prompt: e.target.value, choices: qs[qi]?.choices ?? ["", "", ""], correctIndex: qs[qi]?.correctIndex ?? 0, explanation: qs[qi]?.explanation ?? "" };
                          setQuiz({ ...quiz, questions: qs as QuizSpec["questions"] });
                        }}
                        style={inputStyle}
                      />
                      <label style={{ display: "block", marginTop: 8, fontSize: "var(--text-xs)", fontWeight: 600 }}>Choices (one per line, min 3)</label>
                      <textarea
                        value={(quiz.questions[qi]?.choices ?? []).join("\n")}
                        onChange={(e) => {
                          const choices = e.target.value.split("\n").map((s) => s.trim()).filter(Boolean);
                          const qs = [...quiz.questions];
                          const prevCorrect = qs[qi]?.correctIndex ?? 0;
                          qs[qi] = { ...qs[qi], choices, correctIndex: Math.min(prevCorrect, Math.max(0, choices.length - 1)), explanation: qs[qi]?.explanation ?? "", prompt: qs[qi]?.prompt ?? "" };
                          setQuiz({ ...quiz, questions: qs as QuizSpec["questions"] });
                        }}
                        style={{ ...inputStyle, minHeight: 60 }}
                      />
                      <label style={{ display: "block", marginTop: 8, fontSize: "var(--text-xs)", fontWeight: 600 }}>Correct index (0-based)</label>
                      <input
                        type="number"
                        min={0}
                        value={quiz.questions[qi]?.correctIndex ?? 0}
                        onChange={(e) => {
                          const qs = [...quiz.questions];
                          qs[qi] = { ...qs[qi], correctIndex: Math.max(0, Number(e.target.value)) };
                          setQuiz({ ...quiz, questions: qs as QuizSpec["questions"] });
                        }}
                        style={inputStyle}
                      />
                      <label style={{ display: "block", marginTop: 8, fontSize: "var(--text-xs)", fontWeight: 600 }}>Explanation</label>
                      <textarea
                        value={quiz.questions[qi]?.explanation ?? ""}
                        onChange={(e) => {
                          const qs = [...quiz.questions];
                          qs[qi] = { ...qs[qi], explanation: e.target.value };
                          setQuiz({ ...quiz, questions: qs as QuizSpec["questions"] });
                        }}
                        style={{ ...inputStyle, minHeight: 60 }}
                      />
                    </div>
                  ))}
                </>
              );
            })()}
          </div>

          {/* Citations */}
          <div style={{ marginBottom: "var(--space-6)" }}>
            <h3 style={{ fontFamily: "var(--font-sans)", fontSize: "var(--text-base)", fontWeight: 600, marginBottom: "var(--space-2)" }}>Citations (min 1 to publish)</h3>
            <p style={{ fontSize: "var(--text-xs)", color: "var(--color-text-muted)", marginBottom: 8 }}>
              Allowed Tier 1: {ALLOWED_CITATION_DOMAINS_TIER1.join(", ")}. Tier 2: {ALLOWED_CITATION_DOMAINS_TIER2.join(", ")}.
            </p>
            {(lesson.source_citations ?? []).map((c, i) => (
              <div key={i} style={{ display: "grid", gridTemplateColumns: "1fr 1fr 100px 60px", gap: 8, marginBottom: 8, alignItems: "end" }}>
                <input placeholder="Title" value={c.title} onChange={(e) => setLesson((l) => ({ ...l, source_citations: (l.source_citations ?? []).map((x, j) => (j === i ? { ...x, title: e.target.value } : x)) }))} style={inputStyle} />
                <input
                placeholder="URL"
                value={c.url}
                onChange={(e) => {
                  const url = e.target.value;
                  let domain = c.domain;
                  try {
                    if (url) domain = new URL(url.startsWith("http") ? url : `https://${url}`).hostname.replace(/^www\./, "");
                  } catch { /* keep current domain */ }
                  setLesson((l) => ({ ...l, source_citations: (l.source_citations ?? []).map((x, j) => (j === i ? { ...x, url, domain } : x)) }));
                }}
                style={inputStyle}
              />
                <select
                  value={c.tier}
                  onChange={(e) => setLesson((l) => ({ ...l, source_citations: (l.source_citations ?? []).map((x, j) => (j === i ? { ...x, tier: Number(e.target.value) as 1 | 2 } : x)) }))}
                  style={inputStyle}
                >
                  <option value={1}>Tier 1</option>
                  <option value={2}>Tier 2</option>
                </select>
                <button type="button" onClick={() => setLesson((l) => ({ ...l, source_citations: (l.source_citations ?? []).filter((_, j) => j !== i) }))} style={{ padding: "8px", fontSize: "var(--text-xs)", color: "#c0392b" }}>
                  Remove
                </button>
              </div>
            ))}
            <button
              type="button"
              onClick={() => setLesson((l) => ({ ...l, source_citations: [...(l.source_citations ?? []), { title: "", url: "", domain: "irs.gov", tier: 1 as const }] }))}
              style={{ padding: "8px 12px", fontSize: "var(--text-sm)", border: "1px solid var(--color-border-light)", borderRadius: "var(--radius-md)", background: "var(--color-surface)", cursor: "pointer" }}
            >
              Add citation
            </button>
          </div>
        </div>
      </div>

      {/* Actions */}
      <div style={{ display: "flex", flexWrap: "wrap", alignItems: "center", gap: "var(--space-3)", marginTop: "var(--space-6)", paddingTop: "var(--space-4)", borderTop: "1px solid var(--color-border-light)" }}>
        <button
          onClick={handleSaveDraft}
          disabled={saving || !lesson.slug?.trim() || !lesson.title?.trim()}
          style={{ padding: "10px 20px", backgroundColor: "var(--color-surface)", border: "2px solid var(--color-black)", borderRadius: "var(--radius-md)", fontWeight: 600, cursor: saving ? "wait" : "pointer" }}
        >
          Save draft
        </button>
        <button
          onClick={handlePublish}
          disabled={saving || !lesson.id || validationErrors.length > 0 || (lesson.source_citations?.length ?? 0) < 1}
          style={{ padding: "10px 20px", backgroundColor: "var(--color-primary)", color: "#fff", border: "none", borderRadius: "var(--radius-md)", fontWeight: 600, cursor: saving ? "wait" : "pointer" }}
        >
          Publish
        </button>
        {lesson.id && (
          <>
            <button
              type="button"
              onClick={() => { loadHistory(); setHistoryOpen(true); }}
              style={{ padding: "10px 20px", border: "1px solid var(--color-border-light)", borderRadius: "var(--radius-md)", background: "var(--color-surface)", cursor: "pointer" }}
            >
              View history
            </button>
          </>
        )}
      </div>

      {/* History drawer */}
      {historyOpen && lesson.id && (
        <div style={{ position: "fixed", inset: 0, zIndex: 100, display: "flex", alignItems: "stretch" }}>
          <div style={{ flex: 1, backgroundColor: "rgba(0,0,0,0.3)" }} onClick={() => { setHistoryOpen(false); setRollbackRev(null); }} aria-hidden />
          <div style={{ width: 360, maxWidth: "90vw", backgroundColor: "var(--color-bg)", borderLeft: "1px solid var(--color-border-light)", padding: "var(--space-5)", overflowY: "auto" }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "var(--space-4)" }}>
              <h3 style={{ margin: 0 }}>Version history</h3>
              <button type="button" onClick={() => { setHistoryOpen(false); setRollbackRev(null); }} style={{ padding: 4 }}><Icon name="x" size={18} /></button>
            </div>
            <ul style={{ listStyle: "none", padding: 0, margin: 0 }}>
              {versions.map((v) => (
                <li key={v.id} style={{ marginBottom: "var(--space-2)" }}>
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                    <span>Revision {v.revision} · {v.status} · {new Date(v.created_at).toLocaleString()}</span>
                    <button
                      type="button"
                      onClick={() => setRollbackRev(v.revision)}
                      style={{ padding: "4px 8px", fontSize: "var(--text-xs)" }}
                    >
                      Rollback
                    </button>
                  </div>
                </li>
              ))}
            </ul>
            {rollbackRev != null && (
              <div style={{ marginTop: "var(--space-4)" }}>
                <p style={{ fontSize: "var(--text-sm)", marginBottom: 8 }}>Restore revision {rollbackRev}?</p>
                <div style={{ display: "flex", gap: 8 }}>
                  <button onClick={handleRollback} disabled={saving} style={{ padding: "8px 16px", backgroundColor: "var(--color-primary)", color: "#fff", border: "none", borderRadius: "var(--radius-md)", cursor: "pointer" }}>
                    Confirm rollback
                  </button>
                  <button onClick={() => setRollbackRev(null)} style={{ padding: "8px 16px", border: "1px solid var(--color-border-light)", borderRadius: "var(--radius-md)", cursor: "pointer" }}>
                    Cancel
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      <p style={{ marginTop: "var(--space-6)", fontSize: "var(--text-sm)", color: "var(--color-text-muted)" }}>
        <strong>Educational only. Not financial advice.</strong>
      </p>
    </div>
  );
};
