/**
 * Block-based lesson system types.
 * Every lesson is composed of ordered blocks — no long essay prose.
 */
import type { LessonTag } from "./tags";

/* ── Individual block types ─────────────────────────────── */

export interface HeroBlock {
  type: "hero";
  title: string;
  subtitle?: string;
  emoji?: string;
}

export interface BulletListBlock {
  type: "bullet-list";
  heading?: string;
  items: string[];
  icon?: "check" | "arrow" | "dot";
}

export interface CalloutBlock {
  type: "callout";
  tone: "info" | "warning" | "tip" | "source";
  heading?: string;
  text: string;
}

export interface ChartDataPoint {
  label: string;
  value: number;
  value2?: number;
  color?: string;
}

export interface ChartBlock {
  type: "chart";
  chartType: "bar" | "line" | "pie" | "compound-growth";
  title?: string;
  subtitle?: string;
  data: ChartDataPoint[];
  yAxisLabel?: string;
  xAxisLabel?: string;
}

export interface ComparisonSide {
  label: string;
  emoji?: string;
  points: string[];
  verdict?: string;
}

export interface ComparisonBlock {
  type: "comparison";
  heading?: string;
  left: ComparisonSide;
  right: ComparisonSide;
  note?: string;
}

export interface ExampleBlock {
  type: "example";
  heading?: string;
  scenario: string;
  breakdown: string[];
  outcome?: string;
}

export interface SliderConfig {
  id: string;
  label: string;
  min: number;
  max: number;
  step: number;
  defaultValue: number;
  format: "currency" | "percent" | "years" | "number";
  description?: string;
}

export interface InteractiveSliderBlock {
  type: "interactive-slider";
  heading?: string;
  description?: string;
  sliders: SliderConfig[];
  calculatorType: "compound-interest" | "debt-payoff" | "savings-goal" | "budget";
}

export interface QuizOption {
  id: string;
  text: string;
  correct?: boolean;
}

export interface QuizBlock {
  type: "quiz";
  question: string;
  options: QuizOption[];
  explanation?: string;
}

export interface KeyTermsBlock {
  type: "key-terms";
  heading?: string;
  terms: { term: string; definition: string }[];
}

export interface ToggleComparisonBlock {
  type: "toggle-comparison";
  heading?: string;
  optionA: { label: string; content: string[]; tag?: string };
  optionB: { label: string; content: string[]; tag?: string };
  note?: string;
}

export interface ChartPlaceholderBlock {
  type: "chart-placeholder";
  title?: string;
  subtitle?: string;
}

export type LessonBlock =
  | HeroBlock
  | BulletListBlock
  | CalloutBlock
  | ChartBlock
  | ChartPlaceholderBlock
  | ComparisonBlock
  | ExampleBlock
  | InteractiveSliderBlock
  | QuizBlock
  | KeyTermsBlock
  | ToggleComparisonBlock;

/* ── Source / citation (aligned with approvedSources + CitationsList) ─── */

export interface LessonSource {
  name: string;
  url: string;
  type: "government" | "regulator" | "reputable-explainer";
  lastReviewed?: string;
  /** 1 = primary (gov/regulator), 2 = secondary (e.g. Investopedia). From approvedSources. */
  tier?: 1 | 2;
  /** Optional: which blocks/sections use this source */
  usedIn?: string[];
}

/* ── Full block lesson ──────────────────────────────────── */

export interface BlockLesson {
  id: string;
  slug: string;
  title: string;
  subtitle?: string;
  module: string;
  level: "beginner" | "intermediate" | "advanced";
  tags: LessonTag[];
  /** Recommended for users who match any of these condition tags */
  recommendedFor?: string[];
  estimatedTime: number;
  blocks: LessonBlock[];
  sources: LessonSource[];
}
