import React from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import { AppShell } from "@/components/layout/AppShell";
import { ProtectedRoute } from "@/components/ProtectedRoute";
import { AdminRoute } from "@/components/AdminRoute";
import { Home } from "@/pages/Home";
import { Dashboard } from "@/pages/Dashboard";
import { Learning } from "@/pages/Learning";
import { Library, LibraryCategory } from "@/pages/Library";
import { Resources } from "@/pages/Resources";
import { Profile } from "@/pages/Profile";
import { Account } from "@/pages/Account";
import { Settings } from "@/pages/Settings";
import { Lesson } from "@/pages/Lesson";
import { Onboarding } from "@/pages/Onboarding";
import { OnboardingComplete } from "@/pages/OnboardingComplete";
import { Auth } from "@/pages/Auth";
import { AuthCallback } from "@/pages/AuthCallback";
import { Logout } from "@/pages/Logout";
import { AdminHome } from "@/pages/admin/AdminHome";
import { AdminLessonsList } from "@/pages/admin/AdminLessonsList";
import { AdminLessonEditor } from "@/pages/admin/AdminLessonEditor";
import { AdminLessonPreview } from "@/pages/admin/AdminLessonPreview";
import CatalogAuditPage from "@/pages/dev/CatalogAuditPage";
import LessonPreview from "@/pages/dev/LessonPreview";

const App: React.FC = () => {
  return (
    <AppShell>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/onboarding" element={<Onboarding />} />
        <Route path="/onboarding/complete" element={<OnboardingComplete />} />
        <Route path="/auth" element={<Auth />} />
        <Route path="/login" element={<Navigate to="/auth?mode=login" replace />} />
        <Route path="/signup" element={<Navigate to="/auth?mode=signup" replace />} />
        <Route path="/auth/callback" element={<AuthCallback />} />
        <Route path="/logout" element={<Logout />} />
        <Route path="/dashboard/progress" element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
        <Route path="/dashboard" element={<Navigate to="/dashboard/progress" replace />} />
        <Route path="/learning" element={<Learning />} />
        <Route path="/library" element={<Library />} />
        <Route path="/library/:slug" element={<LibraryCategory />} />
        <Route path="/resources" element={<Resources />} />
        <Route path="/resources/:slug" element={<Resources />} />
        <Route path="/profile" element={<ProtectedRoute><Profile /></ProtectedRoute>} />
        <Route path="/account" element={<ProtectedRoute><Account /></ProtectedRoute>} />
        <Route path="/settings" element={<ProtectedRoute><Settings /></ProtectedRoute>} />
        <Route path="/lesson/:slug" element={<Lesson />} />
        {/* Admin (gated by AdminRoute) */}
        <Route path="/admin" element={<AdminRoute><AdminHome /></AdminRoute>} />
        <Route path="/admin/lessons" element={<AdminRoute><AdminLessonsList /></AdminRoute>} />
        <Route path="/admin/lessons/new" element={<AdminRoute><AdminLessonEditor mode="create" /></AdminRoute>} />
        <Route path="/admin/lessons/:id" element={<AdminRoute><AdminLessonEditor mode="edit" /></AdminRoute>} />
        <Route path="/admin/lessons/:id/preview" element={<AdminRoute><AdminLessonPreview /></AdminRoute>} />
        <Route path="/dev/catalog-audit" element={<CatalogAuditPage />} />
        <Route path="/dev/lesson-preview" element={<LessonPreview />} />
        {/* Catch-all */}
        <Route path="*" element={<Home />} />
      </Routes>
    </AppShell>
  );
};

export default App;
