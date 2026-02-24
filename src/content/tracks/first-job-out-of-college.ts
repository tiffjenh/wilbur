import type { DomainId } from "@/content/domains";

export type LessonDifficulty = "beginner" | "beginner_plus";

export type LessonSpec = {
  lessonId: string; // slug, e.g. "paycheck-basics"
  title: string;
  domainId: DomainId;

  requiredInTrack: boolean;
  difficulty: LessonDifficulty;
  estimatedMinutes: number; // target 5–8

  whyItMatters: string; // 1–2 sentences
  outcomes: string[]; // 3–5 bullets

  prerequisites: string[]; // lessonIds (keep minimal)

  /**
   * Content guidance for your CMS snapshot authoring.
   * These are block-type suggestions, not enforced.
   */
  suggestedBlocks: Array<
    | "callout"
    | "bullets"
    | "chips"
    | "comparisonCards"
    | "twoColumn"
    | "chart"
    | "image"
    | "checkpoint"
    | "scenario"
    | "divider"
  >;
};

export type TrackSpec = {
  id: string;
  title: string;
  audience: string; // who it's for
  summary: string; // 1–2 sentences
  recommendedDurationWeeks?: number; // optional pacing

  orderedLessons: LessonSpec[];
};

/**
 * Flagship Track v1
 * Purpose: Make Wilbur feel immediately useful for the most common persona:
 * first full-time job (W-2), new benefits, maybe student loans, wants to invest,
 * needs clarity and an order-of-operations.
 */
export const FIRST_JOB_OUT_OF_COLLEGE_TRACK: TrackSpec = {
  id: "first-job-out-of-college",
  title: "First Job Out of College",
  audience:
    "You just started your first full-time job (or you're about to) and want a simple, confident plan for money, debt, benefits, and investing.",
  summary:
    "A short, practical path that helps you understand your paycheck, build a simple system, handle debt, and start investing without feeling overwhelmed.",
  recommendedDurationWeeks: 3,

  orderedLessons: [
    {
      lessonId: "adult-money-game-plan",
      title: "Your Simple Money Game Plan (What to Do First)",
      domainId: "moneyFoundations",
      requiredInTrack: true,
      difficulty: "beginner",
      estimatedMinutes: 6,
      whyItMatters:
        "When money feels overwhelming, the biggest problem is not knowing what matters first. This lesson gives you a simple order-of-operations so you can stop guessing.",
      outcomes: [
        "Understand the basic order most people learn money in (stability → debt → investing)",
        "Know what you can ignore for now (to avoid overwhelm)",
        "Identify your next 1–2 focus areas",
      ],
      prerequisites: [],
      suggestedBlocks: ["callout", "bullets", "comparisonCards", "checkpoint"],
    },
    {
      lessonId: "paycheck-basics",
      title: "Your Paycheck Explained (W-2, Withholding, Take-Home Pay)",
      domainId: "taxes",
      requiredInTrack: true,
      difficulty: "beginner",
      estimatedMinutes: 7,
      whyItMatters:
        "Your paycheck is where adult money starts. Once you understand where the money goes, everything else becomes simpler.",
      outcomes: [
        "Know the difference between gross pay and take-home pay",
        "Understand what taxes/withholding are at a high level",
        "Know what a W-2 is and why it matters",
      ],
      prerequisites: ["adult-money-game-plan"],
      suggestedBlocks: ["twoColumn", "callout", "chart", "checkpoint"],
    },
    {
      lessonId: "budgeting-in-10-minutes",
      title: "Budgeting in 10 Minutes (A Simple System That Works)",
      domainId: "budgetingCashFlow",
      requiredInTrack: true,
      difficulty: "beginner",
      estimatedMinutes: 7,
      whyItMatters:
        "Budgeting shouldn't feel like punishment. A simple system helps you stop worrying and start saving without tracking every penny.",
      outcomes: [
        "Set up a basic monthly plan using a simple framework",
        "Know what categories matter most (and what doesn't)",
        "Build a habit you can actually stick to",
      ],
      prerequisites: ["paycheck-basics"],
      suggestedBlocks: ["bullets", "scenario", "checkpoint", "callout"],
    },
    {
      lessonId: "emergency-fund-basics",
      title: "Emergency Fund Basics (How to Avoid Money Panic)",
      domainId: "moneyFoundations",
      requiredInTrack: true,
      difficulty: "beginner",
      estimatedMinutes: 6,
      whyItMatters:
        "An emergency fund prevents small surprises from turning into credit card debt. It's the fastest way to feel more stable.",
      outcomes: [
        "Understand what an emergency fund is (and what it's not)",
        "Know what types of surprises it covers",
        "Learn a simple approach to building it over time",
      ],
      prerequisites: ["budgeting-in-10-minutes"],
      suggestedBlocks: ["callout", "comparisonCards", "chart", "checkpoint"],
    },
    {
      lessonId: "credit-cards-statement-balance",
      title: "Credit Cards: Statement Balance vs Minimum Payment",
      domainId: "creditDebt",
      requiredInTrack: true,
      difficulty: "beginner",
      estimatedMinutes: 7,
      whyItMatters:
        "Credit card debt grows quietly. Understanding statement balance vs minimum payment prevents accidental debt spirals.",
      outcomes: [
        "Understand statement balance vs current balance vs minimum payment",
        "Know how interest can add up if you carry a balance",
        "Learn common credit card mistakes to avoid",
      ],
      prerequisites: ["emergency-fund-basics"],
      suggestedBlocks: ["comparisonCards", "callout", "scenario", "checkpoint"],
    },
    {
      lessonId: "paying-off-credit-card-debt",
      title: "Paying Off Credit Card Debt Without Feeling Broke",
      domainId: "creditDebt",
      requiredInTrack: true,
      difficulty: "beginner",
      estimatedMinutes: 7,
      whyItMatters:
        "High-interest debt is one of the biggest blockers to building wealth. This lesson teaches how people typically approach payoff—without shame or unrealistic rules.",
      outcomes: [
        "Understand the idea of prioritizing high-interest debt",
        "Learn the difference between snowball vs avalanche (simple)",
        "Know how to avoid getting stuck in minimum payments",
      ],
      prerequisites: ["credit-cards-statement-balance"],
      suggestedBlocks: ["comparisonCards", "callout", "chart", "checkpoint"],
    },
    {
      lessonId: "student-loans-explained",
      title: "Student Loans Explained (What Matters, What Doesn't)",
      domainId: "studentLoans",
      requiredInTrack: false,
      difficulty: "beginner",
      estimatedMinutes: 7,
      whyItMatters:
        "Student loans can feel confusing and heavy. This lesson focuses on the few things that actually affect your life day-to-day.",
      outcomes: [
        "Know the difference between federal vs private loans (high level)",
        "Understand what interest rate means for your repayment",
        "Learn how to think about loan priority vs other goals (education-only)",
      ],
      prerequisites: ["adult-money-game-plan"],
      suggestedBlocks: ["callout", "twoColumn", "checkpoint", "bullets"],
    },
    {
      lessonId: "work-benefits-401k-hsa",
      title: "Work Benefits 101: 401(k), Match, HSA/FSA (In Plain English)",
      domainId: "workBenefitsRetirement",
      requiredInTrack: true,
      difficulty: "beginner",
      estimatedMinutes: 8,
      whyItMatters:
        "Work benefits can feel like a foreign language, but they can be some of the biggest financial advantages you have. This lesson makes the basics feel clear.",
      outcomes: [
        "Understand what a 401(k) is and what an employer match means",
        "Know what an IRA is at a high level (Roth vs traditional later)",
        "Understand HSA vs FSA basics and what they're used for",
      ],
      prerequisites: ["paycheck-basics"],
      suggestedBlocks: ["comparisonCards", "callout", "twoColumn", "checkpoint"],
    },
    {
      lessonId: "investing-basics-no-stock-picking",
      title: "Investing Basics (Without Stock-Picking)",
      domainId: "investingBasics",
      requiredInTrack: true,
      difficulty: "beginner",
      estimatedMinutes: 8,
      whyItMatters:
        "Investing can feel intimidating. This lesson teaches the big picture—what investing is and how risk works—so you can start with confidence.",
      outcomes: [
        "Understand what investing is (and what it isn't)",
        'Learn what "risk" means in normal language',
        "Know the difference between stocks, bonds, ETFs (simple)",
      ],
      prerequisites: ["work-benefits-401k-hsa"],
      suggestedBlocks: ["chart", "comparisonCards", "callout", "checkpoint"],
    },

    // Optional / later lessons (unlock after investing basics)
    {
      lessonId: "home-buying-5-numbers",
      title: "Home Buying Starter: The 5 Numbers That Matter",
      domainId: "realEstateHomeBuying",
      requiredInTrack: false,
      difficulty: "beginner_plus",
      estimatedMinutes: 7,
      whyItMatters:
        "Home buying is a big goal, but the process feels confusing. This lesson helps you understand the few numbers that drive affordability.",
      outcomes: [
        "Understand down payment, monthly payment, and interest rate at a high level",
        "Know what closing costs are (without the weeds)",
        "Learn what questions to ask before going deeper",
      ],
      prerequisites: ["investing-basics-no-stock-picking"],
      suggestedBlocks: ["chart", "twoColumn", "checkpoint", "callout"],
    },
    {
      lessonId: "stocks-deep-dive-preview",
      title: "Stocks Preview: What a Stock Price Actually Means",
      domainId: "stocksDeepDive",
      requiredInTrack: false,
      difficulty: "beginner_plus",
      estimatedMinutes: 6,
      whyItMatters:
        "If you're curious about stocks, start here. This preview teaches what a stock price represents without getting technical.",
      outcomes: [
        "Understand what buying a stock means (ownership, expectations)",
        "Learn why prices move (simple supply/demand + news)",
        "Avoid common beginner misconceptions",
      ],
      prerequisites: ["investing-basics-no-stock-picking"],
      suggestedBlocks: ["callout", "chart", "checkpoint", "comparisonCards"],
    },
  ],
};

export default FIRST_JOB_OUT_OF_COLLEGE_TRACK;
