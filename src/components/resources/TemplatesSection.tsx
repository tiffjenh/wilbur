import React from "react";

function downloadCsv(filename: string, rows: string[][]) {
  const csv = rows.map((row) => row.map((c) => '"' + String(c).replace(/"/g, '""') + '"').join(",")).join("\n");
  const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = filename;
  a.click();
  URL.revokeObjectURL(url);
}

export const TemplatesSection: React.FC = () => {
  const templates = [
    { title: "Starter Budget", desc: "Basic categories to plan income and expenses.", file: "wilbur-starter-budget.csv", rows: [["Category", "Planned ($)", "Actual ($)"], ["Income", "", ""], ["Housing", "", ""], ["Food", "", ""], ["Savings", "", ""]] },
    { title: "Emergency Fund Tracker", desc: "Track progress toward 3-6 months of expenses.", file: "wilbur-emergency-fund.csv", rows: [["Month", "Target ($)", "Saved ($)"], ["1", "", ""], ["2", "", ""], ["3", "", ""], ["4", "", ""], ["5", "", ""], ["6", "", ""]] },
    { title: "Debt Payoff Tracker", desc: "List debts and track payoff progress.", file: "wilbur-debt-payoff.csv", rows: [["Debt", "Balance ($)", "APR %", "Min payment ($)"], ["", "", "", ""]] },
    { title: "3-5 Year Goal Planner", desc: "Set goals and estimate monthly savings needed.", file: "wilbur-goal-planner.csv", rows: [["Goal", "Target ($)", "Years", "Monthly ($)"], ["", "", "", ""]] },
  ];

  return (
    <div style={{ padding: "var(--space-5)", border: "1px solid var(--color-border)", borderRadius: "var(--radius-lg)", backgroundColor: "var(--color-surface)" }}>
      <h3 style={{ fontFamily: "var(--font-serif)", fontSize: "var(--text-lg)", fontWeight: 600, marginBottom: "var(--space-4)", color: "var(--color-text)" }}>Templates</h3>
      <p style={{ fontSize: "var(--text-sm)", color: "var(--color-text-muted)", marginBottom: "var(--space-5)", lineHeight: 1.5 }}>Download CSV templates for spreadsheets or printing.</p>
      <div style={{ display: "grid", gap: "var(--space-3)" }}>
        {templates.map((t) => (
          <div key={t.title} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "var(--space-3)", border: "1px solid var(--color-border-light)", borderRadius: "var(--radius-md)", flexWrap: "wrap", gap: "var(--space-2)" }}>
            <div>
              <div style={{ fontSize: "var(--text-sm)", fontWeight: 600, color: "var(--color-text)" }}>{t.title}</div>
              <div style={{ fontSize: "var(--text-xs)", color: "var(--color-text-muted)", marginTop: 2 }}>{t.desc}</div>
            </div>
            <button type="button" onClick={() => downloadCsv(t.file, t.rows)} style={{ padding: "8px 16px", backgroundColor: "var(--color-primary)", color: "var(--color-primary-text)", border: "none", borderRadius: "var(--radius-md)", fontSize: "var(--text-sm)", fontWeight: 600, fontFamily: "var(--font-sans)", cursor: "pointer" }}>Download CSV</button>
          </div>
        ))}
      </div>
    </div>
  );
};
