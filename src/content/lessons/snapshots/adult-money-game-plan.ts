/**
 * Gold-standard snapshot: "Your Simple Money Game Plan (What to Do First)"
 * Lesson ID: adult-money-game-plan
 * Track: First Job Out of College
 * Domain: moneyFoundations
 *
 * Structure: hero + sections + bottom (examples, video, quiz, sources).
 * Block types in sections: heading, paragraph, bullets, callout, chips, divider,
 * twoColumn, comparisonCards, chartPlaceholder, imagePlaceholder.
 * Education-only; 6–8 min read; beginner-friendly.
 */

export const adultMoneyGamePlanSnapshot = {
  hero: {
    headline: "Your Simple Money Game Plan (What to Do First)",
    subhead:
      "When money feels overwhelming, the biggest problem is not knowing what matters first. Here's a simple order-of-operations so you can stop guessing.",
    takeaways: [
      "Most people learn money in the same order: stability first, then debt, then investing.",
      "You can ignore a lot of noise and focus on your next 1–2 steps.",
      "Clarity beats perfection — pick one or two focus areas and start there.",
    ],
  },

  sections: [
    {
      type: "heading",
      level: 2,
      text: "Why order of operations matters",
    },
    {
      type: "paragraph",
      text: "Money advice is everywhere, and a lot of it is good — but it can feel like everyone is telling you to do everything at once. The secret isn't more information. It's knowing what to do first.",
    },
    {
      type: "callout",
      variant: "tip",
      title: "One thing at a time",
      text: "You don't have to fix your whole financial life this month. Pick the step that matters most for where you are now, do that, then move to the next.",
    },
    {
      type: "heading",
      level: 2,
      text: "The order that works for most people",
    },
    {
      type: "paragraph",
      text: "After talking to thousands of people and looking at what actually moves the needle, a simple sequence keeps coming up. You don't have to follow it like a rulebook — but it helps to know the order so you're not putting the roof on before the foundation.",
    },
    {
      type: "bullets",
      items: [
        "Stability first — know where your money goes, build a small buffer (emergency fund), and stop the leaks.",
        "Debt next — especially high-interest debt like credit cards. Get to a place where you're not adding new debt and you have a plan for what you owe.",
        "Investing last — once you're stable and not drowning in expensive debt, investing starts to make sense. Before that, it's optional.",
      ],
    },
    {
      type: "divider",
    },
    {
      type: "heading",
      level: 2,
      text: "What you can ignore for now",
    },
    {
      type: "paragraph",
      text: "It's easy to feel like you're behind because you're not maxing a 401(k) or buying stocks. For most people early in their journey, those are later steps. Right now you can ignore:",
    },
    {
      type: "chips",
      items: [
        "Picking individual stocks",
        "Crypto and speculative bets",
        "Complex tax moves",
        "Comparing every bank account in the country",
      ],
    },
    {
      type: "paragraph",
      text: "Focus on the basics: a simple budget, a small emergency fund, and a plan for any high-interest debt. The rest can wait until those are in place.",
    },
    {
      type: "callout",
      variant: "note",
      title: "Education only",
      text: "This lesson is for learning only. It is not personalized financial advice. Your situation is unique — use this as a starting point and adjust for your own life.",
    },
    {
      type: "heading",
      level: 2,
      text: "Your next 1–2 focus areas",
    },
    {
      type: "paragraph",
      text: "You don't need a 20-step plan. You need one or two things to work on this month. Ask yourself:",
    },
    {
      type: "bullets",
      items: [
        "Do I know where my money goes each month? If not → start with a simple budget or spending check-in.",
        "Do I have any savings for surprises (car repair, missed shift)? If not → start a small emergency fund.",
        "Do I carry credit card or other high-interest debt? If yes → make a plan to stop adding to it and chip away at it.",
        "Am I stable and ready to learn about investing? If yes → the next lessons (paycheck, benefits, investing basics) are for you.",
      ],
    },
    {
      type: "paragraph",
      text: "Pick the first question that feels like 'yes, that's me' or 'no, I need to fix that' — and make that your next focus. You can always come back and choose another once that one feels under control.",
    },
  ],

  bottom: {
    examples: [
      {
        type: "callout",
        variant: "tip",
        title: "Example: Alex, first job out of college",
        text: "Alex just started a full-time job. They have a little student loan debt and no emergency fund. Instead of trying to invest and pay off loans and save for a house all at once, they picked two things: set up a simple monthly budget and open a savings account with one month of rent. After three months, they added 'understand my 401(k) match' as their next step. One thing at a time made it feel doable.",
      },
    ],
    video: [],
    quiz: {
      title: "Quick check: What did you learn?",
      questions: [
        {
          prompt:
            "For most people, what order of steps tends to work best?",
          choices: [
            "Invest first, then pay debt, then build stability",
            "Stability first, then debt, then investing",
            "Debt only — ignore saving and investing until debt is zero",
          ],
          correctIndex: 1,
          explanation:
            "Getting stable (knowing where money goes, a small emergency fund) and then tackling high-interest debt usually sets you up to invest without stress. Investing before stability and debt can work for some, but for most people the order above reduces overwhelm.",
        },
        {
          prompt:
            "What's a good approach when money feels overwhelming?",
          choices: [
            "Read everything you can and try to do it all at once",
            "Pick one or two focus areas and ignore the rest for now",
            "Skip the basics and go straight to investing",
          ],
          correctIndex: 1,
          explanation:
            "Focusing on one or two steps at a time (e.g., a simple budget and a small emergency fund) is more effective than trying to fix everything at once. You can add more steps later.",
        },
        {
          prompt:
            "This lesson is intended to:",
          choices: [
            "Tell you exactly what to do with your money",
            "Help you understand a simple order-of-operations and choose your next focus",
            "Replace a financial advisor or licensed professional",
          ],
          correctIndex: 1,
          explanation:
            "This is educational content only. It helps you understand a common order of steps and identify your next 1–2 focus areas. It is not personalized advice.",
        },
      ],
    },
    sources: [
      {
        title: "Consumer Financial Protection Bureau – Building blocks",
        url: "https://www.consumerfinance.gov/consumer-tools/",
        domain: "consumerfinance.gov",
        tier: 1 as const,
      },
      {
        title: "MyMoney.gov – Five principles",
        url: "https://www.mymoney.gov/",
        domain: "mymoney.gov",
        tier: 1 as const,
      },
    ],
  },
} as const;

export default adultMoneyGamePlanSnapshot;
