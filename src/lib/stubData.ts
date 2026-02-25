import type { IconName } from "@/components/ui/Icon";
import { loadProfile } from "./personalizationEngine";

export type LessonStatus = "locked" | "available" | "completed";

export interface Lesson {
  id: string;
  slug: string;
  title: string;
  category: string;
  duration: string;
  status: LessonStatus;
  order: number;
}

export interface Category {
  id: string;
  slug: string;
  title: string;
  description: string;
  icon: IconName;
  lessonCount: number;
  lessons: Lesson[];
}

export interface Resource {
  id: string;
  title: string;
  description: string;
  icon: IconName;
  href: string;
}

export const isAuthed = false;

/* ── Static fallback roadmap (used before questionnaire is complete) ── */
export const roadmapLessons: Lesson[] = [
  { id: "l1", slug: "banking-basics",  title: "Banking Basics: Checking & Savings", category: "Fundamentals", duration: "8 min",  status: "available", order: 1 },
  { id: "l2", slug: "budgeting-101",   title: "Budgeting 101",                       category: "Fundamentals", duration: "10 min", status: "locked",    order: 2 },
  { id: "l3", slug: "emergency-fund",  title: "Building an Emergency Fund",          category: "Fundamentals", duration: "8 min",  status: "locked",    order: 3 },
  { id: "l4", slug: "credit-score-101",title: "Credit Score 101",                    category: "Credit",       duration: "9 min",  status: "locked",    order: 4 },
  { id: "l5", slug: "what-is-investing",title: "What is Investing?",                 category: "Investing",    duration: "5 min",  status: "locked",    order: 5 },
];

/* ── Master lesson registry: all known lessons keyed by slug ── */
export const LESSON_REGISTRY: Record<string, Omit<Lesson, "status" | "order">> = {
  // Module A — Money Basics
  "money-map":                  { id: "a1", slug: "money-map",                  title: "Money Map: Where Your Money Goes",         category: "Money Basics",        duration: "6 min"  },
  "checking-vs-savings":        { id: "a2", slug: "checking-vs-savings",        title: "Checking vs. Savings (and What APY Means)", category: "Money Basics",       duration: "7 min"  },
  "bills-and-due-dates":        { id: "a3", slug: "bills-and-due-dates",        title: "Bills, Due Dates & Avoiding Late Fees",    category: "Money Basics",        duration: "5 min"  },
  "your-money-system":          { id: "a4", slug: "your-money-system",          title: "Your First Money System",                  category: "Money Basics",        duration: "8 min"  },
  // Module B — Budgeting
  "budget-styles":              { id: "b1", slug: "budget-styles",              title: "Budget Styles: 50/30/20 vs. Zero-Based",   category: "Budgeting",           duration: "7 min"  },
  "starter-budget":             { id: "b2", slug: "starter-budget",             title: "Build a 10-Minute Starter Budget",         category: "Budgeting",           duration: "8 min"  },
  "irregular-income-budgeting": { id: "b3", slug: "irregular-income-budgeting", title: "Budgeting with Irregular Income",          category: "Budgeting",           duration: "8 min"  },
  "pay-yourself-first":         { id: "b4", slug: "pay-yourself-first",         title: "Automations: The 'Set and Forget' Setup",  category: "Budgeting",           duration: "6 min"  },
  "sinking-funds":              { id: "b5", slug: "sinking-funds",              title: "Sinking Funds: Save for Irregular Expenses", category: "Budgeting",         duration: "6 min"  },
  // Module C — Emergency Fund
  "emergency-fund-how-much":    { id: "c1", slug: "emergency-fund-how-much",    title: "Emergency Fund: How Much Do You Need?",    category: "Emergency Fund",      duration: "7 min"  },
  "where-to-keep-savings":      { id: "c2", slug: "where-to-keep-savings",      title: "Where to Keep Your Savings",               category: "Emergency Fund",      duration: "6 min"  },
  "saving-faster":              { id: "c3", slug: "saving-faster",              title: "Saving Faster Without Hating Life",        category: "Emergency Fund",      duration: "6 min"  },
  // Module D — Credit & Debt
  "credit-score-basics":        { id: "d1", slug: "credit-score-basics",        title: "Credit Score: What Actually Matters",      category: "Credit & Debt",       duration: "8 min"  },
  "credit-card-interest":       { id: "d2", slug: "credit-card-interest",       title: "Credit Cards: How Interest Actually Works", category: "Credit & Debt",      duration: "8 min"  },
  "debt-payoff-methods":        { id: "d3", slug: "debt-payoff-methods",        title: "Debt Payoff: Avalanche vs. Snowball",       category: "Credit & Debt",       duration: "9 min"  },
  "debt-vs-investing":          { id: "d4", slug: "debt-vs-investing",          title: "Debt vs. Investing: What to Do First?",    category: "Credit & Debt",       duration: "8 min"  },
  "student-loans-basics":       { id: "d5", slug: "student-loans-basics",       title: "Student Loans: What You Need to Know",     category: "Credit & Debt",       duration: "9 min"  },
  // Module E — Investing
  "investing-101":              { id: "e1", slug: "investing-101",              title: "Investing 101: Stocks, Bonds & Funds",     category: "Investing Basics",    duration: "8 min"  },
  "risk-and-time-horizon":      { id: "e2", slug: "risk-and-time-horizon",      title: "Risk, Time, and Your Investing Timeline",  category: "Investing Basics",    duration: "7 min"  },
  "dollar-cost-averaging":      { id: "e3", slug: "dollar-cost-averaging",      title: "Dollar-Cost Averaging",                    category: "Investing Basics",    duration: "6 min"  },
  "compound-growth":            { id: "e4", slug: "compound-growth",            title: "Compound Growth: The 8th Wonder",          category: "Investing Basics",    duration: "8 min"  },
  "your-first-investing-plan":  { id: "e5", slug: "your-first-investing-plan",  title: "Your First Investing Plan (Simple)",       category: "Investing Basics",    duration: "9 min"  },
  // Legacy slugs (kept for backwards compatibility)
  "banking-basics":             { id: "r-banking",  slug: "banking-basics",       title: "Banking Basics: Checking & Savings",     category: "Fundamentals",        duration: "8 min"  },
  "budgeting-101":              { id: "r-budget",   slug: "budgeting-101",        title: "Budgeting 101",                          category: "Fundamentals",        duration: "10 min" },
  "50-30-20-rule":              { id: "r-503020",   slug: "50-30-20-rule",        title: "The 50/30/20 Rule",                      category: "Fundamentals",        duration: "6 min"  },
  "tracking-spending":          { id: "r-track",    slug: "tracking-spending",    title: "Tracking Your Spending",                 category: "Fundamentals",        duration: "8 min"  },
  "emergency-fund":             { id: "r-emerg",    slug: "emergency-fund",       title: "Building an Emergency Fund",             category: "Fundamentals",        duration: "8 min"  },
  "credit-vs-debit":            { id: "r-cvd",      slug: "credit-vs-debit",      title: "Credit vs. Debit Cards",                 category: "Credit Basics",       duration: "6 min"  },
  "credit-score-101":           { id: "r-credit",   slug: "credit-score-101",     title: "Credit Score 101",                       category: "Credit Basics",       duration: "9 min"  },
  "paying-off-debt":            { id: "r-debt",     slug: "paying-off-debt",      title: "Paying Off Debt",                        category: "Debt Management",     duration: "11 min" },
  "what-is-investing":          { id: "r-invest0",  slug: "what-is-investing",    title: "What is Investing?",                     category: "Investment Basics",   duration: "5 min"  },
  "risk-vs-return":             { id: "r-risk",     slug: "risk-vs-return",       title: "Risk vs. Return",                        category: "Investment Basics",   duration: "7 min"  },
  "compound-interest":          { id: "r-compound", slug: "compound-interest",    title: "Compound Interest Magic",                category: "Investment Basics",   duration: "8 min"  },
  "roth-ira":                   { id: "r-roth",     slug: "roth-ira",             title: "Roth IRA: Tax-Free Retirement",          category: "Retirement Accounts", duration: "12 min" },
  "w2-vs-1099":                 { id: "r-w2",       slug: "w2-vs-1099",           title: "W2 vs 1099: What's the Difference?",     category: "Income Types",        duration: "8 min"  },
  "renting-vs-buying":          { id: "r-rent",     slug: "renting-vs-buying",    title: "Renting vs. Buying a Home",              category: "Housing Basics",      duration: "12 min" },
  "health-insurance-101":       { id: "r-health",   slug: "health-insurance-101", title: "Health Insurance 101",                   category: "Insurance Basics",    duration: "9 min"  },
  // First Job Out of College track (flagship)
  "adult-money-game-plan":      { id: "fj1", slug: "adult-money-game-plan",      title: "Your Simple Money Game Plan (What to Do First)", category: "Money Foundations", duration: "6 min"  },
  "budgeting-in-10-minutes":    { id: "fj2", slug: "budgeting-in-10-minutes",    title: "Budgeting in 10 Minutes (A Simple System That Works)", category: "Budgeting & Cash Flow", duration: "7 min"  },
  "emergency-fund-basics":      { id: "fj3", slug: "emergency-fund-basics",      title: "Emergency Fund Basics (How to Avoid Money Panic)", category: "Money Foundations", duration: "6 min"  },
  "credit-cards-statement-balance": { id: "fj4", slug: "credit-cards-statement-balance", title: "Credit Cards: Statement Balance vs Minimum Payment", category: "Credit & Debt", duration: "7 min"  },
  "paycheck-basics":            { id: "fj5", slug: "paycheck-basics",            title: "Your Paycheck Explained (W-2, Withholding, Take-Home Pay)", category: "Taxes", duration: "7 min"  },
  "work-benefits-101":          { id: "fj6", slug: "work-benefits-101",          title: "Work Benefits 101: 401(k), Match, HSA/FSA (In Plain English)", category: "Work Benefits & Retirement", duration: "8 min"  },
  "investing-basics-no-stock-picking": { id: "fj7", slug: "investing-basics-no-stock-picking", title: "Investing Basics (Without Stock-Picking)", category: "Investing Basics", duration: "8 min"  },
  // V1 curriculum (Step 7) — canonical IDs for library
  "how-interest-works":            { id: "v1-interest",  slug: "how-interest-works",            title: "How Interest Works (In Plain English)",     category: "Credit & Debt",   duration: "8 min"  },
  "compound-growth-basics":       { id: "v1-compound", slug: "compound-growth-basics",       title: "Compound Growth (Why Starting Small Matters)", category: "Investing Basics", duration: "8 min"  },
  "taxes-how-to-file":            { id: "v1-file",     slug: "taxes-how-to-file",            title: "How to File Your Taxes",                    category: "Taxes",           duration: "10 min" },
  "tax-brackets-explained":       { id: "v1-brackets", slug: "tax-brackets-explained",       title: "Tax Brackets (Marginal vs Effective)",      category: "Taxes",           duration: "10 min" },
  "write-offs-explained":         { id: "v1-writeoff", slug: "write-offs-explained",         title: "Write-Offs Explained",                     category: "Taxes",           duration: "8 min"  },
  "brokerage-account-basics":     { id: "v1-broker",   slug: "brokerage-account-basics",     title: "Brokerage Accounts (How They Work)",        category: "Investing Basics", duration: "9 min"  },
  "etfs-and-index-funds":        { id: "v1-etf",     slug: "etfs-and-index-funds",        title: "ETFs & Index Funds (The Beginner Sweet Spot)", category: "Investing Basics", duration: "12 min" },
  "rent-vs-buy":                 { id: "v1-rentbuy", slug: "rent-vs-buy",                 title: "Rent vs Buy (How to Decide Without Stress)", category: "Real Estate",      duration: "10 min" },
  "mortgage-basics":              { id: "v1-mortgage", slug: "mortgage-basics",              title: "Mortgage Basics (Pre-approval, Rates)",     category: "Real Estate",      duration: "12 min" },
  "insurance-basics":             { id: "v1-insure",   slug: "insurance-basics",             title: "Insurance Basics (Health, Auto, Renters)",  category: "Insurance & Risk", duration: "9 min"  },
};

/**
 * Returns a personalized roadmap based on the stored LearningProfile.
 * Falls back to `roadmapLessons` if no profile is found.
 *
 * Statuses: first lesson is "available", rest are "locked".
 * Once a lesson is in the profile's recommendedPath it is always unlocked (#1 = available).
 */
export function getPersonalizedRoadmap(): Lesson[] {
  const profile = loadProfile();
  if (!profile || profile.recommendedPath.length === 0) return roadmapLessons;

  return profile.recommendedPath.map((slug, idx) => {
    const base = LESSON_REGISTRY[slug];
    if (!base) return null;
    return {
      ...base,
      status: idx === 0 ? "available" : "locked",
      order: idx + 1,
    } as Lesson;
  }).filter(Boolean) as Lesson[];
}

export const categories: Category[] = [
  {
    id: "c1", slug: "investing", title: "Investing", description: "Stocks, bonds, real estate & more",
    icon: "trend-up", lessonCount: 24,
    lessons: [
      { id: "i1",  slug: "what-is-investing",   title: "What is Investing?",             category: "Investment Basics",  duration: "5 min",  status: "completed", order: 1 },
      { id: "i2",  slug: "risk-vs-return",       title: "Risk vs. Return",                category: "Investment Basics",  duration: "7 min",  status: "completed", order: 2 },
      { id: "i3",  slug: "time-value-of-money",  title: "Time Value of Money",            category: "Investment Basics",  duration: "8 min",  status: "available", order: 3 },
      { id: "i4",  slug: "compound-interest",    title: "Compound Interest Magic",        category: "Investment Basics",  duration: "8 min",  status: "available", order: 4 },
      { id: "i5",  slug: "understanding-stocks", title: "Understanding Stocks",           category: "Stocks",             duration: "10 min", status: "locked",    order: 5 },
      { id: "i6",  slug: "read-stock-charts",    title: "How to Read Stock Charts",       category: "Stocks",             duration: "12 min", status: "locked",    order: 6 },
      { id: "i7",  slug: "stock-market-indexes", title: "Stock Market Indexes",           category: "Stocks",             duration: "8 min",  status: "locked",    order: 7 },
      { id: "i8",  slug: "dividends-explained",  title: "Dividends Explained",            category: "Stocks",             duration: "9 min",  status: "locked",    order: 8 },
      { id: "i9",  slug: "what-are-bonds",       title: "What Are Bonds?",                category: "Bonds & Fixed Income", duration: "8 min", status: "locked",   order: 9 },
      { id: "i10", slug: "gov-vs-corp-bonds",    title: "Government vs Corporate Bonds",  category: "Bonds & Fixed Income", duration: "10 min", status: "locked",  order: 10 },
    ],
  },
  {
    id: "c2", slug: "budgeting", title: "Budgeting", description: "Managing your money wisely",
    icon: "wallet", lessonCount: 18,
    lessons: [
      { id: "b1", slug: "budgeting-101",     title: "Budgeting 101",             category: "Fundamentals", duration: "10 min", status: "completed", order: 1 },
      { id: "b2", slug: "50-30-20-rule",     title: "The 50/30/20 Rule",         category: "Fundamentals", duration: "6 min",  status: "available", order: 2 },
      { id: "b3", slug: "tracking-spending", title: "Tracking Your Spending",    category: "Fundamentals", duration: "8 min",  status: "locked",    order: 3 },
      { id: "b4", slug: "emergency-fund",    title: "Building an Emergency Fund", category: "Saving",      duration: "8 min",  status: "locked",    order: 4 },
    ],
  },
  {
    id: "c3", slug: "credit-debt", title: "Credit & Debt", description: "Building credit and managing debt",
    icon: "credit-card", lessonCount: 18,
    lessons: [
      { id: "cd1", slug: "credit-vs-debit",  title: "Credit vs. Debit Cards", category: "Credit Basics",   duration: "6 min",  status: "completed", order: 1 },
      { id: "cd2", slug: "credit-score-101", title: "Credit Score 101",       category: "Credit Basics",   duration: "9 min",  status: "available", order: 2 },
      { id: "cd3", slug: "paying-off-debt",  title: "Paying Off Debt",        category: "Debt Management", duration: "11 min", status: "locked",    order: 3 },
    ],
  },
  {
    id: "c4", slug: "housing", title: "Housing", description: "Renting vs buying, mortgages",
    icon: "home", lessonCount: 12,
    lessons: [
      { id: "h1", slug: "renting-vs-buying", title: "Renting vs. Buying a Home", category: "Housing Basics", duration: "12 min", status: "locked", order: 1 },
      { id: "h2", slug: "mortgage-101",      title: "Mortgage 101",               category: "Housing Basics", duration: "14 min", status: "locked", order: 2 },
    ],
  },
  {
    id: "c5", slug: "career-income", title: "Career & Income", description: "Negotiating salary, side hustles",
    icon: "graduation-cap", lessonCount: 15,
    lessons: [
      { id: "ci1", slug: "salary-negotiation", title: "How to Negotiate Your Salary",     category: "Career",       duration: "10 min", status: "locked", order: 1 },
      { id: "ci2", slug: "w2-vs-1099",         title: "W2 vs 1099: What's the Difference?", category: "Income Types", duration: "8 min",  status: "locked", order: 2 },
    ],
  },
  {
    id: "c6", slug: "insurance", title: "Insurance", description: "Health, life, auto insurance",
    icon: "heart", lessonCount: 10,
    lessons: [
      { id: "ins1", slug: "health-insurance-101", title: "Health Insurance 101", category: "Insurance Basics", duration: "9 min", status: "locked", order: 1 },
    ],
  },
  {
    id: "c7", slug: "retirement", title: "Retirement Planning", description: "401(k), IRA, and long-term planning",
    icon: "sunset", lessonCount: 14,
    lessons: [
      { id: "rt1", slug: "what-is-401k",    title: "What is a 401(k)?",          category: "Retirement Accounts", duration: "10 min", status: "locked", order: 1 },
      { id: "rt2", slug: "roth-ira",        title: "Roth IRA: Tax-Free Retirement", category: "Retirement Accounts", duration: "12 min", status: "locked", order: 2 },
      { id: "rt3", slug: "roth-ira-tax-free", title: "HSA & FSA: Healthcare Savings", category: "Retirement Accounts", duration: "8 min", status: "locked", order: 3 },
    ],
  },
  {
    id: "c8", slug: "money-basics", title: "Money Basics", description: "Financial fundamentals for beginners",
    icon: "book-open", lessonCount: 20,
    lessons: [
      { id: "mb1", slug: "banking-basics",  title: "Banking Basics: Checking & Savings", category: "Fundamentals", duration: "8 min",  status: "completed", order: 1 },
      { id: "mb2", slug: "how-taxes-work",  title: "How Taxes Work",                     category: "Taxes",        duration: "11 min", status: "available", order: 2 },
    ],
  },
];

export interface LessonContent {
  slug: string;
  title: string;
  subtitle: string;
  category: string;
  duration: string;
  sections: {
    heading: string;
    body: string;
    bullets?: string[];
  }[];
  keyTerms: string[];
  proTip?: string;
}

export const lessonContents: Record<string, LessonContent> = {
  "budgeting-101": {
    slug: "budgeting-101",
    title: "Budgeting 101",
    subtitle: "Budgeting 101: Take Control of Your Money",
    category: "Fundamentals",
    duration: "10 min",
    keyTerms: ["budget", "savings rate", "fixed expenses", "variable expenses", "net income"],
    proTip: "Highlight any confusing term to get instant AI help!",
    sections: [
      { heading: "Why Budget?",        body: "A budget is simply a plan for your money. It helps you spend intentionally and reach your goals faster." },
      {
        heading: "The 50/30/20 Rule", body: "A simple framework for dividing your income:",
        bullets: [
          "50% — Needs: Rent, groceries, utilities, insurance, minimum debt payments, transportation",
          "30% — Wants: Dining out, entertainment, shopping, hobbies, subscriptions",
          "20% — Savings & Debt Payoff: Emergency fund, investing, extra debt payments",
        ],
      },
      {
        heading: "How to Start", body: "Starting a budget doesn't have to be complicated. Here's a simple 3-step approach:",
        bullets: [
          "1. Track your current spending for one month",
          "2. Categorize everything into Needs, Wants, and Savings",
          "3. Adjust so your Savings category is at least 20%",
        ],
      },
      {
        heading: "Common Mistakes", body: "Avoid these pitfalls when starting your budget:",
        bullets: [
          "Being too restrictive — build in fun money",
          "Forgetting irregular expenses (car repairs, holidays)",
          "Not revisiting your budget as life changes",
        ],
      },
    ],
  },
  "emergency-fund": {
    slug: "emergency-fund",
    title: "Building an Emergency Fund",
    subtitle: "Building Your Emergency Fund",
    category: "Fundamentals",
    duration: "8 min",
    keyTerms: ["emergency fund", "liquid savings", "FDIC", "high-yield savings account"],
    proTip: "Highlight any confusing term to get instant AI help!",
    sections: [
      { heading: "What Is It?", body: "An emergency fund is money set aside for unexpected life events — not for planned expenses or wants." },
      { heading: "True Emergencies:", body: "", bullets: ["Job loss", "Medical bills", "Car repairs", "Home repairs (if you own)", "Emergency travel"] },
      { heading: "NOT Emergencies:", body: "", bullets: ["Sales and deals", "Vacations", "New phone or laptop", "Concert tickets"] },
      { heading: "How Much Do You Need?", body: "Starter Emergency Fund: $1,000\nFull Emergency Fund: 3–6 months of essential expenses\nFreelancer/Self-employed: Aim for 6–12 months" },
    ],
  },
  "banking-basics": {
    slug: "banking-basics",
    title: "Banking Basics: Checking & Savings",
    subtitle: "Banking Basics: Checking & Savings Accounts",
    category: "Fundamentals",
    duration: "8 min",
    keyTerms: ["APY", "FDIC", "debit card", "overdraft", "direct deposit"],
    proTip: "Highlight any confusing term to get instant AI help!",
    sections: [
      { heading: "What You'll Learn", body: "" },
      {
        heading: "Checking Accounts", body: "A checking account is your everyday money hub. This is where your paychecks get deposited and where you pay your bills from.",
        bullets: ["Easy access to your money through debit cards and checks", "Unlimited transactions in most cases", "Little or no interest earned", "May have monthly fees (look for free checking!)"],
      },
      {
        heading: "Savings Accounts", body: "A savings account is where you store money for your future goals and emergencies.",
        bullets: ["Earns interest on your balance (usually 0.01% – 5% APY)", "Limited withdrawals (typically 6 per month)", "FDIC insured up to $250,000", "Keeps your spending money separate"],
      },
    ],
  },
};

export const simulators: Resource[] = [
  { id: "sim1", title: "Compound Growth Simulator",    description: "See how your money grows over time with compound interest",     icon: "trend-up",     href: "/resources/compound-growth" },
  { id: "sim2", title: "Paycheck Breakdown Tool",      description: "Understand where your paycheck goes with taxes and deductions",  icon: "clipboard",    href: "/resources/paycheck" },
  { id: "sim3", title: "Budget Builder",               description: "Create a personalized budget based on your income and goals",    icon: "piggy-bank",   href: "/resources/budget-builder" },
  { id: "sim4", title: "Credit Score Impact Simulator",description: "See how different actions affect your credit score",             icon: "credit-card",  href: "/resources/credit-score" },
];

export const tools: Resource[] = [
  { id: "t1", title: "Templates", description: "Downloadable budgeting and planning spreadsheets", icon: "clipboard", href: "/resources/templates" },
];

export const learningResources: Resource[] = [
  { id: "lr1", title: "Financial Glossary",   description: "Look up any financial term you don't understand",         icon: "book-open", href: "/resources/glossary" },
  { id: "lr2", title: "Recommended Books",    description: "Curated list of books to deepen your financial knowledge", icon: "book-open", href: "/resources/books" },
  { id: "lr3", title: "FAQs",                 description: "Frequently asked questions about money and finance",       icon: "star",      href: "/resources/faqs" },
];
