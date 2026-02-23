/**
 * Simple assertions for Learning Path recommendation logic.
 * Run with: npx vitest run src/lib/recommendation/recommendation.test.ts
 * (Requires: npm i -D vitest)
 *
 * Or run manually in browser console after importing:
 *   import { assertAdvancedPersonaPath } from '@/lib/recommendation/recommendation.test';
 *   assertAdvancedPersonaPath();
 */
import { describe, it, expect } from "vitest";
import type { QuestionnaireAnswers } from "./types";
import { generateLearningPath } from "./generatePath";
import { getLearningTier } from "./scoring";
import { LESSON_CATALOG } from "@/content/lessons/lessonCatalog";

/** Persona A: 32, W2, ~$100K, $0 debt, invests a lot, confidence 4, goal: home down payment */
const PERSONA_A: QuestionnaireAnswers = {
  ageRange: "28-34",
  workStatus: "working",
  incomeType: "w2",
  annualIncome: "60-100k",
  savings: "20k+",
  debt: "0",
  benefits: ["401k"],
  investedBefore: "regularly",
  goalsThisYear: ["start_investing"],
  goals3to5: ["home_down_payment"],
  stressors: [],
  confidence: 4,
  stateCode: "",
};

describe("Learning Path recommendation", () => {
  it("computes advanced tier for Persona A (32, W2, $100K, no debt, invest a lot, confidence 4, home goal)", () => {
    const tier = getLearningTier(PERSONA_A);
    expect(tier).toBe("advanced");
  });

  it("Persona A path must NOT include Budgeting 101 or Investing 101", () => {
    const path = generateLearningPath(LESSON_CATALOG, PERSONA_A, { maxLessons: 8 });
    const ids = path.map((l) => l.id);
    const titles = path.map((l) => l.title);

    // No beginner-only stability lessons as top recommendations
    const budgetingLike = ids.filter(
      (id) =>
        id === "starter-budget" ||
        id === "budget-styles" ||
        titles.some((t) => t.toLowerCase().includes("budgeting 101") || t.toLowerCase().includes("10-minute starter budget")),
    );
    expect(budgetingLike.length).toBe(0);

    const investing101 = ids.filter((id) => id === "investing-101");
    expect(investing101.length).toBe(0);
  });

  it("Persona A path must include home-buying and real-estate / advanced-investing content", () => {
    const path = generateLearningPath(LESSON_CATALOG, PERSONA_A, { maxLessons: 8 });
    const hasHomeBuying = path.some((l) => l.tags.includes("home-buying"));
    const hasRealEstateOrAdvanced = path.some(
      (l) => l.tags.includes("real-estate") || l.tags.includes("advanced-investing"),
    );
    expect(hasHomeBuying).toBe(true);
    expect(hasRealEstateOrAdvanced).toBe(true);
  });
});
