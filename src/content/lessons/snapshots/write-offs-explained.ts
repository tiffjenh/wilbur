/**
 * Snapshot: "Write-Offs Explained (What They Are and What They Aren't)"
 * Lesson ID: write-offs-explained
 * Domain: taxes
 * Education-only; 6–8 min read; beginner-friendly.
 */

export const writeOffsExplainedSnapshot = {
  hero: {
    headline: "Write-Offs Explained (What They Are and What They Aren't)",
    subhead:
      "Write-off is another word for a tax deduction. Here's what that actually means, how it differs from a credit, and why it matters for 1099 and side income.",
    takeaways: [
      "A write-off (deduction) reduces your taxable income; a credit reduces your tax bill dollar for dollar.",
      "You can only deduct expenses that are ordinary, necessary, and allowed by the IRS for your situation.",
      "Mixing personal and business spending or guessing at numbers can get you in trouble — keep it clear and documented.",
    ],
  },

  sections: [
    { type: "heading", level: 2, text: "Deduction vs credit (in plain English)" },
    {
      type: "paragraph",
      text:
        "A deduction (often called a write-off) lowers the amount of income the government taxes. If you're in the 22% bracket and you have a $1,000 deduction, you save about $220 in federal tax. A credit reduces your tax bill directly: a $1,000 credit means $1,000 less tax. Credits are often more valuable per dollar, but deductions still matter a lot, especially when you have business or side income.",
    },
    {
      type: "bullets",
      items: [
        "Deduction: reduces taxable income → your tax is calculated on a lower number.",
        "Credit: reduces your tax bill dollar for dollar (e.g. child tax credit, education credits).",
      ],
    },
    {
      type: "callout",
      variant: "warning",
      title: "Common mistake",
      text:
        "Calling everything a 'write-off' or deducting personal expenses. Only expenses that are ordinary, necessary, and allowed for your situation are deductible. Mixing personal and business spending can trigger audits and penalties.",
    },
    { type: "divider" },
    { type: "heading", level: 2, text: "When write-offs matter most" },
    {
      type: "paragraph",
      text:
        "If you're a W-2 employee with no side business, you might take the standard deduction and have few itemized deductions. If you're 1099, have a side business, or own rental property, you'll have more expenses that might be deductible — things like home office (if allowed), supplies, mileage for business, and professional services. The rules are specific; the IRS and a tax pro can help you stay within them.",
    },
    {
      type: "chips",
      items: [
        "Keep records: receipts, mileage logs, and a simple spreadsheet",
        "Separate business and personal: use a dedicated account or category for business",
        "When in doubt: check IRS guidelines or ask a qualified preparer",
      ],
    },
    {
      type: "callout",
      variant: "note",
      title: "Education only",
      text:
        "This is general education, not tax advice. Deduction rules depend on your situation and change over time. Use the IRS or a qualified tax professional for your own return.",
    },
    { type: "divider" },
    { type: "heading", level: 2, text: "Myth vs reality" },
    {
      type: "paragraph",
      text:
        "'Write it off' doesn't mean the expense is free — it means you may reduce your taxable income by that amount, so you pay less tax. And you can only deduct what the IRS allows. A big refund from deductions alone might mean you overpaid during the year; the goal is to keep more of what you earn while staying within the rules.",
    },
  ],

  bottom: {
    examples: [
      {
        type: "callout",
        variant: "tip",
        title: "Example: Jordan (freelance designer)",
        text:
          "Jordan works from home and buys a new laptop used only for client work. They keep the receipt and record it as a business expense. That deduction might reduce their taxable income by the cost of the laptop, so they pay less tax. If they used the laptop half for work and half for personal use, only the business portion might be deductible — and they'd need to document it.",
      },
    ],
    video: [],
    quiz: {
      title: "Quick check: write-offs",
      questions: [
        {
          prompt: "What does a deduction (write-off) do?",
          choices: [
            "Increases your taxable income",
            "Reduces your taxable income so you pay tax on a lower amount",
            "Reduces your tax bill dollar for dollar like a credit",
            "Eliminates the need to file",
          ],
          correctIndex: 1,
          explanation:
            "A deduction lowers the income you're taxed on; your tax is then calculated on that lower amount.",
        },
        {
          prompt: "What's a common mistake with write-offs?",
          choices: [
            "Keeping receipts",
            "Deducting personal expenses or mixing personal and business spending",
            "Using the standard deduction when it's better for you",
            "Checking IRS rules",
          ],
          correctIndex: 1,
          explanation:
            "Only ordinary, necessary, and allowed expenses are deductible. Personal or unallowed deductions can lead to problems.",
        },
        {
          prompt: "This lesson is:",
          choices: [
            "Specific advice for your return",
            "General education on what deductions are and how they work",
            "A guarantee of a bigger refund",
          ],
          correctIndex: 1,
          explanation:
            "It's educational. Your situation may vary; use the IRS or a qualified professional for your taxes.",
        },
      ],
    },
    sources: [
      {
        title: "IRS — Deductions for individuals",
        url: "https://www.irs.gov/credits-deductions-for-individuals",
        domain: "irs.gov",
        tier: 1,
      },
      {
        title: "IRS — Small Business and Self-Employed Tax Center",
        url: "https://www.irs.gov/businesses/small-businesses-self-employed",
        domain: "irs.gov",
        tier: 1,
      },
      {
        title: "MyMoney.gov — Taxes and saving",
        url: "https://www.mymoney.gov/",
        domain: "mymoney.gov",
        tier: 1,
      },
    ],
  },
} as const;

export default writeOffsExplainedSnapshot;
