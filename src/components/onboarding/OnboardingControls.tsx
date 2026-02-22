/**
 * Shared UI primitives for onboarding steps.
 * SingleSelect  — one option at a time (radio behaviour)
 * MultiSelect   — toggle any number of options (checkbox behaviour)
 * SliderSelect  — labelled track, renders options as a stepped slider
 * ConfidenceBar — 1–5 radio scale
 */
import React from "react";

/* ─── option card shared styles (multi-select) ─── */
const optionBase: React.CSSProperties = {
  display: "flex",
  alignItems: "center",
  gap: "12px",
  padding: "12px 16px",
  borderRadius: "var(--radius-md)",
  border: "2px solid var(--color-black)",
  backgroundColor: "var(--color-bg)",
  cursor: "pointer",
  fontSize: "var(--text-sm)",
  fontFamily: "var(--font-sans)",
  fontWeight: 500,
  color: "var(--color-text)",
  transition: "border-color var(--duration-fast), background-color var(--duration-fast), color var(--duration-fast)",
  textAlign: "left",
  width: "100%",
  lineHeight: 1.4,
  boxShadow: "none",
};

const optionActive: React.CSSProperties = {
  borderColor: "var(--color-primary)",
  backgroundColor: "var(--color-primary)",
  color: "var(--color-beige)",
  border: "2px solid var(--color-primary)",
};

/* ── check mark dot ── */
const RadioDot: React.FC<{ selected: boolean }> = ({ selected }) => (
  <span style={{
    width: "18px", height: "18px", borderRadius: "50%", flexShrink: 0,
    border: selected ? "5px solid var(--color-primary)" : "2px solid var(--color-black)",
    backgroundColor: selected ? "var(--color-primary)" : "transparent",
    transition: "border-color var(--duration-fast), border-width var(--duration-fast), background-color var(--duration-fast)",
  }} />
);

const CheckBox: React.FC<{ selected: boolean }> = ({ selected }) => (
  <span style={{
    width: "18px", height: "18px", borderRadius: "4px", flexShrink: 0,
    border: selected ? "none" : "2px solid var(--color-black)",
    backgroundColor: selected ? "var(--color-primary)" : "transparent",
    display: "flex", alignItems: "center", justifyContent: "center",
    transition: "background-color var(--duration-fast), border-color var(--duration-fast)",
  }}>
    {selected && (
      <svg width="10" height="8" viewBox="0 0 10 8" fill="none">
        <path d="M1 4L3.8 7L9 1" stroke="var(--color-beige)" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
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

/* ── MultiSelect ── 2-column grid; 6 = 2×3, 5 = 3 top + 2 bottom centered ── */
interface MultiSelectProps<T extends string> {
  options: { value: T; label: string }[];
  value: T[];
  onChange: (v: T[]) => void;
  exclusive?: T; // if this value is selected, deselect others; and vice-versa
  compact?: boolean; // smaller padding for short labels (e.g. Q7, Q8)
}
export function MultiSelect<T extends string>({ options, value, onChange, exclusive, compact }: MultiSelectProps<T>) {
  const toggle = (v: T) => {
    if (exclusive) {
      if (v === exclusive) {
        onChange([exclusive]);
        return;
      }
      const without = value.filter((x) => x !== exclusive);
      if (without.includes(v)) onChange(without.filter((x) => x !== v));
      else onChange([...without, v]);
      return;
    }
    if (value.includes(v)) onChange(value.filter((x) => x !== v));
    else onChange([...value, v]);
  };

  const n = options.length;
  const isFive = n === 5;
  /* 6 choices → 2 columns × 3 rows; 5 → 3 top + 2 bottom centered */
  const gridStyle: React.CSSProperties = {
    display: "grid",
    gridTemplateColumns: "repeat(2, 1fr)",
    gap: "14px",
  };
  const gridStyleFive: React.CSSProperties = isFive
    ? { display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: "14px" }
    : gridStyle;

  const renderOption = (opt: { value: T; label: string }) => {
    const sel = value.includes(opt.value);
    const style = {
      ...optionBase,
      ...(sel ? optionActive : {}),
      ...(compact ? { padding: "8px 12px" } : {}),
    };
    return (
      <button
        key={opt.value}
        type="button"
        onClick={() => toggle(opt.value)}
        style={style}
      >
        <CheckBox selected={sel} />
        {opt.label}
      </button>
    );
  };

  if (isFive) {
    const [topThree, bottomTwo] = [options.slice(0, 3), options.slice(3, 5)];
    return (
      <div style={gridStyleFive}>
        {topThree.map(renderOption)}
        <div
          style={{
            gridColumn: "1 / -1",
            display: "flex",
            justifyContent: "center",
            gap: "14px",
          }}
        >
          {bottomTwo.map(renderOption)}
        </div>
      </div>
    );
  }

  return <div style={gridStyle}>{options.map(renderOption)}</div>;
}

/* ── SegmentedControl — horizontal segments, one selected (replaces sliders) ── */
interface SegmentedOption<T extends string> {
  value: T;
  label: string;
  sublabel?: string;
}
interface SegmentedControlProps<T extends string> {
  options: SegmentedOption<T>[];
  value: T | undefined;
  onChange: (v: T) => void;
}
export function SegmentedControl<T extends string>({ options, value, onChange }: SegmentedControlProps<T>) {
  const effectiveValue = value ?? options[0]?.value;

  return (
    <div
      role="group"
      aria-label="Select one option"
      style={{
        width: "100%",
        display: "flex",
        flexWrap: "wrap",
        gap: "6px",
        borderRadius: "var(--radius-lg)",
        padding: "0",
        backgroundColor: "transparent",
        justifyContent: "flex-start",
      }}
    >
      {options.map((opt) => {
        const sel = effectiveValue === opt.value;
        return (
          <button
            key={opt.value}
            type="button"
            role="radio"
            aria-checked={sel}
            onClick={() => onChange(opt.value)}
            style={{
              flex: "1 1 0",
              minWidth: "60px",
              padding: "10px 12px",
              borderRadius: "var(--radius-md)",
              border: "2px solid " + (sel ? "var(--color-primary)" : "var(--color-black)"),
              backgroundColor: sel ? "var(--color-primary)" : "var(--color-bg)",
              color: sel ? "var(--color-beige)" : "var(--color-text)",
              fontFamily: "var(--font-sans)",
              fontSize: "var(--text-sm)",
              fontWeight: sel ? 600 : 500,
              cursor: "pointer",
              transition: "background-color var(--duration-fast), color var(--duration-fast), border-color var(--duration-fast)",
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              justifyContent: "center",
              gap: "2px",
            }}
            onKeyDown={(e) => {
              if (e.key === "Enter" || e.key === " ") {
                e.preventDefault();
                onChange(opt.value);
              }
            }}
          >
            <span>{opt.label}</span>
            {opt.sublabel && (
              <span style={{ fontSize: "var(--text-xs)", color: "var(--color-text-muted)", fontWeight: 400 }}>
                {opt.sublabel}
              </span>
            )}
          </button>
        );
      })}
    </div>
  );
}

/* ── Hand-drawn doodle icons (monochrome, minimal) for platform cards — exported for StepOne ── */
export const IconInSchool: React.FC<{ size?: number }> = ({ size = 28 }) => (
  <svg width={size} height={size} viewBox="0 0 28 28" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" style={{ opacity: 0.9 }}>
    <path d="M14 4v20M8 10l6-4 6 4M10 14h8M10 18h8" />
    <path d="M6 24V12l8 4 8-4v12" />
  </svg>
);
export const IconWorking: React.FC<{ size?: number }> = ({ size = 28 }) => (
  <svg width={size} height={size} viewBox="0 0 28 28" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" style={{ opacity: 0.9 }}>
    <rect x="4" y="6" width="20" height="14" rx="1.5" />
    <path d="M4 11h20M10 6V4M18 6V4" />
    <path d="M10 16h2M16 16h2" />
  </svg>
);
export const IconBoth: React.FC<{ size?: number }> = ({ size = 28 }) => (
  <svg width={size} height={size} viewBox="0 0 28 28" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" style={{ opacity: 0.9 }}>
    <path d="M8 14h12M14 8v12" />
    <circle cx="14" cy="14" r="8" />
  </svg>
);
export const IconNeither: React.FC<{ size?: number }> = ({ size = 28 }) => (
  <svg width={size} height={size} viewBox="0 0 28 28" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" style={{ opacity: 0.9 }}>
    <circle cx="14" cy="14" r="8" />
    <path d="M10 10l8 8M18 10l-8 8" />
  </svg>
);

/* ── Income type icons (Q3) ── */
export const Icon1099: React.FC<{ size?: number }> = ({ size = 28 }) => (
  <svg width={size} height={size} viewBox="0 0 28 28" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" style={{ opacity: 0.9 }}>
    <rect x="5" y="4" width="18" height="20" rx="1.5" />
    <path d="M9 9h10M9 14h6M9 19h4" />
  </svg>
);
export const IconW2: React.FC<{ size?: number }> = ({ size = 28 }) => (
  <svg width={size} height={size} viewBox="0 0 28 28" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" style={{ opacity: 0.9 }}>
    <rect x="4" y="6" width="20" height="14" rx="1.5" />
    <path d="M4 11h20M10 6V4M18 6V4M10 16h2M16 16h2" />
  </svg>
);
export const IconNoIncome: React.FC<{ size?: number }> = ({ size = 28 }) => (
  <svg width={size} height={size} viewBox="0 0 28 28" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" style={{ opacity: 0.9 }}>
    <circle cx="14" cy="14" r="8" />
    <path d="M10 10l8 8M18 10l-8 8" />
  </svg>
);

/* ── Investing exp icons (Q11) ── */
export const IconNever: React.FC<{ size?: number }> = ({ size = 28 }) => (
  <svg width={size} height={size} viewBox="0 0 28 28" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" style={{ opacity: 0.9 }}>
    <circle cx="14" cy="14" r="8" />
    <path d="M10 10l8 8M18 10l-8 8" />
  </svg>
);
export const IconALittle: React.FC<{ size?: number }> = ({ size = 28 }) => (
  <svg width={size} height={size} viewBox="0 0 28 28" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" style={{ opacity: 0.9 }}>
    <path d="M8 18V10M14 18v-4M20 18v-8" />
    <path d="M6 20h16" />
  </svg>
);
export const IconYesRegularly: React.FC<{ size?: number }> = ({ size = 28 }) => (
  <svg width={size} height={size} viewBox="0 0 28 28" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" style={{ opacity: 0.9 }}>
    <path d="M6 18l5-5 5 4 6-10" />
    <path d="M6 20h16" />
  </svg>
);

/* ── PlatformCard (single select) — card grid, no outer border; selected = dark green + beige text ── */
interface PlatformCardOption<T extends string> {
  value: T;
  label: string;
  icon?: React.ReactNode;
}
interface PlatformCardsProps<T extends string> {
  options: PlatformCardOption<T>[];
  value: T | undefined;
  onChange: (v: T) => void;
  compact?: boolean; // smaller padding for short labels (e.g. Q8)
  /** Center the card group horizontally (e.g. for 3 options like Q11) */
  center?: boolean;
}
export function PlatformCards<T extends string>({ options, value, onChange, compact, center }: PlatformCardsProps<T>) {
  const containerStyle: React.CSSProperties = center
    ? { display: "flex", flexWrap: "wrap", justifyContent: "center", gap: "12px" }
    : { display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(100px, 1fr))", gap: "12px" };
  return (
    <div
      role="radiogroup"
      aria-label="Choose one option"
      style={containerStyle}
    >
      {options.map((opt) => {
        const sel = value === opt.value;
        return (
          <button
            key={opt.value}
            type="button"
            role="radio"
            aria-checked={sel}
            onClick={() => onChange(opt.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter" || e.key === " ") {
                e.preventDefault();
                onChange(opt.value);
              }
            }}
            style={{
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              justifyContent: "center",
              padding: compact ? "10px 12px" : "16px 12px",
              minHeight: compact ? 72 : 88,
              ...(center ? { minWidth: 100 } : {}),
              borderRadius: "var(--radius-lg)",
              border: sel ? "2px solid var(--color-primary)" : "2px solid var(--color-black)",
              backgroundColor: sel ? "var(--color-primary)" : "var(--color-bg)",
              color: sel ? "var(--color-beige)" : "var(--color-text)",
              fontFamily: "var(--font-sans)",
              fontSize: "var(--text-sm)",
              fontWeight: sel ? 600 : 500,
              cursor: "pointer",
              transition: "border-color var(--duration-fast), background-color var(--duration-fast), color var(--duration-fast)",
              boxShadow: "none",
            }}
          >
            {opt.icon != null ? (
              <span style={{ marginBottom: compact ? "4px" : "8px", display: "flex", alignItems: "center", justifyContent: "center", color: "inherit" }}>
                {opt.icon}
              </span>
            ) : (
              <span
                style={{
                  width: compact ? "32px" : "40px",
                  height: compact ? "32px" : "40px",
                  borderRadius: "50%",
                  backgroundColor: "var(--color-surface-hover)",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  marginBottom: compact ? "4px" : "8px",
                  fontSize: "var(--text-md)",
                  fontWeight: 600,
                  color: "var(--color-text-muted)",
                }}
              >
                {opt.label.charAt(0)}
              </span>
            )}
            <span style={{ textAlign: "center", lineHeight: 1.3 }}>{opt.label}</span>
          </button>
        );
      })}
    </div>
  );
}

/* ── DiscreteSlider — condensed; dot directly above each label; pill centered ── */
const SLIDER_MAX_WIDTH = 480; // same visual length as card choice rows

interface DiscreteSliderOption<T extends string> {
  value: T;
  label: string;
}
interface DiscreteSliderProps<T extends string> {
  options: DiscreteSliderOption<T>[];
  value: T | undefined;
  onChange: (v: T) => void;
  showSelectedAbove?: boolean;
}
export function DiscreteSlider<T extends string>({
  options,
  value,
  onChange,
  showSelectedAbove = true,
}: DiscreteSliderProps<T>) {
  const n = options.length;
  const idx = value !== undefined && value !== null
    ? options.findIndex((o) => o.value === value)
    : 0;
  const safeIdx = idx >= 0 ? idx : 0;
  const trackRef = React.useRef<HTMLDivElement>(null);

  const handleTrackClick = (e: React.MouseEvent<HTMLDivElement>) => {
    const el = trackRef.current;
    if (!el || n <= 0) return;
    const rect = el.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const pct = Math.max(0, Math.min(1, x / rect.width));
    const index = n === 1 ? 0 : Math.min(n - 1, Math.floor(pct * n));
    const opt = options[index];
    if (opt) onChange(opt.value);
  };

  // Thumb at center of selected column: (safeIdx + 0.5) / n * 100
  const thumbCenterPct = n > 0 ? ((safeIdx + 0.5) / n) * 100 : 0;

  return (
    <div style={{ width: "100%", maxWidth: SLIDER_MAX_WIDTH, margin: "0 auto" }}>
      {showSelectedAbove && options[safeIdx] && (
        <div
          style={{
            marginBottom: "12px",
            display: "flex",
            justifyContent: "center",
          }}
        >
          <span
            style={{
              display: "inline-block",
              padding: "8px 14px",
              borderRadius: "var(--radius-md)",
              border: "2px solid var(--color-primary)",
              backgroundColor: "var(--color-surface-hover)",
              color: "var(--color-primary)",
              fontFamily: "var(--font-sans)",
              fontSize: "var(--text-sm)",
              fontWeight: 600,
            }}
          >
            {options[safeIdx].label}
          </span>
        </div>
      )}
      {/* Track + thumb — click maps to column */}
      <div
        ref={trackRef}
        role="slider"
        aria-valuenow={safeIdx}
        aria-valuemin={0}
        aria-valuemax={n - 1}
        aria-label="Select value"
        tabIndex={0}
        onClick={handleTrackClick}
        onKeyDown={(e) => {
          if (e.key === "ArrowLeft" && safeIdx > 0) {
            e.preventDefault();
            onChange(options[safeIdx - 1].value);
          } else if (e.key === "ArrowRight" && safeIdx < n - 1) {
            e.preventDefault();
            onChange(options[safeIdx + 1].value);
          }
        }}
        style={{
          position: "relative",
          width: "100%",
          height: "10px",
          borderRadius: "var(--radius-full)",
          backgroundColor: "var(--color-border-light)",
          cursor: "pointer",
          marginBottom: "8px",
        }}
      >
        <div
          style={{
            position: "absolute",
            left: `${thumbCenterPct}%`,
            top: "50%",
            transform: "translate(-50%, -50%)",
            width: "20px",
            height: "20px",
            borderRadius: "50%",
            backgroundColor: "var(--color-primary)",
            pointerEvents: "none",
          }}
        />
      </div>
      {/* One column per option: tick centered above label centered (dot right above choice description) */}
      <div style={{ display: "flex", width: "100%" }}>
        {options.map((opt, i) => (
          <div
            key={opt.value}
            style={{
              flex: "1 1 0",
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              minWidth: 0,
            }}
          >
            <div
              style={{
                width: "8px",
                height: "8px",
                borderRadius: "50%",
                backgroundColor: i === safeIdx ? "var(--color-primary)" : "var(--color-border-light)",
                marginBottom: "4px",
              }}
            />
            <span
              style={{
                fontFamily: "var(--font-sans)",
                fontSize: "var(--text-xs)",
                color: i === safeIdx ? "var(--color-primary)" : "var(--color-text)",
                fontWeight: i === safeIdx ? 600 : 500,
                textAlign: "center",
              }}
            >
              {opt.label}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}

/* ── SliderSelect — uses DiscreteSlider ── */
interface SliderSelectProps<T extends string> {
  options: { value: T; label: string }[];
  value: T | undefined;
  onChange: (v: T) => void;
}
export function SliderSelect<T extends string>({ options, value, onChange }: SliderSelectProps<T>) {
  const effectiveValue = value ?? options[0]?.value;
  return (
    <DiscreteSlider
      options={options}
      value={effectiveValue}
      onChange={onChange}
      showSelectedAbove={true}
    />
  );
}

/* ── ConfidenceBar — 1–5 slider with endpoint labels ── */
const CONFIDENCE_OPTIONS = [1, 2, 3, 4, 5].map((n) => ({ value: String(n) as "1" | "2" | "3" | "4" | "5", label: String(n) }));
interface ConfidenceBarProps {
  value: number | undefined;
  onChange: (v: number) => void;
  lowLabel?: string;
  highLabel?: string;
}
export const ConfidenceBar: React.FC<ConfidenceBarProps> = ({
  value, onChange, lowLabel = "I feel lost", highLabel = "Very confident",
}) => {
  const numValue = value ?? 1;
  const strValue = String(numValue) as "1" | "2" | "3" | "4" | "5";
  return (
    <div style={{ width: "100%" }}>
      <DiscreteSlider
        options={CONFIDENCE_OPTIONS}
        value={strValue}
        onChange={(v) => onChange(Number(v) as 1 | 2 | 3 | 4 | 5)}
        showSelectedAbove={false}
      />
      <div style={{ display: "flex", justifyContent: "space-between", marginTop: "6px", paddingLeft: "0", paddingRight: "0" }}>
        <span style={{ fontSize: "var(--text-xs)", color: "var(--color-text-muted)" }}>{lowLabel}</span>
        <span style={{ fontSize: "var(--text-xs)", color: "var(--color-text-muted)" }}>{highLabel}</span>
      </div>
    </div>
  );
};

/* ── Question wrapper: numbered icon (light green circle + dark green number), centered choices, thin grey border ── */
const QUESTION_CHOICE_MAX_WIDTH = 480;
const QUESTION_BOTTOM_MARGIN_DEFAULT = 56;
interface QuestionProps {
  number: number;
  label: string;
  helper?: string;
  children: React.ReactNode;
}
export const Question: React.FC<QuestionProps> = ({ number, label, helper, children }) => (
  <div
    style={{
      marginBottom: `${QUESTION_BOTTOM_MARGIN_DEFAULT}px`,
      display: "flex",
      flexDirection: "column",
      alignItems: "center",
      width: "100%",
      padding: "20px 20px 24px",
      border: "1px solid var(--color-border)",
      borderRadius: "var(--radius-lg)",
      backgroundColor: "var(--color-bg)",
    }}
  >
    <div style={{ width: "100%", maxWidth: QUESTION_CHOICE_MAX_WIDTH, marginBottom: "12px" }}>
      {/* Numbered icon and question label on same line */}
      <div style={{ display: "flex", alignItems: "center", gap: "10px", flexWrap: "wrap" }}>
        <div
          style={{
            width: "28px",
            height: "28px",
            borderRadius: "50%",
            backgroundColor: "var(--color-accent-light)",
            display: "inline-flex",
            alignItems: "center",
            justifyContent: "center",
            flexShrink: 0,
          }}
        >
          <span
            style={{
              fontFamily: "var(--font-sans)",
              fontSize: "var(--text-sm)",
              fontWeight: 700,
              color: "var(--color-primary)",
            }}
          >
            {number}
          </span>
        </div>
        <div style={{ fontFamily: "var(--font-serif)", fontSize: "var(--text-lg)", fontWeight: 600, color: "var(--color-text)", lineHeight: 1.3 }}>
          {label}
        </div>
      </div>
      {helper && (
        <div style={{ fontSize: "var(--text-xs)", color: "var(--color-text-muted)", marginTop: "4px", lineHeight: 1.5 }}>
          {helper}
        </div>
      )}
    </div>
    {/* Choices centered and same width as slider */}
    <div style={{ width: "100%", maxWidth: QUESTION_CHOICE_MAX_WIDTH, display: "flex", flexDirection: "column", alignItems: "stretch" }}>
      {children}
    </div>
  </div>
);
