# Supabase migrations

This folder contains SQL migrations for the Wilbur project.

- **20260221000000_create_cms_lessons.sql** — Phase 1 CMS: tables `cms_lessons`, `cms_lesson_tags`, `cms_lesson_tag_map`, `cms_user_lesson_state` (with indexes and RLS).
- **20260221100000_phase1_5_cms_versioning.sql** — Phase 1.5: adds `published_at`, `updated_by`, `revision`, `scheduled_publish_at`, `deprecated` to `cms_lessons`; creates `cms_lesson_versions` for snapshots.

## Applying migrations

Run the migration in the Supabase Dashboard → SQL Editor, or use the Supabase CLI if configured:

```bash
supabase db push
```

Or paste the contents of the migration file into the SQL Editor and run.

## Verification

After applying the migration and running the seed script:

1. Run the seed script: `npx tsx scripts/seedLessons.ts`
2. Open `/lesson/stocks-101` — you should see the CMS lesson (hero, blocks, Example/Video/Quiz accordions).
3. Open a legacy lesson (e.g. `/lesson/goals-and-money-plan`) — it should look unchanged (legacy content or "Content coming soon").
4. If Supabase is not configured, the app still runs; legacy lessons work; `/lesson/stocks-101` will show "Lesson not found" until CMS is seeded.
