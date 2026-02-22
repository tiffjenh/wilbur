import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { MascotPink } from "@/components/ui/MascotPink";
import { MascotGreen } from "@/components/ui/MascotGreen";

/** Pigs + stacked books graphic (teal top, pink bottom) */
const BooksStack: React.FC<{ className?: string }> = ({ className }) => (
  <div
    className={className}
    style={{
      display: "flex",
      flexDirection: "column",
      alignItems: "center",
      gap: "2px",
      marginLeft: "-8px",
    }}
  >
    <div
      style={{
        width: "28px",
        height: "22px",
        borderRadius: "4px",
        backgroundColor: "var(--color-primary)",
        boxShadow: "0 1px 3px rgba(0,0,0,0.12)",
      }}
    />
    <div
      style={{
        width: "28px",
        height: "22px",
        borderRadius: "4px",
        backgroundColor: "var(--color-pink)",
        boxShadow: "0 1px 3px rgba(0,0,0,0.08)",
      }}
    />
  </div>
);

/**
 * Post-questionnaire completion screen: pink and green pigs with books, walking animation,
 * "Great! Thanks for answering. Building out your custom lessons now", and loading dots.
 * Redirects to /learning after a short delay.
 */
export const OnboardingComplete: React.FC = () => {
  const navigate = useNavigate();

  useEffect(() => {
    const t = setTimeout(() => navigate("/learning", { replace: true }), 4000);
    return () => clearTimeout(t);
  }, [navigate]);

  return (
    <div
      className="page-enter"
      style={{
        minHeight: "100vh",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        padding: "24px",
        backgroundColor: "var(--color-bg)",
      }}
    >
      {/* Pigs holding books, walking */}
      <div
        style={{
          display: "flex",
          alignItems: "flex-end",
          justifyContent: "center",
          gap: "4px",
          marginBottom: "32px",
          animation: "pigsWalk 2.2s ease-in-out infinite",
        }}
      >
        <MascotGreen size={100} />
        <BooksStack />
        <MascotPink size={110} style={{ marginBottom: "-4px" }} />
        <BooksStack />
      </div>

      {/* Message */}
      <h2
        style={{
          fontFamily: "var(--font-serif)",
          fontSize: "var(--text-2xl)",
          fontWeight: 700,
          color: "var(--color-text)",
          marginBottom: "8px",
          textAlign: "center",
        }}
      >
        Great! Thanks for answering.
      </h2>
      <p
        style={{
          fontFamily: "var(--font-sans)",
          fontSize: "var(--text-base)",
          color: "var(--color-text-muted)",
          textAlign: "center",
          marginBottom: "28px",
        }}
      >
        Building out your custom lessons now...
      </p>

      {/* Loading dots */}
      <div style={{ display: "flex", gap: "8px", justifyContent: "center" }}>
        {[0, 1, 2].map((i) => (
          <span
            key={i}
            style={{
              width: "10px",
              height: "10px",
              borderRadius: "50%",
              backgroundColor: "var(--color-primary)",
              animation: `loadingDotsBounce 1s ease-in-out infinite ${i * 120}ms`,
            }}
          />
        ))}
      </div>
    </div>
  );
};
