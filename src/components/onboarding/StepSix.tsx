import React from "react";
import type { OnboardingData } from "@/lib/onboardingSchema";
import { STRESSOR_LABELS, MoneyStressor } from "@/lib/onboardingSchema";
import { MultiSelect, Question } from "./OnboardingControls";

interface StepSixProps {
  data: Partial<OnboardingData>;
  onChange: (patch: Partial<OnboardingData>) => void;
}

const STRESSOR_OPTIONS = Object.entries(STRESSOR_LABELS).map(([value, label]) => ({
  value: value as ReturnType<typeof MoneyStressor.parse>,
  label,
}));

/** Step 7: displayed as Question 10 (stressors) */
export const StepSix: React.FC<StepSixProps> = ({ data, onChange }) => (
  <Question
    number={10}
    label="What makes money feel stressful?"
    helper="Select all that apply — this helps us focus your first lessons."
  >
    <MultiSelect
      options={STRESSOR_OPTIONS}
      value={data.moneyStressors ?? []}
      onChange={(v) => onChange({ moneyStressors: v })}
    />
  </Question>
);
