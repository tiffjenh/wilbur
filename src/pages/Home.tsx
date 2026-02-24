import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { MascotPink } from "@/components/ui/MascotPink";
import { MascotGreen } from "@/components/ui/MascotGreen";
import { Icon } from "@/components/ui/Icon";

/** Floating dollar badge — smaller and more subtle per mock */
const FloatingDollar: React.FC<{ style?: React.CSSProperties; delay?: number }> = ({ style, delay = 0 }) => (
  <div style={{
    width: "26px", height: "26px", borderRadius: "50%",
    backgroundColor: "rgba(180, 218, 190, 0.32)",
    border: "1px solid rgba(140, 190, 155, 0.28)",
    display: "flex", alignItems: "center", justifyContent: "center",
    fontSize: "11px", fontWeight: 700, color: "#2a6040",
    fontFamily: "var(--font-sans)",
    animation: `floatY 3.2s ease-in-out infinite ${delay}ms`,
    position: "absolute",
    opacity: 0.78,
    ...style,
  }}>
    $
  </div>
);

/** Decorative ring — reduced opacity per mock */
const DecorativeRing: React.FC<{ size: number; style?: React.CSSProperties }> = ({ size, style }) => (
  <div style={{
    width: size, height: size, borderRadius: "50%",
    border: "1px solid rgba(180, 190, 170, 0.12)",
    position: "absolute",
    pointerEvents: "none",
    ...style,
  }} />
);

/** Transition screen shown after Get Started: pig + coin + dots, then route to onboarding */
const GetStartedTransition: React.FC<{ onDone: () => void }> = ({ onDone }) => {
  useEffect(() => {
    const t = setTimeout(onDone, 2000);
    return () => clearTimeout(t);
  }, [onDone]);

  return (
    <div
      className="page-enter"
      style={{
        position: "fixed",
        inset: 0,
        zIndex: 50,
        backgroundColor: "var(--color-bg)",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        padding: "24px",
      }}
    >
      <p
        style={{
          fontFamily: "var(--font-sans)",
          fontSize: "var(--text-lg)",
          color: "var(--color-text)",
          textAlign: "center",
          maxWidth: "420px",
          lineHeight: 1.6,
          marginBottom: "48px",
        }}
      >
        Take a quick questionnaire to help us build a learning path tailored to you.
      </p>
      <div style={{ position: "relative", display: "flex", flexDirection: "column", alignItems: "center" }}>
        {/* Pig with shake */}
        <div style={{ animation: "pigShake 1.8s ease-in-out infinite" }}>
          <MascotPink size={140} />
        </div>
        {/* Gold coin dropping into pig back */}
        <div
          style={{
            position: "absolute",
            top: "-24px",
            left: "50%",
            marginLeft: "-14px",
            width: "28px",
            height: "28px",
            borderRadius: "50%",
            background: "linear-gradient(145deg, #e8c547 0%, #c9a227 50%, #e8c547 100%)",
            boxShadow: "none",
            animation: "coinDrop 2s ease-in 1 forwards",
          }}
        />
        {/* Three green dots (loading) */}
        <div style={{ display: "flex", gap: "8px", marginTop: "20px", justifyContent: "center" }}>
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
    </div>
  );
};

export const Home: React.FC = () => {
  const [showTransition, setShowTransition] = useState(false);
  const navigate = useNavigate();
  const { user } = useAuth();
  const isLoggedIn = !!user;

  const handleGetStarted = () => {
    setShowTransition(true);
  };

  const goToOnboarding = () => {
    navigate("/onboarding");
  };

  const goToDashboard = () => {
    navigate("/dashboard/progress");
  };

  return (
    <>
      {showTransition && !isLoggedIn && <GetStartedTransition onDone={goToOnboarding} />}
      <div className="page-enter" style={{ minHeight: "calc(100vh - var(--nav-height))", display: "flex", flexDirection: "column" }}>

      {/* ── Hero section ─────────────────────────────── */}
      <div style={{
        flex: 1,
        display: "flex",
        alignItems: "center",
        maxWidth: "1100px",
        margin: "0 auto",
        padding: "32px 40px 40px",
        gap: "32px",
        width: "100%",
      }}>

        {/* Left: headline + copy + CTA */}
        <div style={{ flex: "0 0 auto", maxWidth: "460px", minWidth: "280px" }}>
          <div style={{ position: "relative" }}>
            <DecorativeRing size={160} style={{ top: "-32px", left: "-60px" }} />

            <h1 style={{
              fontFamily: "var(--font-serif)",
              fontSize: "var(--text-hero)",
              fontWeight: 700,
              lineHeight: 1.08,
              letterSpacing: "-0.025em",
              color: "var(--color-text)",
              marginBottom: "6px",
            }}>
              Finance, but
              <br />
              make it fun
            </h1>

            {/* Hand-drawn style underline under "make it fun" — soft curve, not straight */}
            <svg width="200" height="12" viewBox="0 0 200 12" fill="none" style={{ display: "block", marginBottom: "18px", overflow: "visible" }} aria-hidden="true">
              <path
                d="M 2 8 Q 45 4, 95 7 Q 145 10, 198 6"
                stroke="#e08a9a"
                strokeWidth="4"
                strokeLinecap="round"
                strokeLinejoin="round"
                fill="none"
                opacity="0.9"
              />
              <path
                d="M 0 9.5 Q 50 5.5, 100 8.5 T 200 7"
                stroke="#d4534a"
                strokeWidth="2.5"
                strokeLinecap="round"
                strokeLinejoin="round"
                fill="none"
                opacity="0.85"
              />
            </svg>

            <p style={{
              fontSize: "var(--text-base)",
              color: "var(--color-text-muted)",
              lineHeight: 1.7,
              marginBottom: "28px",
              maxWidth: "380px",
            }}>
              Learn money stuff that actually matters to you. No boring lectures. No intimidating jargon. Just clear, visual lessons.
            </p>

            {isLoggedIn ? (
              <button
                onClick={goToDashboard}
                style={{
                  display: "inline-flex",
                  alignItems: "center",
                  gap: "8px",
                  padding: "14px 30px",
                  backgroundColor: "var(--color-pink)",
                  color: "var(--color-black)",
                  border: "2px solid var(--color-black)",
                  borderRadius: "var(--radius-lg)",
                  fontSize: "var(--text-base)",
                  fontWeight: 600,
                  fontFamily: "var(--font-sans)",
                  cursor: "pointer",
                  letterSpacing: "0.005em",
                  transition: "background-color var(--duration-fast) var(--ease-out), transform var(--duration-fast) var(--ease-out), filter var(--duration-fast)",
                }}
                onMouseEnter={(e) => { (e.currentTarget as HTMLElement).style.filter = "brightness(0.97)"; (e.currentTarget as HTMLElement).style.transform = "translateY(-1px)"; }}
                onMouseLeave={(e) => { (e.currentTarget as HTMLElement).style.filter = "none"; (e.currentTarget as HTMLElement).style.transform = "translateY(0)"; }}
              >
                <Icon name="target" size={18} strokeWidth={2} color="currentColor" style={{ flexShrink: 0 }} />
                Go to Dashboard
              </button>
            ) : (
              <button
                onClick={handleGetStarted}
                style={{
                  display: "inline-flex",
                  alignItems: "center",
                  gap: "8px",
                  padding: "14px 30px",
                  backgroundColor: "var(--color-pink)",
                  color: "var(--color-black)",
                  border: "2px solid var(--color-black)",
                  borderRadius: "var(--radius-lg)",
                  fontSize: "var(--text-base)",
                  fontWeight: 600,
                  fontFamily: "var(--font-sans)",
                  cursor: "pointer",
                  letterSpacing: "0.005em",
                  transition: "background-color var(--duration-fast) var(--ease-out), transform var(--duration-fast) var(--ease-out), filter var(--duration-fast)",
                }}
                onMouseEnter={(e) => { (e.currentTarget as HTMLElement).style.filter = "brightness(0.97)"; (e.currentTarget as HTMLElement).style.transform = "translateY(-1px)"; }}
                onMouseLeave={(e) => { (e.currentTarget as HTMLElement).style.filter = "none"; (e.currentTarget as HTMLElement).style.transform = "translateY(0)"; }}
              >
                <Icon name="money-bag" size={18} strokeWidth={2} color="currentColor" style={{ flexShrink: 0 }} />
                Get started
              </button>
            )}
          </div>
        </div>

        {/* Right: mascot illustration — larger scale, overlap, less gap */}
        <div style={{ flex: 1, position: "relative", display: "flex", alignItems: "flex-end", justifyContent: "center", minHeight: "260px", maxWidth: "520px" }}>
          <DecorativeRing size={240} style={{ top: "0", right: "10px" }} />
          <DecorativeRing size={120} style={{ bottom: "16px", left: "0" }} />

          {/* Curved text — reduced opacity */}
          <div style={{
            position: "absolute", top: "0", right: "50px",
            width: "90px", height: "90px",
            border: "1px solid rgba(60, 100, 70, 0.1)",
            borderRadius: "50%",
          }}>
            <svg viewBox="0 0 100 100" style={{ width: "100%", height: "100%", overflow: "visible" }}>
              <defs>
                <path id="circlePath" d="M 50 50 m -36 0 a 36 36 0 1 1 72 0 a 36 36 0 1 1 -72 0" />
              </defs>
              <text style={{ fontSize: "6px", fill: "rgba(60, 100, 70, 0.14)", fontFamily: "var(--font-sans)", letterSpacing: "0.08em" }}>
                <textPath href="#circlePath">actually fun to learn • actually fun to be •</textPath>
              </text>
            </svg>
          </div>

          <FloatingDollar style={{ left: "6%", top: "24%" }} delay={0} />
          <FloatingDollar style={{ left: "18%", bottom: "20%" }} delay={350} />
          <FloatingDollar style={{ left: "32%", bottom: "6%" }} delay={700} />
          <FloatingDollar style={{ right: "4%", top: "12%" }} delay={150} />

          {/* Green pig — behind, larger scale */}
          <div style={{ position: "absolute", bottom: "0", right: "8%", zIndex: 1 }}>
            <MascotGreen size={200} animate />
          </div>

          {/* Pink pig — front, larger, overlapping green (reduced marginRight for overlap) */}
          <div style={{ position: "relative", zIndex: 2, marginRight: "48px", marginBottom: "0" }}>
            <MascotPink size={260} animate />
          </div>
        </div>
      </div>

      {/* ── "Dead simple" section ────────────────────── */}
      <div style={{ padding: "0 32px 56px", maxWidth: "1200px", margin: "0 auto", width: "100%" }}>
        <div style={{
          backgroundColor: "var(--color-primary)",
          borderRadius: "var(--radius-3xl)",
          padding: "68px 56px",
          textAlign: "center",
        }}>
          <h2 style={{
            fontFamily: "var(--font-serif)",
            fontSize: "var(--text-dead-simple)",
            fontWeight: 700,
            color: "#fff",
            marginBottom: "16px",
            lineHeight: 1.12,
          }}>
            Dead simple
          </h2>
          <p style={{
            fontSize: "var(--text-base)",
            color: "rgba(255,255,255,0.72)",
            maxWidth: "480px",
            margin: "0 auto",
            lineHeight: 1.72,
          }}>
            Answer a few questions, get a learning path made just for you, and start understanding money in minutes.
          </p>
        </div>
      </div>
    </div>
    </>
  );
};
