import React, { useState, useMemo } from "react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from "recharts";
import { compoundGrowth } from "@/lib/calculations/compound";

const GREEN = "#0E5C4C";
const LIGHT = "#8FD4C6";

export const CompoundGrowthSimulator: React.FC<{
  initialAmount?: number;
  monthlyContribution?: number;
  years?: number;
  annualReturnPct?: number;
}> = (props) => {
  const [initial, setInitial] = useState(props.initialAmount ?? 1000);
  const [monthly, setMonthly] = useState(props.monthlyContribution ?? 200);
  const [yearsVal, setYearsVal] = useState(props.years ?? 20);
  const [rate, setRate] = useState(props.annualReturnPct ?? 7);

  const result = useMemo(
    () => compoundGrowth({ initialAmount: initial, monthlyContribution: monthly, years: yearsVal, annualReturnPct: rate }),
    [initial, monthly, yearsVal, rate],
  );

  const chartData = result.byYear.map((row) => ({
    year: "Year " + row.year,
    balance: row.balance,
    invested: row.invested,
  }));

  return (
    <div style={{ padding: "var(--space-5)", border: "1px solid var(--color-border)", borderRadius: "var(--radius-lg)", backgroundColor: "var(--color-surface)" }}>
      <h3 style={{ fontFamily: "var(--font-serif)", fontSize: "var(--text-lg)", fontWeight: 600, marginBottom: "var(--space-4)", color: "var(--color-text)" }}>
        Compound Growth Simulator
      </h3>
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(140px, 1fr))", gap: "var(--space-4)", marginBottom: "var(--space-5)" }}>
        <label style={{ display: "block" }}>
          <span style={{ fontSize: "var(--text-xs)", color: "var(--color-text-muted)", fontFamily: "var(--font-sans)" }}>Initial amount ($)</span>
          <input type="number" min={0} step={100} value={initial} onChange={(e) => setInitial(Math.max(0, Number(e.target.value) || 0))} style={{ width: "100%", marginTop: 4, padding: "8px 10px", border: "1px solid var(--color-border)", borderRadius: "var(--radius-md)", fontSize: "var(--text-sm)", fontFamily: "var(--font-sans)" }} />
        </label>
        <label style={{ display: "block" }}>
          <span style={{ fontSize: "var(--text-xs)", color: "var(--color-text-muted)", fontFamily: "var(--font-sans)" }}>Monthly contribution ($)</span>
          <input type="number" min={0} step={25} value={monthly} onChange={(e) => setMonthly(Math.max(0, Number(e.target.value) || 0))} style={{ width: "100%", marginTop: 4, padding: "8px 10px", border: "1px solid var(--color-border)", borderRadius: "var(--radius-md)", fontSize: "var(--text-sm)", fontFamily: "var(--font-sans)" }} />
        </label>
        <div>
          <span style={{ fontSize: "var(--text-xs)", color: "var(--color-text-muted)", fontFamily: "var(--font-sans)" }}>Years (1-40)</span>
          <div style={{ display: "flex", alignItems: "center", gap: 8, marginTop: 4 }}>
            <input type="range" min={1} max={40} value={yearsVal} onChange={(e) => setYearsVal(Number(e.target.value))} style={{ flex: 1, accentColor: GREEN }} />
            <span style={{ fontSize: "var(--text-sm)", fontWeight: 600, color: "var(--color-primary)", minWidth: 36 }}>{yearsVal}</span>
          </div>
        </div>
        <div>
          <span style={{ fontSize: "var(--text-xs)", color: "var(--color-text-muted)", fontFamily: "var(--font-sans)" }}>Annual return % (3-12%)</span>
          <div style={{ display: "flex", alignItems: "center", gap: 8, marginTop: 4 }}>
            <input type="range" min={3} max={12} step={0.5} value={rate} onChange={(e) => setRate(Number(e.target.value))} style={{ flex: 1, accentColor: GREEN }} />
            <span style={{ fontSize: "var(--text-sm)", fontWeight: 600, color: "var(--color-primary)", minWidth: 40 }}>{rate}%</span>
          </div>
        </div>
      </div>
      <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: "var(--space-3)", marginBottom: "var(--space-5)" }}>
        <div style={{ textAlign: "center", padding: "var(--space-3)", backgroundColor: "var(--color-accent-light)", borderRadius: "var(--radius-md)", border: "1px solid var(--color-accent-border)" }}>
          <div style={{ fontSize: "var(--text-xs)", color: "var(--color-text-muted)", marginBottom: 4 }}>Total invested</div>
          <div style={{ fontSize: "var(--text-md)", fontWeight: 700, color: "var(--color-primary)" }}>${result.totalInvested.toLocaleString()}</div>
        </div>
        <div style={{ textAlign: "center", padding: "var(--space-3)", backgroundColor: "var(--color-surface-hover)", borderRadius: "var(--radius-md)", border: "1px solid var(--color-border-light)" }}>
          <div style={{ fontSize: "var(--text-xs)", color: "var(--color-text-muted)", marginBottom: 4 }}>Total growth</div>
          <div style={{ fontSize: "var(--text-md)", fontWeight: 700, color: "var(--color-text)" }}>${result.totalGrowth.toLocaleString()}</div>
        </div>
        <div style={{ textAlign: "center", padding: "var(--space-3)", backgroundColor: "var(--color-accent-light)", borderRadius: "var(--radius-md)", border: "1px solid var(--color-accent-border)" }}>
          <div style={{ fontSize: "var(--text-xs)", color: "var(--color-text-muted)", marginBottom: 4 }}>Final value</div>
          <div style={{ fontSize: "var(--text-md)", fontWeight: 700, color: "var(--color-primary)" }}>${result.finalValue.toLocaleString()}</div>
        </div>
      </div>
      <ResponsiveContainer width="100%" height={240}>
        <LineChart data={chartData} margin={{ top: 8, right: 16, bottom: 8, left: 8 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="var(--color-border-light)" vertical={false} />
          <XAxis dataKey="year" tick={{ fontSize: 10, fontFamily: "var(--font-sans)", fill: "var(--color-text-muted)" }} axisLine={false} tickLine={false} interval={Math.max(0, Math.floor(yearsVal / 8))} />
          <YAxis tickFormatter={(v) => "$" + (v / 1000).toFixed(0) + "k"} tick={{ fontSize: 10, fontFamily: "var(--font-sans)", fill: "var(--color-text-muted)" }} axisLine={false} tickLine={false} />
          <Tooltip formatter={(value) => ["$" + Number(value ?? 0).toLocaleString(), ""]} labelFormatter={(l) => l} contentStyle={{ border: "1px solid var(--color-border)", borderRadius: "var(--radius-md)", fontFamily: "var(--font-sans)" }} />
          <Legend wrapperStyle={{ fontSize: 11, fontFamily: "var(--font-sans)" }} formatter={(v) => (v === "balance" ? "Total value" : "Contributions")} />
          <Line type="monotone" dataKey="balance" stroke={GREEN} strokeWidth={2} dot={false} name="balance" />
          <Line type="monotone" dataKey="invested" stroke={LIGHT} strokeWidth={1.5} dot={false} strokeDasharray="5 5" name="invested" />
        </LineChart>
      </ResponsiveContainer>
      <p style={{ fontSize: "var(--text-xs)", color: "var(--color-text-muted)", marginTop: "var(--space-4)", lineHeight: 1.5 }}>This is an educational simulation. Returns are hypothetical and not guaranteed.</p>
    </div>
  );
};
