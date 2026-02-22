import React from "react";
import type { OnboardingData } from "@/lib/onboardingSchema";
import { BENEFIT_LABELS, BenefitOption } from "@/lib/onboardingSchema";
import { MultiSelect, Question } from "./OnboardingControls";

interface StepFourProps {
  data: Partial<OnboardingData>;
  onChange: (patch: Partial<OnboardingData>) => void;
}

const BENEFIT_OPTIONS = Object.entries(BENEFIT_LABELS).map(([value, label]) => ({
  value: value as ReturnType<typeof BenefitOption.parse>,
  label,
}));

/** Step 4: Q7 only (benefits) */
export const StepFour: React.FC<StepFourProps> = ({ data, onChange }) => (
  <Question
    number={7}
    label="What work benefits do you have access to?"
    helper="Select all that apply."
  >
    <MultiSelect
      options={BENEFIT_OPTIONS}
      value={data.benefits ?? []}
      onChange={(v) => onChange({ benefits: v })}
      exclusive="none"
      compact
    />
  </Question>
);
