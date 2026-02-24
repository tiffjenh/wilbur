import type { DomainId, DomainVisibility } from "@/content/domains";

export const PERSONALIZATION_VERSION = "v1" as const;

export type LearningMode = "tailored" | "explore";

export type QuestionnaireAnswers = {
  learningMode: LearningMode;

  /**
   * Keep as raw UI labels for now; v1 scoring uses lightweight string matching only.
   * Later we can normalize to enums.
   */
  topicsInterestedIn: string[];

  lifeStage:
    | "high_school"
    | "college"
    | "early_career"
    | "mid_career"
    | "self_employed"
    | "career_change"
    | "retired"
    | "prefer_not";

  incomeType: Array<"w2" | "1099" | "business_owner" | "investment_income" | "none_yet" | "other">;

  incomeRange: "under_25" | "25_50" | "50_100" | "100_200" | "200_plus" | "prefer_not";

  financialSituation: Array<
    | "student_loans"
    | "credit_card_debt"
    | "no_debt"
    | "emergency_fund"
    | "invest_regularly"
    | "never_invested"
    | "own_property"
    | "want_buy_home"
  >;

  confidence: 1 | 2 | 3 | 4 | 5;

  investingExperience: "never" | "brokerage_app" | "understand_etfs" | "actively_trade" | "options";

  primaryGoal:
    | "build_savings"
    | "pay_off_debt"
    | "start_investing"
    | "grow_faster"
    | "save_for_home"
    | "passive_income"
    | "retire_early"
    | "not_sure";

  state?: string;
};

export type ScoreDimensions = {
  lifeStage: number; // 0-5
  incomeStability: number; // 0-5
  resourceLevel: number; // 0-5
  debtUrgency: number; // 0-5
  emergencyPreparedness: number; // 0-5
  investmentReadiness: number; // 0-5
  confidence: number; // 0-5
};

export type DerivedTiers = {
  investmentReadinessTier: "new" | "beginner" | "beginner_plus" | "ready_deep_dives";
  debtUrgencyTier: "low" | "medium" | "high";
  stabilityTier: "unstable" | "somewhat_stable" | "stable";
};

export type PersonaId =
  | "student_starter"
  | "early_career_builder"
  | "debt_stabilizer"
  | "independent_earner"
  | "growth_oriented_builder"
  | "home_buyer_planner"
  | "catch_up_builder"
  | "benefits_confused_professional";

export type PriorityArea =
  | "stabilize"
  | "high_interest_debt"
  | "student_loans"
  | "work_benefits"
  | "investing_basics"
  | "stocks_deep_dive"
  | "crypto"
  | "real_estate_home_buying"
  | "short_term_rentals"
  | "taxes"
  | "insurance"
  | "side_income";

export type PriorityScores = Record<PriorityArea, number>;

export type GatingFlags = {
  unlockStocksDeepDive: boolean;
  unlockCrypto: boolean;
  unlockSTR: boolean;
  unlockAdvancedInvesting: boolean;
};

export type DomainVisibilityMap = Record<DomainId, DomainVisibility>;

export type SummaryPayload = {
  personaTitle: string;
  personaOneLiner: string;
  whatThisMeans: string[];
  topPrioritiesCopy: Array<{ area: PriorityArea; title: string; description: string }>;
  recommendedDomainsOrdered: DomainId[];
  exploreLaterDomains: DomainId[];
  recapBullets: string[];
};

export type PersonalizationResult = {
  version: "v1";
  learningMode: LearningMode;

  rawAnswers: QuestionnaireAnswers;

  scores: ScoreDimensions;
  tiers: DerivedTiers;

  persona: PersonaId;

  priorityScores: PriorityScores;
  topPriorities: PriorityArea[];

  domainVisibility: DomainVisibilityMap;
  gating: GatingFlags;

  summary: SummaryPayload;
};
