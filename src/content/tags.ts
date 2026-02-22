/**
 * Canonical tag taxonomy for the Wilbur lesson system.
 * Every lesson must use only these tags.
 */

/* ── Core Category Tags ─────────────────────────────────── */
export const CORE_TAGS = [
  "money-basics",
  "budgeting",
  "cashflow",
  "emergency-fund",
  "debt",
  "credit",
  "student-loans",
  "investing-basics",
  "retirement",
  "benefits",
  "taxes-federal",
  "taxes-state",
  "irregular-income",
  "home-buying",
  "car-buying",
  "insurance",
  "fraud-protection",
  "advanced-investing",
  "equity-comp",
  "crypto",
  "real-estate",
  "systems-habits",
] as const;

/* ── User Condition Tags (derived from questionnaire answers) ── */
export const CONDITION_TAGS = [
  "has-debt",
  "no-savings",
  "low-savings",
  "has-benefits",
  "has-401k",
  "has-hsa",
  "has-fsa",
  "has-equity-comp",
  "w2-income",
  "1099-income",
  "no-income",
  "student",
  "working",
  "confidence-low",
  "confidence-mid",
  "confidence-high",
  "goal-home",
  "goal-investing",
  "goal-debt",
  "goal-emergency",
  "goal-car",
  "goal-business",
  "state-income-tax",
  "state-no-income-tax",
] as const;

/* ── Difficulty Tags ─────────────────────────────────────── */
export const DIFFICULTY_TAGS = [
  "level-1",  // Foundations
  "level-2",  // Real Life Setup
  "level-3",  // Growth
  "level-4",  // Optimization
  "level-5",  // Advanced
] as const;

/* ── Format Tags ─────────────────────────────────────────── */
export const FORMAT_TAGS = [
  "visual-heavy",
  "interactive",
  "short-lesson",
  "deep-dive",
] as const;

export type CoreTag = (typeof CORE_TAGS)[number];
export type ConditionTag = (typeof CONDITION_TAGS)[number];
export type DifficultyTag = (typeof DIFFICULTY_TAGS)[number];
export type FormatTag = (typeof FORMAT_TAGS)[number];
export type LessonTag = CoreTag | ConditionTag | DifficultyTag | FormatTag | string;

/* ── Module identifiers ──────────────────────────────────── */
export const MODULES = {
  A: "module-a",
  B: "module-b",
  C: "module-c",
  D: "module-d",
  E: "module-e",
  F: "module-f",
  G: "module-g",
  H: "module-h",
  I: "module-i",
  J: "module-j",
} as const;
