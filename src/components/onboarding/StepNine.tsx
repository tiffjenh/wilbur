/**
 * Step 9: State of residence (optional).
 * Search bar with autocomplete over all 50 US states + DC + "Prefer not to say".
 */
import React, { useState, useRef, useEffect } from "react";
import type { OnboardingData } from "@/lib/onboardingSchema";
import type { StateProfile } from "@/content/stateData";
import { Question } from "./OnboardingControls";
import { STATE_OPTIONS, getStateProfile } from "@/content/stateData";
import { Icon } from "@/components/ui/Icon";

interface StepNineProps {
  data: Partial<OnboardingData>;
  onChange: (patch: Partial<OnboardingData>) => void;
}

function matchState(query: string, state: StateProfile): boolean {
  const q = query.trim().toLowerCase();
  if (!q) return true;
  return (
    state.stateName.toLowerCase().includes(q) ||
    state.stateCode.toLowerCase().includes(q)
  );
}

/** Step 9: Q13 — State of residence (search + suggestions) */
export const StepNine: React.FC<StepNineProps> = ({ data, onChange }) => {
  const [query, setQuery] = useState("");
  const [isFocused, setIsFocused] = useState(false);
  const [highlightIndex, setHighlightIndex] = useState(-1);
  const inputRef = useRef<HTMLInputElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const listRef = useRef<HTMLDivElement>(null);

  const selected = data.stateCode;
  const stateProfile = selected && selected !== "prefer_not" ? getStateProfile(selected) : null;

  const showPreferNot = query.trim() === "" || "prefer not to say".includes(query.trim().toLowerCase());
  const filteredStates = query.trim() === ""
    ? STATE_OPTIONS
    : STATE_OPTIONS.filter((s) => matchState(query, s));

  const suggestions = showPreferNot
    ? [{ type: "prefer_not" as const }, ...filteredStates.map((s) => ({ type: "state" as const, state: s }))]
    : filteredStates.map((s) => ({ type: "state" as const, state: s }));

  const showList = isFocused && suggestions.length > 0;

  const displayLabel = selected === "prefer_not"
    ? "Prefer not to say"
    : stateProfile
    ? `${stateProfile.stateName} (${selected})`
    : "";

  const handleSelectCode = (code: string) => {
    onChange({ stateCode: code as OnboardingData["stateCode"] });
    setQuery("");
    setIsFocused(false);
    setHighlightIndex(-1);
  };

  const handleClear = () => {
    onChange({ stateCode: undefined });
    setQuery("");
    setHighlightIndex(-1);
    setIsFocused(true);
    inputRef.current?.focus();
  };

  const handleSelectPreferNot = () => {
    handleSelectCode("prefer_not");
  };

  const handleSelectState = (state: StateProfile) => {
    handleSelectCode(state.stateCode);
  };

  useEffect(() => {
    if (!showList) setHighlightIndex(-1);
  }, [showList, query]);

  useEffect(() => {
    if (highlightIndex < 0 || highlightIndex >= suggestions.length) return;
    listRef.current?.children[highlightIndex]?.scrollIntoView({ block: "nearest" });
  }, [highlightIndex, suggestions.length]);

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (!showList) {
      if (e.key === "Escape") setIsFocused(false);
      return;
    }
    if (e.key === "ArrowDown") {
      e.preventDefault();
      setHighlightIndex((i) => (i < suggestions.length - 1 ? i + 1 : i));
      return;
    }
    if (e.key === "ArrowUp") {
      e.preventDefault();
      setHighlightIndex((i) => (i > 0 ? i - 1 : -1));
      return;
    }
    if (e.key === "Enter" && highlightIndex >= 0 && highlightIndex < suggestions.length) {
      e.preventDefault();
      const item = suggestions[highlightIndex];
      if (item.type === "prefer_not") handleSelectPreferNot();
      else handleSelectState(item.state);
      return;
    }
    if (e.key === "Escape") {
      setIsFocused(false);
      setHighlightIndex(-1);
    }
  };

  const hasSelection = Boolean(selected);
  const inputValue =
    hasSelection && (query === "" || !isFocused)
      ? displayLabel
      : query;

  return (
    <Question
      number={13}
      label="What state do you live in?"
      helper="We use this to personalize tax content for your state. Totally optional."
    >
      <div ref={containerRef} style={{ position: "relative", maxWidth: 480, margin: "0 auto" }}>
        {/* Wrapper so input + clear button keep stable size */}
        <div
          style={{
            position: "relative",
            minHeight: 48,
            backgroundColor: hasSelection && !isFocused ? "rgba(14,92,76,0.05)" : "#fff",
            border: `1.5px solid ${showList || (hasSelection && !isFocused) ? "#0E5C4C" : "#e2dcd2"}`,
            borderRadius: 10,
            display: "flex",
            alignItems: "center",
          }}
        >
          <input
            ref={inputRef}
            type="text"
            value={inputValue}
            onChange={(e) => setQuery(e.target.value)}
            onFocus={() => setIsFocused(true)}
            onBlur={() => setTimeout(() => setIsFocused(false), 150)}
            onKeyDown={handleKeyDown}
            placeholder="Search by state name or abbreviation..."
            autoComplete="off"
            style={{
              flex: 1,
              minWidth: 0,
              height: 46,
              padding: "0 16px",
              paddingRight: hasSelection ? 44 : 16,
              border: "none",
              background: "none",
              outline: "none",
              fontFamily: "var(--font-sans)",
              fontSize: "var(--text-base)",
              color: hasSelection && !isFocused ? "#0E5C4C" : "#3d3d35",
              fontWeight: hasSelection && !isFocused ? 600 : 400,
            }}
          />
          {hasSelection && (
            <button
              type="button"
              onClick={handleClear}
              aria-label="Clear state and search again"
              style={{
                position: "absolute",
                right: 8,
                top: "50%",
                transform: "translateY(-50%)",
                width: 32,
                height: 32,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                padding: 0,
                border: "none",
                borderRadius: 6,
                backgroundColor: "transparent",
                color: "var(--color-text-muted)",
                cursor: "pointer",
              }}
              onMouseDown={(e) => e.preventDefault()}
            >
              <Icon name="x" size={16} strokeWidth={2} />
            </button>
          )}
        </div>

        {/* Suggestions list */}
        {showList && (
          <div
            ref={listRef}
            style={{
              position: "absolute",
              top: "calc(100% + 4px)",
              left: 0,
              right: 0,
              zIndex: 200,
              backgroundColor: "#fff",
              border: "1.5px solid #e2dcd2",
              borderRadius: 10,
              boxShadow: "0 8px 28px rgba(26,20,10,0.12)",
              maxHeight: 280,
              overflowY: "auto",
            }}
          >
            {suggestions.map((item, index) => {
              const isHighlighted = index === highlightIndex;
              if (item.type === "prefer_not") {
                return (
                  <button
                    key="prefer_not"
                    type="button"
                    onMouseDown={(e) => { e.preventDefault(); handleSelectPreferNot(); }}
                    style={{
                      display: "block",
                      width: "100%",
                      textAlign: "left",
                      padding: "10px 16px",
                      backgroundColor: selected === "prefer_not" || isHighlighted ? "rgba(14,92,76,0.06)" : "transparent",
                      border: "none",
                      borderBottom: "1px solid #f0ece4",
                      cursor: "pointer",
                      fontFamily: "var(--font-sans)",
                      fontSize: "var(--text-sm)",
                      color: selected === "prefer_not" || isHighlighted ? "#0E5C4C" : "#7a7a6e",
                      fontStyle: "italic",
                    }}
                  >
                    Prefer not to say
                  </button>
                );
              }
              const state = item.state;
              return (
                <button
                  key={state.stateCode}
                  type="button"
                  onMouseDown={(e) => { e.preventDefault(); handleSelectState(state); }}
                  style={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "space-between",
                    width: "100%",
                    textAlign: "left",
                    padding: "9px 16px",
                    backgroundColor: selected === state.stateCode || isHighlighted ? "rgba(14,92,76,0.06)" : "transparent",
                    border: "none",
                    borderBottom: "1px solid #f0ece4",
                    cursor: "pointer",
                    fontFamily: "var(--font-sans)",
                    fontSize: "var(--text-sm)",
                    color: selected === state.stateCode || isHighlighted ? "#0E5C4C" : "#3d3d35",
                    fontWeight: selected === state.stateCode || isHighlighted ? 600 : 400,
                  }}
                >
                  <span>{state.stateName}</span>
                  <span style={{ fontSize: 11, color: "#b0ab9e" }}>{state.stateCode}</span>
                </button>
              );
            })}
          </div>
        )}

        {/* State info callout after selection */}
        {stateProfile && !isFocused && (
          <div style={{
            marginTop: 12,
            padding: "10px 14px",
            backgroundColor: stateProfile.hasStateIncomeTax
              ? "rgba(14,92,76,0.06)"
              : "rgba(255,214,176,0.3)",
            border: `1px solid ${stateProfile.hasStateIncomeTax ? "rgba(14,92,76,0.2)" : "rgba(255,150,100,0.3)"}`,
            borderRadius: 8,
            fontSize: "var(--text-sm)",
            fontFamily: "var(--font-sans)",
            color: "#3d3d35",
            lineHeight: 1.5,
          }}>
            {stateProfile.hasStateIncomeTax ? (
              <>
                <strong>{stateProfile.stateName}</strong> has a state income tax.
                We'll include relevant state tax lessons in your path.
                {stateProfile.notes && ` ${stateProfile.notes}`}
              </>
            ) : (
              <>
                <strong>{stateProfile.stateName}</strong> has <strong>no state income tax</strong> — great news!
                {stateProfile.notes && ` ${stateProfile.notes}.`}
                {" "}Your tax lessons will focus on federal taxes.
              </>
            )}
          </div>
        )}
      </div>
    </Question>
  );
};
