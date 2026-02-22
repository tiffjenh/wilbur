import React, { useState } from "react";
import { Button } from "@/components/ui/Button";
import { AccountPopup } from "@/components/ui/Modal";
import { Icon } from "@/components/ui/Icon";
import type { IconName } from "@/components/ui/Icon";
import { useNavigate } from "react-router-dom";

type Tab = "account" | "goals" | "preferences" | "privacy";

const tabs: { id: Tab; label: string; icon: IconName }[] = [
  { id: "account",     label: "Account Settings",  icon: "user"     },
  { id: "goals",       label: "Financial Goals",    icon: "target"   },
  { id: "preferences", label: "Preferences",        icon: "settings" },
  { id: "privacy",     label: "Privacy & Security", icon: "shield"   },
];

const fieldIcons: Record<string, IconName> = {
  "Full Name": "user",
  "Email":     "sparkle",
  "Password":  "lock",
};

export const Profile: React.FC = () => {
  const [activeTab, setActiveTab] = useState<Tab>("account");
  const [showPopup, setShowPopup] = useState(false);
  const navigate = useNavigate();

  return (
    <>
      <div className="page-enter" style={{ maxWidth: "var(--page-max)", margin: "0 auto", padding: "var(--space-8) var(--space-6)" }}>
        <h1 style={{ fontFamily: "var(--font-serif)", fontSize: "var(--text-2xl)", fontWeight: 600, marginBottom: "8px" }}>
          My Profile
        </h1>
        <p style={{ color: "var(--color-text-muted)", fontSize: "var(--text-base)", marginBottom: "var(--space-8)" }}>
          Manage your account settings and personalize your learning experience.
        </p>

        <div style={{ display: "flex", gap: "var(--space-6)", alignItems: "flex-start" }}>
          {/* Sidebar tabs */}
          <nav style={{ width: "212px", flexShrink: 0, display: "flex", flexDirection: "column", gap: "2px" }}>
            {tabs.map((tab) => {
              const active = activeTab === tab.id;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  style={{
                    display: "flex", alignItems: "center", gap: "10px",
                    padding: "11px var(--space-4)", borderRadius: "var(--radius-md)",
                    border: active ? "1px solid var(--color-border-light)" : "1px solid transparent",
                    backgroundColor: active ? "var(--color-surface)" : "transparent",
                    boxShadow: active ? "var(--shadow-sm)" : "none",
                    cursor: "pointer",
                    fontSize: "var(--text-sm)", fontWeight: active ? 600 : 500,
                    color: active ? "var(--color-text)" : "var(--color-text-secondary)",
                    fontFamily: "var(--font-sans)", textAlign: "left",
                    transition: "background-color var(--duration-fast), color var(--duration-fast)",
                  } as React.CSSProperties}
                  onMouseEnter={(e) => { if (!active) (e.currentTarget as HTMLElement).style.backgroundColor = "var(--color-surface-hover)"; }}
                  onMouseLeave={(e) => { if (!active) (e.currentTarget as HTMLElement).style.backgroundColor = "transparent"; }}
                >
                  <Icon name={tab.icon} size={15} color={active ? "var(--color-primary)" : "var(--color-text-muted)"} strokeWidth={active ? 2 : 1.75} />
                  {tab.label}
                </button>
              );
            })}
          </nav>

          {/* Content area */}
          <div className="card" style={{ flex: 1, minWidth: 0, padding: "var(--space-6)" }}>
            {activeTab === "account" && (
              <div>
                <h2 style={{ fontFamily: "var(--font-serif)", fontSize: "var(--text-xl)", fontWeight: 600, marginBottom: "var(--space-6)" }}>
                  Account Settings
                </h2>
                <div style={{ display: "flex", flexDirection: "column", gap: "var(--space-5)" }}>
                  {[
                    { label: "Full Name", value: "Alex Johnson" },
                    { label: "Email",     value: "alex@example.com" },
                    { label: "Password",  value: "••••••••" },
                  ].map((field) => (
                    <div key={field.label}>
                      <label style={{ fontSize: "var(--text-sm)", fontWeight: 600, color: "var(--color-text-secondary)", display: "block", marginBottom: "6px" }}>
                        {field.label}
                      </label>
                      <div style={{
                        display: "flex", alignItems: "center", gap: "10px",
                        padding: "11px var(--space-4)",
                        border: "1px solid var(--color-border)", borderRadius: "var(--radius-md)",
                        fontSize: "var(--text-base)", color: "var(--color-text)",
                        backgroundColor: "var(--color-surface)",
                      }}>
                        <Icon name={fieldIcons[field.label] ?? "user"} size={15} color="var(--color-text-muted)" strokeWidth={1.75} />
                        <span>{field.value}</span>
                      </div>
                    </div>
                  ))}
                  <button style={{ alignSelf: "flex-start", background: "none", border: "none", cursor: "pointer", fontSize: "var(--text-sm)", color: "var(--color-primary)", fontFamily: "var(--font-sans)", padding: 0 }}>
                    Change password
                  </button>
                </div>
                <div style={{ marginTop: "var(--space-6)" }}>
                  <Button variant="primary" size="md" onClick={() => { /* Save: TODO persist profile */ }}>
                    Save Changes
                  </Button>
                </div>
              </div>
            )}
            {activeTab === "goals" && (
              <div>
                <h2 style={{ fontFamily: "var(--font-serif)", fontSize: "var(--text-xl)", fontWeight: 600, marginBottom: "var(--space-5)" }}>Financial Goals</h2>
                <p style={{ color: "var(--color-text-muted)", fontSize: "var(--text-sm)", lineHeight: 1.6 }}>Set and track your short and long-term financial goals here.</p>
              </div>
            )}
            {activeTab === "preferences" && (
              <div>
                <h2 style={{ fontFamily: "var(--font-serif)", fontSize: "var(--text-xl)", fontWeight: 600, marginBottom: "var(--space-5)" }}>Preferences</h2>
                <p style={{ color: "var(--color-text-muted)", fontSize: "var(--text-sm)", lineHeight: 1.6 }}>Customize your learning experience, language, and notifications.</p>
              </div>
            )}
            {activeTab === "privacy" && (
              <div>
                <h2 style={{ fontFamily: "var(--font-serif)", fontSize: "var(--text-xl)", fontWeight: 600, marginBottom: "var(--space-5)" }}>Privacy & Security</h2>
                <p style={{ color: "var(--color-text-muted)", fontSize: "var(--text-sm)", lineHeight: 1.6 }}>Manage your privacy settings and account security.</p>
              </div>
            )}
          </div>
        </div>
      </div>

      <AccountPopup
        open={showPopup}
        onClose={() => setShowPopup(false)}
        onSignUp={() => { setShowPopup(false); navigate("/"); }}
        onLogin={() => { setShowPopup(false); navigate("/"); }}
      />
    </>
  );
};
