/**
 * Secure AI explain endpoint. API key is server-side only.
 * Rate limit: 1 request per 2 seconds per IP.
 */
const WILBUR_SYSTEM = `You are Wilbur, an educational financial literacy assistant.
You provide clear, simple explanations.
You DO NOT give financial advice.
You DO NOT recommend specific stocks, ETFs, crypto, options, or investment allocations.
All examples must be hypothetical.
Use plain language suitable for a first-time learner.
When appropriate, reference reputable sources such as IRS.gov, SEC.gov, FDIC.gov, CFPB.gov.
Keep responses concise (max 3 short paragraphs).
Optionally use a short bullet list.
Never provide prescriptive financial recommendations.`;

const RATE_LIMIT_MS = 2000;
const MIN_TEXT_LENGTH = 3;
const MAX_TEXT_LENGTH = 500;

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
    body?: { selectedText?: string; userProfile?: object };
    headers?: { [k: string]: string | string[] | undefined };
  },
  res: {
    status: (n: number) => { json: (o: object) => void; end: () => void };
    setHeader: (k: string, v: string) => void;
  }
) {
  res.setHeader("Content-Type", "application/json");

  if (req.method !== "POST") {
    res.status(405).json({ error: "Method not allowed" });
    return;
  }

  const ip = getClientIp(req);
  const now = Date.now();
  if (lastRequestByIp[ip] != null && now - lastRequestByIp[ip] < RATE_LIMIT_MS) {
    res.status(429).json({ error: "Please wait a moment before asking again." });
    return;
  }
  lastRequestByIp[ip] = now;

  const raw = typeof req.body?.selectedText === "string" ? req.body.selectedText.trim() : "";
  if (!raw) {
    res.status(400).json({ error: "Missing or empty selectedText" });
    return;
  }
  if (raw.length < MIN_TEXT_LENGTH) {
    res.status(400).json({ error: "selectedText must be at least 3 characters" });
    return;
  }
  if (raw.length > MAX_TEXT_LENGTH) {
    res.status(400).json({ error: "selectedText must be 500 characters or fewer" });
    return;
  }
  const selectedText = raw;

  const apiKey = process.env.OPENAI_API_KEY;
  if (!apiKey) {
    res.status(503).json({ error: "Explanation service is temporarily unavailable." });
    return;
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
        messages: [
          { role: "system", content: WILBUR_SYSTEM },
          {
            role: "user",
            content: `Explain this term or concept clearly and simply: ${selectedText}`,
          },
        ],
        max_tokens: 500,
        temperature: 0.4,
      }),
    });

    if (!response.ok) {
      const errBody = await response.text();
      console.error("OpenAI error", response.status, errBody);
      res.status(500).json({ error: "We couldn't get an explanation right now. Please try again in a moment." });
      return;
    }

    const data = (await response.json()) as {
      choices?: Array<{ message?: { content?: string } }>;
    };
    const content = data.choices?.[0]?.message?.content?.trim() ?? "";
    if (!content) {
      res.status(500).json({ error: "We couldn't get an explanation right now. Please try again." });
      return;
    }

    res.status(200).json({ explanation: content });
  } catch (e) {
    console.error("Explain API error", e);
    res.status(500).json({ error: "Something went wrong. Please try again in a moment." });
  }
}
