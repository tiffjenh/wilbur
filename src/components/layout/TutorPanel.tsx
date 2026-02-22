import React, { useState, useEffect, useRef } from "react";
import { Icon } from "../ui/Icon";

const EXPLAIN_API = "/api/ai/explain";
const RATE_LIMIT_MS = 2000;
const MAX_TEXT_LENGTH = 500;

/** Client-side safety: replace advisory phrasing with neutral message */
const ADVISORY_PATTERNS = ["You should invest", "Buy", "Sell", "I recommend"];
const NEUTRAL_FALLBACK = "This response was adjusted to maintain educational neutrality.";

function applySafetyFilter(explanation: string): string {
  const lower = explanation.toLowerCase();
  for (const phrase of ADVISORY_PATTERNS) {
    if (lower.includes(phrase.toLowerCase())) return NEUTRAL_FALLBACK;
  }
  return explanation;
}

interface TutorPanelProps {
  selectedText?: string;
  visible?: boolean;
  /** When provided, panel open state is controlled by parent (e.g. for full-width content when closed). */
  open?: boolean;
  onClose?: () => void;
  /** When false, panel has no close button and is always shown when open (e.g. on Lesson page). */
  closable?: boolean;
}

const keyTerms = ["APY", "FDIC", "debit card", "overdraft", "direct deposit"];

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

const BORDER_LIGHT = "#e2dcd2";

export const TutorPanel: React.FC<TutorPanelProps> = ({
  selectedText,
  visible: visibleProp = true,
  open: controlledOpen,
  onClose,
  closable = true,
}) => {
  const [internalOpen, setInternalOpen] = useState(false);
  const isControlled = controlledOpen !== undefined && onClose !== undefined;
  const isOpen = isControlled ? controlledOpen : internalOpen;
  const handleClose = closable && isControlled ? () => onClose?.() : closable ? () => setInternalOpen(false) : undefined;

  const [activeTerm, setActiveTerm] = useState<string | null>(null);
  const [inputText, setInputText] = useState("");
  const [thinking, setThinking] = useState(false);
  const [shownTerm, setShownTerm] = useState<string | null>(null);
  const [aiExplanation, setAiExplanation] = useState<string | null>(null);
  const [aiError, setAiError] = useState<string | null>(null);
  const [citations, setCitations] = useState<string[]>([]);
  const lastRequestRef = useRef<number>(0);
  const requestInFlightRef = useRef<boolean>(false);

  // When user highlights text, open the panel so content pushes left (uncontrolled only; controlled parent handles opening)
  useEffect(() => {
    if (selectedText && selectedText.trim() && !isControlled) {
      setInternalOpen(true);
    }
  }, [selectedText, isControlled]);

  const triggerTerm = (term: string) => {
    if (requestInFlightRef.current) return;
    setActiveTerm(term);
    setShownTerm(null);
    setAiExplanation(null);
    setAiError(null);
    setCitations([]);

    const now = Date.now();
    if (now - lastRequestRef.current < RATE_LIMIT_MS) {
      setAiError("Please wait a moment before asking again.");
      return;
    }
    lastRequestRef.current = now;
    requestInFlightRef.current = true;
    setThinking(true);

    const body = JSON.stringify({ selectedText: term.slice(0, MAX_TEXT_LENGTH) });
    fetch(EXPLAIN_API, { method: "POST", headers: { "Content-Type": "application/json" }, body })
      .then(async (res) => {
        const data = await res.json().catch(() => ({}));
        if (!res.ok) {
          setAiError(typeof data?.error === "string" ? data.error : "We couldn't get an explanation right now. Please try again.");
          return;
        }
        const raw = data.explanation ?? "";
        setAiExplanation(applySafetyFilter(raw));
        setCitations(Array.isArray(data.citations) ? data.citations : []);
        setShownTerm(term);
      })
      .catch(() => {
        setAiError("Something went wrong. Please try again in a moment.");
      })
      .finally(() => {
        setThinking(false);
        requestInFlightRef.current = false;
      });
  };

  useEffect(() => {
    if (selectedText && selectedText.trim()) {
      triggerTerm(selectedText.trim());
    }
  }, [selectedText]); // eslint-disable-line react-hooks/exhaustive-deps

  const handleTermClick = (term: string) => {
    if (activeTerm === term && shownTerm === term) {
      setActiveTerm(null);
      setShownTerm(null);
      setAiExplanation(null);
      setAiError(null);
      setCitations([]);
    } else {
      setActiveTerm(term);
      triggerTerm(term);
    }
  };

  const explanation = aiExplanation ?? null;

  const visible = visibleProp && isOpen;

  return (
    <aside style={{
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
    }}>
      {visible && (
        <div style={{
          padding: "16px 14px 20px",
          margin: "12px 10px",
          backgroundColor: "#fff",
          border: `1px solid ${BORDER_LIGHT}`,
          borderRadius: "var(--radius-md)",
          boxShadow: "0 1px 3px rgba(0,0,0,0.06)",
          animation: "tutorSlideIn var(--duration-normal) var(--ease-out)",
        }}>
          {/* Header: icon + "Wilbur Helps" + X (only when closable) */}
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "14px" }}>
            <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
              <div style={{
                width: 28,
                height: 28,
                borderRadius: "50%",
                backgroundColor: "var(--color-border-light)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                flexShrink: 0,
              }}>
                <Icon name="sparkle" size={16} color="var(--color-primary)" strokeWidth={2} />
              </div>
              <span style={{ fontFamily: "var(--font-sans)", fontSize: "var(--text-sm)", fontWeight: 700, color: "var(--color-text)" }}>
                Wilbur Helps
              </span>
            </div>
            {closable && handleClose != null && (
              <button
                type="button"
                onClick={handleClose}
                aria-label="Close Wilbur Helps"
                style={{
                  padding: 4,
                  background: "none",
                  border: "none",
                  cursor: "pointer",
                  color: "var(--color-text-muted)",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                <Icon name="x" size={18} strokeWidth={2} />
              </button>
            )}
          </div>

          {/* Content */}
          {thinking ? (
            <div style={{ marginBottom: "14px" }}>
              <div style={{ display: "flex", alignItems: "center", gap: "8px", marginBottom: "4px" }}>
                <Icon name="piggy-bank" size={20} color="var(--color-pink-bg)" strokeWidth={1.5} style={{ filter: "saturate(0.9)" }} />
                <span style={{ fontSize: "var(--text-xs)", color: "var(--color-text-muted)" }}>Thinking…</span>
              </div>
              <ThinkingDots />
            </div>
          ) : aiError ? (
            <div style={{ marginBottom: "14px" }}>
              <div style={{
                padding: "10px 12px",
                backgroundColor: "rgba(217,83,79,0.08)",
                border: "1px solid rgba(217,83,79,0.25)",
                borderRadius: "var(--radius-md)",
                fontSize: "var(--text-sm)",
                color: "var(--color-text-secondary)",
                lineHeight: 1.5,
              }}>
                {aiError}
              </div>
            </div>
          ) : shownTerm && explanation ? (
            <>
              <div style={{ marginBottom: "12px" }}>
                <div style={{ fontSize: "var(--text-xs)", color: "var(--color-text-muted)", marginBottom: "6px" }}>You selected:</div>
                <div style={{
                  backgroundColor: "transparent",
                  border: `1px solid ${BORDER_LIGHT}`,
                  borderRadius: "var(--radius-md)",
                  padding: "8px 12px",
                  fontSize: "var(--text-sm)",
                  fontWeight: 600,
                  color: "var(--color-text)",
                }}>
                  {shownTerm}
                </div>
              </div>
              <div style={{
                fontSize: "var(--text-sm)",
                color: "var(--color-text-secondary)",
                lineHeight: 1.65,
                marginBottom: "16px",
                whiteSpace: "pre-line",
              }}>
                {explanation}
              </div>
              {citations.length > 0 && (
                <div style={{ marginBottom: "12px" }}>
                  <div style={{ fontSize: "var(--text-xs)", fontWeight: 600, color: "var(--color-text-muted)", marginBottom: "6px" }}>Sources</div>
                  <ul style={{ margin: 0, paddingLeft: "18px", fontSize: "var(--text-xs)", color: "var(--color-primary)", lineHeight: 1.6 }}>
                    {citations.map((url, i) => (
                      <li key={i}>
                        <a href={url} target="_blank" rel="noopener noreferrer" style={{ color: "inherit" }}>
                          {url}
                        </a>
                      </li>
                    ))}
                  </ul>
                </div>
              )}
              <div style={{ fontSize: "11px", color: "var(--color-text-muted)", lineHeight: 1.5, marginBottom: "12px" }}>
                Highlight different text for another explanation, or ask a question below.
              </div>
            </>
          ) : (
            <div style={{ marginBottom: "14px" }}>
              <p style={{ fontSize: "var(--text-sm)", color: "var(--color-text-secondary)", lineHeight: 1.6, marginBottom: "12px" }}>
                Confused? Highlight any text to get an instant, simple explanation.
              </p>
              <div style={{
                backgroundColor: "transparent",
                border: `1px solid ${BORDER_LIGHT}`,
                borderRadius: "var(--radius-md)",
                padding: "10px 12px",
                fontSize: "var(--text-xs)",
                color: "var(--color-text)",
                lineHeight: 1.5,
                fontFamily: "var(--font-sans)",
              }}>
                <strong>Try it:</strong> Highlight terms like &quot;APY&quot; or &quot;compound interest&quot;
              </div>
            </div>
          )}

          {/* Key Terms — light grey borders */}
          {keyTerms.length > 0 && (
            <div style={{ marginBottom: "16px" }}>
              <div style={{ fontSize: "var(--text-xs)", fontWeight: 700, color: "var(--color-text)", marginBottom: "8px", fontFamily: "var(--font-sans)" }}>Key Terms:</div>
              <div style={{ display: "flex", flexWrap: "wrap", gap: "6px" }}>
                {keyTerms.map((term) => {
                  const isActive = activeTerm === term && shownTerm === term;
                  return (
                    <button
                      key={term}
                      onClick={() => handleTermClick(term)}
                      type="button"
                      style={{
                        padding: "6px 10px",
                        borderRadius: "var(--radius-md)",
                        border: `1px solid ${BORDER_LIGHT}`,
                        backgroundColor: isActive ? "rgba(14, 92, 76, 0.06)" : "transparent",
                        fontSize: "var(--text-xs)",
                        fontWeight: isActive ? 600 : 400,
                        color: "var(--color-text)",
                        fontFamily: "var(--font-sans)",
                        cursor: "pointer",
                      }}
                    >
                      {term}
                    </button>
                  );
                })}
              </div>
            </div>
          )}

          {/* Ask input — no tip above; Ask button: black border, transparent bg */}
          <div style={{ display: "flex", gap: "6px" }}>
            <input
              type="text"
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter" && inputText.trim()) {
                  setActiveTerm(inputText.trim());
                  triggerTerm(inputText.trim());
                  setInputText("");
                }
              }}
              placeholder="Ask a question..."
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
              onClick={() => {
                if (inputText.trim()) {
                  setActiveTerm(inputText.trim());
                  triggerTerm(inputText.trim());
                  setInputText("");
                }
              }}
              style={{
                padding: "8px 14px",
                backgroundColor: "transparent",
                color: "var(--color-text)",
                border: "2px solid var(--color-black)",
                borderRadius: "var(--radius-md)",
                cursor: "pointer",
                fontSize: "var(--text-sm)",
                fontFamily: "var(--font-sans)",
                fontWeight: 600,
                flexShrink: 0,
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
