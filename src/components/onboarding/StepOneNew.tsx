import React from "react";
import type { OnboardingData } from "@/lib/onboardingSchema";
import {
  STAGE_OF_LIFE_LABELS,
  WORK_SITUATION_LABELS,
} from "@/lib/onboardingSchema";
import { SliderSelect, PlatformCards, Question } from "./OnboardingControls";

interface StepOneNewProps {
  data: Partial<OnboardingData>;
  onChange: (patch: Partial<OnboardingData>) => void;
}

const STAGE_OPTIONS: { value: string; label: string }[] = Object.entries(STAGE_OF_LIFE_LABELS).map(([value, label]) => ({
  value,
  label,
}));

const WORK_OPTIONS: { value: string; label: string }[] = Object.entries(WORK_SITUATION_LABELS).map(([value, label]) => ({
  value,
  label,
}));

/** Screen 2: Stage of life + Work situation */
export const StepOneNew: React.FC<StepOneNewProps> = ({ data, onChange }) => (
  <>
    <Question number={2} label="What best describes your current stage of life?">
      <SliderSelect
        options={STAGE_OPTIONS}
        value={data.stageOfLife ?? undefined}
        onChange={(v) => onChange({ stageOfLife: v as OnboardingData["stageOfLife"] })}
      />
    </Question>

    <Question number={3} label="What is your current work situation?">
      <PlatformCards
        options={WORK_OPTIONS}
        value={data.workSituation ?? undefined}
        onChange={(v) => onChange({ workSituation: v as OnboardingData["workSituation"] })}
      />
    </Question>
  </>
);
