import React, { useState, useEffect, useCallback, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import {
  onboardingSchema,
  STEP_REQUIRED_FIELDS,
  STEP_SLIDER_DEFAULTS,
  TOTAL_STEPS,
  LS_KEY,
  LS_LEARNING_MODE,
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
import { StepZero } from "@/components/onboarding/StepZero";
import { StepOneNew } from "@/components/onboarding/StepOneNew";
import { StepTwoNew } from "@/components/onboarding/StepTwoNew";
import { StepThreeNew } from "@/components/onboarding/StepThreeNew";
import { StepFourNew } from "@/components/onboarding/StepFourNew";
import { StepFiveNew } from "@/components/onboarding/StepFiveNew";
import { StepSixNew } from "@/components/onboarding/StepSixNew";
import { StepSevenNew } from "@/components/onboarding/StepSevenNew";

/* Keys from the old questionnaire schema — if present, treat as old draft and clear so new flow shows */
const OLD_SCHEMA_KEYS = ["age", "workStatus", "incomeType", "incomeRange", "savingsRange", "debtRange", "benefits", "moneyStressors", "goalsThisYear"];

function isOldDraft(parsed: unknown): boolean {
  if (!parsed || typeof parsed !== "object") return false;
  return OLD_SCHEMA_KEYS.some((k) => k in (parsed as Record<string, unknown>));
}

/* ── Restore from localStorage (ignore old-format drafts so new questionnaire always shows) ── */
function loadFromStorage(): Partial<OnboardingData> {
  try {
    const raw = localStorage.getItem(LS_KEY);
    if (!raw) return {};
    const parsed = JSON.parse(raw) as unknown;
    if (isOldDraft(parsed)) {
      try {
        localStorage.removeItem(LS_KEY);
      } catch {
        /* ignore */
      }
      return {};
    }
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
    /* Step 1 + Browse: skip questionnaire, go to Library */
    if (step === 1 && form.learningMode === "browse") {
      try {
        localStorage.setItem(LS_LEARNING_MODE, "browse");
      } catch { /* ignore */ }
      saveDraft({ ...form, learningMode: "browse" });
      navigate("/library");
      return;
    }

    if (step < TOTAL_STEPS) {
      setStep((s) => s + 1);
      window.scrollTo({ top: 0, behavior: "smooth" });
    } else {
      saveDraft(form);
      try {
        localStorage.setItem(LS_LEARNING_MODE, "personalized");
      } catch { /* ignore */ }

      /* ── Legacy profile ── */
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

      const debug: Record<string, unknown> = {};
      for (const l of scored) {
        debug[l.id] = { score: l._score, reasons: l._reasons.slice(0, 5) };
      }

      saveAnswers(answers);
      saveLearningPath(lessonIds, debug);

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

  const isBrowseStep = step === 1 && form.learningMode === "browse";
  const nextLabel = isBrowseStep ? "Go to Library" : step === TOTAL_STEPS ? "See my path" : "Next";

  if (!ready) return null;

  return (
    <OnboardingLayout
      step={step}
      title=""
      canNext={canNext}
      onBack={goBack}
      onNext={goNext}
      isLastStep={step === TOTAL_STEPS || isBrowseStep}
      nextLabel={nextLabel}
    >
      {step === 1 && <StepZero data={form} onChange={patch} />}
      {step === 2 && <StepOneNew data={form} onChange={patch} />}
      {step === 3 && <StepTwoNew data={form} onChange={patch} />}
      {step === 4 && <StepThreeNew data={form} onChange={patch} />}
      {step === 5 && <StepFourNew data={form} onChange={patch} />}
      {step === 6 && <StepFiveNew data={form} onChange={patch} />}
      {step === 7 && <StepSixNew data={form} onChange={patch} />}
      {step === 8 && <StepSevenNew data={form} onChange={patch} />}
    </OnboardingLayout>
  );
};
