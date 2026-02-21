import React from "react";
import type { OnboardingData } from "@/lib/onboardingSchema";
import { STRESSOR_LABELS, MoneyStressor } from "@/lib/onboardingSchema";
import { MultiSelect, ConfidenceBar, Question } from "./OnboardingControls";

interface StepSixProps {
  data: Partial<OnboardingData>;
  onChange: (patch: Partial<OnboardingData>) => void;
}

const STRESSOR_OPTIONS = Object.entries(STRESSOR_LABELS).map(([value, label]) => ({
  value: value as ReturnType<typeof MoneyStressor.parse>,
  label,
}));

export const StepSix: React.FC<StepSixProps> = ({ data, onChange }) => (
  <>
    <Question
      number={11}
      label="What makes money feel stressful?"
      helper="Select all that apply — this helps us focus your first lessons."
    >
      <MultiSelect
        options={STRESSOR_OPTIONS}
        value={data.moneyStressors ?? []}
        onChange={(v) => onChange({ moneyStressors: v })}
      />
    </Question>

    <Question
      number={12}
      label="On a scale of 1–5, how confident do you feel about your finances?"
    >
      <ConfidenceBar
        value={data.confidence}
        onChange={(v) => onChange({ confidence: v as 1 | 2 | 3 | 4 | 5 })}
        lowLabel="I feel lost"
        highLabel="Very confident"
      />
    </Question>
  </>
);
