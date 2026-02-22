import React, { useEffect } from "react";
import { Button } from "./Button";
import { MascotPink } from "./MascotPink";
import { Icon } from "./Icon";

interface ModalProps {
  open: boolean;
  onClose: () => void;
  children: React.ReactNode;
}

export const Modal: React.FC<ModalProps> = ({ open, onClose, children }) => {
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => { if (e.key === "Escape") onClose(); };
    if (open) {
      document.addEventListener("keydown", onKey);
      document.body.style.overflow = "hidden";
    }
    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = "";
    };
  }, [open, onClose]);

  if (!open) return null;

  return (
    <div style={{
      position: "fixed", inset: 0, zIndex: 1000,
      display: "flex", alignItems: "center", justifyContent: "center",
      padding: "24px",
      animation: "modalBackdropIn var(--duration-normal) var(--ease-out)",
    }}>
      <div onClick={onClose} style={{ position: "absolute", inset: 0, backgroundColor: "rgba(18, 14, 8, 0.48)", backdropFilter: "blur(3px)" }} />
      <div
        role="dialog" aria-modal="true"
        style={{
          position: "relative", zIndex: 1,
          backgroundColor: "var(--color-surface)",
          borderRadius: "var(--radius-2xl)",
          boxShadow: "var(--shadow-lg)",
          maxWidth: "400px", width: "100%",
          animation: "modalIn var(--duration-normal) var(--ease-out)",
          overflow: "hidden",
        }}
      >
        {children}
      </div>
    </div>
  );
};

/* ── Account popup — matches accountpopup.png ── */
interface AccountPopupProps {
  open: boolean;
  onClose: () => void;
  onSignUp: () => void;
  onLogin: () => void;
}

export const AccountPopup: React.FC<AccountPopupProps> = ({ open, onClose, onSignUp, onLogin }) => (
  <Modal open={open} onClose={onClose}>
    <div style={{ padding: "36px 28px 30px", textAlign: "center" }}>
      {/* Close */}
      <button
        onClick={onClose}
        aria-label="Close"
        style={{
          position: "absolute", top: "14px", right: "14px",
          background: "none", border: "none", cursor: "pointer",
          padding: "5px", color: "var(--color-text-muted)",
          borderRadius: "var(--radius-full)",
          transition: "background-color var(--duration-fast)",
          lineHeight: 0,
        }}
        onMouseEnter={(e) => { (e.currentTarget as HTMLElement).style.backgroundColor = "var(--color-surface-hover)"; }}
        onMouseLeave={(e) => { (e.currentTarget as HTMLElement).style.backgroundColor = "transparent"; }}
      >
        <Icon name="x" size={16} />
      </button>

      {/* Pig mascot — matches accountpopup.png: pink circle with full-body pig illustration */}
      <div style={{
        width: "72px", height: "72px", borderRadius: "50%",
        backgroundColor: "var(--color-pink-bg)",
        border: "2px solid rgba(240, 168, 188, 0.28)",
        display: "flex", alignItems: "center", justifyContent: "center",
        margin: "0 auto 22px",
        overflow: "hidden",
      }}>
        <MascotPink size={60} style={{ marginTop: "8px" }} />
      </div>

      <h3 style={{ fontFamily: "var(--font-serif)", fontSize: "var(--text-xl)", fontWeight: 600, color: "var(--color-text)", lineHeight: 1.3, marginBottom: "10px" }}>
        Create an account now to track your roadmap
      </h3>
      <p style={{ fontSize: "var(--text-sm)", color: "var(--color-text-muted)", lineHeight: 1.65, marginBottom: "26px" }}>
        Sign up to unlock personalized learning paths, track your progress, and access your confidence meter.
      </p>

      <Button variant="primary" size="lg" onClick={onSignUp} style={{ width: "100%", borderRadius: "var(--radius-lg)", marginBottom: "8px", fontSize: "var(--text-base)" }}>
        Create Account
      </Button>

      <button
        onClick={onClose}
        style={{ background: "none", border: "none", cursor: "pointer", fontSize: "var(--text-sm)", color: "var(--color-text-muted)", fontFamily: "var(--font-sans)", padding: "8px", marginBottom: "8px", display: "block", width: "100%", transition: "color var(--duration-fast)" }}
        onMouseEnter={(e) => { (e.currentTarget as HTMLElement).style.color = "var(--color-text)"; }}
        onMouseLeave={(e) => { (e.currentTarget as HTMLElement).style.color = "var(--color-text-muted)"; }}
      >
        Maybe later
      </button>

      <button
        onClick={onLogin}
        style={{ background: "none", border: "none", cursor: "pointer", fontSize: "var(--text-sm)", color: "var(--color-text-secondary)", fontFamily: "var(--font-sans)", padding: "8px", transition: "color var(--duration-fast)" }}
        onMouseEnter={(e) => { (e.currentTarget as HTMLElement).style.color = "var(--color-text)"; }}
        onMouseLeave={(e) => { (e.currentTarget as HTMLElement).style.color = "var(--color-text-secondary)"; }}
      >
        Already have an account? Login
      </button>
    </div>
  </Modal>
);
