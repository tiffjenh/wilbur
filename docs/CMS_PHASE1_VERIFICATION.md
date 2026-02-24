# Phase 1 CMS — Verification

## 1. Apply the migrations

In Supabase Dashboard → SQL Editor, run in order:

1. `supabase/migrations/20260221000000_create_cms_lessons.sql` — creates `cms_lessons`, `cms_lesson_tags`, `cms_lesson_tag_map`, `cms_user_lesson_state`.
2. `supabase/migrations/20260221100000_phase1_5_cms_versioning.sql` — adds `published_at`, `updated_by`, `revision`, `scheduled_publish_at`, `deprecated` to `cms_lessons`; creates `cms_lesson_versions`.

## 2. Run the seed script

From the project root:

```bash
npx tsx scripts/seedLessons.ts
```

Requires `VITE_SUPABASE_URL` and `VITE_SUPABASE_ANON_KEY` (or `SUPABASE_URL` / `SUPABASE_ANON_KEY`) in `.env`.

You should see:

- Upserted: stocks-101 (published)
- Upserted: bonds-101 (draft)
- Upserted: crypto-101 (draft)

## 3. Open the CMS lesson

1. Start the app: `npm run dev`
2. Go to **/lesson/stocks-101**
3. You should see:
   - Hero: "7 Things You Should Know About Stocks" with takeaways chips
   - Diagram placeholder
   - Content blocks (headings, paragraphs, bullets, chart placeholder, callout, chips)
   - One row of accordions: **Example** (Alphabet/Google), **Video Animation** (4 scenes), **Quiz Yourself** (3 MCQs)
   - Disclaimer and Mark as Complete

## 4. Confirm legacy lessons are unchanged

1. Open a legacy lesson, e.g. **/lesson/goals-and-money-plan** (or any slug from the Library that uses the old content system).
2. It should look exactly as before (existing hero + blocks or "Content coming soon").
3. No layout or navigation changes.

## 5. No Supabase / CMS not seeded

- If Supabase is not configured (no env vars), the app still runs.
- Legacy lessons still work.
- **/lesson/stocks-101** will show "Lesson not found" until the migration is applied and the seed script has run.

## Summary

- **CMS path:** Slug in URL → fetch `cms_lessons` by slug (published) → render `LessonRenderer`.
- **Legacy path:** No CMS row or fetch failed → use curriculum + `getLessonContent(slug)` and existing block renderer.
- Tutor panel, sidebar, and Mark as Complete behave the same for both paths.
