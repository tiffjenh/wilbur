import React from "react";
import { Sidebar } from "@/components/layout/Sidebar";
import { roadmapLessons } from "@/lib/stubData";
import { ProgressTrackerContent } from "@/pages/Dashboard";

/**
 * Learning = first-class tab: lesson list shell + progress/next lesson content.
 * No account gate; always accessible.
 */
export const Learning: React.FC = () => (
  <div style={{ display: "flex", position: "relative" }}>
    <Sidebar
      title="Your Path"
      subtitle={`${roadmapLessons.filter((l) => l.status === "completed").length} lessons personalized for you`}
      lessons={roadmapLessons}
    />
    <div style={{ flex: 1, minWidth: 0 }}>
      <ProgressTrackerContent />
    </div>
  </div>
);
