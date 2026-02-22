/**
 * Login: email-only magic link.
 * Submit → send magic link → show "Check your email".
 */
import React, { useState } from "react";
import { Link } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { Button } from "@/components/ui/Button";

export const Login: React.FC = () => {
  const [email, setEmail] = useState("");
  const [sent, setSent] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const { signInWithOtp } = useAuth();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    if (!email.trim()) {
      setError("Enter your email.");
      return;
    }
    setLoading(true);
    const { error: err } = await signInWithOtp(email.trim());
    setLoading(false);
    if (err) {
      setError(err.message);
      return;
    }
    setSent(true);
  };

  if (sent) {
    return (
      <div style={{ minHeight: "calc(100vh - var(--nav-height))", display: "flex", alignItems: "center", justifyContent: "center", padding: 24 }}>
        <div style={{ maxWidth: 400, textAlign: "center" }}>
          <h1 style={{ fontFamily: "var(--font-serif)", fontSize: "var(--text-2xl)", fontWeight: 600, marginBottom: 12 }}>
            Check your email
          </h1>
          <p style={{ color: "var(--color-text-muted)", marginBottom: 24 }}>
            We sent a sign-in link to <strong>{email}</strong>. Click the link to log in.
          </p>
          <button
            type="button"
            onClick={() => { setSent(false); setEmail(""); }}
            style={{ fontSize: "var(--text-sm)", color: "var(--color-primary)", background: "none", border: "none", cursor: "pointer", textDecoration: "underline" }}
          >
            Use a different email
          </button>
        </div>
      </div>
    );
  }

  return (
    <div style={{ minHeight: "calc(100vh - var(--nav-height))", display: "flex", alignItems: "center", justifyContent: "center", padding: 24 }}>
      <div style={{ maxWidth: 400, width: "100%" }}>
        <h1 style={{ fontFamily: "var(--font-serif)", fontSize: "var(--text-2xl)", fontWeight: 600, marginBottom: 8 }}>
          Log in
        </h1>
        <p style={{ color: "var(--color-text-muted)", marginBottom: 24, fontSize: "var(--text-sm)" }}>
          We’ll send you a magic link to sign in—no password needed.
        </p>
        <form onSubmit={handleSubmit}>
          <label htmlFor="login-email" style={{ display: "block", fontSize: "var(--text-sm)", fontWeight: 600, marginBottom: 8 }}>
            Email
          </label>
          <input
            id="login-email"
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
          {error && (
            <p style={{ color: "var(--color-error, #c0392b)", fontSize: "var(--text-sm)", marginBottom: 12 }}>
              {error}
            </p>
          )}
          <Button type="submit" variant="primary" style={{ width: "100%" }} disabled={loading}>
            {loading ? "Sending…" : "Send magic link"}
          </Button>
        </form>
        <p style={{ marginTop: 20, fontSize: "var(--text-sm)", color: "var(--color-text-muted)" }}>
          Don’t have an account? <Link to="/signup" style={{ color: "var(--color-primary)" }}>Sign up</Link>
        </p>
      </div>
    </div>
  );
};
