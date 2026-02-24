/**
 * CMS lesson block types (v1).
 * Used by LessonRenderer for content_blocks, example_blocks, video_blocks from Supabase.
 */

export type HeadingBlock = {
  type: "heading";
  level: 2 | 3;
  text: string;
};

export type ParagraphBlock = {
  type: "paragraph";
  text: string;
};

export type BulletsBlock = {
  type: "bullets";
  items: string[];
};

export type CalloutBlock = {
  type: "callout";
  variant: "tip" | "note" | "warning";
  title?: string;
  text: string;
};

export type ChipsBlock = {
  type: "chips";
  items: string[];
};

export type DividerBlock = {
  type: "divider";
};

export type TwoColumnBlock = {
  type: "twoColumn";
  left: CMSBlock[];
  right: CMSBlock[];
};

export type ChartPlaceholderBlock = {
  type: "chartPlaceholder";
  chartType: "line" | "bar" | "pie";
  title: string;
  description: string;
};

export type ImagePlaceholderBlock = {
  type: "imagePlaceholder";
  title: string;
  description: string;
};

export type ComparisonCard = {
  title: string;
  bullets: string[];
  badge?: string;
};

export type ComparisonCardsBlock = {
  type: "comparisonCards";
  cards: [ComparisonCard, ComparisonCard];
};

export type CMSBlock =
  | HeadingBlock
  | ParagraphBlock
  | BulletsBlock
  | CalloutBlock
  | ChipsBlock
  | DividerBlock
  | TwoColumnBlock
  | ChartPlaceholderBlock
  | ImagePlaceholderBlock
  | ComparisonCardsBlock;

export type QuizQuestion = {
  prompt: string;
  choices: string[];
  correctIndex: number;
  explanation: string;
};

export type QuizSpec = {
  title: string;
  questions: [QuizQuestion, QuizQuestion, QuizQuestion];
};

export type SourceCitation = {
  title: string;
  url: string;
  domain: string;
  tier: 1 | 2;
};

export type CMSLessonRecord = {
  id: string;
  slug: string;
  title: string;
  subtitle: string | null;
  category: string;
  track: string | null;
  level: "beginner" | "intermediate" | "advanced";
  estimated_minutes: number;
  hero_takeaways: string[];
  content_blocks: CMSBlock[];
  example_blocks: CMSBlock[];
  video_blocks: CMSBlock[];
  quiz: QuizSpec | null;
  source_citations: SourceCitation[];
  status: "draft" | "published";
  created_at: string;
  updated_at: string;
  published_at: string | null;
  updated_by: string | null;
  revision: number;
};
