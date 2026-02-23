/**
 * CFPB glossary: normalize and lookup.
 * Run: npm run test -- src/lib/glossary/cfpbGlossary.test.ts
 */
import { describe, it, expect } from "vitest";
import { normalizeForGlossary, findGlossaryEntry, formatGlossaryAnswer } from "./cfpbGlossary";

describe("cfpbGlossary", () => {
  it("normalize('APR (Annual Percentage Rate)') matches glossary APR entry", () => {
    const normalized = normalizeForGlossary("APR (Annual Percentage Rate)");
    expect(normalized).toBe("apr annual percentage rate");
    const entry = findGlossaryEntry("APR (Annual Percentage Rate)");
    expect(entry).not.toBeNull();
    expect(entry?.term).toBe("APR (Annual Percentage Rate)");
    expect(entry?.normalized).toBe("apr annual percentage rate");
  });

  it("findGlossaryEntry matches FDIC", () => {
    expect(findGlossaryEntry("FDIC")?.term).toBe("FDIC");
    expect(findGlossaryEntry("  FDIC  ")?.term).toBe("FDIC");
  });

  it("findGlossaryEntry matches Budget and Certificate of deposit (CD)", () => {
    expect(findGlossaryEntry("Budget")?.term).toBe("Budget");
    expect(findGlossaryEntry("Certificate of deposit (CD)")?.term).toBe("Certificate of deposit (CD)");
  });

  it("formatGlossaryAnswer includes term, bullets, and Source line", () => {
    const entry = findGlossaryEntry("FDIC");
    expect(entry).not.toBeNull();
    const answer = formatGlossaryAnswer(entry!);
    expect(answer).toContain("FDIC");
    expect(answer).toContain("Source: CFPB glossary");
    expect(answer).toMatch(/- .+/);
  });
});
