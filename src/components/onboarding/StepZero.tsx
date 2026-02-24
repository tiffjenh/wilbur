import React from "react";
import type { OnboardingData } from "@/lib/onboardingSchema";
import {
  LEARNING_MODE_LABELS,
  LEARNING_MODE_DESCRIPTIONS,
} from "@/lib/onboardingSchema";
import { PlatformCards, Question } from "./OnboardingControls";

interface StepZeroProps {
  data: Partial<OnboardingData>;
  onChange: (patch: Partial<OnboardingData>) => void;
}

const LEARNING_MODE_OPTIONS = (["personalized", "browse"] as const).map((value) => ({
  value,
  label: LEARNING_MODE_LABELS[value],
  description: LEARNING_MODE_DESCRIPTIONS[value],
}));

/** Step 1: Learning mode gate — personalized path vs browse all. */
export const StepZero: React.FC<StepZeroProps> = ({ data, onChange }) => (
  <Question number={1} label="How would you like to get started?">
    <PlatformCards
      options={LEARNING_MODE_OPTIONS}
      value={data.learningMode}
      onChange={(v) => onChange({ learningMode: v as OnboardingData["learningMode"] })}
    />
  </Question>
);
