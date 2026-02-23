/**
 * Shared citations display for lesson pages and Wilbur AI panel.
 * Renders a list of sources with optional "Why these sources?" tooltip.
 */
import React, { useState } from "react";

export interface CitationItem {
  title: string;
  url: string;
  domain?: string;
  tier?: 1 | 2;
  /** Legacy: government | regulator | reputable-explainer */
  type?: string;
}

const BORDER_LIGHT = "#e2dcd2";
const WHY_SOURCES =
  "Wilbur uses reputable sources like IRS, FDIC, SEC, CFPB, and official state agencies. We prefer primary sources (government and regulators) for rules and tax information.";

interface CitationsListProps {
  citations: CitationItem[];
  /** Section heading */
  heading?: string;
  /** Show "Why these sources?" tooltip */
  showWhyTooltip?: boolean;
  /** Compact style for sidebar (e.g. TutorPanel) */
  compact?: boolean;
  className?: string;
}

export const CitationsList: React.FC<CitationsListProps> = ({
  citations,
  heading = "Sources",
  showWhyTooltip = true,
  compact = false,
  className,
}) => {
  const [showWhy, setShowWhy] = useState(false);

  if (citations.length === 0) return null;

  return (
    <div
      className={className}
      style={{
        marginTop: compact ? 8 : "var(--space-6)",
        padding: compact ? "8px 10px" : "var(--space-4) var(--space-5)",
        backgroundColor: "#f8f6f0",
        borderRadius: "var(--radius-md)",
        border: `1px solid ${BORDER_LIGHT}`,
      }}
    >
      <div
        style={{
          display: "flex",
          alignItems: "center",
          gap: 8,
          marginBottom: 8,
          flexWrap: "wrap",
        }}
      >
        <span
          style={{
            fontSize: "var(--text-xs)",
            fontWeight: 700,
            color: "#7a7a6e",
            textTransform: "uppercase",
            letterSpacing: "0.05em",
          }}
        >
          {heading}
        </span>
        {showWhyTooltip && (
          <span
            role="button"
            tabIndex={0}
            onMouseEnter={() => setShowWhy(true)}
            onMouseLeave={() => setShowWhy(false)}
            onFocus={() => setShowWhy(true)}
            onBlur={() => setShowWhy(false)}
            style={{
              fontSize: "var(--text-xs)",
              color: "var(--color-primary)",
              cursor: "help",
              textDecoration: "underline",
              textDecorationStyle: "dotted",
            }}
          >
            Why these sources?
          </span>
        )}
      </div>
      {showWhy && showWhyTooltip && (
        <div
          style={{
            marginBottom: 8,
            padding: "6px 10px",
            backgroundColor: "rgba(14,92,76,0.06)",
            borderRadius: "var(--radius-sm)",
            fontSize: "var(--text-xs)",
            color: "var(--color-text-secondary)",
            lineHeight: 1.5,
          }}
        >
          {WHY_SOURCES}
        </div>
      )}
      <ul style={{ margin: 0, paddingLeft: 18, listStyle: "none" }}>
        {citations.map((c, i) => (
          <li key={i} style={{ marginBottom: compact ? 2 : 4 }}>
            <a
              href={c.url}
              target="_blank"
              rel="noopener noreferrer"
              style={{
                fontSize: compact ? "var(--text-xs)" : "var(--text-sm)",
                color: "var(--color-primary)",
                textDecoration: "none",
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.textDecoration = "underline";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.textDecoration = "none";
              }}
            >
              {c.title}
            </a>
            {(c.domain || c.type) && (
              <span
                style={{
                  fontSize: "var(--text-xs)",
                  color: "#b0ab9e",
                  marginLeft: 6,
                }}
              >
                ({c.domain ?? c.type})
              </span>
            )}
          </li>
        ))}
      </ul>
    </div>
  );
};
