/**
 * Snapshot: "Your Paycheck Explained (W-2, Withholding, Take-Home Pay)"
 * Lesson ID: paycheck-basics
 * Track: First Job Out of College
 * Domain: taxes
 *
 * Education-only; 6–8 min read; beginner-friendly.
 * Block types: heading, paragraph, bullets, callout, chips, divider.
 */

export const paycheckBasicsSnapshot = {
  hero: {
    headline: "Your Paycheck Explained (W-2, Withholding, Take-Home Pay)",
    subhead:
      "Your paycheck is where adult money starts. Once you understand where the money goes, everything else becomes simpler.",
    takeaways: [
      "Gross pay is what you earn before anything is taken out; take-home (net) pay is what actually hits your account.",
      "Withholding is money your employer sends to the government on your behalf for taxes — you settle up when you file.",
      "A tax refund isn't free money — it's the government giving back what you overpaid during the year.",
    ],
  },

  sections: [
    {
      type: "heading",
      level: 2,
      text: "Gross vs take-home: the two numbers that matter",
    },
    {
      type: "paragraph",
      text: "When you get a job offer, the number they quote is usually your salary or hourly rate — that's your gross pay. It's what you earn before any taxes, insurance, or other deductions come out. The number that actually lands in your bank account each pay period is your take-home pay (sometimes called net pay). That's the one to use when you're planning your budget.",
    },
    {
      type: "callout",
      variant: "tip",
      title: "Budget from take-home, not gross",
      text: "If you plan your spending around your gross pay, you'll be surprised every month. Always base your budget on what you actually receive after withholdings and deductions.",
    },
    {
      type: "heading",
      level: 2,
      text: "What's coming out of your paycheck?",
    },
    {
      type: "paragraph",
      text: "A typical W-2 paycheck has a few common line items. You don't need to memorize every line — but knowing the big categories helps you read your pay stub and spot mistakes.",
    },
    {
      type: "bullets",
      items: [
        "Federal income tax — money sent to the IRS based on what you're expected to owe for the year.",
        "State (and sometimes local) tax — same idea, but for your state; not every state has income tax.",
        "Social Security and Medicare — often listed as FICA. These are set percentages that almost everyone pays on wages.",
        "Health insurance, 401(k), HSA/FSA, etc. — if you signed up for benefits, these show up as deductions too. They reduce your take-home but often save you money or build savings.",
      ],
    },
    {
      type: "divider",
    },
    {
      type: "heading",
      level: 2,
      text: "Withholding in plain English",
    },
    {
      type: "paragraph",
      text: "Withholding means your employer holds back part of your pay and sends it to the government (and sometimes to benefits) so you're not hit with one huge bill at tax time. You tell the employer how much to withhold using a form — for federal tax, that's usually a W-4. At the end of the year you file a tax return. If you overpaid, you get a refund; if you underpaid, you owe.",
    },
    {
      type: "chips",
      items: [
        "W-4: form you fill out so your employer knows how much federal tax to withhold",
        "W-2: form your employer sends you (and the IRS) summarizing your pay and taxes for the year",
      ],
    },
    {
      type: "heading",
      level: 2,
      text: "What's a W-2 and why do I care?",
    },
    {
      type: "paragraph",
      text: "A W-2 is a form your employer sends you by the end of January each year. It shows how much you were paid (wages, tips, etc.) and how much was withheld for federal and state taxes, Social Security, and Medicare. You use it when you file your tax return. If you work a regular job (W-2 employee), you'll get one per employer. Keep it in a safe place — you need it to file accurately.",
    },
    {
      type: "heading",
      level: 2,
      text: "Why a refund isn't free money",
    },
    {
      type: "paragraph",
      text: "Getting a big refund can feel like a bonus — but it's not. A refund means you paid more in withholding during the year than you actually owed. The government is just giving your own money back. Some people like the forced savings; others prefer to keep more in each paycheck and owe a little (or get a small refund) at tax time. Either way, it's your money moving around, not a gift.",
    },
    {
      type: "callout",
      variant: "note",
      title: "Education only",
      text: "This lesson is for learning only. It is not personalized tax or financial advice. For questions about your specific situation, use the IRS tools or a qualified tax professional.",
    },
  ],

  bottom: {
    examples: [
      {
        type: "callout",
        variant: "tip",
        title: "Example: Jordan's first pay stub",
        text: "Jordan's offer letter said $50,000 per year. On their first pay stub they see gross pay around $1,923 (for one biweekly paycheck), then lines for federal tax, state tax, Social Security, Medicare, and health insurance. Their take-home is about $1,420. They use that $1,420 — not the $1,923 — to plan rent, groceries, and savings. When they get their W-2 in January, they use it to file their return and see they overpaid a bit, so they get a small refund.",
      },
    ],
    video: [],
    quiz: {
      title: "Quick check: What did you learn?",
      questions: [
        {
          prompt: "Which number should you use when planning your monthly budget?",
          choices: [
            "Gross pay (before any deductions)",
            "Take-home (net) pay",
            "The amount you expect to get as a tax refund",
          ],
          correctIndex: 1,
          explanation:
            "You should budget from take-home pay — what actually lands in your account. Gross pay doesn't reflect taxes and other deductions, so planning from it leads to overspending.",
        },
        {
          prompt: "What is a W-2?",
          choices: [
            "A form you fill out to tell your employer how much tax to withhold",
            "A form your employer sends you summarizing your pay and taxes for the year",
            "A form that replaces filing a tax return",
          ],
          correctIndex: 1,
          explanation:
            "The W-2 is the annual summary from your employer showing your wages and withholdings. You use it when you file your tax return. The form you fill out to set withholding is the W-4.",
        },
        {
          prompt: "A tax refund means:",
          choices: [
            "The government is giving you free money as a reward",
            "You overpaid during the year and the government is returning the difference",
            "You don't have to file a tax return",
          ],
          correctIndex: 1,
          explanation:
            "A refund is the return of money you overpaid through withholding during the year. It's your own money coming back, not a bonus or gift.",
        },
      ],
    },
    sources: [
      {
        title: "IRS – Understanding your pay stub and W-2",
        url: "https://www.irs.gov/individuals/understanding-your-form-w-2",
        domain: "irs.gov",
        tier: 1 as const,
      },
      {
        title: "Consumer Financial Protection Bureau – Paying taxes",
        url: "https://www.consumerfinance.gov/consumer-tools/taxes/",
        domain: "consumerfinance.gov",
        tier: 1 as const,
      },
    ],
  },
} as const;

export default paycheckBasicsSnapshot;
