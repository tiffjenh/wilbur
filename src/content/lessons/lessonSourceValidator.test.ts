import { describe, it, expect } from "vitest";
import { validateLessonSources } from "./lessonSourceValidator";
import type { BlockLesson } from "@/content/lessonTypes";

describe("lessonSourceValidator", () => {
  it("fails if citations include non-approved URL", () => {
    const lesson: Pick<BlockLesson, "sources" | "tags" | "slug"> = {
      slug: "test-lesson",
      tags: ["money-basics"],
      sources: [
        { name: "IRS", url: "https://www.irs.gov/", type: "government" },
        { name: "Bad", url: "https://reddit.com/r/personalfinance", type: "reputable-explainer" },
      ],
    };
    const result = validateLessonSources(lesson);
    expect(result.valid).toBe(false);
    expect(result.errors.some((e) => e.includes("non-approved"))).toBe(true);
  });

  it("passes when all URLs are approved", () => {
    const lesson: Pick<BlockLesson, "sources" | "tags" | "slug"> = {
      slug: "test-lesson",
      tags: ["money-basics"],
      sources: [
        { name: "FDIC", url: "https://www.fdic.gov/", type: "regulator" },
        { name: "CFPB", url: "https://www.consumerfinance.gov/", type: "regulator" },
      ],
    };
    const result = validateLessonSources(lesson);
    expect(result.valid).toBe(true);
    expect(result.errors.length).toBe(0);
  });

  it("fails for tax/legal lesson without Tier 1 source", () => {
    const lesson: Pick<BlockLesson, "sources" | "tags" | "slug"> = {
      slug: "tax-lesson",
      tags: ["taxes-federal"],
      sources: [
        { name: "Investopedia", url: "https://www.investopedia.com/taxes", type: "reputable-explainer" },
      ],
    };
    const result = validateLessonSources(lesson);
    expect(result.valid).toBe(false);
    expect(result.errors.some((e) => e.includes("Tier 1") || e.includes("tax"))).toBe(true);
  });

  it("passes for tax/legal lesson with Tier 1 source", () => {
    const lesson: Pick<BlockLesson, "sources" | "tags" | "slug"> = {
      slug: "tax-lesson",
      tags: ["taxes-federal"],
      sources: [
        { name: "IRS", url: "https://www.irs.gov/retirement-plans", type: "government" },
      ],
    };
    const result = validateLessonSources(lesson);
    expect(result.valid).toBe(true);
  });
});
