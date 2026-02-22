/**
 * Module A — Money Basics (Level 1 Foundations)
 * 4 lessons: money map, checking vs savings, bills & fees, your money system
 */
import type { BlockLesson } from "../lessonTypes";

export const moduleALessons: BlockLesson[] = [
  /* ── A1: Money Map ────────────────────────────────────── */
  {
    id: "a1",
    slug: "money-map",
    title: "Money Map: Where Your Money Goes",
    subtitle: "See the full picture before you plan",
    module: "module-a",
    level: "beginner",
    tags: ["money-basics", "cashflow", "level-1", "visual-heavy", "short-lesson"],
    recommendedFor: ["confidence-low", "no-savings"],
    estimatedTime: 6,
    blocks: [
      {
        type: "hero",
        emoji: "🗺️",
        title: "Your Money Map",
        subtitle: "Before you budget, you need to know where money actually goes",
      },
      {
        type: "bullet-list",
        heading: "Every dollar you earn goes one of 3 places",
        items: [
          "Fixed bills — rent, subscriptions, loan minimums (same every month)",
          "Variable spending — groceries, gas, dining, shopping (changes month to month)",
          "Saved or invested — emergency fund, retirement, goals",
        ],
        icon: "arrow",
      },
      {
        type: "chart",
        chartType: "pie",
        title: "Where the average American's paycheck goes",
        subtitle: "Hypothetical example — your numbers will differ",
        data: [
          { label: "Housing", value: 33, color: "#0E5C4C" },
          { label: "Food", value: 13, color: "#4A9B8A" },
          { label: "Transport", value: 16, color: "#8FD4C6" },
          { label: "Insurance", value: 12, color: "#C4EAE5" },
          { label: "Savings", value: 8, color: "#FFD6B0" },
          { label: "Other", value: 18, color: "#E3E2D2" },
        ],
      },
      {
        type: "callout",
        tone: "tip",
        heading: "Quick exercise",
        text: "Open your last 2 bank statements. Spend 5 minutes categorizing each transaction into: Bills, Spending, or Savings. You'll immediately see where the leaks are.",
      },
      {
        type: "example",
        heading: "Real example: $3,500/month take-home",
        scenario: "Jordan earns $42K/year ($3,500/month after taxes). Here's the current breakdown:",
        breakdown: [
          "Rent + utilities: $1,400 (40%)",
          "Groceries + dining: $600 (17%)",
          "Car payment + gas: $450 (13%)",
          "Subscriptions + misc: $300 (9%)",
          "Savings: $200 (6%)",
          "Leftover (untracked): $550 (15%)",
        ],
        outcome: "The 15% 'untracked' is the money Jordan can redirect to goals — that's $550/month. Most people have more flexibility than they think.",
      },
      {
        type: "callout",
        tone: "info",
        text: "Most people underestimate their spending by 15–25%. Tracking for just one month changes your perspective permanently.",
      },
      {
        type: "quiz",
        question: "What's the first step to understanding your money?",
        options: [
          { id: "q1a", text: "Open an investment account" },
          { id: "q1b", text: "See where your money currently goes", correct: true },
          { id: "q1c", text: "Cut all discretionary spending" },
          { id: "q1d", text: "Get a second job" },
        ],
        explanation: "You can't optimize what you don't measure. Seeing your current spending is the essential first step — no judgment required.",
      },
    ],
    sources: [
      { name: "Bureau of Labor Statistics — Consumer Expenditure Survey", url: "https://www.bls.gov/cex/", type: "government", lastReviewed: "2025-01" },
      { name: "Federal Reserve — Report on Economic Well-Being of US Households", url: "https://www.federalreserve.gov/publications/report-economic-well-being-us-households.htm", type: "government", lastReviewed: "2025-01" },
    ],
  },

  /* ── A2: Checking vs Savings ──────────────────────────── */
  {
    id: "a2",
    slug: "checking-vs-savings",
    title: "Checking vs. Savings (and What APY Means)",
    subtitle: "Know which account to use for what",
    module: "module-a",
    level: "beginner",
    tags: ["money-basics", "level-1", "visual-heavy"],
    recommendedFor: ["confidence-low", "no-savings"],
    estimatedTime: 7,
    blocks: [
      {
        type: "hero",
        emoji: "🏦",
        title: "Two accounts, two jobs",
        subtitle: "Most people use them wrong — here's the difference",
      },
      {
        type: "comparison",
        heading: "Checking vs. Savings at a glance",
        left: {
          label: "Checking Account",
          emoji: "💳",
          points: [
            "Daily spending hub",
            "Unlimited transactions",
            "Linked to debit card",
            "Little or no interest",
            "Pay bills from here",
          ],
          verdict: "Best for: everyday money",
        },
        right: {
          label: "Savings Account",
          emoji: "🏦",
          points: [
            "Money you don't touch",
            "Earns interest (APY)",
            "Limited transfers/month",
            "FDIC insured up to $250K",
            "Emergency fund goes here",
          ],
          verdict: "Best for: goals and emergencies",
        },
      },
      {
        type: "callout",
        tone: "info",
        heading: "What is APY?",
        text: "APY = Annual Percentage Yield. It's how much interest your money earns in a year, including compounding. A high-yield savings account today might offer 4–5% APY vs. 0.01% at a traditional bank — a massive difference over time.",
      },
      {
        type: "chart",
        chartType: "bar",
        title: "$10,000 after 1 year: traditional bank vs. high-yield savings",
        subtitle: "Hypothetical example at current rates",
        data: [
          { label: "Traditional (0.01% APY)", value: 10001, color: "#E3E2D2" },
          { label: "High-Yield (4.5% APY)", value: 10450, color: "#0E5C4C" },
        ],
        yAxisLabel: "Balance ($)",
      },
      {
        type: "bullet-list",
        heading: "FDIC insurance — your money is protected",
        items: [
          "FDIC insures up to $250,000 per depositor, per bank",
          "If the bank fails, the FDIC replaces your money",
          "This applies to checking AND savings at FDIC-insured banks",
          "Credit unions have equivalent protection through NCUA",
        ],
        icon: "check",
      },
      {
        type: "callout",
        tone: "tip",
        text: "Open a free high-yield savings account separate from your checking. The small 'friction' of a different bank makes you less likely to dip into your savings impulsively.",
      },
      {
        type: "quiz",
        question: "Where should your emergency fund live?",
        options: [
          { id: "q2a", text: "In your checking account" },
          { id: "q2b", text: "In cash at home" },
          { id: "q2c", text: "In a high-yield savings account", correct: true },
          { id: "q2d", text: "Invested in stocks" },
        ],
        explanation: "A high-yield savings account keeps your emergency fund growing safely while staying accessible. Checking gets spent; stocks can drop when you need the money most.",
      },
    ],
    sources: [
      { name: "FDIC — Deposit Insurance FAQs", url: "https://www.fdic.gov/resources/deposit-insurance/faq/index.html", type: "regulator", lastReviewed: "2025-01" },
      { name: "NCUA — Share Insurance Fund Overview", url: "https://www.ncua.gov/support-services/share-insurance-fund", type: "regulator", lastReviewed: "2025-01" },
      { name: "CFPB — Savings Accounts", url: "https://www.consumerfinance.gov/consumer-tools/bank-accounts/answers/savings-accounts/", type: "regulator", lastReviewed: "2025-01" },
    ],
  },

  /* ── A3: Bills & Due Dates ────────────────────────────── */
  {
    id: "a3",
    slug: "bills-and-due-dates",
    title: "Bills, Due Dates & Avoiding Late Fees",
    subtitle: "A simple system to never miss a payment",
    module: "module-a",
    level: "beginner",
    tags: ["money-basics", "budgeting", "cashflow", "level-1", "short-lesson"],
    recommendedFor: ["confidence-low"],
    estimatedTime: 5,
    blocks: [
      {
        type: "hero",
        emoji: "📅",
        title: "Never miss a bill again",
        subtitle: "Late fees are silent money drains — here's how to stop them",
      },
      {
        type: "callout",
        tone: "warning",
        heading: "Late fees add up fast",
        text: "The average American pays $180–$250/year in late fees and penalty APR charges — money that could go toward savings or debt payoff. This is entirely preventable.",
      },
      {
        type: "bullet-list",
        heading: "3 types of bills to track",
        items: [
          "Fixed recurring — same amount every month (rent, car payment, subscriptions)",
          "Variable recurring — changes monthly (utilities, credit card, groceries)",
          "Irregular — happen a few times/year (car insurance, annual memberships, tax bills)",
        ],
        icon: "dot",
      },
      {
        type: "example",
        heading: "The 'Bill Calendar' method",
        scenario: "Write down every bill with its due date and amount. Group them by paycheck.",
        breakdown: [
          "1st of month: Rent $1,200, streaming $15",
          "5th of month: Car insurance $120",
          "15th of month: Phone $75, gym $40",
          "22nd of month: Credit card minimum",
          "28th of month: Internet $65",
        ],
        outcome: "When you see the full picture, you can time your bill payments to land right after payday — eliminating the stress of 'do I have enough?'",
      },
      {
        type: "callout",
        tone: "tip",
        heading: "Autopay for the win",
        text: "Set autopay for fixed bills (rent excluded — pay manually to stay aware). For credit cards, autopay the minimum at minimum — then manually pay more. This protects your credit and eliminates late fees.",
      },
      {
        type: "bullet-list",
        heading: "Quick wins to do today",
        items: [
          "Write down every bill and its due date",
          "Set calendar reminders 3 days before each due date",
          "Enable autopay for utilities, phone, internet",
          "Request due date changes to align with paydays (most companies allow this)",
        ],
        icon: "check",
      },
    ],
    sources: [
      { name: "CFPB — How to Avoid Common Bank Fees", url: "https://www.consumerfinance.gov/about-us/blog/how-to-avoid-common-bank-fees/", type: "regulator", lastReviewed: "2025-01" },
    ],
  },

  /* ── A4: Your Money System ────────────────────────────── */
  {
    id: "a4",
    slug: "your-money-system",
    title: "Your First Money System",
    subtitle: "Simple accounts + automation that runs itself",
    module: "module-a",
    level: "beginner",
    tags: ["money-basics", "systems-habits", "cashflow", "level-1", "visual-heavy"],
    recommendedFor: ["confidence-low", "no-savings"],
    estimatedTime: 8,
    blocks: [
      {
        type: "hero",
        emoji: "⚙️",
        title: "Build a system, not willpower",
        subtitle: "The best money habits are automated — no discipline required",
      },
      {
        type: "bullet-list",
        heading: "The 3-account starter setup",
        items: [
          "Account 1: Bills checking — where your paycheck lands, autopay bills from here",
          "Account 2: Spending checking — transfer your weekly 'fun money' here",
          "Account 3: Savings account — emergency fund + goals live here",
        ],
        icon: "arrow",
      },
      {
        type: "comparison",
        heading: "Manual tracking vs. automated system",
        left: {
          label: "Manual only",
          emoji: "😓",
          points: [
            "Relies on remembering",
            "One missed payment = fees",
            "Willpower required",
            "Stressful every payday",
          ],
          verdict: "Exhausting and error-prone",
        },
        right: {
          label: "Automated system",
          emoji: "✨",
          points: [
            "Runs on schedule",
            "Bills never missed",
            "Savings happen automatically",
            "You only manage the difference",
          ],
          verdict: "Effortless and consistent",
        },
      },
      {
        type: "example",
        heading: "Payday automation flow",
        scenario: "Paycheck lands on the 1st and 15th of each month in your Bills Checking account:",
        breakdown: [
          "Automatic transfer → $300 to Savings (on payday, before you can spend it)",
          "Autopay runs → all fixed bills paid from Bills Checking",
          "Manual transfer → $200 'fun money' moved to Spending Checking",
          "Remainder → stays in Bills Checking as a buffer",
        ],
        outcome: "You've automated saving and bill-paying. What's left in Spending Checking is yours to use freely — no guilt, no math.",
      },
      {
        type: "callout",
        tone: "tip",
        heading: "Pay yourself first",
        text: "Schedule your savings transfer to happen the same day your paycheck lands — before you have a chance to spend it. Even $50/month builds the habit.",
      },
      {
        type: "callout",
        tone: "info",
        text: "This is often called the 'set-and-forget' or 'pay yourself first' method. It's backed by behavioral economics research showing that automated saving dramatically outperforms intention-based saving.",
      },
      {
        type: "quiz",
        question: "When is the best time to transfer money to savings?",
        options: [
          { id: "q4a", text: "At the end of the month with whatever is left" },
          { id: "q4b", text: "On payday, before spending anything else", correct: true },
          { id: "q4c", text: "When you feel disciplined enough" },
          { id: "q4d", text: "After all bills are paid" },
        ],
        explanation: "'Pay yourself first' means savings comes out immediately on payday. Waiting until the end of the month means you'll often find nothing left to save.",
      },
    ],
    sources: [
      { name: "CFPB — Making a Budget", url: "https://www.consumerfinance.gov/consumer-tools/managing-your-finances/", type: "regulator", lastReviewed: "2025-01" },
      { name: "Federal Reserve — Behavioral Economics and Saving", url: "https://www.federalreserve.gov/pubs/feds/2006/200611/200611pap.pdf", type: "government", lastReviewed: "2025-01" },
    ],
  },
];
