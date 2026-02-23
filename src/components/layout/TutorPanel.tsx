import React, { useState, useEffect, useRef, useCallback } from "react";
import { Icon } from "../ui/Icon";

const WILBUR_API = "/api/wilbur";
const RATE_LIMIT_MS = 2000;
const MAX_HIGHLIGHT_CHARS = 150;
const MAX_QUESTION_CHARS = 300;
const MAX_HISTORY = 10;
const isDev = Boolean((import.meta as ImportMeta & { env?: { DEV?: boolean } }).env?.DEV);

const BORDER_LIGHT = "#e2dcd2";

interface TutorPanelProps {
  selectedText?: string;
  lessonId?: string;
  visible?: boolean;
  open?: boolean;
  onClose?: () => void;
  closable?: boolean;
}

const ThinkingDots: React.FC = () => (
  <div style={{ display: "flex", alignItems: "center", gap: "5px", padding: "12px 0" }}>
    {[0, 1, 2].map((i) => (
      <span
        key={i}
        style={{
          width: "7px", height: "7px", borderRadius: "50%",
          backgroundColor: "var(--color-primary)",
          display: "inline-block",
          animation: `thinkingDot 1.2s ease-in-out infinite ${i * 180}ms`,
        }}
      />
    ))}
  </div>
);

type Message = { role: "user" | "assistant"; content: string };

export const TutorPanel: React.FC<TutorPanelProps> = ({
  selectedText,
  lessonId,
  visible: visibleProp = true,
  open: controlledOpen,
  onClose,
  closable = true,
}) => {
  const [internalOpen, setInternalOpen] = useState(false);
  const isControlled = controlledOpen !== undefined && onClose !== undefined;
  const isOpen = isControlled ? controlledOpen : internalOpen;
  const handleClose = closable && isControlled ? () => onClose?.() : closable ? () => setInternalOpen(false) : undefined;

  const [messages, setMessages] = useState<Message[]>([]);
  const [inputText, setInputText] = useState("");
  const [thinking, setThinking] = useState(false);
  const [aiError, setAiError] = useState<string | null>(null);
  const [highlightPrompt, setHighlightPrompt] = useState<string | null>(null);
  const [highlightAnswer, setHighlightAnswer] = useState<string | null>(null);
  const [tooLongMessage, setTooLongMessage] = useState(false);
  const lastRequestRef = useRef<number>(0);
  const abortRef = useRef<AbortController | null>(null);

  useEffect(() => {
    if (selectedText && selectedText.trim() && !isControlled) setInternalOpen(true);
  }, [selectedText, isControlled]);

  const callWilbur = useCallback(
    async (mode: "highlight" | "chat", payload: { selectedText?: string; question?: string; history?: Message[] }) => {
      if (abortRef.current) {
        abortRef.current.abort();
      }
      const controller = new AbortController();
      abortRef.current = controller;

      const now = Date.now();
      if (now - lastRequestRef.current < RATE_LIMIT_MS) {
        setAiError("Please wait a moment before asking again.");
        return;
      }
      lastRequestRef.current = now;
      setAiError(null);
      setThinking(true);
      setTooLongMessage(false);

      const body = JSON.stringify({
        mode,
        lessonId: lessonId ?? undefined,
        ...payload,
      });

      if (isDev) {
        console.log("[TutorPanel] request", { mode, payload: { ...payload, historyLen: payload.history?.length } });
      }

      try {
        const res = await fetch(WILBUR_API, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body,
          signal: controller.signal,
        });
        const responseText = await res.text();
        let data: Record<string, unknown> = {};
        try {
          data = responseText ? JSON.parse(responseText) as Record<string, unknown> : {};
        } catch {
          data = {};
        }

        if (isDev) {
          console.log(
            "[TutorPanel] response",
            res.status,
            data?.error ? { error: data.error } : { answerLen: typeof data?.answer === "string" ? data.answer.length : undefined },
            !data?.error && typeof data?.answer !== "string" && responseText
              ? { rawPreview: responseText.slice(0, 160) }
              : undefined
          );
        }

        if (!res.ok) {
          let msg = typeof data?.error === "string" ? data.error : "We couldn't get an answer right now. Please try again.";
          if (res.status === 404 && isDev) {
            msg = "Local AI API not found. Use `npx vercel dev` (Vite alone does not run /api/wilbur).";
          } else if (res.status === 405 && isDev) {
            msg = "AI API route responded with 405. Check that `/api/wilbur` is running under Vercel dev.";
          } else if (!data?.error && responseText && isDev) {
            msg = `AI request failed (${res.status}). Open DevTools console for response preview.`;
          }
          setAiError(msg);
          if (isDev) console.warn("[TutorPanel] API error", res.status, data, responseText.slice(0, 300));
          return;
        }
        const answer = typeof data?.answer === "string" ? data.answer : "";
        if (mode === "highlight") {
          setHighlightAnswer(answer);
          setHighlightPrompt(payload.selectedText ?? null);
        } else {
          setMessages((prev) => [...prev.slice(-(MAX_HISTORY - 1)), { role: "assistant", content: answer }]);
        }
      } catch (err) {
        if ((err as Error)?.name === "AbortError") return;
        setAiError("Something went wrong. Please try again in a moment.");
        if (isDev) console.error("[TutorPanel] fetch error", err);
      } finally {
        setThinking(false);
        abortRef.current = null;
      }
    },
    [lessonId]
  );

  useEffect(() => {
    const text = selectedText?.trim() ?? "";
    if (!text) {
      setHighlightPrompt(null);
      setHighlightAnswer(null);
      setTooLongMessage(false);
      return;
    }
    if (text.length > MAX_HIGHLIGHT_CHARS) {
      setTooLongMessage(true);
      setHighlightPrompt(null);
      setHighlightAnswer(null);
      return;
    }
    setTooLongMessage(false);
    setHighlightPrompt(text);
    setHighlightAnswer(null);
    callWilbur("highlight", { selectedText: text });
  }, [selectedText, callWilbur]);

  const handleAsk = useCallback(() => {
    const q = inputText.trim();
    if (!q) return;
    if (q.length > MAX_QUESTION_CHARS) {
      setAiError(`Please keep your question under ${MAX_QUESTION_CHARS} characters.`);
      return;
    }
    setInputText("");
    setAiError(null);
    setMessages((prev) => [...prev, { role: "user", content: q }]);
    const history = [...messages, { role: "user" as const, content: q }].slice(-MAX_HISTORY);
    callWilbur("chat", { question: q, history });
  }, [inputText, messages, callWilbur]);

  const visible = visibleProp && isOpen;

  return (
    <aside
      style={{
        width: visible ? "var(--tutor-width)" : "0px",
        minWidth: visible ? "var(--tutor-width)" : "0px",
        borderLeft: visible ? `1px solid ${BORDER_LIGHT}` : "none",
        backgroundColor: "transparent",
        overflowY: "auto",
        overflowX: "hidden",
        transition: "width var(--duration-slow) var(--ease-out), min-width var(--duration-slow) var(--ease-out)",
        position: "sticky",
        top: "var(--nav-height)",
        height: "calc(100vh - var(--nav-height))",
        flexShrink: 0,
        alignSelf: "flex-start",
      }}
    >
      {visible && (
        <div
          style={{
            padding: "16px 14px 20px",
            margin: "12px 10px",
            backgroundColor: "#fff",
            border: `1px solid ${BORDER_LIGHT}`,
            borderRadius: "var(--radius-md)",
            boxShadow: "0 1px 3px rgba(0,0,0,0.06)",
          }}
        >
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "14px" }}>
            <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
              <div
                style={{
                  width: 28, height: 28, borderRadius: "50%",
                  backgroundColor: "var(--color-border-light)",
                  display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0,
                }}
              >
                <Icon name="sparkle" size={16} color="var(--color-primary)" strokeWidth={2} />
              </div>
              <span style={{ fontFamily: "var(--font-sans)", fontSize: "var(--text-sm)", fontWeight: 700, color: "var(--color-text)" }}>
                Wilbur Helps
              </span>
            </div>
            {closable && handleClose != null && (
              <button type="button" onClick={handleClose} aria-label="Close" style={{ padding: 4, background: "none", border: "none", cursor: "pointer", color: "var(--color-text-muted)" }}>
                <Icon name="x" size={18} strokeWidth={2} />
              </button>
            )}
          </div>

          {aiError && (
            <div
              style={{
                marginBottom: 12,
                padding: "10px 12px",
                backgroundColor: "rgba(217,83,79,0.08)",
                border: "1px solid rgba(217,83,79,0.25)",
                borderRadius: "var(--radius-md)",
                fontSize: "var(--text-sm)",
                color: "var(--color-text-secondary)",
              }}
            >
              {aiError}
              <button
                type="button"
                onClick={() => setAiError(null)}
                style={{ marginLeft: 8, fontSize: "var(--text-xs)", textDecoration: "underline", background: "none", border: "none", cursor: "pointer", color: "inherit" }}
              >
                Dismiss
              </button>
            </div>
          )}

          {thinking && (
            <div style={{ marginBottom: 14 }}>
              <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 4 }}>
                <span style={{ fontSize: "var(--text-xs)", color: "var(--color-text-muted)" }}>Wilbur is thinking…</span>
              </div>
              <ThinkingDots />
            </div>
          )}

          {tooLongMessage && !thinking && (
            <div style={{ marginBottom: 14, padding: "10px 12px", backgroundColor: "#f8f6f0", borderRadius: "var(--radius-md)", fontSize: "var(--text-sm)", color: "var(--color-text-secondary)" }}>
              Select a shorter phrase (under {MAX_HIGHLIGHT_CHARS} characters) to get an explanation.
            </div>
          )}

          {highlightPrompt && highlightAnswer && !thinking && (
            <>
              <div style={{ marginBottom: 12 }}>
                <div style={{ fontSize: "var(--text-xs)", color: "var(--color-text-muted)", marginBottom: 6 }}>You selected:</div>
                <div style={{ padding: "8px 12px", border: `1px solid ${BORDER_LIGHT}`, borderRadius: "var(--radius-md)", fontSize: "var(--text-sm)", fontWeight: 600, color: "var(--color-text)" }}>
                  {highlightPrompt}
                </div>
              </div>
              <div style={{ fontSize: "var(--text-sm)", color: "var(--color-text-secondary)", lineHeight: 1.65, whiteSpace: "pre-line", marginBottom: 16 }}>
                {highlightAnswer}
              </div>
            </>
          )}

          {messages.length > 0 && !thinking && (
            <div style={{ marginBottom: 16, maxHeight: 280, overflowY: "auto" }}>
              {messages.map((m, i) => (
                <div
                  key={i}
                  style={{
                    marginBottom: 10,
                    padding: "8px 12px",
                    borderRadius: "var(--radius-md)",
                    fontSize: "var(--text-sm)",
                    textAlign: m.role === "user" ? "right" : "left",
                    backgroundColor: m.role === "user" ? "rgba(14,92,76,0.08)" : "#f5f3ee",
                    color: "var(--color-text)",
                    whiteSpace: "pre-wrap",
                  }}
                >
                  {m.content}
                </div>
              ))}
            </div>
          )}

          {!highlightPrompt && !highlightAnswer && messages.length === 0 && !thinking && !tooLongMessage && (
            <div style={{ marginBottom: 14 }}>
              <p style={{ fontSize: "var(--text-sm)", color: "var(--color-text-secondary)", lineHeight: 1.6, marginBottom: 12 }}>
                Highlight any text in the lesson to get an explanation, or ask a question below.
              </p>
              <div style={{ padding: "10px 12px", border: `1px solid ${BORDER_LIGHT}`, borderRadius: "var(--radius-md)", fontSize: "var(--text-xs)", color: "var(--color-text)", fontFamily: "var(--font-sans)" }}>
                <strong>Try it:</strong> Highlight terms like &quot;APY&quot; or &quot;compound interest&quot;, or type a question.
              </div>
            </div>
          )}

          <div style={{ display: "flex", gap: 6 }}>
            <input
              type="text"
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
              onKeyDown={(e) => { if (e.key === "Enter") handleAsk(); }}
              placeholder="Ask a question..."
              maxLength={MAX_QUESTION_CHARS + 50}
              style={{
                flex: 1,
                padding: "8px 10px",
                border: `1px solid ${BORDER_LIGHT}`,
                borderRadius: "var(--radius-md)",
                fontSize: "var(--text-sm)",
                fontFamily: "var(--font-sans)",
                outline: "none",
                backgroundColor: "transparent",
                color: "var(--color-text)",
              }}
            />
            <button
              type="button"
              onClick={handleAsk}
              disabled={thinking || !inputText.trim()}
              style={{
                padding: "8px 14px",
                backgroundColor: "transparent",
                color: "var(--color-text)",
                border: "2px solid var(--color-black)",
                borderRadius: "var(--radius-md)",
                cursor: thinking || !inputText.trim() ? "not-allowed" : "pointer",
                fontSize: "var(--text-sm)",
                fontFamily: "var(--font-sans)",
                fontWeight: 600,
                flexShrink: 0,
                opacity: thinking || !inputText.trim() ? 0.6 : 1,
              }}
            >
              Ask
            </button>
          </div>
        </div>
      )}
    </aside>
  );
};
