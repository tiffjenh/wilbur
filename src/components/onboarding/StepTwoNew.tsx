import React from "react";
import type { OnboardingData } from "@/lib/onboardingSchema";
import {
  INCOME_RANGE_NEW_LABELS,
  DEBT_TYPE_LABELS,
} from "@/lib/onboardingSchema";
import { SliderSelect, MultiSelect, Question } from "./OnboardingControls";

interface StepTwoNewProps {
  data: Partial<OnboardingData>;
  onChange: (patch: Partial<OnboardingData>) => void;
}

const INCOME_OPTIONS: { value: string; label: string }[] = Object.entries(INCOME_RANGE_NEW_LABELS).map(([value, label]) => ({
  value,
  label,
}));

const DEBT_OPTIONS: { value: string; label: string }[] = Object.entries(DEBT_TYPE_LABELS).map(([value, label]) => ({
  value,
  label,
}));

/** Screen 3: Income + Debt */
export const StepTwoNew: React.FC<StepTwoNewProps> = ({ data, onChange }) => (
  <>
    <Question number={4} label="What is your annual income range?">
      <SliderSelect
        options={INCOME_OPTIONS}
        value={data.incomeRange ?? undefined}
        onChange={(v) => onChange({ incomeRange: v as OnboardingData["incomeRange"] })}
      />
    </Question>

    <Question number={5} label="Do you currently have any debt?" helper="Select all that apply.">
      <MultiSelect
        options={DEBT_OPTIONS}
        value={(data.debtTypes ?? []) as string[]}
        onChange={(v) => onChange({ debtTypes: v as OnboardingData["debtTypes"] })}
        exclusive="no_debt"
      />
    </Question>
  </>
);
