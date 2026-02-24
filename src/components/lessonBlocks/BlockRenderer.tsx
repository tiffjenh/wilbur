/**
 * Block renderer — converts LessonBlock arrays into visual UI.
 * Each block type renders as a self-contained visual card.
 * No long essay prose — think Duolingo meets Notion.
 */
import { useState } from "react";
import type {
  LessonBlock,
  HeroBlock,
  BulletListBlock,
  CalloutBlock,
  ComparisonBlock,
  ExampleBlock,
  InteractiveSliderBlock,
  QuizBlock,
  KeyTermsBlock,
  ToggleComparisonBlock,
  ChartPlaceholderBlock,
} from "@/content/lessonTypes";
import {
  WilburChart,
  CompoundInterestCalculator,
  DebtPayoffCalculator,
  BudgetCalculator,
} from "@/components/charts/WilburCharts";

/* ── Shared tokens ──────────────────────────────────────── */

const BLOCK_RADIUS = 12;
const BLOCK_PADDING = "20px 24px";
const BLOCK_MB = 16;

/* ── Hero Block ─────────────────────────────────────────── */

function HeroBlockRenderer({ title, subtitle }: HeroBlock) {
  return (
    <div style={{
      background: "linear-gradient(135deg, #0E5C4C 0%, #1a7a68 100%)",
      borderRadius: BLOCK_RADIUS,
      padding: "32px 28px",
      marginBottom: BLOCK_MB,
      textAlign: "center",
      color: "#fff",
    }}>
      <h2 style={{
        fontFamily: "var(--font-serif)",
        fontSize: "var(--text-2xl)",
        fontWeight: 400,
        margin: "0 0 8px",
        color: "#fff",
        lineHeight: 1.25,
      }}>
        {title}
      </h2>
      {subtitle && (
        <p style={{
          fontFamily: "var(--font-sans)",
          fontSize: "var(--text-base)",
          color: "rgba(255,255,255,0.8)",
          margin: 0,
          lineHeight: 1.55,
        }}>
          {subtitle}
        </p>
      )}
    </div>
  );
}

/* ── Bullet List Block ──────────────────────────────────── */

function BulletListBlockRenderer({ heading, items, icon = "dot" }: BulletListBlock) {
  const bullets: Record<string, string> = {
    check: "✓",
    arrow: "→",
    dot: "•",
  };
  const bulletSymbol = bullets[icon];

  return (
    <div style={{
      backgroundColor: "#fff",
      border: "1px solid #eae5db",
      borderRadius: BLOCK_RADIUS,
      padding: BLOCK_PADDING,
      marginBottom: BLOCK_MB,
    }}>
      {heading && (
        <h3 style={{
          fontFamily: "var(--font-sans)",
          fontSize: "var(--text-base)",
          fontWeight: 600,
          color: "#1A1A1A",
          margin: "0 0 12px",
        }}>
          {heading}
        </h3>
      )}
      <ul style={{ listStyle: "none", padding: 0, margin: 0, display: "flex", flexDirection: "column", gap: 10 }}>
        {items.map((item, i) => (
          <li key={i} style={{ display: "flex", gap: 12, fontSize: "var(--text-sm)", color: "#3d3d35", lineHeight: 1.6, fontFamily: "var(--font-sans)" }}>
            <span style={{ color: "#0E5C4C", fontWeight: 700, flexShrink: 0, marginTop: 1, fontSize: icon === "check" ? 12 : 16 }}>
              {bulletSymbol}
            </span>
            <span>{item}</span>
          </li>
        ))}
      </ul>
    </div>
  );
}

/* ── Callout Block ──────────────────────────────────────── */

const CALLOUT_STYLES: Record<string, { bg: string; border: string; icon: string; headingColor: string }> = {
  info:    { bg: "rgba(14,92,76,0.06)",  border: "rgba(14,92,76,0.2)",  icon: "i", headingColor: "#0E5C4C" },
  tip:     { bg: "rgba(14,92,76,0.08)",  border: "rgba(14,92,76,0.25)", icon: "Tip", headingColor: "#0E5C4C" },
  warning: { bg: "rgba(217,83,79,0.06)", border: "rgba(217,83,79,0.2)", icon: "!", headingColor: "#c0392b" },
  source:  { bg: "#f8f6f0",             border: "#e2dcd2",             icon: "Source", headingColor: "#7a7a6e" },
};

function CalloutBlockRenderer({ tone, heading, text }: CalloutBlock) {
  const style = CALLOUT_STYLES[tone] ?? CALLOUT_STYLES.info;
  return (
    <div style={{
      backgroundColor: style.bg,
      border: `1px solid ${style.border}`,
      borderRadius: BLOCK_RADIUS,
      padding: BLOCK_PADDING,
      marginBottom: BLOCK_MB,
    }}>
      <div style={{ display: "flex", gap: 10, alignItems: "flex-start" }}>
        <span style={{ fontSize: 16, flexShrink: 0, marginTop: 1 }}>{style.icon}</span>
        <div>
          {heading && (
            <div style={{ fontFamily: "var(--font-sans)", fontSize: "var(--text-sm)", fontWeight: 600, color: style.headingColor, marginBottom: 4 }}>
              {heading}
            </div>
          )}
          <p style={{ fontFamily: "var(--font-sans)", fontSize: "var(--text-sm)", color: "#3d3d35", margin: 0, lineHeight: 1.65 }}>
            {text}
          </p>
        </div>
      </div>
    </div>
  );
}

/* ── Comparison Block ───────────────────────────────────── */

function ComparisonBlockRenderer({ heading, left, right, note }: ComparisonBlock) {
  return (
    <div style={{ marginBottom: BLOCK_MB }}>
      {heading && (
        <h3 style={{ fontFamily: "var(--font-sans)", fontSize: "var(--text-base)", fontWeight: 600, color: "#1A1A1A", marginBottom: 12 }}>
          {heading}
        </h3>
      )}
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
        {[left, right].map((side, i) => (
          <div key={i} style={{
            backgroundColor: i === 0 ? "rgba(14,92,76,0.04)" : "#fff",
            border: `1px solid ${i === 0 ? "rgba(14,92,76,0.2)" : "#eae5db"}`,
            borderRadius: BLOCK_RADIUS,
            padding: "16px 18px",
          }}>
            <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 12 }}>
              <span style={{ fontFamily: "var(--font-sans)", fontSize: "var(--text-sm)", fontWeight: 700, color: "#1A1A1A" }}>
                {side.label}
              </span>
            </div>
            <ul style={{ listStyle: "none", padding: 0, margin: 0, display: "flex", flexDirection: "column", gap: 6 }}>
              {side.points.map((pt, j) => (
                <li key={j} style={{ fontSize: "var(--text-sm)", color: "#3d3d35", lineHeight: 1.5, fontFamily: "var(--font-sans)", display: "flex", gap: 8 }}>
                  <span style={{ color: "#0E5C4C", flexShrink: 0 }}>·</span>
                  {pt}
                </li>
              ))}
            </ul>
            {side.verdict && (
              <div style={{
                marginTop: 12, padding: "6px 10px",
                backgroundColor: i === 0 ? "rgba(14,92,76,0.1)" : "#f8f6f0",
                borderRadius: 6, fontSize: "var(--text-xs)",
                fontWeight: 600, color: i === 0 ? "#0E5C4C" : "#7a7a6e",
                fontFamily: "var(--font-sans)",
              }}>
                {side.verdict}
              </div>
            )}
          </div>
        ))}
      </div>
      {note && (
        <p style={{ fontFamily: "var(--font-sans)", fontSize: "var(--text-xs)", color: "#7a7a6e", marginTop: 8, fontStyle: "italic" }}>
          {note}
        </p>
      )}
    </div>
  );
}

/* ── Example Block ──────────────────────────────────────── */

function ExampleBlockRenderer({ heading, scenario, breakdown, outcome }: ExampleBlock) {
  return (
    <div style={{
      backgroundColor: "#f8f6f0",
      border: "1px solid #eae5db",
      borderRadius: BLOCK_RADIUS,
      padding: BLOCK_PADDING,
      marginBottom: BLOCK_MB,
    }}>
      {heading && (
        <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 10 }}>
          <span style={{ fontSize: 14 }}>📝</span>
          <span style={{ fontFamily: "var(--font-sans)", fontSize: "var(--text-sm)", fontWeight: 600, color: "#1A1A1A" }}>{heading}</span>
        </div>
      )}
      <p style={{ fontFamily: "var(--font-sans)", fontSize: "var(--text-sm)", color: "#3d3d35", margin: "0 0 12px", lineHeight: 1.6 }}>
        {scenario}
      </p>
      <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
        {breakdown.map((item, i) => (
          <div key={i} style={{
            backgroundColor: "#fff",
            border: "1px solid #eae5db",
            borderRadius: 8,
            padding: "8px 12px",
            fontSize: "var(--text-sm)",
            color: "#3d3d35",
            fontFamily: "var(--font-sans)",
            lineHeight: 1.5,
          }}>
            {item}
          </div>
        ))}
      </div>
      {outcome && (
        <div style={{
          marginTop: 12, padding: "10px 12px",
          backgroundColor: "rgba(14,92,76,0.08)",
          borderRadius: 8,
          borderLeft: "3px solid #0E5C4C",
          fontSize: "var(--text-sm)",
          color: "#0E5C4C",
          fontFamily: "var(--font-sans)",
          lineHeight: 1.6,
          fontWeight: 500,
        }}>
          {outcome}
        </div>
      )}
    </div>
  );
}

/* ── Interactive Slider Block ───────────────────────────── */

function InteractiveSliderBlockRenderer({ heading, description, calculatorType }: InteractiveSliderBlock) {
  return (
    <div style={{ marginBottom: BLOCK_MB }}>
      {heading && (
        <h3 style={{ fontFamily: "var(--font-sans)", fontSize: "var(--text-base)", fontWeight: 600, color: "#1A1A1A", marginBottom: 8 }}>
          {heading}
        </h3>
      )}
      {description && (
        <p style={{ fontFamily: "var(--font-sans)", fontSize: "var(--text-sm)", color: "#7a7a6e", marginBottom: 12 }}>
          {description}
        </p>
      )}
      {calculatorType === "compound-interest" && <CompoundInterestCalculator />}
      {calculatorType === "debt-payoff" && <DebtPayoffCalculator />}
      {calculatorType === "budget" && <BudgetCalculator />}
    </div>
  );
}

/* ── Quiz Block ─────────────────────────────────────────── */

function QuizBlockRenderer({ question, options, explanation }: QuizBlock) {
  const [selected, setSelected] = useState<string | null>(null);
  const [revealed, setRevealed] = useState(false);

  const handleSelect = (id: string) => {
    if (revealed) return;
    setSelected(id);
  };

  const handleReveal = () => {
    if (selected) setRevealed(true);
  };

  return (
    <div style={{
      backgroundColor: "#fff",
      border: "1px solid #eae5db",
      borderRadius: BLOCK_RADIUS,
      padding: BLOCK_PADDING,
      marginBottom: BLOCK_MB,
    }}>
      <div style={{ display: "flex", alignItems: "flex-start", gap: 10, marginBottom: 14 }}>
        <div style={{
          flexShrink: 0,
          width: 28, height: 28,
          borderRadius: "50%",
          backgroundColor: "#0E5C4C",
          color: "#fff",
          display: "flex", alignItems: "center", justifyContent: "center",
          fontSize: 12, fontWeight: 700, fontFamily: "var(--font-sans)",
        }}>
          ?
        </div>
        <p style={{ fontFamily: "var(--font-sans)", fontSize: "var(--text-base)", fontWeight: 500, color: "#1A1A1A", margin: 0, lineHeight: 1.5 }}>
          {question}
        </p>
      </div>

      <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
        {options.map((opt) => {
          const isSelected = selected === opt.id;
          const isCorrect = opt.correct;
          let bg = "#f8f6f0";
          let border = "#eae5db";
          let textColor = "#3d3d35";

          if (revealed && isCorrect) { bg = "rgba(14,92,76,0.1)"; border = "#0E5C4C"; textColor = "#0E5C4C"; }
          else if (revealed && isSelected && !isCorrect) { bg = "rgba(217,83,79,0.08)"; border = "#d9534f"; textColor = "#d9534f"; }
          else if (isSelected && !revealed) { bg = "rgba(14,92,76,0.06)"; border = "#0E5C4C"; }

          return (
            <button
              key={opt.id}
              onClick={() => handleSelect(opt.id)}
              style={{
                display: "block",
                width: "100%",
                textAlign: "left",
                padding: "10px 14px",
                backgroundColor: bg,
                border: `1px solid ${border}`,
                borderRadius: 8,
                cursor: revealed ? "default" : "pointer",
                fontSize: "var(--text-sm)",
                color: textColor,
                fontFamily: "var(--font-sans)",
                fontWeight: isSelected || (revealed && isCorrect) ? 600 : 400,
                transition: "all 0.15s",
              }}
            >
              {revealed && isCorrect ? "✓ " : revealed && isSelected && !isCorrect ? "✗ " : ""}
              {opt.text}
            </button>
          );
        })}
      </div>

      {!revealed && selected && (
        <button
          onClick={handleReveal}
          style={{
            marginTop: 12,
            padding: "9px 20px",
            backgroundColor: "#0E5C4C",
            color: "#fff",
            border: "none",
            borderRadius: 8,
            fontSize: "var(--text-sm)",
            fontWeight: 600,
            fontFamily: "var(--font-sans)",
            cursor: "pointer",
          }}
        >
          Check answer
        </button>
      )}

      {revealed && explanation && (
        <div style={{
          marginTop: 12,
          padding: "10px 14px",
          backgroundColor: "rgba(14,92,76,0.06)",
          borderRadius: 8,
          fontSize: "var(--text-sm)",
          color: "#0E5C4C",
          fontFamily: "var(--font-sans)",
          lineHeight: 1.6,
          borderLeft: "3px solid #0E5C4C",
        }}>
          <strong>Explanation: </strong>{explanation}
        </div>
      )}
    </div>
  );
}

/* ── Key Terms Block ────────────────────────────────────── */

function KeyTermsBlockRenderer({ heading, terms }: KeyTermsBlock) {
  const [expanded, setExpanded] = useState<number | null>(null);
  return (
    <div style={{
      backgroundColor: "#fff",
      border: "1px solid #eae5db",
      borderRadius: BLOCK_RADIUS,
      padding: BLOCK_PADDING,
      marginBottom: BLOCK_MB,
    }}>
      <h3 style={{ fontFamily: "var(--font-sans)", fontSize: "var(--text-sm)", fontWeight: 600, color: "#1A1A1A", marginBottom: 12 }}>
        {heading ?? "Key Terms"}
      </h3>
      <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
        {terms.map(({ term, definition }, i) => (
          <div key={i}>
            <button
              onClick={() => setExpanded(expanded === i ? null : i)}
              style={{
                display: "flex", justifyContent: "space-between", alignItems: "center",
                width: "100%", textAlign: "left",
                padding: "8px 12px",
                backgroundColor: expanded === i ? "rgba(14,92,76,0.06)" : "#f8f6f0",
                border: `1px solid ${expanded === i ? "rgba(14,92,76,0.2)" : "#eae5db"}`,
                borderRadius: expanded === i ? "8px 8px 0 0" : 8,
                cursor: "pointer",
              }}
            >
              <span style={{ fontSize: "var(--text-sm)", fontWeight: 600, color: "#1A1A1A", fontFamily: "var(--font-sans)" }}>
                {term}
              </span>
              <span style={{ fontSize: 12, color: "#0E5C4C" }}>{expanded === i ? "▲" : "▼"}</span>
            </button>
            {expanded === i && (
              <div style={{
                padding: "10px 12px",
                backgroundColor: "rgba(14,92,76,0.04)",
                border: "1px solid rgba(14,92,76,0.15)",
                borderTop: "none",
                borderRadius: "0 0 8px 8px",
                fontSize: "var(--text-sm)",
                color: "#3d3d35",
                fontFamily: "var(--font-sans)",
                lineHeight: 1.6,
              }}>
                {definition}
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}

/* ── Toggle Comparison Block ────────────────────────────── */

function ToggleComparisonBlockRenderer({ heading, optionA, optionB, note }: ToggleComparisonBlock) {
  const [active, setActive] = useState<"A" | "B">("A");
  const activeOption = active === "A" ? optionA : optionB;

  return (
    <div style={{
      backgroundColor: "#fff",
      border: "1px solid #eae5db",
      borderRadius: BLOCK_RADIUS,
      padding: BLOCK_PADDING,
      marginBottom: BLOCK_MB,
    }}>
      {heading && (
        <h3 style={{ fontFamily: "var(--font-sans)", fontSize: "var(--text-base)", fontWeight: 600, color: "#1A1A1A", marginBottom: 14 }}>
          {heading}
        </h3>
      )}
      <div style={{ display: "flex", backgroundColor: "#f8f6f0", borderRadius: 8, padding: 3, marginBottom: 16, gap: 2 }}>
        {[{ key: "A", label: optionA.label, tag: optionA.tag }, { key: "B", label: optionB.label, tag: optionB.tag }].map(({ key, label, tag }) => (
          <button
            key={key}
            onClick={() => setActive(key as "A" | "B")}
            style={{
              flex: 1, padding: "8px 12px",
              backgroundColor: active === key ? "#0E5C4C" : "transparent",
              color: active === key ? "#fff" : "#7a7a6e",
              border: "none", borderRadius: 6,
              fontSize: "var(--text-sm)", fontWeight: active === key ? 600 : 400,
              fontFamily: "var(--font-sans)", cursor: "pointer",
              transition: "all 0.15s",
            }}
          >
            {label}
            {tag && (
              <span style={{ marginLeft: 6, fontSize: 10, opacity: 0.8 }}>{tag}</span>
            )}
          </button>
        ))}
      </div>
      <ul style={{ listStyle: "none", padding: 0, margin: 0, display: "flex", flexDirection: "column", gap: 8 }}>
        {activeOption.content.map((item, i) => (
          <li key={i} style={{
            display: "flex", gap: 10,
            fontSize: "var(--text-sm)", color: "#3d3d35",
            fontFamily: "var(--font-sans)", lineHeight: 1.55,
          }}>
            <span style={{ color: "#0E5C4C", flexShrink: 0, fontWeight: 700 }}>→</span>
            {item}
          </li>
        ))}
      </ul>
      {note && (
        <p style={{ fontFamily: "var(--font-sans)", fontSize: "var(--text-xs)", color: "#7a7a6e", marginTop: 12, fontStyle: "italic" }}>
          {note}
        </p>
      )}
    </div>
  );
}

/* ── Chart Placeholder Block ─────────────────────────────── */

function ChartPlaceholderBlockRenderer({ title, subtitle }: ChartPlaceholderBlock) {
  return (
    <div style={{
      backgroundColor: "#f8f6f0",
      border: "1px dashed #e2dcd2",
      borderRadius: BLOCK_RADIUS,
      padding: BLOCK_PADDING,
      marginBottom: BLOCK_MB,
      textAlign: "center",
      color: "#7a7a6e",
      fontSize: "var(--text-sm)",
      fontFamily: "var(--font-sans)",
    }}>
      {title && <div style={{ fontWeight: 600, marginBottom: 4, color: "#3d3d35" }}>{title}</div>}
      {subtitle && <div style={{ marginBottom: 8 }}>{subtitle}</div>}
      <div>Chart placeholder</div>
    </div>
  );
}

/* ── Main Renderer ──────────────────────────────────────── */

interface BlockRendererProps {
  blocks: LessonBlock[];
  onTextSelect?: (text: string) => void;
}

export function BlockRenderer({ blocks, onTextSelect }: BlockRendererProps) {
  const handleMouseUp = () => {
    if (!onTextSelect) return;
    const selection = window.getSelection();
    const text = selection?.toString().trim();
    if (text && text.length > 2 && text.length < 200) {
      onTextSelect(text);
    }
  };

  return (
    <div onMouseUp={handleMouseUp}>
      {blocks.map((block, i) => (
        <BlockItem key={i} block={block} />
      ))}
    </div>
  );
}

function BlockItem({ block }: { block: LessonBlock }) {
  switch (block.type) {
    case "hero":                return <HeroBlockRenderer {...block} />;
    case "bullet-list":         return <BulletListBlockRenderer {...block} />;
    case "callout":             return <CalloutBlockRenderer {...block} />;
    case "chart":               return <WilburChart {...block} />;
    case "chart-placeholder":   return <ChartPlaceholderBlockRenderer {...block} />;
    case "comparison":         return <ComparisonBlockRenderer {...block} />;
    case "example":            return <ExampleBlockRenderer {...block} />;
    case "interactive-slider": return <InteractiveSliderBlockRenderer {...block} />;
    case "quiz":               return <QuizBlockRenderer {...block} />;
    case "key-terms":          return <KeyTermsBlockRenderer {...block} />;
    case "toggle-comparison":  return <ToggleComparisonBlockRenderer {...block} />;
    default:                   return null;
  }
}
