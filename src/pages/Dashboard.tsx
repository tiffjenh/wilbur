import React, { useState, useMemo } from "react";
import { getPersonalizedRoadmap } from "@/lib/stubData";
import { AccountPopup } from "@/components/ui/Modal";
import { Button } from "@/components/ui/Button";
import { useNavigate } from "react-router-dom";
import { loadProfile, levelLabel } from "@/lib/personalizationEngine";

/* ── Confidence bar: 5-segment visual ── */
const ConfidenceVisual: React.FC<{ score: number }> = ({ score }) => (
  <div style={{ display: "flex", gap: "4px", marginTop: "4px" }}>
    {[1, 2, 3, 4, 5].map((n) => (
      <div
        key={n}
        style={{
          flex: 1,
          height: "6px",
          borderRadius: "var(--radius-full)",
          backgroundColor:
            n <= score ? "var(--color-primary)" : "var(--color-border-light)",
          transition: "background-color 0.3s",
        }}
      />
    ))}
  </div>
);

export const ProgressTrackerContent: React.FC = () => {
  const lessons = useMemo(() => getPersonalizedRoadmap(), []);
  const profile = useMemo(() => loadProfile(), []);
  const navigate = useNavigate();

  const completedCount = lessons.filter((l) => l.status === "completed").length;
  const nextLesson     = lessons.find((l) => l.status === "available");

  const confidenceScore = profile?.confidenceScore ?? 3;
  const levelName       = profile ? levelLabel(profile.level) : "Beginner";
  const focusAreas      = profile?.focusAreas ?? [];

  return (
    <div style={{ padding: "var(--space-8) var(--space-6)", maxWidth: "var(--content-max)", margin: "0 auto" }}>
      {/* Welcome */}
      <div className="page-enter" style={{ marginBottom: "var(--space-8)" }}>
        <h1 style={{ fontFamily: "var(--font-serif)", fontSize: "var(--text-2xl)", fontWeight: 600, marginBottom: "8px" }}>
          Progress Tracker
        </h1>
        <p style={{ color: "var(--color-text-muted)", fontSize: "var(--text-base)" }}>
          Track your learning journey and confidence.
        </p>
      </div>

      {/* Stats row */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(180px, 1fr))", gap: "var(--space-4)", marginBottom: "var(--space-8)" }}>
        <div className="stagger-item" style={{ backgroundColor: "var(--color-surface)", borderRadius: "var(--radius-lg)", padding: "var(--space-5)", border: "1px solid var(--color-border-light)", boxShadow: "var(--shadow-sm)" }}>
          <div style={{ fontSize: "var(--text-2xl)", fontFamily: "var(--font-serif)", fontWeight: 600, color: "var(--color-text)", marginBottom: "4px" }}>{completedCount}</div>
          <div style={{ fontSize: "var(--text-xs)", color: "var(--color-text-muted)", textTransform: "uppercase", letterSpacing: "0.06em" }}>Lessons Completed</div>
          <div style={{ fontSize: "var(--text-sm)", color: "var(--color-text-secondary)", marginTop: "2px" }}>of {lessons.length}</div>
        </div>

        <div className="stagger-item" style={{ backgroundColor: "var(--color-surface)", borderRadius: "var(--radius-lg)", padding: "var(--space-5)", border: "1px solid var(--color-border-light)", boxShadow: "var(--shadow-sm)" }}>
          <div style={{ fontSize: "var(--text-2xl)", fontFamily: "var(--font-serif)", fontWeight: 600, color: "var(--color-text)", marginBottom: "4px" }}>{levelName}</div>
          <div style={{ fontSize: "var(--text-xs)", color: "var(--color-text-muted)", textTransform: "uppercase", letterSpacing: "0.06em" }}>Confidence Level</div>
          <ConfidenceVisual score={confidenceScore} />
        </div>

        <div className="stagger-item" style={{ backgroundColor: "var(--color-surface)", borderRadius: "var(--radius-lg)", padding: "var(--space-5)", border: "1px solid var(--color-border-light)", boxShadow: "var(--shadow-sm)" }}>
          <div style={{ fontSize: "var(--text-2xl)", fontFamily: "var(--font-serif)", fontWeight: 600, color: "var(--color-text)", marginBottom: "4px" }}>3</div>
          <div style={{ fontSize: "var(--text-xs)", color: "var(--color-text-muted)", textTransform: "uppercase", letterSpacing: "0.06em" }}>Learning Streak</div>
          <div style={{ fontSize: "var(--text-sm)", color: "var(--color-text-secondary)", marginTop: "2px" }}>days</div>
        </div>
      </div>

      {/* Focus areas (shown when profile exists) */}
      {focusAreas.length > 0 && (
        <div style={{ backgroundColor: "var(--color-surface)", borderRadius: "var(--radius-lg)", padding: "var(--space-5)", border: "1px solid var(--color-border-light)", boxShadow: "var(--shadow-sm)", marginBottom: "var(--space-6)" }}>
          <h2 style={{ fontFamily: "var(--font-serif)", fontSize: "var(--text-lg)", fontWeight: 600, marginBottom: "var(--space-3)" }}>Your Focus Areas</h2>
          <div style={{ display: "flex", flexWrap: "wrap", gap: "8px" }}>
            {focusAreas.map((area) => (
              <span key={area} style={{
                padding: "4px 12px",
                borderRadius: "var(--radius-full)",
                backgroundColor: "var(--color-accent-light)",
                color: "var(--color-primary)",
                fontSize: "var(--text-xs)",
                fontWeight: 600,
                textTransform: "capitalize",
              }}>
                {area.replace(/-/g, " ")}
              </span>
            ))}
          </div>
        </div>
      )}

      {/* Progress section */}
      <div style={{ backgroundColor: "var(--color-surface)", borderRadius: "var(--radius-lg)", padding: "var(--space-6)", border: "1px solid var(--color-border-light)", boxShadow: "var(--shadow-sm)", marginBottom: "var(--space-6)" }}>
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "var(--space-4)" }}>
          <h2 style={{ fontFamily: "var(--font-serif)", fontSize: "var(--text-lg)", fontWeight: 600 }}>Your Progress</h2>
          <span style={{ fontSize: "var(--text-sm)", color: "var(--color-text-muted)" }}>
            {completedCount} of {lessons.length} completed
          </span>
        </div>
        <div style={{ height: "8px", backgroundColor: "var(--color-border-light)", borderRadius: "var(--radius-full)", overflow: "hidden" }}>
          <div style={{
            height: "100%",
            width: `${lessons.length > 0 ? (completedCount / lessons.length) * 100 : 0}%`,
            backgroundColor: "var(--color-primary)",
            borderRadius: "var(--radius-full)",
            animation: "progressGrow 1s var(--ease-out)",
          }} />
        </div>
      </div>

      {/* Next lesson */}
      {nextLesson && (
        <div style={{ backgroundColor: "var(--color-surface)", borderRadius: "var(--radius-lg)", padding: "var(--space-6)", border: "1px solid var(--color-border-light)", boxShadow: "var(--shadow-sm)" }}>
          <div style={{ fontSize: "var(--text-xs)", fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.08em", color: "var(--color-text-muted)", marginBottom: "var(--space-3)" }}>
            Up Next
          </div>
          <h3 style={{ fontFamily: "var(--font-serif)", fontSize: "var(--text-xl)", fontWeight: 600, marginBottom: "8px" }}>
            {nextLesson.title}
          </h3>
          <p style={{ fontSize: "var(--text-sm)", color: "var(--color-text-muted)", marginBottom: "var(--space-5)" }}>
            {nextLesson.category} · {nextLesson.duration}
          </p>
          <Button variant="primary" size="md" onClick={() => navigate(`/lesson/${nextLesson.slug}`)}>
            Continue Learning →
          </Button>
        </div>
      )}
    </div>
  );
};

/**
 * Dashboard = Progress Tracker only. Account-gated; no lesson sidebar.
 * Route: /dashboard, /dashboard/progress
 */
export const Dashboard: React.FC = () => {
  const [showPopup, setShowPopup] = useState(false);
  const navigate = useNavigate();

  return (
    <>
      <div style={{ position: "relative" }}>
        <ProgressTrackerContent />
      </div>

      <AccountPopup
        open={showPopup}
        onClose={() => setShowPopup(false)}
        onSignUp={() => { setShowPopup(false); navigate("/auth?mode=signup"); }}
        onLogin={() => { setShowPopup(false); navigate("/auth?mode=login"); }}
      />
    </>
  );
};
