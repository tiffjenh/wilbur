import React from "react";
import { Link } from "react-router-dom";
import { Icon } from "@/components/ui/Icon";

export const AdminHome: React.FC = () => {
  return (
    <div style={{ padding: "var(--space-8) var(--page-px)", maxWidth: 800, margin: "0 auto" }}>
      <h1 style={{ fontFamily: "var(--font-serif)", marginBottom: "var(--space-2)", color: "var(--color-text)" }}>
        Admin
      </h1>
      <p style={{ color: "var(--color-text-secondary)", marginBottom: "var(--space-6)" }}>
        Manage CMS lessons and publishing.
      </p>
      <div style={{ display: "flex", flexDirection: "column", gap: "var(--space-3)" }}>
        <Link
          to="/admin/lessons"
          style={{
            display: "inline-flex",
            alignItems: "center",
            gap: "var(--space-3)",
            padding: "var(--space-4) var(--space-5)",
            backgroundColor: "var(--color-surface)",
            border: "2px solid var(--color-black)",
            borderRadius: "var(--radius-md)",
            fontFamily: "var(--font-sans)",
            fontSize: "var(--text-base)",
            fontWeight: 600,
            color: "var(--color-text)",
            textDecoration: "none",
          }}
        >
          <Icon name="book-open" size={20} strokeWidth={1.8} />
          Lessons
        </Link>
        <Link
          to="/admin/lessons/new"
          style={{
            display: "inline-flex",
            alignItems: "center",
            gap: "var(--space-3)",
            padding: "var(--space-4) var(--space-5)",
            backgroundColor: "var(--color-surface)",
            border: "2px solid var(--color-black)",
            borderRadius: "var(--radius-md)",
            fontFamily: "var(--font-sans)",
            fontSize: "var(--text-base)",
            fontWeight: 600,
            color: "var(--color-text)",
            textDecoration: "none",
          }}
        >
          <Icon name="plus" size={20} strokeWidth={1.8} />
          New lesson
        </Link>
      </div>
    </div>
  );
};
