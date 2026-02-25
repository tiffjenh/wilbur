/**
 * Step 8: Content production — recommend profiles for new V1 lessons.
 * A) College/early career with student loans, never invested, low confidence → student-loans-basics in list with triggering reason.
 * B) Freelancer 1099 with side income, medium confidence → w2-vs-1099, taxes-how-to-file, write-offs-explained in list with triggering reasons.
 */
import { describe, it, expect } from "vitest";
import { recommendPlan, type RecommendProfile } from "../recommend";
import { LESSON_REGISTRY } from "@/lib/stubData";

function makeProfile(overrides: Record<string, unknown>): RecommendProfile {
  return {
    persona: "unknown",
    questionnaireAnswers: {
      lifeStage: "Early career (0–5 years)",
      incomeTypes: ["W-2 job"],
      financialSituation: [],
      confidenceLevel: 3,
      investingExperience: "I've never invested",
      topicsInterestedIn: [],
      ...overrides,
    },
    ...overrides,
  } as unknown as RecommendProfile;
}

describe("Step 8 — Recommend profiles (new V1 lessons)", () => {
  it("A) College/early career with student loans, never invested, low confidence — student-loans-basics appears with reason", () => {
    const profile = makeProfile({
      persona: "debt_stabilizer",
      questionnaireAnswers: {
        lifeStage: "Early career (0–5 years)",
        incomeTypes: ["W-2 job"],
        financialSituation: ["I have student loans"],
        confidenceLevel: 1,
        investingExperience: "I've never invested",
        topicsInterestedIn: ["Budgeting & saving", "Credit & debt"],
      },
    });
    const { recommendedLessonIds, lessonReasons } = recommendPlan(profile);

    expect(recommendedLessonIds).toContain("student-loans-basics");
    const reasons = lessonReasons["student-loans-basics"] ?? [];
    expect(reasons.length).toBeGreaterThanOrEqual(1);
    expect(reasons.some((r) => r.toLowerCase().includes("student loan"))).toBe(true);

    for (const id of recommendedLessonIds) {
      expect(LESSON_REGISTRY[id], `expected ${id} to exist in LESSON_REGISTRY`).toBeDefined();
    }
  });

  it("B) Freelancer 1099 with side income, medium confidence — w2-vs-1099, taxes-how-to-file, write-offs-explained appear with reasons", () => {
    const profile = makeProfile({
      persona: "early_career_builder",
      questionnaireAnswers: {
        lifeStage: "Early career (0–5 years)",
        incomeTypes: ["1099 / freelance"],
        financialSituation: [],
        confidenceLevel: 3,
        investingExperience: "I've never invested",
        topicsInterestedIn: ["Investing basics"],
      },
    });
    const { recommendedLessonIds, lessonReasons } = recommendPlan(profile);

    expect(recommendedLessonIds).toContain("w2-vs-1099");
    expect(recommendedLessonIds).toContain("taxes-how-to-file");
    expect(recommendedLessonIds).toContain("write-offs-explained");

    const w2Reasons = lessonReasons["w2-vs-1099"] ?? [];
    expect(w2Reasons.some((r) => r.toLowerCase().includes("1099") || r.toLowerCase().includes("business"))).toBe(true);

    const taxesReasons = lessonReasons["taxes-how-to-file"] ?? [];
    expect(taxesReasons.length).toBeGreaterThanOrEqual(1);

    const writeOffReasons = lessonReasons["write-offs-explained"] ?? [];
    expect(writeOffReasons.some((r) => r.toLowerCase().includes("1099") || r.toLowerCase().includes("business"))).toBe(true);

    for (const id of recommendedLessonIds) {
      expect(LESSON_REGISTRY[id], `expected ${id} to exist in LESSON_REGISTRY`).toBeDefined();
    }
  });
});
