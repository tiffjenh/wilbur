import React from "react";
import { Link, useParams } from "react-router-dom";
import { Icon } from "../ui/Icon";
import type { Lesson } from "@/lib/stubData";

interface SidebarProps {
  title?: string;
  subtitle?: string;
  lessons: Lesson[];
  collapsed?: boolean;
  onToggle?: () => void;
}

const StatusBadge: React.FC<{ status: Lesson["status"]; index: number; isActive: boolean }> = ({ status, index, isActive }) => {
  if (isActive) {
    return (
      <span style={{
        width: "24px", height: "24px", flexShrink: 0, borderRadius: "50%",
        backgroundColor: "rgba(255,255,255,0.18)", border: "1.5px solid rgba(255,255,255,0.5)",
        display: "inline-flex", alignItems: "center", justifyContent: "center",
        fontSize: "11px", fontWeight: 700, color: "#fff",
      }}>{index}</span>
    );
  }
  if (status === "completed") {
    return (
      <span style={{
        width: "24px", height: "24px", flexShrink: 0, borderRadius: "50%",
        backgroundColor: "var(--color-primary)",
        display: "inline-flex", alignItems: "center", justifyContent: "center",
      }}>
        <Icon name="check" size={12} color="#fff" strokeWidth={2.5} />
      </span>
    );
  }
  if (status === "locked") {
    return (
      <span style={{
        width: "24px", height: "24px", flexShrink: 0, borderRadius: "50%",
        backgroundColor: "var(--color-locked-bg)", border: "1.5px solid var(--color-locked)",
        display: "inline-flex", alignItems: "center", justifyContent: "center",
      }}>
        <Icon name="lock" size={10} color="var(--color-locked)" strokeWidth={2} />
      </span>
    );
  }
  return (
    <span style={{
      width: "24px", height: "24px", flexShrink: 0, borderRadius: "50%",
      border: "1.75px solid var(--color-border)", backgroundColor: "var(--color-surface)",
      display: "inline-flex", alignItems: "center", justifyContent: "center",
      fontSize: "11px", fontWeight: 500, color: "var(--color-text-muted)",
    }}>{index}</span>
  );
};

export const Sidebar: React.FC<SidebarProps> = ({
  title = "Your Path",
  subtitle,
  lessons,
  collapsed = false,
  onToggle,
}) => {
  const { slug } = useParams<{ slug?: string }>();

  return (
    <aside style={{
      width: collapsed ? "0px" : "var(--sidebar-width)",
      minWidth: collapsed ? "0px" : "var(--sidebar-width)",
      borderRight: "1px solid var(--color-border-light)",
      backgroundColor: "var(--color-surface)",
      overflowY: "auto", overflowX: "hidden",
      transition: "width var(--duration-slow) var(--ease-out), min-width var(--duration-slow) var(--ease-out)",
      position: "sticky", top: "var(--nav-height)",
      height: "calc(100vh - var(--nav-height))",
      flexShrink: 0,
    }}>
      {!collapsed && (
        <div style={{ padding: "22px 16px 32px" }}>
          {/* Header */}
          <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", marginBottom: "2px" }}>
            <h2 style={{ fontFamily: "var(--font-serif)", fontSize: "var(--text-lg)", fontWeight: 600, color: "var(--color-text)", lineHeight: 1.2 }}>
              {title}
            </h2>
            {onToggle && (
              <button onClick={onToggle} aria-label="Collapse sidebar" style={{ padding: "2px", color: "var(--color-text-muted)", borderRadius: "var(--radius-sm)", lineHeight: 0 }}>
                <Icon name="chevron-left" size={15} />
              </button>
            )}
          </div>
          {subtitle && (
            <p style={{ fontSize: "var(--text-xs)", color: "var(--color-text-muted)", marginBottom: "18px", lineHeight: 1.4 }}>
              {subtitle}
            </p>
          )}

          {/* Lesson list — beige cards per item; selected = dark green pill */}
          <ol style={{ listStyle: "none", padding: 0, margin: 0, display: "flex", flexDirection: "column", gap: "8px" }}>
            {lessons.map((lesson, idx) => {
              const isActive = slug === lesson.slug;
              const isLocked = lesson.status === "locked";
              const rowStyle: React.CSSProperties = {
                display: "flex", alignItems: "center", gap: "10px",
                padding: "10px 12px", borderRadius: "var(--radius-md)",
                textDecoration: "none",
                opacity: isLocked ? 0.48 : 1,
                cursor: isLocked ? "default" : "pointer",
                backgroundColor: isActive ? "var(--color-primary)" : "#F5F0E5",
                transition: "background-color var(--duration-fast)",
              };
              const rowContent = (
                <>
                  <StatusBadge status={lesson.status} index={idx + 1} isActive={isActive} />
                  <div style={{ minWidth: 0, flex: 1 }}>
                    <div style={{ fontSize: "var(--text-sm)", fontWeight: isActive ? 600 : 500, color: isActive ? "#fff" : isLocked ? "var(--color-text-muted)" : "var(--color-text)", lineHeight: 1.35 }}>
                      {lesson.title}
                    </div>
                    <div style={{ fontSize: "11px", marginTop: "2px", color: isActive ? "rgba(255,255,255,0.62)" : "var(--color-text-muted)" }}>
                      {lesson.category}
                    </div>
                  </div>
                </>
              );

              if (isLocked) {
                return <li key={lesson.id}><div style={{ ...rowStyle, cursor: "default" }}>{rowContent}</div></li>;
              }
              return (
                <li key={lesson.id}>
                  <Link
                    to={`/lesson/${lesson.slug}`}
                    style={rowStyle}
                    onMouseEnter={(e) => { if (!isActive) (e.currentTarget as HTMLElement).style.backgroundColor = "#ebe6dc"; }}
                    onMouseLeave={(e)  => { if (!isActive) (e.currentTarget as HTMLElement).style.backgroundColor = "#F5F0E5"; }}
                  >
                    {rowContent}
                  </Link>
                </li>
              );
            })}
          </ol>

          {/* Pro Tip */}
          <div className="pro-tip" style={{ marginTop: "20px" }}>
            <div className="pro-tip__label">Pro Tip</div>
            <p className="pro-tip__text">Highlight any confusing term to get instant AI help from Wilbur!</p>
          </div>
        </div>
      )}

      {collapsed && onToggle && (
        <button
          onClick={onToggle} aria-label="Expand sidebar"
          style={{ position: "absolute", left: "8px", top: "20px", background: "var(--color-surface)", border: "1px solid var(--color-border)", borderRadius: "var(--radius-md)", padding: "6px", color: "var(--color-text-muted)", boxShadow: "var(--shadow-sm)", lineHeight: 0 }}
        >
          <Icon name="chevron-right" size={15} />
        </button>
      )}
    </aside>
  );
};
