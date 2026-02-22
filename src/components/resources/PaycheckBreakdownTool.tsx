import React, { useState, useMemo } from "react";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, Legend } from "recharts";
import { paycheckBreakdown } from "@/lib/calculations/paycheck";
import { getStateTaxProfile } from "@/lib/recommendation/stateTax";
import { US_STATE_CODES } from "@/lib/onboardingSchema";

const WILBUR_COLORS = ["#0E5C4C", "#4A9B8A", "#8FD4C6", "#C4EAE5"];

export const PaycheckBreakdownTool: React.FC<{
  prefill?: { annualSalary?: number; stateCode?: string; filingStatus?: "single" | "married"; is1099?: boolean; contribution401kPct?: number };
}> = ({ prefill }) => {
  const [annualSalary, setAnnualSalary] = useState(prefill?.annualSalary ?? 60000);
  const [contribution401kPct, setContribution401kPct] = useState(prefill?.contribution401kPct ?? 5);
  const [stateCode, setStateCode] = useState(prefill?.stateCode ?? "CA");
  const [filingStatus, setFilingStatus] = useState<"single" | "married">(prefill?.filingStatus ?? "single");
  const [is1099, setIs1099] = useState(prefill?.is1099 ?? false);

  const result = useMemo(
    () => paycheckBreakdown({ annualSalary, contribution401kPct: contribution401kPct, stateCode, filingStatus, is1099 }),
    [annualSalary, contribution401kPct, stateCode, filingStatus, is1099],
  );

  const stateProfile = getStateTaxProfile(stateCode);
  const barData = result.breakdown.map((d) => ({ label: d.label, value: d.value, fill: d.color }));

  return (
    <div
      style={{
        padding: "var(--space-5)",
        border: "1px solid var(--color-border)",
        borderRadius: "var(--radius-lg)",
        backgroundColor: "var(--color-surface)",
      }}
    >
      <h3 style={{ fontFamily: "var(--font-serif)", fontSize: "var(--text-lg)", fontWeight: 600, marginBottom: "var(--space-4)", color: "var(--color-text)" }}>
        Paycheck Breakdown Tool
      </h3>

      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(160px, 1fr))", gap: "var(--space-4)", marginBottom: "var(--space-5)" }}>
        <label style={{ display: "block" }}>
          <span style={{ fontSize: "var(--text-xs)", color: "var(--color-text-muted)" }}>Annual salary ($)</span>
          <input
            type="number"
            min={0}
            step={1000}
            value={annualSalary}
            onChange={(e) => setAnnualSalary(Math.max(0, Number(e.target.value) || 0))}
            style={{ width: "100%", marginTop: 4, padding: "8px 10px", border: "1px solid var(--color-border)", borderRadius: "var(--radius-md)", fontSize: "var(--text-sm)", fontFamily: "var(--font-sans)" }}
          />
        </label>
        <label style={{ display: "block" }}>
          <span style={{ fontSize: "var(--text-xs)", color: "var(--color-text-muted)" }}>401(k) %</span>
          <input
            type="number"
            min={0}
            max={100}
            step={1}
            value={contribution401kPct}
            onChange={(e) => setContribution401kPct(Math.max(0, Math.min(100, Number(e.target.value) || 0)))}
            style={{ width: "100%", marginTop: 4, padding: "8px 10px", border: "1px solid var(--color-border)", borderRadius: "var(--radius-md)", fontSize: "var(--text-sm)", fontFamily: "var(--font-sans)" }}
          />
        </label>
        <label style={{ display: "block" }}>
          <span style={{ fontSize: "var(--text-xs)", color: "var(--color-text-muted)" }}>State</span>
          <select
            value={stateCode}
            onChange={(e) => setStateCode(e.target.value)}
            style={{ width: "100%", marginTop: 4, padding: "8px 10px", border: "1px solid var(--color-border)", borderRadius: "var(--radius-md)", fontSize: "var(--text-sm)", fontFamily: "var(--font-sans)" }}
          >
            {(US_STATE_CODES as readonly string[]).filter((c) => c !== "prefer_not").map((c) => (
              <option key={c} value={c}>{c}</option>
            ))}
          </select>
        </label>
        <label style={{ display: "block" }}>
          <span style={{ fontSize: "var(--text-xs)", color: "var(--color-text-muted)" }}>Filing status</span>
          <select
            value={filingStatus}
            onChange={(e) => setFilingStatus(e.target.value as "single" | "married")}
            style={{ width: "100%", marginTop: 4, padding: "8px 10px", border: "1px solid var(--color-border)", borderRadius: "var(--radius-md)", fontSize: "var(--text-sm)", fontFamily: "var(--font-sans)" }}
          >
            <option value="single">Single</option>
            <option value="married">Married</option>
          </select>
        </label>
        <label style={{ display: "flex", alignItems: "center", gap: 8, marginTop: 24 }}>
          <input type="checkbox" checked={is1099} onChange={(e) => setIs1099(e.target.checked)} style={{ accentColor: "var(--color-primary)" }} />
          <span style={{ fontSize: "var(--text-sm)", color: "var(--color-text-secondary)" }}>1099 / Freelance</span>
        </label>
      </div>

      <div style={{ marginBottom: "var(--space-5)", padding: "var(--space-4)", border: "1px solid var(--color-border-light)", borderRadius: "var(--radius-md)", backgroundColor: "var(--color-surface-hover)" }}>
        <div style={{ fontSize: "var(--text-xs)", color: "var(--color-text-muted)", marginBottom: 4 }}>Estimated annual take-home</div>
        <div style={{ fontSize: "var(--text-2xl)", fontWeight: 700, color: "var(--color-primary)", fontFamily: "var(--font-sans)" }}>
          ${result.netTakeHome.toLocaleString()}
        </div>
        <div style={{ fontSize: "var(--text-xs)", color: "var(--color-text-muted)", marginTop: 4 }}>≈ ${Math.round(result.netTakeHome / 12).toLocaleString()} / month</div>
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "var(--space-6)", marginBottom: "var(--space-5)" }}>
        <div>
          <div style={{ fontSize: "var(--text-sm)", fontWeight: 600, marginBottom: 8, color: "var(--color-text)" }}>Breakdown (bar)</div>
          <ResponsiveContainer width="100%" height={200}>
            <BarChart data={barData} layout="vertical" margin={{ left: 8, right: 16 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="var(--color-border-light)" horizontal={false} />
              <XAxis type="number" tickFormatter={(v) => `$${(v / 1000).toFixed(0)}k`} tick={{ fontSize: 10, fontFamily: "var(--font-sans)", fill: "var(--color-text-muted)" }} axisLine={false} tickLine={false} />
              <YAxis type="category" dataKey="label" width={70} tick={{ fontSize: 11, fontFamily: "var(--font-sans)", fill: "var(--color-text-secondary)" }} axisLine={false} tickLine={false} />
              <Tooltip formatter={(v) => ["$" + Number(v ?? 0).toLocaleString(), ""]} contentStyle={{ border: "1px solid var(--color-border)", borderRadius: "var(--radius-md)", fontFamily: "var(--font-sans)" }} />
              <Bar dataKey="value" fill="var(--color-primary)" radius={[0, 4, 4, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
        <div>
          <div style={{ fontSize: "var(--text-sm)", fontWeight: 600, marginBottom: 8, color: "var(--color-text)" }}>Breakdown (pie)</div>
          <PieChart width={220} height={200}>
            <Pie
              data={result.breakdown.map((d) => ({ ...d, name: d.label }))}
              cx={110}
              cy={95}
              innerRadius={50}
              outerRadius={75}
              paddingAngle={2}
              dataKey="value"
            >
              {result.breakdown.map((_, i) => (
                <Cell key={i} fill={WILBUR_COLORS[i % WILBUR_COLORS.length]} />
              ))}
            </Pie>
            <Tooltip formatter={(v) => ["$" + Number(v ?? 0).toLocaleString(), ""]} />
            <Legend wrapperStyle={{ fontSize: 11 }} />
          </PieChart>
        </div>
      </div>

      <p style={{ fontSize: "var(--text-xs)", color: "var(--color-text-muted)", marginBottom: 8, lineHeight: 1.5 }}>
        Estimates only. Not exact tax calculations. For official rules see{" "}
        <a href="https://www.irs.gov" target="_blank" rel="noopener noreferrer" style={{ color: "var(--color-primary)" }}>IRS</a>
        {stateProfile?.hasStateIncomeTax && stateProfile.stateTaxAgencyUrl && (
          <> and your state tax agency: <a href={stateProfile.stateTaxAgencyUrl} target="_blank" rel="noopener noreferrer" style={{ color: "var(--color-primary)" }}>state taxes</a></>
        )}.
      </p>
    </div>
  );
};
