/**
 * Logout: signs out and redirects to home.
 */
import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";

export const Logout: React.FC = () => {
  const { signOut } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    signOut().then(() => navigate("/", { replace: true }));
  }, [signOut, navigate]);

  return (
    <div style={{ minHeight: "calc(100vh - var(--nav-height))", display: "flex", alignItems: "center", justifyContent: "center" }}>
      <p style={{ color: "var(--color-text-muted)" }}>Signing out…</p>
    </div>
  );
};
