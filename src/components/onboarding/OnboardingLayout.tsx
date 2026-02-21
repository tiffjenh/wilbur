import React from "react";
import { ProgressBar } from "./ProgressBar";
import { Button } from "@/components/ui/Button";
import { TOTAL_STEPS } from "@/lib/onboardingSchema";

interface OnboardingLayoutProps {
  step: number;
  title: string;
  subtitle?: string;
  canNext: boolean;
  onBack: () => void;
  onNext: () => void;
  isLastStep?: boolean;
  children: React.ReactNode;
}

export const OnboardingLayout: React.FC<OnboardingLayoutProps> = ({
  step,
  title,
  subtitle,
  canNext,
  onBack,
  onNext,
  isLastStep = false,
  children,
}) => (
  <div
    className="page-enter"
    style={{
      minHeight: "calc(100vh - var(--nav-height))",
      display: "flex",
      alignItems: "flex-start",
      justifyContent: "center",
      padding: "48px 20px 64px",
      backgroundColor: "var(--color-bg)",
    }}
  >
    {/* Centered card */}
    <div style={{
      width: "100%",
      maxWidth: "560px",
      backgroundColor: "var(--color-surface)",
      borderRadius: "var(--radius-2xl)",
      boxShadow: "var(--shadow-md)",
      padding: "40px 44px 36px",
    }}>
      {/* Progress bar */}
      <ProgressBar step={step} />

      {/* Step indicator */}
      <div style={{ fontSize: "var(--text-xs)", color: "var(--color-text-muted)", fontFamily: "var(--font-sans)", marginBottom: "16px", letterSpacing: "0.04em" }}>
        Step {step} of {TOTAL_STEPS}
      </div>

      {/* Heading */}
      <h1 style={{
        fontFamily: "var(--font-serif)",
        fontSize: "var(--text-xl)",
        fontWeight: 600,
        color: "var(--color-text)",
        lineHeight: 1.25,
        marginBottom: subtitle ? "8px" : "24px",
      }}>
        {title}
      </h1>
      {subtitle && (
        <p style={{ fontSize: "var(--text-sm)", color: "var(--color-text-muted)", lineHeight: 1.65, marginBottom: "28px" }}>
          {subtitle}
        </p>
      )}

      {/* Step content */}
      <div style={{ marginBottom: "32px" }}>
        {children}
      </div>

      {/* Navigation buttons */}
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: "12px" }}>
        {step > 1 ? (
          <Button variant="secondary" size="md" onClick={onBack} style={{ minWidth: "100px" }}>
            Back
          </Button>
        ) : (
          <div /> /* spacer keeps Next on the right */
        )}

        <Button
          variant="primary"
          size="md"
          onClick={onNext}
          disabled={!canNext}
          style={{ minWidth: "120px" }}
        >
          {isLastStep ? "See my path" : "Next"}
        </Button>
      </div>
    </div>
  </div>
);
