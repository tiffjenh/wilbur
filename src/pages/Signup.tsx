/**
 * Sign up: name, email, password (no magic link).
 */
import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { Button } from "@/components/ui/Button";
import { Icon } from "@/components/ui/Icon";

export const Signup: React.FC = () => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [needsConfirmation, setNeedsConfirmation] = useState(false);
  const { signUp } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setNeedsConfirmation(false);
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
    setLoading(true);
    const { error: err, requiresConfirmation } = await signUp(email.trim(), password, name.trim());
    setLoading(false);
    if (err) {
      const isNotConfigured = err.message.includes("Supabase not configured");
      setError(isNotConfigured
        ? "Sign up isn’t configured yet. Add VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY to .env.local (see docs/SUPABASE_SETUP.md)."
        : err.message);
      return;
    }
    if (requiresConfirmation) {
      setNeedsConfirmation(true);
      return;
    }
    navigate("/learning", { replace: true });
  };

  return (
    <div style={{ minHeight: "calc(100vh - var(--nav-height))", display: "flex", alignItems: "center", justifyContent: "center", padding: 24 }}>
      <div style={{ maxWidth: 400, width: "100%" }}>
        <h1 style={{ fontFamily: "var(--font-serif)", fontSize: "var(--text-2xl)", fontWeight: 600, marginBottom: 8 }}>
          Sign up
        </h1>
        <p style={{ color: "var(--color-text-muted)", marginBottom: 24, fontSize: "var(--text-sm)" }}>
          Create an account with your email and a password.
        </p>
        {needsConfirmation ? (
          <div style={{ padding: "20px 0" }}>
            <p style={{ color: "var(--color-text)", fontSize: "var(--text-base)", marginBottom: 12 }}>
              Check your email to confirm your account. Click the link we sent to <strong>{email}</strong>, then log in.
            </p>
            <Link
              to="/login"
              style={{
                display: "block",
                width: "100%",
                padding: "12px 16px",
                textAlign: "center" as const,
                backgroundColor: "var(--color-primary)",
                color: "var(--color-primary-text)",
                border: "none",
                borderRadius: "var(--radius-md)",
                fontSize: "var(--text-base)",
                fontWeight: 600,
                textDecoration: "none",
              }}
            >
              Go to log in
            </Link>
          </div>
        ) : (
        <form onSubmit={handleSubmit}>
          <label htmlFor="signup-name" style={{ display: "block", fontSize: "var(--text-sm)", fontWeight: 600, marginBottom: 8 }}>
            Name
          </label>
          <input
            id="signup-name"
            type="text"
            autoComplete="name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Your name"
            style={{
              width: "100%",
              boxSizing: "border-box",
              padding: "12px 14px",
              border: "1px solid var(--color-border)",
              borderRadius: "var(--radius-md)",
              fontSize: "var(--text-base)",
              marginBottom: 16,
            }}
          />
          <label htmlFor="signup-email" style={{ display: "block", fontSize: "var(--text-sm)", fontWeight: 600, marginBottom: 8 }}>
            Email
          </label>
          <input
            id="signup-email"
            type="email"
            autoComplete="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="you@example.com"
            style={{
              width: "100%",
              boxSizing: "border-box",
              padding: "12px 14px",
              border: "1px solid var(--color-border)",
              borderRadius: "var(--radius-md)",
              fontSize: "var(--text-base)",
              marginBottom: 16,
            }}
          />
          <label htmlFor="signup-password" style={{ display: "block", fontSize: "var(--text-sm)", fontWeight: 600, marginBottom: 8 }}>
            Password
          </label>
          <div style={{ position: "relative", marginBottom: 6 }}>
            <input
              id="signup-password"
              type={showPassword ? "text" : "password"}
              autoComplete="new-password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              style={{
                width: "100%",
                boxSizing: "border-box",
                padding: "12px 44px 12px 14px",
                border: "1px solid var(--color-border)",
                borderRadius: "var(--radius-md)",
                fontSize: "var(--text-base)",
              }}
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
          <p style={{ fontSize: "var(--text-xs)", color: "var(--color-text-muted)", marginBottom: 16 }}>
            8+ characters recommended.
          </p>
          {error && (
            <p style={{ color: "var(--color-error, #c0392b)", fontSize: "var(--text-sm)", marginBottom: 12 }}>
              {error}
            </p>
          )}
          <Button type="submit" variant="primary" style={{ width: "100%" }} disabled={loading}>
            {loading ? "Creating account…" : "Sign up"}
          </Button>
        </form>
        )}
        <p style={{ marginTop: 20, fontSize: "var(--text-sm)", color: "var(--color-text-muted)" }}>
          Already have an account? <Link to="/login" style={{ color: "var(--color-primary)" }}>Log in</Link>
        </p>
      </div>
    </div>
  );
};
