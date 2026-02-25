/**
 * MVP curriculum architecture — single source of truth for:
 * - Domains (categories)
 * - Lesson blueprints (canonical IDs, titles, chunk, priority, showInLibrary)
 * - Library list (V1 only) and legacy redirects.
 */

export type CurriculumChunk =
  | "stability"
  | "income"
  | "growth"
  | "protection"
  | "advanced";

export type CurriculumDomain =
  | "moneyFoundations"
  | "budgetingCashFlow"
  | "banking"
  | "creditDebt"
  | "studentLoans"
  | "incomeBenefits"
  | "taxes"
  | "investingBasics"
  | "stocksEtfs"
  | "brokeragePlatforms"
  | "realEstateHome"
  | "realEstateInvesting"
  | "rentalsSTR"
  | "crypto"
  | "insuranceRisk"
  | "sideIncomeBusiness";

export type CurriculumDomainDef = {
  id: CurriculumDomain;
  title: string;
  description: string;
  defaultChunk: CurriculumChunk;
};

export type CurriculumLessonBlueprint = {
  id: string; // canonical slug
  title: string;
  domain: CurriculumDomain;
  chunk: CurriculumChunk;
  priority: 1 | 2 | 3 | 4 | 5; // 1 = must-ship first
  showInLibrary: boolean; // V1 true; later false
  notes?: string; // short guidance for Step 8 writer
};

export const CURRICULUM_DOMAINS: CurriculumDomainDef[] = [
  {
    id: "moneyFoundations",
    title: "Money Foundations",
    description: "A simple plan for what to do first so you don't feel overwhelmed.",
    defaultChunk: "stability",
  },
  {
    id: "budgetingCashFlow",
    title: "Budgeting & Cash Flow",
    description: "A simple system to control spending and build savings without spreadsheets.",
    defaultChunk: "stability",
  },
  {
    id: "banking",
    title: "Banking Basics",
    description: "Checking, savings, and where your money should live day-to-day.",
    defaultChunk: "stability",
  },
  {
    id: "creditDebt",
    title: "Credit & Debt",
    description: "Credit cards, interest, and debt payoff—practical, not shamey.",
    defaultChunk: "stability",
  },
  {
    id: "studentLoans",
    title: "Student Loans",
    description: "Federal vs private, repayment options, and how to prioritize without panic.",
    defaultChunk: "stability",
  },
  {
    id: "incomeBenefits",
    title: "Income & Work Benefits",
    description: "Paycheck, benefits, and how to not leave free money on the table.",
    defaultChunk: "income",
  },
  {
    id: "taxes",
    title: "Taxes",
    description: "How filing works, brackets, write-offs, and what to do (without CPA jargon).",
    defaultChunk: "income",
  },
  {
    id: "investingBasics",
    title: "Investing Basics",
    description: "Start investing without stock-picking or hype. Build confidence first.",
    defaultChunk: "growth",
  },
  {
    id: "stocksEtfs",
    title: "Stocks & ETFs",
    description: "How stocks work, stock charts, ETFs, and what actually matters.",
    defaultChunk: "growth",
  },
  {
    id: "brokeragePlatforms",
    title: "Brokerage Platforms",
    description: "How brokerage apps work and how to read the screens without confusion.",
    defaultChunk: "growth",
  },
  {
    id: "realEstateHome",
    title: "Buying a Home",
    description: "Mortgage basics, qualifying, and what buying a primary home really costs.",
    defaultChunk: "growth",
  },
  {
    id: "realEstateInvesting",
    title: "Real Estate Investing",
    description: "Rental property fundamentals: cash flow, cap rate, and risks.",
    defaultChunk: "advanced",
  },
  {
    id: "rentalsSTR",
    title: "Short-Term Rentals (STR)",
    description: "Airbnb/VRBO basics, seasonality, costs, and risk—no hype.",
    defaultChunk: "advanced",
  },
  {
    id: "crypto",
    title: "Cryptocurrency",
    description: "Crypto basics and risks—clear, cautious, and beginner-friendly.",
    defaultChunk: "advanced",
  },
  {
    id: "insuranceRisk",
    title: "Insurance & Risk",
    description: "The boring stuff that saves you from financial disasters.",
    defaultChunk: "protection",
  },
  {
    id: "sideIncomeBusiness",
    title: "Side Income & Business",
    description: "1099 basics, write-offs, and keeping business money organized.",
    defaultChunk: "income",
  },
];

/**
 * V1 lesson blueprint list
 * - Keep this to ~25–35 lessons total for MVP.
 * - Only showInLibrary=true lessons should appear in Library.
 * - Additional ideas stay showInLibrary=false for later (no overwhelm).
 */
export const CURRICULUM_LESSONS: CurriculumLessonBlueprint[] = [
  // --- Stability (Foundations) ---
  {
    id: "adult-money-game-plan",
    title: "Your Simple Money Game Plan (What to Do First)",
    domain: "moneyFoundations",
    chunk: "stability",
    priority: 1,
    showInLibrary: true,
  },
  {
    id: "budgeting-in-10-minutes",
    title: "Budgeting in 10 Minutes (A Simple System That Works)",
    domain: "budgetingCashFlow",
    chunk: "stability",
    priority: 1,
    showInLibrary: true,
  },
  {
    id: "emergency-fund-basics",
    title: "Emergency Fund Basics",
    domain: "moneyFoundations",
    chunk: "stability",
    priority: 1,
    showInLibrary: true,
  },
  {
    id: "checking-vs-savings",
    title: "Checking vs Savings (Where Your Money Should Live)",
    domain: "banking",
    chunk: "stability",
    priority: 2,
    showInLibrary: true,
    notes: "Keep it practical: how to set it up + when to move money.",
  },
  {
    id: "credit-cards-statement-balance",
    title: "Credit Cards: Statement Balance vs Minimum Payment",
    domain: "creditDebt",
    chunk: "stability",
    priority: 1,
    showInLibrary: true,
  },
  {
    id: "credit-score-basics",
    title: "Credit Score Basics (What Matters, What Doesn't)",
    domain: "creditDebt",
    chunk: "stability",
    priority: 2,
    showInLibrary: true,
    notes: "No FICO deep dive. Focus on behavior + common myths.",
  },
  {
    id: "how-interest-works",
    title: "How Interest Works (In Plain English)",
    domain: "creditDebt",
    chunk: "stability",
    priority: 2,
    showInLibrary: true,
  },
  {
    id: "student-loans-basics",
    title: "Student Loans Basics (Federal vs Private, What To Do First)",
    domain: "studentLoans",
    chunk: "stability",
    priority: 2,
    showInLibrary: true,
    notes: "Teach prioritization without giving personal advice.",
  },

  // --- Income & Benefits ---
  {
    id: "paycheck-basics",
    title: "Your Paycheck Explained (W-2, Withholding, Take-Home Pay)",
    domain: "incomeBenefits",
    chunk: "income",
    priority: 1,
    showInLibrary: true,
  },
  {
    id: "w2-vs-1099",
    title: "W-2 vs 1099 (What Changes for Taxes and Benefits)",
    domain: "incomeBenefits",
    chunk: "income",
    priority: 2,
    showInLibrary: true,
  },
  {
    id: "work-benefits-101",
    title: "Work Benefits 101 (401k, Match, HSA/FSA)",
    domain: "incomeBenefits",
    chunk: "income",
    priority: 1,
    showInLibrary: true,
  },
  {
    id: "taxes-how-to-file",
    title: "How to File Your Taxes (What You Need + Software Options)",
    domain: "taxes",
    chunk: "income",
    priority: 2,
    showInLibrary: true,
    notes: "Include: Free File, TurboTax/HRB, CPA vs DIY, common docs.",
  },
  {
    id: "tax-brackets-explained",
    title: "Tax Brackets (Marginal vs Effective, Simplified)",
    domain: "taxes",
    chunk: "income",
    priority: 3,
    showInLibrary: true,
  },
  {
    id: "write-offs-explained",
    title: "Write-Offs Explained (What They Are and What They Aren't)",
    domain: "taxes",
    chunk: "income",
    priority: 2,
    showInLibrary: true,
    notes: "Deduction vs credit, myth-bust, simple numbers example.",
  },

  // --- Growth (Investing) ---
  {
    id: "what-is-investing",
    title: "What Is Investing? (And What It's Not)",
    domain: "investingBasics",
    chunk: "growth",
    priority: 2,
    showInLibrary: true,
  },
  {
    id: "investing-basics-no-stock-picking",
    title: "Investing Basics (Without Stock-Picking)",
    domain: "investingBasics",
    chunk: "growth",
    priority: 1,
    showInLibrary: true,
  },
  {
    id: "brokerage-account-basics",
    title: "Brokerage Accounts (How They Work + What You're Seeing)",
    domain: "brokeragePlatforms",
    chunk: "growth",
    priority: 2,
    showInLibrary: true,
    notes: "Teach screens: positions, buying power, orders, fees.",
  },
  {
    id: "etfs-and-index-funds",
    title: "ETFs & Index Funds (The Beginner Sweet Spot)",
    domain: "stocksEtfs",
    chunk: "growth",
    priority: 2,
    showInLibrary: true,
  },
  {
    id: "compound-growth-basics",
    title: "Compound Growth (Why Starting Small Matters)",
    domain: "investingBasics",
    chunk: "growth",
    priority: 2,
    showInLibrary: true,
  },
  {
    id: "dollar-cost-averaging",
    title: "Dollar-Cost Averaging (How to Invest Without Timing the Market)",
    domain: "investingBasics",
    chunk: "growth",
    priority: 3,
    showInLibrary: true,
  },

  // --- Real Estate (Primary Home) ---
  {
    id: "rent-vs-buy",
    title: "Rent vs Buy (How to Decide Without Stress)",
    domain: "realEstateHome",
    chunk: "growth",
    priority: 3,
    showInLibrary: true,
  },
  {
    id: "mortgage-basics",
    title: "Mortgage Basics (Pre-approval, Rates, and What You Qualify For)",
    domain: "realEstateHome",
    chunk: "growth",
    priority: 3,
    showInLibrary: true,
  },

  // --- Protection ---
  {
    id: "insurance-basics",
    title: "Insurance Basics (Health, Auto, Renters—What Actually Matters)",
    domain: "insuranceRisk",
    chunk: "protection",
    priority: 4,
    showInLibrary: true,
  },

  // --- V1.5 / Advanced (hidden for now) ---
  {
    id: "crypto-basics",
    title: "Crypto Basics (What It Is + The Risks)",
    domain: "crypto",
    chunk: "advanced",
    priority: 4,
    showInLibrary: false,
  },
  {
    id: "real-estate-investing-basics",
    title: "Real Estate Investing Basics (Cash Flow, Cap Rate, Risk)",
    domain: "realEstateInvesting",
    chunk: "advanced",
    priority: 4,
    showInLibrary: false,
  },
  {
    id: "str-basics",
    title: "Short-Term Rentals Basics (Airbnb/VRBO Reality Check)",
    domain: "rentalsSTR",
    chunk: "advanced",
    priority: 4,
    showInLibrary: false,
  },
];

/**
 * Source of truth for what the Library intends to show (V1 only).
 */
export function CURRICULUM_LIBRARY_IDS(): string[] {
  return CURRICULUM_LESSONS.filter((l) => l.showInLibrary).map((l) => l.id);
}

/**
 * Canonical slug redirects (Step 6/7 cleanup).
 * If users hit a legacy slug, route them to the canonical lesson.
 */
export const LEGACY_LESSON_REDIRECTS: Record<string, string> = {
  "investing-101": "investing-basics-no-stock-picking",
  "budgeting-101": "budgeting-in-10-minutes",
  "banking-basics": "checking-vs-savings",
  "compound-growth": "compound-growth-basics",
  "investing 101": "investing-basics-no-stock-picking",
};

/** V1 lessons that should appear in the Library (for optional use behind feature flag). */
export function getV1LibraryLessons(): CurriculumLessonBlueprint[] {
  return CURRICULUM_LESSONS.filter((l) => l.showInLibrary);
}
