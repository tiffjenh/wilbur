/**
 * Shared citation shape for AI responses and lessons.
 */
export interface Citation {
  title: string;
  url: string;
  domain: string;
  tier: 1 | 2;
  /** Optional: block IDs or section labels where this source is used */
  usedIn?: string[];
}
