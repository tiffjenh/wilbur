-- ══════════════════════════════════════════════════════════════
--  Phase 2: Admin allowlist + RLS for CMS admin access
--  Only users in admin_allowlist can read/write drafts and publish.
-- ══════════════════════════════════════════════════════════════

-- 1) admin_allowlist
create table if not exists public.admin_allowlist (
  user_id uuid primary key references auth.users(id) on delete cascade,
  email text unique,
  role text not null check (role in ('admin', 'editor')) default 'admin',
  created_at timestamptz not null default now()
);

create index if not exists admin_allowlist_email_idx on public.admin_allowlist(email);

alter table public.admin_allowlist enable row level security;
-- Only admins can see the allowlist (for "am I admin?" check via service or same RLS)
create policy "admin_allowlist_select_own"
  on public.admin_allowlist for select
  using (auth.uid() = user_id);

-- 2) cms_lessons: allow admins to select all rows (drafts + published) and insert/update
create policy "admin select all cms_lessons"
  on public.cms_lessons for select
  using (
    exists (
      select 1 from public.admin_allowlist a
      where a.user_id = auth.uid()
    )
  );
create policy "admin insert cms_lessons"
  on public.cms_lessons for insert
  with check (
    exists (
      select 1 from public.admin_allowlist a
      where a.user_id = auth.uid()
    )
  );
create policy "admin update cms_lessons"
  on public.cms_lessons for update
  using (
    exists (
      select 1 from public.admin_allowlist a
      where a.user_id = auth.uid()
    )
  );

-- 3) cms_lesson_versions: allow admins to insert (snapshots) and update if needed
create policy "admin insert cms_lesson_versions"
  on public.cms_lesson_versions for insert
  with check (
    exists (
      select 1 from public.admin_allowlist a
      where a.user_id = auth.uid()
    )
  );
create policy "admin update cms_lesson_versions"
  on public.cms_lesson_versions for update
  using (
    exists (
      select 1 from public.admin_allowlist a
      where a.user_id = auth.uid()
    )
  );

-- Seed: no rows by default; run manually or via seed script:
-- insert into public.admin_allowlist (user_id, email, role)
-- select id, email, 'admin' from auth.users where email = 'your@email.com';
