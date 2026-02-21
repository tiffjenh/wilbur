import type { IconName } from "@/components/ui/Icon";

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

export const roadmapLessons: Lesson[] = [
  { id: "l1", slug: "banking-basics",  title: "Banking Basics: Checking & Savings", category: "Fundamentals", duration: "8 min",  status: "completed", order: 1 },
  { id: "l2", slug: "credit-vs-debit", title: "Credit vs. Debit Cards",             category: "Fundamentals", duration: "6 min",  status: "completed", order: 2 },
  { id: "l3", slug: "budgeting-101",   title: "Budgeting 101",                       category: "Fundamentals", duration: "10 min", status: "completed", order: 3 },
  { id: "l4", slug: "emergency-fund",  title: "Building an Emergency Fund",          category: "Fundamentals", duration: "8 min",  status: "available", order: 4 },
  { id: "l5", slug: "roth-ira",        title: "Roth IRA: Tax-Free Retirement",       category: "Investing",    duration: "12 min", status: "locked",    order: 5 },
];

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
