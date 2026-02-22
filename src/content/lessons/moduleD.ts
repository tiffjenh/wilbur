/**
 * Module D — Credit & Debt (Level 1–2)
 * 5 lessons: credit score, credit cards, debt payoff methods, debt vs investing, student loans
 */
import type { BlockLesson } from "../lessonTypes";

export const moduleDLessons: BlockLesson[] = [
  /* ── D1: Credit Score Basics ─────────────────────────── */
  {
    id: "d1",
    slug: "credit-score-basics",
    title: "Credit Score: What Actually Matters",
    subtitle: "The 5 factors — and which one matters most",
    module: "module-d",
    level: "beginner",
    tags: ["credit", "debt", "money-basics", "level-1", "visual-heavy"],
    recommendedFor: ["has-debt", "goal-debt", "confidence-low", "confidence-mid"],
    estimatedTime: 8,
    blocks: [
      {
        type: "hero",
        emoji: "📊",
        title: "Your credit score in plain English",
        subtitle: "One number that affects rent, loans, and insurance rates",
      },
      {
        type: "chart",
        chartType: "pie",
        title: "What makes up your FICO score",
        subtitle: "The most widely used credit scoring model",
        data: [
          { label: "Payment History (35%)", value: 35, color: "#0E5C4C" },
          { label: "Amounts Owed (30%)", value: 30, color: "#4A9B8A" },
          { label: "Length of History (15%)", value: 15, color: "#8FD4C6" },
          { label: "New Credit (10%)", value: 10, color: "#C4EAE5" },
          { label: "Credit Mix (10%)", value: 10, color: "#E3E2D2" },
        ],
      },
      {
        type: "bullet-list",
        heading: "What the 5 factors actually mean",
        items: [
          "Payment History (35%) — Do you pay on time? Even one late payment hurts. This is the most important factor.",
          "Amounts Owed (30%) — Utilization: how much of your credit limit you're using. Keep it under 30%, ideally under 10%.",
          "Length of History (15%) — How long you've had credit. Older accounts help. Don't close your oldest card.",
          "New Credit (10%) — Hard inquiries from new applications. Applying for several cards in a short time hurts temporarily.",
          "Credit Mix (10%) — Having different types (cards, auto loan, mortgage). This is the least important factor.",
        ],
        icon: "dot",
      },
      {
        type: "callout",
        tone: "info",
        heading: "Credit score ranges",
        text: "Poor: 300–579 | Fair: 580–669 | Good: 670–739 | Very Good: 740–799 | Exceptional: 800–850. Above 700 gets you good rates. Above 750 gets you the best rates.",
      },
      {
        type: "comparison",
        heading: "Actions that help vs. hurt your score",
        left: {
          label: "Helps your score",
          emoji: "📈",
          points: [
            "Pay on time, every time",
            "Keep utilization below 30%",
            "Keep old accounts open",
            "Become an authorized user",
          ],
        },
        right: {
          label: "Hurts your score",
          emoji: "📉",
          points: [
            "Missing payments",
            "Maxing out credit cards",
            "Closing old accounts",
            "Applying for many cards at once",
          ],
        },
      },
      {
        type: "callout",
        tone: "tip",
        text: "Check your credit report for free at AnnualCreditReport.com (the official government-authorized site). You're entitled to one free report per bureau per year. Check for errors — they're more common than you'd think.",
      },
    ],
    sources: [
      { name: "CFPB — Credit Reports and Scores", url: "https://www.consumerfinance.gov/consumer-tools/credit-reports-and-scores/", type: "regulator", lastReviewed: "2025-01" },
      { name: "AnnualCreditReport.com — Official Free Reports", url: "https://www.annualcreditreport.com", type: "government", lastReviewed: "2025-01" },
      { name: "Federal Reserve — Consumer Credit", url: "https://www.federalreserve.gov/releases/g19/current/", type: "government", lastReviewed: "2025-01" },
    ],
  },

  /* ── D2: How Credit Card Interest Works ─────────────── */
  {
    id: "d2",
    slug: "credit-card-interest",
    title: "Credit Cards: How Interest Actually Works",
    subtitle: "Understand APR before it costs you thousands",
    module: "module-d",
    level: "beginner",
    tags: ["credit", "debt", "money-basics", "level-1", "visual-heavy"],
    recommendedFor: ["has-debt", "confidence-low"],
    estimatedTime: 8,
    blocks: [
      {
        type: "hero",
        emoji: "💳",
        title: "The real cost of carrying a balance",
        subtitle: "APR is silent — until it's expensive",
      },
      {
        type: "callout",
        tone: "warning",
        heading: "Average credit card APR is ~24% (2025)",
        text: "That means every $1,000 you carry for a year costs you ~$240 in interest — for no benefit to you. Credit cards are powerful tools when paid in full. They're expensive debt when carried month-to-month.",
      },
      {
        type: "example",
        heading: "The $3,000 balance example",
        scenario: "You carry $3,000 on a card with 22% APR and only pay the minimum each month",
        breakdown: [
          "Minimum payment: ~$65/month",
          "Time to pay off: 17 years",
          "Total interest paid: $3,985",
          "You paid $3,985 for nothing — on top of the $3,000 you borrowed",
        ],
        outcome: "Paying $200/month instead cuts payoff to 18 months and interest to $608. A $135/month difference saves you $3,377 and 15 years.",
      },
      {
        type: "chart",
        chartType: "bar",
        title: "Total cost of $3,000 debt at different payment levels",
        subtitle: "Hypothetical at 22% APR",
        data: [
          { label: "Min payment (~$65)", value: 6985, color: "#d9534f" },
          { label: "$150/month", value: 3810, color: "#FFD6B0" },
          { label: "$200/month", value: 3608, color: "#4A9B8A" },
          { label: "Pay in full", value: 3000, color: "#0E5C4C" },
        ],
        yAxisLabel: "Total cost ($)",
      },
      {
        type: "bullet-list",
        heading: "Credit card rules that save you money",
        items: [
          "Pay in full every month — zero interest charged on purchases",
          "Never miss a payment — even the minimum protects your credit score",
          "Don't carry a balance to earn rewards — the APR wipes out any rewards value",
          "Check your statement every month — catch fraud early",
          "Use only 10–30% of your credit limit to protect your score",
        ],
        icon: "check",
      },
      {
        type: "callout",
        tone: "tip",
        text: "If you can't pay in full, use your credit card like a debit card — only spend what's already in your checking account. This gives you the protections of a credit card without the debt.",
      },
    ],
    sources: [
      { name: "CFPB — Credit Cards", url: "https://www.consumerfinance.gov/consumer-tools/credit-cards/", type: "regulator", lastReviewed: "2025-01" },
      { name: "Federal Reserve — Consumer Credit Report", url: "https://www.federalreserve.gov/releases/g19/current/", type: "government", lastReviewed: "2025-01" },
    ],
  },

  /* ── D3: Debt Payoff Methods ─────────────────────────── */
  {
    id: "d3",
    slug: "debt-payoff-methods",
    title: "Debt Payoff: Avalanche vs. Snowball",
    subtitle: "Two proven strategies — choose the one that keeps you going",
    module: "module-d",
    level: "beginner",
    tags: ["debt", "credit", "budgeting", "level-1", "level-2", "visual-heavy"],
    recommendedFor: ["has-debt", "goal-debt", "confidence-low", "confidence-mid"],
    estimatedTime: 9,
    blocks: [
      {
        type: "hero",
        emoji: "⛰️",
        title: "Two paths out of debt",
        subtitle: "Both work — the best one is the one you stick with",
      },
      {
        type: "comparison",
        heading: "Avalanche vs. Snowball",
        left: {
          label: "Debt Avalanche",
          emoji: "🏔️",
          points: [
            "Pay minimums on all debts",
            "Extra money → highest APR first",
            "Saves the most in interest",
            "Takes longer to see wins",
            "Best for: mathematically motivated people",
          ],
          verdict: "Saves more money, requires patience",
        },
        right: {
          label: "Debt Snowball",
          emoji: "⛄",
          points: [
            "Pay minimums on all debts",
            "Extra money → smallest balance first",
            "Pays more in total interest",
            "Quick wins keep you motivated",
            "Best for: people who need momentum",
          ],
          verdict: "More expensive, but completion rates are higher",
        },
        note: "Research suggests the snowball method leads to higher debt-free rates because motivation matters more than math.",
      },
      {
        type: "example",
        heading: "Sample debt: 3 accounts",
        scenario: "You have $400/month available for debt payoff beyond minimums",
        breakdown: [
          "Credit Card A: $800 balance, 24% APR, $25 minimum",
          "Credit Card B: $3,200 balance, 19% APR, $64 minimum",
          "Car Loan: $6,500 balance, 6% APR, $185 minimum",
          "Total minimums: $274 — you have $126 extra",
          "Snowball: Attack $800 card first (paid off in ~6 months)",
          "Avalanche: Attack 24% card first (same $800 — in this case they're the same!)",
        ],
        outcome: "In this example, both methods agree: the $800 card is both the smallest AND highest APR. Start there.",
      },
      {
        type: "interactive-slider",
        heading: "Debt payoff calculator",
        description: "See how long it takes to pay off your debt",
        calculatorType: "debt-payoff",
        sliders: [
          { id: "balance", label: "Total debt balance", min: 500, max: 50000, step: 500, defaultValue: 5000, format: "currency" },
          { id: "apr", label: "Average APR", min: 5, max: 35, step: 1, defaultValue: 20, format: "percent" },
          { id: "monthly", label: "Monthly payment", min: 50, max: 2000, step: 25, defaultValue: 300, format: "currency" },
        ],
      },
      {
        type: "callout",
        tone: "tip",
        text: "The most important thing: pick one method and commit. Don't switch back and forth. Consistency beats optimization every time.",
      },
    ],
    sources: [
      { name: "CFPB — Strategies for Paying Off Debt", url: "https://www.consumerfinance.gov/about-us/blog/strategies-for-paying-down-debt/", type: "regulator", lastReviewed: "2025-01" },
      { name: "Federal Reserve — Household Debt Study", url: "https://www.federalreserve.gov/releases/z1/20240906/html/l100.htm", type: "government", lastReviewed: "2025-01" },
    ],
  },

  /* ── D4: Debt vs. Investing ──────────────────────────── */
  {
    id: "d4",
    slug: "debt-vs-investing",
    title: "Debt vs. Investing: What to Do First?",
    subtitle: "A simple framework for the most common money dilemma",
    module: "module-d",
    level: "intermediate",
    tags: ["debt", "investing-basics", "retirement", "level-2", "level-3"],
    recommendedFor: ["has-debt", "has-401k", "goal-debt", "goal-investing"],
    estimatedTime: 8,
    blocks: [
      {
        type: "hero",
        emoji: "⚖️",
        title: "Pay off debt or invest?",
        subtitle: "The answer depends on one key number: your interest rate",
      },
      {
        type: "callout",
        tone: "info",
        heading: "The core principle",
        text: "If your debt's interest rate is higher than what you'd expect to earn investing, pay the debt first. Stock market historical average return: ~10% before inflation, ~7% after. Compare that to your debt's APR.",
      },
      {
        type: "bullet-list",
        heading: "The decision framework",
        items: [
          "Always: Pay all minimums on all debts (never miss)",
          "Always: Get your 401(k) employer match first — it's a 50–100% instant return",
          "High APR debt (15%+): Pay this aggressively before investing beyond the match",
          "Medium APR debt (7–14%): Split — some debt payoff, some investing",
          "Low APR debt (under 6%): Consider investing more (expected market returns exceed the cost)",
        ],
        icon: "arrow",
      },
      {
        type: "comparison",
        heading: "Scenario: $500 extra per month",
        left: {
          label: "Pay off 20% APR card",
          emoji: "💳",
          points: [
            "Guaranteed 20% return (by not paying interest)",
            "No market risk",
            "Improves cash flow when debt-free",
            "Debt-free in 1–2 years",
          ],
          verdict: "Best when APR is high (15%+)",
        },
        right: {
          label: "Invest in index funds",
          emoji: "📈",
          points: [
            "Historical ~7–10% annual return",
            "Market can drop in the short term",
            "Tax advantages if using 401k/IRA",
            "Compound growth starts sooner",
          ],
          verdict: "Best when debt APR is low (under 6%)",
        },
      },
      {
        type: "callout",
        tone: "tip",
        heading: "Never skip the 401(k) match",
        text: "If your employer matches 50% of your contribution up to 6% of salary, that's a guaranteed 50% return. No debt payoff strategy beats a guaranteed 50% return. Always contribute enough to get the full match.",
      },
    ],
    sources: [
      { name: "IRS — 401(k) Plans", url: "https://www.irs.gov/retirement-plans/401k-plans", type: "government", lastReviewed: "2025-01" },
      { name: "CFPB — Managing Debt", url: "https://www.consumerfinance.gov/consumer-tools/debt-collection/", type: "regulator", lastReviewed: "2025-01" },
    ],
  },

  /* ── D5: Student Loans Basics ────────────────────────── */
  {
    id: "d5",
    slug: "student-loans-basics",
    title: "Student Loans: What You Need to Know",
    subtitle: "Federal vs. private, repayment options, and your rights",
    module: "module-d",
    level: "beginner",
    tags: ["student-loans", "debt", "taxes-federal", "level-1", "level-2"],
    recommendedFor: ["student", "has-debt", "goal-debt"],
    estimatedTime: 9,
    blocks: [
      {
        type: "hero",
        emoji: "🎓",
        title: "Your student loans, simplified",
        subtitle: "Know the difference between federal and private — it changes everything",
      },
      {
        type: "comparison",
        heading: "Federal vs. Private loans",
        left: {
          label: "Federal Student Loans",
          emoji: "🏛️",
          points: [
            "Set by Congress — fixed rates",
            "Income-driven repayment options",
            "Forgiveness programs available",
            "Deferment/forbearance options",
            "No credit check required (most)",
          ],
          verdict: "More protections, more flexibility",
        },
        right: {
          label: "Private Student Loans",
          emoji: "🏦",
          points: [
            "Set by lender — can be variable",
            "Fewer repayment options",
            "Very limited forgiveness options",
            "May need co-signer",
            "Credit score matters",
          ],
          verdict: "Fewer protections — exhaust federal first",
        },
      },
      {
        type: "bullet-list",
        heading: "Federal loan repayment plans",
        items: [
          "Standard (10 years) — highest monthly payment, least total interest",
          "Graduated — starts low, increases every 2 years",
          "Income-Driven (IBR, PAYE, SAVE) — payment based on income, not loan size",
          "PSLF (Public Service) — forgiveness after 10 years for qualifying jobs",
          "Extended — up to 25 years (more interest, lower payment)",
        ],
        icon: "dot",
      },
      {
        type: "callout",
        tone: "info",
        heading: "The SAVE plan",
        text: "SAVE (Saving on a Valuable Education) is the newest income-driven plan. It calculates payments based on 5% of discretionary income for undergraduate loans (down from 10%). Check StudentAid.gov for current status.",
      },
      {
        type: "callout",
        tone: "tip",
        text: "Log in to StudentAid.gov to see all your federal loans in one place, check your servicer, and explore repayment options. It's the official government student loan portal.",
      },
    ],
    sources: [
      { name: "Federal Student Aid — StudentAid.gov", url: "https://studentaid.gov", type: "government", lastReviewed: "2025-01" },
      { name: "CFPB — Student Loans", url: "https://www.consumerfinance.gov/consumer-tools/student-loans/", type: "regulator", lastReviewed: "2025-01" },
      { name: "Dept. of Education — Federal Student Loan Programs", url: "https://www.ed.gov/loans", type: "government", lastReviewed: "2025-01" },
    ],
  },
];
