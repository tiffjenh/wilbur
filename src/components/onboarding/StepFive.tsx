import React from "react";
import type { OnboardingData } from "@/lib/onboardingSchema";
import {
  GOALS_YEAR_LABELS, GOALS_3_5_LABELS,
  GoalThisYear, Goal3to5,
} from "@/lib/onboardingSchema";
import { MultiSelect, Question } from "./OnboardingControls";

interface StepFiveProps {
  data: Partial<OnboardingData>;
  onChange: (patch: Partial<OnboardingData>) => void;
}

const YEAR_OPTIONS = Object.entries(GOALS_YEAR_LABELS).map(([value, label]) => ({
  value: value as ReturnType<typeof GoalThisYear.parse>,
  label,
}));

const LONG_OPTIONS = Object.entries(GOALS_3_5_LABELS).map(([value, label]) => ({
  value: value as ReturnType<typeof Goal3to5.parse>,
  label,
}));

/** Step 5: displayed as Question 8 (goals this year) */
export const StepFiveQ9: React.FC<StepFiveProps> = ({ data, onChange }) => (
  <Question
    number={8}
    label="What are your top goals this year?"
    helper="Select all that apply."
  >
    <MultiSelect
      options={YEAR_OPTIONS}
      value={data.goalsThisYear ?? []}
      onChange={(v) => onChange({ goalsThisYear: v })}
    />
  </Question>
);

/** Step 6: displayed as Question 9 (goals 3–5 years) */
export const StepFiveQ10: React.FC<StepFiveProps> = ({ data, onChange }) => (
  <Question
    number={9}
    label="What are your financial goals in 3–5 years?"
    helper="Select all that apply."
  >
    <MultiSelect
      options={LONG_OPTIONS}
      value={data.goals3to5 ?? []}
      onChange={(v) => onChange({ goals3to5: v })}
    />
  </Question>
);
