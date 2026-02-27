import React, { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { Icon } from "@/components/ui/Icon";

/** Floating dollar badge — green or pink variant */
const FloatingDollar: React.FC<{ style?: React.CSSProperties; delay?: number; variant?: "green" | "pink" }> = ({ style, delay = 0, variant = "green" }) => {
  const isPink = variant === "pink";
  return (
    <div style={{
      width: "26px", height: "26px", borderRadius: "50%",
      backgroundColor: isPink ? "rgba(224, 138, 154, 0.36)" : "rgba(180, 218, 190, 0.32)",
      border: isPink ? "1px solid rgba(212, 83, 74, 0.3)" : "1px solid rgba(140, 190, 155, 0.28)",
      display: "flex", alignItems: "center", justifyContent: "center",
      fontSize: "11px", fontWeight: 700, color: isPink ? "#8b3a4a" : "#2a6040",
      fontFamily: "var(--font-sans)",
      animation: `floatY 3.2s ease-in-out infinite ${delay}ms`,
      position: "absolute",
      opacity: 0.78,
      ...style,
    }}>
      $
    </div>
  );
};

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
          <img src="/wilbur-pink-pig.png" alt="" width={140} height={140} style={{ display: "block", objectFit: "contain" }} />
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
      <div className="page-enter" style={{ minHeight: "calc(100vh - var(--nav-height))", display: "flex", flexDirection: "column", paddingTop: "48px", paddingBottom: "48px" }}>

      {/* ── Hero section (centered column, equal side margins) ── */}
      <div style={{
        display: "flex",
        alignItems: "center",
        maxWidth: "1100px",
        margin: "0 auto",
        padding: "32px 40px 32px",
        gap: "32px",
        width: "100%",
        boxSizing: "border-box",
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
              Money lessons
              <br />
              that match
              <br />
              <span style={{ position: "relative", display: "inline-block", paddingBottom: 14 }}>
                your life
                {/* Pink underline under "your life" */}
                <svg width="120" height="12" viewBox="0 0 120 12" fill="none" style={{ position: "absolute", left: 0, bottom: 2, width: "100%", height: 12, overflow: "visible" }} aria-hidden="true">
                  <path
                    d="M 2 8 Q 30 4, 60 7 Q 90 10, 118 6"
                    stroke="#e08a9a"
                    strokeWidth="4"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    fill="none"
                    opacity="0.9"
                  />
                  <path
                    d="M 0 9.5 Q 30 5.5, 60 8.5 T 120 7"
                    stroke="#d4534a"
                    strokeWidth="2.5"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    fill="none"
                    opacity="0.85"
                  />
                </svg>
              </span>
            </h1>

            <p style={{
              fontSize: "var(--text-base)",
              color: "var(--color-text-muted)",
              lineHeight: 1.7,
              marginTop: "28px",
              marginBottom: "28px",
              maxWidth: "420px",
            }}>
              Wilbur creates a personalized learning path so you can understand money, finance, and investing — without wasting time on what doesn't matter.
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
              <div style={{ display: "flex", flexWrap: "wrap", gap: "12px", alignItems: "center" }}>
                <button
                  onClick={handleGetStarted}
                  style={{
                    display: "inline-flex",
                    alignItems: "center",
                    gap: "8px",
                    padding: "14px 30px",
                    backgroundColor: "var(--color-primary)",
                    color: "#fff",
                    border: "2px solid var(--color-primary)",
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
                  Get started - it's free
                </button>
                <Link
                  to="/library"
                  style={{
                    display: "inline-flex",
                    alignItems: "center",
                    padding: "14px 30px",
                    backgroundColor: "var(--color-bg)",
                    color: "var(--color-text)",
                    border: "2px solid var(--color-black)",
                    borderRadius: "var(--radius-lg)",
                    fontSize: "var(--text-base)",
                    fontWeight: 600,
                    fontFamily: "var(--font-sans)",
                    cursor: "pointer",
                    letterSpacing: "0.005em",
                    textDecoration: "none",
                    transition: "background-color var(--duration-fast) var(--ease-out), border-color var(--duration-fast), transform var(--duration-fast) var(--ease-out)",
                  }}
                  onMouseEnter={(e) => { (e.currentTarget as HTMLElement).style.backgroundColor = "var(--color-surface-hover)"; (e.currentTarget as HTMLElement).style.transform = "translateY(-1px)"; }}
                  onMouseLeave={(e) => { (e.currentTarget as HTMLElement).style.backgroundColor = "var(--color-bg)"; (e.currentTarget as HTMLElement).style.transform = "translateY(0)"; }}
                >
                  Browse lessons
                </Link>
              </div>
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

          {/* Floating $ circles — half as many, green/pink mix around the pigs */}
          {(() => {
            const positions: { pos: React.CSSProperties; delay: number }[] = [
              { pos: { left: "6%", top: "24%" }, delay: 0 },
              { pos: { left: "18%", bottom: "20%" }, delay: 350 },
              { pos: { left: "32%", bottom: "6%" }, delay: 700 },
              { pos: { right: "4%", top: "12%" }, delay: 150 },
              { pos: { left: "12%", top: "8%" }, delay: 200 },
              { pos: { left: "24%", top: "14%" }, delay: 500 },
              { pos: { right: "14%", top: "28%" }, delay: 400 },
              { pos: { right: "22%", bottom: "14%" }, delay: 600 },
              { pos: { left: "8%", bottom: "28%" }, delay: 250 },
              { pos: { right: "8%", bottom: "8%" }, delay: 550 },
            ];
            const variants: ("green" | "pink")[] = [
              "pink", "green", "green", "pink", "green", "pink", "pink", "green",
              "green", "pink",
            ];
            return positions.map(({ pos, delay: d }, i) => (
              <FloatingDollar key={i} style={pos} delay={d} variant={variants[i]} />
            ));
          })()}

          {/* Two pigs with float animation — lighten blend hides black background on cream page */}
          <div style={{ position: "relative", zIndex: 2, marginBottom: "0", animation: "floatY 3.2s ease-in-out infinite" }}>
            <img
              src="/wilbur-pigs-together.png"
              alt=""
              width={364}
              height={364}
              style={{ display: "block", objectFit: "contain", mixBlendMode: "lighten" }}
            />
          </div>
        </div>
      </div>

      {/* ── Feature cards (centered column, equal side margins) ── */}
      <div style={{ padding: "56px 40px", maxWidth: "1100px", margin: "0 auto", width: "100%", boxSizing: "border-box" }}>
        <div style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))",
          gap: "20px",
          fontFamily: "var(--font-sans)",
        }}>
          {[
            { icon: "user" as const, title: "Actually personalized", description: "Only the topics that matter to your life right now." },
            { icon: "clock" as const, title: "Bite-sized lessons", description: "5–10 minutes each. Fits in a lunch break." },
            { icon: "bar-chart" as const, title: "Visuals over text", description: "Charts, simulators, and graphs explain everything." },
            { icon: "message-circle" as const, title: "AI help, always on", description: "Instant plain-language explanations, any time." },
          ].map(({ icon, title, description }) => (
            <div
              key={title}
              style={{
                backgroundColor: "transparent",
                borderRadius: "var(--radius-lg)",
                padding: "24px 20px",
                border: "2px solid var(--color-black)",
              }}
            >
              <div style={{ marginBottom: "12px" }}>
                <Icon name={icon} size={28} color="var(--color-primary)" strokeWidth={1.8} />
              </div>
              <h3 style={{
                fontFamily: "var(--font-sans)",
                fontSize: "var(--text-base)",
                fontWeight: 700,
                color: "var(--color-text)",
                marginBottom: "6px",
                lineHeight: 1.3,
              }}>
                {title}
              </h3>
              <p style={{
                fontSize: "var(--text-sm)",
                color: "var(--color-text-secondary)",
                lineHeight: 1.5,
                margin: 0,
              }}>
                {description}
              </p>
            </div>
          ))}
        </div>
      </div>

      {/* Footer disclaimer (centered column, equal side margins) */}
      <div style={{
        padding: "24px 40px 32px",
        maxWidth: "1100px",
        margin: "0 auto",
        width: "100%",
        boxSizing: "border-box",
        display: "flex",
        flexWrap: "wrap",
        justifyContent: "space-between",
        gap: "12px",
        fontSize: "var(--text-xs)",
        color: "var(--color-text-muted)",
        fontFamily: "var(--font-sans)",
      }}>
        <span>© 2026 Wilbur. Educational content only — not financial advice.</span>
        <span>Consult a licensed financial professional for advice specific to your situation.</span>
      </div>
    </div>
    </>
  );
};
