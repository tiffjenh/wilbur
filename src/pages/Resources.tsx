import React, { useState, useMemo } from "react";
import { Icon } from "@/components/ui/Icon";
import { CompoundGrowthSimulator } from "@/components/resources/CompoundGrowthSimulator";
import { PaycheckBreakdownTool } from "@/components/resources/PaycheckBreakdownTool";
import { BudgetBuilder } from "@/components/resources/BudgetBuilder";
import { CreditImpactSimulator } from "@/components/resources/CreditImpactSimulator";
import { GlossaryPanel } from "@/components/resources/GlossaryPanel";
import { TemplatesSection } from "@/components/resources/TemplatesSection";
import { FAQSection } from "@/components/resources/FAQSection";
import { getResourcesPrefill } from "@/lib/resourcesPrefill";

const SectionHeading: React.FC<{ children: React.ReactNode }> = ({ children }) => (
  <h2 style={{ fontFamily: "var(--font-serif)", fontSize: "var(--text-xl)", fontWeight: 600, marginBottom: "var(--space-5)", color: "var(--color-text)" }}>
    {children}
  </h2>
);

type ExpandedId = string | null;

const ResourceCardWrapper: React.FC<{
  id: string;
  title: string;
  description: string;
  expanded: boolean;
  onToggle: () => void;
  children: React.ReactNode;
}> = ({ title, description, expanded, onToggle, children }) => (
  <div
    style={{
      border: "1px solid var(--color-border)",
      borderRadius: "var(--radius-lg)",
      backgroundColor: "var(--color-surface)",
      overflow: "hidden",
    }}
  >
    {!expanded ? (
      <button
        type="button"
        onClick={onToggle}
        style={{
          width: "100%",
          textAlign: "left",
          padding: "var(--space-5)",
          border: "none",
          background: "none",
          cursor: "pointer",
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          flexWrap: "wrap",
          gap: "var(--space-3)",
        }}
      >
        <div>
          <h3 style={{ fontFamily: "var(--font-serif)", fontSize: "var(--text-base)", fontWeight: 600, marginBottom: "6px", color: "var(--color-text)" }}>{title}</h3>
          <p style={{ fontSize: "var(--text-sm)", color: "var(--color-text-muted)", lineHeight: 1.55, margin: 0 }}>{description}</p>
        </div>
        <span style={{ display: "inline-flex", alignItems: "center", gap: 4, fontSize: "var(--text-sm)", color: "var(--color-primary)", fontWeight: 600 }}>
          Open <Icon name="arrow-right" size={14} color="var(--color-primary)" strokeWidth={2} />
        </span>
      </button>
    ) : (
      <div>
        <div style={{ display: "flex", justifyContent: "flex-end", padding: "var(--space-2) var(--space-4)", borderBottom: "1px solid var(--color-border-light)" }}>
          <button type="button" onClick={onToggle} style={{ background: "none", border: "none", cursor: "pointer", fontSize: "var(--text-sm)", color: "var(--color-text-muted)", padding: 4 }}>Collapse</button>
        </div>
        {children}
      </div>
    )}
  </div>
);

export const Resources: React.FC = () => {
  const [expanded, setExpanded] = useState<ExpandedId>(null);
  const prefill = useMemo(() => getResourcesPrefill(), []);

  const toggle = (id: ExpandedId) => setExpanded((v) => (v === id ? null : id));

  return (
    <div className="page-enter" style={{ maxWidth: "var(--page-max)", margin: "0 auto", padding: "var(--space-8) var(--space-6)" }}>
      <h1 style={{ fontFamily: "var(--font-serif)", fontSize: "var(--text-2xl)", fontWeight: 600, marginBottom: "10px", color: "var(--color-text)" }}>
        Resources
      </h1>
      <p style={{ color: "var(--color-text-muted)", fontSize: "var(--text-base)", marginBottom: "var(--space-4)", maxWidth: "480px", lineHeight: 1.6 }}>
        Interactive tools and educational materials to support your financial journey.
      </p>
      {prefill.hasProfile && (
        <p style={{ fontSize: "var(--text-sm)", color: "var(--color-primary)", marginBottom: "var(--space-6)", lineHeight: 1.5 }}>
          Using your profile to prefill inputs where available.
        </p>
      )}

      <section style={{ marginBottom: "var(--space-10)" }}>
        <SectionHeading>Simulators</SectionHeading>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))", gap: "var(--space-5)" }}>
          <ResourceCardWrapper id="compound" title="Compound Growth Simulator" description="See how initial amount, monthly contributions, and time can grow. Hypothetical returns only." expanded={expanded === "compound"} onToggle={() => toggle("compound")}>
            <CompoundGrowthSimulator />
          </ResourceCardWrapper>
          <ResourceCardWrapper id="paycheck" title="Paycheck Breakdown Tool" description="Estimate federal tax, state tax, 401(k) deduction, and take-home. Estimates only; not exact." expanded={expanded === "paycheck"} onToggle={() => toggle("paycheck")}>
            <PaycheckBreakdownTool prefill={prefill.hasProfile ? { annualSalary: prefill.annualSalary, stateCode: prefill.stateCode, filingStatus: "single", is1099: prefill.incomeType === "1099", contribution401kPct: prefill.has401k ? 5 : 0 } : undefined} />
          </ResourceCardWrapper>
          <ResourceCardWrapper id="credit" title="Credit Score Impact Simulator" description="See how common actions may affect a score range. Simplified educational model." expanded={expanded === "credit"} onToggle={() => toggle("credit")}>
            <CreditImpactSimulator />
          </ResourceCardWrapper>
        </div>
      </section>

      <section style={{ marginBottom: "var(--space-10)" }}>
        <SectionHeading>Builders</SectionHeading>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))", gap: "var(--space-5)" }}>
          <ResourceCardWrapper id="budget" title="Budget Builder" description="Allocate income to needs, wants, and savings. Try 50/30/20. Save locally or when logged in." expanded={expanded === "budget"} onToggle={() => toggle("budget")}>
            <BudgetBuilder prefillIncome={prefill.annualSalary ? Math.round(prefill.annualSalary / 12) : undefined} />
          </ResourceCardWrapper>
        </div>
      </section>

      <section style={{ marginBottom: "var(--space-10)" }}>
        <SectionHeading>Glossary</SectionHeading>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))", gap: "var(--space-5)" }}>
          <ResourceCardWrapper id="glossary" title="Glossary" description="Searchable list of financial terms. Click a term for details and related lessons." expanded={expanded === "glossary"} onToggle={() => toggle("glossary")}>
            <GlossaryPanel />
          </ResourceCardWrapper>
        </div>
      </section>

      <section style={{ marginBottom: "var(--space-10)" }}>
        <SectionHeading>Templates</SectionHeading>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))", gap: "var(--space-5)" }}>
          <ResourceCardWrapper id="templates" title="Templates" description="Download CSV templates: Starter Budget, Emergency Fund Tracker, Debt Payoff Tracker, Goal Planner." expanded={expanded === "templates"} onToggle={() => toggle("templates")}>
            <TemplatesSection />
          </ResourceCardWrapper>
        </div>
      </section>

      <section style={{ marginBottom: "var(--space-10)" }}>
        <SectionHeading>FAQs</SectionHeading>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))", gap: "var(--space-5)" }}>
          <ResourceCardWrapper id="faq" title="FAQs" description="Common beginner questions with short, educational answers. Links to related lessons." expanded={expanded === "faq"} onToggle={() => toggle("faq")}>
            <FAQSection />
          </ResourceCardWrapper>
        </div>
      </section>

      <div style={{ backgroundColor: "var(--color-success-bg)", border: "1px solid rgba(45, 106, 79, 0.2)", borderRadius: "var(--radius-md)", padding: "var(--space-4) var(--space-5)", display: "flex", gap: 12, alignItems: "flex-start" }}>
        <Icon name="shield" size={16} color="var(--color-success)" strokeWidth={1.75} style={{ marginTop: "2px", flexShrink: 0 }} />
        <div>
          <span style={{ fontSize: "var(--text-sm)", fontWeight: 600, color: "var(--color-text-secondary)" }}>Educational Content Only</span>
          <p style={{ fontSize: "var(--text-sm)", color: "var(--color-text-muted)", marginTop: "2px", lineHeight: 1.5 }}>
            These tools are for educational purposes only and should not be considered financial advice. All calculations use deterministic formulas; we do not give prescriptive recommendations. Consult a qualified professional for your situation.
          </p>
        </div>
      </div>
    </div>
  );
};
