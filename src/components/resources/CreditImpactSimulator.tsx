import React, { useState } from "react";
import { creditImpact, type CreditScenario } from "@/lib/calculations/credit";

const SCENARIOS: { id: CreditScenario; label: string }[] = [
  { id: "missed_payment", label: "Missed payment" },
  { id: "high_utilization", label: "High utilization" },
  { id: "pay_off_balance", label: "Paying off balance" },
  { id: "new_account", label: "Opening new account" },
];

export const CreditImpactSimulator: React.FC = () => {
  const [currentScore, setCurrentScore] = useState(700);
  const [scenario, setScenario] = useState<CreditScenario>("missed_payment");

  const result = creditImpact({ currentScore, scenario });
  const avgScore = Math.round((result.estimatedScoreLow + result.estimatedScoreHigh) / 2);

  return (
    <div style={{ padding: "var(--space-5)", border: "1px solid var(--color-border)", borderRadius: "var(--radius-lg)", backgroundColor: "var(--color-surface)" }}>
      <h3 style={{ fontFamily: "var(--font-serif)", fontSize: "var(--text-lg)", fontWeight: 600, marginBottom: "var(--space-4)", color: "var(--color-text)" }}>
        Credit Score Impact Simulator
      </h3>
      <div style={{ marginBottom: "var(--space-4)" }}>
        <span style={{ fontSize: "var(--text-xs)", color: "var(--color-text-muted)" }}>Current score (approx.)</span>
        <div style={{ display: "flex", alignItems: "center", gap: 8, marginTop: 4 }}>
          <input type="range" min={300} max={850} step={10} value={currentScore} onChange={(e) => setCurrentScore(Number(e.target.value))} style={{ flex: 1, maxWidth: 280, accentColor: "var(--color-primary)" }} />
          <span style={{ fontSize: "var(--text-sm)", fontWeight: 600, color: "var(--color-primary)", minWidth: 40 }}>{currentScore}</span>
        </div>
      </div>
      <div style={{ marginBottom: "var(--space-4)" }}>
        <span style={{ fontSize: "var(--text-xs)", color: "var(--color-text-muted)" }}>Scenario</span>
        <div style={{ display: "flex", flexWrap: "wrap", gap: "var(--space-2)", marginTop: 8 }}>
          {SCENARIOS.map((s) => (
            <button
              key={s.id}
              type="button"
              onClick={() => setScenario(s.id)}
              style={{
                padding: "8px 14px",
                borderRadius: "var(--radius-md)",
                border: scenario === s.id ? "2px solid var(--color-primary)" : "1px solid var(--color-border)",
                backgroundColor: scenario === s.id ? "var(--color-accent-light)" : "transparent",
                fontSize: "var(--text-sm)",
                fontFamily: "var(--font-sans)",
                cursor: "pointer",
                color: "var(--color-text)",
              }}
            >
              {s.label}
            </button>
          ))}
        </div>
      </div>
      <div style={{ display: "flex", alignItems: "center", gap: "var(--space-6)", marginBottom: "var(--space-5)", flexWrap: "wrap" }}>
        <div style={{ position: "relative", width: 160, height: 90 }}>
          <svg viewBox="0 0 160 90" style={{ width: "100%", height: "100%" }}>
            <path d="M 20 80 A 70 70 0 0 1 140 80" fill="none" stroke="var(--color-border)" strokeWidth="12" strokeLinecap="round" />
            <path d="M 20 80 A 70 70 0 0 1 140 80" fill="none" stroke="var(--color-primary)" strokeWidth="12" strokeLinecap="round" strokeDasharray="220 220" strokeDashoffset={220 - (220 * (avgScore - 300)) / 550} />
          </svg>
          <div style={{ position: "absolute", bottom: 8, left: "50%", transform: "translateX(-50%)", fontSize: "var(--text-xl)", fontWeight: 700, color: "var(--color-primary)", fontFamily: "var(--font-sans)" }}>
            {result.estimatedScoreLow}-{result.estimatedScoreHigh}
          </div>
          <div style={{ position: "absolute", left: 4, bottom: 12, fontSize: 10, color: "var(--color-text-muted)" }}>300</div>
          <div style={{ position: "absolute", right: 4, bottom: 12, fontSize: 10, color: "var(--color-text-muted)" }}>850</div>
        </div>
        <div style={{ flex: "1 1 200px" }}>
          <div style={{ fontSize: "var(--text-sm)", color: "var(--color-text-secondary)", lineHeight: 1.6 }}>{result.explanation}</div>
        </div>
      </div>
      <p style={{ fontSize: "var(--text-xs)", color: "var(--color-text-muted)", lineHeight: 1.5 }}>This is a simplified educational model. Real scores vary.</p>
    </div>
  );
};
