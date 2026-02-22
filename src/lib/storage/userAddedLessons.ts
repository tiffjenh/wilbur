/**
 * User-added lessons ("Add to Learning" from Library).
 * Persists to localStorage when logged out, Supabase when logged in.
 */
import {
  getCurrentUserId,
  addUserAddedLessonInSupabase,
  removeUserAddedLessonInSupabase,
  loadUserAddedLessonsFromSupabase,
} from "@/lib/supabase";

const LS_USER_ADDED_KEY = "wilbur_user_added_lessons_v1";

/** Load user-added lesson ids synchronously from localStorage. */
export function loadUserAddedSync(): string[] {
  try {
    const raw = localStorage.getItem(LS_USER_ADDED_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

/** Load user-added lesson ids — Supabase first when authed, else localStorage. */
export async function loadUserAdded(): Promise<string[]> {
  const userId = await getCurrentUserId();
  if (userId) {
    const fromSupabase = await loadUserAddedLessonsFromSupabase(userId).catch(() => []);
    if (fromSupabase.length > 0) return fromSupabase;
  }
  return loadUserAddedSync();
}

/** Add a lesson to the user's learning curriculum. */
export async function addLesson(lessonId: string): Promise<void> {
  try {
    const list = loadUserAddedSync();
    if (!list.includes(lessonId)) {
      list.push(lessonId);
      localStorage.setItem(LS_USER_ADDED_KEY, JSON.stringify(list));
    }
  } catch { /* ignore */ }

  const userId = await getCurrentUserId();
  if (userId) {
    await addUserAddedLessonInSupabase(userId, lessonId).catch(() => {});
  }
}

/** Remove a lesson from the user's learning curriculum. */
export async function removeLesson(lessonId: string): Promise<void> {
  try {
    const list = loadUserAddedSync().filter((id) => id !== lessonId);
    localStorage.setItem(LS_USER_ADDED_KEY, JSON.stringify(list));
  } catch { /* ignore */ }

  const userId = await getCurrentUserId();
  if (userId) {
    await removeUserAddedLessonInSupabase(userId, lessonId).catch(() => {});
  }
}

/** Return true if the lesson is in the user's added list (sync check). */
export function isAddedSync(lessonId: string): boolean {
  return loadUserAddedSync().includes(lessonId);
}
