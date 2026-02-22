export type AgeRange = "under-18" | "18-22" | "23-27" | "28-34" | "35-44" | "45+";
export type WorkStatus = "school" | "working" | "both" | "neither";
export type IncomeType = "w2" | "1099" | "both" | "none";
export type InvestedBefore = "never" | "a-little" | "regularly";

export type SavingsRange = "0" | "<1k" | "1k-5k" | "5k-20k" | "20k+";
export type DebtRange = "0" | "<1k" | "1k-10k" | "10k-50k" | "50k+";

export type Benefit =
  | "401k"
  | "hsa"
  | "fsa"
  | "equity_comp" // stock options / RSUs
  | "none";

export type GoalThisYear =
  | "emergency_fund"
  | "pay_off_debt"
  | "start_investing"
  | "buy_car"
  | "travel"
  | "nothing_specific";

export type Goal3to5 =
  | "home_down_payment"
  | "buy_car"
  | "start_business"
  | "build_investments"
  | "pay_off_debt"
  | "emergency_fund"
  | "not_sure";

export type Stressor =
  | "investing"
  | "taxes"
  | "credit_cards"
  | "budgeting"
  | "retirement"
  | "everything";

export type QuestionnaireAnswers = {
  ageRange: AgeRange;
  workStatus: WorkStatus;
  incomeType: IncomeType;
  annualIncome: "under-15k" | "15-30k" | "30-60k" | "60-100k" | "100-200k" | "200k+";
  savings: SavingsRange;
  debt: DebtRange;
  benefits: Benefit[];
  investedBefore: InvestedBefore;
  goalsThisYear: GoalThisYear[];
  goals3to5: Goal3to5[];
  stressors: Stressor[];
  confidence: 1 | 2 | 3 | 4 | 5;
  stateCode: string; // e.g. "CA"
};

export type LessonLevel = "level-1" | "level-2" | "level-3" | "level-4" | "level-5";

export type LessonSourceType = "government" | "regulator" | "state-government" | "reputable-explainer";

export type LessonSource = {
  name: string;
  url: string;
  type: LessonSourceType;
  lastReviewed: string; // ISO date
};

export type LessonTag =
  | "money-basics"
  | "budgeting"
  | "cashflow"
  | "emergency-fund"
  | "debt"
  | "credit"
  | "student-loans"
  | "investing-basics"
  | "retirement"
  | "benefits"
  | "taxes-federal"
  | "taxes-state"
  | "irregular-income"
  | "home-buying"
  | "car-buying"
  | "insurance"
  | "fraud-protection"
  | "advanced-investing"
  | "equity-comp"
  | "crypto"
  | "real-estate"
  | "systems-habits"
  | "visual-heavy"
  | LessonLevel;

export type Lesson = {
  id: string;
  title: string;
  description?: string;
  level: LessonLevel;
  tags: LessonTag[];
  estimatedTimeMin: number;
  sources: LessonSource[];
  // blocks live elsewhere; not needed for scoring
};

export type LessonFeedback = "more_like_this" | "not_relevant" | "already_know_this";

/** Lesson enriched with scoring debug info (returned by generateLearningPath) */
export type ScoredLesson = Lesson & {
  _score: number;
  _reasons: string[];
};
