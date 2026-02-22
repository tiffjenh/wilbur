import React from "react";
import type { OnboardingData } from "@/lib/onboardingSchema";
import {
  INCOME_TYPE_LABELS, INCOME_RANGE_LABELS,
  IncomeType, IncomeRange,
} from "@/lib/onboardingSchema";
import { SliderSelect, PlatformCards, Question, Icon1099, IconW2, IconBoth, IconNoIncome } from "./OnboardingControls";

interface StepTwoProps {
  data: Partial<OnboardingData>;
  onChange: (patch: Partial<OnboardingData>) => void;
}

const INCOME_ICONS: Record<string, React.ReactNode> = {
  "1099": <Icon1099 />,
  w2: <IconW2 />,
  both: <IconBoth />,
  no_income: <IconNoIncome />,
};

const INCOME_TYPE_OPTIONS = Object.entries(INCOME_TYPE_LABELS).map(([value, label]) => ({
  value: value as ReturnType<typeof IncomeType.parse>,
  label,
  icon: INCOME_ICONS[value],
}));

const INCOME_RANGE_OPTIONS = Object.entries(INCOME_RANGE_LABELS).map(([value, label]) => ({
  value: value as ReturnType<typeof IncomeRange.parse>,
  label,
}));

export const StepTwo: React.FC<StepTwoProps> = ({ data, onChange }) => (
  <>
    <Question
      number={3}
      label="What's your income type?"
    >
      <PlatformCards
        options={INCOME_TYPE_OPTIONS}
        value={data.incomeType}
        onChange={(v) => onChange({ incomeType: v })}
      />
    </Question>

    <Question
      number={4}
      label="What's your approximate annual income?"
    >
      <SliderSelect
        options={INCOME_RANGE_OPTIONS}
        value={data.incomeRange}
        onChange={(v) => onChange({ incomeRange: v })}
      />
    </Question>
  </>
);
