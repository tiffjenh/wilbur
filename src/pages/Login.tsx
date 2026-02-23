/**
 * Login: email + password.
 */
import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { Button } from "@/components/ui/Button";
import { Icon } from "@/components/ui/Icon";

export const Login: React.FC = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const { signInWithPassword } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    if (!email.trim()) { setError("Enter your email."); return; }
    if (!password) { setError("Enter your password."); return; }
    setLoading(true);
    const { error: err } = await signInWithPassword(email.trim(), password);
    setLoading(false);
    if (err) {
      const isNotConfigured = err.message.includes("Supabase not configured");
      setError(isNotConfigured
        ? "Log in isn't configured yet. Add VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY to .env.local (see docs/SUPABASE_SETUP.md)."
        : err.message);
      return;
    }
    navigate("/learning", { replace: true });
  };

  return (
    <div style={{ minHeight: "calc(100vh - var(--nav-height))", display: "flex", alignItems: "center", justifyContent: "center", padding: 24 }}>
      <div style={{ maxWidth: 400, width: "100%" }}>
        <h1 style={{ fontFamily: "var(--font-serif)", fontSize: "var(--text-2xl)", fontWeight: 600, marginBottom: 8 }}>Log in</h1>
        <p style={{ color: "var(--color-text-muted)", marginBottom: 24, fontSize: "var(--text-sm)" }}>Enter your email and password to sign in.</p>
        <form onSubmit={handleSubmit}>
          <label htmlFor="login-email" style={{ display: "block", fontSize: "var(--text-sm)", fontWeight: 600, marginBottom: 8 }}>Email</label>
          <input
            id="login-email"
            type="email"
            autoComplete="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="you@example.com"
            style={{ width: "100%", boxSizing: "border-box", padding: "12px 14px", border: "1px solid var(--color-border)", borderRadius: "var(--radius-md)", fontSize: "var(--text-base)", marginBottom: 16 }}
          />
          <label htmlFor="login-password" style={{ display: "block", fontSize: "var(--text-sm)", fontWeight: 600, marginBottom: 8 }}>Password</label>
          <div style={{ position: "relative", marginBottom: 16 }}>
            <input
              id="login-password"
              type={showPassword ? "text" : "password"}
              autoComplete="current-password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              style={{ width: "100%", boxSizing: "border-box", padding: "12px 44px 12px 14px", border: "1px solid var(--color-border)", borderRadius: "var(--radius-md)", fontSize: "var(--text-base)" }}
            />
            <button type="button" aria-label={showPassword ? "Hide password" : "Show password"} onClick={() => setShowPassword((s) => !s)} style={{ position: "absolute", right: 10, top: "50%", transform: "translateY(-50%)", padding: 4, background: "none", border: "none", cursor: "pointer", color: "var(--color-text-muted)" }}>
              <Icon name={showPassword ? "eye-off" : "eye"} size={20} strokeWidth={1.8} />
            </button>
          </div>
          {error && <p style={{ color: "var(--color-error, #c0392b)", fontSize: "var(--text-sm)", marginBottom: 12 }}>{error}</p>}
          <Button type="submit" variant="primary" style={{ width: "100%" }} disabled={loading}>{loading ? "Signing in…" : "Log in"}</Button>
        </form>
        <p style={{ marginTop: 20, fontSize: "var(--text-sm)", color: "var(--color-text-muted)" }}>Don't have an account? <Link to="/signup" style={{ color: "var(--color-primary)" }}>Sign up</Link></p>
      </div>
    </div>
  );
};
