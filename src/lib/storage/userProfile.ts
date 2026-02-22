/**
 * User profile storage.
 * Saves to Supabase when authenticated, falls back to localStorage.
 * Transparent to callers — always call the same functions.
 */
import type { QuestionnaireAnswers } from "@/lib/recommendation/types";
import {
  getCurrentUserId,
  saveUserProfileToSupabase,
  loadUserProfileFromSupabase,
  savePathToSupabase,
  loadPathFromSupabase,
} from "@/lib/supabase";

const LS_ANSWERS_KEY = "wilbur_questionnaire_answers";
const LS_PATH_KEY    = "wilbur_learning_path";

/* ── Questionnaire answers ────────────────────────────────── */

/** Save questionnaire answers to Supabase (if authed) and localStorage. */
export async function saveAnswers(answers: QuestionnaireAnswers): Promise<void> {
  // Always save to localStorage for offline/unauthenticated access
  try {
    localStorage.setItem(LS_ANSWERS_KEY, JSON.stringify(answers));
  } catch { /* ignore */ }

  // Also save to Supabase if logged in
  const userId = await getCurrentUserId();
  if (userId) {
    await saveUserProfileToSupabase(userId, answers).catch(() => {/* non-fatal */});
  }
}

/** Load questionnaire answers — Supabase first, then localStorage. */
export async function loadAnswers(): Promise<QuestionnaireAnswers | null> {
  const userId = await getCurrentUserId();
  if (userId) {
    const fromSupabase = await loadUserProfileFromSupabase(userId).catch(() => null);
    if (fromSupabase) return fromSupabase;
  }
  try {
    const raw = localStorage.getItem(LS_ANSWERS_KEY);
    return raw ? JSON.parse(raw) as QuestionnaireAnswers : null;
  } catch {
    return null;
  }
}

/** Load answers synchronously from localStorage only (for hooks that can't await). */
export function loadAnswersSync(): QuestionnaireAnswers | null {
  try {
    const raw = localStorage.getItem(LS_ANSWERS_KEY);
    return raw ? JSON.parse(raw) as QuestionnaireAnswers : null;
  } catch {
    return null;
  }
}

/* ── Learning path ────────────────────────────────────────── */

/** Save the generated path (ordered lesson ids + optional debug). */
export async function saveLearningPath(
  lessonIds: string[],
  debug: Record<string, unknown> = {},
): Promise<void> {
  try {
    localStorage.setItem(LS_PATH_KEY, JSON.stringify(lessonIds));
  } catch { /* ignore */ }

  const userId = await getCurrentUserId();
  if (userId) {
    await savePathToSupabase(userId, lessonIds, debug).catch(() => {/* non-fatal */});
  }
}

/** Load the saved path — Supabase first, then localStorage. */
export async function loadLearningPath(): Promise<string[] | null> {
  const userId = await getCurrentUserId();
  if (userId) {
    const fromSupabase = await loadPathFromSupabase(userId).catch(() => null);
    if (fromSupabase?.length) return fromSupabase;
  }
  try {
    const raw = localStorage.getItem(LS_PATH_KEY);
    return raw ? JSON.parse(raw) : null;
  } catch {
    return null;
  }
}

/** Clear all stored profile data (call on questionnaire restart). */
export function clearStoredProfile(): void {
  try {
    localStorage.removeItem(LS_ANSWERS_KEY);
    localStorage.removeItem(LS_PATH_KEY);
  } catch { /* ignore */ }
}
