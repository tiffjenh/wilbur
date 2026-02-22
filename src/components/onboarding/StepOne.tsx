import React from "react";
import type { OnboardingData } from "@/lib/onboardingSchema";
import {
  AGE_LABELS, WORK_STATUS_LABELS,
  AgeRange, WorkStatus,
} from "@/lib/onboardingSchema";
import { SliderSelect, PlatformCards, Question, IconInSchool, IconWorking, IconBoth, IconNeither } from "./OnboardingControls";

interface StepOneProps {
  data: Partial<OnboardingData>;
  onChange: (patch: Partial<OnboardingData>) => void;
}

const AGE_OPTIONS = Object.entries(AGE_LABELS).map(([value, label]) => ({
  value: value as ReturnType<typeof AgeRange.parse>,
  label,
}));

const WORK_ICONS: Record<string, React.ReactNode> = {
  in_school: <IconInSchool />,
  working: <IconWorking />,
  both: <IconBoth />,
  neither: <IconNeither />,
};

const WORK_OPTIONS = Object.entries(WORK_STATUS_LABELS).map(([value, label]) => ({
  value: value as ReturnType<typeof WorkStatus.parse>,
  label,
  icon: WORK_ICONS[value],
}));

export const StepOne: React.FC<StepOneProps> = ({ data, onChange }) => (
  <>
    <Question
      number={1}
      label="What's your age range?"
    >
      <SliderSelect
        options={AGE_OPTIONS}
        value={data.age}
        onChange={(v) => onChange({ age: v })}
      />
    </Question>

    <Question
      number={2}
      label="Are you currently…"
    >
      <PlatformCards
        options={WORK_OPTIONS}
        value={data.workStatus}
        onChange={(v) => onChange({ workStatus: v })}
      />
    </Question>
  </>
);
