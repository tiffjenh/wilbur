/**
 * Zod schemas for CMS lesson content validation.
 * Used at runtime (fetch) and by CLI validate/publish scripts.
 */
import { z } from "zod";

const MAX_PARAGRAPH = 500;
const MAX_BULLET_ITEM = 140;
const MAX_HEADING = 120;
const MAX_CONTENT_TEXT = 3500;

export const ALLOWED_CITATION_DOMAINS_TIER1 = [
  "irs.gov",
  "sec.gov",
  "investor.gov",
  "consumerfinance.gov",
  "fdic.gov",
  "federalreserve.gov",
  "treasury.gov",
  "finra.org",
] as const;

export const ALLOWED_CITATION_DOMAINS_TIER2 = ["investopedia.com"] as const;

const ALLOWED_DOMAINS = [...ALLOWED_CITATION_DOMAINS_TIER1, ...ALLOWED_CITATION_DOMAINS_TIER2];

const citationDomainSchema = z.string().refine(
  (d) => {
    const lower = d.toLowerCase().replace(/^www\./, "");
    return ALLOWED_DOMAINS.some((a) => lower === a || lower.endsWith("." + a));
  },
  { message: "Citation domain must be in allowed Tier 1 or Tier 2 list" }
);

/** Disallowed phrases (no financial advice). */
const NO_ADVICE_PATTERNS = [
  /\byou\s+should\s+buy\b/i,
  /\bbest\s+stock\b/i,
  /\binvest\s+in\s+[A-Z]/i,
  /\ballocate\s+\d+\s*%/i,
  /\byou\s+should\s+invest\b/i,
  /\b(?:buy|sell)\s+(?:this\s+)?stock\b/i,
];

function noAdviceLint(text: string): string | null {
  for (const re of NO_ADVICE_PATTERNS) {
    if (re.test(text)) return `Content may not contain advice phrases like "${text.slice(Math.max(0, text.search(re) - 20), text.search(re) + 40)}..."`;
  }
  return null;
}

function extractTextFromBlock(block: unknown): string {
  if (!block || typeof block !== "object") return "";
  const o = block as Record<string, unknown>;
  if (typeof o.text === "string") return o.text;
  if (Array.isArray(o.items)) return (o.items as string[]).join(" ");
  if (Array.isArray(o.bullets)) return (o.bullets as string[]).join(" ");
  if (Array.isArray(o.left)) return o.left.map(extractTextFromBlock).join(" ");
  if (Array.isArray(o.right)) return o.right.map(extractTextFromBlock).join(" ");
  if (Array.isArray(o.cards)) return o.cards.map((c: unknown) => extractTextFromBlock(c)).join(" ");
  return "";
}

const headingSchema = z.object({
  type: z.literal("heading"),
  level: z.union([z.literal(2), z.literal(3)]),
  text: z.string().min(1).max(MAX_HEADING),
});

const paragraphSchema = z.object({
  type: z.literal("paragraph"),
  text: z.string().min(1).max(MAX_PARAGRAPH),
});

const bulletsSchema = z.object({
  type: z.literal("bullets"),
  items: z.array(z.string().min(1).max(MAX_BULLET_ITEM)).min(1),
});

const calloutSchema = z.object({
  type: z.literal("callout"),
  variant: z.enum(["tip", "note", "warning"]),
  title: z.string().optional(),
  text: z.string().min(1).max(MAX_PARAGRAPH),
});

const chipsSchema = z.object({
  type: z.literal("chips"),
  items: z.array(z.string().min(1)).min(1),
});

const dividerSchema = z.object({ type: z.literal("divider") });

const chartPlaceholderSchema = z.object({
  type: z.literal("chartPlaceholder"),
  chartType: z.enum(["line", "bar", "pie"]),
  title: z.string().min(1),
  description: z.string().min(1),
});

const imagePlaceholderSchema = z.object({
  type: z.literal("imagePlaceholder"),
  title: z.string().min(1),
  description: z.string().min(1),
});

const comparisonCardSchema = z.object({
  title: z.string().min(1),
  bullets: z.array(z.string().min(1)),
  badge: z.string().optional(),
});

const comparisonCardsSchema = z.object({
  type: z.literal("comparisonCards"),
  cards: z.tuple([comparisonCardSchema, comparisonCardSchema]),
});

export const BlockSchema: z.ZodType<unknown> = z.lazy(() =>
  z.union([
    headingSchema,
    paragraphSchema,
    bulletsSchema,
    calloutSchema,
    chipsSchema,
    dividerSchema,
    z.object({
      type: z.literal("twoColumn"),
      left: z.array(BlockSchema),
      right: z.array(BlockSchema),
    }),
    chartPlaceholderSchema,
    imagePlaceholderSchema,
    comparisonCardsSchema,
  ])
);

export const SourceCitationSchema = z.object({
  title: z.string().min(1),
  url: z.string().url(),
  domain: citationDomainSchema,
  tier: z.union([z.literal(1), z.literal(2)]),
});

export const QuizQuestionSchema = z
  .object({
    prompt: z.string().min(1),
    choices: z.array(z.string().min(1)).min(3),
    correctIndex: z.number().int().min(0),
    explanation: z.string().min(1),
  })
  .refine((q) => q.correctIndex < q.choices.length, { message: "correctIndex must be less than choices length", path: ["correctIndex"] });

export const QuizSpecSchema = z.object({
  title: z.string().min(1),
  questions: z.tuple([QuizQuestionSchema, QuizQuestionSchema, QuizQuestionSchema]),
});

export const LessonContentSchema = z
  .object({
    hero_takeaways: z.array(z.string().min(1)).min(1).max(6),
    content_blocks: z.array(BlockSchema).min(3),
    example_blocks: z.array(BlockSchema),
    video_blocks: z.array(BlockSchema),
    quiz: QuizSpecSchema.nullable(),
    source_citations: z.array(SourceCitationSchema),
  })
  .superRefine((data, ctx) => {
    let total = 0;
    for (const b of data.content_blocks) {
      total += extractTextFromBlock(b).length;
      if (total > MAX_CONTENT_TEXT) {
        ctx.addIssue({ code: z.ZodIssueCode.custom, message: `content_blocks combined text exceeds ${MAX_CONTENT_TEXT} chars` });
        return;
      }
    }
    for (const b of [...data.example_blocks, ...data.video_blocks]) {
      const advice = noAdviceLint(extractTextFromBlock(b));
      if (advice) ctx.addIssue({ code: z.ZodIssueCode.custom, message: advice });
    }
    for (const b of data.content_blocks) {
      const text = extractTextFromBlock(b);
      const advice = noAdviceLint(text);
      if (advice) ctx.addIssue({ code: z.ZodIssueCode.custom, message: advice });
    }
    if (data.quiz) {
      for (const q of data.quiz.questions) {
        const advice = noAdviceLint(q.prompt + " " + q.explanation);
        if (advice) ctx.addIssue({ code: z.ZodIssueCode.custom, message: advice });
      }
    }
  });

export type LessonContentValidated = z.infer<typeof LessonContentSchema>;

export interface ValidationResult {
  success: boolean;
  errors: string[];
}

export function validateLessonContent(lesson: {
  hero_takeaways: unknown;
  content_blocks: unknown;
  example_blocks: unknown;
  video_blocks: unknown;
  quiz: unknown;
  source_citations: unknown;
}): ValidationResult {
  const result = LessonContentSchema.safeParse(lesson);
  if (result.success) return { success: true, errors: [] };
  const messages: string[] = [];
  for (const issue of result.error.issues) {
    const path = issue.path.length ? issue.path.join(".") + ": " : "";
    messages.push(path + issue.message);
  }
  return { success: false, errors: messages };
}
