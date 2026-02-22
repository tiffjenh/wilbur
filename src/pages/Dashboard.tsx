import React, { useState } from "react";
import { roadmapLessons, isAuthed } from "@/lib/stubData";
import { AccountPopup } from "@/components/ui/Modal";
import { Button } from "@/components/ui/Button";
import { useNavigate } from "react-router-dom";

export const ProgressTrackerContent: React.FC = () => {
  const completedCount = roadmapLessons.filter((l) => l.status === "completed").length;
  const nextLesson = roadmapLessons.find((l) => l.status === "available");
  const navigate = useNavigate();

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
        {[
          { label: "Lessons Completed", value: `${completedCount}`, sub: `of ${roadmapLessons.length}` },
          { label: "Confidence Level", value: "Builder", sub: "Level 2" },
          { label: "Learning Streak", value: "3", sub: "days" },
        ].map((stat) => (
          <div key={stat.label} className="stagger-item" style={{
            backgroundColor: "var(--color-surface)",
            borderRadius: "var(--radius-lg)",
            padding: "var(--space-5)",
            border: "1px solid var(--color-border-light)",
            boxShadow: "var(--shadow-sm)",
          }}>
            <div style={{ fontSize: "var(--text-2xl)", fontFamily: "var(--font-serif)", fontWeight: 600, color: "var(--color-text)", marginBottom: "4px" }}>{stat.value}</div>
            <div style={{ fontSize: "var(--text-xs)", color: "var(--color-text-muted)", textTransform: "uppercase", letterSpacing: "0.06em" }}>{stat.label}</div>
            <div style={{ fontSize: "var(--text-sm)", color: "var(--color-text-secondary)", marginTop: "2px" }}>{stat.sub}</div>
          </div>
        ))}
      </div>

      {/* Progress section */}
      <div style={{
        backgroundColor: "var(--color-surface)",
        borderRadius: "var(--radius-lg)",
        padding: "var(--space-6)",
        border: "1px solid var(--color-border-light)",
        boxShadow: "var(--shadow-sm)",
        marginBottom: "var(--space-6)",
      }}>
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "var(--space-4)" }}>
          <h2 style={{ fontFamily: "var(--font-serif)", fontSize: "var(--text-lg)", fontWeight: 600 }}>Your Progress</h2>
          <span style={{ fontSize: "var(--text-sm)", color: "var(--color-text-muted)" }}>
            {completedCount} of {roadmapLessons.length} completed
          </span>
        </div>
        <div style={{
          height: "8px",
          backgroundColor: "var(--color-border-light)",
          borderRadius: "var(--radius-full)",
          overflow: "hidden",
        }}>
          <div style={{
            height: "100%",
            width: `${(completedCount / roadmapLessons.length) * 100}%`,
            backgroundColor: "var(--color-primary)",
            borderRadius: "var(--radius-full)",
            animation: "progressGrow 1s var(--ease-out)",
          }} />
        </div>
      </div>

      {/* Next lesson */}
      {nextLesson && (
        <div style={{
          backgroundColor: "var(--color-surface)",
          borderRadius: "var(--radius-lg)",
          padding: "var(--space-6)",
          border: "1px solid var(--color-border-light)",
          boxShadow: "var(--shadow-sm)",
        }}>
          <div style={{ fontSize: "var(--text-xs)", fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.08em", color: "var(--color-text-muted)", marginBottom: "var(--space-3)" }}>
            Up Next
          </div>
          <h3 style={{ fontFamily: "var(--font-serif)", fontSize: "var(--text-xl)", fontWeight: 600, marginBottom: "8px" }}>
            {nextLesson.title}
          </h3>
          <p style={{ fontSize: "var(--text-sm)", color: "var(--color-text-muted)", marginBottom: "var(--space-5)" }}>
            {nextLesson.category} · {nextLesson.duration}
          </p>
          <Button
            variant="primary"
            size="md"
            onClick={() => navigate(`/lesson/${nextLesson.slug}`)}
          >
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
  const [showPopup, setShowPopup] = useState(!isAuthed);
  const navigate = useNavigate();

  return (
    <>
      <div style={{ position: "relative" }}>
        <ProgressTrackerContent />
      </div>

      <AccountPopup
        open={showPopup}
        onClose={() => setShowPopup(false)}
        onSignUp={() => { setShowPopup(false); navigate("/dashboard/progress"); }}
        onLogin={() => { setShowPopup(false); navigate("/dashboard/progress"); }}
      />
    </>
  );
};
