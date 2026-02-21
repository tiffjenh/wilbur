import React, { useState, useEffect } from "react";
import { Icon } from "../ui/Icon";
import { MascotPink } from "../ui/MascotPink";

interface TutorPanelProps {
  selectedText?: string;
  visible?: boolean;
  onClose?: () => void;
}

const keyTerms = ["Index Fund", "Compound Interest", "Diversification", "Dollar-Cost Averaging"];

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

export const TutorPanel: React.FC<TutorPanelProps> = ({ selectedText, visible = true, onClose }) => {
  const [activeTerm, setActiveTerm] = useState<string | null>(null);
  const [inputText, setInputText]   = useState("");
  const [thinking, setThinking]     = useState(false);
  const [shownTerm, setShownTerm]   = useState<string | null>(null);

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

  return (
    <aside style={{
      width: visible ? "var(--tutor-width)" : "0px",
      minWidth: visible ? "var(--tutor-width)" : "0px",
      borderLeft: "1px solid var(--color-border-light)",
      backgroundColor: "var(--color-surface)",
      overflowY: "auto", overflowX: "hidden",
      transition: "width var(--duration-slow) var(--ease-out), min-width var(--duration-slow) var(--ease-out)",
      position: "sticky", top: "var(--nav-height)",
      height: "calc(100vh - var(--nav-height))",
      flexShrink: 0,
    }}>
      {visible && (
        <div style={{ padding: "22px 18px 28px", animation: "tutorSlideIn var(--duration-normal) var(--ease-out)" }}>

          {/* ── Header ── */}
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "18px" }}>
            <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
              <div style={{ width: "20px", height: "20px", borderRadius: "50%", backgroundColor: "var(--color-pink-bg)", overflow: "hidden", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                <MascotPink size={26} style={{ marginTop: "4px" }} />
              </div>
              <span style={{ fontFamily: "var(--font-serif)", fontSize: "var(--text-md)", fontWeight: 600, color: "var(--color-text)" }}>
                AI Helper
              </span>
            </div>
            {onClose && (
              <button onClick={onClose} aria-label="Close helper" style={{ background: "none", border: "none", cursor: "pointer", padding: "4px", color: "var(--color-text-muted)", lineHeight: 0 }}>
                <Icon name="x" size={15} />
              </button>
            )}
          </div>

          {/* ── Content ── */}
          {thinking ? (
            <div style={{ marginBottom: "16px" }}>
              <div style={{ fontSize: "var(--text-xs)", color: "var(--color-text-muted)", marginBottom: "4px" }}>Thinking…</div>
              <ThinkingDots />
            </div>
          ) : shownTerm ? (
            <>
              {/* Selected term display */}
              <div style={{ marginBottom: "16px" }}>
                <div style={{ fontSize: "var(--text-xs)", color: "var(--color-text-muted)", marginBottom: "7px" }}>You selected:</div>
                <div style={{
                  backgroundColor: "var(--color-surface-hover)", border: "1px solid var(--color-border)",
                  borderRadius: "var(--radius-md)", padding: "9px 13px",
                  fontSize: "var(--text-sm)", fontWeight: 600, color: "var(--color-text)",
                  animation: "chipIn var(--duration-fast) var(--ease-out)",
                }}>
                  {shownTerm}
                </div>
              </div>

              {/* Explanation */}
              <div style={{
                fontSize: "var(--text-sm)", color: "var(--color-text-secondary)",
                lineHeight: 1.72, marginBottom: "20px", whiteSpace: "pre-line",
              }}>
                {explanation}
              </div>

              {/* Bullet tips */}
              <div style={{ marginBottom: "20px" }}>
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

              <div style={{ fontSize: "12px", color: "var(--color-text-muted)", lineHeight: 1.5, marginBottom: "14px" }}>
                If you're still unsure, feel free to explore the related resources at the bottom of this lesson, or highlight a different term for more specific help!
              </div>
            </>
          ) : (
            <>
              {/* Idle state — matches class.png AI Helper panel */}
              <div style={{ marginBottom: "16px" }}>
                <p style={{ fontSize: "var(--text-sm)", color: "var(--color-text-secondary)", lineHeight: 1.7, marginBottom: "14px" }}>
                  Confused? Highlight any text to get an instant, simple explanation.
                </p>
                <div style={{
                  backgroundColor: "var(--color-surface-hover)", borderRadius: "var(--radius-md)",
                  padding: "11px 13px", fontSize: "var(--text-xs)", color: "var(--color-text-muted)", lineHeight: 1.6,
                }}>
                  Try it: Highlight terms like <strong style={{ color: "var(--color-text-secondary)" }}>'APY'</strong> or <strong style={{ color: "var(--color-text-secondary)" }}>'compound interest'</strong>
                </div>
              </div>
            </>
          )}

          {/* ── Key Terms ── */}
          {keyTerms.length > 0 && (
            <div style={{ marginBottom: "20px" }}>
              <div className="section-label" style={{ marginBottom: "10px" }}>Key Terms:</div>
              <div style={{ display: "flex", flexDirection: "column", gap: "5px" }}>
                {keyTerms.map((term) => {
                  const isActive = activeTerm === term && shownTerm === term;
                  return (
                    <button
                      key={term}
                      onClick={() => handleTermClick(term)}
                      style={{
                        display: "block", width: "100%", textAlign: "left",
                        padding: "9px 12px",
                        borderRadius: "var(--radius-md)",
                        border: "1px solid var(--color-border-light)",
                        backgroundColor: isActive ? "var(--color-surface-hover)" : "var(--color-surface)",
                        fontSize: "var(--text-sm)", fontWeight: isActive ? 600 : 400,
                        color: "var(--color-text)",
                        fontFamily: "var(--font-sans)", cursor: "pointer",
                        transition: "background-color var(--duration-fast)",
                        boxShadow: isActive ? "none" : "var(--shadow-xs)",
                      }}
                      onMouseEnter={(e) => { if (!isActive) (e.currentTarget as HTMLElement).style.backgroundColor = "var(--color-surface-hover)"; }}
                      onMouseLeave={(e) => { if (!isActive) (e.currentTarget as HTMLElement).style.backgroundColor = "var(--color-surface)"; }}
                    >
                      {term}
                    </button>
                  );
                })}
              </div>
            </div>
          )}

          {/* ── Tip footer ── */}
          <div style={{ fontSize: "12px", color: "var(--color-text-muted)", lineHeight: 1.55, marginBottom: "14px" }}>
            Tip: Highlight any term you don't understand for instant help!
          </div>

          {/* ── Ask input ── */}
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
                flex: 1, padding: "8px 11px", border: "1px solid var(--color-border)",
                borderRadius: "var(--radius-md)", fontSize: "var(--text-sm)",
                fontFamily: "var(--font-sans)", outline: "none",
                backgroundColor: "var(--color-surface)", color: "var(--color-text)",
              }}
            />
            <button
              onClick={() => {
                if (inputText.trim()) {
                  setActiveTerm(inputText.trim());
                  triggerTerm(inputText.trim());
                  setInputText("");
                }
              }}
              style={{
                padding: "8px 13px", backgroundColor: "var(--color-primary)", color: "#fff",
                border: "none", borderRadius: "var(--radius-md)", cursor: "pointer",
                fontSize: "var(--text-sm)", fontFamily: "var(--font-sans)", fontWeight: 600, flexShrink: 0,
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
