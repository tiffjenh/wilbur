import React from "react";
import { TopNav } from "./TopNav";

interface AppShellProps {
  children: React.ReactNode;
}

export const AppShell: React.FC<AppShellProps> = ({ children }) => (
  <div style={{ display: "flex", flexDirection: "column", minHeight: "100vh" }}>
    <TopNav />
    <main style={{ flex: 1 }}>
      {children}
    </main>
  </div>
);
