/**
 * Supabase browser client for Auth + Database.
 * Reads VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY from env.
 */
import { createClient, type SupabaseClient } from "@supabase/supabase-js";

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const env = (import.meta as any).env ?? {};
const url  = env.VITE_SUPABASE_URL as string | undefined;
const anon = env.VITE_SUPABASE_ANON_KEY as string | undefined;

export const supabase: SupabaseClient | null =
  url && anon ? createClient(url, anon) : null;
