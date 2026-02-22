/**
 * Lesson progress + feedback storage.
 * Saves to Supabase when authenticated, falls back to localStorage.
 */
import type { LessonFeedback } from "@/lib/recommendation/types";
import {
  getCurrentUserId,
  markLessonCompletedInSupabase,
  loadCompletedLessonsFromSupabase,
  saveFeedbackToSupabase,
  loadFeedbackMapFromSupabase,
} from "@/lib/supabase";

const LS_COMPLETED_KEY = "wilbur_completed_lessons_v2";
const LS_FEEDBACK_KEY  = "wilbur_lesson_feedback_v2";

/* ── Completed lessons ────────────────────────────────────── */

/** Mark a lesson as completed. Saves to both Supabase and localStorage. */
export async function markComplete(lessonId: string): Promise<void> {
  // localStorage
  try {
    const list = loadCompletedSync();
    if (!list.includes(lessonId)) {
      list.push(lessonId);
      localStorage.setItem(LS_COMPLETED_KEY, JSON.stringify(list));
    }
  } catch { /* ignore */ }

  // Supabase
  const userId = await getCurrentUserId();
  if (userId) {
    await markLessonCompletedInSupabase(userId, lessonId).catch(() => {/* non-fatal */});
  }
}

/** Load completed lesson ids synchronously from localStorage. */
export function loadCompletedSync(): string[] {
  try {
    const raw = localStorage.getItem(LS_COMPLETED_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch { return []; }
}

/** Load completed lesson ids — Supabase first, then localStorage. */
export async function loadCompleted(): Promise<string[]> {
  const userId = await getCurrentUserId();
  if (userId) {
    const fromSupabase = await loadCompletedLessonsFromSupabase(userId).catch(() => null);
    if (fromSupabase?.length) return fromSupabase;
  }
  return loadCompletedSync();
}

/* ── Feedback ─────────────────────────────────────────────── */

/** Save a feedback reaction. Saves to both Supabase and localStorage. */
export async function saveFeedback(lessonId: string, feedback: LessonFeedback): Promise<void> {
  // localStorage
  try {
    const map = loadFeedbackSync();
    map[lessonId] = feedback;
    localStorage.setItem(LS_FEEDBACK_KEY, JSON.stringify(map));
  } catch { /* ignore */ }

  // Supabase
  const userId = await getCurrentUserId();
  if (userId) {
    await saveFeedbackToSupabase(userId, lessonId, feedback).catch(() => {/* non-fatal */});
  }
}

/** Load feedback map synchronously from localStorage. */
export function loadFeedbackSync(): Record<string, LessonFeedback> {
  try {
    const raw = localStorage.getItem(LS_FEEDBACK_KEY);
    return raw ? JSON.parse(raw) : {};
  } catch { return {}; }
}

/** Load feedback map — Supabase first, then localStorage. */
export async function loadFeedback(): Promise<Record<string, LessonFeedback>> {
  const userId = await getCurrentUserId();
  if (userId) {
    const fromSupabase = await loadFeedbackMapFromSupabase(userId).catch(() => null);
    if (fromSupabase && Object.keys(fromSupabase).length > 0) return fromSupabase;
  }
  return loadFeedbackSync();
}

/** Clear all progress + feedback (call on questionnaire restart). */
export function clearProgress(): void {
  try {
    localStorage.removeItem(LS_COMPLETED_KEY);
    localStorage.removeItem(LS_FEEDBACK_KEY);
  } catch { /* ignore */ }
}
