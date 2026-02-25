import type { LessonMeta } from "./traits";

export const LESSON_META: Record<string, LessonMeta> = {
  "adult-money-game-plan": {
    id: "adult-money-game-plan",
    title: "Your Simple Money Game Plan (What to Do First)",
    domain: "moneyFoundations",
    chunk: "stability",
    baseWeight: 100,
  },
  "budgeting-in-10-minutes": {
    id: "budgeting-in-10-minutes",
    title: "Budgeting in 10 Minutes (A Simple System That Works)",
    domain: "budgetingCashFlow",
    chunk: "stability",
    baseWeight: 90,
  },
  "emergency-fund-basics": {
    id: "emergency-fund-basics",
    title: "Emergency Fund Basics",
    domain: "moneyFoundations",
    chunk: "stability",
    baseWeight: 80,
  },
  "credit-cards-statement-balance": {
    id: "credit-cards-statement-balance",
    title: "Credit Cards: Statement Balance vs Minimum Payment",
    domain: "creditDebt",
    chunk: "stability",
    baseWeight: 85,
  },
  "paycheck-basics": {
    id: "paycheck-basics",
    title: "Your Paycheck Explained (W-2, Withholding, Take-Home Pay)",
    domain: "taxes",
    chunk: "income",
    baseWeight: 70,
    suppressedBy: [(t) => t.incomeTypes.includes("none")],
  },
  "work-benefits-101": {
    id: "work-benefits-101",
    title: "Work Benefits 101 (401k, Match, HSA/FSA)",
    domain: "workBenefitsRetirement",
    chunk: "income",
    baseWeight: 60,
    suppressedBy: [(t) => !t.incomeTypes.includes("w2")],
  },
  "investing-basics-no-stock-picking": {
    id: "investing-basics-no-stock-picking",
    title: "Investing Basics (Without Stock-Picking)",
    domain: "investingBasics",
    chunk: "growth",
    baseWeight: 50,
  },
};
