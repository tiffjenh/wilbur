import React from "react";
import { TOTAL_STEPS } from "@/lib/onboardingSchema";

interface ProgressBarProps {
  step: number; // 1-based
}

export const ProgressBar: React.FC<ProgressBarProps> = ({ step }) => {
  const pct = ((step - 1) / (TOTAL_STEPS - 1)) * 100;

  return (
    <div style={{ marginBottom: "28px" }}>
      {/* Track */}
      <div style={{
        height: "5px",
        borderRadius: "var(--radius-full)",
        backgroundColor: "var(--color-border-light)",
        overflow: "hidden",
      }}>
        <div style={{
          height: "100%",
          width: `${pct}%`,
          backgroundColor: "var(--color-primary)",
          borderRadius: "var(--radius-full)",
          transition: "width 380ms var(--ease-out)",
        }} />
      </div>

      {/* Dot markers */}
      <div style={{
        display: "flex",
        justifyContent: "space-between",
        marginTop: "8px",
        paddingLeft: "0",
        paddingRight: "0",
      }}>
        {Array.from({ length: TOTAL_STEPS }).map((_, i) => {
          const stepNum = i + 1;
          const done    = stepNum < step;
          const active  = stepNum === step;
          return (
            <div
              key={stepNum}
              style={{
                width: active ? "22px" : "8px",
                height: "8px",
                borderRadius: "var(--radius-full)",
                backgroundColor: done
                  ? "var(--color-primary)"
                  : active
                    ? "var(--color-primary)"
                    : "var(--color-border)",
                transition: "width 260ms var(--ease-out), background-color 260ms",
                opacity: done ? 0.45 : 1,
              }}
            />
          );
        })}
      </div>
    </div>
  );
};
