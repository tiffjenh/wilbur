/**
 * Secure AI explain endpoint. API key is server-side only.
 * Rate limit: 1 request per 2 seconds per IP.
 * Returns summary, bullets, keyTerms, citations (allowlist-only).
 */
const WILBUR_SYSTEM = `You are Wilbur, an educational financial literacy assistant.
You provide clear, simple explanations.
You DO NOT give financial advice.
You DO NOT recommend specific stocks, ETFs, crypto, options, or investment allocations.
All examples must be hypothetical.
Use plain language suitable for a first-time learner.
When appropriate, reference ONLY these reputable sources: IRS.gov, SEC.gov, FDIC.gov, CFPB.gov, Treasury.gov, SSA.gov, Investopedia.com, or state/federal .gov sites.
Keep responses concise (max 3 short paragraphs).
Provide 3-6 bullet points when helpful.
Never provide prescriptive financial recommendations.`;

const RATE_LIMIT_MS = 2000;
const MIN_TEXT_LENGTH = 3;
const MAX_TEXT_LENGTH = 500;

/** Allowed citation domains (reputable / government only) */
const ALLOWED_HOSTS = new Set([
  "investopedia.com",
  "www.investopedia.com",
  "irs.gov",
  "www.irs.gov",
  "treasury.gov",
  "www.treasury.gov",
  "ssa.gov",
  "www.ssa.gov",
  "fdic.gov",
  "www.fdic.gov",
  "sec.gov",
  "www.sec.gov",
  "cfpb.gov",
  "www.cfpb.gov",
]);

function isAllowedCitationUrl(url: string): boolean {
  try {
    const u = new URL(url);
    const host = u.hostname.toLowerCase().replace(/^www\./, "");
    if (ALLOWED_HOSTS.has(host) || ALLOWED_HOSTS.has(u.hostname.toLowerCase())) return true;
    if (host.endsWith(".gov")) return true;
    if (host === "investopedia.com") return true;
    return false;
  } catch {
    return false;
  }
}

function filterCitations(citations: { title?: string; url?: string }[]): { title: string; url: string }[] {
  const out: { title: string; url: string }[] = [];
  for (const c of citations) {
    const url = typeof c.url === "string" ? c.url.trim() : "";
    if (!url || !isAllowedCitationUrl(url)) continue;
    out.push({ title: typeof c.title === "string" ? c.title.trim() || url : url, url });
  }
  return out;
}

const lastRequestByIp: Record<string, number> = {};

function getClientIp(req: { headers?: { [k: string]: string | string[] | undefined } }): string {
  const forwarded = req.headers?.["x-forwarded-for"];
  if (typeof forwarded === "string") return forwarded.split(",")[0].trim();
  if (Array.isArray(forwarded)) return (forwarded[0] ?? "").trim();
  return (req.headers?.["x-real-ip"] as string) ?? "unknown";
}

export default async function handler(
  req: {
    method?: string;
    body?: {
      text?: string;
      selectedText?: string;
      lessonId?: string;
      pageUrl?: string;
      userQuestion?: string;
    };
    headers?: { [k: string]: string | string[] | undefined };
  },
  res: {
    status: (n: number) => { json: (o: object) => void; end: () => void };
    setHeader: (k: string, v: string) => void;
  }
) {
  res.setHeader("Content-Type", "application/json");
  const requestId = `explain-${Date.now()}-${Math.random().toString(36).slice(2, 9)}`;

  if (req.method !== "POST") {
    console.warn(`[${requestId}] Method not allowed:`, req.method);
    res.status(405).json({ error: "Method not allowed" });
    return;
  }

  const ip = getClientIp(req);
  const now = Date.now();
  if (lastRequestByIp[ip] != null && now - lastRequestByIp[ip] < RATE_LIMIT_MS) {
    console.warn(`[${requestId}] Rate limited IP:`, ip);
    res.status(429).json({ error: "Please wait a moment before asking again." });
    return;
  }
  lastRequestByIp[ip] = now;

  const raw =
    (typeof req.body?.selectedText === "string" ? req.body.selectedText : req.body?.text)?.trim() ?? "";
  if (!raw) {
    console.warn(`[${requestId}] Missing or empty text`);
    res.status(400).json({ error: "Missing or empty text. Send selectedText or text." });
    return;
  }
  if (raw.length < MIN_TEXT_LENGTH) {
    res.status(400).json({ error: "Text must be at least 3 characters" });
    return;
  }
  if (raw.length > MAX_TEXT_LENGTH) {
    res.status(400).json({ error: "Text must be 500 characters or fewer" });
    return;
  }
  const text = raw.slice(0, MAX_TEXT_LENGTH);
  const lessonId = req.body?.lessonId;
  const pageUrl = req.body?.pageUrl;
  console.log(`[${requestId}] Request payload:`, { textLength: text.length, lessonId, pageUrl });

  const apiKey = process.env.OPENAI_API_KEY;
  if (!apiKey) {
    console.error(`[${requestId}] OPENAI_API_KEY not set`);
    res.status(503).json({
      error: "Explanation service is temporarily unavailable. (API key not configured.)",
    });
    return;
  }

  const userMessage = `Explain this term or concept clearly and simply in 1-3 short paragraphs, then list 3-6 bullet points, then list 2-5 key terms (one per line). If you cite a source, use ONLY these domains: irs.gov, sec.gov, fdic.gov, cfpb.gov, treasury.gov, ssa.gov, investopedia.com, or any .gov site. Format your response as JSON with keys: "summary" (string), "bullets" (array of strings), "keyTerms" (array of strings), "citations" (array of objects with "title" and "url"). If no citations, use "citations": [].\n\nText to explain: ${text}`;

  try {
    const response = await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${apiKey}`,
      },
      body: JSON.stringify({
        model: "gpt-4o-mini",
        messages: [
          { role: "system", content: WILBUR_SYSTEM },
          { role: "user", content: userMessage },
        ],
        max_tokens: 700,
        temperature: 0.4,
      }),
    });

    const responseText = await response.text();
    console.log(`[${requestId}] OpenAI status:`, response.status);

    if (!response.ok) {
      console.error(`[${requestId}] OpenAI error:`, response.status, responseText);
      res.status(500).json({
        error: "We couldn't get an explanation right now. Please try again in a moment.",
        debug: process.env.NODE_ENV !== "production" ? responseText.slice(0, 200) : undefined,
      });
      return;
    }

    let data: { choices?: Array<{ message?: { content?: string } }> };
    try {
      data = JSON.parse(responseText);
    } catch (parseErr) {
      console.error(`[${requestId}] OpenAI response parse error:`, parseErr);
      res.status(500).json({ error: "Invalid response from explanation service. Please try again." });
      return;
    }

    const content = data.choices?.[0]?.message?.content?.trim() ?? "";
    if (!content) {
      console.error(`[${requestId}] Empty content from OpenAI`);
      res.status(500).json({ error: "We couldn't get an explanation right now. Please try again." });
      return;
    }

    // Parse JSON from content (may be wrapped in markdown code block)
    let parsed: { summary?: string; bullets?: string[]; keyTerms?: string[]; citations?: { title?: string; url?: string }[] };
    const jsonMatch = content.match(/\{[\s\S]*\}/);
    if (jsonMatch) {
      try {
        parsed = JSON.parse(jsonMatch[0]) as typeof parsed;
      } catch {
        parsed = { summary: content, bullets: [], keyTerms: [], citations: [] };
      }
    } else {
      parsed = { summary: content, bullets: [], keyTerms: [], citations: [] };
    }

    const summary = typeof parsed.summary === "string" ? parsed.summary : content;
    const bullets = Array.isArray(parsed.bullets) ? parsed.bullets.filter((b) => typeof b === "string").slice(0, 6) : [];
    const keyTerms = Array.isArray(parsed.keyTerms) ? parsed.keyTerms.filter((k) => typeof k === "string").slice(0, 8) : [];
    const citations = filterCitations(Array.isArray(parsed.citations) ? parsed.citations : []);

    res.status(200).json({
      summary,
      bullets,
      keyTerms,
      citations,
      // Backward compatibility for clients that expect explanation
      explanation: summary,
    });
  } catch (e) {
    console.error(`[${requestId}] Explain API error:`, e);
    const message = e instanceof Error ? e.message : "Unknown error";
    res.status(500).json({
      error: "Something went wrong. Please try again in a moment.",
      debug: process.env.NODE_ENV !== "production" ? message : undefined,
    });
  }
}
