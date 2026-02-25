/**
 * Snapshot: "Student Loans Basics (What to Do First)"
 * Lesson ID: student-loans-basics
 * Domain: studentLoans
 * Education-only; 6–9 min read; beginner-friendly.
 */

export const studentLoansBasicsSnapshot = {
  hero: {
    headline: "Student Loans Basics (What to Do First)",
    subhead:
      "A simple way to understand your loans, avoid expensive mistakes, and choose a next step without panic.",
    takeaways: [
      "Federal and private loans work differently — know which you have first.",
      "Your first goal is clarity: balance, rate, payment, and repayment plan.",
      "You don't have to do everything at once — start with one safe step.",
    ],
  },

  sections: [
    { type: "heading", level: 2, text: "Start here: what kind of loans do you have?" },
    {
      type: "paragraph",
      text:
        "Before you make a plan, you need one piece of clarity: are your loans federal, private, or both?",
    },
    {
      type: "bullets",
      items: [
        "Federal loans: usually have more flexible repayment options and protections.",
        "Private loans: often have fewer options and can be more expensive.",
        "If you're not sure: that's normal. We'll show a quick way to find out.",
      ],
    },
    {
      type: "callout",
      variant: "note",
      title: "Quick check",
      text:
        "Federal loans typically show up in your StudentAid.gov account. Private loans often show up with a bank or lender name (ex: Sallie Mae, Discover, SoFi, etc.).",
    },
    { type: "divider" },
    { type: "heading", level: 2, text: "The 4 numbers that matter" },
    {
      type: "paragraph",
      text:
        "You do NOT need to memorize loan jargon. To make good decisions, you only need four numbers for each loan:",
    },
    {
      type: "bullets",
      items: [
        "Balance: how much you owe right now.",
        "Interest rate: how expensive the loan is (higher = more urgent).",
        "Minimum payment: what you must pay to stay current.",
        "Due date: when the payment is required.",
      ],
    },
    {
      type: "callout",
      variant: "warning",
      title: "Common mistake",
      text:
        "Only looking at the monthly payment. A low payment can still mean you pay a lot over time if the interest rate is high.",
    },
    { type: "divider" },
    { type: "heading", level: 2, text: "What 'good' looks like (in plain English)" },
    {
      type: "paragraph",
      text:
        "A simple goal: keep your loans healthy while you build stability (budget + emergency fund) so you don't fall into credit card debt.",
    },
    {
      type: "chips",
      items: [
        "Know your loan type (federal vs private)",
        "Pay on time (avoid fees + stress)",
        "Avoid missing payments",
        "Focus extra payments on highest-rate debt (when you can)",
      ],
    },
    {
      type: "callout",
      variant: "note",
      title: "Education-only note",
      text:
        "This is general education. Your best next step depends on your loan type, interest rate, and cash flow — Wilbur won't tell you what to do personally, but we will help you understand your options.",
    },
    { type: "divider" },
    { type: "heading", level: 2, text: "A safe next step (that helps almost everyone)" },
    {
      type: "paragraph",
      text:
        "Pick ONE of these safe steps to do today. You don't need to do all of them at once.",
    },
    {
      type: "bullets",
      items: [
        "List your loans and the 4 numbers (balance, rate, payment, due date).",
        "Turn on autopay if it fits your cash flow (reduces missed payments).",
        "If federal: learn what repayment plan you're on and what your options are.",
      ],
    },
    {
      type: "callout",
      variant: "tip",
      title: "Tip",
      text:
        "If money is tight, your first goal is avoiding missed payments and expensive credit card debt. Stability beats perfection.",
    },
  ],

  bottom: {
    examples: [
      {
        type: "callout",
        variant: "note",
        title: "Example: Jordan (first job, student loans)",
        text:
          "Jordan has $18,000 in federal loans at 4.5% and $6,000 in credit card debt at 24%.\n\nA smart general priority is: pay minimums on everything, avoid missed payments, then focus extra money on the highest-interest debt first (usually credit cards) while keeping student loans current.",
      },
    ],
    video: [],
    quiz: {
      title: "Quick check: student loans",
      questions: [
        {
          prompt: "What's the first thing to figure out before making a student loan plan?",
          choices: [
            "Your favorite repayment strategy",
            "Whether your loans are federal or private",
            "How to invest in stocks",
            "How to refinance immediately",
          ],
          correctIndex: 1,
          explanation:
            "Federal and private loans have different options and protections, so type comes first.",
        },
        {
          prompt: "Which set includes the 4 numbers that matter for each loan?",
          choices: [
            "Balance, interest rate, minimum payment, due date",
            "APR, credit score, taxes, salary",
            "Mortgage rate, rent, car payment, utilities",
            "ETF, dividend, P/E ratio, market cap",
          ],
          correctIndex: 0,
          explanation:
            "These four numbers are enough to make sensible next-step decisions without getting lost.",
        },
        {
          prompt: "What's a common mistake when thinking about student loans?",
          choices: [
            "Checking your due date",
            "Only looking at the monthly payment",
            "Knowing your interest rate",
            "Writing down balances",
          ],
          correctIndex: 1,
          explanation:
            "A low monthly payment can still be expensive over time if the interest rate is high.",
        },
      ],
    },
    sources: [
      {
        title: "Federal Student Aid (StudentAid.gov) — Repayment",
        url: "https://studentaid.gov/manage-loans/repayment",
        domain: "studentaid.gov",
        tier: 1,
      },
      {
        title: "CFPB — Student loans (consumer guidance)",
        url: "https://www.consumerfinance.gov/consumer-tools/student-loans/",
        domain: "consumerfinance.gov",
        tier: 1,
      },
      {
        title: "MyMoney.gov — Student loans basics",
        url: "https://www.mymoney.gov/",
        domain: "mymoney.gov",
        tier: 1,
      },
    ],
  },
} as const;

export default studentLoansBasicsSnapshot;
