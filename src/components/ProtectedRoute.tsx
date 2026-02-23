/**
 * Protects routes that require authentication (e.g. Dashboard, Profile).
 * Redirects to /auth?mode=login if not authenticated.
 */
import React from "react";
import { Navigate, useLocation } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";

interface ProtectedRouteProps {
  children: React.ReactNode;
}

export const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ children }) => {
  const { user, loading } = useAuth();
  const location = useLocation();

  if (loading) {
    return (
      <div style={{ minHeight: "calc(100vh - var(--nav-height))", display: "flex", alignItems: "center", justifyContent: "center" }}>
        <p style={{ color: "var(--color-text-muted)" }}>Loading…</p>
      </div>
    );
  }

  if (!user) {
    return <Navigate to="/auth?mode=login" state={{ from: location }} replace />;
  }

  return <>{children}</>;
};
