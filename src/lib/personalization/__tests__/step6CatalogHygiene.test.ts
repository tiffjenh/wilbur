import { describe, it, expect } from "vitest";
import { LESSON_REGISTRY } from "@/lib/stubData";
import { auditCatalog } from "@/lib/catalog/auditCatalog";
import { CURRICULUM_LIBRARY_IDS, CURRICULUM_LESSONS } from "@/content/curriculum/v1";

describe("Step 6 — Catalog Hygiene", () => {
  it("Library lesson IDs must exist in LESSON_REGISTRY and have non-empty content", () => {
    const libraryIds = CURRICULUM_LIBRARY_IDS();
    const report = auditCatalog(libraryIds);

    expect(libraryIds.length).toBeGreaterThan(0);
    expect(report.missingInRegistry).toEqual([]);
    expect(report.missingContent).toEqual([]);
    expect(Object.keys(LESSON_REGISTRY).length).toBeGreaterThan(0);
  });

  it("CURRICULUM_LESSONS has unique ids (no duplicate canonical slugs)", () => {
    const ids = CURRICULUM_LESSONS.map((l) => l.id);
    const set = new Set(ids);
    expect(set.size).toBe(ids.length);
  });
});
