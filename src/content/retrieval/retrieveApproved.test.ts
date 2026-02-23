import { describe, it, expect } from "vitest";
import { retrieveApproved, isTaxOrLegalQuery, isStateTaxQuery, validateUrlsApproved } from "./retrieveApproved";
import { isApprovedUrl } from "@/content/sources/approvedSources";

describe("retrieveApproved", () => {
  it("never returns unapproved domains", () => {
    const r = retrieveApproved({ query: "FDIC insurance" });
    expect(r.excerpts.length).toBeGreaterThan(0);
    for (const e of r.excerpts) {
      expect(isApprovedUrl(e.url)).toBe(true);
      expect(e.tier).toBeLessThanOrEqual(2);
      expect(e.tier).toBeGreaterThanOrEqual(1);
    }
    for (const c of r.citations) {
      expect(isApprovedUrl(c.url)).toBe(true);
    }
  });

  it("isTaxOrLegalQuery detects tax/legal terms", () => {
    expect(isTaxOrLegalQuery("what is IRS withholding")).toBe(true);
    expect(isTaxOrLegalQuery("FDIC insurance")).toBe(true);
    expect(isTaxOrLegalQuery("what is compound interest")).toBe(false);
  });

  it("tax query with requireTier1ForTax fails gracefully when no Tier 1", () => {
    // Query that might match only Tier 2 or nothing: use an obscure tax term that isn't in STATIC
    const r = retrieveApproved({
      query: "obscure state revenue rule xyz",
      requireTier1ForTax: true,
    });
    // If retrieval returned only Tier 2 we'd get tier1RequiredNotMet; if empty we get empty excerpts
    expect(r.excerpts.every((e) => e.tier >= 1 && e.tier <= 2)).toBe(true);
  });

  it("validateUrlsApproved returns approved and rejected", () => {
    const { approved, rejected } = validateUrlsApproved([
      "https://irs.gov/",
      "https://reddit.com/",
    ]);
    expect(approved).toContain("https://irs.gov/");
    expect(rejected).toContain("https://reddit.com/");
  });

  it("isStateTaxQuery detects state tax queries", () => {
    expect(isStateTaxQuery("state income tax")).toBe(true);
    expect(isStateTaxQuery("state capital gains")).toBe(true);
    expect(isStateTaxQuery("filing in my state")).toBe(true);
    expect(isStateTaxQuery("what is FDIC")).toBe(false);
  });

  it("state tax query with userState but no state Tier 1 source sets stateTier1RequiredNotMet", () => {
    const r = retrieveApproved({
      query: "what is state income tax in California",
      userState: "CA",
      requireTier1ForTax: true,
    });
    expect(r.stateTier1RequiredNotMet).toBe(true);
    expect(r.excerpts.length).toBe(0);
  });
});
