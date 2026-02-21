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
import { StepFive } from "@/components/onboarding/StepFive";
import { StepSix } from "@/components/onboarding/StepSix";

/* ── step meta ── */
const STEP_META: { title: string; subtitle?: string }[] = [
  {
    title: "Tell us a little about yourself",
    subtitle: "We'll use this to build a learning path that fits your life — not someone else's.",
  },
  {
    title: "Your income & work situation",
    subtitle: "This helps us prioritize the money topics that are most relevant for you right now.",
  },
  {
    title: "Your savings & debt picture",
    subtitle: "No judgment here. Knowing where you stand helps us focus your first lessons.",
  },
  {
    title: "Benefits & investing experience",
    subtitle: "We'll make sure you understand and use every benefit available to you.",
  },
  {
    title: "Your goals",
    subtitle: "Short-term wins and long-term dreams. We'll build your path around both.",
  },
  {
    title: "How do you feel about money?",
    subtitle: "Honest answers help us pitch lessons at the right level — no fluff, no overwhelm.",
  },
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

  /* Restore saved progress on mount */
  useEffect(() => {
    const saved = loadFromStorage();
    setForm(saved);
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
      // Final submit: validate complete schema (partial — only required fields matter)
      saveDraft(form);
      navigate("/dashboard");
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
      {step === 5 && <StepFive data={form} onChange={patch} />}
      {step === 6 && <StepSix data={form} onChange={patch} />}
    </OnboardingLayout>
  );
};
