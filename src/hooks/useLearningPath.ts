/**
 * useLearningPath — React hook for the personalized lesson path.
 *
 * Returns:
 *   lessons      — ordered ScoredLesson[] (up to maxLessons)
 *   isLoading    — true during initial load
 *   completed    — set of completed lesson ids
 *   getReasons   — (lessonId) → top 3 human-readable "why" strings
 *   getTopReason — (lessonId) → single best reason string for inline display
 *   handleFeedback — record thumbs up/down/already know + regenerate path
 *   handleComplete — mark lesson done + regenerate path
 *   refresh      — re-score and regenerate
 */
import { useState, useEffect, useCallback, useRef } from "react";
import { LESSON_CATALOG, LESSON_CATALOG_BY_ID } from "@/content/lessons/lessonCatalog";
import { generateLearningPath, type GenerateOpts } from "@/lib/recommendation/generatePath";
import type { ScoredLesson, LessonFeedback } from "@/lib/recommendation/types";
import { loadAnswersSync } from "@/lib/storage/userProfile";
import { loadCompletedSync, loadFeedbackSync, markComplete, saveFeedback } from "@/lib/storage/lessonProgress";
import { loadUserAddedSync, loadUserAdded } from "@/lib/storage/userAddedLessons";
import { toQuestionnaireAnswers } from "@/lib/recommendation/adapter";
import { loadAnswersFromStorage } from "@/lib/recommendation/adapter";

/* ── Format a reason string for display ──────────────────── */

function formatReason(raw: string): string {
  // Strip the "+N " prefix and capitalise
  const clean = raw.replace(/^[+-]\d+\s+/, "").trim();
  return clean.charAt(0).toUpperCase() + clean.slice(1);
}

/** Return top N reasons, formatted as human-readable strings. */
function topReasons(reasons: string[], n = 3): string[] {
  // Filter out gating/penalty lines, keep positive signals
  return reasons
    .filter(r => !r.startsWith("-") && !r.includes("gated"))
    .slice(0, n)
    .map(formatReason);
}

/* ── Hook ─────────────────────────────────────────────────── */

export interface UseLearningPathOptions {
  maxLessons?: number;
}

export interface LessonWithMeta extends ScoredLesson {
  isCompleted: boolean;
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
}

export function useLearningPath(opts: UseLearningPathOptions = {}): UseLearningPathResult {
  const { maxLessons = 8 } = opts;
  const [lessons, setLessons] = useState<LessonWithMeta[]>([]);
  const [recommendedLessons, setRecommendedLessons] = useState<LessonWithMeta[]>([]);
  const [savedLessons, setSavedLessons] = useState<LessonWithMeta[]>([]);
  const [completed, setCompleted] = useState<Set<string>>(new Set());
  const [isLoading, setIsLoading] = useState(true);
  const reasonsMap = useRef<Record<string, string[]>>({});

  const generate = useCallback(() => {
    const answers = loadAnswersFromStorage()
      ?? toQuestionnaireAnswers({}); // fallback to defaults

    const completedList = loadCompletedSync();
    const feedbackMap   = loadFeedbackSync();
    const userAddedIds  = loadUserAddedSync();

    const genOpts: GenerateOpts = {
      maxLessons,
      completedLessonIds: completedList,
      feedbackMap,
    };

    const scored = generateLearningPath(LESSON_CATALOG, answers, genOpts);
    const recommendedIds = new Set(scored.map(l => l.id));

    // User-added not already in recommended → "Saved / Added by you"
    const savedFromCatalog = userAddedIds
      .filter(id => !recommendedIds.has(id))
      .map(id => LESSON_CATALOG_BY_ID[id])
      .filter(Boolean) as ScoredLesson[];

    const savedWithMeta: LessonWithMeta[] = savedFromCatalog.map(l => ({
      ...l,
      _score: 0,
      _reasons: [],
      isCompleted: completedList.includes(l.id),
    }));

    const recommendedWithMeta: LessonWithMeta[] = scored.map(l => ({
      ...l,
      isCompleted: completedList.includes(l.id),
    }));

    const completedSet = new Set(completedList);
    const mergedLessons = [...recommendedWithMeta, ...savedWithMeta];

    const newReasonsMap: Record<string, string[]> = {};
    for (const l of scored) {
      newReasonsMap[l.id] = l._reasons;
    }
    reasonsMap.current = newReasonsMap;

    setCompleted(completedSet);
    setLessons(mergedLessons);
    setRecommendedLessons(recommendedWithMeta);
    setSavedLessons(savedWithMeta);
    setIsLoading(false);
  }, [maxLessons]);

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

  const handleFeedback = useCallback((lessonId: string, feedback: LessonFeedback) => {
    saveFeedback(lessonId, feedback); // async but fire-and-forget
    generate(); // re-score with updated feedback
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
  };
}

// Re-export loadAnswersSync and loadAnswersFromStorage for convenience
export { loadAnswersSync, loadAnswersFromStorage };
