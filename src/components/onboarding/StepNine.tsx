/**
 * Step 9: State of residence (optional).
 * Dropdown with all 50 US states + DC + "Prefer not to say".
 * Used to personalize state income tax lessons.
 */
import React, { useState } from "react";
import type { OnboardingData } from "@/lib/onboardingSchema";
import { Question } from "./OnboardingControls";
import { STATE_OPTIONS } from "@/content/stateData";
import { getStateProfile } from "@/content/stateData";

interface StepNineProps {
  data: Partial<OnboardingData>;
  onChange: (patch: Partial<OnboardingData>) => void;
}

/** Step 9: Q13 — State of residence */
export const StepNine: React.FC<StepNineProps> = ({ data, onChange }) => {
  const [isOpen, setIsOpen] = useState(false);

  const selected = data.stateCode;
  const stateProfile = selected && selected !== "prefer_not" ? getStateProfile(selected) : null;

  const displayLabel = selected === "prefer_not"
    ? "Prefer not to say"
    : stateProfile
    ? `${stateProfile.stateName} (${selected})`
    : "Select your state";

  const handleSelect = (code: string) => {
    onChange({ stateCode: code as OnboardingData["stateCode"] });
    setIsOpen(false);
  };

  return (
    <Question
      number={13}
      label="What state do you live in?"
      helper="We use this to personalize tax content for your state. Totally optional."
    >
      <div style={{ position: "relative", maxWidth: 480, margin: "0 auto" }}>
        {/* Dropdown trigger */}
        <button
          type="button"
          onClick={() => setIsOpen((o) => !o)}
          style={{
            width: "100%",
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            padding: "12px 16px",
            backgroundColor: selected ? "rgba(14,92,76,0.05)" : "#fff",
            border: `1.5px solid ${selected ? "#0E5C4C" : "#e2dcd2"}`,
            borderRadius: 10,
            cursor: "pointer",
            fontFamily: "var(--font-sans)",
            fontSize: "var(--text-base)",
            color: selected ? "#0E5C4C" : "#b0ab9e",
            fontWeight: selected ? 600 : 400,
            textAlign: "left",
          }}
        >
          <span>{displayLabel}</span>
          <span style={{ fontSize: 12, color: "#7a7a6e", transform: isOpen ? "rotate(180deg)" : "none", transition: "transform 0.15s" }}>▼</span>
        </button>

        {/* Dropdown options */}
        {isOpen && (
          <div style={{
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
          }}>
            {/* Prefer not to say */}
            <button
              type="button"
              onClick={() => handleSelect("prefer_not")}
              style={{
                display: "block",
                width: "100%",
                textAlign: "left",
                padding: "10px 16px",
                backgroundColor: selected === "prefer_not" ? "rgba(14,92,76,0.06)" : "transparent",
                border: "none",
                borderBottom: "1px solid #f0ece4",
                cursor: "pointer",
                fontFamily: "var(--font-sans)",
                fontSize: "var(--text-sm)",
                color: selected === "prefer_not" ? "#0E5C4C" : "#7a7a6e",
                fontStyle: "italic",
              }}
            >
              Prefer not to say
            </button>

            {/* All states */}
            {STATE_OPTIONS.map((state) => (
              <button
                key={state.stateCode}
                type="button"
                onClick={() => handleSelect(state.stateCode)}
                style={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                  width: "100%",
                  textAlign: "left",
                  padding: "9px 16px",
                  backgroundColor: selected === state.stateCode ? "rgba(14,92,76,0.06)" : "transparent",
                  border: "none",
                  borderBottom: "1px solid #f0ece4",
                  cursor: "pointer",
                  fontFamily: "var(--font-sans)",
                  fontSize: "var(--text-sm)",
                  color: selected === state.stateCode ? "#0E5C4C" : "#3d3d35",
                  fontWeight: selected === state.stateCode ? 600 : 400,
                }}
              >
                <span>{state.stateName}</span>
                <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
                  {!state.hasStateIncomeTax && (
                    <span style={{ fontSize: 10, backgroundColor: "rgba(14,92,76,0.1)", color: "#0E5C4C", padding: "1px 6px", borderRadius: 4, fontWeight: 600 }}>
                      No income tax
                    </span>
                  )}
                  <span style={{ fontSize: 11, color: "#b0ab9e" }}>{state.stateCode}</span>
                </div>
              </button>
            ))}
          </div>
        )}

        {/* State info callout after selection */}
        {stateProfile && (
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
