/**
 * Snapshot: "W-2 vs 1099 (What Changes for Taxes and Benefits)"
 * Lesson ID: w2-vs-1099
 * Domain: incomeBenefits
 * Education-only; 6–8 min read; beginner-friendly.
 */

export const w2Vs1099Snapshot = {
  hero: {
    headline: "W-2 vs 1099 (What Changes for Taxes and Benefits)",
    subhead:
      "Same work, different rules. Learn what changes so you don't get surprised at tax time — and so you can plan with confidence.",
    takeaways: [
      "W-2 usually means taxes are withheld automatically; 1099 usually means you set money aside yourself.",
      "W-2 often includes benefits (like a 401k); 1099 usually doesn't — but you may have more flexibility.",
      "The goal isn't to memorize forms — it's to know what to track and what to do next.",
    ],
  },

  sections: [
    { type: "heading", level: 2, text: "The simplest difference" },
    {
      type: "paragraph",
      text:
        "W-2 and 1099 describe how you get paid — and who's responsible for handling taxes.",
    },
    {
      type: "bullets",
      items: [
        "W-2: you're an employee. Your employer usually withholds taxes from each paycheck.",
        "1099: you're typically a contractor. Taxes usually aren't withheld — you set money aside and pay later.",
      ],
    },
    {
      type: "callout",
      variant: "note",
      title: "Quick mindset",
      text:
        "W-2 = taxes happen automatically in the background.\n1099 = you build your own system so you don't get surprised later.",
    },
    { type: "divider" },
    { type: "heading", level: 2, text: "What changes in real life" },
    {
      type: "paragraph",
      text:
        "Here's what's different day-to-day. You don't need to know every detail — just the practical implications.",
    },
    {
      type: "bullets",
      items: [
        "Taxes: W-2 usually withholds; 1099 usually does not.",
        "Benefits: W-2 may include benefits (401k, health insurance); 1099 usually does not.",
        "Tracking: 1099 income requires tracking earnings and expenses more carefully.",
        "Stability: W-2 often has steadier pay; 1099 can be uneven month to month.",
      ],
    },
    {
      type: "callout",
      variant: "warning",
      title: "Common mistake",
      text:
        "Spending all your 1099 income like it's take-home pay. If you don't set aside tax money, tax season can feel like an emergency.",
    },
    { type: "divider" },
    { type: "heading", level: 2, text: "A simple 'set aside' rule of thumb (education-only)" },
    {
      type: "paragraph",
      text:
        "For many 1099 earners, a safe habit is setting aside a portion of each payment into a separate \"tax\" account. The exact amount depends on your situation, so this is general education — not personal advice.",
    },
    {
      type: "chips",
      items: [
        "Separate account for taxes",
        "Track income monthly",
        "Track expenses with receipts",
        "Avoid surprises",
      ],
    },
    {
      type: "callout",
      variant: "note",
      title: "Education-only note",
      text:
        "Wilbur won't tell you the exact percentage to set aside for taxes, because that depends on income, state, deductions, and more. The key lesson: build a consistent habit and verify details with official resources or a tax pro if needed.",
    },
    { type: "divider" },
    { type: "heading", level: 2, text: "Your next 3 steps (choose one to do today)" },
    {
      type: "paragraph",
      text:
        "You don't need to overhaul your life. Pick one step to do today, then come back for the next.",
    },
    {
      type: "bullets",
      items: [
        "If you're W-2: look at one paycheck and find your gross pay, taxes withheld, and take-home pay.",
        "If you're 1099: open a separate account (or bucket) where you set aside money for taxes.",
        "If you're both: treat 1099 income as its own mini-business (track income + expenses).",
      ],
    },
    {
      type: "callout",
      variant: "tip",
      title: "Tip",
      text:
        "If your income is uneven (common with 1099), a simple budget works better than a strict one. Focus on your 'must-pay' bills first.",
    },
  ],

  bottom: {
    examples: [
      {
        type: "callout",
        variant: "note",
        title: "Example: Sam (W-2 + side gig)",
        text:
          "Sam earns W-2 income from a full-time job and also makes 1099 income from weekend photography.\n\nSam's W-2 paycheck already withholds taxes. But the 1099 payments don't — so Sam sets aside money from each 1099 payment into a separate 'tax' bucket and tracks gear + software expenses with receipts.",
      },
    ],
    video: [],
    quiz: {
      title: "Quick check: W-2 vs 1099",
      questions: [
        {
          prompt: "What's the biggest practical difference between W-2 and 1099 income?",
          choices: [
            "W-2 is always higher pay",
            "1099 means taxes are usually not withheld automatically",
            "W-2 income is tax-free",
            "1099 income can't be budgeted",
          ],
          correctIndex: 1,
          explanation:
            "With 1099, taxes usually aren't withheld — you need a system to set money aside and track properly.",
        },
        {
          prompt: "Which is a common mistake for 1099 earners?",
          choices: [
            "Tracking income monthly",
            "Using a separate account for taxes",
            "Spending all income like it's take-home pay",
            "Saving receipts for expenses",
          ],
          correctIndex: 2,
          explanation:
            "If you don't set aside money for taxes, tax season can feel like an emergency.",
        },
        {
          prompt: "If you have both W-2 and 1099 income, what's a good general approach?",
          choices: [
            "Ignore the 1099 because you already pay taxes on W-2",
            "Treat 1099 income as its own mini-business and track it separately",
            "Only track expenses if you make over $1M",
            "Only pay taxes once every five years",
          ],
          correctIndex: 1,
          explanation:
            "Keeping 1099 income separate helps you track earnings/expenses and avoid surprises.",
        },
      ],
    },
    sources: [
      {
        title: "IRS — Self-Employed Individuals Tax Center",
        url: "https://www.irs.gov/businesses/small-businesses-self-employed/self-employed-individuals-tax-center",
        domain: "irs.gov",
        tier: 1,
      },
      {
        title: "IRS — Independent contractor (information & definitions)",
        url: "https://www.irs.gov/newsroom/understanding-employee-vs-contractor-designation",
        domain: "irs.gov",
        tier: 1,
      },
      {
        title: "CFPB — Paying taxes and tracking income (consumer guidance)",
        url: "https://www.consumerfinance.gov/consumer-tools/",
        domain: "consumerfinance.gov",
        tier: 1,
      },
    ],
  },
} as const;

export default w2Vs1099Snapshot;
