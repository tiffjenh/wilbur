# Approved Sources — Single Source Governance

Wilbur uses one shared approved-sources system for:

- **Wilbur AI** (`/api/wilbur`): retrieval and responses cite only approved domains; responses include `citations` and `usedSourcesCount`.
- **Lessons**: every lesson has `sources` (citations); validated so only approved URLs are allowed; tax/legal lessons require at least one Tier 1 source.
- **UI**: shared `<CitationsList />` in lesson pages and the AI helper panel, with optional “Why these sources?” tooltip.

## Canonical config (frontend + validation)

- **`src/content/sources/approvedSources.ts`**  
  - `APPROVED_TIERS.tier1` / `tier2`, `DISALLOWED_DOMAINS`
  - `isApprovedUrl(url)`, `getTierForUrl(url)`, `normalizeDomain(url)`, `enforceApprovedSources(urls, stateCode?)`
- **`src/content/sources/stateDomains.ts`**  
  - `STATE_TAX_DOMAINS`: state code → official tax domains (e.g. CA → ftb.ca.gov, WA → dor.wa.gov).  
  - `STATE_NAMES`: state code → display name for citations (“According to the California Franchise Tax Board…”).  
  - `STATE_NO_INCOME_TAX`: states with no state income tax (AK, FL, NV, NH, SD, TN, TX, WA, WY); still included so we can cite the official site for “Does Washington have state income tax?”.  
  - `getStateDomains(code)`, `isStateNoIncomeTax(code)`.

## Retrieval

- **`src/content/retrieval/retrieveApproved.ts`**  
  - `retrieveApproved({ query, userState?, maxSources?, requireTier1ForTax? })`  
  - Returns `{ excerpts, citations, tier1RequiredNotMet? }`.  
  - Uses static excerpts for common terms; can be extended with a search provider (Serper/Tavily/Bing) using `site:` filters on approved domains.

## API (serverless)

- **`api/sources.ts`**  
  - Minimal approved/disallowed lists and `getTierForUrl` for the server.  
  - **Keep in sync with `src/content/sources/approvedSources.ts`** when adding/removing domains.
- **`api/retrieve.ts`**  
  - Server-side retrieval (static excerpts); same contract as front-end retrieval.

## Lesson schema and validation

- **`src/content/lessonTypes.ts`**  
  - `LessonSource` may include `tier?: 1 | 2` and `usedIn?: string[]`.
- **`src/content/lessons/lessonSourceValidator.ts`**  
  - `validateLessonSources(lesson, stateCode?)`  
  - Ensures all source URLs are approved; tax/legal lessons have at least one Tier 1 citation; suggests ≥2 citations.

## UI

- **`src/components/ui/CitationsList.tsx`**  
  - Shared list of citations (title, url, domain/tier) and optional “Why these sources?” tooltip.  
  - Used on lesson pages and in the Wilbur AI panel.

## Rules

- **Tier 1 (primary):** government and regulators (e.g. irs.gov, fdic.gov, sec.gov, investor.gov, consumerfinance.gov, federalreserve.gov, state tax/finance domains). Prefer for tax/legal.
- **Tier 2 (secondary):** e.g. investopedia.com, bogleheads.org. Never the only source for tax/legal rules when a primary exists.  
- **State tax enforcement:** When the query is about state income tax, state deductions, “filing in [state]”, etc., and `userState` is set, require at least one state Tier 1 source. If none is found, respond: “I couldn’t verify this from the official state source.” (Do not answer from Investopedia alone.)
- **Disallowed:** e.g. reddit, twitter, medium, forbes, cnbc, motleyfool — never cited.
- If content cannot be supported by approved sources, do not publish it; use a “needs sourcing” fallback or refuse in AI.

## Tests

- `src/content/sources/approvedSources.test.ts` — `isApprovedUrl`, `getTierForUrl`, `enforceApprovedSources`
- `src/content/retrieval/retrieveApproved.test.ts` — retrieval never returns unapproved domains; tax + `requireTier1ForTax`; `validateUrlsApproved`
- `src/content/lessons/lessonSourceValidator.test.ts` — lesson validation (reject non-approved; tax/legal needs Tier 1)

Run: `npm run test`
