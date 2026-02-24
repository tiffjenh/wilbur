# Phase 1.5 — CMS quality and publishing workflow

## Scripts (CLI, no admin UI)

- **Validate**  
  `npx tsx scripts/validateLessons.ts [--slug=stocks-101]`  
  Fetches lesson(s) from Supabase and runs Zod validation (blocks, quiz, citations, allowed domains, no-advice lint). Exit 0 if all valid, non-zero otherwise. Uses anon key.

- **Publish**  
  `npx tsx scripts/publishLesson.ts --slug=stocks-101 --by=calvin`  
  Validates, increments `revision`, inserts a snapshot into `cms_lesson_versions`, sets `status=published`, `published_at=now()`, `updated_by`. **Requires `SUPABASE_SERVICE_ROLE_KEY`** in env.

- **Rollback**  
  `npx tsx scripts/rollbackLesson.ts --slug=stocks-101 --toRevision=2 --by=calvin`  
  Restores lesson from the given revision snapshot and keeps status published. **Requires `SUPABASE_SERVICE_ROLE_KEY`**.

- **Schedule publish (optional)**  
  `npx tsx scripts/schedulePublish.ts --slug=stocks-101 --at=2026-03-01T09:00:00Z`  
  Sets `scheduled_publish_at`. Actual publish at that time would be a separate cron job.

## Validation rules (Zod)

- **Blocks:** heading text ≤120 chars; paragraph text ≤500; bullet items ≤140 each; content_blocks total text ≤3500.
- **Lesson:** hero_takeaways 1–6 items; content_blocks min 3; quiz exactly 3 questions; source_citations with valid URL and **allowed domain**.
- **Allowed citation domains:** Tier 1 — irs.gov, sec.gov, investor.gov, consumerfinance.gov, fdic.gov, federalreserve.gov, treasury.gov, finra.org; Tier 2 — investopedia.com.
- **No financial advice:** Disallowed phrases (e.g. “you should buy”, “best stock”, “invest in X”, “allocate %”) cause validation to fail.

Invalid lessons are not returned by `getLessonBySlug` / `listLessons`; the app falls back to legacy content and logs errors in dev.

## UI (CMS lessons only)

- **Last updated** — uses `published_at` or `updated_at`.
- **Sources** — “Tier 1 + Tier 2” summary and a “View sources” link that scrolls to the Sources section.
- **Sources section** — at bottom, citation chips (title + domain) linking to URL.

No global layout or nav changes.
