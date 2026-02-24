/**
 * Protects /admin routes: only users in admin_allowlist can access.
 * Shows "Not authorized" if not admin; redirects to login if not authenticated.
 */
import React, { useEffect, useState } from "react";
import { Navigate, useLocation } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { requireAdmin } from "@/lib/supabase/adminLessons";

interface AdminRouteProps {
  children: React.ReactNode;
}

export const AdminRoute: React.FC<AdminRouteProps> = ({ children }) => {
  const { user, loading: authLoading } = useAuth();
  const location = useLocation();
  const [adminChecked, setAdminChecked] = useState(false);
  const [isAdmin, setIsAdmin] = useState(false);

  useEffect(() => {
    if (!user) {
      setAdminChecked(true);
      setIsAdmin(false);
      return;
    }
    requireAdmin(user.id).then((ok) => {
      setAdminChecked(true);
      setIsAdmin(ok);
    });
  }, [user?.id]);

  if (authLoading || !adminChecked) {
    return (
      <div style={{ minHeight: "calc(100vh - var(--nav-height))", display: "flex", alignItems: "center", justifyContent: "center" }}>
        <p style={{ color: "var(--color-text-muted)" }}>Loading…</p>
      </div>
    );
  }

  if (!user) {
    return <Navigate to="/auth?mode=login" state={{ from: location }} replace />;
  }

  if (!isAdmin) {
    return (
      <div
        style={{
          minHeight: "calc(100vh - var(--nav-height))",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          padding: "var(--space-8)",
          fontFamily: "var(--font-sans)",
        }}
      >
        <h2 style={{ fontFamily: "var(--font-serif)", marginBottom: "var(--space-3)", color: "var(--color-text)" }}>
          Not authorized
        </h2>
        <p style={{ color: "var(--color-text-secondary)", marginBottom: "var(--space-4)", textAlign: "center" }}>
          You don’t have access to the admin area.
        </p>
        <a href="/" style={{ color: "var(--color-primary)", fontWeight: 600 }}>
          ← Back to home
        </a>
      </div>
    );
  }

  return <>{children}</>;
};
