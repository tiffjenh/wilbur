/**
 * Unified Wilbur AI Helper API.
 * POST /api/wilbur
 * Body: { mode: "highlight" | "chat", lessonId?: string, selectedText?: string, question?: string, history?: [], stateCode?: string }
 * Response: { answer: string, citations?: { title, url, domain, tier }[], usedSourcesCount?: number, source?: "glossary" } or { error, code }
 *
 * Server protections: cache (5min), inflight coalescing, concurrency limit (2), 429 diagnosis + backoff.
 * CFPB glossary fast-path: highlight (and optional "What is X?" chat) returns instantly without OpenAI.
 */
import { retrieveApproved } from "./retrieve";
import { findGlossaryEntry, formatGlossaryAnswer } from "../src/lib/glossary/cfpbGlossary";

/** Short system prompt to save TPM; no-financial-advice is enforced in chat via extra system message when needed. */
const WILBUR_SYSTEM = `You are Wilbur, a financial literacy educator. Explain in plain language (8th–10th grade). Use bullets when helpful. Education only—never personalized financial advice. Do not recommend stocks, funds, or allocations; if asked, decline and offer general guidance (e.g. diversification, risk). Do not fabricate citations; suggest IRS, state revenue, FDIC, CFPB for tax/benefits.`;

const RATE_LIMIT_WINDOW_MS = 60_000;
const MAX_HIGHLIGHT_PER_MIN = 10;
const MAX_TOTAL_PER_MIN = 20;
const MAX_HIGHLIGHT = 120;
const MAX_QUESTION = 300;
const MAX_HISTORY = 10;

/** Highlight: very short answers to save TPM. Chat: longer. */
const MAX_TOKENS_HIGHLIGHT = 120;
const MAX_TOKENS_CHAT = 600;

/** Cache TTL 5 min. Concurrency: use WILBUR_OPENAI_CONCURRENCY=1 if logs show RPM exhaustion. */
const CACHE_TTL_MS = 5 * 60 * 1000;
const MAX_CONCURRENT_OPENAI = typeof process.env.WILBUR_OPENAI_CONCURRENCY === "string"
  ? Math.max(1, parseInt(process.env.WILBUR_OPENAI_CONCURRENCY, 10) || 2)
  : 2;
const MAX_QUEUE_DEPTH = 4;

/** Trim excerpts to cap prompt size and save TPM (chars ≈ tokens / 4). */
const MAX_EXCERPT_CHARS = 400;
const MAX_EXCERPT_BLOCK_CHARS = 1800;

/** 429 retry: max 2 retries with exponential backoff + jitter. */
const MAX_429_RETRIES = 2;

/** Per-IP sliding window: { ts, mode }[] for the last minute. */
const usageByIp: Record<string, { ts: number; mode: "highlight" | "chat" }[]> = {};

/** Phrases that indicate user is asking for specific investment recommendations. */
const RECOMMENDATION_PATTERNS = [
  /which\s+stocks?/i,
  /what\s+(?:stocks?|etfs?|funds?|should\s+i\s+invest)/i,
  /tell\s+me\s+what\s+to\s+(?:buy|invest)/i,
  /what\s+should\s+i\s+invest\s+in/i,
  /recommend\s+(?:me\s+)?(?:stocks?|etfs?|funds?)/i,
  /best\s+(?:stocks?|etfs?|investments?)\s+for/i,
  /(\d+k?|\$\d+)\s+(?:to\s+invest|which\s+stocks?)/i,
];

function maybeRefusalPrefix(question: string): boolean {
  return RECOMMENDATION_PATTERNS.some((re) => re.test(question.trim()));
}

function getClientIp(req: { headers?: { [k: string]: string | string[] | undefined } }): string {
  const f = req.headers?.["x-forwarded-for"];
  if (typeof f === "string") return f.split(",")[0].trim();
  if (Array.isArray(f)) return (f[0] ?? "").trim();
  return (req.headers?.["x-real-ip"] as string) ?? "unknown";
}

// --- Cache: key -> { answer, citations, expiresAt } ---
type Cached = {
  answer: string;
  citations: { title: string; url: string; domain: string; tier: number }[];
  expiresAt: number;
};
const responseCache = new Map<string, Cached>();
const CACHE_MAX_ENTRIES = 500;

function simpleHash(s: string): string {
  let h = 0;
  for (let i = 0; i < Math.min(s.length, 2000); i++) h = ((h << 5) - h + s.charCodeAt(i)) | 0;
  return String(h);
}

function cacheKey(
  mode: "highlight" | "chat",
  input: string,
  lessonId: string | undefined,
  stateCode: string | undefined,
  excerptBlock: string
): string {
  const norm = input.trim().toLowerCase().slice(0, 200);
  const exHash = simpleHash(excerptBlock);
  return `${mode}:${lessonId ?? ""}:${stateCode ?? ""}:${norm}:${exHash}`;
}

function getCached(key: string): Cached | null {
  const c = responseCache.get(key);
  if (!c || Date.now() > c.expiresAt) {
    if (c) responseCache.delete(key);
    return null;
  }
  return c;
}

function setCached(
  key: string,
  answer: string,
  citations: { title: string; url: string; domain: string; tier: number }[]
): void {
  if (responseCache.size >= CACHE_MAX_ENTRIES) {
    const first = responseCache.keys().next().value;
    if (first != null) responseCache.delete(first);
  }
  responseCache.set(key, {
    answer,
    citations,
    expiresAt: Date.now() + CACHE_TTL_MS,
  });
}

// --- Inflight coalescing ---
const inflightMap = new Map<string, Promise<{ answer: string; citations: { title: string; url: string; domain: string; tier: number }[] }>>();

async function withInflight<T>(key: string, fn: () => Promise<T>): Promise<T> {
  const existing = inflightMap.get(key);
  if (existing) return existing as Promise<T>;
  const promise = fn().finally(() => {
    inflightMap.delete(key);
  });
  inflightMap.set(key, promise as Promise<{ answer: string; citations: { title: string; url: string; domain: string; tier: number }[] }>);
  return promise;
}

// --- Concurrency limiter ---
let openaiRunning = 0;
const openaiQueue: (() => void)[] = [];

function acquireOpenAIAsync(requestId: string): Promise<boolean> {
  if (openaiRunning < MAX_CONCURRENT_OPENAI) {
    openaiRunning++;
    return Promise.resolve(true);
  }
  if (openaiQueue.length >= MAX_QUEUE_DEPTH) return Promise.resolve(false);
  return new Promise<boolean>((resolve) => {
    openaiQueue.push(() => {
      openaiRunning++;
      resolve(true);
    });
  });
}

function releaseOpenAI(): void {
  openaiRunning--;
  const next = openaiQueue.shift();
  if (next) next();
}

// --- Rate limit header logging + 429 diagnosis ---
function getRateLimitHeaders(response: Response): Record<string, string | null> {
  const get = (name: string) =>
    response.headers.get(name) ?? response.headers.get(name.toLowerCase()) ?? null;
  return {
    "x-ratelimit-limit-requests": get("x-ratelimit-limit-requests"),
    "x-ratelimit-remaining-requests": get("x-ratelimit-remaining-requests"),
    "x-ratelimit-reset-requests": get("x-ratelimit-reset-requests"),
    "x-ratelimit-limit-tokens": get("x-ratelimit-limit-tokens"),
    "x-ratelimit-remaining-tokens": get("x-ratelimit-remaining-tokens"),
    "x-ratelimit-reset-tokens": get("x-ratelimit-reset-tokens"),
    "x-request-id": get("x-request-id"),
  };
}

function logRateLimitHeaders(requestId: string, response: Response, status: number): void {
  const h = getRateLimitHeaders(response);
  console.log(`[${requestId}] OpenAI status=${status} request_id=${h["x-request-id"] ?? "n/a"}`, {
    "x-ratelimit-limit-requests": h["x-ratelimit-limit-requests"],
    "x-ratelimit-remaining-requests": h["x-ratelimit-remaining-requests"],
    "x-ratelimit-reset-requests": h["x-ratelimit-reset-requests"],
    "x-ratelimit-limit-tokens": h["x-ratelimit-limit-tokens"],
    "x-ratelimit-remaining-tokens": h["x-ratelimit-remaining-tokens"],
    "x-ratelimit-reset-tokens": h["x-ratelimit-reset-tokens"],
  });
}

function diagnose429(requestId: string, response: Response, body: { error?: { type?: string; code?: string; message?: string } }): void {
  const h = getRateLimitHeaders(response);
  const remReq = h["x-ratelimit-remaining-requests"];
  const remTok = h["x-ratelimit-remaining-tokens"];
  const limitReq = h["x-ratelimit-limit-requests"];
  const limitTok = h["x-ratelimit-limit-tokens"];
  let diagnosis = "429 (ambiguous)";
  if (remReq === "0" || (limitReq != null && remReq != null && parseInt(remReq, 10) <= 0)) {
    diagnosis = "429 due to RPM (remaining-requests at or near 0)";
  } else if (remTok === "0" || (limitTok != null && remTok != null && parseInt(remTok, 10) <= 0)) {
    diagnosis = "429 due to TPM (remaining-tokens at or near 0)";
  } else {
    diagnosis = `429 ambiguous; remaining-requests=${remReq ?? "n/a"} remaining-tokens=${remTok ?? "n/a"}`;
  }
  console.error(`[${requestId}] ${diagnosis}`, {
    "error.type": body?.error?.type,
    "error.code": body?.error?.code,
    "error.message": body?.error?.message?.slice(0, 200),
    ...h,
  });
}

/** Parse reset header (seconds or date); return seconds to wait or null. */
function getResetSeconds(response: Response): number | null {
  const resetReq = response.headers.get("x-ratelimit-reset-requests") ?? response.headers.get("x-ratelimit-reset-requests".toLowerCase());
  const resetTok = response.headers.get("x-ratelimit-reset-tokens") ?? response.headers.get("x-ratelimit-reset-tokens".toLowerCase());
  const retryAfter = response.headers.get("retry-after") ?? response.headers.get("Retry-After");
  for (const v of [resetTok, resetReq, retryAfter]) {
    if (v == null) continue;
    const n = parseInt(v, 10);
    if (!Number.isNaN(n)) return n; // seconds
    const d = new Date(v).getTime();
    if (!Number.isNaN(d)) return Math.max(0, Math.ceil((d - Date.now()) / 1000));
  }
  return null;
}

export default async function handler(
  req: {
    method?: string;
    body?: {
      mode?: string;
      lessonId?: string;
      selectedText?: string;
      question?: string;
      history?: { role: string; content: string }[];
    };
    headers?: { [k: string]: string | string[] | undefined };
  },
  res: {
    status: (n: number) => { json: (o: object) => void };
    setHeader: (k: string, v: string) => void;
  }
) {
  res.setHeader("Content-Type", "application/json");
  const requestId = `wilbur-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;

  if (req.method !== "POST") {
    console.warn(`[${requestId}] Method not allowed:`, req.method);
    res.status(405).json({ error: "Method not allowed", code: "METHOD_NOT_ALLOWED" });
    return;
  }

  const ip = getClientIp(req);
  const now = Date.now();
  const mode = req.body?.mode;
  if (mode !== "highlight" && mode !== "chat") {
    res.status(400).json({ error: "Invalid or missing mode. Use 'highlight' or 'chat'.", code: "INVALID_MODE" });
    return;
  }

  // Per-IP rate limit: max 10 highlight + 20 total per minute
  if (!usageByIp[ip]) usageByIp[ip] = [];
  const window = usageByIp[ip];
  const cutoff = now - RATE_LIMIT_WINDOW_MS;
  while (window.length > 0 && window[0].ts < cutoff) window.shift();
  const highlightInWindow = window.filter((e) => e.mode === "highlight").length;
  const totalInWindow = window.length;
  if (highlightInWindow >= MAX_HIGHLIGHT_PER_MIN || totalInWindow >= MAX_TOTAL_PER_MIN) {
    console.warn(`[${requestId}] Rate limited (per-min):`, ip, { highlightInWindow, totalInWindow });
    res.status(429).json({
      error: "Too many requests. Please wait a few seconds.",
      code: "RATE_LIMIT",
    });
    return;
  }
  window.push({ ts: now, mode });

  const lessonId = typeof req.body?.lessonId === "string" ? req.body.lessonId : undefined;
  const selectedText = typeof req.body?.selectedText === "string" ? req.body.selectedText.trim() : undefined;
  let question = typeof req.body?.question === "string" ? req.body.question.trim() : undefined;
  const stateCode = typeof req.body?.stateCode === "string" ? req.body.stateCode.trim() : undefined;
  let history = Array.isArray(req.body?.history) ? req.body.history : [];

  // If client sends history with last message as user, use it as current question (avoids staleness)
  if (history.length > 0 && history[history.length - 1]?.role === "user" && typeof history[history.length - 1].content === "string") {
    question = history[history.length - 1].content;
    history = history.slice(0, -1);
  }

  // Prefer OPENAI_API_KEY_LOCAL when set (e.g. local dev) so prod and local can use different keys and avoid sharing TPM/RPM.
  const apiKey = process.env.OPENAI_API_KEY_LOCAL || process.env.OPENAI_API_KEY;
  if (!apiKey) {
    console.error(`[${requestId}] OPENAI_API_KEY (or OPENAI_API_KEY_LOCAL) not set`);
    res.status(503).json({
      error: "AI helper is temporarily unavailable. (Service not configured.)",
      code: "SERVICE_UNAVAILABLE",
    });
    return;
  }

  if (mode === "highlight") {
    if (!selectedText || selectedText.length === 0) {
      res.status(400).json({ error: "Missing or empty selectedText for highlight mode.", code: "MISSING_INPUT" });
      return;
    }
    if (selectedText.length > MAX_HIGHLIGHT) {
      res.status(400).json({
        error: `Selection is too long. Please select ${MAX_HIGHLIGHT} characters or fewer.`,
        code: "INPUT_TOO_LONG",
      });
      return;
    }
  } else {
    if (!question || question.length === 0) {
      res.status(400).json({ error: "Missing or empty question for chat mode.", code: "MISSING_INPUT" });
      return;
    }
    if (question.length > MAX_QUESTION) {
      res.status(400).json({
        error: `Question is too long. Please use ${MAX_QUESTION} characters or fewer.`,
        code: "INPUT_TOO_LONG",
      });
      return;
    }
    history = history
      .filter((m) => m && (m.role === "user" || m.role === "assistant") && typeof m.content === "string")
      .slice(-MAX_HISTORY);
  }

  // CFPB glossary fast-path: highlight (and "What is X?" chat) — no retrieveApproved or OpenAI
  if (mode === "highlight" && selectedText?.trim()) {
    const glossaryHit = findGlossaryEntry(selectedText);
    if (glossaryHit) {
      console.log(`[${requestId}] glossary hit (highlight): ${glossaryHit.term}`);
      res.status(200).json({
        answer: formatGlossaryAnswer(glossaryHit),
        citations: [
          {
            title: "CFPB Financial terms glossary",
            url: glossaryHit.url,
            domain: glossaryHit.domain,
            tier: glossaryHit.tier,
          },
        ],
        usedSourcesCount: 1,
        source: "glossary",
      });
      return;
    }
  }
  if (mode === "chat" && question?.trim()) {
    const whatIsMatch = /^what\s+is\s+(?:a\s+|an\s+)?["']?(.+?)["']?\s*\??$/i.exec(question.trim());
    const termFromQuestion = whatIsMatch?.[1]?.trim();
    if (termFromQuestion) {
      const glossaryHit = findGlossaryEntry(termFromQuestion);
      if (glossaryHit) {
        console.log(`[${requestId}] glossary hit (chat): ${glossaryHit.term}`);
        res.status(200).json({
          answer: formatGlossaryAnswer(glossaryHit),
          citations: [
            {
              title: "CFPB Financial terms glossary",
              url: glossaryHit.url,
              domain: glossaryHit.domain,
              tier: glossaryHit.tier,
            },
          ],
          usedSourcesCount: 1,
          source: "glossary",
        });
        return;
      }
    }
  }

  const query = mode === "highlight" ? selectedText! : question!;
  const retrieval = retrieveApproved({
    query,
    userState: stateCode,
    maxSources: 5,
    requireTier1ForTax: true,
  });

  if (retrieval.tier1RequiredNotMet) {
    res.status(200).json({
      answer: "I can't confirm that from an official source. For tax or legal rules, check IRS.gov, your state revenue department, or a licensed professional.",
      citations: [],
      usedSourcesCount: 0,
    });
    return;
  }
  if (retrieval.stateTier1RequiredNotMet) {
    res.status(200).json({
      answer: "I couldn't verify this from the official state source. For state tax rules, check your state's revenue or tax department website (e.g. tax.ny.gov, ftb.ca.gov, dor.wa.gov) or a tax professional.",
      citations: [],
      usedSourcesCount: 0,
    });
    return;
  }

  const { excerpts, citations } = retrieval;
  if (excerpts.length === 0) {
    console.log(`[${requestId}] retrieval returned 0 excerpts for query="${query.slice(0, 50)}" stateCode=${stateCode ?? "none"}`);
  }

  // Trim each excerpt and total block to save TPM (huge saver when excerpts are long).
  const trimmedExcerpts =
    excerpts.length > 0
      ? excerpts.map((e) => {
          const text = e.text.length > MAX_EXCERPT_CHARS ? e.text.slice(0, MAX_EXCERPT_CHARS) + "…" : e.text;
          return `[${e.title}] ${text} (Source: ${e.url})`;
        })
      : [];
  let excerptBlock =
    trimmedExcerpts.length > 0
      ? `\n\nUse ONLY these excerpts to inform your answer. If they don't cover the question, say so and suggest the cited sources. Do not invent URLs or quotes.\n\nExcerpts:\n${trimmedExcerpts.join("\n\n")}`
      : "";
  if (excerptBlock.length > MAX_EXCERPT_BLOCK_CHARS) {
    excerptBlock = excerptBlock.slice(0, MAX_EXCERPT_BLOCK_CHARS) + "\n…";
  }

  const cacheKeyStr = cacheKey(mode, query, lessonId, stateCode, excerptBlock);

  const cached = getCached(cacheKeyStr);
  if (cached) {
    console.log(`[${requestId}] cache hit (${mode})`);
    res.status(200).json({
      answer: cached.answer,
      citations: cached.citations.map((c) => ({ title: c.title, url: c.url, domain: c.domain, tier: c.tier })),
      usedSourcesCount: cached.citations.length,
    });
    return;
  }

  const messages: { role: "system" | "user" | "assistant"; content: string }[] = [
    { role: "system", content: WILBUR_SYSTEM },
  ];

  if (mode === "highlight") {
    messages.push({
      role: "user",
      content: `Explain this term or phrase from a financial literacy lesson in simple, educational language. Use short paragraphs and bullets if helpful. Do not give personalized advice.${excerptBlock}\n\nTerm or phrase to explain: "${selectedText}"`,
    });
  } else {
    for (const m of history) {
      messages.push({ role: m.role as "user" | "assistant", content: m.content });
    }
    if (maybeRefusalPrefix(question!)) {
      messages.push({
        role: "system",
        content: "User may be asking for investment picks. Do NOT recommend specific stocks, ETFs, or allocations. Decline politely and offer education (diversification, risk, how to evaluate).",
      });
    }
    const userContent = excerptBlock
      ? `Answer using only the approved excerpts below.${excerptBlock}\n\nUser question: ${question}`
      : question!;
    messages.push({ role: "user", content: userContent });
  }

  const maxTokens = mode === "highlight" ? MAX_TOKENS_HIGHLIGHT : MAX_TOKENS_CHAT;

  const callOpenAI = async (attempt: number): Promise<Response> => {
    const response = await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${apiKey}`,
      },
      body: JSON.stringify({
        model: "gpt-4o-mini",
        messages,
        max_tokens: maxTokens,
        temperature: 0.4,
      }),
    });
    return response;
  };

  const runWithBackoff = async (): Promise<{
    answer: string;
    citations: { title: string; url: string; domain: string; tier: number }[];
  }> => {
    let lastResponse: Response | null = null;
    let lastText = "";
    for (let attempt = 0; attempt <= MAX_429_RETRIES; attempt++) {
      const response = await callOpenAI(attempt);
      lastResponse = response;
      const responseText = await response.text();
      lastText = responseText;

      logRateLimitHeaders(requestId, response, response.status);

      if (response.ok) {
        let data: { choices?: Array<{ message?: { content?: string } }> };
        try {
          data = JSON.parse(responseText);
        } catch {
          throw new Error("PARSE_ERROR");
        }
        const answer = data.choices?.[0]?.message?.content?.trim() ?? "";
        if (!answer) throw new Error("EMPTY_RESPONSE");
        return {
          answer,
          citations: citations.map((c) => ({ title: c.title, url: c.url, domain: c.domain, tier: c.tier })),
        };
      }

      if (response.status === 429) {
        let errPayload: { error?: { type?: string; code?: string; message?: string } } = {};
        try {
          errPayload = JSON.parse(responseText) as typeof errPayload;
        } catch {
          errPayload = {};
        }
        const isInsufficientQuota =
          errPayload?.error?.code === "insufficient_quota" || errPayload?.error?.type === "insufficient_quota";
        if (isInsufficientQuota) {
          console.error(`[${requestId}] 429 due to insufficient_quota (billing/quota)`);
          res.status(503).json({
            error: "AI is currently unavailable. Please check back later.",
            code: "INSUFFICIENT_QUOTA",
          });
          return { answer: "", citations: [] };
        }
        diagnose429(requestId, response, errPayload);
        const resetSec = getResetSeconds(response);
        if (attempt < MAX_429_RETRIES) {
          const baseDelay = resetSec != null ? Math.min(resetSec * 1000, 30_000) : Math.min(1000 * Math.pow(2, attempt), 10_000);
          const jitter = Math.random() * 0.3 * baseDelay;
          const delay = baseDelay + jitter;
          console.log(`[${requestId}] 429 backoff attempt ${attempt + 1}/${MAX_429_RETRIES + 1} delay=${Math.round(delay)}ms`);
          await new Promise((r) => setTimeout(r, delay));
          continue;
        }
        const msg =
          resetSec != null
            ? `Rate limit reached. Try again in ${resetSec}s.`
            : "Rate limit reached. Please wait a moment and try again.";
        res.status(503).json({ error: msg, code: "RATE_LIMIT" });
        return { answer: "", citations: [] };
      }

      if (response.status === 401) {
        res.status(500).json({
          error: "OpenAI API key is invalid or missing. Check OPENAI_API_KEY in .env and restart the dev server.",
          code: "PROVIDER_ERROR",
        });
        return { answer: "", citations: [] };
      }

      res.status(500).json({
        error: "We couldn't get an answer right now. Please try again.",
        code: "PROVIDER_ERROR",
      });
      return { answer: "", citations: [] };
    }

    const resetSec = lastResponse ? getResetSeconds(lastResponse) : null;
    const msg =
      resetSec != null ? `Rate limit reached. Try again in ${resetSec}s.` : "Rate limit reached. Please wait a moment and try again.";
    res.status(503).json({ error: msg, code: "RATE_LIMIT" });
    return { answer: "", citations: [] };
  };

  try {
    const result = await withInflight(cacheKeyStr, async () => {
      const acquired = await acquireOpenAIAsync(requestId);
      if (!acquired) {
        console.warn(`[${requestId}] Queue full, rejecting with 503`);
        throw new Error("QUEUE_FULL");
      }
      if (!acquired) {
        throw new Error("QUEUE_FULL");
      }
      try {
        return await runWithBackoff();
      } finally {
        releaseOpenAI();
      }
    });

    if (result.answer === "" && result.citations.length === 0) {
      return;
    }

    setCached(cacheKeyStr, result.answer, result.citations);
    res.status(200).json({
      answer: result.answer,
      citations: result.citations.map((c) => ({ title: c.title, url: c.url, domain: c.domain, tier: c.tier })),
      usedSourcesCount: result.citations.length,
    });
  } catch (e) {
    if ((e as Error).message === "QUEUE_FULL") {
      res.status(503).json({
        error: "AI helper is busy. Please try again in a moment.",
        code: "SERVICE_UNAVAILABLE",
      });
      return;
    }
    console.error(`[${requestId}] Error:`, e);
    res.status(500).json({
      error: "Something went wrong. Please try again in a moment.",
      code: "SERVER_ERROR",
    });
  }
}
