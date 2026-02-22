import type { Lesson, QuestionnaireAnswers, LessonFeedback, ScoredLesson } from "./types";
import { scoreLesson } from "./scoring";

export type GenerateOpts = {
  maxLessons?: number; // default 8
  completedLessonIds?: string[];
  feedbackMap?: Record<string, LessonFeedback | undefined>;
};

function ensureDiversity(sorted: Lesson[], _a: QuestionnaireAnswers): Lesson[] {
  // Ensure at least one "stability", one "risk", one "growth"
  const buckets = {
    stability: (l: Lesson) => l.tags.includes("budgeting") || l.tags.includes("emergency-fund") || l.tags.includes("money-basics"),
    risk: (l: Lesson) => l.tags.includes("debt") || l.tags.includes("credit") || l.tags.includes("student-loans"),
    growth: (l: Lesson) => l.tags.includes("investing-basics") || l.tags.includes("retirement") || l.tags.includes("benefits"),
  };

  const picked: Lesson[] = [];
  const used = new Set<string>();

  for (const key of Object.keys(buckets) as (keyof typeof buckets)[]) {
    const found = sorted.find(l => !used.has(l.id) && buckets[key](l));
    if (found) {
      picked.push(found);
      used.add(found.id);
    }
  }

  return picked;
}

export function generateLearningPath(
  allLessons: Lesson[],
  answers: QuestionnaireAnswers,
  opts: GenerateOpts = {},
): ScoredLesson[] {
  const maxLessons = opts.maxLessons ?? 8;
  const completed = new Set(opts.completedLessonIds ?? []);
  const feedbackMap = opts.feedbackMap ?? {};

  // 1) filter out completed only (no gating — all lessons are accessible; scoring demotes advanced)
  const candidates = allLessons.filter(l => !completed.has(l.id));

  // 2) score all (pass allLessons so tag-based feedback can boost/penalize by similar tags)
  const scored = candidates.map(l => {
    const res = scoreLesson(l, answers, feedbackMap, allLessons);
    return { lesson: l, score: res.score, reasons: res.reasons };
  });

  // 3) sort
  scored.sort((a, b) => b.score - a.score);

  const sortedLessons = scored.map(s => s.lesson);

  // 4) ensure diversity
  const seed = ensureDiversity(sortedLessons, answers);
  const selectedIds = new Set(seed.map(l => l.id));

  // 5) fill to max
  for (const l of sortedLessons) {
    if (selectedIds.size >= maxLessons) break;
    if (!selectedIds.has(l.id)) {
      seed.push(l);
      selectedIds.add(l.id);
    }
  }

  // return with debug scoring info for "Why recommended"
  return seed.map(l => {
    const match = scored.find(s => s.lesson.id === l.id);
    return { ...l, _score: match?.score ?? 0, _reasons: match?.reasons ?? [] };
  });
}

/** Return all candidates sorted by score (for dev debug panel). */
export function getScoredCandidates(
  allLessons: Lesson[],
  answers: QuestionnaireAnswers,
  opts: GenerateOpts = {},
): { id: string; title: string; score: number; reasons: string[] }[] {
  const completed = new Set(opts.completedLessonIds ?? []);
  const feedbackMap = opts.feedbackMap ?? {};
  const candidates = allLessons.filter(l => !completed.has(l.id));
  const scored = candidates.map(l => {
    const res = scoreLesson(l, answers, feedbackMap, allLessons);
    return { lesson: l, score: res.score, reasons: res.reasons };
  });
  scored.sort((a, b) => b.score - a.score);
  return scored.map(s => ({
    id: s.lesson.id,
    title: s.lesson.title,
    score: s.score,
    reasons: s.reasons,
  }));
}

/* ── localStorage-backed feedback & progress ─────────────── */

const LS_FEEDBACK_KEY  = "wilbur_lesson_feedback_v2";
const LS_COMPLETED_KEY = "wilbur_completed_lessons_v2";

export function loadFeedbackMap(): Record<string, LessonFeedback | undefined> {
  try {
    const raw = localStorage.getItem(LS_FEEDBACK_KEY);
    return raw ? JSON.parse(raw) : {};
  } catch { return {}; }
}

export function saveFeedback(lessonId: string, feedback: LessonFeedback): void {
  try {
    const map = loadFeedbackMap();
    map[lessonId] = feedback;
    localStorage.setItem(LS_FEEDBACK_KEY, JSON.stringify(map));
  } catch { /* ignore */ }
}

export function loadCompletedLessons(): string[] {
  try {
    const raw = localStorage.getItem(LS_COMPLETED_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch { return []; }
}

export function markLessonCompleted(lessonId: string): void {
  try {
    const list = loadCompletedLessons();
    if (!list.includes(lessonId)) {
      list.push(lessonId);
      localStorage.setItem(LS_COMPLETED_KEY, JSON.stringify(list));
    }
  } catch { /* ignore */ }
}

export function recordFeedback(entry: { lessonId: string; type: LessonFeedback; timestamp: string }): void {
  saveFeedback(entry.lessonId, entry.type);
}
