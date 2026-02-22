import React from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import { AppShell } from "@/components/layout/AppShell";
import { Home } from "@/pages/Home";
import { Dashboard } from "@/pages/Dashboard";
import { Learning } from "@/pages/Learning";
import { Library, LibraryCategory } from "@/pages/Library";
import { Resources } from "@/pages/Resources";
import { Profile } from "@/pages/Profile";
import { Lesson } from "@/pages/Lesson";
import { Onboarding } from "@/pages/Onboarding";
import { OnboardingComplete } from "@/pages/OnboardingComplete";

const App: React.FC = () => {
  return (
    <AppShell>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/onboarding" element={<Onboarding />} />
        <Route path="/onboarding/complete" element={<OnboardingComplete />} />
        <Route path="/dashboard/progress" element={<Dashboard />} />
        <Route path="/dashboard" element={<Navigate to="/dashboard/progress" replace />} />
        <Route path="/learning" element={<Learning />} />
        <Route path="/library" element={<Library />} />
        <Route path="/library/:slug" element={<LibraryCategory />} />
        <Route path="/resources" element={<Resources />} />
        <Route path="/resources/:slug" element={<Resources />} />
        <Route path="/profile" element={<Profile />} />
        <Route path="/lesson/:slug" element={<Lesson />} />
        {/* Catch-all */}
        <Route path="*" element={<Home />} />
      </Routes>
    </AppShell>
  );
};

export default App;
