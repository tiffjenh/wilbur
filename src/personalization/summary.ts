/**
 * Step 4: Summary payload generator.
 * Deterministic copy for persona, priorities, domains, and recap.
 */
import type { PersonalizationResult, PriorityArea, PersonaId } from "./types";
import type { DomainId } from "@/content/domains";
import { DOMAIN_DISPLAY_ORDER } from "@/content/domains";

function personaCopy(persona: PersonaId): { title: string; oneLiner: string } {
  switch (persona) {
    case "student_starter":
      return { title: "Student Starter", oneLiner: "You're learning the money basics early — that's a huge advantage." };
    case "early_career_builder":
      return { title: "Early Career Builder", oneLiner: "You're building your foundation and learning how to make your first paycheck work for you." };
    case "debt_stabilizer":
      return { title: "Debt Stabilizer", oneLiner: "You're juggling debt and building stability — the goal is clarity before growth." };
    case "independent_earner":
      return { title: "Independent Earner", oneLiner: "Your income can be more flexible — structure and taxes matter a lot here." };
    case "growth_oriented_builder":
      return { title: "Growth-Oriented Builder", oneLiner: "You have a base and want to grow — we'll keep it smart and not overwhelming." };
    case "home_buyer_planner":
      return { title: "Home Buyer Planner", oneLiner: "You're working toward home ownership — we'll make the numbers feel simple." };
    case "catch_up_builder":
      return { title: "Catch-Up Builder", oneLiner: "You're getting started later — momentum beats perfection." };
    case "benefits_confused_professional":
      return { title: "Benefits Explorer", oneLiner: "Work benefits can be confusing — we'll make them feel straightforward." };
  }
}

function priorityCopy(area: PriorityArea): { title: string; description: string } {
  switch (area) {
    case "stabilize":
      return { title: "Build a simple money system", description: "Make your monthly plan feel predictable instead of stressful." };
    case "high_interest_debt":
      return { title: "Understand high-interest debt", description: "Learn how credit card balances grow — and how people typically tackle them." };
    case "student_loans":
      return { title: "Make student loans less confusing", description: "Understand repayment basics and how to think about priorities (education-only)." };
    case "work_benefits":
      return { title: "Learn work benefits", description: "401(k), IRA, HSA/FSA — explained in plain English." };
    case "investing_basics":
      return { title: "Learn investing basics", description: "What investing is, how risk works, and the building blocks." };
    case "stocks_deep_dive":
      return { title: "Go deeper on stocks", description: "Prices, charts, key metrics — without the hype." };
    case "crypto":
      return { title: "Understand crypto basics", description: "What it is, why it swings, and how to avoid common scams." };
    case "real_estate_home_buying":
      return { title: "Learn home buying basics", description: "Mortgages, down payments, and the numbers that matter most." };
    case "short_term_rentals":
      return { title: "Learn STR basics", description: "How the business model works, costs, and risks (education-only)." };
    case "taxes":
      return { title: "Understand taxes (basics)", description: "Make paychecks and basic tax rules feel less mysterious." };
    case "insurance":
      return { title: "Understand insurance basics", description: "Deductibles, premiums, and what protection actually means." };
    case "side_income":
      return { title: "Explore side income", description: "Basics of earning extra income and what to watch for." };
  }
}

function orderDomainsForSummary(domains: DomainId[]): DomainId[] {
  const set = new Set(domains);
  return DOMAIN_DISPLAY_ORDER.filter((d) => set.has(d));
}

export function buildSummary(result: Omit<PersonalizationResult, "summary">): PersonalizationResult["summary"] {
  const { title, oneLiner } = personaCopy(result.persona);

  const topPrioritiesCopy = result.topPriorities.map((area) => ({
    area,
    ...priorityCopy(area),
  }));

  const a = result.rawAnswers;

  const recapBullets: string[] = [
    `Learning mode: ${a.learningMode === "tailored" ? "Tailored" : "Explore freely"}`,
    `Life stage: ${String(a.lifeStage).replace(/_/g, " ")}`,
    `Goal: ${String(a.primaryGoal).replace(/_/g, " ")}`,
    `Confidence: ${a.confidence}/5`,
  ];

  if (a.incomeType.length) recapBullets.push(`Income type: ${a.incomeType.join(", ")}`);
  if (a.financialSituation.length) recapBullets.push(`You selected: ${a.financialSituation.join(", ").replace(/_/g, " ")}`);
  if (a.state) recapBullets.push(`State: ${a.state}`);

  const whatThisMeans = [
    "We'll start with the basics that remove confusion fastest.",
    "You'll see deeper topics later once the fundamentals feel easy.",
    "Everything here is education-only — it's meant to help you understand, not tell you what to do.",
  ];

  const recommended = (Object.entries(result.domainVisibility) as Array<[DomainId, string]>)
    .filter(([, vis]) => vis === "required" || vis === "recommended")
    .map(([id]) => id);

  const exploreLater = (Object.entries(result.domainVisibility) as Array<[DomainId, string]>)
    .filter(([, vis]) => vis === "optional" || vis === "suppressed" || vis === "locked")
    .map(([id]) => id);

  return {
    personaTitle: title,
    personaOneLiner: oneLiner,
    whatThisMeans,
    topPrioritiesCopy,
    recommendedDomainsOrdered: orderDomainsForSummary(recommended),
    exploreLaterDomains: orderDomainsForSummary(exploreLater),
    recapBullets,
  };
}
