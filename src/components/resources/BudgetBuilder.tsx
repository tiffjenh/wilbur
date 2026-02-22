import React, { useState, useCallback } from "react";
import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer } from "recharts";
import { useAuth } from "@/contexts/AuthContext";

const WILBUR_COLORS = ["#0E5C4C", "#4A9B8A", "#8FD4C6"];
const LS_BUDGET_KEY = "wilbur_budget";

function loadSavedBudget(): { income: number; needs: number; wants: number } | null {
  try {
    const raw = localStorage.getItem(LS_BUDGET_KEY);
    if (!raw) return null;
    const o = JSON.parse(raw);
    if (typeof o.income === "number" && typeof o.needs === "number" && typeof o.wants === "number") return o;
  } catch {}
  return null;
}

function saveBudgetLocal(income: number, needs: number, wants: number) {
  try {
    localStorage.setItem(LS_BUDGET_KEY, JSON.stringify({ income, needs, wants }));
  } catch {}
}

export const BudgetBuilder: React.FC<{ prefillIncome?: number }> = ({ prefillIncome }) => {
  const { user } = useAuth();
  const saved = loadSavedBudget();
  const [income, setIncome] = useState(saved?.income ?? prefillIncome ?? 4000);
  const [needsPct, setNeedsPct] = useState(saved?.needs ?? 50);
  const [wantsPct, setWantsPct] = useState(saved?.wants ?? 30);
  const [savedMsg, setSavedMsg] = useState(false);

  const savingsPct = Math.max(0, 100 - needsPct - wantsPct);
  const needs = Math.round(income * needsPct / 100);
  const wants = Math.round(income * wantsPct / 100);
  const savings = Math.round(income * savingsPct / 100);
  const overAllocated = needsPct + wantsPct + savingsPct > 100;

  const apply503020 = useCallback(() => {
    setNeedsPct(50);
    setWantsPct(30);
  }, []);

  const handleSave = useCallback(() => {
    saveBudgetLocal(income, needsPct, wantsPct);
    if (user) {}
    setSavedMsg(true);
    setTimeout(() => setSavedMsg(false), 2000);
  }, [income, needsPct, wantsPct, user]);

  const pieData = [
    { name: "Needs", value: needs, color: WILBUR_COLORS[0] },
    { name: "Wants", value: wants, color: WILBUR_COLORS[1] },
    { name: "Savings", value: savings, color: WILBUR_COLORS[2] },
  ].filter((d) => d.value > 0);

  return (
    <div style={{ padding: "var(--space-5)", border: "1px solid var(--color-border)", borderRadius: "var(--radius-lg)", backgroundColor: "var(--color-surface)" }}>
      <h3 style={{ fontFamily: "var(--font-serif)", fontSize: "var(--text-lg)", fontWeight: 600, marginBottom: "var(--space-4)", color: "var(--color-text)" }}>Budget Builder</h3>
      <div style={{ marginBottom: "var(--space-4)" }}>
        <span style={{ fontSize: "var(--text-xs)", color: "var(--color-text-muted)" }}>Monthly income ($)</span>
        <input type="number" min={0} step={100} value={income} onChange={(e) => setIncome(Math.max(0, Number(e.target.value) || 0))} style={{ display: "block", marginTop: 4, maxWidth: 200, padding: "8px 10px", border: "1px solid var(--color-border)", borderRadius: "var(--radius-md)", fontSize: "var(--text-sm)", fontFamily: "var(--font-sans)" }} />
      </div>
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "var(--space-4)", marginBottom: "var(--space-4)" }}>
        <div>
          <span style={{ fontSize: "var(--text-xs)", color: "var(--color-text-muted)" }}>Needs %</span>
          <div style={{ display: "flex", alignItems: "center", gap: 8, marginTop: 4 }}>
            <input type="range" min={10} max={80} value={needsPct} onChange={(e) => setNeedsPct(Number(e.target.value))} style={{ flex: 1, accentColor: "var(--color-primary)" }} />
            <span style={{ fontSize: "var(--text-sm)", fontWeight: 600, color: "var(--color-primary)", minWidth: 36 }}>{needsPct}%</span>
          </div>
        </div>
        <div>
          <span style={{ fontSize: "var(--text-xs)", color: "var(--color-text-muted)" }}>Wants %</span>
          <div style={{ display: "flex", alignItems: "center", gap: 8, marginTop: 4 }}>
            <input type="range" min={10} max={60} value={wantsPct} onChange={(e) => setWantsPct(Number(e.target.value))} style={{ flex: 1, accentColor: "var(--color-primary)" }} />
            <span style={{ fontSize: "var(--text-sm)", fontWeight: 600, color: "var(--color-primary)", minWidth: 36 }}>{wantsPct}%</span>
          </div>
        </div>
      </div>
      <button type="button" onClick={apply503020} style={{ marginBottom: "var(--space-4)", padding: "8px 16px", backgroundColor: "var(--color-primary)", color: "var(--color-primary-text)", border: "none", borderRadius: "var(--radius-md)", fontSize: "var(--text-sm)", fontWeight: 600, fontFamily: "var(--font-sans)", cursor: "pointer" }}>Auto-distribute 50/30/20</button>
      {overAllocated && (
        <div style={{ marginBottom: "var(--space-4)", padding: "var(--space-3)", backgroundColor: "rgba(217,83,79,0.08)", border: "1px solid rgba(217,83,79,0.25)", borderRadius: "var(--radius-md)", fontSize: "var(--text-sm)", color: "var(--color-text-secondary)" }}>Total allocation is over 100%. Reduce needs or wants.</div>
      )}
      <div style={{ display: "flex", gap: "var(--space-4)", marginBottom: "var(--space-5)", flexWrap: "wrap" }}>
        <div style={{ flex: "1 1 200px" }}>
          <ResponsiveContainer width="100%" height={200}>
            <PieChart>
              <Pie data={pieData.length ? pieData : [{ name: "None", value: 1, color: "var(--color-border)" }]} cx="50%" cy="50%" innerRadius={50} outerRadius={80} paddingAngle={2} dataKey="value" nameKey="name">
                {(pieData.length ? pieData : [{ color: "var(--color-border)" }]).map((e, i) => (
                  <Cell key={i} fill={e.color ?? "var(--color-border)"} />
                ))}
              </Pie>
              <Tooltip formatter={(v) => ["$" + Number(v ?? 0).toLocaleString(), ""]} />
            </PieChart>
          </ResponsiveContainer>
        </div>
        <div style={{ display: "flex", flexDirection: "column", gap: "var(--space-2)", justifyContent: "center" }}>
          <div style={{ display: "flex", alignItems: "center", gap: 8 }}><div style={{ width: 12, height: 12, borderRadius: 2, backgroundColor: WILBUR_COLORS[0] }} /><span style={{ fontSize: "var(--text-sm)", color: "var(--color-text-secondary)" }}>Needs: ${needs.toLocaleString()} ({needsPct}%)</span></div>
          <div style={{ display: "flex", alignItems: "center", gap: 8 }}><div style={{ width: 12, height: 12, borderRadius: 2, backgroundColor: WILBUR_COLORS[1] }} /><span style={{ fontSize: "var(--text-sm)", color: "var(--color-text-secondary)" }}>Wants: ${wants.toLocaleString()} ({wantsPct}%)</span></div>
          <div style={{ display: "flex", alignItems: "center", gap: 8 }}><div style={{ width: 12, height: 12, borderRadius: 2, backgroundColor: WILBUR_COLORS[2] }} /><span style={{ fontSize: "var(--text-sm)", color: "var(--color-text-secondary)" }}>Savings: ${savings.toLocaleString()} ({savingsPct}%)</span></div>
        </div>
      </div>
      <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
        <button type="button" onClick={handleSave} style={{ padding: "8px 16px", backgroundColor: "var(--color-primary)", color: "var(--color-primary-text)", border: "none", borderRadius: "var(--radius-md)", fontSize: "var(--text-sm)", fontWeight: 600, fontFamily: "var(--font-sans)", cursor: "pointer" }}>Save</button>
        {savedMsg && <span style={{ fontSize: "var(--text-sm)", color: "var(--color-primary)" }}>Saved.</span>}
      </div>
      <p style={{ fontSize: "var(--text-xs)", color: "var(--color-text-muted)", marginTop: "var(--space-4)", lineHeight: 1.5 }}>For educational use. This is not financial advice.</p>
    </div>
  );
};
