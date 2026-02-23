# Wilbur AI: Root Cause, Architecture, and Setup

## PART 1 — Root Cause

**Exact root cause:** The frontend is a **Vite** SPA. The AI endpoint is implemented as a **Vercel serverless function** in `api/wilbur.ts`. The Vite dev server only serves static assets and the SPA; it does **not** run serverless functions. Therefore:

- `fetch("/api/wilbur")` from the browser goes to the same origin (e.g. `http://localhost:3000`).
- Vite has no handler for `/api/wilbur` → **404**.
- The UI showed: *"Local AI API not found. Use \`npx vercel dev\` (Vite alone does not run /api/wilbur)."*

**Evidence:**

- **Project setup:** `package.json` has `"dev": "vite"` (or `concurrently` with Vite). No Next.js; no API routes in the Vite build.
- **API location:** `api/wilbur.ts` exists and exports a Vercel-style `handler(req, res)`. Vercel runs this when deployed or when using `vercel dev`; plain `vite` does not.
- **Network:** In browser DevTools → Network, a POST to `/api/wilbur` while running only `vite` returns **404** (or connection failure if nothing is listening).
- **Environment:** `OPENAI_API_KEY` is used only in the serverless function (server-side). It is not exposed to the client. For local runs, it must be set in `.env` (for the local API server or `vercel dev`).

---

## PART 2 — Architectural Fix (Option B)

**Choice:** Keep the Vite frontend and add a **local API server** so AI works with a single `npm run dev` (no need for `vercel dev` unless you prefer it).

**Implementation:**

1. **Local dev server** (`server/dev-api.ts`):
   - Express app that mounts `POST /api/wilbur` and invokes the same logic as `api/wilbur.ts` (Vercel handler).
   - Loads env via `dotenv/config` (e.g. `OPENAI_API_KEY` from `.env`).
   - Runs on port **3001**.

2. **Vite proxy** (`vite.config.ts`):
   - `server.proxy: { "/api": "http://localhost:3001" }`.
   - Browser still calls `fetch("/api/wilbur")`; Vite proxies to the local server.

3. **Scripts** (`package.json`):
   - `dev`: runs both Vite and the API server (e.g. `concurrently "vite" "tsx server/dev-api.ts"`).
   - `dev:vite`: Vite only.
   - `dev:api`: API server only (e.g. for debugging).

**Production:** Unchanged. Vercel still serves the SPA and runs `api/wilbur.ts` as a serverless function. The proxy is dev-only.

**To run locally with AI:**

1. Copy `.env.example` to `.env` and set `OPENAI_API_KEY`.
2. Run `npm run dev` (starts Vite + API server).
3. Alternatively, run `npx vercel dev` and set `OPENAI_API_KEY` in Vercel env or `.env`.

---

## Highlight-to-Explain (Figma)

- User highlights text inside the lesson content → floating **"Ask Wilbur"** button appears.
- **Only on click** on "Ask Wilbur": right panel opens, selected text is shown, and the API is called to get an explanation.
- If selection is > 150 characters → show *"Select a shorter phrase."*
- Selection is restricted to the lesson content container; debounced; previous fetch is cancelled (AbortController) when a new request is made.

---

## Conversational Chat

- Chat keeps the **last 10 messages** (user + assistant).
- Each request sends `history` (previous messages) and the current `question`; the backend returns one `answer`.
- UI shows chat bubbles (user vs Wilbur) and allows follow-up questions with context.

---

## No Financial Advice

- **System prompt** states: no financial advice; no specific stocks, ETFs, funds, crypto, or allocation recommendations; politely decline and offer education instead.
- **Backend check:** If the user message matches recommendation-seeking patterns (e.g. "which stocks", "what should I invest"), an extra system instruction is added so the model refuses and suggests educational topics.

---

## Error Handling

- **404:** *"AI service unavailable in local dev. Run \`npm run dev\` or \`npx vercel dev\`."*
- **5xx:** Generic message; in dev, the actual error is logged to the console.
- **Other errors:** Shown in the panel; in dev, response preview is logged.

---

## Files Changed (summary)

| Area | Files |
|------|--------|
| Local API | `server/dev-api.ts` (new), `vite.config.ts` (proxy), `package.json` (scripts, deps) |
| Backend | `api/wilbur.ts` (system prompt, refusal check) |
| Highlight | `src/components/highlightAI/HighlightAI.tsx` (call API only on "Ask Wilbur" click) |
| Chat | `src/components/layout/TutorPanel.tsx` (history fix, error copy) |
| Docs | `docs/AI_LOCAL_API_AND_HIGHLIGHT.md` (this file) |

---

## Test Checklist

1. Highlight "FDIC" → click "Ask Wilbur" → explanation appears in panel.
2. Highlight a long paragraph → "Select a shorter phrase" (or similar) appears.
3. Ask "What is an ETF?" → response.
4. Follow up "How is that different from a stock?" → context retained.
5. Ask "I have $10,000 which stocks should I invest in?" → polite refusal + educational offer.
6. Works locally with `npm run dev` (and `.env` with `OPENAI_API_KEY`).
7. Works on Vercel production (env set in dashboard).

---

## How to verify (rate limits, cache, panel)

After the rate-limit and cache PR:

1. **Cache hit:** Highlight the same term twice (e.g. "FDIC"). Second request should be a cache hit (no OpenAI call). Check API logs for `cache hit (highlight)`.
2. **Concurrency cap:** Highlight rapidly across 10 different terms. Concurrency stays capped (max 2 in-flight); no burst storm. Optional: check logs for queue depth.
3. **429 / retry-after:** If you force or hit a 429, the user sees reset-aware guidance (e.g. "Rate limit reached. Try again in 45s.") and the server does limited backoff (max 2 retries); no repeated spam.
4. **Panel auto-open + X:** Highlight text → panel opens. Click X → panel closes and state persists (localStorage). Highlight again → panel re-opens.
5. **Chat:** Conversation continues (history is sent correctly). Ask "Which stocks should I buy?" → polite refusal and education-only offer (no financial advice).
