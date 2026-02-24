import React from "react";
import type { OnboardingData } from "@/lib/onboardingSchema";
import {
  EMERGENCY_SAVINGS_LABELS,
  INVESTING_EXP_LABELS,
} from "@/lib/onboardingSchema";
import { SliderSelect, PlatformCards, Question } from "./OnboardingControls";
import { IconNever, IconALittle, IconYesRegularly } from "./OnboardingControls";

interface StepThreeNewProps {
  data: Partial<OnboardingData>;
  onChange: (patch: Partial<OnboardingData>) => void;
}

const EMERGENCY_OPTIONS: { value: string; label: string }[] = Object.entries(EMERGENCY_SAVINGS_LABELS).map(([value, label]) => ({
  value,
  label,
}));

const INVESTING_ICONS: Record<string, React.ReactNode> = {
  never: <IconNever />,
  a_little: <IconALittle />,
  regularly: <IconYesRegularly />,
  advanced: <IconYesRegularly />,
};

const INVESTING_OPTIONS: { value: string; label: string; icon?: React.ReactNode }[] = Object.entries(INVESTING_EXP_LABELS).map(([value, label]) => ({
  value,
  label,
  icon: INVESTING_ICONS[value],
}));

/** Screen 4: Emergency savings + Investing experience */
export const StepThreeNew: React.FC<StepThreeNewProps> = ({ data, onChange }) => (
  <>
    <Question number={6} label="How much emergency savings do you have?">
      <SliderSelect
        options={EMERGENCY_OPTIONS}
        value={data.emergencySavings ?? undefined}
        onChange={(v) => onChange({ emergencySavings: v as OnboardingData["emergencySavings"] })}
      />
    </Question>

    <Question number={7} label="What is your investing experience?">
      <PlatformCards
        options={INVESTING_OPTIONS}
        value={data.investingExp ?? undefined}
        onChange={(v) => onChange({ investingExp: v as OnboardingData["investingExp"] })}
        compact
        center
      />
    </Question>
  </>
);
