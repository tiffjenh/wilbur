/**
 * Auth state provider for Supabase (magic link).
 * Exposes: user, session, loading, signInWithOtp, signOut.
 * Runs localStorage → Supabase migration when user becomes authenticated.
 */
import React, { createContext, useContext, useEffect, useState, useCallback } from "react";
import type { User, Session } from "@supabase/supabase-js";
import { supabase } from "@/lib/supabaseClient";
import { saveUserProfileToSupabase, savePathToSupabase } from "@/lib/supabase";
import { loadAnswersSync } from "@/lib/storage/userProfile";
import { loadCompletedSync, loadFeedbackSync } from "@/lib/storage/lessonProgress";
import { saveFeedbackToSupabase } from "@/lib/supabase";
import { markLessonCompletedInSupabase } from "@/lib/supabase";
import type { QuestionnaireAnswers } from "@/lib/recommendation/types";

const LS_MIGRATED_KEY = "wilbur_supabase_migrated";

interface AuthContextValue {
  user: User | null;
  session: Session | null;
  loading: boolean;
  signInWithOtp: (email: string) => Promise<{ error: Error | null }>;
  signOut: () => Promise<void>;
}

const AuthContext = createContext<AuthContextValue | null>(null);

export function useAuth(): AuthContextValue {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within AuthProvider");
  return ctx;
}

/** Migrate localStorage profile + path + progress/feedback to Supabase for the given user. */
async function migrateLocalStorageToSupabase(userId: string): Promise<void> {
  try {
    if (localStorage.getItem(LS_MIGRATED_KEY) === userId) return;
  } catch {
    return;
  }

  const answers: QuestionnaireAnswers | null = loadAnswersSync();
  if (answers) {
    await saveUserProfileToSupabase(userId, answers).catch(() => {});
  }

  const pathRaw = localStorage.getItem("wilbur_learning_path");
  if (pathRaw) {
    try {
      const lessonIds = JSON.parse(pathRaw) as string[];
      if (Array.isArray(lessonIds) && lessonIds.length > 0) {
        await savePathToSupabase(userId, lessonIds, {}).catch(() => {});
      }
    } catch { /* ignore */ }
  }

  const completed = loadCompletedSync();
  for (const lessonId of completed) {
    await markLessonCompletedInSupabase(userId, lessonId).catch(() => {});
  }

  const feedbackMap = loadFeedbackSync();
  for (const [lessonId, feedback] of Object.entries(feedbackMap)) {
    await saveFeedbackToSupabase(userId, lessonId, feedback).catch(() => {});
  }

  try {
    localStorage.setItem(LS_MIGRATED_KEY, userId);
  } catch { /* ignore */ }
}

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!supabase) {
      setLoading(false);
      return;
    }

    supabase.auth.getSession().then(({ data: { session: s } }) => {
      setSession(s);
      setUser(s?.user ?? null);
      if (s?.user) {
        migrateLocalStorageToSupabase(s.user.id).catch(() => {});
      }
      setLoading(false);
    });

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, s) => {
      setSession(s);
      setUser(s?.user ?? null);
      if (s?.user) {
        migrateLocalStorageToSupabase(s.user.id).catch(() => {});
      }
    });

    return () => subscription.unsubscribe();
  }, []);

  const signInWithOtp = useCallback(async (email: string): Promise<{ error: Error | null }> => {
    if (!supabase) return { error: new Error("Supabase not configured") };
    const origin = typeof window !== "undefined" ? window.location.origin : "";
    const { error } = await supabase.auth.signInWithOtp({
      email: email.trim(),
      options: {
        emailRedirectTo: `${origin}/auth/callback`,
      },
    });
    return { error: error ? new Error(error.message) : null };
  }, []);

  const signOut = useCallback(async () => {
    if (!supabase) return;
    await supabase.auth.signOut();
    setUser(null);
    setSession(null);
  }, []);

  const value: AuthContextValue = {
    user,
    session,
    loading,
    signInWithOtp,
    signOut,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}
