-- ══════════════════════════════════════════════════════════════
--  Wilbur — Supabase Schema
--  Run in Supabase Dashboard → SQL Editor
-- ══════════════════════════════════════════════════════════════

-- Enable UUIDs
create extension if not exists "pgcrypto";

-- ──────────────────────────────────────────────────────────────
-- 1) User profile (questionnaire answers)
-- ──────────────────────────────────────────────────────────────
create table if not exists public.user_profiles (
  user_id uuid primary key references auth.users(id) on delete cascade,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),

  age_range text not null,
  work_status text not null,
  income_type text not null,
  annual_income text not null,

  savings text not null,
  debt text not null,

  benefits text[] not null default '{}',
  invested_before text not null,

  goals_this_year text[] not null default '{}',
  goals_3to5 text[] not null default '{}',
  stressors text[] not null default '{}',

  confidence int not null check (confidence between 1 and 5),

  state_code text not null
);

create index if not exists user_profiles_state_code_idx on public.user_profiles(state_code);

-- Auto-update updated_at
create or replace function public.handle_updated_at()
returns trigger as $$
begin
  new.updated_at = now();
  return new;
end;
$$ language plpgsql;

create or replace trigger user_profiles_updated_at
  before update on public.user_profiles
  for each row execute function public.handle_updated_at();

-- ──────────────────────────────────────────────────────────────
-- 2) Lessons (metadata)
--    Lesson blocks are rendered client-side from TypeScript content
--    files, but stored here for future admin/CMS use.
-- ──────────────────────────────────────────────────────────────
create table if not exists public.lessons (
  id text primary key,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),

  title text not null,
  description text,
  level text not null, -- level-1..level-5
  tags text[] not null default '{}',
  estimated_time_min int not null default 8,

  -- content stored as JSON blocks (matches BlockLesson.blocks)
  blocks jsonb not null default '[]'::jsonb,

  -- sources stored as JSON (matches LessonSource[])
  sources jsonb not null default '[]'::jsonb
);

create index if not exists lessons_tags_gin on public.lessons using gin (tags);

-- ──────────────────────────────────────────────────────────────
-- 3) Personalized recommended path snapshots
-- ──────────────────────────────────────────────────────────────
create table if not exists public.user_paths (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  created_at timestamptz not null default now(),

  -- ordered list of lesson ids
  lesson_ids text[] not null default '{}',

  -- optional debug info: { lessonId: { score, reasons[] } }
  debug jsonb not null default '{}'::jsonb
);

create index if not exists user_paths_user_id_idx on public.user_paths(user_id);

-- ──────────────────────────────────────────────────────────────
-- 4) Lesson progress (lesson_id = catalog slug, no FK so app works without populating lessons table)
-- ──────────────────────────────────────────────────────────────
create table if not exists public.lesson_progress (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  lesson_id text not null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),

  status text not null default 'not_started', -- not_started|in_progress|completed
  percent int not null default 0 check (percent between 0 and 100),
  completed_at timestamptz
);

create unique index if not exists lesson_progress_unique on public.lesson_progress(user_id, lesson_id);

create or replace trigger lesson_progress_updated_at
  before update on public.lesson_progress
  for each row execute function public.handle_updated_at();

-- ──────────────────────────────────────────────────────────────
-- 5) Feedback on lessons (lesson_id = catalog slug, no FK)
-- ──────────────────────────────────────────────────────────────
create table if not exists public.lesson_feedback (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  lesson_id text not null,
  created_at timestamptz not null default now(),

  feedback text not null -- more_like_this|not_relevant|already_know_this
);

create index if not exists lesson_feedback_user_id_idx on public.lesson_feedback(user_id);
create index if not exists lesson_feedback_lesson_id_idx on public.lesson_feedback(lesson_id);

-- ──────────────────────────────────────────────────────────────
-- 6) User-added lessons (Library "+ Add to Learning")
--    lesson_id is client catalog id (no FK to lessons)
-- ──────────────────────────────────────────────────────────────
create table if not exists public.user_added_lessons (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  lesson_id text not null,
  created_at timestamptz not null default now(),
  unique(user_id, lesson_id)
);

create index if not exists user_added_lessons_user_id_idx on public.user_added_lessons(user_id);

-- ──────────────────────────────────────────────────────────────
-- 7) State tax reference data
--    Populated from stateTax.ts values; read-only by clients.
-- ──────────────────────────────────────────────────────────────
create table if not exists public.state_tax_profiles (
  state_code text primary key,
  has_state_income_tax boolean not null,
  tax_agency_url text not null,
  updated_at timestamptz not null default now()
);

-- ══════════════════════════════════════════════════════════════
--  RLS Policies
-- ══════════════════════════════════════════════════════════════

-- user_profiles: users can read/write own profile
alter table public.user_profiles enable row level security;

create policy "read own profile"
on public.user_profiles for select
using (auth.uid() = user_id);

create policy "upsert own profile"
on public.user_profiles for insert
with check (auth.uid() = user_id);

create policy "update own profile"
on public.user_profiles for update
using (auth.uid() = user_id);

-- user_paths: users can read/write their paths
alter table public.user_paths enable row level security;

create policy "read own paths"
on public.user_paths for select
using (auth.uid() = user_id);

create policy "insert own paths"
on public.user_paths for insert
with check (auth.uid() = user_id);

-- lesson_progress
alter table public.lesson_progress enable row level security;

create policy "read own progress"
on public.lesson_progress for select
using (auth.uid() = user_id);

create policy "write own progress"
on public.lesson_progress for insert
with check (auth.uid() = user_id);

create policy "update own progress"
on public.lesson_progress for update
using (auth.uid() = user_id);

-- lesson_feedback
alter table public.lesson_feedback enable row level security;

create policy "read own feedback"
on public.lesson_feedback for select
using (auth.uid() = user_id);

create policy "write own feedback"
on public.lesson_feedback for insert
with check (auth.uid() = user_id);

-- user_added_lessons
alter table public.user_added_lessons enable row level security;

create policy "read own user_added_lessons"
on public.user_added_lessons for select
using (auth.uid() = user_id);

create policy "insert own user_added_lessons"
on public.user_added_lessons for insert
with check (auth.uid() = user_id);

create policy "delete own user_added_lessons"
on public.user_added_lessons for delete
using (auth.uid() = user_id);

-- ──────────────────────────────────────────────────────────────
-- 8) User resources (saved simulator values, budgets, etc.)
--    Optional: used when logged in to persist last values / saved budgets
-- ──────────────────────────────────────────────────────────────
create table if not exists public.user_resources (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  resource_type text not null,
  data jsonb not null,
  created_at timestamptz not null default now()
);

create index if not exists user_resources_user_id_idx on public.user_resources(user_id);
create index if not exists user_resources_user_type_idx on public.user_resources(user_id, resource_type);

alter table public.user_resources enable row level security;

create policy "read own user_resources"
on public.user_resources for select
using (auth.uid() = user_id);

create policy "insert own user_resources"
on public.user_resources for insert
with check (auth.uid() = user_id);

create policy "update own user_resources"
on public.user_resources for update
using (auth.uid() = user_id);

create policy "delete own user_resources"
on public.user_resources for delete
using (auth.uid() = user_id);

-- lessons and state_tax_profiles: public read (no auth required)
alter table public.lessons enable row level security;
create policy "public read lessons"
on public.lessons for select
using (true);

alter table public.state_tax_profiles enable row level security;
create policy "public read state tax"
on public.state_tax_profiles for select
using (true);
