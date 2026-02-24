---
# Project Context – Lesson CMS

## Architecture Overview

### Backend (Supabase)

Tables:
- public.lessons
  - id (text, PK)
  - title (text)
  - level (text, check: 'beginner' | 'intermediate' | 'advanced')

- public.lesson_versions
  - id (uuid, PK)
  - lesson_id (text, FK -> lessons.id)
  - version (integer)
  - revision (integer)
  - status ('draft' | 'published')
  - snapshot (jsonb)
  - summary (text)
  - source_notes (text)
  - published_at (timestamp)
  - updated_at (timestamp)

View:
- public.lesson_latest_published
  - Returns the most recent published version per lesson

Function:
- public.publish_lesson_snapshot(
    p_lesson_id text,
    p_title text,
    p_level text,
    p_snapshot jsonb,
    p_version integer default null,
    p_summary text default null,
    p_source_notes text default null
  ) returns uuid

Behavior:
- Upserts into lessons
- Auto-guards level
- Auto-increments version and revision
- Inserts published row into lesson_versions

---

## Frontend (Next.js)

Primary mapping file:
- src/lib/lessons/getPublishedLesson.ts

Core function:
- mapSnapshotToLesson(snapshot, lessonId, published_at, updated_at)

Fallback:
- mapSnapshotToLessonMinimal(snapshot)

Block mapping:
- sectionToBlocks(section)

---

## Supported CMSBlock Types

Union type CMSBlock supports:

- heading
- paragraph
- bullets
- callout
- chips
- divider
- chartPlaceholder
- imagePlaceholder
- twoColumn
- comparisonCards

Renderer expects:
- content_blocks: CMSBlock[]
- example_blocks: CMSBlock[]
- video_blocks: CMSBlock[]
- quiz
- source_citations

---

## Snapshot Shape (Preferred)

{
  hero: { headline, subhead, takeaways },
  sections: CMSBlock[],
  bottom: {
    examples: CMSBlock[],
    video: CMSBlock[],
    quiz: { title, questions[] },
    sources: []
  }
}

---

## Current Status

- Publishing works
- lesson_latest_published view works
- Version + revision auto-increment works
- Goal: stabilize snapshot → CMSBlock mapping
- Focus moving forward: content, product, design
- Avoid further DB schema changes unless critical

---

## Preferred Snapshot JSON Shape

```json
{
  "hero": { "headline": "", "subhead": "", "takeaways": [] },
  "sections": [],
  "bottom": {
    "examples": [],
    "video": [],
    "quiz": { "title": "", "questions": [] },
    "sources": []
  }
}
```

Frontend rendering expects sections to map cleanly into CMS blocks (see CMSBlock union below).

---

## 3) CMSBlock Types Supported (Renderer Contract)

The lesson renderer expects content_blocks: CMSBlock[] where CMSBlock is a union of:

- heading (level 2|3, text)
- paragraph (text)
- bullets (items[])
- callout (variant tip|note|warning, title?, text)
- chips (items[])
- divider
- chartPlaceholder (chartType line|bar|pie, title, description)
- imagePlaceholder (title, description)
- twoColumn (left CMSBlock[], right CMSBlock[])
- comparisonCards (two cards, each with title/bullets/badge?)

Lesson snapshot sections must use these (or mapping must translate other shapes into these).

---

## 4) Backend Issues Encountered (Executive Summary)

We stabilized publishing/versioning in Supabase. Most friction came from Postgres strictness + schema/function mismatches and snapshot shape mismatches.

Key issues:

- **Raw JSON pasted into SQL editor → syntax error at or near '{'**  
  Fix: always wrap as $$ ... $$::jsonb

- **Function used placeholder args outside function scope (e.g., p_lesson_id) → "column does not exist"**  
  Fix: call function with literals or edit function in Supabase function editor

- **lessons.level check constraint (beginner|intermediate|advanced) failing due to NULL/invalid**  
  Fix: guard level in publish function via coalesce + validation

- **Duplicate (lesson_id, version) conflicts**  
  Fix: auto-increment version inside publish function

- **publish_lesson_snapshot overload ambiguity ("function not unique")**  
  Fix: standardize on a single function signature and call with explicit casts

- **CREATE OR REPLACE FUNCTION return-type mismatch**  
  Fix: drop old function with exact signature, then recreate

Final state:

- Publishing works
- lesson_latest_published returns latest published record
- Version + revision auto-increment
- Level is guarded

---

## 5) Working SQL Patterns (Copy/Paste Safe)

**Publish a lesson snapshot (always disambiguate signature)**

```sql
select public.publish_lesson_snapshot(
  'stocks-101'::text,
  'Stocks, in plain English'::text,
  'beginner'::text,
  $${
    "hero": { "headline": "Stocks, in plain English" },
    "sections": [
      { "type": "heading", "level": 2, "text": "What is a stock?" },
      { "type": "paragraph", "text": "A stock is a small piece of a company." }
    ],
    "bottom": {}
  }$$::jsonb,
  null::integer,
  null::text,
  null::text
);
```

**Verify latest published**

```sql
select lesson_id, version, revision, published_at, updated_at
from public.lesson_latest_published
where lesson_id = 'stocks-101';
```

**Inspect snapshot keys**

```sql
select jsonb_object_keys(snapshot) as top_level_keys
from public.lesson_latest_published
where lesson_id = 'stocks-101';
```

**Count section types**

```sql
select
  elem->>'type' as type,
  count(*) as n
from public.lesson_latest_published lp
cross join lateral jsonb_array_elements(coalesce(lp.snapshot->'sections','[]'::jsonb)) elem
where lp.lesson_id = 'stocks-101'
group by 1
order by n desc;
```

---

## 6) Signup/Login Issues (Executive Summary)

We implemented Supabase Auth and fixed:

- session persistence/hydration mismatches
- redirect/callback URL issues
- environment configuration mismatches (local vs production)
- protected route flicker by gating render on auth loading state

Final state:

- stable signup/login
- reliable protected routes

---

## 7) AI Helper + Glossary-First Strategy (Executive Summary)

AI helper: supports highlight explain + chat, with strong "education-only, no financial advice" guardrails.

We introduced a glossary-first approach to reduce OpenAI calls and improve consistency.

**Glossary-first behavior:**

- If highlighted term exists in internal glossary → return instantly (no OpenAI call)
- Else → OpenAI fallback

This reduces cost/quota usage and improves user experience.

---

## 8) Current Product Direction

Primary focus now:

- lesson content quality and structure
- better interactive lesson layout (charts/modules/callouts, less text-heavy)
- robust lesson mapping so content changes don't break rendering
- scale lesson creation via CMS snapshots (avoid hardcoding)

Avoid:

- further DB schema churn unless critical

---

## 9) Next Work Items (Prioritized)

1. Make snapshot → CMSBlock mapping resilient (prefer sections, robust sectionToBlocks)
2. Expand curriculum taxonomy (categories → sub-lessons)
3. Build richer Stocks curriculum (multiple lessons: price, candlesticks, P/E, dividends, risk, etc.)
4. Improve lesson UI layout + bottom dropdowns (Example / Video / Quiz)
5. Ensure AI highlight explain uses glossary first, then OpenAI fallback

---

End of archive.
