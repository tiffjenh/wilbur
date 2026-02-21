import React from "react";
import { simulators, tools, learningResources } from "@/lib/stubData";
import type { Resource } from "@/lib/stubData";
import { Icon, IconBox } from "@/components/ui/Icon";

const ResourceCard: React.FC<{ resource: Resource }> = ({ resource }) => (
  <div
    className="stagger-item"
    style={{
      backgroundColor: "var(--color-surface)",
      borderRadius: "var(--radius-lg)",
      padding: "var(--space-5)",
      border: "1px solid var(--color-border-light)",
      boxShadow: "var(--shadow-sm)",
      cursor: "pointer",
      transition: "transform var(--duration-fast) var(--ease-out), box-shadow var(--duration-fast) var(--ease-out)",
    }}
    onMouseEnter={(e) => { (e.currentTarget as HTMLElement).style.transform = "translateY(-2px)"; (e.currentTarget as HTMLElement).style.boxShadow = "var(--shadow-md)"; }}
    onMouseLeave={(e) => { (e.currentTarget as HTMLElement).style.transform = "translateY(0)"; (e.currentTarget as HTMLElement).style.boxShadow = "var(--shadow-sm)"; }}
  >
    <IconBox name={resource.icon} size={20} boxSize={44} />
    <h4 style={{ fontFamily: "var(--font-serif)", fontSize: "var(--text-base)", fontWeight: 600, marginBottom: "6px", marginTop: "var(--space-4)" }}>
      {resource.title}
    </h4>
    <p style={{ fontSize: "var(--text-sm)", color: "var(--color-text-muted)", lineHeight: 1.55, marginBottom: "var(--space-4)" }}>
      {resource.description}
    </p>
    <span style={{ display: "inline-flex", alignItems: "center", gap: "4px", fontSize: "var(--text-sm)", color: "var(--color-primary)", fontWeight: 600 }}>
      Try it now <Icon name="arrow-right" size={14} color="var(--color-primary)" strokeWidth={2} />
    </span>
  </div>
);

const SectionHeading: React.FC<{ children: React.ReactNode }> = ({ children }) => (
  <h2 style={{ fontFamily: "var(--font-serif)", fontSize: "var(--text-xl)", fontWeight: 600, marginBottom: "var(--space-5)" }}>
    {children}
  </h2>
);

export const Resources: React.FC = () => (
  <div className="page-enter" style={{ maxWidth: "var(--page-max)", margin: "0 auto", padding: "var(--space-8) var(--space-6)" }}>
    <h1 style={{ fontFamily: "var(--font-serif)", fontSize: "var(--text-2xl)", fontWeight: 600, marginBottom: "10px" }}>
      Resources
    </h1>
    <p style={{ color: "var(--color-text-muted)", fontSize: "var(--text-base)", marginBottom: "var(--space-8)", maxWidth: "480px", lineHeight: 1.6 }}>
      Interactive tools and educational materials to support your financial journey.
    </p>

    <section style={{ marginBottom: "var(--space-10)" }}>
      <SectionHeading>Simulators</SectionHeading>
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(232px, 1fr))", gap: "var(--space-4)" }}>
        {simulators.map((r) => <ResourceCard key={r.id} resource={r} />)}
      </div>
    </section>

    <section style={{ marginBottom: "var(--space-10)" }}>
      <SectionHeading>Tools</SectionHeading>
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(232px, 1fr))", gap: "var(--space-4)" }}>
        {tools.map((r) => <ResourceCard key={r.id} resource={r} />)}
      </div>
    </section>

    <section style={{ marginBottom: "var(--space-10)" }}>
      <SectionHeading>Learning</SectionHeading>
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(232px, 1fr))", gap: "var(--space-4)" }}>
        {learningResources.map((r) => <ResourceCard key={r.id} resource={r} />)}
      </div>
    </section>

    {/* Disclaimer */}
    <div style={{
      backgroundColor: "var(--color-success-bg)",
      border: "1px solid rgba(45, 106, 79, 0.2)",
      borderRadius: "var(--radius-md)",
      padding: "var(--space-4) var(--space-5)",
      display: "flex", gap: "12px", alignItems: "flex-start",
    }}>
      <Icon name="shield" size={16} color="var(--color-success)" strokeWidth={1.75} style={{ marginTop: "2px", flexShrink: 0 }} />
      <div>
        <span style={{ fontSize: "var(--text-sm)", fontWeight: 600, color: "var(--color-text-secondary)" }}>
          Educational Content Only
        </span>
        <p style={{ fontSize: "var(--text-sm)", color: "var(--color-text-muted)", marginTop: "2px", lineHeight: 1.5 }}>
          These tools are for educational purposes only and should not be considered financial advice. Always consult with a qualified financial advisor before making investment decisions.
        </p>
      </div>
    </div>
  </div>
);
