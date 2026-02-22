/**
 * Compute persona tags from questionnaire answers for display and debugging.
 * Used by Learning page debug panel and can be extended for scoring.
 */
import type { QuestionnaireAnswers } from "./types";

export type PersonaTag =
  | "Homebuyer"
  | "PreRetirement"
  | "Investor-Intermediate"
  | "Investor-Beginner"
  | "DebtFocus"
  | "EmergencyFundNeeded"
  | "BudgetingFocus"
  | "TaxFocus"
  | "BenefitsFocus"
  | "NotSure";

export function computePersonaTags(answers: QuestionnaireAnswers): PersonaTag[] {
  const tags: PersonaTag[] = [];
  const { goals3to5, goalsThisYear, ageRange, investedBefore, savings, debt, confidence, stressors, benefits } = answers;

  if (goals3to5.includes("home_down_payment")) tags.push("Homebuyer");
  if (ageRange === "35-44" || ageRange === "45+") tags.push("PreRetirement");
  if (investedBefore === "regularly" || (investedBefore === "a-little" && confidence >= 3)) tags.push("Investor-Intermediate");
  if (investedBefore === "never") tags.push("Investor-Beginner");
  if (debt !== "0" && debt !== "<1k") tags.push("DebtFocus");
  if (savings === "0" || savings === "<1k") tags.push("EmergencyFundNeeded");
  if (goalsThisYear.includes("emergency_fund") || stressors.includes("budgeting")) tags.push("BudgetingFocus");
  if (stressors.includes("taxes") || answers.incomeType === "1099" || answers.incomeType === "both") tags.push("TaxFocus");
  if (benefits.some(b => b !== "none")) tags.push("BenefitsFocus");
  if (goals3to5.includes("not_sure") && goalsThisYear.includes("nothing_specific")) tags.push("NotSure");

  return [...new Set(tags)];
}
