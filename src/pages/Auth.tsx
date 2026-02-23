/**
 * Unified auth: Login and Sign up in one centered module with toggle.
 * Route: /auth?mode=login | /auth?mode=signup
 */
import React, { useState, useEffect, useCallback } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { Button } from "@/components/ui/Button";
import { Icon } from "@/components/ui/Icon";
import { supabase } from "@/lib/supabaseClient";
import { loadUserProfileFromSupabase } from "@/lib/supabase";

const inputStyle: React.CSSProperties = {
  width: "100%",
  boxSizing: "border-box",
  padding: "12px 14px",
  border: "1px solid var(--color-border)",
  borderRadius: "var(--radius-md)",
  fontSize: "var(--text-base)",
  marginBottom: 16,
};

type AuthMode = "login" | "signup";

export const Auth: React.FC = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const modeParam = searchParams.get("mode");
  const mode: AuthMode = modeParam === "signup" || modeParam === "login" ? modeParam : "login";
  const setMode = useCallback(
    (m: AuthMode) => {
      setSearchParams({ mode: m }, { replace: true });
    },
    [setSearchParams]
  );

  const [showConfirmedBanner, setShowConfirmedBanner] = useState(() => searchParams.get("confirmed") === "1");
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [resendLoading, setResendLoading] = useState(false);
  const [resendSuccess, setResendSuccess] = useState(false);
  const [needsConfirmation, setNeedsConfirmation] = useState(false);

  const { signInWithPassword, signUp, resendVerificationEmail } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (searchParams.get("confirmed") === "1") {
      setShowConfirmedBanner(true);
      setSearchParams((p) => {
        const next = new URLSearchParams(p);
        next.delete("confirmed");
        return next;
      }, { replace: true });
    }
  }, [searchParams, setSearchParams]);

  const passwordsMatch = password === confirmPassword;
  const nameParts = fullName.trim().split(/\s+/).filter(Boolean);
  const hasFirstAndLast = nameParts.length >= 2;
  const canSubmitSignUp =
    hasFirstAndLast &&
    password.length >= 8 &&
    passwordsMatch &&
    !!email.trim() &&
    !loading;

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setResendSuccess(false);
    if (!email.trim()) {
      setError("Enter your email.");
      return;
    }
    if (!password) {
      setError("Enter your password.");
      return;
    }
    setLoading(true);
    const { error: err, emailNotConfirmed } = await signInWithPassword(email.trim(), password);
    setLoading(false);
    if (err) {
      if (emailNotConfirmed) {
        setError("Please verify your email before logging in. Check your inbox for the confirmation link.");
      } else {
        const isNotConfigured = err.message.includes("Supabase not configured");
        setError(
          isNotConfigured
            ? "Log in isn't configured. Add VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY to .env.local."
            : err.message
        );
      }
      return;
    }
    if (!supabase) {
      navigate("/", { replace: true });
      return;
    }
    const {
      data: { user: u },
    } = await supabase.auth.getUser();
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

  const handleSignUp = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setNeedsConfirmation(false);
    const parts = fullName.trim().split(/\s+/).filter(Boolean);
    if (parts.length < 2) {
      setError("Please enter your first and last name.");
      return;
    }
    if (!email.trim()) {
      setError("Enter your email.");
      return;
    }
    if (!password) {
      setError("Enter a password.");
      return;
    }
    if (password.length < 8) {
      setError("Use at least 8 characters for your password.");
      return;
    }
    if (password !== confirmPassword) {
      setError("Passwords don't match.");
      return;
    }
    const first = parts[0] ?? "";
    const last = parts.slice(1).join(" ") ?? "";
    setLoading(true);
    const { error: err, requiresConfirmation } = await signUp(
      email.trim(),
      password,
      first,
      last
    );
    setLoading(false);
    if (err) {
      const isNotConfigured = err.message.includes("Supabase not configured");
      setError(
        isNotConfigured
          ? "Sign up isn't configured. Add VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY to .env.local."
          : err.message
      );
      return;
    }
    if (requiresConfirmation) {
      setPassword("");
      setConfirmPassword("");
      setNeedsConfirmation(true);
      return;
    }
    navigate("/", { replace: true });
  };

  const handleResend = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim()) {
      setError("Enter your email above first.");
      return;
    }
    setResendLoading(true);
    setResendSuccess(false);
    setError(null);
    const { error: err } = await resendVerificationEmail(email.trim());
    setResendLoading(false);
    if (err) {
      setError(err.message);
      return;
    }
    setResendSuccess(true);
  };

  return (
    <div
      style={{
        minHeight: "calc(100vh - var(--nav-height))",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        padding: 24,
      }}
    >
      <div
        style={{
          width: "100%",
          maxWidth: 400,
          border: "2px solid var(--color-black)",
          borderRadius: "var(--radius-lg)",
          padding: 32,
          backgroundColor: "var(--color-surface)",
        }}
      >
        {/* Segmented toggle */}
        <div
          style={{
            display: "flex",
            border: "1px solid var(--color-border)",
            borderRadius: "var(--radius-md)",
            overflow: "hidden",
            marginBottom: 24,
          }}
        >
          <button
            type="button"
            onClick={() => setMode("login")}
            style={{
              flex: 1,
              padding: "10px 16px",
              border: "none",
              background: mode === "login" ? "var(--color-primary)" : "transparent",
              color: mode === "login" ? "var(--color-primary-text)" : "var(--color-text)",
              fontWeight: 600,
              fontSize: "var(--text-sm)",
              fontFamily: "var(--font-sans)",
              cursor: "pointer",
            }}
          >
            Log in
          </button>
          <button
            type="button"
            onClick={() => setMode("signup")}
            style={{
              flex: 1,
              padding: "10px 16px",
              border: "none",
              background: mode === "signup" ? "var(--color-primary)" : "transparent",
              color: mode === "signup" ? "var(--color-primary-text)" : "var(--color-text)",
              fontWeight: 600,
              fontSize: "var(--text-sm)",
              fontFamily: "var(--font-sans)",
              cursor: "pointer",
            }}
          >
            Sign up
          </button>
        </div>

        {showConfirmedBanner && (
          <p
            style={{
              marginBottom: 16,
              padding: 12,
              backgroundColor: "var(--color-surface-hover)",
              borderRadius: "var(--radius-md)",
              color: "var(--color-text)",
              fontSize: "var(--text-sm)",
              border: "1px solid var(--color-border)",
              textAlign: "center",
            }}
          >
            Authentication successful, please login.
          </p>
        )}

        {mode === "login" && !needsConfirmation && (
          <>
            <p style={{ color: "var(--color-text-muted)", marginBottom: 20, fontSize: "var(--text-sm)", textAlign: "center" }}>
              Enter your email and password to sign in.
            </p>
            <form onSubmit={handleLogin}>
              <label htmlFor="auth-login-email" style={{ display: "block", fontSize: "var(--text-sm)", fontWeight: 600, marginBottom: 8 }}>
                Email
              </label>
              <input
                id="auth-login-email"
                type="email"
                autoComplete="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="you@example.com"
                style={inputStyle}
              />
              <label htmlFor="auth-login-password" style={{ display: "block", fontSize: "var(--text-sm)", fontWeight: 600, marginBottom: 8 }}>
                Password
              </label>
              <div style={{ position: "relative", marginBottom: 16 }}>
                <input
                  id="auth-login-password"
                  type={showPassword ? "text" : "password"}
                  autoComplete="current-password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  style={{ ...inputStyle, paddingRight: 44, marginBottom: 0 }}
                />
                <button
                  type="button"
                  aria-label={showPassword ? "Hide password" : "Show password"}
                  onClick={() => setShowPassword((s) => !s)}
                  style={{
                    position: "absolute",
                    right: 10,
                    top: "50%",
                    transform: "translateY(-50%)",
                    padding: 4,
                    background: "none",
                    border: "none",
                    cursor: "pointer",
                    color: "var(--color-text-muted)",
                  }}
                >
                  <Icon name={showPassword ? "eye-off" : "eye"} size={20} strokeWidth={1.8} />
                </button>
              </div>
              {error && (
                <p style={{ color: "var(--color-error, #c0392b)", fontSize: "var(--text-sm)", marginBottom: 12, textAlign: "center" }}>
                  {error}
                </p>
              )}
              <Button type="submit" variant="primary" style={{ width: "100%" }} disabled={loading}>
                {loading ? "Signing in…" : "Log in"}
              </Button>
              <p style={{ marginTop: 16, fontSize: "var(--text-sm)", color: "var(--color-text-muted)", textAlign: "center" }}>
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
                <p style={{ color: "var(--color-success, #27ae60)", fontSize: "var(--text-sm)", marginTop: 8, textAlign: "center" }}>
                  Verification email sent. Check your inbox.
                </p>
              )}
            </form>
          </>
        )}

        {mode === "signup" && !needsConfirmation && (
          <>
            <p style={{ color: "var(--color-text-muted)", marginBottom: 20, fontSize: "var(--text-sm)", textAlign: "center" }}>
              Create an account with your email and a password.
            </p>
            <form onSubmit={handleSignUp}>
              <label htmlFor="auth-full-name" style={{ display: "block", fontSize: "var(--text-sm)", fontWeight: 600, marginBottom: 8 }}>
                First and last name
              </label>
              <input
                id="auth-full-name"
                type="text"
                autoComplete="name"
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                placeholder="First and last name"
                style={inputStyle}
              />
              {fullName.trim() && !hasFirstAndLast && (
                <p style={{ color: "var(--color-error, #c0392b)", fontSize: "var(--text-sm)", marginBottom: 12, textAlign: "center" }}>
                  Please enter your first and last name.
                </p>
              )}
              <label htmlFor="auth-signup-email" style={{ display: "block", fontSize: "var(--text-sm)", fontWeight: 600, marginBottom: 8 }}>
                Email
              </label>
              <input
                id="auth-signup-email"
                type="email"
                autoComplete="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="you@example.com"
                style={inputStyle}
              />
              <label htmlFor="auth-signup-password" style={{ display: "block", fontSize: "var(--text-sm)", fontWeight: 600, marginBottom: 8 }}>
                Password
              </label>
              <div style={{ position: "relative", marginBottom: 6 }}>
                <input
                  id="auth-signup-password"
                  type={showPassword ? "text" : "password"}
                  autoComplete="new-password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  style={{ ...inputStyle, paddingRight: 44, marginBottom: 0 }}
                />
                <button
                  type="button"
                  aria-label={showPassword ? "Hide password" : "Show password"}
                  onClick={() => setShowPassword((s) => !s)}
                  style={{
                    position: "absolute",
                    right: 10,
                    top: "50%",
                    transform: "translateY(-50%)",
                    padding: 4,
                    background: "none",
                    border: "none",
                    cursor: "pointer",
                    color: "var(--color-text-muted)",
                  }}
                >
                  <Icon name={showPassword ? "eye-off" : "eye"} size={20} strokeWidth={1.8} />
                </button>
              </div>
              <p style={{ fontSize: "var(--text-xs)", color: "var(--color-text-muted)", marginBottom: password ? 8 : 16 }}>
                8+ characters recommended.
              </p>
              {password ? (
                <>
                  <label htmlFor="auth-confirm-password" style={{ display: "block", fontSize: "var(--text-sm)", fontWeight: 600, marginBottom: 8 }}>
                    Confirm Password
                  </label>
                  <input
                    id="auth-confirm-password"
                    type={showPassword ? "text" : "password"}
                    autoComplete="new-password"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    placeholder="••••••••"
                    style={inputStyle}
                  />
                </>
              ) : null}
              {confirmPassword && !passwordsMatch && (
                <p style={{ color: "var(--color-error, #c0392b)", fontSize: "var(--text-sm)", marginBottom: 12, textAlign: "center" }}>
                  Passwords don't match.
                </p>
              )}
              {error && (
                <p style={{ color: "var(--color-error, #c0392b)", fontSize: "var(--text-sm)", marginBottom: 12, textAlign: "center" }}>
                  {error}
                </p>
              )}
              <Button type="submit" variant="primary" style={{ width: "100%" }} disabled={!canSubmitSignUp}>
                {loading ? "Creating account…" : "Sign up"}
              </Button>
            </form>
          </>
        )}

        {mode === "signup" && needsConfirmation && (
          <div style={{ textAlign: "center" }}>
            <h2 style={{ fontFamily: "var(--font-serif)", fontSize: "var(--text-xl)", fontWeight: 600, marginBottom: 8 }}>
              Check your email to authenticate your account
            </h2>
            <p style={{ color: "var(--color-text-muted)", fontSize: "var(--text-sm)", marginBottom: 16 }}>
              Didn't get the email?{" "}
              <button
                type="button"
                onClick={handleResend}
                disabled={resendLoading}
                style={{
                  background: "none",
                  border: "none",
                  padding: 0,
                  color: "var(--color-primary)",
                  cursor: resendLoading ? "not-allowed" : "pointer",
                  fontWeight: 600,
                  textDecoration: "underline",
                }}
              >
                {resendLoading ? "Sending…" : "Send it again"}
              </button>
            </p>
            {resendSuccess && (
              <p style={{ color: "var(--color-success, #27ae60)", fontSize: "var(--text-sm)", marginBottom: 16 }}>Verification email sent.</p>
            )}
            {error && (
              <p style={{ color: "var(--color-error, #c0392b)", fontSize: "var(--text-sm)", marginBottom: 12 }}>{error}</p>
            )}
            <Button variant="primary" style={{ width: "100%" }} onClick={() => setMode("login")}>
              Go to Log in
            </Button>
          </div>
        )}

        <p style={{ marginTop: 20, fontSize: "var(--text-sm)", color: "var(--color-text-muted)", textAlign: "center" }}>
          {mode === "login" ? (
            <>
              Don't have an account?{" "}
              <button type="button" onClick={() => setMode("signup")} style={{ background: "none", border: "none", padding: 0, color: "var(--color-primary)", cursor: "pointer", fontWeight: 600 }}>
                Sign up
              </button>
            </>
          ) : (
            <>
              Already have an account?{" "}
              <button type="button" onClick={() => setMode("login")} style={{ background: "none", border: "none", padding: 0, color: "var(--color-primary)", cursor: "pointer", fontWeight: 600 }}>
                Log in
              </button>
            </>
          )}
        </p>
      </div>
    </div>
  );
};
