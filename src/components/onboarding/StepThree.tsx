import React from "react";
import type { OnboardingData } from "@/lib/onboardingSchema";
import {
  SAVINGS_RANGE_LABELS, DEBT_RANGE_LABELS,
  SavingsRange, DebtRange,
} from "@/lib/onboardingSchema";
import { SliderSelect, Question } from "./OnboardingControls";

interface StepThreeProps {
  data: Partial<OnboardingData>;
  onChange: (patch: Partial<OnboardingData>) => void;
}

const SAVINGS_OPTIONS = Object.entries(SAVINGS_RANGE_LABELS).map(([value, label]) => ({
  value: value as ReturnType<typeof SavingsRange.parse>,
  label,
}));

const DEBT_OPTIONS = Object.entries(DEBT_RANGE_LABELS).map(([value, label]) => ({
  value: value as ReturnType<typeof DebtRange.parse>,
  label,
}));

export const StepThree: React.FC<StepThreeProps> = ({ data, onChange }) => (
  <>
    <Question
      number={5}
      label="How much do you currently have in savings?"
      helper="Include checking, savings, or cash accounts — not investments."
    >
      <SliderSelect
        options={SAVINGS_OPTIONS}
        value={data.savingsRange}
        onChange={(v) => onChange({ savingsRange: v })}
      />
    </Question>

    <Question
      number={6}
      label="How much debt do you currently have?"
      helper="Include credit cards, student loans, car payments, and any other debt."
    >
      <SliderSelect
        options={DEBT_OPTIONS}
        value={data.debtRange}
        onChange={(v) => onChange({ debtRange: v })}
      />
    </Question>
  </>
);
