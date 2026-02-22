import React, { useState, useEffect } from "react";
import { Icon } from "../ui/Icon";

interface TutorPanelProps {
  selectedText?: string;
  visible?: boolean;
  /** When provided, panel open state is controlled by parent (e.g. for full-width content when closed). */
  open?: boolean;
  onClose?: () => void;
}

const keyTerms = ["APY", "FDIC", "debit card", "overdraft", "direct deposit"];

const explanations: Record<string, string> = {
  "Index Fund": "An index fund tracks a market index (e.g. S&P 500). Instead of picking individual stocks, you own a tiny slice of every company in that index — instant diversification at low cost.",
  "Compound Interest": "Earning interest on your interest. Over time this creates exponential growth. A $1,000 deposit at 7% annual return becomes ~$7,600 in 30 years.",
  "Diversification": "Spreading investments across different assets so no single loss can sink your portfolio. Classic advice: don't put all your eggs in one basket.",
  "Dollar-Cost Averaging": "Investing a fixed amount regularly (e.g. $100/month) regardless of price. You buy more shares when prices are low, fewer when high — lowering your average cost over time.",
  "APY": "Annual Percentage Yield — the real rate of return on savings including compound interest over a year. Higher APY = more money earned on deposits.",
  "FDIC": "Federal Deposit Insurance Corporation. Insures up to $250,000 per depositor per bank. If your bank fails, the FDIC covers your money.",
  "debit card": "A card that pulls money directly from your checking account when you make a purchase. You can only spend what you actually have.",
  "overdraft": "When you spend more than your account balance. Banks may cover it but charge a fee (typically $25–$35 per occurrence).",
  "direct deposit": "When your employer sends your paycheck electronically straight to your bank account, usually available the same day.",
};

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
}) => {
  const [internalOpen, setInternalOpen] = useState(false);
  const isControlled = controlledOpen !== undefined && onClose !== undefined;
  const isOpen = isControlled ? controlledOpen : internalOpen;
  const handleClose = isControlled ? () => onClose?.() : () => setInternalOpen(false);

  const [activeTerm, setActiveTerm] = useState<string | null>(null);
  const [inputText, setInputText]   = useState("");
  const [thinking, setThinking]     = useState(false);
  const [shownTerm, setShownTerm]   = useState<string | null>(null);

  // When user highlights text, open the panel so content pushes left and AI help shows (uncontrolled only; controlled parent handles opening)
  useEffect(() => {
    if (selectedText && selectedText.trim() && !isControlled) {
      setInternalOpen(true);
    }
  }, [selectedText, isControlled]);

  const triggerTerm = (term: string) => {
    setThinking(true);
    setShownTerm(null);
    setTimeout(() => {
      setThinking(false);
      setShownTerm(term);
    }, 900);
  };

  useEffect(() => {
    if (selectedText && selectedText !== activeTerm) {
      setActiveTerm(selectedText);
      triggerTerm(selectedText);
    }
  }, [selectedText]); // eslint-disable-line react-hooks/exhaustive-deps

  const handleTermClick = (term: string) => {
    if (activeTerm === term && shownTerm === term) {
      setActiveTerm(null);
      setShownTerm(null);
    } else {
      setActiveTerm(term);
      triggerTerm(term);
    }
  };

  const explanation = shownTerm
    ? (explanations[shownTerm] ?? `"${shownTerm}" — this term relates to the financial concept being discussed. Highlight it in the lesson text to see a full explanation from Wilbur.`)
    : null;

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
          {/* Header: icon + "Wilbur Helps" + X */}
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
          </div>

          {/* Content */}
          {thinking ? (
            <div style={{ marginBottom: "14px" }}>
              <div style={{ fontSize: "var(--text-xs)", color: "var(--color-text-muted)", marginBottom: "4px" }}>Thinking…</div>
              <ThinkingDots />
            </div>
          ) : shownTerm ? (
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
              <div style={{ marginBottom: "14px" }}>
                {[
                  "Break it down into simpler parts",
                  "Look for context clues in the surrounding text",
                  "Consider how it applies to your specific situation",
                ].map((tip, i) => (
                  <div key={i} style={{ display: "flex", gap: "8px", marginBottom: "6px", fontSize: "var(--text-sm)", color: "var(--color-text-secondary)", lineHeight: 1.5 }}>
                    <span style={{ color: "var(--color-primary)", flexShrink: 0 }}>•</span>
                    {tip}
                  </div>
                ))}
              </div>
              <div style={{ fontSize: "11px", color: "var(--color-text-muted)", lineHeight: 1.5, marginBottom: "12px" }}>
                Explore related resources at the bottom of this lesson, or highlight a different term for more help.
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
