/**
 * Module B — Budgeting & Cash Flow (Level 1–2)
 * 5 lessons: budget styles, starter budget, irregular income, automations, sinking funds
 */
import type { BlockLesson } from "../lessonTypes";

export const moduleBLessons: BlockLesson[] = [
  /* ── B1: Budget Styles ───────────────────────────────── */
  {
    id: "b1",
    slug: "budget-styles",
    title: "Budget Styles: 50/30/20 vs. Zero-Based",
    subtitle: "Pick the method that fits your life",
    module: "module-b",
    level: "beginner",
    tags: ["budgeting", "cashflow", "level-1", "visual-heavy"],
    recommendedFor: ["confidence-low", "confidence-mid"],
    estimatedTime: 7,
    blocks: [
      {
        type: "hero",
        emoji: "📊",
        title: "There's no single right budget",
        subtitle: "The best budget is one you'll actually use",
      },
      {
        type: "comparison",
        heading: "The two most popular methods",
        left: {
          label: "50/30/20 Rule",
          emoji: "🥧",
          points: [
            "50% Needs (rent, food, bills)",
            "30% Wants (dining, fun)",
            "20% Savings & debt",
            "Simple and flexible",
            "Great for beginners",
          ],
          verdict: "Best for: people who want simple rules",
        },
        right: {
          label: "Zero-Based Budget",
          emoji: "🎯",
          points: [
            "Every dollar gets a job",
            "Income minus expenses = $0",
            "Total control and clarity",
            "More time to set up",
            "Great for debt payoff",
          ],
          verdict: "Best for: people serious about debt",
        },
      },
      {
        type: "chart",
        chartType: "pie",
        title: "50/30/20 budget on $4,000/month take-home",
        subtitle: "Hypothetical example",
        data: [
          { label: "Needs (50%)", value: 2000, color: "#0E5C4C" },
          { label: "Wants (30%)", value: 1200, color: "#4A9B8A" },
          { label: "Savings (20%)", value: 800, color: "#C4EAE5" },
        ],
      },
      {
        type: "example",
        heading: "50/30/20 in practice",
        scenario: "Alex earns $4,000/month after taxes",
        breakdown: [
          "Needs ($2,000): Rent $1,100, groceries $300, car/insurance $400, phone $75, utilities $125",
          "Wants ($1,200): Dining $400, streaming $50, gym $50, shopping $400, fun $300",
          "Savings ($800): Emergency fund $300, investing $300, vacation fund $200",
        ],
        outcome: "The 50/30/20 framework tells Alex immediately if they're on track — no line-item obsessing required.",
      },
      {
        type: "callout",
        tone: "tip",
        text: "Don't get caught up in which method is 'correct.' Start with 50/30/20. If you want more control after a month, try zero-based. The goal is to start, not to be perfect.",
      },
      {
        type: "callout",
        tone: "warning",
        text: "Budgets fail when they're too restrictive. Build in 'fun money' — even $50/month — so you don't feel deprived and quit.",
      },
      {
        type: "quiz",
        question: "In the 50/30/20 method, which category does your Netflix subscription fall under?",
        options: [
          { id: "q5a", text: "Needs (50%)" },
          { id: "q5b", text: "Wants (30%)", correct: true },
          { id: "q5c", text: "Savings (20%)" },
          { id: "q5d", text: "It doesn't fit" },
        ],
        explanation: "Streaming services are wants — things that improve your life but you could live without. That makes them part of the 30% Wants bucket.",
      },
    ],
    sources: [
      { name: "CFPB — Budgeting Tools and Resources", url: "https://www.consumerfinance.gov/consumer-tools/managing-your-finances/", type: "regulator", lastReviewed: "2025-01" },
      { name: "Investopedia — 50/30/20 Rule Explained", url: "https://www.investopedia.com/ask/answers/022916/what-502030-budget-rule.asp", type: "reputable-explainer", lastReviewed: "2025-01" },
    ],
  },

  /* ── B2: Starter Budget ──────────────────────────────── */
  {
    id: "b2",
    slug: "starter-budget",
    title: "Build a 10-Minute Starter Budget",
    subtitle: "A real working budget you can set up right now",
    module: "module-b",
    level: "beginner",
    tags: ["budgeting", "cashflow", "level-1", "interactive", "short-lesson"],
    recommendedFor: ["confidence-low", "no-savings"],
    estimatedTime: 8,
    blocks: [
      {
        type: "hero",
        emoji: "✏️",
        title: "Your budget in 10 minutes",
        subtitle: "Simple, actionable, no spreadsheet required",
      },
      {
        type: "bullet-list",
        heading: "What you need before starting",
        items: [
          "Your monthly take-home pay (after taxes)",
          "Your last 2 bank statements",
          "A list of every recurring bill",
        ],
        icon: "check",
      },
      {
        type: "example",
        heading: "Step 1: Start with income",
        scenario: "Write down your monthly take-home pay. If income varies, use your lowest typical month.",
        breakdown: [
          "If paid weekly: multiply 1 weekly check × 4.33",
          "If paid bi-weekly: multiply 1 paycheck × 2.17",
          "If self-employed: use last 3 months average, minus estimated taxes",
        ],
        outcome: "This is your starting number. Everything else comes out of it.",
      },
      {
        type: "example",
        heading: "Step 2: List fixed bills",
        scenario: "Write down every bill that's the same every month",
        breakdown: [
          "Rent/mortgage",
          "Car payment",
          "Insurance (car, health, renters)",
          "Subscriptions (Netflix, Spotify, gym, etc.)",
          "Minimum debt payments",
          "Phone bill",
        ],
        outcome: "Total these up. This is your 'floor' — money you have no control over month-to-month.",
      },
      {
        type: "interactive-slider",
        heading: "Budget calculator — try your numbers",
        description: "Adjust your income and see how much falls into each category",
        calculatorType: "budget",
        sliders: [
          { id: "income", label: "Monthly take-home pay", min: 1000, max: 15000, step: 100, defaultValue: 4000, format: "currency" },
          { id: "needs-pct", label: "Needs %", min: 30, max: 70, step: 5, defaultValue: 50, format: "percent" },
          { id: "wants-pct", label: "Wants %", min: 10, max: 50, step: 5, defaultValue: 30, format: "percent" },
        ],
      },
      {
        type: "callout",
        tone: "tip",
        heading: "The 'good enough' rule",
        text: "Your first budget doesn't need to be perfect. Track for one month, see where you overspent, and adjust. Most people need 2–3 months before it feels natural.",
      },
    ],
    sources: [
      { name: "CFPB — Create a Budget", url: "https://www.consumerfinance.gov/consumer-tools/managing-your-finances/", type: "regulator", lastReviewed: "2025-01" },
    ],
  },

  /* ── B3: Irregular Income ────────────────────────────── */
  {
    id: "b3",
    slug: "irregular-income-budgeting",
    title: "Budgeting with Irregular Income",
    subtitle: "For freelancers, gig workers, and anyone with variable pay",
    module: "module-b",
    level: "beginner",
    tags: ["budgeting", "cashflow", "irregular-income", "1099-income", "level-1", "level-2"],
    recommendedFor: ["1099-income", "confidence-low"],
    estimatedTime: 8,
    blocks: [
      {
        type: "hero",
        emoji: "📈",
        title: "Budgeting when income varies",
        subtitle: "The same rules apply — you just need a different framework",
      },
      {
        type: "callout",
        tone: "warning",
        heading: "The #1 mistake with variable income",
        text: "Spending based on your best months. Budget based on your worst months — anything above that is a bonus you can intentionally allocate.",
      },
      {
        type: "bullet-list",
        heading: "The variable income budget method",
        items: [
          "Step 1: Find your 'floor income' — lowest month in the past 12",
          "Step 2: Build your core budget entirely off that floor",
          "Step 3: Create a 'surplus allocation plan' for good months",
          "Step 4: Keep 1–2 months expenses in a buffer account",
        ],
        icon: "arrow",
      },
      {
        type: "example",
        heading: "Freelancer example: $2,800–$6,500/month range",
        scenario: "Sam's income varies significantly. Here's the framework:",
        breakdown: [
          "Floor income: $2,800 (worst recent month)",
          "Core budget built on $2,800: rent, food, bills, minimum savings",
          "Good month ($5,000): extra $2,200 → $800 buffer, $800 taxes set aside, $600 savings",
          "Great month ($6,500): extra $3,700 → $1,200 buffer top-up, $1,000 taxes, $1,500 savings",
        ],
        outcome: "Sam never panics during slow months because the buffer and core budget cover the essentials. Good months become a bonus, not the expectation.",
      },
      {
        type: "callout",
        tone: "tip",
        heading: "Always set aside 25–30% for taxes",
        text: "If you're 1099/self-employed, you're responsible for your own taxes — including the employer portion of Social Security and Medicare. Set aside 25–30% of every payment before you spend it.",
      },
      {
        type: "comparison",
        heading: "Regular income vs. variable income budgeting",
        left: {
          label: "Regular (W-2)",
          emoji: "📅",
          points: [
            "Same amount every payday",
            "Taxes auto-withheld",
            "Simple to budget",
            "Budget based on actual income",
          ],
        },
        right: {
          label: "Variable (1099)",
          emoji: "📈",
          points: [
            "Income changes monthly",
            "Taxes are your responsibility",
            "Budget based on floor income",
            "Buffer account is critical",
          ],
        },
        note: "Neither is better or worse — just different systems required.",
      },
    ],
    sources: [
      { name: "IRS — Self-Employment Tax", url: "https://www.irs.gov/businesses/small-businesses-self-employed/self-employment-tax-social-security-and-medicare-taxes", type: "government", lastReviewed: "2025-01" },
      { name: "CFPB — Managing Irregular Income", url: "https://www.consumerfinance.gov/about-us/blog/managing-irregular-income/", type: "regulator", lastReviewed: "2025-01" },
    ],
  },

  /* ── B4: Pay Yourself First / Automations ─────────────── */
  {
    id: "b4",
    slug: "pay-yourself-first",
    title: "Automations: The 'Set and Forget' Money Setup",
    subtitle: "Make saving happen automatically — before you can spend it",
    module: "module-b",
    level: "beginner",
    tags: ["budgeting", "systems-habits", "cashflow", "level-1", "short-lesson"],
    estimatedTime: 6,
    blocks: [
      {
        type: "hero",
        emoji: "🔄",
        title: "Let automation do the work",
        subtitle: "The best financial habit is one you never have to think about",
      },
      {
        type: "bullet-list",
        heading: "4 automations that change everything",
        items: [
          "Auto-transfer to savings — on payday, before you see the money",
          "Autopay minimum on credit cards — never miss a payment",
          "Auto-invest — many brokerages allow recurring purchases",
          "Bill autopay — utilities, subscriptions, phone",
        ],
        icon: "check",
      },
      {
        type: "callout",
        tone: "info",
        heading: "Why automation beats willpower",
        text: "Research consistently shows that people who automate saving consistently save more than those who intend to save manually — even when the manual savers have stronger stated intentions.",
      },
      {
        type: "example",
        heading: "A simple automated paycheck flow",
        scenario: "$3,200 hits your checking account on the 1st",
        breakdown: [
          "Day 1: $400 auto-transfers to high-yield savings",
          "Day 2: All fixed bill autopays run ($1,100 total)",
          "Day 2: $200 auto-invests into index fund",
          "Remaining $1,500 is your actual spending money",
        ],
        outcome: "You've saved 19% and invested 6% before spending a dollar — automatically. Your only job is managing the $1,500.",
      },
      {
        type: "callout",
        tone: "tip",
        text: "Start small. Even automating $25/paycheck builds the habit and the account. Increase by $25 every few months — you'll barely feel it.",
      },
    ],
    sources: [
      { name: "CFPB — Saving Automatically", url: "https://www.consumerfinance.gov/about-us/blog/saving-automatically-can-add-up/", type: "regulator", lastReviewed: "2025-01" },
    ],
  },

  /* ── B5: Sinking Funds ────────────────────────────────── */
  {
    id: "b5",
    slug: "sinking-funds",
    title: "Sinking Funds: Save for Irregular Expenses",
    subtitle: "Turn surprise costs into planned ones",
    module: "module-b",
    level: "beginner",
    tags: ["budgeting", "cashflow", "systems-habits", "level-1", "level-2"],
    estimatedTime: 6,
    blocks: [
      {
        type: "hero",
        emoji: "🫙",
        title: "No more 'surprise' expenses",
        subtitle: "A sinking fund makes irregular costs totally predictable",
      },
      {
        type: "callout",
        tone: "info",
        heading: "What is a sinking fund?",
        text: "A sinking fund is money you save monthly for a predictable future expense. Instead of getting hit with a $600 car repair or $1,200 holiday gift bill, you've saved for it in advance — $50–$100/month.",
      },
      {
        type: "bullet-list",
        heading: "Most common sinking fund categories",
        items: [
          "Car maintenance — oil changes, tires, repairs ($50–100/month)",
          "Holiday gifts — Christmas, birthdays, events ($50–150/month)",
          "Travel — vacations and weekend trips ($50–200/month)",
          "Medical — deductible, dental, prescriptions ($25–75/month)",
          "Annual subscriptions — insurance lump sums, memberships ($25–50/month)",
          "Home maintenance — if you own ($100–200/month)",
        ],
        icon: "dot",
      },
      {
        type: "example",
        heading: "Holiday fund math",
        scenario: "You want to spend $1,200 on gifts in December. Today is January.",
        breakdown: [
          "11 months until December",
          "$1,200 ÷ 11 = $109/month",
          "Set up automatic transfer of $110 to 'Holidays' savings label",
          "By November 30: you have $1,200 ready",
        ],
        outcome: "December becomes stress-free. You spend what you planned, not what the credit card allows.",
      },
      {
        type: "callout",
        tone: "tip",
        text: "Many banks let you create labeled sub-accounts or savings 'buckets.' Name them by goal (Car, Travel, Holidays) so it feels tangible.",
      },
    ],
    sources: [
      { name: "CFPB — Savings Goal Planner", url: "https://www.consumerfinance.gov/consumer-tools/managing-your-finances/", type: "regulator", lastReviewed: "2025-01" },
    ],
  },
];
