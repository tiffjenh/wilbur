import React, { useState, useEffect, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import {
  onboardingSchema,
  STEP_REQUIRED_FIELDS,
  TOTAL_STEPS,
  LS_KEY,
  type OnboardingData,
} from "@/lib/onboardingSchema";
import { OnboardingLayout } from "@/components/onboarding/OnboardingLayout";
import { StepOne } from "@/components/onboarding/StepOne";
import { StepTwo } from "@/components/onboarding/StepTwo";
import { StepThree } from "@/components/onboarding/StepThree";
import { StepFour } from "@/components/onboarding/StepFour";
import { StepEightTwelve } from "@/components/onboarding/StepEightTwelve";
import { StepFiveQ9, StepFiveQ10 } from "@/components/onboarding/StepFive";
import { StepSix } from "@/components/onboarding/StepSix";

/* ── step meta (8 steps) ── */
const STEP_META: { title: string; subtitle?: string }[] = [
  { title: "", subtitle: "" },
  { title: "", subtitle: "" },
  { title: "", subtitle: "" },
  { title: "", subtitle: "" },
  { title: "", subtitle: "" },
  { title: "", subtitle: "" },
  { title: "", subtitle: "" },
  { title: "", subtitle: "" },
];

/* ── restore from localStorage ── */
function loadFromStorage(): Partial<OnboardingData> {
  try {
    const raw = localStorage.getItem(LS_KEY);
    if (!raw) return {};
    const parsed = JSON.parse(raw);
    // Partially validate — ignore invalid fields
    const result = onboardingSchema.partial().safeParse(parsed);
    return result.success ? result.data : {};
  } catch {
    return {};
  }
}

/* ── save draft (partial) to localStorage ── */
function saveDraft(data: Partial<OnboardingData>) {
  try { localStorage.setItem(LS_KEY, JSON.stringify(data)); } catch { /* ignore */ }
}

/* ── check if a step's required fields are filled ── */
function stepIsComplete(step: number, data: Partial<OnboardingData>): boolean {
  const required = STEP_REQUIRED_FIELDS[step - 1] ?? [];
  return required.every((key) => {
    const val = data[key];
    if (val === undefined || val === null) return false;
    if (Array.isArray(val)) return val.length > 0;
    return true;
  });
}

export const Onboarding: React.FC = () => {
  const navigate = useNavigate();

  const [step, setStep]     = useState<number>(1);
  const [form, setForm]     = useState<Partial<OnboardingData>>({});
  const [ready, setReady]   = useState(false);

  /* Restore saved progress on mount; use leftmost-option defaults for required fields when empty */
  const DEFAULT_REQUIRED: Partial<OnboardingData> = {
    age: "under_18",
    workStatus: "in_school",
    incomeType: "w2",
    incomeRange: "under_15k",
  };

  useEffect(() => {
    const saved = loadFromStorage();
    setForm({ ...DEFAULT_REQUIRED, ...saved });
    setReady(true);
  }, []);

  /* Auto-save on every change */
  useEffect(() => {
    if (ready) saveDraft(form);
  }, [form, ready]);

  const patch = useCallback((update: Partial<OnboardingData>) => {
    setForm((prev) => ({ ...prev, ...update }));
  }, []);

  const goNext = useCallback(() => {
    if (step < TOTAL_STEPS) {
      setStep((s) => s + 1);
      window.scrollTo({ top: 0, behavior: "smooth" });
    } else {
      saveDraft(form);
      navigate("/onboarding/complete");
    }
  }, [step, form, navigate]);

  const goBack = useCallback(() => {
    if (step > 1) {
      setStep((s) => s - 1);
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  }, [step]);

  const canNext = stepIsComplete(step, form);
  const meta    = STEP_META[step - 1];

  if (!ready) return null; // Wait for localStorage restore before rendering

  return (
    <OnboardingLayout
      step={step}
      title={meta.title}
      subtitle={meta.subtitle}
      canNext={canNext}
      onBack={goBack}
      onNext={goNext}
      isLastStep={step === TOTAL_STEPS}
    >
      {step === 1 && <StepOne data={form} onChange={patch} />}
      {step === 2 && <StepTwo data={form} onChange={patch} />}
      {step === 3 && <StepThree data={form} onChange={patch} />}
      {step === 4 && <StepFour data={form} onChange={patch} />}
      {step === 5 && <StepFiveQ9 data={form} onChange={patch} />}
      {step === 6 && <StepFiveQ10 data={form} onChange={patch} />}
      {step === 7 && <StepSix data={form} onChange={patch} />}
      {step === 8 && <StepEightTwelve data={form} onChange={patch} />}
    </OnboardingLayout>
  );
};
