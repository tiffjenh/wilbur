/**
 * Unified Wilbur AI Helper API.
 * POST /api/wilbur
 * Body: { mode: "highlight" | "chat", lessonId?: string, selectedText?: string, question?: string, history?: { role: "user"|"assistant", content: string }[] }
 * Response: { answer: string } or { error: string, code?: string }
 * - highlight: selectedText required, <= 150 chars
 * - chat: question required, <= 300 chars, history <= 10 messages
 */
const WILBUR_SYSTEM = `You are Wilbur, an educational financial literacy assistant.
- Explain in plain language (8th–10th grade). Use bullets when helpful.
- Do NOT give financial advice or recommend specific investments. All examples are hypothetical.
- If a term relates to taxes or benefits, mention that rules vary by state and suggest checking official sources (IRS, state revenue department, FDIC, CFPB). Do NOT fabricate exact citations or quotes.
- Educational only; never personalized financial advice.`;

const RATE_LIMIT_MS = 2000;
const MAX_HIGHLIGHT = 150;
const MAX_QUESTION = 300;
const MAX_HISTORY = 10;

const lastByIp: Record<string, number> = {};

function getClientIp(req: { headers?: { [k: string]: string | string[] | undefined } }): string {
  const f = req.headers?.["x-forwarded-for"];
  if (typeof f === "string") return f.split(",")[0].trim();
  if (Array.isArray(f)) return (f[0] ?? "").trim();
  return (req.headers?.["x-real-ip"] as string) ?? "unknown";
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
  if (lastByIp[ip] != null && now - lastByIp[ip] < RATE_LIMIT_MS) {
    console.warn(`[${requestId}] Rate limited:`, ip);
    res.status(429).json({ error: "Please wait a moment before asking again.", code: "RATE_LIMIT" });
    return;
  }
  lastByIp[ip] = now;

  const mode = req.body?.mode;
  const lessonId = typeof req.body?.lessonId === "string" ? req.body.lessonId : undefined;
  const selectedText = typeof req.body?.selectedText === "string" ? req.body.selectedText.trim() : undefined;
  const question = typeof req.body?.question === "string" ? req.body.question.trim() : undefined;
  let history = Array.isArray(req.body?.history) ? req.body.history : [];

  if (mode !== "highlight" && mode !== "chat") {
    res.status(400).json({ error: "Invalid or missing mode. Use 'highlight' or 'chat'.", code: "INVALID_MODE" });
    return;
  }

  const apiKey = process.env.OPENAI_API_KEY;
  if (!apiKey) {
    console.error(`[${requestId}] OPENAI_API_KEY not set`);
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

  console.log(`[${requestId}] mode=${mode} lessonId=${lessonId ?? "none"} len=${mode === "highlight" ? selectedText!.length : question!.length}`);

  const messages: { role: "system" | "user" | "assistant"; content: string }[] = [
    { role: "system", content: WILBUR_SYSTEM },
  ];

  if (mode === "highlight") {
    messages.push({
      role: "user",
      content: `Explain this term or phrase from a financial literacy lesson in simple, educational language. Use short paragraphs and bullets if helpful. Do not give personalized advice. If relevant, mention that rules can vary by state and suggest official sources (IRS, FDIC, CFPB, state .gov) without making up specific URLs or quotes.\n\nTerm or phrase to explain: "${selectedText}"`,
    });
  } else {
    for (const m of history) {
      messages.push({ role: m.role as "user" | "assistant", content: m.content });
    }
    messages.push({
      role: "user",
      content: question!,
    });
  }

  try {
    const response = await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${apiKey}`,
      },
      body: JSON.stringify({
        model: "gpt-4o-mini",
        messages,
        max_tokens: 600,
        temperature: 0.4,
      }),
    });

    const responseText = await response.text();
    console.log(`[${requestId}] OpenAI status:`, response.status);

    if (!response.ok) {
      console.error(`[${requestId}] OpenAI error:`, response.status, responseText.slice(0, 300));
      res.status(500).json({
        error: "We couldn't get an answer right now. Please try again.",
        code: "PROVIDER_ERROR",
      });
      return;
    }

    let data: { choices?: Array<{ message?: { content?: string } }> };
    try {
      data = JSON.parse(responseText);
    } catch {
      res.status(500).json({ error: "Invalid response from AI. Please try again.", code: "PARSE_ERROR" });
      return;
    }

    const answer = data.choices?.[0]?.message?.content?.trim() ?? "";
    if (!answer) {
      res.status(500).json({ error: "We couldn't get an answer right now. Please try again.", code: "EMPTY_RESPONSE" });
      return;
    }

    res.status(200).json({ answer });
  } catch (e) {
    console.error(`[${requestId}] Error:`, e);
    res.status(500).json({
      error: "Something went wrong. Please try again in a moment.",
      code: "SERVER_ERROR",
    });
  }
}
