import React, { useState, useEffect, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { Sidebar } from "@/components/layout/Sidebar";
import { getPersonalizedRoadmap, isAuthed } from "@/lib/stubData";
import { ProgressTrackerContent } from "@/pages/Dashboard";
import { AccountPopup } from "@/components/ui/Modal";
import { POST_ONBOARDING_PROMPT_SIGNUP } from "@/lib/onboardingSchema";

/**
 * Learning = first-class tab: lesson list + progress/next lesson content.
 * Uses the personalized roadmap from the stored LearningProfile.
 * Falls back to the static roadmap when no profile is present.
 * Shows create-account popup once when arriving from the questionnaire without signing up.
 */
export const Learning: React.FC = () => {
  const navigate = useNavigate();
  const [showAccountPopup, setShowAccountPopup] = useState(false);

  /* Personalized lesson list — recalculated once on mount */
  const lessons = useMemo(() => getPersonalizedRoadmap(), []);
  const completedCount = lessons.filter((l) => l.status === "completed").length;

  useEffect(() => {
    try {
      if (!isAuthed && sessionStorage.getItem(POST_ONBOARDING_PROMPT_SIGNUP) === "1") {
        sessionStorage.removeItem(POST_ONBOARDING_PROMPT_SIGNUP);
        setShowAccountPopup(true);
      }
    } catch {
      /* ignore */
    }
  }, []);

  return (
    <>
      <div style={{ display: "flex", position: "relative" }}>
        <Sidebar
          title="Your Path"
          subtitle={`${completedCount} of ${lessons.length} lessons personalized for you`}
          lessons={lessons}
        />
        <div style={{ flex: 1, minWidth: 0 }}>
          <ProgressTrackerContent />
        </div>
      </div>
      <AccountPopup
        open={showAccountPopup}
        onClose={() => setShowAccountPopup(false)}
        onSignUp={() => { setShowAccountPopup(false); navigate("/dashboard/progress"); }}
        onLogin={() => { setShowAccountPopup(false); navigate("/dashboard/progress"); }}
      />
    </>
  );
};
