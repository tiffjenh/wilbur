/**
 * Optional fixtures for validating personalization output.
 * Use: import { FIXTURE_EARLY_CAREER, FIXTURE_DEBT_FOCUS } from "@/personalization/fixtures"
 *       then getPersonalization(FIXTURE_EARLY_CAREER) and assert on result.
 */
import type { QuestionnaireAnswers } from "./types";

/** Early career, student loans, low investing experience */
export const FIXTURE_EARLY_CAREER: QuestionnaireAnswers = {
  learningMode: "tailored",
  topicsInterestedIn: ["Investing basics", "Retirement (401k, IRA)", "Stocks & ETFs"],
  lifeStage: "early_career",
  incomeType: ["w2"],
  incomeRange: "50_100",
  financialSituation: ["student_loans", "emergency_fund", "never_invested"],
  confidence: 3,
  investingExperience: "never",
  primaryGoal: "start_investing",
};

/** College student, no income, high curiosity */
export const FIXTURE_COLLEGE_CURIOUS: QuestionnaireAnswers = {
  learningMode: "tailored",
  topicsInterestedIn: ["Budgeting & saving", "Credit & debt", "Investing basics", "I want to learn about everything"],
  lifeStage: "college",
  incomeType: ["none_yet"],
  incomeRange: "under_25",
  financialSituation: ["no_debt", "never_invested"],
  confidence: 2,
  investingExperience: "never",
  primaryGoal: "not_sure",
};

/** Mid-career, stable, wants to grow investments */
export const FIXTURE_GROWTH_ORIENTED: QuestionnaireAnswers = {
  learningMode: "tailored",
  topicsInterestedIn: ["Stocks & ETFs", "Investing basics", "Retirement (401k, IRA)"],
  lifeStage: "mid_career",
  incomeType: ["w2"],
  incomeRange: "100_200",
  financialSituation: ["emergency_fund", "invest_regularly", "own_property"],
  confidence: 4,
  investingExperience: "understand_etfs",
  primaryGoal: "grow_faster",
};

/** Debt focus: credit card + student loans */
export const FIXTURE_DEBT_FOCUS: QuestionnaireAnswers = {
  learningMode: "tailored",
  topicsInterestedIn: ["Credit & debt", "Budgeting & saving"],
  lifeStage: "early_career",
  incomeType: ["w2"],
  incomeRange: "25_50",
  financialSituation: ["student_loans", "credit_card_debt", "never_invested"],
  confidence: 1,
  investingExperience: "never",
  primaryGoal: "pay_off_debt",
};

/** Explore mode: still computes scores, no gating/ordering applied in UI */
export const FIXTURE_EXPLORE_MODE: QuestionnaireAnswers = {
  ...FIXTURE_EARLY_CAREER,
  learningMode: "explore",
};
