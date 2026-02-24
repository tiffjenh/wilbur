import React, { useMemo } from "react";
import { useParams, Link } from "react-router-dom";
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

/** Card that links to the tool on its own page (navigates to /resources/:slug). */
const ResourceCardLink: React.FC<{
  slug: string;
  title: string;
  description: string;
}> = ({ slug, title, description }) => (
  <Link
    to={`/resources/${slug}`}
    style={{
      display: "block",
      border: "1px solid var(--color-border)",
      borderRadius: "var(--radius-lg)",
      backgroundColor: "var(--color-surface)",
      padding: "var(--space-5)",
      textDecoration: "none",
      color: "inherit",
      textAlign: "left",
      transition: "border-color var(--duration-fast), box-shadow var(--duration-fast)",
    }}
    onMouseEnter={(e) => {
      e.currentTarget.style.borderColor = "var(--color-primary)";
      e.currentTarget.style.boxShadow = "0 0 0 2px var(--color-primary)";
    }}
    onMouseLeave={(e) => {
      e.currentTarget.style.borderColor = "";
      e.currentTarget.style.boxShadow = "";
    }}
  >
    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: "var(--space-3)" }}>
      <div>
        <h3 style={{ fontFamily: "var(--font-serif)", fontSize: "var(--text-base)", fontWeight: 600, marginBottom: "6px", color: "var(--color-text)" }}>{title}</h3>
        <p style={{ fontSize: "var(--text-sm)", color: "var(--color-text-muted)", lineHeight: 1.55, margin: 0 }}>{description}</p>
      </div>
      <span style={{ display: "inline-flex", alignItems: "center", gap: 4, fontSize: "var(--text-sm)", color: "var(--color-primary)", fontWeight: 600 }}>
        Open <Icon name="arrow-right" size={14} color="var(--color-primary)" strokeWidth={2} />
      </span>
    </div>
  </Link>
);

const TOOL_SLUGS = ["compound-growth", "paycheck", "credit", "budget", "glossary", "templates", "faq"] as const;
type ToolSlug = (typeof TOOL_SLUGS)[number];

function isToolSlug(s: string | undefined): s is ToolSlug {
  return s != null && TOOL_SLUGS.includes(s as ToolSlug);
}

/** Single-tool full page (when user navigates to /resources/:slug or opens link in new tab). */
const ResourceToolPage: React.FC<{ slug: ToolSlug }> = ({ slug }) => {
  const prefill = useMemo(() => getResourcesPrefill(), []);

  const backLink = (
    <Link to="/resources" style={{ display: "inline-flex", alignItems: "center", gap: 6, marginBottom: "var(--space-4)", color: "var(--color-primary)", fontWeight: 600, textDecoration: "none" }}>
      <Icon name="chevron-left" size={16} /> Back to Resources
    </Link>
  );

  switch (slug) {
    case "compound-growth":
      return (
        <div className="page-enter" style={{ maxWidth: "var(--page-max)", margin: "0 auto", padding: "var(--space-8) var(--space-6)" }}>
          {backLink}
          <h1 style={{ fontFamily: "var(--font-serif)", fontSize: "var(--text-2xl)", fontWeight: 600, marginBottom: "var(--space-4)", color: "var(--color-text)" }}>Compound Growth Simulator</h1>
          <CompoundGrowthSimulator />
        </div>
      );
    case "paycheck":
      return (
        <div className="page-enter" style={{ maxWidth: "var(--page-max)", margin: "0 auto", padding: "var(--space-8) var(--space-6)" }}>
          {backLink}
          <h1 style={{ fontFamily: "var(--font-serif)", fontSize: "var(--text-2xl)", fontWeight: 600, marginBottom: "var(--space-4)", color: "var(--color-text)" }}>Paycheck Breakdown Tool</h1>
          <PaycheckBreakdownTool prefill={prefill.hasProfile ? { annualSalary: prefill.annualSalary, stateCode: prefill.stateCode, filingStatus: "single", is1099: prefill.incomeType === "1099", contribution401kPct: prefill.has401k ? 5 : 0 } : undefined} />
        </div>
      );
    case "credit":
      return (
        <div className="page-enter" style={{ maxWidth: "var(--page-max)", margin: "0 auto", padding: "var(--space-8) var(--space-6)" }}>
          {backLink}
          <h1 style={{ fontFamily: "var(--font-serif)", fontSize: "var(--text-2xl)", fontWeight: 600, marginBottom: "var(--space-4)", color: "var(--color-text)" }}>Credit Score Impact Simulator</h1>
          <CreditImpactSimulator />
        </div>
      );
    case "budget":
      return (
        <div className="page-enter" style={{ maxWidth: "var(--page-max)", margin: "0 auto", padding: "var(--space-8) var(--space-6)" }}>
          {backLink}
          <h1 style={{ fontFamily: "var(--font-serif)", fontSize: "var(--text-2xl)", fontWeight: 600, marginBottom: "var(--space-4)", color: "var(--color-text)" }}>Budget Builder</h1>
          <BudgetBuilder prefillIncome={prefill.annualSalary ? Math.round(prefill.annualSalary / 12) : undefined} />
        </div>
      );
    case "glossary":
      return (
        <div className="page-enter" style={{ maxWidth: "var(--page-max)", margin: "0 auto", padding: "var(--space-8) var(--space-6)" }}>
          {backLink}
          <h1 style={{ fontFamily: "var(--font-serif)", fontSize: "var(--text-2xl)", fontWeight: 600, marginBottom: "var(--space-4)", color: "var(--color-text)" }}>Glossary</h1>
          <GlossaryPanel />
        </div>
      );
    case "templates":
      return (
        <div className="page-enter" style={{ maxWidth: "var(--page-max)", margin: "0 auto", padding: "var(--space-8) var(--space-6)" }}>
          {backLink}
          <h1 style={{ fontFamily: "var(--font-serif)", fontSize: "var(--text-2xl)", fontWeight: 600, marginBottom: "var(--space-4)", color: "var(--color-text)" }}>Templates</h1>
          <TemplatesSection />
        </div>
      );
    case "faq":
      return (
        <div className="page-enter" style={{ maxWidth: "var(--page-max)", margin: "0 auto", padding: "var(--space-8) var(--space-6)" }}>
          {backLink}
          <h1 style={{ fontFamily: "var(--font-serif)", fontSize: "var(--text-2xl)", fontWeight: 600, marginBottom: "var(--space-4)", color: "var(--color-text)" }}>FAQs</h1>
          <FAQSection />
        </div>
      );
    default:
      return null;
  }
};

export const Resources: React.FC = () => {
  const { slug } = useParams<{ slug: string }>();
  const prefill = useMemo(() => getResourcesPrefill(), []);

  if (isToolSlug(slug)) {
    return <ResourceToolPage slug={slug} />;
  }

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
          <ResourceCardLink slug="compound-growth" title="Compound Growth Simulator" description="See how initial amount, monthly contributions, and time can grow. Hypothetical returns only." />
          <ResourceCardLink slug="paycheck" title="Paycheck Breakdown Tool" description="Estimate federal tax, state tax, 401(k) deduction, and take-home. Estimates only; not exact." />
          <ResourceCardLink slug="credit" title="Credit Score Impact Simulator" description="See how common actions may affect a score range. Simplified educational model." />
        </div>
      </section>

      <section style={{ marginBottom: "var(--space-10)" }}>
        <SectionHeading>Builders</SectionHeading>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))", gap: "var(--space-5)" }}>
          <ResourceCardLink slug="budget" title="Budget Builder" description="Allocate income to needs, wants, and savings. Try 50/30/20. Save locally or when logged in." />
        </div>
      </section>

      <section style={{ marginBottom: "var(--space-10)" }}>
        <SectionHeading>Glossary</SectionHeading>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))", gap: "var(--space-5)" }}>
          <ResourceCardLink slug="glossary" title="Glossary" description="Searchable list of financial terms. Click a term for details and related lessons." />
        </div>
      </section>

      <section style={{ marginBottom: "var(--space-10)" }}>
        <SectionHeading>Templates</SectionHeading>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))", gap: "var(--space-5)" }}>
          <ResourceCardLink slug="templates" title="Templates" description="Download CSV templates: Starter Budget, Emergency Fund Tracker, Debt Payoff Tracker, Goal Planner." />
        </div>
      </section>

      <section style={{ marginBottom: "var(--space-10)" }}>
        <SectionHeading>FAQs</SectionHeading>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))", gap: "var(--space-5)" }}>
          <ResourceCardLink slug="faq" title="FAQs" description="Common beginner questions with short, educational answers. Links to related lessons." />
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
