-- ══════════════════════════════════════════════════════════════
--  Phase 1.5: CMS versioning + publishing workflow
--  Adds columns to cms_lessons and creates cms_lesson_versions.
-- ══════════════════════════════════════════════════════════════

-- 1) Add columns to cms_lessons
alter table public.cms_lessons
  add column if not exists published_at timestamptz,
  add column if not exists updated_by text,
  add column if not exists revision int not null default 1,
  add column if not exists scheduled_publish_at timestamptz,
  add column if not exists deprecated boolean not null default false;

-- 2) lesson_versions: snapshots for every publish (and optionally drafts)
create table if not exists public.cms_lesson_versions (
  id uuid primary key default gen_random_uuid(),
  lesson_id uuid not null references public.cms_lessons(id) on delete cascade,
  revision int not null,
  status text not null check (status in ('draft', 'published')),
  snapshot jsonb not null,
  created_at timestamptz not null default now(),
  created_by text
);

create index if not exists cms_lesson_versions_lesson_revision_idx
  on public.cms_lesson_versions(lesson_id, revision desc);

-- RLS: public read for lesson_versions (so CLI can read; anon can read for rollback info if needed)
alter table public.cms_lesson_versions enable row level security;
create policy "public read cms_lesson_versions"
  on public.cms_lesson_versions for select using (true);
