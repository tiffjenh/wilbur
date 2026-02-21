import React from "react";
import type { OnboardingData } from "@/lib/onboardingSchema";
import {
  BENEFIT_LABELS, INVESTING_EXP_LABELS,
  BenefitOption, InvestingExp,
} from "@/lib/onboardingSchema";
import { MultiSelect, SingleSelect, Question } from "./OnboardingControls";

interface StepFourProps {
  data: Partial<OnboardingData>;
  onChange: (patch: Partial<OnboardingData>) => void;
}

const BENEFIT_OPTIONS = Object.entries(BENEFIT_LABELS).map(([value, label]) => ({
  value: value as ReturnType<typeof BenefitOption.parse>,
  label,
}));

const EXP_OPTIONS = Object.entries(INVESTING_EXP_LABELS).map(([value, label]) => ({
  value: value as ReturnType<typeof InvestingExp.parse>,
  label,
}));

export const StepFour: React.FC<StepFourProps> = ({ data, onChange }) => (
  <>
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
      />
    </Question>

    <Question
      number={8}
      label="Have you invested before?"
    >
      <SingleSelect
        options={EXP_OPTIONS}
        value={data.investingExp}
        onChange={(v) => onChange({ investingExp: v })}
      />
    </Question>
  </>
);
