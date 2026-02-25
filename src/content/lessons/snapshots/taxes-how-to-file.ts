/**
 * Snapshot: "How to File Your Taxes (What You Need + Software Options)"
 * Lesson ID: taxes-how-to-file
 * Domain: taxes
 * Education-only; 6–9 min read; beginner-friendly.
 */

export const taxesHowToFileSnapshot = {
  hero: {
    headline: "How to File Your Taxes (What You Need + Software Options)",
    subhead:
      "Filing doesn't have to be scary. Here's what you need, when it's due, and how to choose between DIY software and getting help.",
    takeaways: [
      "You need your income forms (W-2, 1099s, etc.) and a few personal details; then you pick a filing method.",
      "Free File and commercial software (TurboTax, H&R Block, etc.) can walk you through step by step.",
      "When in doubt, use IRS Free File or a qualified preparer — and file on time or request an extension.",
    ],
  },

  sections: [
    { type: "heading", level: 2, text: "What you need before you start" },
    {
      type: "paragraph",
      text:
        "Gather your documents first. For most people that means: W-2(s) from employers, 1099s if you had freelance or interest income, and your Social Security number (and your spouse's if filing jointly). You'll also need last year's return if you're using software that imports it.",
    },
    {
      type: "bullets",
      items: [
        "W-2: from each employer, usually by end of January.",
        "1099-NEC, 1099-INT, 1099-DIV, etc.: from payers who reported paying you.",
        "Records of deductions or credits you plan to claim (e.g. education, IRA contributions).",
      ],
    },
    {
      type: "callout",
      variant: "warning",
      title: "Common mistake",
      text:
        "Filing before you have all your forms. If you file too early and then get another 1099, you may need to amend. It's okay to wait until you have everything — or file by the deadline and amend later if something shows up.",
    },
    { type: "divider" },
    { type: "heading", level: 2, text: "Ways to file: Free File vs paid software vs a pro" },
    {
      type: "paragraph",
      text:
        "The IRS Free File program offers free guided filing for many taxpayers based on income. Commercial options like TurboTax and H&R Block walk you through with questions and often support more situations (e.g. self-employment, investments). A CPA or enrolled agent is useful if your situation is complex or you want someone to double-check.",
    },
    {
      type: "chips",
      items: [
        "IRS Free File: free for qualifying income; good for straightforward W-2 returns",
        "TurboTax / H&R Block: paid tiers; good for more complex or 1099 situations",
        "CPA / preparer: paid; best when you have a business, rentals, or want expert review",
      ],
    },
    {
      type: "callout",
      variant: "note",
      title: "Education only",
      text:
        "This is general education, not tax advice. Your situation may require different steps. Use the IRS or a qualified professional for your own filing.",
    },
    { type: "divider" },
    { type: "heading", level: 2, text: "Deadlines and extensions" },
    {
      type: "paragraph",
      text:
        "The usual filing deadline is April 15 (or the next business day). If you need more time, you can request an extension — that gives you until October to file, but it does not extend the time to pay any tax you owe. Pay what you estimate by April to avoid interest and penalties.",
    },
  ],

  bottom: {
    examples: [
      {
        type: "callout",
        variant: "tip",
        title: "Example: Alex (one W-2, no side income)",
        text:
          "Alex has one job and gets one W-2. They use IRS Free File, enter their W-2 and personal info, answer the questions, and get a refund. Total time: under an hour. No need for paid software unless they prefer the interface or have deductions to itemize.",
      },
    ],
    video: [],
    quiz: {
      title: "Quick check: filing taxes",
      questions: [
        {
          prompt: "What's a common mistake when filing?",
          choices: [
            "Waiting until you have all your forms",
            "Filing before you have all your income forms (e.g. missing a 1099)",
            "Using Free File when eligible",
            "Requesting an extension when needed",
          ],
          correctIndex: 1,
          explanation:
            "Filing too early can mean missing a form and having to amend. It's better to wait for key documents or amend later.",
        },
        {
          prompt: "Does an extension to file give you more time to pay any tax you owe?",
          choices: [
            "Yes, you can pay in October",
            "No — you should still pay your estimated tax by the April deadline to avoid interest and penalties",
            "Only if you use a CPA",
          ],
          correctIndex: 1,
          explanation:
            "An extension extends the time to file, not the time to pay. Estimate and pay by April if you owe.",
        },
        {
          prompt: "This lesson is:",
          choices: [
            "Personalized tax advice for your return",
            "General education on how filing works and what options you have",
            "A replacement for the IRS",
          ],
          correctIndex: 1,
          explanation:
            "It's educational. Use IRS tools or a qualified preparer for your specific situation.",
        },
      ],
    },
    sources: [
      { title: "IRS — Free File", url: "https://www.irs.gov/filing/free-file-do-your-federal-taxes-for-free", domain: "irs.gov", tier: 1 },
      { title: "IRS — Filing deadlines and extensions", url: "https://www.irs.gov/filing", domain: "irs.gov", tier: 1 },
      { title: "MyMoney.gov — Taxes", url: "https://www.mymoney.gov/", domain: "mymoney.gov", tier: 1 },
    ],
  },
} as const;

export default taxesHowToFileSnapshot;
