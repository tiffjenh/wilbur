import type { Persona } from "./traits";

export const PERSONA_BASELINE: Record<string, string[]> = {
  debt_stabilizer: [
    "adult-money-game-plan",
    "budgeting-in-10-minutes",
    "emergency-fund-basics",
    "credit-cards-statement-balance",
    "paycheck-basics",
    "work-benefits-101",
    "investing-basics-no-stock-picking",
  ],

  early_career_builder: [
    "adult-money-game-plan",
    "paycheck-basics",
    "work-benefits-101",
    "budgeting-in-10-minutes",
    "emergency-fund-basics",
    "investing-basics-no-stock-picking",
    "credit-cards-statement-balance",
  ],

  explorer: [
    "adult-money-game-plan",
    "budgeting-in-10-minutes",
    "paycheck-basics",
    "work-benefits-101",
    "investing-basics-no-stock-picking",
    "emergency-fund-basics",
    "credit-cards-statement-balance",
  ],

  unknown: [
    "adult-money-game-plan",
    "budgeting-in-10-minutes",
    "emergency-fund-basics",
    "credit-cards-statement-balance",
    "paycheck-basics",
    "work-benefits-101",
    "investing-basics-no-stock-picking",
  ],
};

export function getPersonaBaseline(persona: Persona): string[] {
  const key = (persona ?? "unknown") as string;
  return PERSONA_BASELINE[key] ?? PERSONA_BASELINE.unknown;
}
