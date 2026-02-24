/**
 * Step 4: Summary Engine — personalization entry point.
 * Takes questionnaire answers and returns a deterministic PersonalizationResult (v1).
 */
import type { PersonalizationResult, QuestionnaireAnswers } from "./types";
import {
  scoreAnswers,
  deriveTiers,
  pickPersona,
  scorePriorities,
  topN,
  computeGating,
  computeDomainVisibility,
} from "./scoring";
import { buildSummary } from "./summary";

export type { QuestionnaireAnswers, PersonalizationResult } from "./types";
export {
  scoreAnswers,
  deriveTiers,
  pickPersona,
  scorePriorities,
  topN,
  computeGating,
  computeDomainVisibility,
  getRecommendedDomainsOrdered,
  getExploreLaterDomains,
  PRIORITY_AREA_TO_DOMAIN,
  PRIORITY_ORDER,
} from "./scoring";
export { buildSummary } from "./summary";
export type { SummaryPayload } from "./types";
export {
  FIXTURE_EARLY_CAREER,
  FIXTURE_COLLEGE_CURIOUS,
  FIXTURE_GROWTH_ORIENTED,
  FIXTURE_DEBT_FOCUS,
  FIXTURE_EXPLORE_MODE,
} from "./fixtures";
export type {
  ScoreDimensions,
  DerivedTiers,
  PersonaId,
  PriorityArea,
  PriorityScores,
  GatingFlags,
  DomainVisibilityMap,
  LearningMode,
} from "./types";

/**
 * Run full personalization: scores, tiers, persona, priorities, gating,
 * domain visibility, and summary payload. Deterministic and versioned (v1).
 */
export function getPersonalization(answers: QuestionnaireAnswers): PersonalizationResult {
  const scores = scoreAnswers(answers);
  const tiers = deriveTiers(scores);
  const persona = pickPersona(answers, scores);
  const priorityScores = scorePriorities(answers, scores);
  const topPriorities = topN(priorityScores, 3);
  const gating = computeGating(scores);
  const domainVisibility = computeDomainVisibility(answers, scores, gating);

  const base: Omit<PersonalizationResult, "summary"> = {
    version: "v1",
    learningMode: answers.learningMode,
    rawAnswers: answers,
    scores,
    tiers,
    persona,
    priorityScores,
    topPriorities,
    domainVisibility,
    gating,
  };

  return {
    ...base,
    summary: buildSummary(base),
  };
}
