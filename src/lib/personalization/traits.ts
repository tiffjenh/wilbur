import type { PersonaId } from "@/personalization/types";

export type Persona = PersonaId | "unknown";

/**
 * NOTE:
 * We keep these traits lightweight and derived from questionnaire-ish fields
 * already present in PersonalizationProfile (or nested answers).
 */
export type ProfileTraits = {
  persona: Persona;

  hasCreditCardDebt: boolean;
  hasStudentLoans: boolean;
  hasEmergencyFund: boolean | null; // null = unknown
  hasNoDebt: boolean;

  lifeStage:
    | "high_school"
    | "college"
    | "early_career"
    | "mid_career"
    | "business_owner"
    | "career_change"
    | "retired"
    | "prefer_not_say"
    | "unknown";

  incomeTypes: Array<
    "w2" | "freelance_1099" | "business_owner" | "investment" | "none" | "other"
  >;

  confidenceLevel: 1 | 2 | 3 | 4 | 5;

  investingExperience:
    | "never"
    | "brokerage_app"
    | "understand_etfs"
    | "actively_trade"
    | "options_advanced"
    | "unknown";

  interests: Set<string>;
};

export type LessonChunkId = "stability" | "income" | "growth";

export type LessonMeta = {
  id: string;
  title: string;
  domain: string;
  chunk: LessonChunkId;
  baseWeight?: number;
  suppressedBy?: Array<(t: ProfileTraits) => boolean>;
};

export type LearningChunk = {
  id: LessonChunkId;
  title: string;
  description: string;
  lessonIds: string[];
};

export type LearningPlan = {
  persona: Persona;
  chunks: LearningChunk[];
  recommendedLessonIds: string[]; // flattened
  lessonReasons: Record<string, string[]>; // explainability hook
};
