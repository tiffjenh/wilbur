import React from "react";
import type { OnboardingData } from "@/lib/onboardingSchema";
import { TOPIC_INTEREST_LABELS } from "@/lib/onboardingSchema";
import { MultiSelect, Question } from "./OnboardingControls";

interface StepFiveNewProps {
  data: Partial<OnboardingData>;
  onChange: (patch: Partial<OnboardingData>) => void;
}

type TopicVal = keyof typeof TOPIC_INTEREST_LABELS;

const TOPIC_OPTIONS: { value: TopicVal; label: string }[] = Object.entries(TOPIC_INTEREST_LABELS).map(([value, label]) => ({
  value: value as TopicVal,
  label,
}));

/** When user selects "dont_know" or "everything", clear others; when selecting a specific topic, clear those two. */
function normalizeTopics(_prev: TopicVal[], next: TopicVal[]): TopicVal[] {
  if (next.includes("dont_know")) return ["dont_know"];
  if (next.includes("everything")) return ["everything"];
  return next.filter((t) => t !== "dont_know" && t !== "everything");
}

/** Screen 6: Topics of interest */
export const StepFiveNew: React.FC<StepFiveNewProps> = ({ data, onChange }) => {
  const value = (data.topics ?? []) as TopicVal[];
  const handleChange = (v: TopicVal[]) => {
    onChange({ topics: normalizeTopics(value, v) });
  };
  return (
    <Question
      number={9}
      label="Which topics are you most curious about?"
      helper="Select all that apply."
    >
      <MultiSelect<TopicVal>
        options={TOPIC_OPTIONS}
        value={value}
        onChange={handleChange}
      />
    </Question>
  );
};
