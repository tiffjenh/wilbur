import React, { useState, useMemo } from "react";
import { Link } from "react-router-dom";

export interface GlossaryTerm {
  term: string;
  definition: string;
  lessonSlug?: string;
}

const GLOSSARY_TERMS: GlossaryTerm[] = [
  { term: "APY", definition: "Annual Percentage Yield. The real rate of return on savings in one year, including compounding. A higher APY means more interest earned.", lessonSlug: "checking-vs-savings" },
  { term: "Compound interest", definition: "Interest earned on both your principal and on interest you already earned. Over time it can grow savings significantly.", lessonSlug: "compound-growth" },
  { term: "Dividend", definition: "A payment some companies make to shareholders from profits. Not all stocks pay dividends.", lessonSlug: "investing-101" },
  { term: "ETF", definition: "Exchange-traded fund. A fund that holds many securities and trades on an exchange like a stock. Often low-cost and diversified.", lessonSlug: "investing-101" },
  { term: "Roth IRA", definition: "An individual retirement account where you contribute after-tax money. Growth and qualified withdrawals in retirement are tax-free.", lessonSlug: "your-first-investing-plan" },
  { term: "Utilization", definition: "Credit utilization is the share of your total credit limit you are using. Keeping it under 30% can help your credit score.", lessonSlug: "credit-score-basics" },
  { term: "Vesting", definition: "The process of earning ownership of employer-matched retirement or stock over time. Until you are vested, you may lose some if you leave.", lessonSlug: "your-first-investing-plan" },
  { term: "401(k)", definition: "An employer-sponsored retirement account. You contribute from pay, often with a match. Traditional is pre-tax; Roth 401(k) is after-tax.", lessonSlug: "your-first-investing-plan" },
  { term: "Index fund", definition: "A fund that tracks a market index (e.g. S&P 500) instead of picking stocks. Offers broad diversification and usually low fees.", lessonSlug: "investing-101" },
  { term: "Emergency fund", definition: "Savings set aside for unexpected expenses like job loss or medical bills. Often 3–6 months of expenses in a separate account.", lessonSlug: "emergency-fund-how-much" },
  { term: "Dollar-cost averaging", definition: "Investing a fixed amount on a schedule regardless of price. Can reduce the impact of volatility over time.", lessonSlug: "dollar-cost-averaging" },
  { term: "Diversification", definition: "Spreading money across many investments to reduce the impact of any single one doing poorly.", lessonSlug: "investing-101" },
  { term: "FDIC", definition: "Federal Deposit Insurance Corporation. Insures bank deposits up to $250,000 per depositor per bank in the US.", lessonSlug: "checking-vs-savings" },
  { term: "Credit score", definition: "A number that summarizes your creditworthiness based on payment history, amounts owed, length of history, and other factors.", lessonSlug: "credit-score-basics" },
].sort((a, b) => a.term.localeCompare(b.term, undefined, { sensitivity: "base" }));

export const GlossaryPanel: React.FC<{
  onTermClick?: (term: GlossaryTerm) => void;
}> = ({ onTermClick }) => {
  const [search, setSearch] = useState("");
  const [modalTerm, setModalTerm] = useState<GlossaryTerm | null>(null);

  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase();
    if (!q) return GLOSSARY_TERMS;
    return GLOSSARY_TERMS.filter((t) => t.term.toLowerCase().includes(q) || t.definition.toLowerCase().includes(q));
  }, [search]);

  const byLetter = useMemo(() => {
    const map: Record<string, GlossaryTerm[]> = {};
    for (const t of filtered) {
      const letter = t.term[0].toUpperCase();
      if (!map[letter]) map[letter] = [];
      map[letter].push(t);
    }
    return map;
  }, [filtered]);

  const handleClick = (term: GlossaryTerm) => {
    if (onTermClick) onTermClick(term);
    else setModalTerm(term);
  };

  return (
    <div style={{ padding: "var(--space-5)", border: "1px solid var(--color-border)", borderRadius: "var(--radius-lg)", backgroundColor: "var(--color-surface)" }}>
      <h3 style={{ fontFamily: "var(--font-serif)", fontSize: "var(--text-lg)", fontWeight: 600, marginBottom: "var(--space-4)", color: "var(--color-text)" }}>Glossary</h3>
      <input
        type="search"
        placeholder="Search terms..."
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        style={{ width: "100%", marginBottom: "var(--space-4)", padding: "10px 12px", border: "1px solid var(--color-border)", borderRadius: "var(--radius-md)", fontSize: "var(--text-sm)", fontFamily: "var(--font-sans)" }}
      />
      <div style={{ display: "flex", flexWrap: "wrap", gap: "4px 8px", marginBottom: "var(--space-4)" }}>
        {Object.keys(byLetter).sort().map((letter) => (
          <a key={letter} href={"#glossary-" + letter} style={{ fontSize: "var(--text-xs)", color: "var(--color-primary)", fontWeight: 600, textDecoration: "none" }}>{letter}</a>
        ))}
      </div>
      <div style={{ maxHeight: 360, overflowY: "auto" }}>
        {Object.entries(byLetter).map(([letter, terms]) => (
          <div key={letter} id={"glossary-" + letter} style={{ marginBottom: "var(--space-4)" }}>
            <div style={{ fontSize: "var(--text-sm)", fontWeight: 700, color: "var(--color-text-muted)", marginBottom: "var(--space-2)" }}>{letter}</div>
            {terms.map((t) => (
              <button
                key={t.term}
                type="button"
                onClick={() => handleClick(t)}
                style={{ display: "block", width: "100%", textAlign: "left", padding: "var(--space-2) 0", border: "none", background: "none", cursor: "pointer", fontFamily: "var(--font-sans)", fontSize: "var(--text-sm)", color: "var(--color-text)", borderBottom: "1px solid var(--color-border-light)" }}
              >
                <strong>{t.term}</strong> — {t.definition.slice(0, 80)}{t.definition.length > 80 ? "…" : ""}
              </button>
            ))}
          </div>
        ))}
      </div>
      {modalTerm && (
        <>
          <div style={{ position: "fixed", inset: 0, backgroundColor: "rgba(0,0,0,0.2)", zIndex: 9998 }} onClick={() => setModalTerm(null)} />
          <div style={{ position: "fixed", left: "50%", top: "50%", transform: "translate(-50%, -50%)", maxWidth: 420, width: "calc(100% - 32px)", padding: "var(--space-5)", backgroundColor: "var(--color-surface)", border: "1px solid var(--color-border)", borderRadius: "var(--radius-lg)", zIndex: 9999 }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: "var(--space-4)" }}>
              <h4 style={{ fontFamily: "var(--font-serif)", fontSize: "var(--text-lg)", fontWeight: 600, color: "var(--color-primary)", margin: 0 }}>{modalTerm.term}</h4>
              <button type="button" onClick={() => setModalTerm(null)} style={{ background: "none", border: "none", cursor: "pointer", fontSize: 20, color: "var(--color-text-muted)" }}>×</button>
            </div>
            <p style={{ fontSize: "var(--text-sm)", color: "var(--color-text-secondary)", lineHeight: 1.6, marginBottom: "var(--space-4)" }}>{modalTerm.definition}</p>
            {modalTerm.lessonSlug && (
              <Link to={"/lesson/" + modalTerm.lessonSlug} style={{ fontSize: "var(--text-sm)", color: "var(--color-primary)", fontWeight: 600 }}>Related lesson →</Link>
            )}
          </div>
        </>
      )}
    </div>
  );
};
