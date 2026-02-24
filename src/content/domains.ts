/**
 * Wilbur v1 Canonical Domains
 * - Stable contract for scoring, gating, personalization, and progress tracking.
 * - Lessons can change freely under each domain without breaking scoring.
 *
 * Cursor instructions:
 * 1) Create a new file: src/content/domains.ts
 * 2) Paste this entire file.
 */

export const WILBUR_DOMAIN_VERSION = "v1" as const;

/** Domain visibility states produced by the questionnaire scoring engine */
export type DomainVisibility = "required" | "recommended" | "optional" | "suppressed" | "locked";

/** Canonical domain IDs (treat as enums / stable keys) */
export const WILBUR_DOMAINS = [
  "moneyFoundations",
  "budgetingCashFlow",
  "creditDebt",
  "studentLoans",
  "workBenefitsRetirement",
  "investingBasics",
  "stocksDeepDive",
  "advancedInvesting",
  "cryptocurrency",
  "realEstateHomeBuying",
  "shortTermRentals",
  "taxes",
  "insuranceRisk",
  "sideIncomeEntrepreneurship",
  "stateGuides",
] as const;

export type DomainId = (typeof WILBUR_DOMAINS)[number];

export type DomainMeta = {
  id: DomainId;
  title: string;
  shortTitle?: string; // for chips / compact UI
  description: string;
  /** Domains that should generally be completed before this one is strongly recommended */
  prerequisites?: DomainId[];
  /** Whether this domain is typically gated behind readiness */
  isGated?: boolean;
};

export const DOMAIN_META: Record<DomainId, DomainMeta> = {
  moneyFoundations: {
    id: "moneyFoundations",
    title: "Money Foundations",
    shortTitle: "Foundations",
    description: "The basics of how money works day-to-day: accounts, interest, emergency funds, and simple mental models.",
  },
  budgetingCashFlow: {
    id: "budgetingCashFlow",
    title: "Budgeting & Cash Flow",
    shortTitle: "Budgeting",
    description: "Simple systems to plan spending, avoid surprises, and build consistent saving habits.",
    prerequisites: ["moneyFoundations"],
  },
  creditDebt: {
    id: "creditDebt",
    title: "Credit & Debt",
    shortTitle: "Debt",
    description: "Credit cards, interest, credit score basics, and practical ways to manage and pay down debt (education-only).",
    prerequisites: ["moneyFoundations"],
  },
  studentLoans: {
    id: "studentLoans",
    title: "Student Loans",
    shortTitle: "Student Loans",
    description: "Federal vs private loans, repayment concepts, and how to think about priorities (education-only).",
    prerequisites: ["moneyFoundations", "creditDebt"],
  },
  workBenefitsRetirement: {
    id: "workBenefitsRetirement",
    title: "Work Benefits & Retirement Accounts",
    shortTitle: "Benefits",
    description: "401(k), IRA, employer match, HSA/FSA—explained simply for first-time corporate jobs.",
    prerequisites: ["moneyFoundations"],
  },
  investingBasics: {
    id: "investingBasics",
    title: "Investing Basics",
    shortTitle: "Investing",
    description: "What investing is, risk explained clearly, and the building blocks (stocks, bonds, ETFs, index funds).",
    prerequisites: ["moneyFoundations", "budgetingCashFlow"],
  },
  stocksDeepDive: {
    id: "stocksDeepDive",
    title: "Stocks Deep Dive",
    shortTitle: "Stocks",
    description: "How stocks work in practice: prices, charts, key metrics, and common pitfalls (education-only).",
    prerequisites: ["investingBasics"],
    isGated: true,
  },
  advancedInvesting: {
    id: "advancedInvesting",
    title: "Advanced Investing",
    shortTitle: "Advanced",
    description: "Higher complexity topics (options, leverage, trading realities) with strong risk framing (education-only).",
    prerequisites: ["stocksDeepDive"],
    isGated: true,
  },
  cryptocurrency: {
    id: "cryptocurrency",
    title: "Cryptocurrency",
    shortTitle: "Crypto",
    description: "What crypto is, wallets, volatility, scams, and how to evaluate risk (education-only).",
    prerequisites: ["investingBasics"],
    isGated: true,
  },
  realEstateHomeBuying: {
    id: "realEstateHomeBuying",
    title: "Real Estate & Home Buying",
    shortTitle: "Home",
    description: "Mortgages, down payments, closing costs, property taxes, and renting vs buying (education-only).",
    prerequisites: ["moneyFoundations", "budgetingCashFlow"],
  },
  shortTermRentals: {
    id: "shortTermRentals",
    title: "Short-Term Rentals (Airbnb/VRBO)",
    shortTitle: "STR",
    description: "STR unit economics, seasonality, costs, risks, and rules—business-style education (not advice).",
    prerequisites: ["realEstateHomeBuying", "investingBasics"],
    isGated: true,
  },
  taxes: {
    id: "taxes",
    title: "Taxes",
    shortTitle: "Taxes",
    description: "Paychecks, brackets (simple), W-2 vs 1099 basics, capital gains concepts, and what varies by state.",
    prerequisites: ["moneyFoundations"],
  },
  insuranceRisk: {
    id: "insuranceRisk",
    title: "Insurance & Risk",
    shortTitle: "Insurance",
    description: "Health/renters/auto basics and how deductibles/premiums work (beginner-friendly).",
    prerequisites: ["moneyFoundations"],
  },
  sideIncomeEntrepreneurship: {
    id: "sideIncomeEntrepreneurship",
    title: "Side Income / Entrepreneurship",
    shortTitle: "Side Income",
    description: "Freelancing basics, separating personal vs business money, and core tax concepts for 1099 work.",
    prerequisites: ["moneyFoundations", "taxes"],
  },
  stateGuides: {
    id: "stateGuides",
    title: "State-Specific Guides",
    shortTitle: "States",
    description: "State-by-state financial context: income tax overview, property tax basics, and programs (high-level).",
    prerequisites: ["taxes", "realEstateHomeBuying"],
  },
};

/**
 * Default visibility (safe baseline) if scoring is unavailable.
 * Tailored mode should overwrite this with computed visibilities.
 */
export const DEFAULT_DOMAIN_VISIBILITY: Record<DomainId, DomainVisibility> = {
  moneyFoundations: "required",
  budgetingCashFlow: "recommended",
  creditDebt: "recommended",
  studentLoans: "optional",
  workBenefitsRetirement: "optional",
  investingBasics: "recommended",
  stocksDeepDive: "suppressed",
  advancedInvesting: "locked",
  cryptocurrency: "suppressed",
  realEstateHomeBuying: "optional",
  shortTermRentals: "locked",
  taxes: "optional",
  insuranceRisk: "optional",
  sideIncomeEntrepreneurship: "optional",
  stateGuides: "optional",
};

/**
 * Helper: returns domains in a consistent, user-friendly order (not alphabetical).
 * Useful for dashboards, progress trackers, and library sections.
 */
export const DOMAIN_DISPLAY_ORDER: DomainId[] = [
  "moneyFoundations",
  "budgetingCashFlow",
  "creditDebt",
  "studentLoans",
  "workBenefitsRetirement",
  "taxes",
  "insuranceRisk",
  "investingBasics",
  "stocksDeepDive",
  "advancedInvesting",
  "cryptocurrency",
  "realEstateHomeBuying",
  "shortTermRentals",
  "sideIncomeEntrepreneurship",
  "stateGuides",
];

/** Type guard */
export function isDomainId(x: string): x is DomainId {
  return (WILBUR_DOMAINS as readonly string[]).includes(x);
}
