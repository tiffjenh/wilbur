/**
 * Single source of truth for curriculum: domains (categories) and lessons.
 * Data-driven; pages and navigation consume this.
 */

export type LessonLevel = "beginner" | "intermediate" | "advanced";

export type DomainCategory = {
  id: string;
  title: string;
  description?: string;
  order: number;
};

export type FormatHint =
  | "bullets"
  | "steps"
  | "comparison-table"
  | "scenario"
  | "checklist"
  | "chart"
  | "diagram"
  | "calculator"
  | "glossary";

export type Lesson = {
  id: string;
  title: string;
  domainId: string;
  level: LessonLevel;
  tags: string[];
  prerequisites: string[];
  estimatedMinutes: number;
  formatHints: FormatHint[];
};

export const CATEGORIES: DomainCategory[] = [
  { id: "money-foundations", title: "Money Foundations", description: "The basics: goals, inflation, and how money works.", order: 1 },
  { id: "budgeting-cash-flow", title: "Budgeting & Cash Flow", description: "Simple systems to control spending without overcomplicating it.", order: 2 },
  { id: "banking-safe-money", title: "Banking & Safe Money", description: "Checking, savings, interest, and protecting your money.", order: 3 },
  { id: "credit-debt", title: "Credit & Debt", description: "Credit scores, cards, loans, and strategies to reduce debt costs.", order: 4 },
  { id: "income-taxes-benefits", title: "Income, Taxes, & Benefits", description: "Paychecks, W-2 vs 1099, taxes, and employer benefits.", order: 5 },
  { id: "investing-fundamentals", title: "Investing Fundamentals", description: "Core investing concepts and vehicles (stocks, funds, bonds).", order: 6 },
  { id: "retirement-accounts", title: "Retirement Accounts", description: "401(k), IRA, Roth vs Traditional, and building long-term savings.", order: 7 },
  { id: "advanced-investing", title: "Advanced Investing", description: "Options, advanced portfolio concepts, and tax efficiency.", order: 8 },
  { id: "real-estate-property", title: "Real Estate & Property", description: "Rent vs buy, mortgages, and real estate investing basics.", order: 9 },
  { id: "life-stage-planning", title: "Planning by Life Stage", description: "Practical tracks for college, early career, families, retirement.", order: 10 },
  { id: "behavioral-finance", title: "Behavioral Finance", description: "Money psychology: biases, habits, and decision-making.", order: 11 },
  { id: "tools-simulations", title: "Tools & Simulations", description: "Interactive tools and templates (not lessons).", order: 12 },
];

export const LESSONS: Lesson[] = [
  { id: "goals-and-money-plan", title: "Goals & Your Money Plan", domainId: "money-foundations", level: "beginner", tags: ["foundations", "goals", "planning"], prerequisites: [], estimatedMinutes: 8, formatHints: ["bullets", "steps", "checklist"] },
  { id: "needs-vs-wants", title: "Needs vs Wants (and why it's harder than it sounds)", domainId: "money-foundations", level: "beginner", tags: ["foundations", "spending", "behavior"], prerequisites: ["goals-and-money-plan"], estimatedMinutes: 7, formatHints: ["bullets", "scenario"] },
  { id: "inflation-and-buying-power", title: "Inflation & Purchasing Power", domainId: "money-foundations", level: "beginner", tags: ["foundations", "inflation"], prerequisites: [], estimatedMinutes: 7, formatHints: ["bullets", "chart", "scenario"] },
  { id: "how-interest-works", title: "How Interest Works (APR vs APY)", domainId: "money-foundations", level: "beginner", tags: ["foundations", "interest", "apr", "apy"], prerequisites: [], estimatedMinutes: 8, formatHints: ["comparison-table", "chart", "bullets"] },
  { id: "compound-growth-basics", title: "Compound Growth: The 8th Wonder (basics)", domainId: "money-foundations", level: "beginner", tags: ["foundations", "compound-interest", "investing"], prerequisites: ["how-interest-works"], estimatedMinutes: 8, formatHints: ["chart", "scenario", "bullets"] },
  { id: "simple-budget-system", title: "A Simple Budget System (without spreadsheets)", domainId: "budgeting-cash-flow", level: "beginner", tags: ["budgeting", "cash-flow", "foundations"], prerequisites: ["goals-and-money-plan"], estimatedMinutes: 10, formatHints: ["steps", "checklist", "scenario"] },
  { id: "50-30-20-rule", title: "The 50/30/20 Rule (and how to adapt it)", domainId: "budgeting-cash-flow", level: "beginner", tags: ["budgeting", "spending"], prerequisites: ["simple-budget-system"], estimatedMinutes: 7, formatHints: ["bullets", "comparison-table", "scenario"] },
  { id: "zero-based-budgeting", title: "Zero-Based Budgeting (quick overview)", domainId: "budgeting-cash-flow", level: "intermediate", tags: ["budgeting", "cash-flow"], prerequisites: ["simple-budget-system"], estimatedMinutes: 8, formatHints: ["steps", "bullets"] },
  { id: "automating-your-money", title: "Automating Your Money (pay yourself first)", domainId: "budgeting-cash-flow", level: "intermediate", tags: ["budgeting", "automation", "savings"], prerequisites: ["simple-budget-system"], estimatedMinutes: 9, formatHints: ["steps", "checklist"] },
  { id: "emergency-fund-basics", title: "Emergency Fund: How much you need (and where to keep it)", domainId: "budgeting-cash-flow", level: "beginner", tags: ["savings", "emergency-fund", "foundations"], prerequisites: ["simple-budget-system"], estimatedMinutes: 10, formatHints: ["bullets", "chart", "checklist"] },
  { id: "checking-vs-savings", title: "Checking vs Savings Accounts", domainId: "banking-safe-money", level: "beginner", tags: ["banking", "foundations"], prerequisites: [], estimatedMinutes: 7, formatHints: ["comparison-table", "bullets"] },
  { id: "high-yield-savings", title: "High-Yield Savings Accounts (HYSA)", domainId: "banking-safe-money", level: "beginner", tags: ["banking", "savings", "apy"], prerequisites: ["checking-vs-savings", "how-interest-works"], estimatedMinutes: 7, formatHints: ["bullets", "comparison-table"] },
  { id: "cds-explained", title: "CDs Explained (Certificates of Deposit)", domainId: "banking-safe-money", level: "beginner", tags: ["banking", "cd", "fixed-income"], prerequisites: ["how-interest-works"], estimatedMinutes: 8, formatHints: ["bullets", "comparison-table", "scenario"] },
  { id: "fdic-and-safety", title: "Is Your Money Safe? FDIC & NCUA", domainId: "banking-safe-money", level: "beginner", tags: ["banking", "fdic", "safety"], prerequisites: [], estimatedMinutes: 7, formatHints: ["bullets", "checklist"] },
  { id: "bank-fees-and-overdraft", title: "Bank Fees & Overdraft (how to avoid them)", domainId: "banking-safe-money", level: "beginner", tags: ["banking", "fees"], prerequisites: ["checking-vs-savings"], estimatedMinutes: 6, formatHints: ["bullets", "checklist"] },
  { id: "what-is-credit", title: "What Is Credit?", domainId: "credit-debt", level: "beginner", tags: ["credit", "foundations"], prerequisites: [], estimatedMinutes: 6, formatHints: ["bullets", "scenario"] },
  { id: "credit-cards-101", title: "Credit Cards 101 (smart use, not scary use)", domainId: "credit-debt", level: "beginner", tags: ["credit", "credit-cards", "apr"], prerequisites: ["what-is-credit", "how-interest-works"], estimatedMinutes: 10, formatHints: ["bullets", "checklist", "scenario"] },
  { id: "credit-score-basics", title: "Credit Scores: What affects them?", domainId: "credit-debt", level: "beginner", tags: ["credit", "credit-score"], prerequisites: ["what-is-credit"], estimatedMinutes: 10, formatHints: ["diagram", "bullets"] },
  { id: "credit-report-how-to-read", title: "How to Read a Credit Report", domainId: "credit-debt", level: "intermediate", tags: ["credit", "credit-score"], prerequisites: ["credit-score-basics"], estimatedMinutes: 9, formatHints: ["steps", "checklist"] },
  { id: "debt-snowball-vs-avalanche", title: "Debt Snowball vs Debt Avalanche", domainId: "credit-debt", level: "intermediate", tags: ["debt", "repayment"], prerequisites: ["credit-cards-101"], estimatedMinutes: 9, formatHints: ["comparison-table", "scenario", "steps"] },
  { id: "student-loans-basics", title: "Student Loans (federal vs private)", domainId: "credit-debt", level: "intermediate", tags: ["debt", "student-loans"], prerequisites: [], estimatedMinutes: 10, formatHints: ["comparison-table", "bullets"] },
  { id: "refinancing-and-consolidation", title: "Refinancing & Consolidation (when it helps, when it doesn't)", domainId: "credit-debt", level: "advanced", tags: ["debt", "refinance"], prerequisites: ["debt-snowball-vs-avalanche"], estimatedMinutes: 10, formatHints: ["bullets", "checklist", "scenario"] },
  { id: "paycheck-basics", title: "Your Paycheck: Gross vs Net (and where the money went)", domainId: "income-taxes-benefits", level: "beginner", tags: ["income", "taxes", "paycheck"], prerequisites: [], estimatedMinutes: 9, formatHints: ["diagram", "bullets", "scenario"] },
  { id: "w2-vs-1099", title: "W-2 vs 1099: What changes?", domainId: "income-taxes-benefits", level: "beginner", tags: ["income", "taxes", "w2", "1099"], prerequisites: ["paycheck-basics"], estimatedMinutes: 9, formatHints: ["comparison-table", "bullets"] },
  { id: "tax-brackets-explained", title: "Tax Brackets Explained (common myths)", domainId: "income-taxes-benefits", level: "beginner", tags: ["taxes", "income"], prerequisites: ["paycheck-basics"], estimatedMinutes: 10, formatHints: ["chart", "bullets"] },
  { id: "credits-vs-deductions", title: "Tax Credits vs Deductions", domainId: "income-taxes-benefits", level: "intermediate", tags: ["taxes"], prerequisites: ["tax-brackets-explained"], estimatedMinutes: 8, formatHints: ["comparison-table", "bullets"] },
  { id: "state-taxes-overview", title: "State Taxes Overview (why your state matters)", domainId: "income-taxes-benefits", level: "intermediate", tags: ["taxes", "state-specific"], prerequisites: ["tax-brackets-explained"], estimatedMinutes: 8, formatHints: ["bullets", "chart"] },
  { id: "benefits-overview", title: "Employer Benefits Overview (401k, HSA, FSA, equity)", domainId: "income-taxes-benefits", level: "beginner", tags: ["benefits", "401k", "hsa", "fsa", "equity"], prerequisites: ["paycheck-basics"], estimatedMinutes: 10, formatHints: ["bullets", "checklist"] },
  { id: "hsa-vs-fsa", title: "HSA vs FSA (what's the difference?)", domainId: "income-taxes-benefits", level: "intermediate", tags: ["benefits", "hsa", "fsa", "taxes"], prerequisites: ["benefits-overview"], estimatedMinutes: 9, formatHints: ["comparison-table", "bullets"] },
  { id: "equity-compensation-basics", title: "Equity Compensation Basics (RSUs, options, vesting)", domainId: "income-taxes-benefits", level: "intermediate", tags: ["benefits", "equity", "rsu", "stock-options"], prerequisites: ["benefits-overview"], estimatedMinutes: 12, formatHints: ["diagram", "bullets", "scenario"] },
  { id: "what-is-investing", title: "What Is Investing (and why it's different from saving)?", domainId: "investing-fundamentals", level: "beginner", tags: ["investing", "foundations"], prerequisites: ["compound-growth-basics"], estimatedMinutes: 9, formatHints: ["bullets", "scenario"] },
  { id: "risk-and-return", title: "Risk vs Return (and volatility)", domainId: "investing-fundamentals", level: "beginner", tags: ["investing", "risk"], prerequisites: ["what-is-investing"], estimatedMinutes: 10, formatHints: ["chart", "bullets"] },
  { id: "brokerage-account-basics", title: "Brokerage Accounts (how investing accounts work)", domainId: "investing-fundamentals", level: "beginner", tags: ["investing", "brokerage"], prerequisites: ["what-is-investing"], estimatedMinutes: 9, formatHints: ["bullets", "steps", "checklist"] },
  { id: "stocks-explained", title: "Stocks Explained (what you actually own)", domainId: "investing-fundamentals", level: "beginner", tags: ["investing", "stocks"], prerequisites: ["what-is-investing"], estimatedMinutes: 12, formatHints: ["bullets", "diagram", "scenario"] },
  { id: "etfs-and-index-funds", title: "ETFs & Index Funds (simple diversification)", domainId: "investing-fundamentals", level: "beginner", tags: ["investing", "etf", "index-funds", "diversification"], prerequisites: ["stocks-explained"], estimatedMinutes: 12, formatHints: ["comparison-table", "bullets", "scenario"] },
  { id: "mutual-funds-vs-etfs", title: "Mutual Funds vs ETFs", domainId: "investing-fundamentals", level: "intermediate", tags: ["investing", "mutual-funds", "etf"], prerequisites: ["etfs-and-index-funds"], estimatedMinutes: 10, formatHints: ["comparison-table", "bullets"] },
  { id: "bonds-explained", title: "Bonds Explained (and why they matter)", domainId: "investing-fundamentals", level: "intermediate", tags: ["investing", "bonds", "fixed-income"], prerequisites: ["risk-and-return"], estimatedMinutes: 12, formatHints: ["bullets", "chart", "scenario"] },
  { id: "diversification-and-allocation", title: "Diversification & Asset Allocation", domainId: "investing-fundamentals", level: "intermediate", tags: ["investing", "diversification", "asset-allocation"], prerequisites: ["etfs-and-index-funds", "bonds-explained"], estimatedMinutes: 12, formatHints: ["chart", "bullets", "scenario"] },
  { id: "dollar-cost-averaging", title: "Dollar-Cost Averaging (DCA)", domainId: "investing-fundamentals", level: "intermediate", tags: ["investing", "dca"], prerequisites: ["brokerage-account-basics"], estimatedMinutes: 8, formatHints: ["chart", "bullets"] },
  { id: "401k-basics", title: "401(k) Basics (and employer match)", domainId: "retirement-accounts", level: "beginner", tags: ["retirement", "401k", "benefits"], prerequisites: ["benefits-overview", "etfs-and-index-funds"], estimatedMinutes: 12, formatHints: ["bullets", "scenario", "checklist"] },
  { id: "ira-basics", title: "IRA Basics (Traditional vs Roth)", domainId: "retirement-accounts", level: "beginner", tags: ["retirement", "ira", "roth", "taxes"], prerequisites: ["tax-brackets-explained", "etfs-and-index-funds"], estimatedMinutes: 12, formatHints: ["comparison-table", "bullets", "scenario"] },
  { id: "vesting-and-accounts", title: "Vesting, Contribution Limits, and Rules", domainId: "retirement-accounts", level: "intermediate", tags: ["retirement", "rules"], prerequisites: ["401k-basics", "ira-basics"], estimatedMinutes: 10, formatHints: ["bullets", "checklist"] },
  { id: "retirement-investing-strategy", title: "Retirement Investing Strategy (simple allocations)", domainId: "retirement-accounts", level: "intermediate", tags: ["retirement", "asset-allocation", "investing"], prerequisites: ["diversification-and-allocation", "401k-basics"], estimatedMinutes: 12, formatHints: ["chart", "bullets", "scenario"] },
  { id: "portfolio-rebalancing", title: "Portfolio Rebalancing (when and why)", domainId: "advanced-investing", level: "intermediate", tags: ["investing", "rebalancing", "asset-allocation"], prerequisites: ["diversification-and-allocation"], estimatedMinutes: 10, formatHints: ["steps", "bullets", "scenario"] },
  { id: "tax-efficient-investing", title: "Tax-Efficient Investing (basics)", domainId: "advanced-investing", level: "advanced", tags: ["investing", "taxes", "tax-efficiency"], prerequisites: ["credits-vs-deductions", "portfolio-rebalancing"], estimatedMinutes: 12, formatHints: ["bullets", "comparison-table"] },
  { id: "options-basics", title: "Options Basics (calls, puts, why it's risky)", domainId: "advanced-investing", level: "advanced", tags: ["investing", "options", "risk"], prerequisites: ["stocks-explained", "risk-and-return"], estimatedMinutes: 14, formatHints: ["diagram", "bullets", "scenario"] },
  { id: "options-strategies-intro", title: "Options Strategies Intro (covered calls, protective puts)", domainId: "advanced-investing", level: "advanced", tags: ["investing", "options"], prerequisites: ["options-basics"], estimatedMinutes: 14, formatHints: ["diagram", "bullets", "scenario"] },
  { id: "crypto-basics", title: "Crypto Basics (what it is, risks, how it's different)", domainId: "advanced-investing", level: "advanced", tags: ["investing", "crypto", "risk"], prerequisites: ["what-is-investing", "risk-and-return"], estimatedMinutes: 12, formatHints: ["bullets", "scenario"] },
  { id: "alternative-investments-overview", title: "Alternative Investments Overview (REITs, commodities, private)", domainId: "advanced-investing", level: "advanced", tags: ["investing", "alternatives"], prerequisites: ["diversification-and-allocation"], estimatedMinutes: 10, formatHints: ["bullets", "comparison-table"] },
  { id: "rent-vs-buy", title: "Rent vs Buy (how to think about it)", domainId: "real-estate-property", level: "beginner", tags: ["real-estate", "home"], prerequisites: ["simple-budget-system"], estimatedMinutes: 10, formatHints: ["comparison-table", "scenario", "bullets"] },
  { id: "mortgage-basics", title: "Mortgage Basics (principal, interest, escrow)", domainId: "real-estate-property", level: "beginner", tags: ["real-estate", "mortgage", "home"], prerequisites: ["how-interest-works"], estimatedMinutes: 12, formatHints: ["diagram", "bullets"] },
  { id: "down-payment-and-pmi", title: "Down Payment & PMI (what you'll actually pay)", domainId: "real-estate-property", level: "beginner", tags: ["real-estate", "mortgage", "home"], prerequisites: ["mortgage-basics"], estimatedMinutes: 10, formatHints: ["bullets", "chart", "scenario"] },
  { id: "fixed-vs-arm", title: "Fixed vs Adjustable-Rate Mortgages (ARM)", domainId: "real-estate-property", level: "intermediate", tags: ["real-estate", "mortgage", "risk"], prerequisites: ["mortgage-basics"], estimatedMinutes: 10, formatHints: ["comparison-table", "bullets"] },
  { id: "amortization-explained", title: "Mortgage Amortization (why early payments are mostly interest)", domainId: "real-estate-property", level: "intermediate", tags: ["real-estate", "mortgage", "interest"], prerequisites: ["mortgage-basics"], estimatedMinutes: 12, formatHints: ["chart", "bullets"] },
  { id: "closing-costs-and-fees", title: "Closing Costs & Fees (what to expect)", domainId: "real-estate-property", level: "intermediate", tags: ["real-estate", "home"], prerequisites: ["mortgage-basics"], estimatedMinutes: 9, formatHints: ["bullets", "checklist"] },
  { id: "real-estate-investing-basics", title: "Real Estate Investing Basics (rentals, cash flow, leverage)", domainId: "real-estate-property", level: "advanced", tags: ["real-estate", "investing", "passive-income"], prerequisites: ["rent-vs-buy", "diversification-and-allocation"], estimatedMinutes: 14, formatHints: ["bullets", "scenario", "comparison-table"] },
  { id: "reits-explained", title: "REITs Explained (real estate without owning property)", domainId: "real-estate-property", level: "intermediate", tags: ["real-estate", "investing", "reits"], prerequisites: ["etfs-and-index-funds"], estimatedMinutes: 10, formatHints: ["bullets", "scenario"] },
  { id: "college-starter-pack", title: "College Starter Pack (banking, credit, first budget)", domainId: "life-stage-planning", level: "beginner", tags: ["life-stage", "student", "foundations"], prerequisites: [], estimatedMinutes: 10, formatHints: ["checklist", "bullets"] },
  { id: "first-job-starter-pack", title: "First Job Starter Pack (paycheck, benefits, saving)", domainId: "life-stage-planning", level: "beginner", tags: ["life-stage", "early-career", "income", "benefits"], prerequisites: ["paycheck-basics"], estimatedMinutes: 10, formatHints: ["checklist", "bullets", "scenario"] },
  { id: "mid-career-upgrades", title: "Mid-Career Upgrades (tax strategy, investing, home goals)", domainId: "life-stage-planning", level: "intermediate", tags: ["life-stage", "mid-career", "taxes", "investing", "home"], prerequisites: ["diversification-and-allocation", "credits-vs-deductions"], estimatedMinutes: 12, formatHints: ["checklist", "bullets"] },
  { id: "pre-retirement-basics", title: "Pre-Retirement Basics (withdrawals, Social Security overview)", domainId: "life-stage-planning", level: "intermediate", tags: ["life-stage", "near-retirement", "retirement"], prerequisites: ["retirement-investing-strategy"], estimatedMinutes: 12, formatHints: ["bullets", "scenario"] },
  { id: "money-biases", title: "Money Biases (why smart people make bad money decisions)", domainId: "behavioral-finance", level: "beginner", tags: ["behavior", "foundations"], prerequisites: [], estimatedMinutes: 8, formatHints: ["bullets", "scenario"] },
  { id: "automation-and-habits", title: "Automation & Habits (how to make money decisions easier)", domainId: "behavioral-finance", level: "intermediate", tags: ["behavior", "automation", "budgeting"], prerequisites: ["money-biases", "automating-your-money"], estimatedMinutes: 9, formatHints: ["steps", "checklist"] },
  { id: "tool-compound-growth-simulator", title: "Tool: Compound Growth Simulator", domainId: "tools-simulations", level: "beginner", tags: ["tools", "simulator", "compound-interest"], prerequisites: [], estimatedMinutes: 5, formatHints: ["calculator", "chart"] },
  { id: "tool-paycheck-breakdown", title: "Tool: Paycheck Breakdown", domainId: "tools-simulations", level: "beginner", tags: ["tools", "income", "taxes"], prerequisites: [], estimatedMinutes: 5, formatHints: ["calculator", "diagram"] },
  { id: "tool-budget-builder", title: "Tool: Budget Builder", domainId: "tools-simulations", level: "beginner", tags: ["tools", "budgeting"], prerequisites: [], estimatedMinutes: 5, formatHints: ["calculator", "checklist"] },
  { id: "tool-credit-score-simulator", title: "Tool: Credit Score Simulator", domainId: "tools-simulations", level: "intermediate", tags: ["tools", "credit-score"], prerequisites: ["credit-score-basics"], estimatedMinutes: 6, formatHints: ["chart", "scenario"] },
];

export const CURRICULUM = {
  categories: CATEGORIES,
  lessons: LESSONS,
};

export function getLessonsByDomain(domainId: string): Lesson[] {
  return LESSONS.filter((l) => l.domainId === domainId);
}

export function getLessonById(id: string): Lesson | undefined {
  return LESSONS.find((l) => l.id === id);
}
