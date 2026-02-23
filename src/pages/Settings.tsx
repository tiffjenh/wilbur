/**
 * Settings page — placeholder for future preferences.
 */
import React from "react";

export const Settings: React.FC = () => (
  <div
    className="page-enter"
    style={{
      minHeight: "calc(100vh - var(--nav-height))",
      padding: "var(--space-8) var(--page-px)",
      maxWidth: "var(--page-max)",
      margin: "0 auto",
      backgroundColor: "var(--color-bg)",
    }}
  >
    <h1 style={{ fontFamily: "var(--font-serif)", fontSize: "var(--text-2xl)", fontWeight: 600, marginBottom: 8 }}>
      Settings
    </h1>
    <p style={{ color: "var(--color-text-muted)", fontSize: "var(--text-base)" }}>
      Coming soon. You’ll be able to manage preferences and notifications here.
    </p>
  </div>
);
