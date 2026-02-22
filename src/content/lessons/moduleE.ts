/**
 * Module E — Investing Basics (Level 2–3)
 * 5 lessons: investing 101, index funds, risk/time, DCA, compound growth sim
 */
import type { BlockLesson } from "../lessonTypes";

export const moduleELessons: BlockLesson[] = [
  /* ── E1: Investing 101 ───────────────────────────────── */
  {
    id: "e1",
    slug: "investing-101",
    title: "Investing 101: What Stocks, Bonds & Funds Are",
    subtitle: "Plain English — no jargon",
    module: "module-e",
    level: "beginner",
    tags: ["investing-basics", "money-basics", "level-2", "visual-heavy"],
    recommendedFor: ["goal-investing", "confidence-mid", "confidence-low"],
    estimatedTime: 8,
    blocks: [
      {
        type: "hero",
        emoji: "📈",
        title: "Investing is simpler than you think",
        subtitle: "You don't need to pick stocks — and most experts don't either",
      },
      {
        type: "bullet-list",
        heading: "The 3 core investment types",
        items: [
          "Stocks — you own a tiny piece of a company. High potential returns, high volatility. Example: buying 1 share of Apple = owning ~0.000001% of Apple.",
          "Bonds — you lend money to a company or government. They pay you interest. Lower returns, more stable. Like a savings account with more risk and reward.",
          "Funds — a basket of many investments. Index funds hold hundreds of stocks. Diversification built in. This is what most financial professionals recommend for most people.",
        ],
        icon: "dot",
      },
      {
        type: "comparison",
        heading: "Individual stocks vs. index funds",
        left: {
          label: "Individual Stocks",
          emoji: "🎲",
          points: [
            "One company's fortunes",
            "Can lose 50–100% of value",
            "Requires research and monitoring",
            "Most individual stock pickers underperform",
          ],
          verdict: "High risk, high effort",
        },
        right: {
          label: "Index Funds (S&P 500, etc.)",
          emoji: "🧺",
          points: [
            "500+ companies in one fund",
            "One company failing barely moves it",
            "No research required",
            "Historically beats most active managers",
          ],
          verdict: "Lower risk, zero effort",
        },
        note: "This is not financial advice. Educational example only.",
      },
      {
        type: "callout",
        tone: "info",
        heading: "What is an index fund?",
        text: "An index fund tracks a market index (like the S&P 500 — the 500 largest US companies). It automatically holds all companies in the index proportionally. When the market goes up, you go up. Low fees (often 0.03–0.20% per year vs. 1–2% for active funds).",
      },
      {
        type: "chart",
        chartType: "bar",
        title: "S&P 500 historical annual returns — selected years",
        subtitle: "For illustration of volatility. Past performance does not guarantee future results.",
        data: [
          { label: "2019", value: 31, color: "#0E5C4C" },
          { label: "2020", value: 18, color: "#0E5C4C" },
          { label: "2021", value: 29, color: "#0E5C4C" },
          { label: "2022", value: -18, color: "#d9534f" },
          { label: "2023", value: 26, color: "#0E5C4C" },
          { label: "2024", value: 23, color: "#0E5C4C" },
        ],
        yAxisLabel: "Return (%)",
      },
      {
        type: "callout",
        tone: "warning",
        heading: "Investing involves real risk",
        text: "All investments can lose value. The stock market can drop significantly — sometimes 30–50% in a bad year. This is why time horizon matters: short-term money should not be in stocks.",
      },
      {
        type: "quiz",
        question: "Which investment type provides instant diversification across hundreds of companies?",
        options: [
          { id: "qe1a", text: "Individual stocks" },
          { id: "qe1b", text: "A single bond" },
          { id: "qe1c", text: "An index fund", correct: true },
          { id: "qe1d", text: "A savings account" },
        ],
        explanation: "An index fund holds all companies in an index, giving you instant diversification. One company going bankrupt barely moves your portfolio.",
      },
    ],
    sources: [
      { name: "SEC — Introduction to Investing", url: "https://www.investor.gov/introduction-investing", type: "government", lastReviewed: "2025-01" },
      { name: "SEC — What Are Mutual Funds?", url: "https://www.investor.gov/introduction-investing/investing-basics/investment-products/mutual-funds-and-exchange-traded-funds-etf", type: "government", lastReviewed: "2025-01" },
      { name: "Federal Reserve — Financial Literacy", url: "https://www.federalreserve.gov/consumers.htm", type: "government", lastReviewed: "2025-01" },
    ],
  },

  /* ── E2: Risk and Time Horizon ───────────────────────── */
  {
    id: "e2",
    slug: "risk-and-time-horizon",
    title: "Risk, Time, and Your Investing Timeline",
    subtitle: "When you'll need the money changes everything",
    module: "module-e",
    level: "beginner",
    tags: ["investing-basics", "level-2", "visual-heavy"],
    estimatedTime: 7,
    blocks: [
      {
        type: "hero",
        emoji: "⏱️",
        title: "Time is your most powerful investing tool",
        subtitle: "The longer your timeline, the more risk you can afford",
      },
      {
        type: "bullet-list",
        heading: "The golden rule of investing risk",
        items: [
          "Money you need in under 2 years → keep in cash/savings (no stocks)",
          "Money you need in 2–5 years → moderate allocation (some bonds, some stocks)",
          "Money you need in 5+ years → can afford more stocks and volatility",
          "Money you won't need for 20+ years (retirement) → can be mostly stocks",
        ],
        icon: "arrow",
      },
      {
        type: "comparison",
        heading: "Short-term vs. long-term money",
        left: {
          label: "Short-term (under 5 years)",
          emoji: "📅",
          points: [
            "Emergency fund",
            "House down payment",
            "Car purchase",
            "Keep in: savings, CDs, bonds",
          ],
          verdict: "Safety over returns",
        },
        right: {
          label: "Long-term (5+ years)",
          emoji: "🏔️",
          points: [
            "Retirement",
            "Kids' college (if 10+ years away)",
            "Long-term wealth building",
            "Can use: stock index funds",
          ],
          verdict: "Growth over safety",
        },
      },
      {
        type: "callout",
        tone: "warning",
        heading: "What happens if you invest short-term money in stocks",
        text: "Imagine you need $20,000 for a house down payment in 2 years. You invest it. Then the market drops 30% — your $20,000 is now $14,000. You either miss the house or sell at a loss. Time horizon is not just theory.",
      },
      {
        type: "callout",
        tone: "tip",
        text: "For retirement accounts (401k, IRA), young investors are often advised to hold mostly stock index funds and gradually shift toward bonds as retirement nears. This isn't advice — it's a general concept called 'glide path' investing.",
      },
    ],
    sources: [
      { name: "SEC — Asset Allocation", url: "https://www.investor.gov/introduction-investing/investing-basics/investment-products/asset-allocation", type: "government", lastReviewed: "2025-01" },
    ],
  },

  /* ── E3: Dollar-Cost Averaging ───────────────────────── */
  {
    id: "e3",
    slug: "dollar-cost-averaging",
    title: "Dollar-Cost Averaging: Invest Without Timing the Market",
    subtitle: "The strategy that removes guesswork from investing",
    module: "module-e",
    level: "beginner",
    tags: ["investing-basics", "systems-habits", "level-2"],
    estimatedTime: 6,
    blocks: [
      {
        type: "hero",
        emoji: "📅",
        title: "Stop waiting for the 'right time' to invest",
        subtitle: "There is no right time. Dollar-cost averaging is the answer.",
      },
      {
        type: "callout",
        tone: "info",
        heading: "What is dollar-cost averaging (DCA)?",
        text: "DCA means investing a fixed dollar amount at regular intervals (e.g., $200 every month), regardless of what the market is doing. When prices are high, you buy fewer shares. When prices are low, you buy more.",
      },
      {
        type: "example",
        heading: "DCA in action over 4 months",
        scenario: "Investing $200/month in a fund",
        breakdown: [
          "Month 1: Price $50/share → buy 4 shares",
          "Month 2: Price $40/share (market dip) → buy 5 shares",
          "Month 3: Price $45/share → buy 4.4 shares",
          "Month 4: Price $55/share → buy 3.6 shares",
          "Total invested: $800 | Total shares: 17 | Average price paid: $47.06",
        ],
        outcome: "If you'd invested all $800 in Month 1 at $50, you'd own 16 shares. With DCA, you own 17 shares — the dip in Month 2 actually helped you.",
      },
      {
        type: "comparison",
        heading: "Lump sum vs. DCA",
        left: {
          label: "Lump Sum",
          emoji: "💰",
          points: [
            "Invest everything at once",
            "Historically outperforms DCA ~2/3 of the time",
            "Harder emotionally during drops",
            "Requires a large sum available",
          ],
          verdict: "Better mathematically, harder psychologically",
        },
        right: {
          label: "Dollar-Cost Averaging",
          emoji: "📅",
          points: [
            "Invest fixed amount regularly",
            "Removes emotional timing pressure",
            "Works with any income level",
            "Easy to automate",
          ],
          verdict: "Slightly lower expected return, much lower stress",
        },
        note: "For most people, the best investment strategy is one they'll actually stick with.",
      },
      {
        type: "callout",
        tone: "tip",
        text: "If your 401(k) deducts from every paycheck, you're already doing DCA. It's the default strategy and it works.",
      },
    ],
    sources: [
      { name: "SEC — Invest Regularly", url: "https://www.investor.gov/additional-resources/general-resources/publications-research/info-sheets/invest-regularly", type: "government", lastReviewed: "2025-01" },
    ],
  },

  /* ── E4: Compound Growth Simulator ──────────────────── */
  {
    id: "e4",
    slug: "compound-growth",
    title: "Compound Growth: The 8th Wonder of the World",
    subtitle: "Why starting early is worth more than investing more",
    module: "module-e",
    level: "beginner",
    tags: ["investing-basics", "retirement", "level-2", "interactive", "visual-heavy"],
    recommendedFor: ["goal-investing", "confidence-mid"],
    estimatedTime: 8,
    blocks: [
      {
        type: "hero",
        emoji: "🌱",
        title: "Your money grows on its growth",
        subtitle: "Compound interest is simple — and it's why starting early matters so much",
      },
      {
        type: "callout",
        tone: "info",
        heading: "What is compound growth?",
        text: "When your investments earn returns, those returns also start earning returns. $1,000 at 10% → $1,100. Next year: $1,100 at 10% → $1,210. The growth accelerates because the base keeps growing.",
      },
      {
        type: "chart",
        chartType: "compound-growth",
        title: "$200/month invested from age 25 vs. 35",
        subtitle: "Hypothetical at 7% annual return. Not a guarantee of future performance.",
        data: [
          { label: "Start at 25", value: 525000, color: "#0E5C4C" },
          { label: "Start at 35", value: 243000, color: "#4A9B8A" },
          { label: "Contributions only (25)", value: 96000, color: "#C4EAE5" },
          { label: "Contributions only (35)", value: 72000, color: "#E3E2D2" },
        ],
      },
      {
        type: "example",
        heading: "Alex vs. Taylor: the 10-year difference",
        scenario: "Both invest $200/month at 7% annual return",
        breakdown: [
          "Alex starts at 25, retires at 65 (40 years)",
          "Taylor starts at 35, retires at 65 (30 years)",
          "Alex total contribution: $96,000",
          "Taylor total contribution: $72,000",
          "Alex at 65: ~$525,000",
          "Taylor at 65: ~$243,000",
        ],
        outcome: "Alex invested $24,000 more but ends up with $282,000 more. The extra 10 years of compounding creates enormous wealth — with no additional effort.",
      },
      {
        type: "interactive-slider",
        heading: "Compound interest calculator — your numbers",
        description: "See how your money grows over time",
        calculatorType: "compound-interest",
        sliders: [
          { id: "initial", label: "Starting amount", min: 0, max: 50000, step: 500, defaultValue: 1000, format: "currency" },
          { id: "monthly", label: "Monthly contribution", min: 0, max: 2000, step: 25, defaultValue: 200, format: "currency" },
          { id: "years", label: "Years invested", min: 1, max: 40, step: 1, defaultValue: 20, format: "years" },
          { id: "rate", label: "Annual return rate", min: 1, max: 12, step: 0.5, defaultValue: 7, format: "percent" },
        ],
      },
      {
        type: "callout",
        tone: "warning",
        text: "These projections are hypothetical educational examples. Past returns don't predict future performance. All investing involves risk, including loss of principal.",
      },
    ],
    sources: [
      { name: "SEC — Compound Interest Calculator", url: "https://www.investor.gov/financial-tools-calculators/calculators/compound-interest-calculator", type: "government", lastReviewed: "2025-01" },
      { name: "Federal Reserve — Financial Education", url: "https://www.federalreserve.gov/consumers.htm", type: "government", lastReviewed: "2025-01" },
    ],
  },

  /* ── E5: Your First Investing Plan ──────────────────── */
  {
    id: "e5",
    slug: "your-first-investing-plan",
    title: "Your First Investing Plan (Simple)",
    subtitle: "A straightforward framework to get started — without overthinking it",
    module: "module-e",
    level: "intermediate",
    tags: ["investing-basics", "retirement", "level-2", "level-3"],
    recommendedFor: ["goal-investing", "has-401k", "confidence-mid", "confidence-high"],
    estimatedTime: 9,
    blocks: [
      {
        type: "hero",
        emoji: "🗺️",
        title: "Simple beats perfect",
        subtitle: "A basic investing plan you actually follow beats a complex one you abandon",
      },
      {
        type: "bullet-list",
        heading: "The investing priority order",
        items: [
          "1. 401(k) up to employer match — guaranteed return on every dollar",
          "2. High-interest debt — guaranteed savings by eliminating interest",
          "3. Emergency fund — protection before aggressive investing",
          "4. Roth IRA (or Traditional IRA) — tax-advantaged growth",
          "5. Max out 401(k) — up to IRS annual limit",
          "6. Taxable brokerage account — after tax-advantaged options are maxed",
        ],
        icon: "arrow",
      },
      {
        type: "comparison",
        heading: "Roth IRA vs. Traditional IRA",
        left: {
          label: "Roth IRA",
          emoji: "☀️",
          points: [
            "Pay taxes now, withdraw tax-free",
            "No required minimum distributions",
            "Great if you expect higher taxes in retirement",
            "Income limits apply",
          ],
          verdict: "Often better for younger/lower-income people",
        },
        right: {
          label: "Traditional IRA",
          emoji: "🌙",
          points: [
            "Tax deduction now, pay taxes later",
            "Required distributions at 73",
            "Great if you expect lower taxes in retirement",
            "Anyone with earned income can contribute",
          ],
          verdict: "Often better for higher-income earners now",
        },
        note: "This is not tax advice. Consult a tax professional for your specific situation.",
      },
      {
        type: "callout",
        tone: "info",
        heading: "2025 IRA contribution limit",
        text: "You can contribute up to $7,000/year to an IRA ($8,000 if 50+). For a 401(k), the employee contribution limit is $23,500 ($31,000 if 50+). Source: IRS.gov",
      },
      {
        type: "callout",
        tone: "tip",
        heading: "The simplest possible investing plan",
        text: "1) Open a Roth IRA. 2) Set up automatic monthly contributions. 3) Invest in a low-cost total market or S&P 500 index fund. 4) Don't check it every day. That's it. Most people don't need more complexity than this.",
      },
      {
        type: "callout",
        tone: "warning",
        text: "This is educational content only. Nothing here is financial advice. Consult a licensed financial professional before making investment decisions.",
      },
    ],
    sources: [
      { name: "IRS — IRA Contribution Limits", url: "https://www.irs.gov/retirement-plans/ira-deduction-limits", type: "government", lastReviewed: "2025-01" },
      { name: "IRS — Roth IRAs", url: "https://www.irs.gov/retirement-plans/roth-iras", type: "government", lastReviewed: "2025-01" },
      { name: "Dept. of Labor — 401(k) Plans", url: "https://www.dol.gov/agencies/ebsa/about-ebsa/our-activities/resource-center/publications/what-you-should-know-about-your-retirement-plan", type: "government", lastReviewed: "2025-01" },
    ],
  },
];
