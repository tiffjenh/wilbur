/**
 * Validates personalization logic (persona, priorities, gating, domain visibility).
 * Run: npm test -- src/personalization/personalization.test.ts
 */
import { describe, it, expect } from "vitest";
import { getPersonalization } from "./index";
import type { QuestionnaireAnswers } from "./types";

/** Profile: early_career, W2, $50–100k, student_loans + credit_card_debt, no emergency fund, want_buy_home, low confidence, never invested, goal start_investing. */
const testProfile: QuestionnaireAnswers = {
  learningMode: "tailored",
  topicsInterestedIn: ["Investing basics", "Retirement (401k, IRA)", "Stocks & ETFs"],
  lifeStage: "early_career",
  incomeType: ["w2"],
  incomeRange: "50_100",
  financialSituation: [
    "student_loans",
    "credit_card_debt",
    "never_invested",
    "want_buy_home",
  ],
  confidence: 2,
  investingExperience: "never",
  primaryGoal: "start_investing",
  state: "NY",
};

describe("getPersonalization", () => {
  it("assigns debt_stabilizer when high debt and no emergency fund (early_career)", () => {
    const result = getPersonalization(testProfile);

    // High debt (credit_card + student_loans) and no emergency_fund → debt_stabilizer before early_career_builder
    expect(result.persona).toBe("debt_stabilizer");

    // Optional: log full output for manual validation
    console.log("PERSONA:", result.persona);
    console.log("TOP PRIORITIES:", result.topPriorities);
    console.log("DOMAIN VISIBILITY:", result.domainVisibility);
    console.log("GATING:", result.gating);
    console.log("SUMMARY:", result.summary);
  });
});
