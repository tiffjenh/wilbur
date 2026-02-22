/**
 * Supabase: client + database helpers.
 * Client is created in supabaseClient.ts from VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY.
 */
import { supabase } from "./supabaseClient";
import type { QuestionnaireAnswers, LessonFeedback } from "./recommendation/types";

export { supabase };

/* ── Database row types (mirror schema.sql) ─────────────── */

export interface UserProfileRow {
  user_id: string;
  age_range: string;
  work_status: string;
  income_type: string;
  annual_income: string;
  savings: string;
  debt: string;
  benefits: string[];
  invested_before: string;
  goals_this_year: string[];
  goals_3to5: string[];
  stressors: string[];
  confidence: number;
  state_code: string;
}

export interface UserPathRow {
  id: string;
  user_id: string;
  lesson_ids: string[];
  debug: Record<string, unknown>;
}

export interface LessonProgressRow {
  id: string;
  user_id: string;
  lesson_id: string;
  status: "not_started" | "in_progress" | "completed";
  percent: number;
  completed_at: string | null;
}

export interface LessonFeedbackRow {
  id: string;
  user_id: string;
  lesson_id: string;
  feedback: LessonFeedback;
}

/* ── Auth helpers ─────────────────────────────────────────── */

/** Returns the authenticated user id, or null if not signed in. */
export async function getCurrentUserId(): Promise<string | null> {
  if (!supabase) return null;
  try {
    const { data } = await supabase.auth.getUser();
    return data.user?.id ?? null;
  } catch {
    return null;
  }
}

/** Returns true if Supabase is configured and a user is signed in. */
export async function isAuthenticated(): Promise<boolean> {
  return (await getCurrentUserId()) !== null;
}

/* ── User profile ─────────────────────────────────────────── */

/** Upsert questionnaire answers into user_profiles. */
export async function saveUserProfileToSupabase(
  userId: string,
  answers: QuestionnaireAnswers,
): Promise<void> {
  if (!supabase) return;
  const row: UserProfileRow = {
    user_id:        userId,
    age_range:      answers.ageRange,
    work_status:    answers.workStatus,
    income_type:    answers.incomeType,
    annual_income:  answers.annualIncome,
    savings:        answers.savings,
    debt:           answers.debt,
    benefits:       answers.benefits,
    invested_before: answers.investedBefore,
    goals_this_year: answers.goalsThisYear,
    goals_3to5:      answers.goals3to5,
    stressors:       answers.stressors,
    confidence:      answers.confidence,
    state_code:      answers.stateCode,
  };
  await supabase.from("user_profiles").upsert(row, { onConflict: "user_id" });
}

/** Load user_profiles row and convert back to QuestionnaireAnswers. */
export async function loadUserProfileFromSupabase(
  userId: string,
): Promise<QuestionnaireAnswers | null> {
  if (!supabase) return null;
  const { data } = await supabase
    .from("user_profiles")
    .select("*")
    .eq("user_id", userId)
    .single();
  if (!data) return null;
  const r = data as UserProfileRow;
  return {
    ageRange:      r.age_range as QuestionnaireAnswers["ageRange"],
    workStatus:    r.work_status as QuestionnaireAnswers["workStatus"],
    incomeType:    r.income_type as QuestionnaireAnswers["incomeType"],
    annualIncome:  r.annual_income as QuestionnaireAnswers["annualIncome"],
    savings:       r.savings as QuestionnaireAnswers["savings"],
    debt:          r.debt as QuestionnaireAnswers["debt"],
    benefits:      r.benefits as QuestionnaireAnswers["benefits"],
    investedBefore: r.invested_before as QuestionnaireAnswers["investedBefore"],
    goalsThisYear:  r.goals_this_year as QuestionnaireAnswers["goalsThisYear"],
    goals3to5:      r.goals_3to5 as QuestionnaireAnswers["goals3to5"],
    stressors:      r.stressors as QuestionnaireAnswers["stressors"],
    confidence:     r.confidence as QuestionnaireAnswers["confidence"],
    stateCode:      r.state_code,
  };
}

/* ── Learning path ────────────────────────────────────────── */

/** Save ordered lesson id list + optional debug reasons to user_paths. */
export async function savePathToSupabase(
  userId: string,
  lessonIds: string[],
  debug: Record<string, unknown> = {},
): Promise<void> {
  if (!supabase) return;
  await supabase.from("user_paths").insert({
    user_id:    userId,
    lesson_ids: lessonIds,
    debug,
  });
}

/** Fetch the most recent path for a user. */
export async function loadPathFromSupabase(userId: string): Promise<string[] | null> {
  if (!supabase) return null;
  const { data } = await supabase
    .from("user_paths")
    .select("lesson_ids")
    .eq("user_id", userId)
    .order("created_at", { ascending: false })
    .limit(1)
    .single();
  return (data as UserPathRow | null)?.lesson_ids ?? null;
}

/* ── Lesson progress ──────────────────────────────────────── */

/** Upsert a lesson as completed. */
export async function markLessonCompletedInSupabase(
  userId: string,
  lessonId: string,
): Promise<void> {
  if (!supabase) return;
  await supabase.from("lesson_progress").upsert(
    {
      user_id:      userId,
      lesson_id:    lessonId,
      status:       "completed",
      percent:      100,
      completed_at: new Date().toISOString(),
    },
    { onConflict: "user_id,lesson_id" },
  );
}

/** Get all completed lesson ids for a user. */
export async function loadCompletedLessonsFromSupabase(userId: string): Promise<string[]> {
  if (!supabase) return [];
  const { data } = await supabase
    .from("lesson_progress")
    .select("lesson_id")
    .eq("user_id", userId)
    .eq("status", "completed");
  return (data ?? []).map((r: { lesson_id: string }) => r.lesson_id);
}

/* ── Feedback ─────────────────────────────────────────────── */

/** Insert a feedback row. */
export async function saveFeedbackToSupabase(
  userId: string,
  lessonId: string,
  feedback: LessonFeedback,
): Promise<void> {
  if (!supabase) return;
  await supabase.from("lesson_feedback").insert({ user_id: userId, lesson_id: lessonId, feedback });
}

/** Load all feedback for a user as a lessonId → feedback map. */
export async function loadFeedbackMapFromSupabase(
  userId: string,
): Promise<Record<string, LessonFeedback>> {
  if (!supabase) return {};
  const { data } = await supabase
    .from("lesson_feedback")
    .select("lesson_id,feedback")
    .eq("user_id", userId);
  const map: Record<string, LessonFeedback> = {};
  for (const row of (data ?? []) as LessonFeedbackRow[]) {
    map[row.lesson_id] = row.feedback;
  }
  return map;
}

/* ── User-added lessons (Library "+ Add to Learning") ───────── */

/** Add a lesson to the user's saved list in Supabase. */
export async function addUserAddedLessonInSupabase(
  userId: string,
  lessonId: string,
): Promise<void> {
  if (!supabase) return;
  await supabase.from("user_added_lessons").upsert(
    { user_id: userId, lesson_id: lessonId },
    { onConflict: "user_id,lesson_id" },
  );
}

/** Remove a lesson from the user's saved list in Supabase. */
export async function removeUserAddedLessonInSupabase(
  userId: string,
  lessonId: string,
): Promise<void> {
  if (!supabase) return;
  await supabase.from("user_added_lessons").delete().eq("user_id", userId).eq("lesson_id", lessonId);
}

/** Load all user-added lesson ids from Supabase. */
export async function loadUserAddedLessonsFromSupabase(userId: string): Promise<string[]> {
  if (!supabase) return [];
  const { data } = await supabase
    .from("user_added_lessons")
    .select("lesson_id")
    .eq("user_id", userId);
  return (data ?? []).map((r: { lesson_id: string }) => r.lesson_id);
}
