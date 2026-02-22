/**
 * Highlight-to-explain AI component.
 * When user selects text inside a lesson, a floating tooltip appears
 * offering to explain it. Clicking opens an explanation modal.
 *
 * Uses guardrail prompt: Wilbur is an educational assistant.
 * No financial advice. No specific investment recommendations.
 */
import React, { useState, useEffect, useRef, useCallback } from "react";

/* ── Types ──────────────────────────────────────────────── */

interface FloatingTooltipProps {
  text: string;
  position: { x: number; y: number };
  onAsk: (text: string) => void;
  onDismiss: () => void;
}

interface ExplainModalProps {
  term: string;
  onClose: () => void;
}

/* ── Wilbur explanation mock ─────────────────────────────── */
// In production this would call an AI API with guardrailed system prompt.
// For MVP, use a lookup + generic response.

const TERM_EXPLANATIONS: Record<string, string> = {
  apy: "APY stands for Annual Percentage Yield. It tells you how much interest you earn in one year, including the effect of compounding (earning interest on your interest). A 4% APY on $1,000 means you'd earn about $40 in a year.",
  apr: "APR is Annual Percentage Rate — the yearly cost of borrowing money, not including compounding. On credit cards, this is the interest rate applied to balances you carry. A 20% APR means carrying $1,000 costs about $200/year in interest.",
  "compound interest": "Compound interest means you earn (or pay) interest on your interest. Money grows faster than simple interest because each period's earnings become part of the new principal. Einstein reportedly called it 'the 8th wonder of the world.'",
  "index fund": "An index fund tracks a market index — like the S&P 500 (the 500 largest US companies). Instead of a manager picking stocks, it simply holds all the stocks in the index proportionally. This means broad diversification and very low fees.",
  "emergency fund": "An emergency fund is money set aside specifically for unexpected, essential expenses — job loss, medical bills, car repairs. It's usually kept in a separate savings account so you don't accidentally spend it.",
  "dollar-cost averaging": "Dollar-cost averaging means investing a fixed amount regularly (e.g., $200/month) regardless of market conditions. When prices are high, you buy fewer shares; when prices are low, you buy more. Over time, this reduces the impact of volatility.",
  "roth ira": "A Roth IRA is an individual retirement account where you contribute after-tax money. Your money grows tax-free, and withdrawals in retirement are also tax-free. There are income limits to contribute.",
  "401(k)": "A 401(k) is an employer-sponsored retirement savings account. Contributions come out of your paycheck pre-tax (Traditional) or post-tax (Roth). Many employers match a portion of your contributions — that's free money.",
  "fdic": "The FDIC (Federal Deposit Insurance Corporation) is a US government agency that insures bank deposits up to $250,000 per depositor, per bank. If your bank fails, the FDIC protects your money.",
  "credit utilization": "Credit utilization is how much of your available credit you're using. If you have a $10,000 limit and carry a $3,000 balance, your utilization is 30%. Keeping it under 30% (ideally under 10%) helps your credit score.",
  "diversification": "Diversification means spreading your money across many different investments so that if one does poorly, it doesn't devastate your portfolio. Owning 500 stocks (via an index fund) is much safer than owning 1 stock.",
};

function getExplanation(term: string): string {
  const lower = term.toLowerCase().trim();

  // Check exact match first
  if (TERM_EXPLANATIONS[lower]) return TERM_EXPLANATIONS[lower];

  // Check partial match
  for (const [key, value] of Object.entries(TERM_EXPLANATIONS)) {
    if (lower.includes(key) || key.includes(lower)) return value;
  }

  // Generic response
  return `"${term}" is a financial concept. In simple terms: this relates to how money works in your specific situation. For a detailed, personalized explanation, consider consulting a licensed financial professional. Remember: Wilbur provides education, not financial advice.`;
}

/* ── Floating Tooltip ───────────────────────────────────── */

function FloatingTooltip({ text, position, onAsk, onDismiss }: FloatingTooltipProps) {
  return (
    <div
      style={{
        position: "fixed",
        left: position.x,
        top: position.y - 40,
        transform: "translateX(-50%)",
        zIndex: 9999,
        backgroundColor: "#0E5C4C",
        color: "#fff",
        borderRadius: 8,
        padding: "6px 12px",
        fontSize: 12,
        fontFamily: "var(--font-sans)",
        fontWeight: 600,
        cursor: "pointer",
        whiteSpace: "nowrap",
        boxShadow: "0 4px 16px rgba(14,92,76,0.25)",
        display: "flex",
        alignItems: "center",
        gap: 6,
        userSelect: "none",
      }}
      onMouseDown={(e) => e.preventDefault()}
    >
      <span onClick={() => onAsk(text)}>Ask Wilbur</span>
      <button
        onClick={onDismiss}
        style={{ background: "none", border: "none", color: "rgba(255,255,255,0.7)", cursor: "pointer", padding: "0 0 0 4px", fontSize: 14, lineHeight: 1 }}
      >
        ×
      </button>
    </div>
  );
}

/* ── Explanation Modal ──────────────────────────────────── */

function ExplainModal({ term, onClose }: ExplainModalProps) {
  const explanation = getExplanation(term);

  useEffect(() => {
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", handleKey);
    return () => window.removeEventListener("keydown", handleKey);
  }, [onClose]);

  return (
    <>
      {/* Backdrop */}
      <div
        onClick={onClose}
        style={{
          position: "fixed", inset: 0,
          backgroundColor: "rgba(0,0,0,0.25)",
          zIndex: 10000,
          backdropFilter: "blur(2px)",
        }}
      />
      {/* Modal */}
      <div style={{
        position: "fixed",
        top: "50%",
        left: "50%",
        transform: "translate(-50%, -50%)",
        zIndex: 10001,
        backgroundColor: "#fff",
        borderRadius: 16,
        padding: "28px 32px",
        maxWidth: 480,
        width: "calc(100% - 32px)",
        boxShadow: "0 20px 60px rgba(0,0,0,0.15)",
        fontFamily: "var(--font-sans)",
      }}>
        {/* Header */}
        <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 16 }}>
          <div style={{
            width: 36, height: 36,
            borderRadius: "50%",
            backgroundColor: "#0E5C4C",
            display: "flex", alignItems: "center", justifyContent: "center",
            fontSize: 14, fontWeight: 700, color: "#fff", flexShrink: 0,
          }}>
            W
          </div>
          <div>
            <div style={{ fontSize: 14, fontWeight: 700, color: "#1A1A1A" }}>Wilbur</div>
            <div style={{ fontSize: 11, color: "#7a7a6e" }}>Educational assistant</div>
          </div>
          <button
            onClick={onClose}
            style={{ marginLeft: "auto", background: "none", border: "none", cursor: "pointer", fontSize: 20, color: "#7a7a6e", padding: 0 }}
          >
            ×
          </button>
        </div>

        {/* Term */}
        <div style={{
          padding: "8px 12px",
          backgroundColor: "rgba(14,92,76,0.08)",
          borderRadius: 8,
          marginBottom: 16,
          fontSize: 13,
          fontWeight: 600,
          color: "#0E5C4C",
          border: "1px solid rgba(14,92,76,0.15)",
        }}>
          "{term}"
        </div>

        {/* Explanation */}
        <p style={{ fontSize: 14, color: "#3d3d35", lineHeight: 1.7, margin: 0 }}>
          {explanation}
        </p>

        {/* Disclaimer */}
        <div style={{
          marginTop: 16,
          padding: "8px 12px",
          backgroundColor: "#f8f6f0",
          borderRadius: 8,
          fontSize: 11,
          color: "#7a7a6e",
          lineHeight: 1.5,
        }}>
          This is educational information only. Wilbur does not provide financial advice or recommend specific investments.
        </div>

        <button
          onClick={onClose}
          style={{
            marginTop: 16,
            width: "100%",
            padding: "10px",
            backgroundColor: "#0E5C4C",
            color: "#fff",
            border: "none",
            borderRadius: 8,
            fontSize: 14,
            fontWeight: 600,
            fontFamily: "var(--font-sans)",
            cursor: "pointer",
          }}
        >
          Got it
        </button>
      </div>
    </>
  );
}

/* ── Main HighlightAI Component ─────────────────────────── */

interface HighlightAIProps {
  containerRef: React.RefObject<HTMLElement | null>;
}

export function HighlightAI({ containerRef }: HighlightAIProps) {
  const [tooltip, setTooltip] = useState<{ text: string; x: number; y: number } | null>(null);
  const [modalTerm, setModalTerm] = useState<string | null>(null);
  const tooltipTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const handleMouseUp = useCallback(() => {
    if (tooltipTimerRef.current) clearTimeout(tooltipTimerRef.current);

    tooltipTimerRef.current = setTimeout(() => {
      const selection = window.getSelection();
      const text = selection?.toString().trim();

      if (!text || text.length < 2 || text.length > 80) {
        setTooltip(null);
        return;
      }

      // Only show tooltip if selection is inside the container
      if (containerRef.current) {
        const range = selection?.getRangeAt(0);
        const rect = range?.getBoundingClientRect();
        if (!rect) { setTooltip(null); return; }

        const isInsideContainer = containerRef.current.contains(range?.commonAncestorContainer ?? null);
        if (!isInsideContainer) { setTooltip(null); return; }

        setTooltip({
          text,
          x: rect.left + rect.width / 2,
          y: rect.top,
        });
      }
    }, 100);
  }, [containerRef]);

  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;
    el.addEventListener("mouseup", handleMouseUp);

    const handleClickOutside = () => {
      if (!window.getSelection()?.toString()) {
        setTooltip(null);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);

    return () => {
      el.removeEventListener("mouseup", handleMouseUp);
      document.removeEventListener("mousedown", handleClickOutside);
      if (tooltipTimerRef.current) clearTimeout(tooltipTimerRef.current);
    };
  }, [containerRef, handleMouseUp]);

  const handleAsk = (text: string) => {
    setTooltip(null);
    setModalTerm(text);
    window.getSelection()?.removeAllRanges();
  };

  return (
    <>
      {tooltip && (
        <FloatingTooltip
          text={tooltip.text}
          position={{ x: tooltip.x, y: tooltip.y }}
          onAsk={handleAsk}
          onDismiss={() => setTooltip(null)}
        />
      )}
      {modalTerm && (
        <ExplainModal
          term={modalTerm}
          onClose={() => setModalTerm(null)}
        />
      )}
    </>
  );
}
