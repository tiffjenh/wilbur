/**
 * Login: email + password.
 * Shows "Authentication successful, please login" when arriving from auth confirmation link.
 * First-time users (no questionnaire) -> homepage. Returning users -> dashboard progress.
 */
import React, { useState, useEffect } from "react";
import { Link, useNavigate, useSearchParams } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { Button } from "@/components/ui/Button";
import { Icon } from "@/components/ui/Icon";
import { supabase } from "@/lib/supabaseClient";
import { loadUserProfileFromSupabase } from "@/lib/supabase";

export const Login: React.FC = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const [showConfirmedBanner, setShowConfirmedBanner] = useState(() => searchParams.get("confirmed") === "1");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [resendLoading, setResendLoading] = useState(false);
  const [resendSuccess, setResendSuccess] = useState(false);
  const { signInWithPassword, resendVerificationEmail } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (searchParams.get("confirmed") === "1") {
      setShowConfirmedBanner(true);
      setSearchParams({}, { replace: true });
    }
  }, [searchParams, setSearchParams]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setResendSuccess(false);
    if (!email.trim()) { setError("Enter your email."); return; }
    if (!password) { setError("Enter your password."); return; }
    setLoading(true);
    const { error: err, emailNotConfirmed } = await signInWithPassword(email.trim(), password);
    setLoading(false);
    if (err) {
      if (emailNotConfirmed) {
        setError("Please verify your email before logging in. Check your inbox for the confirmation link.");
      } else {
        const isNotConfigured = err.message.includes("Supabase not configured");
        setError(isNotConfigured
          ? "Log in isn't configured yet. Add VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY to .env.local (see docs/SUPABASE_SETUP.md)."
          : err.message);
      }
      return;
    }
    if (!supabase) {
      navigate("/", { replace: true });
      return;
    }
    const { data: { user: u } } = await supabase.auth.getUser();
    if (u) {
      const profile = await loadUserProfileFromSupabase(u.id);
      if (profile) {
        navigate("/dashboard/progress", { replace: true });
      } else {
        navigate("/", { replace: true });
      }
    } else {
      navigate("/", { replace: true });
    }
  };

  const handleResend = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim()) { setError("Enter your email above first."); return; }
    setResendLoading(true);
    setResendSuccess(false);
    setError(null);
    const { error: err } = await resendVerificationEmail(email.trim());
    setResendLoading(false);
    if (err) {
      setError(err.message + " If you hit a rate limit, wait an hour or try signing up again with this email on the Sign up page.");
      return;
    }
    setResendSuccess(true);
  };

  return (
    <div style={{ minHeight: "calc(100vh - var(--nav-height))", display: "flex", alignItems: "center", justifyContent: "center", padding: 24 }}>
      <div style={{ maxWidth: 400, width: "100%" }}>
        {showConfirmedBanner && (
          <p style={{ marginBottom: 16, padding: 12, backgroundColor: "var(--color-surface, #f0f7f0)", borderRadius: "var(--radius-md)", color: "var(--color-text)", fontSize: "var(--text-sm)", border: "1px solid var(--color-border)" }}>
            Authentication successful, please login.
          </p>
        )}
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
          <p style={{ marginTop: 16, fontSize: "var(--text-sm)", color: "var(--color-text-muted)" }}>
            Didn't confirm your email yet?{" "}
            <button
              type="button"
              onClick={handleResend}
              disabled={resendLoading || !email.trim()}
              style={{
                background: "none",
                border: "none",
                padding: 0,
                color: "var(--color-primary)",
                cursor: resendLoading || !email.trim() ? "not-allowed" : "pointer",
                fontWeight: 600,
                textDecoration: "underline",
                fontSize: "inherit",
              }}
            >
              {resendLoading ? "Sending…" : "Resend verification email"}
            </button>
          </p>
          {resendSuccess && (
            <div style={{ marginTop: 12, padding: 12, backgroundColor: "var(--color-surface, #f5f5f5)", borderRadius: "var(--radius-md)", fontSize: "var(--text-sm)" }}>
              <p style={{ color: "var(--color-success, #27ae60)", fontWeight: 600, marginBottom: 6 }}>Request sent.</p>
              <p style={{ color: "var(--color-text-muted)", marginBottom: 0 }}>
                Check your inbox and spam. If nothing arrives: wait at least 60 seconds before requesting again (Supabase limits how often you can resend). If you originally signed up when this app used a different login, use <Link to="/signup" style={{ color: "var(--color-primary)" }}>Sign up</Link> with this email to create an account here and get a new confirmation email.
              </p>
            </div>
          )}
        </form>
        <p style={{ marginTop: 20, fontSize: "var(--text-sm)", color: "var(--color-text-muted)" }}>Don't have an account? <Link to="/signup" style={{ color: "var(--color-primary)" }}>Sign up</Link></p>
      </div>
    </div>
  );
};
