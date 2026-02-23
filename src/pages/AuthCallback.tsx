/**
 * Handles magic link redirect from email.
 * Supabase appends tokens to the URL; we let the client recover session then redirect.
 */
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/lib/supabaseClient";

export const AuthCallback: React.FC = () => {
  const navigate = useNavigate();
  const [status, setStatus] = useState<"verifying" | "done" | "error">("verifying");

  useEffect(() => {
    const client = supabase;
    if (!client) {
      setStatus("error");
      navigate("/auth?mode=login", { replace: true });
      return;
    }

    const run = async () => {
      const hashParams = new URLSearchParams(window.location.hash.slice(1));
      const queryParams = new URLSearchParams(window.location.search);
      const token_hash = queryParams.get("token_hash") ?? hashParams.get("token_hash");
      const type = (queryParams.get("type") ?? hashParams.get("type") ?? "email") as "email" | "magiclink";

      if (token_hash) {
        const { error: verifyError } = await client.auth.verifyOtp({
          token_hash,
          type: type === "magiclink" ? "magiclink" : "email",
        });
        if (verifyError) {
          setStatus("error");
          navigate("/auth?mode=login", { replace: true });
          return;
        }
        setStatus("done");
        navigate("/auth?mode=login&confirmed=1", { replace: true });
        return;
      }

      const { data: { session }, error } = await client.auth.getSession();
      if (!error && session?.user) {
        setStatus("done");
        navigate("/auth?mode=login&confirmed=1", { replace: true });
        return;
      }

      setStatus("error");
      navigate("/auth?mode=login", { replace: true });
    };

    run();
  }, [navigate]);

  return (
    <div style={{ minHeight: "calc(100vh - var(--nav-height))", display: "flex", alignItems: "center", justifyContent: "center", padding: 24 }}>
      <div style={{ textAlign: "center" }}>
        {status === "verifying" && (
          <>
            <p style={{ fontFamily: "var(--font-sans)", fontSize: "var(--text-lg)", marginBottom: 12 }}>Signing you in…</p>
            <div style={{ display: "flex", gap: 6, justifyContent: "center" }}>
              {[0, 1, 2].map((i) => (
                <span
                  key={i}
                  style={{
                    width: 8,
                    height: 8,
                    borderRadius: "50%",
                    backgroundColor: "var(--color-primary)",
                    animation: `thinkingDot 1.2s ease-in-out infinite ${i * 180}ms`,
                  }}
                />
              ))}
            </div>
          </>
        )}
        {status === "error" && <p style={{ color: "var(--color-text-muted)" }}>Something went wrong. Redirecting to log in…</p>}
        {status === "done" && <p style={{ color: "var(--color-text-muted)" }}>Redirecting…</p>}
      </div>
    </div>
  );
};
