/**
 * Account page: edit full name and email, save to Supabase auth.
 */
import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { Button } from "@/components/ui/Button";
import { supabase } from "@/lib/supabaseClient";

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export const Account: React.FC = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [toast, setToast] = useState<string | null>(null);

  useEffect(() => {
    if (!user) return;
    setName((user.user_metadata?.full_name as string) ?? "");
    setEmail(user.email ?? "");
  }, [user]);

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    const trimmedEmail = email.trim();
    if (!trimmedEmail) {
      setError("Email is required.");
      return;
    }
    if (!EMAIL_REGEX.test(trimmedEmail)) {
      setError("Please enter a valid email address.");
      return;
    }
    if (!supabase) {
      setError("Account updates are not available.");
      return;
    }
    setSaving(true);
    try {
      const { error: updateError } = await supabase.auth.updateUser({
        email: trimmedEmail,
        data: { full_name: name.trim() || undefined },
      });
      if (updateError) {
        setError(updateError.message);
        setSaving(false);
        return;
      }
      setToast("Saved");
      setTimeout(() => setToast(null), 2500);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong.");
    }
    setSaving(false);
  };

  if (!user) return null;

  return (
    <div
      className="page-enter"
      style={{
        minHeight: "calc(100vh - var(--nav-height))",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        padding: 24,
        backgroundColor: "var(--color-bg)",
      }}
    >
      <div style={{ maxWidth: 420, width: "100%" }}>
        <h1 style={{ fontFamily: "var(--font-serif)", fontSize: "var(--text-2xl)", fontWeight: 600, marginBottom: 8 }}>
          Account
        </h1>
        <p style={{ color: "var(--color-text-muted)", fontSize: "var(--text-sm)", marginBottom: 24 }}>
          Update your name and email. Changes are saved to your account.
        </p>
        <form onSubmit={handleSave}>
          <label htmlFor="account-name" style={{ display: "block", fontSize: "var(--text-sm)", fontWeight: 600, marginBottom: 6 }}>
            Full Name
          </label>
          <input
            id="account-name"
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
              fontFamily: "var(--font-sans)",
            }}
          />
          <label htmlFor="account-email" style={{ display: "block", fontSize: "var(--text-sm)", fontWeight: 600, marginBottom: 6 }}>
            Email
          </label>
          <input
            id="account-email"
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
              fontFamily: "var(--font-sans)",
            }}
          />
          {error && (
            <p style={{ color: "var(--color-error, #c0392b)", fontSize: "var(--text-sm)", marginBottom: 12 }}>
              {error}
            </p>
          )}
          {toast && (
            <p style={{ color: "var(--color-primary)", fontSize: "var(--text-sm)", marginBottom: 12 }}>
              {toast}
            </p>
          )}
          <div style={{ display: "flex", gap: 12, flexWrap: "wrap" }}>
            <Button type="submit" variant="primary" disabled={saving}>
              {saving ? "Saving…" : "Save"}
            </Button>
            <Button
              type="button"
              variant="outlineBlack"
              onClick={() => navigate(-1)}
              disabled={saving}
            >
              Cancel
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
};
