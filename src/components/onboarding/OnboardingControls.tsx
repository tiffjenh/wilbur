/**
 * Shared UI primitives for onboarding steps.
 * SingleSelect  — one option at a time (radio behaviour)
 * MultiSelect   — toggle any number of options (checkbox behaviour)
 * SliderSelect  — labelled track, renders options as a stepped slider
 * ConfidenceBar — 1–5 radio scale
 */
import React from "react";

/* ─── option card shared styles ─── */
const optionBase: React.CSSProperties = {
  display: "flex",
  alignItems: "center",
  gap: "12px",
  padding: "12px 16px",
  borderRadius: "var(--radius-md)",
  border: "1.5px solid var(--color-border-light)",
  backgroundColor: "var(--color-surface)",
  cursor: "pointer",
  fontSize: "var(--text-sm)",
  fontFamily: "var(--font-sans)",
  fontWeight: 500,
  color: "var(--color-text)",
  transition: "border-color var(--duration-fast), background-color var(--duration-fast)",
  textAlign: "left",
  width: "100%",
  lineHeight: 1.4,
};

const optionActive: React.CSSProperties = {
  borderColor: "var(--color-primary)",
  backgroundColor: "rgba(28, 63, 42, 0.05)",
};

/* ── check mark dot ── */
const RadioDot: React.FC<{ selected: boolean }> = ({ selected }) => (
  <span style={{
    width: "18px", height: "18px", borderRadius: "50%", flexShrink: 0,
    border: selected ? "5px solid var(--color-primary)" : "1.5px solid var(--color-border)",
    backgroundColor: "var(--color-surface)",
    transition: "border-color var(--duration-fast), border-width var(--duration-fast)",
  }} />
);

const CheckBox: React.FC<{ selected: boolean }> = ({ selected }) => (
  <span style={{
    width: "18px", height: "18px", borderRadius: "4px", flexShrink: 0,
    border: selected ? "none" : "1.5px solid var(--color-border)",
    backgroundColor: selected ? "var(--color-primary)" : "var(--color-surface)",
    display: "flex", alignItems: "center", justifyContent: "center",
    transition: "background-color var(--duration-fast)",
  }}>
    {selected && (
      <svg width="10" height="8" viewBox="0 0 10 8" fill="none">
        <path d="M1 4L3.8 7L9 1" stroke="white" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    )}
  </span>
);

/* ── SingleSelect ── */
interface SingleSelectProps<T extends string> {
  options: { value: T; label: string }[];
  value: T | undefined;
  onChange: (v: T) => void;
}
export function SingleSelect<T extends string>({ options, value, onChange }: SingleSelectProps<T>) {
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
      {options.map((opt) => {
        const sel = value === opt.value;
        return (
          <button
            key={opt.value}
            type="button"
            onClick={() => onChange(opt.value)}
            style={{ ...optionBase, ...(sel ? optionActive : {}) }}
          >
            <RadioDot selected={sel} />
            {opt.label}
          </button>
        );
      })}
    </div>
  );
}

/* ── MultiSelect ── */
interface MultiSelectProps<T extends string> {
  options: { value: T; label: string }[];
  value: T[];
  onChange: (v: T[]) => void;
  exclusive?: T; // if this value is selected, deselect others; and vice-versa
}
export function MultiSelect<T extends string>({ options, value, onChange, exclusive }: MultiSelectProps<T>) {
  const toggle = (v: T) => {
    if (exclusive) {
      if (v === exclusive) {
        // selecting exclusive clears everything else
        onChange([exclusive]);
        return;
      }
      // deselect exclusive if another is picked
      const without = value.filter((x) => x !== exclusive);
      if (without.includes(v)) onChange(without.filter((x) => x !== v));
      else onChange([...without, v]);
      return;
    }
    if (value.includes(v)) onChange(value.filter((x) => x !== v));
    else onChange([...value, v]);
  };

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
      {options.map((opt) => {
        const sel = value.includes(opt.value);
        return (
          <button
            key={opt.value}
            type="button"
            onClick={() => toggle(opt.value)}
            style={{ ...optionBase, ...(sel ? optionActive : {}) }}
          >
            <CheckBox selected={sel} />
            {opt.label}
          </button>
        );
      })}
    </div>
  );
}

/* ── SliderSelect — renders as a labelled HTML range input ── */
interface SliderSelectProps<T extends string> {
  options: { value: T; label: string }[];
  value: T | undefined;
  onChange: (v: T) => void;
}
export function SliderSelect<T extends string>({ options, value, onChange }: SliderSelectProps<T>) {
  const idx = value ? options.findIndex((o) => o.value === value) : 0;
  const displayLabel = value ? (options.find((o) => o.value === value)?.label ?? "") : options[0].label;

  return (
    <div>
      {/* Current selection label */}
      <div style={{
        textAlign: "center", marginBottom: "14px",
        fontSize: "var(--text-md)", fontWeight: 600, color: "var(--color-text)",
        minHeight: "24px",
        transition: "opacity var(--duration-fast)",
      }}>
        {displayLabel}
      </div>

      {/* Range slider */}
      <input
        type="range"
        min={0}
        max={options.length - 1}
        step={1}
        value={idx === -1 ? 0 : idx}
        onChange={(e) => onChange(options[parseInt(e.target.value)].value)}
        style={{ width: "100%", accentColor: "var(--color-primary)", cursor: "pointer", height: "6px" }}
      />

      {/* Tick labels */}
      <div style={{ display: "flex", justifyContent: "space-between", marginTop: "8px" }}>
        {options.map((opt) => (
          <span
            key={opt.value}
            style={{
              fontSize: "10px",
              color: value === opt.value ? "var(--color-primary)" : "var(--color-text-muted)",
              fontWeight: value === opt.value ? 700 : 400,
              fontFamily: "var(--font-sans)",
              letterSpacing: "-0.01em",
              transition: "color var(--duration-fast)",
              textAlign: "center",
              maxWidth: `${100 / options.length}%`,
              wordBreak: "break-word",
              lineHeight: 1.3,
            }}
          >
            {opt.label}
          </span>
        ))}
      </div>
    </div>
  );
}

/* ── ConfidenceBar — 1–5 radio scale ── */
interface ConfidenceBarProps {
  value: number | undefined;
  onChange: (v: number) => void;
  lowLabel?: string;
  highLabel?: string;
}
export const ConfidenceBar: React.FC<ConfidenceBarProps> = ({
  value, onChange, lowLabel = "I feel lost", highLabel = "Very confident",
}) => (
  <div>
    <div style={{ display: "flex", gap: "10px", justifyContent: "center", marginBottom: "10px" }}>
      {[1, 2, 3, 4, 5].map((n) => {
        const sel = value === n;
        return (
          <button
            key={n}
            type="button"
            onClick={() => onChange(n)}
            style={{
              width: "52px", height: "52px", borderRadius: "var(--radius-md)",
              border: sel ? "2px solid var(--color-primary)" : "1.5px solid var(--color-border-light)",
              backgroundColor: sel ? "var(--color-primary)" : "var(--color-surface)",
              color: sel ? "#fff" : "var(--color-text)",
              fontSize: "var(--text-lg)", fontWeight: 700, fontFamily: "var(--font-sans)",
              cursor: "pointer",
              transition: "border-color var(--duration-fast), background-color var(--duration-fast), color var(--duration-fast)",
            }}
          >
            {n}
          </button>
        );
      })}
    </div>
    <div style={{ display: "flex", justifyContent: "space-between" }}>
      <span style={{ fontSize: "var(--text-xs)", color: "var(--color-text-muted)" }}>{lowLabel}</span>
      <span style={{ fontSize: "var(--text-xs)", color: "var(--color-text-muted)" }}>{highLabel}</span>
    </div>
  </div>
);

/* ── Question wrapper ── */
interface QuestionProps {
  number: number;
  label: string;
  helper?: string;
  children: React.ReactNode;
}
export const Question: React.FC<QuestionProps> = ({ number, label, helper, children }) => (
  <div style={{ marginBottom: "32px" }}>
    <div style={{ marginBottom: "14px" }}>
      <div style={{ fontSize: "var(--text-xs)", fontWeight: 700, color: "var(--color-primary)", letterSpacing: "0.08em", textTransform: "uppercase", marginBottom: "4px", fontFamily: "var(--font-sans)" }}>
        Question {number}
      </div>
      <div style={{ fontFamily: "var(--font-serif)", fontSize: "var(--text-lg)", fontWeight: 600, color: "var(--color-text)", lineHeight: 1.3 }}>
        {label}
      </div>
      {helper && (
        <div style={{ fontSize: "var(--text-xs)", color: "var(--color-text-muted)", marginTop: "4px", lineHeight: 1.5 }}>
          {helper}
        </div>
      )}
    </div>
    {children}
  </div>
);
