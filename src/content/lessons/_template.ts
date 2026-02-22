/**
 * Lesson template — copy this file to create a new lesson.
 *
 * Content policy:
 *   - Any tax/legal/benefits rule must cite IRS/DOL/state agency first.
 *   - Investopedia allowed only as a readability supplement, never the sole source.
 *   - Every lesson must include an "Educational only, not advice" callout block.
 *   - Lessons must include ≥2 visual blocks (chart, comparison, example, interactive).
 *   - Max 1 hero block. Max 1 short paragraph (prefer bullets over prose).
 */
import type { BlockLesson } from "@/content/lessonTypes";

export const TEMPLATE_LESSON: BlockLesson = {
  id: "example-lesson-id",
  slug: "example-lesson-id",        // matches URL: /lesson/example-lesson-id
  title: "Example Lesson Title",
  subtitle: "One sentence max — what they will learn.",
  module: "module-a",               // module-a through module-j
  level: "beginner",
  tags: ["money-basics", "visual-heavy", "level-1"],
  recommendedFor: ["confidence-low", "no-savings"],
  estimatedTime: 8,

  blocks: [
    // 1. Hero — required, one per lesson
    {
      type: "hero",
      emoji: "💡",
      title: "Big idea in one sentence",
      subtitle: "Optional supporting context.",
    },

    // 2. Bullet list — prefer over paragraphs
    {
      type: "bullet-list",
      heading: "What you need to know",
      items: [
        "1–2 key points max per bullet.",
        "Keep it simple and concrete.",
        "Avoid jargon — if you use a term, explain it.",
      ],
      icon: "check",
    },

    // 3. Callout — tip / info / warning / source
    {
      type: "callout",
      tone: "tip",
      heading: "Quick win",
      text: "One actionable tip related to the concept.",
    },

    // 4. Example block — concrete scenario
    {
      type: "example",
      heading: "Real example",
      scenario: "Example: You make $2,500/month after taxes",
      breakdown: [
        "If you save $250/month, that's 10% of income.",
        "Set up an automatic transfer on payday so it happens before you spend.",
      ],
      outcome: "After 6 months: $1,500 saved — with zero willpower required.",
    },

    // 5. Comparison block — great for A vs B decisions
    {
      type: "comparison",
      heading: "Option A vs. Option B",
      left: {
        label: "Option A",
        emoji: "🅰️",
        points: [
          "Key feature 1",
          "Key feature 2",
        ],
        verdict: "Best when: [condition]",
      },
      right: {
        label: "Option B",
        emoji: "🅱️",
        points: [
          "Key feature 1",
          "Key feature 2",
        ],
        verdict: "Best when: [condition]",
      },
      note: "Optional footer note about the comparison.",
    },

    // 6. Chart block — keep data minimal and clear
    {
      type: "chart",
      chartType: "pie",     // bar | line | pie | compound-growth
      title: "Simple budget example",
      subtitle: "Hypothetical — not advice",
      data: [
        { label: "Needs", value: 50, color: "#0E5C4C" },
        { label: "Wants", value: 30, color: "#4A9B8A" },
        { label: "Savings", value: 20, color: "#C4EAE5" },
      ],
    },

    // 7. Interactive slider — compound interest, debt payoff, or budget
    {
      type: "interactive-slider",
      heading: "Try it: see the numbers for yourself",
      description: "This is an educational tool, not financial advice.",
      calculatorType: "compound-interest",  // compound-interest | debt-payoff | budget
      sliders: [
        { id: "monthly", label: "Monthly contribution", min: 50, max: 1000, step: 25, defaultValue: 200, format: "currency" },
        { id: "years",   label: "Years invested",       min: 1,  max: 40,   step: 1,  defaultValue: 20,  format: "years"    },
        { id: "rate",    label: "Annual return",         min: 1,  max: 12,   step: 0.5, defaultValue: 7,  format: "percent"  },
      ],
    },

    // 8. Quiz — one question max per lesson
    {
      type: "quiz",
      question: "What is the question?",
      options: [
        { id: "a", text: "Wrong answer" },
        { id: "b", text: "Correct answer", correct: true },
        { id: "c", text: "Wrong answer" },
      ],
      explanation: "Explanation shown after answering.",
    },

    // 9. Required disclaimer callout — every lesson must end with this
    {
      type: "callout",
      tone: "warning",
      text: "Educational content only. All examples are hypothetical. This is not financial advice. Consult a licensed financial professional for advice specific to your situation.",
    },
  ],

  sources: [
    {
      name: "IRS",
      url: "https://www.irs.gov/",
      type: "government",
      lastReviewed: "2026-02-21",
    },
    {
      name: "FDIC",
      url: "https://www.fdic.gov/",
      type: "regulator",
      lastReviewed: "2026-02-21",
    },
    // Investopedia is supplementary only — never the sole source for rules
    {
      name: "Investopedia",
      url: "https://www.investopedia.com/",
      type: "reputable-explainer",
      lastReviewed: "2026-02-21",
    },
  ],
};
