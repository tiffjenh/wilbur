import React from "react";
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
  /** Override Next button label (e.g. "Go to Library", "See my path") */
  nextLabel?: string;
  children: React.ReactNode;
}

const QUESTIONNAIRE_MAX_WIDTH = 900;
const QUESTIONNAIRE_PADDING_X = 48;
/** Content column width: slider, choices, and Back/Next align to this */
const CONTENT_MAX_WIDTH = 640;

export const OnboardingLayout: React.FC<OnboardingLayoutProps> = ({
  step,
  canNext,
  onBack,
  onNext,
  isLastStep = false,
  nextLabel,
  children,
}) => (
  <div
    className="page-enter"
    style={{
      minHeight: "calc(100vh - var(--nav-height))",
      display: "flex",
      flexDirection: "column",
      alignItems: "center",
      justifyContent: "center",
      padding: "32px 24px 40px",
      backgroundColor: "var(--color-bg)",
      overflow: "auto",
    }}
  >
    {/* Single shared container: same width for progress, questions, choices, buttons; beige border */}
    <div
      style={{
        width: "100%",
        maxWidth: QUESTIONNAIRE_MAX_WIDTH,
        padding: `24px ${QUESTIONNAIRE_PADDING_X}px 24px`,
        display: "flex",
        flexDirection: "column",
        minHeight: "0",
        border: "1px solid var(--color-beige)",
        borderRadius: "var(--radius-xl)",
        backgroundColor: "var(--color-bg)",
      }}
    >
      {/* Progress: same width as questions/choices (480) so everything aligns */}
      <div style={{ width: "100%", maxWidth: CONTENT_MAX_WIDTH, margin: "0 auto 28px" }}>
        <div
          style={{
            display: "flex",
            justifyContent: "flex-end",
            alignItems: "center",
            marginBottom: "8px",
          }}
        >
          <span
            style={{
              fontFamily: "var(--font-sans)",
              fontSize: "var(--text-xs)",
              fontWeight: 500,
              color: "var(--color-text-muted)",
              letterSpacing: "0.02em",
            }}
          >
            {step} of {TOTAL_STEPS}
          </span>
        </div>
        <div
          style={{
            height: "8px",
            borderRadius: "var(--radius-full)",
            backgroundColor: "var(--color-border-light)",
            overflow: "hidden",
          }}
        >
          <div
            style={{
              height: "100%",
              width: `${(step / TOTAL_STEPS) * 100}%`,
              backgroundColor: "var(--color-primary)",
              borderRadius: "var(--radius-full)",
              transition: "width 280ms var(--ease-out)",
            }}
          />
        </div>
      </div>

      {/* Step content + buttons: same width as questions/choices (480) */}
      <div style={{ width: "100%", maxWidth: CONTENT_MAX_WIDTH, margin: "0 auto", flex: "1 1 auto", minHeight: "0", display: "flex", flexDirection: "column" }}>
        <div style={{ marginBottom: "8px", flex: "1 1 auto", minHeight: "0" }}>
          {children}
        </div>

        {/* Navigation buttons — aligned with content, closer to questions */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            gap: "12px",
            flexShrink: 0,
          }}
        >
          {step > 1 ? (
            <Button variant="outlineBlack" size="md" onClick={onBack} style={{ minWidth: "100px" }}>
              Back
            </Button>
          ) : (
            <div />
          )}
          <Button
            variant="pink"
            size="md"
            onClick={onNext}
            disabled={!canNext}
            style={{ minWidth: "120px", border: "2px solid var(--color-black)", color: "var(--color-black)" }}
          >
            {nextLabel ?? (isLastStep ? "See my path" : "Next")}
          </Button>
        </div>
      </div>
    </div>
  </div>
);
