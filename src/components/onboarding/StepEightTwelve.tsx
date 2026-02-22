import React from "react";
import type { OnboardingData } from "@/lib/onboardingSchema";
import { INVESTING_EXP_LABELS, InvestingExp } from "@/lib/onboardingSchema";
import { PlatformCards, ConfidenceBar, Question, IconNever, IconALittle, IconYesRegularly } from "./OnboardingControls";

interface StepEightTwelveProps {
  data: Partial<OnboardingData>;
  onChange: (patch: Partial<OnboardingData>) => void;
}

const INVESTING_EXP_ICONS: Record<string, React.ReactNode> = {
  never: <IconNever />,
  a_little: <IconALittle />,
  yes_regularly: <IconYesRegularly />,
};

const EXP_OPTIONS = Object.entries(INVESTING_EXP_LABELS).map(([value, label]) => ({
  value: value as ReturnType<typeof InvestingExp.parse>,
  label,
  icon: INVESTING_EXP_ICONS[value],
}));

/** Step 8 (last): Question 11 (investing exp) + Question 12 (confidence) */
export const StepEightTwelve: React.FC<StepEightTwelveProps> = ({ data, onChange }) => (
  <>
    <Question number={11} label="Have you invested before?">
      <PlatformCards
        options={EXP_OPTIONS}
        value={data.investingExp}
        onChange={(v) => onChange({ investingExp: v })}
        compact
        center
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
