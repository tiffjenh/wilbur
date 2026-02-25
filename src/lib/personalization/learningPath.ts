/**
 * Deterministic, persona-based learning path ordering.
 * Returns an ordered list of lesson IDs only. Filter by LESSON_REGISTRY defensively.
 */
import type { PersonaId } from "@/personalization/types";
import { LESSON_REGISTRY } from "@/lib/stubData";

export type UserProfile = {
  persona: PersonaId;
};

const DEBT_STABILIZER_PATH = [
  "adult-money-game-plan",
  "budgeting-in-10-minutes",
  "emergency-fund-basics",
  "credit-cards-statement-balance",
  "paycheck-basics",
  "work-benefits-101",
  "investing-basics-no-stock-picking",
];

const DEFAULT_PATH: string[] = [];

export function buildLearningPath(profile: UserProfile): string[] {
  switch (profile.persona) {
    case "debt_stabilizer":
      return DEBT_STABILIZER_PATH.filter((id) => LESSON_REGISTRY[id]);
    default:
      return DEFAULT_PATH.filter((id) => LESSON_REGISTRY[id]);
  }
}
