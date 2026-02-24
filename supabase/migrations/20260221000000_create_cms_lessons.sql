-- ══════════════════════════════════════════════════════════════
--  Phase 1: CMS-style lessons (Supabase)
--  Tables: cms_lessons, cms_lesson_tags, cms_lesson_tag_map, cms_user_lesson_state
--  (Named with cms_ prefix to avoid conflict with existing public.lessons.)
-- ══════════════════════════════════════════════════════════════

-- 1) cms_lessons
create table if not exists public.cms_lessons (
  id uuid primary key default gen_random_uuid(),
  slug text not null unique,
  title text not null,
  subtitle text,
  category text not null,
  track text,
  level text not null check (level in ('beginner', 'intermediate', 'advanced')),
  estimated_minutes int not null default 8,
  hero_takeaways jsonb not null default '[]'::jsonb,
  content_blocks jsonb not null default '[]'::jsonb,
  example_blocks jsonb not null default '[]'::jsonb,
  video_blocks jsonb not null default '[]'::jsonb,
  quiz jsonb,
  source_citations jsonb not null default '[]'::jsonb,
  status text not null default 'draft' check (status in ('draft', 'published')),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists cms_lessons_slug_idx on public.cms_lessons(slug);
create index if not exists cms_lessons_category_idx on public.cms_lessons(category);
create index if not exists cms_lessons_track_idx on public.cms_lessons(track);
create index if not exists cms_lessons_status_idx on public.cms_lessons(status) where status = 'published';

-- 2) cms_lesson_tags
create table if not exists public.cms_lesson_tags (
  id uuid primary key default gen_random_uuid(),
  tag text not null unique
);

-- 3) cms_lesson_tag_map
create table if not exists public.cms_lesson_tag_map (
  lesson_id uuid not null references public.cms_lessons(id) on delete cascade,
  tag_id uuid not null references public.cms_lesson_tags(id) on delete cascade,
  unique(lesson_id, tag_id)
);

create index if not exists cms_lesson_tag_map_lesson_id_idx on public.cms_lesson_tag_map(lesson_id);

-- 4) cms_user_lesson_state
create table if not exists public.cms_user_lesson_state (
  user_id uuid not null references auth.users(id) on delete cascade,
  lesson_id uuid not null references public.cms_lessons(id) on delete cascade,
  status text not null default 'not_started' check (status in ('not_started', 'in_progress', 'completed')),
  saved boolean not null default false,
  completed_at timestamptz,
  unique(user_id, lesson_id)
);

create index if not exists cms_user_lesson_state_user_id_idx on public.cms_user_lesson_state(user_id);

-- updated_at trigger for cms_lessons
create or replace trigger cms_lessons_updated_at
  before update on public.cms_lessons
  for each row execute function public.handle_updated_at();

-- RLS: allow public read for published cms_lessons
alter table public.cms_lessons enable row level security;
create policy "public read published cms_lessons"
  on public.cms_lessons for select
  using (status = 'published');

alter table public.cms_lesson_tags enable row level security;
create policy "public read cms_lesson_tags"
  on public.cms_lesson_tags for select using (true);

alter table public.cms_lesson_tag_map enable row level security;
create policy "public read cms_lesson_tag_map"
  on public.cms_lesson_tag_map for select using (true);

alter table public.cms_user_lesson_state enable row level security;
create policy "users read own cms_user_lesson_state"
  on public.cms_user_lesson_state for select using (auth.uid() = user_id);
create policy "users insert own cms_user_lesson_state"
  on public.cms_user_lesson_state for insert with check (auth.uid() = user_id);
create policy "users update own cms_user_lesson_state"
  on public.cms_user_lesson_state for update using (auth.uid() = user_id);
