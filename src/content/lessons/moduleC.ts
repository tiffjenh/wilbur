/**
 * Module C — Emergency Fund & Saving (Level 1–2)
 * 3 lessons: how much, where to store, saving faster
 */
import type { BlockLesson } from "../lessonTypes";

export const moduleCLessons: BlockLesson[] = [
  /* ── C1: Emergency Fund Basics ──────────────────────── */
  {
    id: "c1",
    slug: "emergency-fund-how-much",
    title: "Emergency Fund: How Much Do You Need?",
    subtitle: "The single most important financial safety net",
    module: "module-c",
    level: "beginner",
    tags: ["emergency-fund", "money-basics", "level-1", "visual-heavy"],
    recommendedFor: ["no-savings", "low-savings", "goal-emergency", "confidence-low"],
    estimatedTime: 7,
    blocks: [
      {
        type: "hero",
        emoji: "🛡️",
        title: "Your financial safety net",
        subtitle: "An emergency fund is not optional — it's the foundation of everything else",
      },
      {
        type: "callout",
        tone: "warning",
        heading: "Without an emergency fund, every setback becomes a debt spiral",
        text: "Car breaks down → credit card. Medical bill → credit card. Job loss → credit card. Each emergency without savings adds to your debt and stress. The emergency fund breaks this cycle.",
      },
      {
        type: "comparison",
        heading: "What counts as an emergency?",
        left: {
          label: "✅ Actual Emergencies",
          emoji: "🚨",
          points: [
            "Unexpected job loss",
            "Medical or dental bills",
            "Car breakdown or repair",
            "Essential home repair",
            "Emergency travel (family)",
          ],
          verdict: "Use the fund for these",
        },
        right: {
          label: "❌ Not Emergencies",
          emoji: "🛍️",
          points: [
            "Sales or deals",
            "Vacation or travel",
            "New phone or laptop",
            "Concert or event tickets",
            "Planned car purchase",
          ],
          verdict: "These need a sinking fund",
        },
      },
      {
        type: "chart",
        chartType: "bar",
        title: "Emergency fund targets by situation",
        subtitle: "Based on monthly essential expenses",
        data: [
          { label: "Starter (any situation)", value: 1000, color: "#C4EAE5" },
          { label: "Employed, stable (3 months)", value: 9000, color: "#4A9B8A" },
          { label: "Employed, variable (4-6 months)", value: 15000, color: "#0E5C4C" },
          { label: "Freelance/1099 (6-12 months)", value: 24000, color: "#0a4739" },
        ],
        yAxisLabel: "Target savings ($)",
        xAxisLabel: "Assuming $3,000/month in essential expenses",
      },
      {
        type: "bullet-list",
        heading: "The 3-phase emergency fund build",
        items: [
          "Phase 1 — Starter: Save $1,000 fast. This covers most small emergencies.",
          "Phase 2 — Core: Build to 3 months of essential expenses. Takes 6–18 months.",
          "Phase 3 — Full: Reach 6+ months. Unlocks ability to take more career/life risks.",
        ],
        icon: "arrow",
      },
      {
        type: "callout",
        tone: "tip",
        text: "If you have high-interest debt (credit cards, personal loans), target $1,000 first, then aggressively pay debt, THEN return to building the full emergency fund.",
      },
      {
        type: "quiz",
        question: "You have $2,500 in savings and monthly essential expenses of $2,800. What phase are you in?",
        options: [
          { id: "qc1a", text: "No emergency fund" },
          { id: "qc1b", text: "Phase 1 complete — working toward Phase 2", correct: true },
          { id: "qc1c", text: "Fully funded emergency fund" },
          { id: "qc1d", text: "Overfunded" },
        ],
        explanation: "You have your starter $1,000+ covered, but you're below the 3-month target ($8,400). Phase 1 complete — keep building toward Phase 2.",
      },
    ],
    sources: [
      { name: "CFPB — Building an Emergency Fund", url: "https://www.consumerfinance.gov/an-essential-guide-to-building-an-emergency-fund/", type: "regulator", lastReviewed: "2025-01" },
      { name: "Federal Reserve — Report on Financial Well-Being", url: "https://www.federalreserve.gov/publications/report-economic-well-being-us-households.htm", type: "government", lastReviewed: "2025-01" },
    ],
  },

  /* ── C2: Where to Keep Savings ───────────────────────── */
  {
    id: "c2",
    slug: "where-to-keep-savings",
    title: "Where to Keep Your Savings",
    subtitle: "Not all savings accounts are equal — here's what to look for",
    module: "module-c",
    level: "beginner",
    tags: ["emergency-fund", "money-basics", "level-1", "level-2"],
    estimatedTime: 6,
    blocks: [
      {
        type: "hero",
        emoji: "🏦",
        title: "Where you park it matters",
        subtitle: "The right savings account earns you money — not just stores it",
      },
      {
        type: "bullet-list",
        heading: "What to look for in a savings account",
        items: [
          "High APY — look for 4–5%+ in today's market (vs. 0.01–0.5% at big banks)",
          "FDIC/NCUA insured — your money is protected up to $250K",
          "No monthly fees — avoid accounts that charge you to hold your money",
          "Easy transfers — should link to your checking in 1–3 business days",
          "No minimum balance requirements (or easy to meet)",
        ],
        icon: "check",
      },
      {
        type: "comparison",
        heading: "Where to put your emergency fund",
        left: {
          label: "High-Yield Savings Account",
          emoji: "📈",
          points: [
            "4–5% APY (current market)",
            "FDIC insured",
            "Easy to access in 1–3 days",
            "Best for emergency fund",
          ],
          verdict: "Recommended for emergency fund",
        },
        right: {
          label: "Money Market Account",
          emoji: "🏦",
          points: [
            "Similar APY to HYSA",
            "May include check-writing",
            "FDIC/NCUA insured",
            "Slightly less flexible",
          ],
          verdict: "Also works well",
        },
        note: "Stocks, crypto, or CDs are NOT good emergency fund options — too risky or too hard to access quickly.",
      },
      {
        type: "callout",
        tone: "warning",
        heading: "Don't keep your emergency fund in stocks",
        text: "The stock market can drop 30–40% right when you need the money most (job loss often happens during recessions). Emergency funds need to be stable and instantly accessible.",
      },
      {
        type: "callout",
        tone: "source",
        text: "The FDIC insures deposits up to $250,000 per depositor, per institution, per account ownership category. Source: FDIC.gov",
      },
    ],
    sources: [
      { name: "FDIC — Deposit Insurance", url: "https://www.fdic.gov/resources/deposit-insurance/", type: "regulator", lastReviewed: "2025-01" },
      { name: "NCUA — Share Insurance Coverage", url: "https://www.ncua.gov/consumers/share-insurance-coverage", type: "regulator", lastReviewed: "2025-01" },
    ],
  },

  /* ── C3: Saving Faster ───────────────────────────────── */
  {
    id: "c3",
    slug: "saving-faster",
    title: "Saving Faster Without Hating Life",
    subtitle: "Practical ways to grow your savings without feeling deprived",
    module: "module-c",
    level: "beginner",
    tags: ["emergency-fund", "budgeting", "systems-habits", "level-1", "level-2", "short-lesson"],
    estimatedTime: 6,
    blocks: [
      {
        type: "hero",
        emoji: "🚀",
        title: "Save more, restrict less",
        subtitle: "The secret is finding 'painless cuts,' not discipline",
      },
      {
        type: "callout",
        tone: "info",
        heading: "The 'latte factor' is overblown",
        text: "Skipping $5 coffees is not the path to wealth. Focus on the three biggest expense categories first: housing, transportation, and food. A $200 rent reduction is worth 40 lattes.",
      },
      {
        type: "bullet-list",
        heading: "High-leverage ways to free up savings",
        items: [
          "Audit subscriptions — cancel anything unused in the last 30 days",
          "Negotiate bills — internet, phone, insurance all have room to negotiate",
          "Automate savings — you can't spend what you don't see",
          "Meal prep 2–3x/week — can save $150–400/month vs. daily dining out",
          "Use cash-back apps — for spending you'd do anyway (groceries, gas)",
          "One 'no spend weekend' per month — often saves $100–200",
        ],
        icon: "check",
      },
      {
        type: "example",
        heading: "The subscription audit",
        scenario: "Take 10 minutes and go through the last 2 months of bank/credit card statements",
        breakdown: [
          "Find every recurring charge (look for amounts like $9.99, $12.99, $4.99)",
          "Ask: 'Did I use this in the last 30 days?'",
          "Cancel anything with 'no'",
          "Common finds: duplicate streaming, unused apps, forgotten trials",
        ],
        outcome: "Most people find $40–150/month in subscriptions they don't use. That's $480–$1,800/year — your emergency fund starter.",
      },
      {
        type: "callout",
        tone: "tip",
        text: "After any pay raise, direct the entire increase to savings for at least 3 months — before lifestyle inflation kicks in. This single habit is worth more than all the subscription audits combined.",
      },
    ],
    sources: [
      { name: "CFPB — Budgeting and Saving", url: "https://www.consumerfinance.gov/consumer-tools/managing-your-finances/", type: "regulator", lastReviewed: "2025-01" },
    ],
  },
];
