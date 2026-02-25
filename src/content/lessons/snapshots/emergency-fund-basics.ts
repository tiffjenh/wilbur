/**
 * Snapshot: "Emergency Fund Basics (How to Avoid Money Panic)"
 * Lesson ID: emergency-fund-basics
 * Track: First Job Out of College
 * Domain: moneyFoundations
 *
 * Education-only; 6–8 min read; beginner-friendly.
 * Block types: heading, paragraph, bullets, callout, chips, divider.
 */

export const emergencyFundBasicsSnapshot = {
  hero: {
    headline: "Emergency Fund Basics (How to Avoid Money Panic)",
    subhead:
      "An emergency fund prevents small surprises from turning into credit card debt. It's one of the fastest ways to feel more stable.",
    takeaways: [
      "An emergency fund is cash you can get to quickly — for real surprises, not everyday spending.",
      "Keep it somewhere accessible (like a savings account), not invested, so you can use it when life happens.",
      "Start small. Even a few hundred dollars helps; you can grow it over time.",
    ],
  },

  sections: [
    {
      type: "heading",
      level: 2,
      text: "What an emergency fund is (and isn't)",
    },
    {
      type: "paragraph",
      text: "An emergency fund is money you set aside for unexpected expenses — things that would otherwise force you to borrow or miss a bill. It's not for vacations, upgrades, or things you could plan for. It's a buffer so that when the car breaks down, you get sick, or you lose a shift, you have something to reach for instead of a credit card.",
    },
    {
      type: "callout",
      variant: "tip",
      title: "Real emergencies vs planned spending",
      text: "A real emergency is something you didn't see coming and that has a real consequence if you don't pay (e.g. car repair so you can get to work, a medical bill, a broken appliance that makes your home unsafe). A vacation or a new phone is a goal, not an emergency — save for those separately.",
    },
    {
      type: "heading",
      level: 2,
      text: "Why it reduces stress",
    },
    {
      type: "paragraph",
      text: "When you have no cushion, every surprise becomes a crisis. A flat tire or a doctor visit can spiral into high-interest debt if you put it on a card and can't pay it off. An emergency fund doesn't fix everything — but it turns 'I have no idea how I'll pay for this' into 'I can cover this and then rebuild.' That shift alone reduces anxiety and helps you make clearer decisions.",
    },
    {
      type: "divider",
    },
    {
      type: "heading",
      level: 2,
      text: "Where to keep it",
    },
    {
      type: "paragraph",
      text: "Your emergency fund should be easy to get to when you need it. That usually means a regular savings account (or a separate one you label 'emergency') at a bank or credit union you already use. The goal isn't to earn the highest return — it's to have cash available without selling investments or waiting for transfers. Keep it simple and accessible.",
    },
    {
      type: "chips",
      items: [
        "Savings account (same bank or separate)",
        "Easy to withdraw when you need it",
        "Not in the stock market or locked up",
      ],
    },
    {
      type: "heading",
      level: 2,
      text: "How to start small",
    },
    {
      type: "paragraph",
      text: "You don't need months of expenses on day one. Start with a number that feels doable — even $200 or $500. Put something in every paycheck or every month. Once that feels automatic, add a bit more. The habit of setting money aside matters more than hitting a big number right away.",
    },
    {
      type: "bullets",
      items: [
        "Pick a small first goal (e.g. one month of rent, or $500).",
        "Set up an automatic transfer on payday so it happens before you spend.",
        "Leave the money alone unless you have a real emergency. Replenish it after you use it.",
      ],
    },
    {
      type: "callout",
      variant: "note",
      title: "Education only",
      text: "This lesson is for learning only. It is not personalized financial advice. Your situation is unique — use this as a starting point and adjust for your own life.",
    },
  ],

  bottom: {
    examples: [
      {
        type: "callout",
        variant: "tip",
        title: "Example: Morgan's first emergency fund",
        text: "Morgan started with $25 per paycheck into a separate savings account. After a few months they had $300. When their laptop died and they needed it for work, they used $250 from that account instead of putting it on a card. They felt relief instead of panic, then set a new goal to build back to $500 and keep going.",
      },
    ],
    video: [],
    quiz: {
      title: "Quick check: What did you learn?",
      questions: [
        {
          prompt: "What is an emergency fund for?",
          choices: [
            "Vacations and fun purchases",
            "Unexpected expenses that would otherwise force you to borrow or miss a bill",
            "Investing in the stock market",
          ],
          correctIndex: 1,
          explanation:
            "An emergency fund is for real surprises — car repairs, medical bills, lost income — not for planned or optional spending. It's there so you don't have to rely on credit cards or miss payments when life happens.",
        },
        {
          prompt: "Where should you keep your emergency fund?",
          choices: [
            "In the stock market to grow faster",
            "In a locked account you can't touch for a year",
            "Somewhere accessible, like a savings account, so you can use it when needed",
          ],
          correctIndex: 2,
          explanation:
            "Emergency money should be easy to get to when you need it. A savings account is typical — the goal is availability, not maximum return.",
        },
        {
          prompt: "A good way to start building an emergency fund is:",
          choices: [
            "Waiting until you can save several months of expenses at once",
            "Starting with a small amount and adding to it regularly (e.g. each paycheck)",
            "Only putting money in when you have extra left over",
          ],
          correctIndex: 1,
          explanation:
            "Starting small and making it automatic (e.g. a transfer on payday) builds the habit. You can increase the amount over time; consistency matters more than a big number at the start.",
        },
      ],
    },
    sources: [
      {
        title: "Consumer Financial Protection Bureau – Savings",
        url: "https://www.consumerfinance.gov/consumer-tools/savings/",
      },
      {
        title: "MyMoney.gov – Build an emergency fund",
        url: "https://www.mymoney.gov/",
      },
    ],
  },
} as const;

export default emergencyFundBasicsSnapshot;
