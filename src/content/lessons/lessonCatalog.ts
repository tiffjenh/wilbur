/**
 * Lesson catalog — all lessons as the scoring-engine Lesson type.
 * Blocks live in the block lesson files; this is metadata only.
 *
 * Tags must be valid LessonTag values (see types.ts).
 * Sources must cite gov/regulator first per content policy.
 */
import type { Lesson } from "@/lib/recommendation/types";

export const LESSON_CATALOG: Lesson[] = [
  /* ══════════════════════════════════════════════════════
     Module A — Money Basics (Level 1)
  ══════════════════════════════════════════════════════ */
  {
    id: "money-map",
    title: "Money Map: Where Your Money Goes",
    description: "See your full spending picture before you plan anything.",
    level: "level-1",
    tags: ["money-basics", "cashflow", "visual-heavy", "level-1"],
    estimatedTimeMin: 6,
    sources: [
      { name: "Bureau of Labor Statistics — Consumer Expenditure Survey", url: "https://www.bls.gov/cex/", type: "government", lastReviewed: "2026-01-01" },
      { name: "Federal Reserve — Economic Well-Being Report", url: "https://www.federalreserve.gov/publications/report-economic-well-being-us-households.htm", type: "government", lastReviewed: "2026-01-01" },
    ],
  },
  {
    id: "checking-vs-savings",
    title: "Checking vs. Savings (and What APY Means)",
    description: "Know which account does which job — and how to earn more on idle cash.",
    level: "level-1",
    tags: ["money-basics", "visual-heavy", "level-1"],
    estimatedTimeMin: 7,
    sources: [
      { name: "FDIC — Deposit Insurance FAQs", url: "https://www.fdic.gov/resources/deposit-insurance/faq/index.html", type: "regulator", lastReviewed: "2026-01-01" },
      { name: "NCUA — Share Insurance Coverage", url: "https://www.ncua.gov/consumers/share-insurance-coverage", type: "regulator", lastReviewed: "2026-01-01" },
      { name: "CFPB — Savings Accounts", url: "https://www.consumerfinance.gov/consumer-tools/bank-accounts/", type: "regulator", lastReviewed: "2026-01-01" },
    ],
  },
  {
    id: "bills-and-due-dates",
    title: "Bills, Due Dates & Avoiding Late Fees",
    description: "A dead-simple system to never miss a payment again.",
    level: "level-1",
    tags: ["money-basics", "budgeting", "cashflow", "level-1"],
    estimatedTimeMin: 5,
    sources: [
      { name: "CFPB — How to Avoid Common Bank Fees", url: "https://www.consumerfinance.gov/about-us/blog/how-to-avoid-common-bank-fees/", type: "regulator", lastReviewed: "2026-01-01" },
    ],
  },
  {
    id: "your-money-system",
    title: "Your First Money System",
    description: "Automate savings and bills so your money moves itself.",
    level: "level-1",
    tags: ["money-basics", "systems-habits", "cashflow", "visual-heavy", "level-1"],
    estimatedTimeMin: 8,
    sources: [
      { name: "CFPB — Managing Your Finances", url: "https://www.consumerfinance.gov/consumer-tools/managing-your-finances/", type: "regulator", lastReviewed: "2026-01-01" },
    ],
  },

  /* ══════════════════════════════════════════════════════
     Module B — Budgeting & Cash Flow (Level 1–2)
  ══════════════════════════════════════════════════════ */
  {
    id: "budget-styles",
    title: "Budget Styles: 50/30/20 vs. Zero-Based",
    description: "Pick the budgeting method that actually fits your life.",
    level: "level-1",
    tags: ["budgeting", "cashflow", "visual-heavy", "level-1"],
    estimatedTimeMin: 7,
    sources: [
      { name: "CFPB — Budgeting", url: "https://www.consumerfinance.gov/consumer-tools/managing-your-finances/", type: "regulator", lastReviewed: "2026-01-01" },
    ],
  },
  {
    id: "starter-budget",
    title: "Build a 10-Minute Starter Budget",
    description: "A real working budget you can set up right now.",
    level: "level-1",
    tags: ["budgeting", "cashflow", "level-1"],
    estimatedTimeMin: 8,
    sources: [
      { name: "CFPB — Create a Budget", url: "https://www.consumerfinance.gov/consumer-tools/managing-your-finances/", type: "regulator", lastReviewed: "2026-01-01" },
    ],
  },
  {
    id: "irregular-income-budgeting",
    title: "Budgeting with Irregular Income",
    description: "For freelancers, 1099 workers, and anyone with variable pay.",
    level: "level-1",
    tags: ["budgeting", "cashflow", "irregular-income", "level-1", "level-2"],
    estimatedTimeMin: 8,
    sources: [
      { name: "IRS — Self-Employment Tax", url: "https://www.irs.gov/businesses/small-businesses-self-employed/self-employment-tax-social-security-and-medicare-taxes", type: "government", lastReviewed: "2026-01-01" },
      { name: "CFPB — Managing Irregular Income", url: "https://www.consumerfinance.gov/about-us/blog/managing-irregular-income/", type: "regulator", lastReviewed: "2026-01-01" },
    ],
  },
  {
    id: "pay-yourself-first",
    title: "Automations: The 'Set and Forget' Money Setup",
    description: "Make saving happen automatically before you can spend it.",
    level: "level-1",
    tags: ["budgeting", "systems-habits", "cashflow", "level-1"],
    estimatedTimeMin: 6,
    sources: [
      { name: "CFPB — Saving Automatically", url: "https://www.consumerfinance.gov/about-us/blog/saving-automatically-can-add-up/", type: "regulator", lastReviewed: "2026-01-01" },
    ],
  },
  {
    id: "sinking-funds",
    title: "Sinking Funds: Save for Irregular Expenses",
    description: "Turn surprise costs into planned ones.",
    level: "level-1",
    tags: ["budgeting", "cashflow", "systems-habits", "level-1", "level-2"],
    estimatedTimeMin: 6,
    sources: [
      { name: "CFPB — Savings Goal Planner", url: "https://www.consumerfinance.gov/consumer-tools/managing-your-finances/", type: "regulator", lastReviewed: "2026-01-01" },
    ],
  },

  /* ══════════════════════════════════════════════════════
     Module C — Emergency Fund & Saving (Level 1–2)
  ══════════════════════════════════════════════════════ */
  {
    id: "emergency-fund-how-much",
    title: "Emergency Fund: How Much Do You Need?",
    description: "The single most important financial safety net — and how to build it.",
    level: "level-1",
    tags: ["emergency-fund", "money-basics", "visual-heavy", "level-1"],
    estimatedTimeMin: 7,
    sources: [
      { name: "CFPB — Building an Emergency Fund", url: "https://www.consumerfinance.gov/an-essential-guide-to-building-an-emergency-fund/", type: "regulator", lastReviewed: "2026-01-01" },
      { name: "Federal Reserve — Report on Financial Well-Being", url: "https://www.federalreserve.gov/publications/report-economic-well-being-us-households.htm", type: "government", lastReviewed: "2026-01-01" },
    ],
  },
  {
    id: "where-to-keep-savings",
    title: "Where to Keep Your Savings",
    description: "Not all savings accounts are equal — here's what to look for.",
    level: "level-1",
    tags: ["emergency-fund", "money-basics", "level-1", "level-2"],
    estimatedTimeMin: 6,
    sources: [
      { name: "FDIC — Deposit Insurance", url: "https://www.fdic.gov/resources/deposit-insurance/", type: "regulator", lastReviewed: "2026-01-01" },
      { name: "NCUA — Share Insurance Coverage", url: "https://www.ncua.gov/consumers/share-insurance-coverage", type: "regulator", lastReviewed: "2026-01-01" },
    ],
  },
  {
    id: "saving-faster",
    title: "Saving Faster Without Hating Life",
    description: "Practical ways to grow your savings without feeling deprived.",
    level: "level-1",
    tags: ["emergency-fund", "budgeting", "systems-habits", "level-1", "level-2"],
    estimatedTimeMin: 6,
    sources: [
      { name: "CFPB — Budgeting and Saving", url: "https://www.consumerfinance.gov/consumer-tools/managing-your-finances/", type: "regulator", lastReviewed: "2026-01-01" },
    ],
  },

  /* ══════════════════════════════════════════════════════
     Module D — Credit & Debt (Level 1–2)
  ══════════════════════════════════════════════════════ */
  {
    id: "credit-score-basics",
    title: "Credit Score: What Actually Matters",
    description: "The 5 factors that determine your credit score — and which one matters most.",
    level: "level-1",
    tags: ["credit", "money-basics", "visual-heavy", "level-1"],
    estimatedTimeMin: 8,
    sources: [
      { name: "CFPB — Credit Reports and Scores", url: "https://www.consumerfinance.gov/consumer-tools/credit-reports-and-scores/", type: "regulator", lastReviewed: "2026-01-01" },
      { name: "AnnualCreditReport.com", url: "https://www.annualcreditreport.com", type: "government", lastReviewed: "2026-01-01" },
    ],
  },
  {
    id: "credit-card-interest",
    title: "Credit Cards: How Interest Actually Works",
    description: "Understand APR before it costs you thousands.",
    level: "level-1",
    tags: ["credit", "debt", "money-basics", "visual-heavy", "level-1"],
    estimatedTimeMin: 8,
    sources: [
      { name: "CFPB — Credit Cards", url: "https://www.consumerfinance.gov/consumer-tools/credit-cards/", type: "regulator", lastReviewed: "2026-01-01" },
      { name: "Federal Reserve — Consumer Credit Report", url: "https://www.federalreserve.gov/releases/g19/current/", type: "government", lastReviewed: "2026-01-01" },
    ],
  },
  {
    id: "debt-payoff-methods",
    title: "Debt Payoff: Avalanche vs. Snowball",
    description: "Two proven strategies — choose the one that keeps you going.",
    level: "level-1",
    tags: ["debt", "credit", "budgeting", "visual-heavy", "level-1", "level-2"],
    estimatedTimeMin: 9,
    sources: [
      { name: "CFPB — Strategies for Paying Off Debt", url: "https://www.consumerfinance.gov/about-us/blog/strategies-for-paying-down-debt/", type: "regulator", lastReviewed: "2026-01-01" },
    ],
  },
  {
    id: "debt-vs-investing",
    title: "Debt vs. Investing: What to Do First?",
    description: "A simple framework for the most common money dilemma.",
    level: "level-2",
    tags: ["debt", "investing-basics", "retirement", "level-2", "level-3"],
    estimatedTimeMin: 8,
    sources: [
      { name: "IRS — 401(k) Plans", url: "https://www.irs.gov/retirement-plans/401k-plans", type: "government", lastReviewed: "2026-01-01" },
      { name: "CFPB — Managing Debt", url: "https://www.consumerfinance.gov/consumer-tools/debt-collection/", type: "regulator", lastReviewed: "2026-01-01" },
    ],
  },
  {
    id: "student-loans-basics",
    title: "Student Loans: What You Need to Know",
    description: "Federal vs. private, repayment options, and your rights.",
    level: "level-1",
    tags: ["student-loans", "debt", "taxes-federal", "level-1", "level-2"],
    estimatedTimeMin: 9,
    sources: [
      { name: "Federal Student Aid — StudentAid.gov", url: "https://studentaid.gov", type: "government", lastReviewed: "2026-01-01" },
      { name: "CFPB — Student Loans", url: "https://www.consumerfinance.gov/consumer-tools/student-loans/", type: "regulator", lastReviewed: "2026-01-01" },
    ],
  },

  /* ══════════════════════════════════════════════════════
     Module E — Investing Basics (Level 2–3)
  ══════════════════════════════════════════════════════ */
  {
    id: "investing-101",
    title: "Investing 101: Stocks, Bonds & Funds",
    description: "Plain English — no jargon, no hype.",
    level: "level-2",
    tags: ["investing-basics", "money-basics", "visual-heavy", "level-2"],
    estimatedTimeMin: 8,
    sources: [
      { name: "SEC — Introduction to Investing", url: "https://www.investor.gov/introduction-investing", type: "government", lastReviewed: "2026-01-01" },
      { name: "SEC — Mutual Funds and ETFs", url: "https://www.investor.gov/introduction-investing/investing-basics/investment-products/mutual-funds-and-exchange-traded-funds-etf", type: "government", lastReviewed: "2026-01-01" },
    ],
  },
  {
    id: "risk-and-time-horizon",
    title: "Risk, Time, and Your Investing Timeline",
    description: "When you'll need the money changes everything about how to invest it.",
    level: "level-2",
    tags: ["investing-basics", "visual-heavy", "level-2"],
    estimatedTimeMin: 7,
    sources: [
      { name: "SEC — Asset Allocation", url: "https://www.investor.gov/introduction-investing/investing-basics/investment-products/asset-allocation", type: "government", lastReviewed: "2026-01-01" },
    ],
  },
  {
    id: "dollar-cost-averaging",
    title: "Dollar-Cost Averaging: Invest Without Timing the Market",
    description: "The strategy that removes guesswork from investing.",
    level: "level-2",
    tags: ["investing-basics", "systems-habits", "level-2"],
    estimatedTimeMin: 6,
    sources: [
      { name: "SEC — Invest Regularly", url: "https://www.investor.gov/additional-resources/general-resources/publications-research/info-sheets/invest-regularly", type: "government", lastReviewed: "2026-01-01" },
    ],
  },
  {
    id: "compound-growth",
    title: "Compound Growth: The 8th Wonder of the World",
    description: "Why starting early is worth more than investing more.",
    level: "level-2",
    tags: ["investing-basics", "retirement", "visual-heavy", "level-2"],
    estimatedTimeMin: 8,
    sources: [
      { name: "SEC — Compound Interest Calculator", url: "https://www.investor.gov/financial-tools-calculators/calculators/compound-interest-calculator", type: "government", lastReviewed: "2026-01-01" },
    ],
  },
  {
    id: "your-first-investing-plan",
    title: "Your First Investing Plan (Simple)",
    description: "A practical priority order: 401k match → debt → IRA → more.",
    level: "level-2",
    tags: ["investing-basics", "retirement", "benefits", "level-2", "level-3"],
    estimatedTimeMin: 9,
    sources: [
      { name: "IRS — IRA Contribution Limits", url: "https://www.irs.gov/retirement-plans/ira-deduction-limits", type: "government", lastReviewed: "2026-01-01" },
      { name: "IRS — Roth IRAs", url: "https://www.irs.gov/retirement-plans/roth-iras", type: "government", lastReviewed: "2026-01-01" },
      { name: "Dept. of Labor — 401(k)", url: "https://www.dol.gov/agencies/ebsa/about-ebsa/our-activities/resource-center/publications/what-you-should-know-about-your-retirement-plan", type: "government", lastReviewed: "2026-01-01" },
    ],
  },
];

/** Quick lookup by id */
export const LESSON_CATALOG_BY_ID: Record<string, Lesson> = Object.fromEntries(
  LESSON_CATALOG.map(l => [l.id, l]),
);
