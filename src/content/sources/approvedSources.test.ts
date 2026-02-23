import { describe, it, expect } from "vitest";
import {
  isApprovedUrl,
  getTierForUrl,
  normalizeDomain,
  enforceApprovedSources,
  APPROVED_TIERS,
  DISALLOWED_DOMAINS,
} from "./approvedSources";

describe("approvedSources", () => {
  it("normalizeDomain strips protocol and www", () => {
    expect(normalizeDomain("https://www.irs.gov/path")).toBe("irs.gov");
    expect(normalizeDomain("https://investor.gov")).toBe("investor.gov");
    expect(normalizeDomain("https://reddit.com/r/investing")).toBe("reddit.com");
  });

  it("isApprovedUrl rejects disallowed domains", () => {
    expect(isApprovedUrl("https://reddit.com/r/personalfinance")).toBe(false);
    expect(isApprovedUrl("https://twitter.com/something")).toBe(false);
    expect(isApprovedUrl("https://forbes.com/article")).toBe(false);
    expect(isApprovedUrl("https://medium.com/@user/post")).toBe(false);
  });

  it("isApprovedUrl accepts Tier 1 and Tier 2", () => {
    expect(isApprovedUrl("https://www.irs.gov/retirement-plans")).toBe(true);
    expect(isApprovedUrl("https://www.fdic.gov/resources/deposit-insurance/")).toBe(true);
    expect(isApprovedUrl("https://www.investor.gov/")).toBe(true);
    expect(isApprovedUrl("https://www.investopedia.com/terms/f/fdic.asp")).toBe(true);
  });

  it("getTierForUrl returns 1 for primary, 2 for secondary, null for disallowed", () => {
    expect(getTierForUrl("https://irs.gov/")).toBe(1);
    expect(getTierForUrl("https://consumerfinance.gov/")).toBe(1);
    expect(getTierForUrl("https://investopedia.com/etf")).toBe(2);
    expect(getTierForUrl("https://reddit.com")).toBe(null);
  });

  it("enforceApprovedSources splits approved vs rejected", () => {
    const urls = [
      "https://www.irs.gov/retirement",
      "https://reddit.com/r/investing",
      "https://www.fdic.gov/",
    ];
    const { approved, rejected } = enforceApprovedSources(urls);
    expect(approved).toContain("https://www.irs.gov/retirement");
    expect(approved).toContain("https://www.fdic.gov/");
    expect(rejected).toContain("https://reddit.com/r/investing");
    expect(approved.length).toBe(2);
    expect(rejected.length).toBe(1);
  });

  it("APPROVED_TIERS and DISALLOWED_DOMAINS are non-empty", () => {
    expect(APPROVED_TIERS.tier1.length).toBeGreaterThan(0);
    expect(APPROVED_TIERS.tier2.length).toBeGreaterThan(0);
    expect(DISALLOWED_DOMAINS.length).toBeGreaterThan(0);
  });
});
