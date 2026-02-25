/**
 * Snapshot: "Credit Cards: Statement Balance vs Minimum Payment"
 * Lesson ID: credit-cards-statement-balance
 * Track: First Job Out of College
 * Domain: creditDebt
 *
 * Education-only; 6–8 min read; beginner-friendly.
 * Block types: heading, paragraph, bullets, callout, chips, divider.
 */

export const creditCardsStatementBalanceSnapshot = {
  hero: {
    headline: "Credit Cards: Statement Balance vs Minimum Payment",
    subhead:
      "Credit card debt grows quietly when you only pay the minimum. Understanding statement balance, current balance, and minimum payment helps you avoid the trap.",
    takeaways: [
      "Statement balance is what you owed when the bill was generated; current balance includes new charges. Paying the full statement balance by the due date usually avoids interest.",
      "The minimum payment is the smallest amount the card company requires — paying only that leaves the rest to grow with interest.",
      "Paying the full statement balance each month (when you can) keeps you from falling into expensive debt.",
    ],
  },

  sections: [
    {
      type: "heading",
      level: 2,
      text: "Statement balance vs current balance",
    },
    {
      type: "paragraph",
      text: "Your statement balance is a snapshot of what you owed on the day the card company closed your billing cycle and sent your bill. Your current balance is what you owe right now — it includes the statement balance plus any new purchases, minus any payments you've made since the statement. When people say 'pay your balance in full,' they usually mean pay the full statement balance by the due date. If you do that, you typically don't get charged interest on that statement's purchases.",
    },
    {
      type: "chips",
      items: [
        "Statement balance = what you owed when the bill was cut",
        "Current balance = what you owe today (includes new charges and payments)",
        "Due date = when the payment must arrive",
      ],
    },
    {
      type: "heading",
      level: 2,
      text: "What the minimum payment is (and why it's a trap)",
    },
    {
      type: "paragraph",
      text: "The minimum payment is the smallest amount the card company will accept that month. It's often a small percentage of your balance plus fees or interest. If you only pay the minimum, the rest of your balance stays on the card and the card company charges you interest on it. Over time, that interest adds up — and you can end up paying a lot more than you borrowed while the balance barely goes down.",
    },
    {
      type: "callout",
      variant: "tip",
      title: "Aim for statement balance, not minimum",
      text: "When you can, pay the full statement balance by the due date. That way you avoid interest on new purchases and the balance doesn't grow. If you can't pay the full statement balance, pay as much as you can above the minimum — every extra dollar reduces what you'll pay in interest.",
    },
    {
      type: "divider",
    },
    {
      type: "heading",
      level: 2,
      text: "How interest grows (simple version)",
    },
    {
      type: "paragraph",
      text: "When you carry a balance, the card company charges you interest on that amount. The interest is added to your balance, so next month you're paying interest on a slightly larger number. The longer you carry a balance and the higher the rate, the more you pay over time. You don't need to memorize the math — the takeaway is: carrying a balance is expensive, and paying in full when possible keeps you from paying that extra cost.",
    },
    {
      type: "bullets",
      items: [
        "Interest is charged on the balance you don't pay off.",
        "That interest gets added to your balance, so it can grow over time.",
        "Paying the full statement balance by the due date usually means no interest on those purchases.",
      ],
    },
    {
      type: "heading",
      level: 2,
      text: "What 'paying the statement balance' means",
    },
    {
      type: "paragraph",
      text: "When you pay the statement balance in full by the due date, you're paying off everything that was on your last bill. You're not necessarily paying the current balance (which might include new charges). The card company typically gives you a 'grace period' on new purchases when you pay the full statement balance — meaning you won't be charged interest on those new purchases if you pay the next statement in full too. So the habit that helps most: pay the full statement balance by the due date, every time you can.",
    },
    {
      type: "callout",
      variant: "note",
      title: "Education only",
      text: "This lesson is for learning only. It is not personalized financial advice. For help with debt or budgeting, consider a nonprofit credit counselor or a licensed professional.",
    },
  ],

  bottom: {
    examples: [
      {
        type: "callout",
        variant: "tip",
        title: "Example: Jordan checks their bill",
        text: "Jordan's last statement balance was $600 and the minimum payment was $25. They paid $600 by the due date, so they weren't charged interest on that $600. This month their statement balance is $320 (new purchases). They'll pay the full $320 again. If they had only paid the $25 minimum last time, they'd still owe most of the $600 plus interest, and the balance would have grown.",
      },
    ],
    video: [],
    quiz: {
      title: "Quick check: What did you learn?",
      questions: [
        {
          prompt: "What is the statement balance?",
          choices: [
            "The amount you owe right now including all new charges",
            "A snapshot of what you owed when the bill was generated for that billing period",
            "The smallest amount you can pay that month",
          ],
          correctIndex: 1,
          explanation:
            "The statement balance is what you owed when the card company closed the billing cycle and sent your bill. The current balance may be different because of new purchases or payments since then.",
        },
        {
          prompt: "Why is paying only the minimum payment a problem?",
          choices: [
            "The card company will close your account",
            "The rest of the balance stays on the card and you get charged interest, so the debt can grow",
            "You get a lower credit score immediately",
          ],
          correctIndex: 1,
          explanation:
            "When you only pay the minimum, the remaining balance stays on the card and accrues interest. Over time you can pay much more than you borrowed and the balance may barely go down.",
        },
        {
          prompt: "To avoid interest on new purchases, a good habit is:",
          choices: [
            "Paying only the minimum each month",
            "Paying the full statement balance by the due date when you can",
            "Paying the current balance once a year",
          ],
          correctIndex: 1,
          explanation:
            "Paying the full statement balance by the due date typically means you don't get charged interest on that period's purchases (and often get a grace period on new ones). It's the habit that keeps credit card debt from growing.",
        },
      ],
    },
    sources: [
      {
        title: "Consumer Financial Protection Bureau – Credit cards",
        url: "https://www.consumerfinance.gov/consumer-tools/credit-cards/",
      },
      {
        title: "Federal Reserve – What you need to know about credit",
        url: "https://www.federalreserve.gov/consumers.htm",
      },
    ],
  },
} as const;

export default creditCardsStatementBalanceSnapshot;
