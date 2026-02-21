import React from "react";
import { TopNav } from "./TopNav";
import { Icon } from "../ui/Icon";

const AnnouncementBar: React.FC = () => (
  <div style={{
    backgroundColor: "var(--color-primary)",
    color: "#fff",
    textAlign: "center",
    padding: "9px 20px",
    fontSize: "var(--text-sm)",
    fontWeight: 500,
    lineHeight: 1,
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    gap: "6px",
    letterSpacing: "0.005em",
  }}>
    <span>New: Interactive compound growth simulator now live</span>
    <Icon name="arrow-right" size={13} color="#fff" strokeWidth={2} />
  </div>
);

interface AppShellProps {
  children: React.ReactNode;
}

export const AppShell: React.FC<AppShellProps> = ({ children }) => (
  <div style={{ display: "flex", flexDirection: "column", minHeight: "100vh" }}>
    <AnnouncementBar />
    <TopNav />
    <main style={{ flex: 1 }}>
      {children}
    </main>
  </div>
);
