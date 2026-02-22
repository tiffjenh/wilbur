import React, { useState, useEffect, useCallback, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import {
  onboardingSchema,
  STEP_REQUIRED_FIELDS,
  STEP_SLIDER_DEFAULTS,
  TOTAL_STEPS,
  LS_KEY,
  type OnboardingData,
} from "@/lib/onboardingSchema";
import {
  computeLearningProfile,
  saveProfile,
  clearProfile,
} from "@/lib/personalizationEngine";
import { toQuestionnaireAnswers } from "@/lib/recommendation/adapter";
import { LESSON_CATALOG } from "@/content/lessons/lessonCatalog";
import { generateLearningPath, loadFeedbackMap } from "@/lib/recommendation/generatePath";
import { saveAnswers, saveLearningPath, clearStoredProfile } from "@/lib/storage/userProfile";
import { clearProgress } from "@/lib/storage/lessonProgress";
import { OnboardingLayout } from "@/components/onboarding/OnboardingLayout";
import { StepOne } from "@/components/onboarding/StepOne";
import { StepTwo } from "@/components/onboarding/StepTwo";
import { StepThree } from "@/components/onboarding/StepThree";
import { StepFour } from "@/components/onboarding/StepFour";
import { StepEightTwelve } from "@/components/onboarding/StepEightTwelve";
import { StepFiveQ9, StepFiveQ10 } from "@/components/onboarding/StepFive";
import { StepSix } from "@/components/onboarding/StepSix";
import { StepNine } from "@/components/onboarding/StepNine";

/* ── Restore from localStorage ── */
function loadFromStorage(): Partial<OnboardingData> {
  try {
    const raw = localStorage.getItem(LS_KEY);
    if (!raw) return {};
    const parsed = JSON.parse(raw);
    const result = onboardingSchema.partial().safeParse(parsed);
    return result.success ? result.data : {};
  } catch {
    return {};
  }
}

/* ── Persist draft to localStorage ── */
function saveDraft(data: Partial<OnboardingData>) {
  try { localStorage.setItem(LS_KEY, JSON.stringify(data)); } catch { /* ignore */ }
}

/* ── Check if step's required fields are all filled ── */
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

  const [step, setStep]   = useState<number>(1);
  const [form, setForm]   = useState<Partial<OnboardingData>>({});
  const [ready, setReady] = useState(false);

  /* ── Restore saved draft on mount ── */
  useEffect(() => {
    const saved = loadFromStorage();
    setForm(saved);
    setReady(true);
  }, []);

  /* ── Inject slider defaults when entering a step that has them ──
     Sliders default to a sensible value so the user doesn't need to
     touch them to proceed, while still recording a meaningful answer. */
  useEffect(() => {
    if (!ready) return;
    const defaults = STEP_SLIDER_DEFAULTS[step];
    if (!defaults) return;
    setForm((prev) => {
      const updates: Partial<OnboardingData> = {};
      for (const [key, val] of Object.entries(defaults) as [keyof OnboardingData, unknown][]) {
        if (prev[key] === undefined) {
          (updates as Record<string, unknown>)[key] = val;
        }
      }
      return Object.keys(updates).length > 0 ? { ...prev, ...updates } : prev;
    });
  }, [step, ready]);

  /* ── Auto-save on every form change ── */
  useEffect(() => {
    if (ready) saveDraft(form);
  }, [form, ready]);

  /* ── Update form; memoized ── */
  const patch = useCallback((update: Partial<OnboardingData>) => {
    setForm((prev) => ({ ...prev, ...update }));
  }, []);

  /* ── "Next" is enabled only when required fields are filled ── */
  const canNext = useMemo(
    () => stepIsComplete(step, form),
    [step, form],
  );

  /* ── Navigate forward / backward ── */
  const goNext = useCallback(() => {
    if (step < TOTAL_STEPS) {
      setStep((s) => s + 1);
      window.scrollTo({ top: 0, behavior: "smooth" });
    } else {
      saveDraft(form);

      /* ── Legacy profile (confidence score, focus areas, etc.) ── */
      const profile = computeLearningProfile(form);
      saveProfile(profile);

      /* ── New scoring engine: convert answers + generate path ── */
      const answers = toQuestionnaireAnswers(form);
      const feedbackMap = loadFeedbackMap();
      const scored = generateLearningPath(LESSON_CATALOG, answers, {
        maxLessons: 8,
        feedbackMap,
      });
      const lessonIds = scored.map(l => l.id);

      // Build debug object: { lessonId: { score, topReasons } }
      const debug: Record<string, unknown> = {};
      for (const l of scored) {
        debug[l.id] = { score: l._score, reasons: l._reasons.slice(0, 5) };
      }

      // Save answers + path (Supabase if authed, localStorage always)
      saveAnswers(answers);               // fire-and-forget async
      saveLearningPath(lessonIds, debug); // fire-and-forget async

      navigate("/onboarding/complete");
    }
  }, [step, form, navigate]);

  const goBack = useCallback(() => {
    if (step > 1) {
      setStep((s) => s - 1);
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  }, [step]);

  /* ── Restart: clear all state and regenerate ── */
  const restart = useCallback(() => {
    try { localStorage.removeItem(LS_KEY); } catch { /* ignore */ }
    clearProfile();
    clearStoredProfile();
    clearProgress();
    setForm({});
    setStep(1);
  }, []);
  void restart; // exposed on window for dev/testing if needed

  if (!ready) return null;

  return (
    <OnboardingLayout
      step={step}
      title=""
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
      {step === 9 && <StepNine data={form} onChange={patch} />}
    </OnboardingLayout>
  );
};
