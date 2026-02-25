import type { Persona, ProfileTraits } from "./traits";

/**
 * Derives traits from the personalization profile.
 * This is intentionally defensive because different builds store answers differently.
 */
export function toTraits(profile: any): ProfileTraits {
  const persona: Persona = profile?.persona ?? "unknown";

  const answers =
    profile?.answers ??
    profile?.questionnaire ??
    profile?.questionnaireAnswers ??
    profile ??
    {};

  const topics: string[] = answers?.topics ?? answers?.interests ?? [];
  const interests = new Set<string>(topics);

  const lifeStageRaw: string = answers?.lifeStage ?? answers?.stage ?? "unknown";
  const lifeStage =
    lifeStageRaw === "High school student" ? "high_school"
    : lifeStageRaw === "College student" ? "college"
    : lifeStageRaw === "Early career (0–5 years)" ? "early_career"
    : lifeStageRaw === "Mid-career professional" ? "mid_career"
    : lifeStageRaw === "Business owner / self-employed" ? "business_owner"
    : lifeStageRaw === "Exploring career change" ? "career_change"
    : lifeStageRaw === "Retired" ? "retired"
    : lifeStageRaw === "Prefer not to say" ? "prefer_not_say"
    : "unknown";

  const incomeTypesRaw: string[] = answers?.incomeTypes ?? answers?.income ?? [];
  const incomeTypes = (incomeTypesRaw || []).map((x) => {
    if (x === "W-2 job") return "w2";
    if (x === "1099 / freelance") return "freelance_1099";
    if (x === "Business owner") return "business_owner";
    if (x === "Investment income") return "investment";
    if (x === "Not earning income yet") return "none";
    return "other";
  });

  const situation: string[] = answers?.financialSituation ?? answers?.situation ?? [];

  const hasStudentLoans = situation.includes("I have student loans");
  const hasCreditCardDebt = situation.includes("I have credit card debt");
  const hasNoDebt = situation.includes("I have no debt");

  // Current questionnaire only has a positive toggle ("I have an emergency fund")
  // so if it's not selected, we treat as unknown (null).
  const hasEmergencyFund = situation.includes("I have an emergency fund")
    ? true
    : null;

  const confidenceLevel = (answers?.confidenceLevel ?? profile?.confidenceLevel ?? 3) as
    | 1
    | 2
    | 3
    | 4
    | 5;

  const investingExperienceRaw: string =
    answers?.investingExperience ?? profile?.investingExperience ?? "unknown";

  const investingExperience =
    investingExperienceRaw === "I've never invested" ? "never"
    : investingExperienceRaw === "I've used a brokerage app" ? "brokerage_app"
    : investingExperienceRaw === "I understand ETFs and index funds" ? "understand_etfs"
    : investingExperienceRaw === "I actively trade" ? "actively_trade"
    : investingExperienceRaw === "I trade options or advanced strategies" ? "options_advanced"
    : "unknown";

  return {
    persona,
    hasCreditCardDebt,
    hasStudentLoans,
    hasEmergencyFund,
    hasNoDebt,
    lifeStage,
    incomeTypes,
    confidenceLevel,
    investingExperience,
    interests,
  };
}
