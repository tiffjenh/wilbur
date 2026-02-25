/**
 * Step 5: Validates flagship track (debt stabilizer) via recommendPlan.
 * Run: npm test -- src/lib/personalization/__tests__/step5FlagshipTrack.test.ts
 */
import { describe, it, expect } from "vitest";
import { getPersonalization } from "@/personalization/index";
import { FIXTURE_DEBT_FOCUS } from "@/personalization/fixtures";
import { recommendPlan, type RecommendProfile } from "../recommend";
import { LESSON_REGISTRY } from "@/lib/stubData";

const DEBT_STABILIZER_EXPECTED_ORDER = [
  "adult-money-game-plan",
  "budgeting-in-10-minutes",
  "emergency-fund-basics",
  "credit-cards-statement-balance",
  "paycheck-basics",
  "work-benefits-101",
  "taxes-how-to-file",
  "investing-basics-no-stock-picking",
];

describe("Step 5: Flagship track (debt stabilizer)", () => {
  it("builds profile, gets persona, runs recommendPlan, and asserts plan shape and reasons", () => {
    // 1) Build profile representing debt stabilizer (credit card debt, low confidence, W-2 income)
    const answers = FIXTURE_DEBT_FOCUS; // credit_card_debt, confidence: 1, incomeType: ["w2"]

    // 2) Run existing scoring/persona to get persona
    const personalizationResult = getPersonalization(answers);
    expect(personalizationResult.persona).toBe("debt_stabilizer");

    // 3) Run recommendPlan (hybrid engine) with a profile that has persona + answers for toTraits.
    // toTraits expects UI-style fields; incomeTypes raw values like "W-2 job" map to "w2" so work-benefits-101 is not suppressed.
    const profile = {
      persona: personalizationResult.persona,
      questionnaireAnswers: {
        ...answers,
        incomeTypes: ["W-2 job"],
        financialSituation: ["I have credit card debt"],
        confidenceLevel: 1,
      },
    } as unknown as RecommendProfile;
    const { recommendedLessonIds, plan, lessonReasons } = recommendPlan(profile);

    // 4) Assert plan.chunks.length === 3
    expect(plan.chunks.length).toBe(3);

    // 4) Assert plan.recommendedLessonIds equals expected ordered array
    expect(plan.recommendedLessonIds).toEqual(DEBT_STABILIZER_EXPECTED_ORDER);
    expect(recommendedLessonIds).toEqual(DEBT_STABILIZER_EXPECTED_ORDER);

    // 4) Every recommendedLessonId exists in LESSON_REGISTRY
    for (const id of plan.recommendedLessonIds) {
      expect(LESSON_REGISTRY[id], `expected ${id} to exist in LESSON_REGISTRY`).toBeDefined();
    }

    // 4) getReasons() returns at least one reason for adult-money-game-plan and credit-cards-statement-balance
    const getReasons = (lessonId: string) => lessonReasons[lessonId] ?? [];
    const getTopReason = (lessonId: string) => (lessonReasons[lessonId]?.[0] ?? null);

    expect(getReasons("adult-money-game-plan").length).toBeGreaterThanOrEqual(1);
    expect(getReasons("credit-cards-statement-balance").length).toBeGreaterThanOrEqual(1);
    expect(getTopReason("adult-money-game-plan")).not.toBeNull();
    expect(getTopReason("credit-cards-statement-balance")).not.toBeNull();
  });
});
