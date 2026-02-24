import React from "react";
import type { OnboardingData } from "@/lib/onboardingSchema";
import { GOAL_3_5_NEW_LABELS } from "@/lib/onboardingSchema";
import { MultiSelect, Question } from "./OnboardingControls";

interface StepFourNewProps {
  data: Partial<OnboardingData>;
  onChange: (patch: Partial<OnboardingData>) => void;
}

type GoalValue = keyof typeof GOAL_3_5_NEW_LABELS;

const GOAL_OPTIONS: { value: GoalValue; label: string }[] = Object.entries(GOAL_3_5_NEW_LABELS).map(([value, label]) => ({
  value: value as GoalValue,
  label,
}));

const MAX_GOALS = 3;

/** Screen 5: Financial goals (max 3) */
export const StepFourNew: React.FC<StepFourNewProps> = ({ data, onChange }) => {
  const value = (data.goals3to5 ?? []) as GoalValue[];
  const handleChange = (v: GoalValue[]) => {
    onChange({ goals3to5: v.length <= MAX_GOALS ? v : value });
  };
  return (
    <Question
      number={8}
      label="What are your financial goals in the next 3–5 years?"
      helper="Select up to 3."
    >
      <MultiSelect
        options={GOAL_OPTIONS}
        value={value}
        onChange={handleChange}
      />
    </Question>
  );
};
