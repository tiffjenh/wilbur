/**
 * useLearningPath — React hook for the personalized lesson path.
 * Uses curriculum.ts as the lesson source. Recommendation affects ordering + highlighting only (no locking).
 *
 * Returns:
 *   lessons      — ordered list: recommended first, then saved (curriculum lesson + meta)
 *   recommendedLessons — ranked recommended only
 *   savedLessons — user-added not already in recommended
 *   isLoading, completed, getReasons, getTopReason, etc.
 */
import { useState, useEffect, useCallback, useRef } from "react";
import { CURRICULUM } from "@/lib/curriculum/curriculum";
import type { Lesson as CurriculumLesson } from "@/lib/curriculum/curriculum";
import type { LessonFeedback } from "@/lib/recommendation/types";
import { computePersonaTags } from "@/lib/recommendation/profileTags";
import { loadCompletedSync, loadFeedbackSync, markComplete, saveFeedback } from "@/lib/storage/lessonProgress";
import { loadUserAddedSync, loadUserAdded } from "@/lib/storage/userAddedLessons";
import { toQuestionnaireAnswers, loadAnswersFromStorage } from "@/lib/recommendation/adapter";
import { LS_LEARNING_MODE } from "@/lib/onboardingSchema";
import { computePersonalizationProfile } from "@/lib/personalization/scoring";
import { recommendLessons, getLessonScoreAndReasons, type CurriculumLessonForRecommend } from "@/lib/personalization/recommend";

const CURRICULUM_BY_ID: Record<string, CurriculumLesson> = Object.fromEntries(
  CURRICULUM.lessons.map((l) => [l.id, l]),
);

function toRecommendShape(c: CurriculumLesson): CurriculumLessonForRecommend {
  return { id: c.id, level: c.level, tags: c.tags, prerequisites: c.prerequisites };
}

const CURRICULUM_FOR_RECOMMEND: CurriculumLessonForRecommend[] = CURRICULUM.lessons.map(toRecommendShape);

/* ── Human-readable "Why recommended" copy ──────────────────── */

const REASON_DISPLAY: Record<string, string> = {
  "goal: home down payment": "Because you're saving for a home in 3–5 years.",
  "goal: credit for mortgage": "Because your credit score matters for mortgage rates.",
  "you've invested before: skipping beginner investing": "Because you've invested before, we're skipping the beginner investing module.",
  "prime home window": "Because you're in a common home-buying age range.",
  "retirement priority": "Because you're 45+, retirement planning is a priority.",
  "retirement planning": "Because you're in the 35–44 range, retirement is relevant.",
  "insurance relevance": "Because insurance and planning matter for your stage.",
  "tax planning": "Because tax planning is relevant for your situation.",
  "never invested": "Because you're new to investing.",
  "confidence low: foundations": "Because you said you feel less confident, we're starting with foundations.",
  "no savings: emergency fund": "Because you don't have savings yet, we're starting with an emergency fund.",
  "goal: pay off debt": "Because paying off debt is one of your goals.",
  "goal: emergency fund": "Because building an emergency fund is one of your goals.",
  "goal: build investments": "Because building investments is one of your goals.",
  "regular investor": "Because you invest regularly, we're including growth topics.",
};

function formatReason(raw: string): string {
  const clean = raw.replace(/^[+-]\d+\s+/, "").trim();
  const display = REASON_DISPLAY[clean];
  if (display) return display;
  return clean.charAt(0).toUpperCase() + clean.slice(1);
}

/** Return top N reasons, formatted as human-readable strings. */
function topReasons(reasons: string[], n = 3): string[] {
  return reasons
    .filter(r => !r.startsWith("-") && !r.includes("gated"))
    .slice(0, n)
    .map(formatReason);
}

/* ── Hook ─────────────────────────────────────────────────── */

export interface UseLearningPathOptions {
  maxLessons?: number;
}

/** Display shape: curriculum lesson + scoring meta (no locking). */
export interface LessonWithMeta extends CurriculumLesson {
  _score: number;
  _reasons: string[];
  isCompleted: boolean;
}

export interface LearningPathDebugInfo {
  rawAnswers: Record<string, unknown> | null;
  personaTags: string[];
  tier: string;
  pathLessons: { id: string; title: string; reasons: string[] }[];
  top10Scores: { id: string; title: string; score: number; reasons: string[] }[];
}

export interface UseLearningPathResult {
  /** Recommended lessons first, then saved (user-added) not in recommended — all in one list for sidebar */
  lessons: LessonWithMeta[];
  /** Recommended only (for "Your Learning Path" section) */
  recommendedLessons: LessonWithMeta[];
  /** User-added lessons not already in recommended (for "Saved / Added by you" section) */
  savedLessons: LessonWithMeta[];
  isLoading: boolean;
  completed: Set<string>;
  getReasons: (lessonId: string) => string[];
  getTopReason: (lessonId: string) => string | null;
  handleFeedback: (lessonId: string, feedback: LessonFeedback) => void;
  handleComplete: (lessonId: string) => void;
  refresh: () => void;
  /** Set only in dev (NODE_ENV !== 'production'): raw answers, persona tags, top 10 lesson scores */
  debugInfo: LearningPathDebugInfo | null;
  /** Set when path generation fails (e.g. no answers or throw) */
  pathError: string | null;
}

export function useLearningPath(opts: UseLearningPathOptions = {}): UseLearningPathResult {
  const { maxLessons = 8 } = opts;
  const [lessons, setLessons] = useState<LessonWithMeta[]>([]);
  const [recommendedLessons, setRecommendedLessons] = useState<LessonWithMeta[]>([]);
  const [savedLessons, setSavedLessons] = useState<LessonWithMeta[]>([]);
  const [completed, setCompleted] = useState<Set<string>>(new Set());
  const [isLoading, setIsLoading] = useState(true);
  const [pathError, setPathError] = useState<string | null>(null);
  const [debugInfo, setDebugInfo] = useState<LearningPathDebugInfo | null>(null);
  const reasonsMap = useRef<Record<string, string[]>>({});

  const isDev = typeof process !== "undefined" && process.env?.NODE_ENV !== "production";

  const generate = useCallback(() => {
    setPathError(null);
    const completedList = loadCompletedSync();
    const userAddedIds = loadUserAddedSync();

    const isBrowseMode =
      typeof localStorage !== "undefined" && localStorage.getItem(LS_LEARNING_MODE) === "browse";

    try {
      const answers = loadAnswersFromStorage() ?? toQuestionnaireAnswers({});
      const input = {
        debt: answers.debt,
        emergencySavings: answers.emergencySavings,
        investedBefore: answers.investedBefore,
        goals3to5: answers.goals3to5,
        goalsThisYear: answers.goalsThisYear,
        topics: answers.topics,
        confidence: answers.confidence,
        stateCode: answers.stateCode,
      };
      const profile = computePersonalizationProfile(isBrowseMode ? {} : input);
      const orderedIds = recommendLessons(profile, CURRICULUM_FOR_RECOMMEND);

      const completedSet = new Set(completedList);
      const recommendedIdsOrdered = orderedIds.filter((id) => !completedSet.has(id)).slice(0, maxLessons);
      const recommendedIds = new Set(recommendedIdsOrdered);

      const savedCurriculum = userAddedIds
        .filter((id) => !recommendedIds.has(id))
        .map((id) => CURRICULUM_BY_ID[id])
        .filter(Boolean);

      const savedWithMeta: LessonWithMeta[] = savedCurriculum.map((l) => ({
        ...l,
        _score: 0,
        _reasons: [],
        isCompleted: completedList.includes(l.id),
      }));

      const newReasonsMap: Record<string, string[]> = {};
      const recommendedWithMeta: LessonWithMeta[] = recommendedIdsOrdered.map((id) => {
        const cur = CURRICULUM_BY_ID[id];
        const recShape = cur ? toRecommendShape(cur) : null;
        const { score, reasons } = recShape
          ? getLessonScoreAndReasons(recShape, profile)
          : { score: 0, reasons: [] as string[] };
        newReasonsMap[id] = reasons;
        if (cur) {
          return { ...cur, _score: score, _reasons: reasons, isCompleted: completedList.includes(id) };
        }
        return {
          id,
          title: id,
          domainId: "",
          level: "beginner" as const,
          tags: [],
          prerequisites: [],
          estimatedMinutes: 0,
          formatHints: [],
          _score: score,
          _reasons: reasons,
          isCompleted: completedList.includes(id),
        } as LessonWithMeta;
      });

      const mergedLessons = [...recommendedWithMeta, ...savedWithMeta];
      reasonsMap.current = newReasonsMap;

      setCompleted(completedSet);
      setLessons(mergedLessons);
      setRecommendedLessons(recommendedWithMeta);
      setSavedLessons(savedWithMeta);
      setIsLoading(false);

      if (isDev) {
        const pathLessons = recommendedWithMeta.map((l) => ({
          id: l.id,
          title: l.title,
          reasons: l._reasons ?? [],
        }));
        const top10 = recommendedIdsOrdered.slice(0, 10).map((id) => {
          const cur = CURRICULUM_BY_ID[id];
          const recShape = cur ? toRecommendShape(cur) : null;
          const { score, reasons } = recShape
            ? getLessonScoreAndReasons(recShape, profile)
            : { score: 0, reasons: [] as string[] };
          return { id, title: cur?.title ?? id, score, reasons };
        });
        setDebugInfo({
          rawAnswers: (isBrowseMode ? { learningMode: "browse" } : answers) as unknown as Record<string, unknown>,
          personaTags: isBrowseMode ? [] : computePersonaTags(answers),
          tier: isBrowseMode ? "browse" : profile.targetLevel,
          pathLessons,
          top10Scores: top10,
        });
        if (!isBrowseMode) {
          console.log("[Learning Path]", {
            tier: profile.targetLevel,
            pathLessonIds: pathLessons.map((p) => p.id),
            pathLessonTitles: pathLessons.map((p) => p.title),
            why: pathLessons.map((p) => ({ id: p.id, topReason: p.reasons[0] ?? "" })),
            storedAnswers: answers,
          });
        }
      }
    } catch (e) {
      const message = e instanceof Error ? e.message : "Path generation failed";
      setPathError(message);
      if (isDev) console.error("[useLearningPath] generate failed:", e);
      setLessons([]);
      setRecommendedLessons([]);
      setSavedLessons([]);
      setIsLoading(false);
    }
  }, [maxLessons, isDev]);

  // Initial load
  useEffect(() => {
    generate();
  }, [generate]);

  // When logged in, sync user-added from Supabase and refresh path
  useEffect(() => {
    loadUserAdded().then((ids) => {
      const local = loadUserAddedSync();
      if (
        ids.length !== local.length ||
        ids.some((id, i) => id !== local[i])
      ) {
        try {
          localStorage.setItem(
            "wilbur_user_added_lessons_v1",
            JSON.stringify(ids),
          );
        } catch {
          /* ignore */
        }
        generate();
      }
    });
  }, [generate]);

  const getReasons = useCallback((lessonId: string): string[] => {
    return topReasons(reasonsMap.current[lessonId] ?? []);
  }, []);

  const getTopReason = useCallback((lessonId: string): string | null => {
    const reasons = topReasons(reasonsMap.current[lessonId] ?? [], 1);
    return reasons[0] ?? null;
  }, []);

  const handleFeedback = useCallback(async (lessonId: string, feedback: LessonFeedback) => {
    await saveFeedback(lessonId, feedback);
    if (feedback === "already_know_this") {
      await markComplete(lessonId);
    }
    generate(); // re-score and update path immediately
  }, [generate]);

  const handleComplete = useCallback((lessonId: string) => {
    markComplete(lessonId); // async but fire-and-forget
    generate(); // refresh path
  }, [generate]);

  return {
    lessons,
    recommendedLessons,
    savedLessons,
    isLoading,
    completed,
    getReasons,
    getTopReason,
    handleFeedback,
    handleComplete,
    refresh: generate,
    debugInfo: isDev ? debugInfo : null,
    pathError,
  };
}

export { loadAnswersFromStorage };
