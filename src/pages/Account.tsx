/**
 * Account page: edit full name and email, save to Supabase auth.
 * Email requires clicking "Edit" then "Save" to avoid accidental changes.
 */
import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { Button } from "@/components/ui/Button";
import { supabase } from "@/lib/supabaseClient";

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

const inputStyle = {
  width: "100%" as const,
  boxSizing: "border-box" as const,
  padding: "12px 14px",
  border: "1px solid var(--color-border)",
  borderRadius: "var(--radius-md)",
  fontSize: "var(--text-base)",
  fontFamily: "var(--font-sans)",
};

export const Account: React.FC = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [editingEmail, setEditingEmail] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [toast, setToast] = useState<string | null>(null);

  useEffect(() => {
    if (!user) return;
    setName((user.user_metadata?.full_name as string) ?? "");
    setEmail(user.email ?? "");
  }, [user]);

  const handleSaveName = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    if (!supabase) {
      setError("Account updates are not available.");
      return;
    }
    setSaving(true);
    try {
      const { error: updateError } = await supabase.auth.updateUser({
        data: { full_name: name.trim() || undefined },
      });
      if (updateError) {
        setError(updateError.message);
        setSaving(false);
        return;
      }
      setToast("Name saved");
      setTimeout(() => setToast(null), 2500);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong.");
    }
    setSaving(false);
  };

  const handleSaveEmail = async () => {
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
      });
      if (updateError) {
        setError(updateError.message);
        setSaving(false);
        return;
      }
      setEditingEmail(false);
      setToast("Email saved. Check your inbox to confirm the new address.");
      setTimeout(() => setToast(null), 4000);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong.");
    }
    setSaving(false);
  };

  const handleCancelEditEmail = () => {
    setEmail(user?.email ?? "");
    setEditingEmail(false);
    setError(null);
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
          Update your name and email. Email changes require confirmation.
        </p>

        <form onSubmit={handleSaveName}>
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
            style={{ ...inputStyle, marginBottom: 24 }}
          />
          <Button type="submit" variant="primary" disabled={saving}>
            {saving ? "Saving…" : "Save name"}
          </Button>
        </form>

        <div style={{ marginTop: 32, paddingTop: 24, borderTop: "1px solid var(--color-border-light)" }}>
          <label style={{ display: "block", fontSize: "var(--text-sm)", fontWeight: 600, marginBottom: 6 }}>
            Email
          </label>
          {editingEmail ? (
            <>
              <input
                id="account-email"
                type="email"
                autoComplete="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="you@example.com"
                style={{ ...inputStyle, marginBottom: 12 }}
              />
              <div style={{ display: "flex", gap: 12, flexWrap: "wrap" }}>
                <Button type="button" variant="primary" onClick={handleSaveEmail} disabled={saving}>
                  {saving ? "Saving…" : "Save email"}
                </Button>
                <Button type="button" variant="outlineBlack" onClick={handleCancelEditEmail} disabled={saving}>
                  Cancel
                </Button>
              </div>
            </>
          ) : (
            <div style={{ display: "flex", alignItems: "center", gap: 12, flexWrap: "wrap" }}>
              <span style={{ fontSize: "var(--text-base)", color: "var(--color-text)" }}>{user.email || "—"}</span>
              <Button type="button" variant="outlineBlack" size="sm" onClick={() => setEditingEmail(true)} disabled={saving}>
                Edit
              </Button>
            </div>
          )}
        </div>

        {error && (
          <p style={{ color: "var(--color-error, #c0392b)", fontSize: "var(--text-sm)", marginTop: 12 }}>
            {error}
          </p>
        )}
        {toast && (
          <p style={{ color: "var(--color-primary)", fontSize: "var(--text-sm)", marginTop: 12 }}>
            {toast}
          </p>
        )}

        <div style={{ marginTop: 32 }}>
          <Button type="button" variant="outlineBlack" onClick={() => navigate(-1)} disabled={saving}>
            Back
          </Button>
        </div>
      </div>
    </div>
  );
};
