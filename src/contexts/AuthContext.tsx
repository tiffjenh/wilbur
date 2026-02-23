/**
 * Auth state provider for Supabase (magic link).
 * Exposes: user, session, loading, signInWithOtp, signOut.
 * Runs localStorage → Supabase migration when user becomes authenticated.
 */
import React, { createContext, useContext, useEffect, useState, useCallback } from "react";
import type { User, Session } from "@supabase/supabase-js";
import { supabase } from "@/lib/supabaseClient";
import { saveUserProfileToSupabase, savePathToSupabase, hydrateLocalStorageFromSupabase } from "@/lib/supabase";
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
  signInWithPassword: (email: string, password: string) => Promise<{ error: Error | null }>;
  signUp: (email: string, password: string, name: string) => Promise<{ error: Error | null }>;
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
        migrateLocalStorageToSupabase(s.user.id)
          .then(() => hydrateLocalStorageFromSupabase(s.user!.id))
          .catch(() => {});
      }
      setLoading(false);
    });

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, s) => {
      setSession(s);
      setUser(s?.user ?? null);
      if (s?.user) {
        migrateLocalStorageToSupabase(s.user.id)
          .then(() => hydrateLocalStorageFromSupabase(s.user!.id))
          .catch(() => {});
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

  const signInWithPassword = useCallback(async (email: string, password: string): Promise<{ error: Error | null; emailNotConfirmed?: boolean }> => {
    if (!supabase) return { error: new Error("Supabase not configured") };
    const { error } = await supabase.auth.signInWithPassword({
      email: email.trim(),
      password,
    });
    if (!error) return { error: null };
    const msg = error.message.toLowerCase();
    const emailNotConfirmed =
      msg.includes("email not confirmed") ||
      msg.includes("email_not_confirmed") ||
      msg.includes("confirm your email") ||
      msg.includes("verify your email");
    return { error: new Error(error.message), emailNotConfirmed };
  }, []);

  const signUp = useCallback(async (email: string, password: string, name: string): Promise<{ error: Error | null; requiresConfirmation?: boolean }> => {
    if (!supabase) return { error: new Error("Supabase not configured") };
    const origin = typeof window !== "undefined" ? window.location.origin : "";
    const { data, error } = await supabase.auth.signUp({
      email: email.trim(),
      password,
      options: {
        data: { full_name: name.trim() || undefined },
        emailRedirectTo: `${origin}/auth/callback`,
      },
    });
    if (error) return { error: new Error(error.message) };
    // When "Confirm email" is on in Supabase, user is created but session is null until they confirm
    if (data?.user && !data?.session) {
      return { error: null, requiresConfirmation: true };
    }
    return { error: null };
  }, []);

  const resendVerificationEmail = useCallback(async (email: string): Promise<{ error: Error | null }> => {
    if (!supabase) return { error: new Error("Supabase not configured") };
    const origin = typeof window !== "undefined" ? window.location.origin : "";
    const { error } = await supabase.auth.resend({
      type: "signup",
      email: email.trim(),
      options: { emailRedirectTo: `${origin}/auth/callback` },
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
    signInWithPassword,
    signUp,
    resendVerificationEmail,
    signOut,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}
