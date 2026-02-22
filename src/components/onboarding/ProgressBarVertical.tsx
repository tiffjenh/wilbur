import React from "react";
import { TOTAL_STEPS } from "@/lib/onboardingSchema";

interface ProgressBarVerticalProps {
  step: number; // 1-based current step
}

export const ProgressBarVertical: React.FC<ProgressBarVerticalProps> = ({ step }) => (
  <div
    style={{
      display: "flex",
      flexDirection: "column",
      alignItems: "center",
      width: "48px",
      height: "100%",
      minHeight: "200px",
    }}
  >
    {Array.from({ length: TOTAL_STEPS }).map((_, i) => {
      const stepNum = i + 1;
      const isCompleted = stepNum < step;
      const isActive = stepNum === step;
      const isFilled = isCompleted || isActive;

      return (
        <React.Fragment key={stepNum}>
          {/* Connector line above (except first) — flexes to span module height */}
          {i > 0 && (
            <div
              style={{
                width: "5px",
                flex: "1 1 0",
                minHeight: "12px",
                backgroundColor: "var(--color-black)",
              }}
            />
          )}
          {/* Circular node with number */}
          <div
            style={{
              width: "32px",
              height: "32px",
              borderRadius: "50%",
              backgroundColor: isFilled ? "var(--color-black)" : "transparent",
              border: "2.5px solid var(--color-black)",
              display: "flex",
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
                color: isFilled ? "var(--color-beige)" : "var(--color-black)",
              }}
            >
              {stepNum}
            </span>
          </div>
        </React.Fragment>
      );
    })}
  </div>
);
