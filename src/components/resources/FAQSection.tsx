import React, { useState } from "react";
import { Link } from "react-router-dom";

const FAQ_ITEMS: { q: string; a: string; lessonSlug?: string }[] = [
  { q: "What's a 401(k)?", a: "A 401(k) is an employer-sponsored retirement account. You contribute from your paycheck, often with a match from your employer. Traditional 401(k) contributions are pre-tax; Roth 401(k) is after-tax. It's a common way to save for retirement.", lessonSlug: "your-first-investing-plan" },
  { q: "What's the difference between Roth and Traditional?", a: "Traditional: you get a tax deduction now and pay tax when you withdraw in retirement. Roth: you pay tax now and withdrawals in retirement are tax-free. The best choice depends on your income and when you expect to pay less tax.", lessonSlug: "your-first-investing-plan" },
  { q: "Should I invest or pay off debt first?", a: "There's no one answer. High-interest debt (e.g. credit cards) usually makes sense to pay down first. Lower-interest debt (e.g. some student loans) might be balanced with investing. It depends on rates and your situation.", lessonSlug: "debt-vs-investing" },
  { q: "What is an ETF?", a: "An ETF (exchange-traded fund) is a fund that holds many securities and trades on an exchange like a stock. ETFs often track an index and offer diversification at low cost.", lessonSlug: "investing-101" },
  { q: "How much should I save?", a: "Common guidelines include building an emergency fund of 3–6 months of expenses first, then saving for goals. A 50/30/20 budget suggests 20% for savings. Your situation may vary.", lessonSlug: "emergency-fund-how-much" },
  { q: "What is compound interest?", a: "Compound interest is earning interest on both your initial money and on the interest you've already earned. Over time it can grow savings significantly.", lessonSlug: "compound-growth" },
  { q: "What is a credit score?", a: "A credit score is a number that summarizes your creditworthiness based on payment history, amounts owed, length of credit history, and other factors. Lenders use it to decide whether to lend and at what rate.", lessonSlug: "credit-score-basics" },
  { q: "What is APY?", a: "APY (Annual Percentage Yield) is the real rate of return on savings in one year, including compounding. It lets you compare different savings accounts.", lessonSlug: "checking-vs-savings" },
  { q: "What is diversification?", a: "Diversification means spreading your money across many investments so that if one does poorly, it doesn't wipe out your portfolio. Index funds are one way to diversify.", lessonSlug: "investing-101" },
  { q: "How do I start budgeting?", a: "Start by tracking where your money goes. Then assign categories (needs, wants, savings). The 50/30/20 rule is one simple split: 50% needs, 30% wants, 20% savings.", lessonSlug: "starter-budget" },
];

export const FAQSection: React.FC = () => {
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  return (
    <div style={{ padding: "var(--space-5)", border: "1px solid var(--color-border)", borderRadius: "var(--radius-lg)", backgroundColor: "var(--color-surface)" }}>
      <h3 style={{ fontFamily: "var(--font-serif)", fontSize: "var(--text-lg)", fontWeight: 600, marginBottom: "var(--space-4)", color: "var(--color-text)" }}>FAQs</h3>
      <p style={{ fontSize: "var(--text-sm)", color: "var(--color-text-muted)", marginBottom: "var(--space-5)", lineHeight: 1.5 }}>Short, educational answers. Not advice.</p>
      <div style={{ display: "flex", flexDirection: "column", gap: "var(--space-2)" }}>
        {FAQ_ITEMS.map((item, i) => (
          <div key={i} style={{ border: "1px solid var(--color-border-light)", borderRadius: "var(--radius-md)", overflow: "hidden" }}>
            <button
              type="button"
              onClick={() => setOpenIndex(openIndex === i ? null : i)}
              style={{ width: "100%", textAlign: "left", padding: "var(--space-3) var(--space-4)", border: "none", background: openIndex === i ? "var(--color-surface-hover)" : "transparent", cursor: "pointer", fontFamily: "var(--font-sans)", fontSize: "var(--text-sm)", fontWeight: 600, color: "var(--color-text)" }}
            >
              {item.q} {openIndex === i ? "−" : "+"}
            </button>
            {openIndex === i && (
              <div style={{ padding: "0 var(--space-4) var(--space-4)", fontSize: "var(--text-sm)", color: "var(--color-text-secondary)", lineHeight: 1.6 }}>
                {item.a}
                {item.lessonSlug && (
                  <div style={{ marginTop: "var(--space-2)" }}>
                    <Link to={"/lesson/" + item.lessonSlug} style={{ color: "var(--color-primary)", fontWeight: 600 }}>Related lesson →</Link>
                  </div>
                )}
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};
