/**
 * Snapshot: "Investing Basics (Without Stock-Picking)"
 * Lesson ID: investing-basics-no-stock-picking
 * Track: First Job Out of College
 * Domain: investingBasics
 *
 * Education-only; 6–9 min read; beginner-friendly.
 * Block types: heading, paragraph, bullets, callout, chips, divider,
 * comparisonCards, miniChart, stepList, scenarioCard, decisionTree, recapCard.
 */

export const investingBasicsNoStockPickingSnapshot = {
  hero: {
    headline: "Investing Basics (Without Stock-Picking)",
    subhead:
      "Investing can feel intimidating. This lesson teaches the big picture — what investing is, how it differs from saving, and why you don't need to pick individual stocks.",
    takeaways: [
      "Investing is putting money into assets that can grow over time; saving is keeping money in cash — different jobs for different goals.",
      "Over long periods, many people accept some fluctuation in exchange for the chance of growth; time and consistency matter more than timing.",
      "Beginners don't need to pick stocks — broad funds (like ETFs) are a simple, calm way to start.",
    ],
  },

  sections: [
    { type: "heading", level: 2, text: "Investing vs Saving" },
    {
      type: "paragraph",
      text:
        "Saving and investing do different jobs. Saving is for money you need soon or want to keep stable. Investing is for money you can leave alone for years, with the goal of growth. Both belong in a solid plan.",
    },
    {
      type: "comparisonCards",
      cards: [
        {
          title: "Saving",
          bullets: [
            "Low risk, stable value",
            "Easy to access when you need it",
            "Best for emergencies and short-term goals",
          ],
          badge: "Short term",
        },
        {
          title: "Investing",
          bullets: [
            "Value can go up and down over time",
            "Long-term growth potential",
            "Best for goals years or decades away",
          ],
          badge: "Long term",
        },
      ],
    },
    { type: "divider" },
    { type: "heading", level: 2, text: "Why investing grows money" },
    {
      type: "paragraph",
      text:
        "When you invest in a broad mix of companies (through a fund), you're betting on the economy and businesses growing over time. History doesn't guarantee the future — but the idea is that patient, diversified investing has given many people a chance to grow their money more than cash alone.",
    },
    {
      type: "miniChart",
      title: "Example: $500/month invested for 10 years at 7%",
      description:
        "Hypothetical growth curve: consistent monthly contributions can add up over a decade. This is for illustration only — past performance does not guarantee future results. Real returns vary.",
    },
    { type: "divider" },
    { type: "heading", level: 2, text: "Should you invest yet?" },
    {
      type: "paragraph",
      text:
        "Investing makes the most sense when your foundation is solid. Use the checks below — not as a quiz, but as a simple order of operations.",
    },
    {
      type: "decisionTree",
      steps: [
        { label: "Emergency fund built?" },
        { label: "High-interest debt under control?" },
      ],
      outcomeNo: "Stabilize first. Build your emergency fund and tackle high-interest debt before adding market risk.",
      outcomeYes: "Investing can make sense. Start with a simple, diversified approach and avoid the noise.",
    },
    { type: "divider" },
    { type: "heading", level: 2, text: "A simple starting strategy" },
    {
      type: "paragraph",
      text:
        "You don't need a complicated plan. These steps are a common, calm way to begin — no stock-picking required.",
    },
    {
      type: "stepList",
      steps: [
        "Open a brokerage account (or use one through your employer's retirement plan).",
        "Choose a broad ETF or index fund — one that holds many companies, not a single stock.",
        "Automate a monthly deposit so you invest consistently.",
        "Ignore daily noise. Long-term means years, not days.",
      ],
    },
    { type: "divider" },
    { type: "heading", level: 2, text: "Common mistakes" },
    {
      type: "callout",
      variant: "warning",
      title: "Heads up",
      text:
        "Chasing hot stocks, investing money you might need soon, or panicking when the market drops can hurt your results. The goal is steady, boring progress — not getting rich quick. This lesson is education only; it's not personalized advice.",
    },
    { type: "divider" },
    { type: "heading", level: 2, text: "Example scenario" },
    {
      type: "scenarioCard",
      title: "Long-term compounding (hypothetical)",
      scenario: "$60k salary, 10% invested each year in a broad fund.",
      breakdown: [
        "Assumes a consistent contribution and a hypothetical average return (e.g. ~6–7% per year — not guaranteed).",
        "Over 20–30 years, compounding can grow the balance significantly.",
        "Real results depend on market returns, fees, and your own timeline.",
      ],
      outcome: "Time in the market and consistency usually matter more than timing. This is for illustration only — not a prediction or recommendation.",
    },
    { type: "divider" },
    { type: "heading", level: 2, text: "Recap" },
    {
      type: "recapCard",
      title: "Key takeaways",
      items: [
        "Saving = stable, accessible. Investing = growth potential over the long term.",
        "Check: emergency fund and high-interest debt first, then consider investing.",
        "Start simple: broad ETF or index fund, automate, ignore daily noise.",
        "No stock-picking required. Education only — not personal financial advice.",
      ],
    },
  ],

  bottom: {
    examples: [],
    video: [],
    quiz: {
      title: "Quick check: Investing basics",
      questions: [
        {
          prompt: "What's the main difference between saving and investing?",
          choices: [
            "Saving is only for rich people",
            "Saving is stable and accessible; investing can grow (or fluctuate) over time and is usually for longer-term goals",
            "Investing is risk-free",
          ],
          correctIndex: 1,
          explanation:
            "Saving keeps money in cash-like places; investing puts money into assets that can grow or shrink, usually for goals years away.",
        },
        {
          prompt: "Before focusing on investing, what should you prioritize?",
          choices: [
            "Picking the best individual stocks",
            "Building an emergency fund and getting high-interest debt under control",
            "Investing 100% of your income",
          ],
          correctIndex: 1,
          explanation:
            "A solid foundation — emergency fund and manageable debt — makes it safer to invest for the long term.",
        },
        {
          prompt: "Why might a beginner use a broad fund (like an ETF) instead of picking individual stocks?",
          choices: [
            "Individual stocks are illegal for beginners",
            "A broad fund gives diversification without having to research and pick each company — simpler and calmer to start",
            "Funds always guarantee higher returns",
          ],
          correctIndex: 1,
          explanation:
            "Funds hold many investments in one product, so you get diversification and a simple path without stock-picking.",
        },
      ],
    },
    sources: [
      {
        title: "Consumer Financial Protection Bureau — Saving and investing",
        url: "https://www.consumerfinance.gov/consumer-tools/save-invest/",
        domain: "consumerfinance.gov",
        tier: 1,
      },
      {
        title: "SEC Investor.gov — Introduction to investing",
        url: "https://www.investor.gov/introduction-investing",
        domain: "investor.gov",
        tier: 1,
      },
      {
        title: "MyMoney.gov — Get started with saving and investing",
        url: "https://www.mymoney.gov/",
        domain: "mymoney.gov",
        tier: 1,
      },
    ],
  },
} as const;

export default investingBasicsNoStockPickingSnapshot;
