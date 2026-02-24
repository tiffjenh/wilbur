import React from "react";
import type { OnboardingData } from "@/lib/onboardingSchema";
import { Question } from "./OnboardingControls";
import { ConfidenceBar } from "./OnboardingControls";

interface StepSixNewProps {
  data: Partial<OnboardingData>;
  onChange: (patch: Partial<OnboardingData>) => void;
}

/** Screen 7: Confidence slider (1–5) */
export const StepSixNew: React.FC<StepSixNewProps> = ({ data, onChange }) => (
  <Question
    number={10}
    label="How confident do you feel about your financial knowledge?"
  >
    <ConfidenceBar
      value={data.confidence}
      onChange={(v) => onChange({ confidence: v as OnboardingData["confidence"] })}
      lowLabel="I feel lost"
      highLabel="Very confident"
    />
  </Question>
);
