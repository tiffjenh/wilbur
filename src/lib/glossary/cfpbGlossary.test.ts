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

  it("findGlossaryEntry('FDIC.') returns FDIC (trailing punctuation stripped)", () => {
    expect(findGlossaryEntry("FDIC.")?.term).toBe("FDIC");
  });

  it("findGlossaryEntry('calls') returns null (not in CFPB glossary; should fall back to AI)", () => {
    expect(findGlossaryEntry("calls")).toBeNull();
  });

  it("findGlossaryEntry('Options') and ('Option') return Options entry", () => {
    expect(findGlossaryEntry("Options")?.term).toBe("Options");
    expect(findGlossaryEntry("Option")?.term).toBe("Options");
  });

  it("findGlossaryEntry('Certificates of Deposit') returns Certificate of deposit (CD), not Deposit", () => {
    const entry = findGlossaryEntry("Certificates of Deposit");
    expect(entry).not.toBeNull();
    expect(entry?.term).toBe("Certificate of deposit (CD)");
    expect(entry?.term).not.toBe("Deposit");
  });

  it("findGlossaryEntry('certificate of deposit') and ('CD') return CD entry", () => {
    expect(findGlossaryEntry("certificate of deposit")?.term).toBe("Certificate of deposit (CD)");
    expect(findGlossaryEntry("CD")?.term).toBe("Certificate of deposit (CD)");
  });

  it("findGlossaryEntry('Stocks') returns entry with term Stock (plural -> singular)", () => {
    const entry = findGlossaryEntry("Stocks");
    expect(entry).not.toBeNull();
    expect(entry?.term).toBe("Stock");
  });

  it("findGlossaryEntry('stock') returns Stock (singular match)", () => {
    const entry = findGlossaryEntry("stock");
    expect(entry).not.toBeNull();
    expect(entry?.term).toBe("Stock");
  });

  it("findGlossaryEntry('Stocks'), ('Stocks '), ('Stocks—') all return Stock (trailing space/punctuation stripped)", () => {
    const a = findGlossaryEntry("Stocks");
    const b = findGlossaryEntry("Stocks ");
    const c = findGlossaryEntry("Stocks—");
    expect(a?.term).toBe("Stock");
    expect(b?.term).toBe("Stock");
    expect(c?.term).toBe("Stock");
  });

  it("findGlossaryEntry regression: FDIC, APR, CD, Budget, IRA and punctuation variants return glossary entry", () => {
    expect(findGlossaryEntry("FDIC")?.term).toBe("FDIC");
    expect(findGlossaryEntry("FDIC.")?.term).toBe("FDIC");
    expect(findGlossaryEntry("APR")?.term).toBe("APR (Annual Percentage Rate)");
    expect(findGlossaryEntry("Budget")?.term).toBe("Budget");
    expect(findGlossaryEntry("IRA")?.term).toBe("IRA");
    expect(findGlossaryEntry("Certificate of deposit (CD)")?.term).toBe("Certificate of deposit (CD)");
  });

  it("findGlossaryEntry('401(k)') normalizes and matches if present", () => {
    const entry = findGlossaryEntry("401(k)");
    // Glossary may or may not have 401(k); if present, should match via normalization
    if (entry) expect(entry.term.toLowerCase()).toMatch(/401/);
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
