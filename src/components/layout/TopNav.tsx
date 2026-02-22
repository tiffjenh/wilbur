import React, { useState, useRef, useEffect, useCallback } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { Button } from "../ui/Button";
import { AccountPopup } from "../ui/Modal";
import { MascotPink } from "../ui/MascotPink";
import { Icon, type IconName } from "../ui/Icon";
import { isAuthed } from "@/lib/stubData";
import { Drawer } from "../ui/Drawer";

interface DropdownItem { label: string; description?: string; href: string; icon?: IconName; }
interface NavItem {
  label: string;
  href: string;
  dropdown?: { header?: string; items: DropdownItem[] };
}

/** Show full nav (Dashboard, Learning, Library, Resources) when user has completed onboarding or has a session */
const LS_ONBOARDING = "wilbur_onboarding_profile";
const LS_SESSION = "wilbur_user_session";

function hasFullNavAccess(): boolean {
  if (typeof window === "undefined") return false;
  try {
    return !!(localStorage.getItem(LS_ONBOARDING) || localStorage.getItem(LS_SESSION));
  } catch {
    return false;
  }
}

const NAV_ITEMS: NavItem[] = [
  {
    label: "Dashboard", href: "/dashboard/progress",
    dropdown: {
      header: "GET STARTED",
      items: [
        { label: "Progress Tracker",  description: "Track your learning journey",    href: "/dashboard/progress", icon: "target" },
        { label: "Confidence Meter",  description: "See how confident you are",      href: "/dashboard/progress", icon: "bar-chart" },
      ],
    },
  },
  { label: "Learning", href: "/learning" },
  {
    label: "Library", href: "/library",
    dropdown: {
      header: "EXPLORE",
      items: [
        { label: "All Topics",    description: "Browse all lessons by category",    href: "/library", icon: "book-open" },
        { label: "Investing",     description: "Stocks, bonds, real estate & more", href: "/library/investing", icon: "trend-up" },
        { label: "Budgeting",     description: "Managing your money",               href: "/library/budgeting", icon: "wallet" },
        { label: "Credit & Debt", description: "Credit scores and debt management", href: "/library/credit-debt", icon: "credit-card" },
      ],
    },
  },
  {
    label: "Resources", href: "/resources",
    dropdown: {
      header: "EXPLORE",
      items: [
        { label: "Simulators",        description: "Interactive learning tools",    href: "/resources/simulators", icon: "sparkle" },
        { label: "Templates",         description: "Budget and planning templates", href: "/resources/templates", icon: "clipboard" },
        { label: "Glossary",          description: "Financial terms explained",     href: "/resources/glossary", icon: "book-open" },
        { label: "Recommended Books", description: "Curated reading list",          href: "/resources/books", icon: "star" },
      ],
    },
  },
];

/* ── Nav item with click-open dropdown ── */
interface NavDropdownProps {
  item: NavItem;
  isOpen: boolean;
  onOpen: () => void;
  onClose: () => void;
  /** When set, dropdown link clicks call this instead of navigating (e.g. account gate). */
  gateLinkClick?: (e: React.MouseEvent, href: string) => void;
}

const NavDropdown: React.FC<NavDropdownProps> = ({ item, isOpen, onOpen, onClose, gateLinkClick }) => {
  const location = useLocation();
  const isActive = location.pathname === item.href || location.pathname.startsWith(item.href + "/");
  const wrapRef  = useRef<HTMLDivElement>(null);

  /* Close on outside click */
  useEffect(() => {
    if (!isOpen) return;
    const handler = (e: MouseEvent) => {
      if (wrapRef.current && !wrapRef.current.contains(e.target as Node)) onClose();
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, [isOpen, onClose]);

  /* Close on route change */
  useEffect(() => { onClose(); }, [location.pathname]); // eslint-disable-line react-hooks/exhaustive-deps

  const linkStyle: React.CSSProperties = {
    display: "inline-flex", alignItems: "center", gap: "3px",
    fontSize: "var(--text-base)", fontWeight: isActive ? 600 : 500,
    color: isActive ? "var(--color-text)" : "var(--color-text-secondary)",
    padding: "6px 2px", whiteSpace: "nowrap",
    background: "none", border: "none", cursor: "pointer",
    fontFamily: "var(--font-sans)", lineHeight: 1, textDecoration: "none",
    transition: "color var(--duration-fast)",
  };

  if (!item.dropdown) {
    return <Link to={item.href} style={linkStyle}>{item.label}</Link>;
  }

  return (
    <div ref={wrapRef} style={{ position: "relative" }}>
      <button
        style={linkStyle}
        onClick={() => isOpen ? onClose() : onOpen()}
        aria-expanded={isOpen}
        aria-haspopup="true"
      >
        {item.label}
        <Icon
          name="chevron-down"
          size={13}
          strokeWidth={2}
          style={{
            transition: "transform var(--duration-fast) var(--ease-out)",
            transform: isOpen ? "rotate(180deg)" : "rotate(0deg)",
            marginTop: "1px",
            color: "var(--color-text-muted)",
          }}
        />
      </button>

      {/* Dropdown panel */}
      {isOpen && (
        <div
          style={{
            position: "absolute",
            top: "calc(100% + 10px)",
            left: "50%",
            transform: "translateX(-50%)",
            backgroundColor: "var(--color-surface)",
            border: "2px solid var(--color-black)",
            borderRadius: "var(--radius-lg)",
            boxShadow: "var(--shadow-dropdown)",
            minWidth: "228px",
            padding: "6px 6px 8px",
            zIndex: 500,
            animation: "dropdownIn 180ms var(--ease-out)",
          }}
        >
          {item.dropdown.header && (
            <div className="section-label" style={{ padding: "8px 10px 5px" }}>
              {item.dropdown.header}
            </div>
          )}
          {item.dropdown.items.map((d) => (
            <Link
              key={d.href + d.label}
              to={d.href}
              onClick={(e) => {
                if (gateLinkClick) {
                  e.preventDefault();
                  gateLinkClick(e, d.href);
                  onClose();
                } else {
                  onClose();
                }
              }}
              style={{
                display: "flex",
                alignItems: "center",
                gap: "10px",
                minHeight: "44px",
                padding: "9px 10px",
                borderRadius: "var(--radius-md)",
                textDecoration: "none",
                transition: "background-color var(--duration-fast)",
              }}
              onMouseEnter={(e) => { (e.currentTarget as HTMLElement).style.backgroundColor = "var(--color-surface-hover)"; }}
              onMouseLeave={(e) => { (e.currentTarget as HTMLElement).style.backgroundColor = "transparent"; }}
            >
              {d.icon != null && (
                <span style={{ flexShrink: 0, color: "var(--color-text-secondary)" }}>
                  <Icon name={d.icon} size={18} strokeWidth={1.8} />
                </span>
              )}
              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ fontSize: "var(--text-sm)", fontWeight: 600, color: "var(--color-text)", lineHeight: 1.25, marginBottom: "2px" }}>
                  {d.label}
                </div>
                {d.description && (
                  <div style={{ fontSize: "12px", color: "var(--color-text-muted)", lineHeight: 1.35 }}>
                    {d.description}
                </div>
                )}
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
};

/* ── TopNav ── */
export const TopNav: React.FC<{ onMenuOpen?: () => void }> = ({ onMenuOpen }) => {
  const [openDropdown, setOpenDropdown] = useState<string | null>(null);
  const [showPopup, setShowPopup]       = useState(false);
  const [mobileOpen, setMobileOpen]     = useState(false);
  const [hasAccess, setHasAccess]       = useState(() => hasFullNavAccess());
  const navigate  = useNavigate();
  const location  = useLocation();
  const pathname  = location.pathname;

  /* Re-check onboarding/session when route changes (e.g. after completing onboarding) */
  useEffect(() => {
    setHasAccess(hasFullNavAccess());
  }, [pathname]);

  /* Close dropdown on ESC */
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => { if (e.key === "Escape") setOpenDropdown(null); };
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, []);

  useEffect(() => { setOpenDropdown(null); setMobileOpen(false); }, [location.pathname]);

  const handleLogin = useCallback(() => {
    if (!isAuthed) setShowPopup(true);
    else navigate("/dashboard/progress");
  }, [navigate]);
  const handleSignUp = useCallback(() => {
    setShowPopup(true);
  }, []);

  /* Dashboard click: if not authed, show account modal; then modal actions go to /dashboard/progress */
  const handleDashboardClick = useCallback((e: React.MouseEvent, href: string) => {
    if (!isAuthed) {
      e.preventDefault();
      setShowPopup(true);
    } else {
      navigate(href);
    }
  }, [navigate]);

  /* Full nav only when not on homepage, not on onboarding, AND (onboarding complete OR session exists) */
  const showFullNav = pathname !== "/" && pathname !== "/onboarding" && hasAccess;

  return (
    <>
      <nav style={{
        position: "sticky", top: 0, zIndex: 100,
        height: "var(--nav-height)",
        backgroundColor: "var(--color-bg)",
        borderBottom: "1px solid var(--color-border-light)",
        display: "flex", alignItems: "center",
        padding: "0 var(--page-px)", gap: "var(--space-5)",
      }}>
        {/* Mobile hamburger — only show when full nav is available */}
        <button
          aria-label="Open menu"
          className="nav-hamburger"
          onClick={() => { setMobileOpen(true); onMenuOpen?.(); }}
          style={{ display: "none", padding: "8px", color: "var(--color-text)" }}
        >
          <Icon name="menu" size={20} />
        </button>

        {/* Logo — always visible */}
        <Link to="/" style={{ display: "flex", alignItems: "center", gap: "8px", textDecoration: "none", flexShrink: 0 }}>
          <div style={{ width: "26px", height: "26px", overflow: "hidden", borderRadius: "50%", backgroundColor: "var(--color-pink-bg)", display: "flex", alignItems: "center", justifyContent: "center" }}>
            <MascotPink size={34} style={{ marginTop: "6px" }} />
          </div>
          <span style={{ fontFamily: "var(--font-serif)", fontSize: "var(--text-xl)", fontWeight: 600, color: "var(--color-text)", letterSpacing: "-0.01em" }}>
            Wilbur
          </span>
        </Link>

        {/* Spacer */}
        <div style={{ flex: 1, minWidth: 0 }} />

        {/* Desktop: nav tabs (only when showFullNav) + Login + Sign up flush right */}
        <div className="nav-links" style={{ display: "flex", alignItems: "center", gap: "var(--space-6)", flexShrink: 0 }}>
          {showFullNav && NAV_ITEMS.map((item) => (
            <NavDropdown
              key={item.label}
              item={item}
              isOpen={openDropdown === item.label}
              onOpen={() => setOpenDropdown(item.label)}
              onClose={() => setOpenDropdown(null)}
              gateLinkClick={item.label === "Dashboard" ? handleDashboardClick : undefined}
            />
          ))}
          <div style={{ display: "flex", alignItems: "center", gap: "8px", marginLeft: showFullNav ? 0 : "auto" }}>
            <Button variant="primary" size="sm" onClick={handleLogin} style={{ flexShrink: 0, fontSize: "var(--text-sm)", padding: "8px 16px" }}>
              Login
            </Button>
            <Button variant="outlineBlack" size="sm" onClick={handleSignUp} style={{ flexShrink: 0, fontSize: "var(--text-sm)", padding: "8px 16px", borderWidth: "2px" }}>
              Sign up
            </Button>
          </div>
        </div>
      </nav>

      {/* Mobile drawer */}
      <Drawer open={mobileOpen} onClose={() => setMobileOpen(false)}>
        <div style={{ padding: "24px 20px" }}>
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "28px" }}>
            <div style={{ display: "flex", alignItems: "center", gap: "9px" }}>
              <div style={{ width: "24px", height: "24px", overflow: "hidden", borderRadius: "50%", backgroundColor: "var(--color-pink-bg)", display: "flex", alignItems: "center", justifyContent: "center" }}>
                <MascotPink size={30} style={{ marginTop: "5px" }} />
              </div>
              <span style={{ fontFamily: "var(--font-serif)", fontSize: "var(--text-lg)", fontWeight: 600 }}>Wilbur</span>
            </div>
            <button onClick={() => setMobileOpen(false)} style={{ padding: "4px", color: "var(--color-text-muted)" }}>
              <Icon name="x" size={18} />
            </button>
          </div>
          {showFullNav && NAV_ITEMS.map((item) => (
            <Link key={item.label} to={item.href} onClick={() => setMobileOpen(false)} style={{ display: "block", padding: "13px 0", borderBottom: "1px solid var(--color-border-light)", fontSize: "var(--text-md)", fontWeight: 500, color: "var(--color-text)" }}>
              {item.label}
            </Link>
          ))}
          <div style={{ marginTop: "24px", display: "flex", flexDirection: "column", gap: "10px" }}>
            <Button variant="outlineBlack" size="md" onClick={handleSignUp} style={{ width: "100%" }}>Sign up</Button>
            <Button variant="primary" size="md" onClick={handleLogin} style={{ width: "100%" }}>Login</Button>
          </div>
        </div>
      </Drawer>

      <AccountPopup open={showPopup} onClose={() => setShowPopup(false)} onSignUp={() => { setShowPopup(false); navigate("/dashboard/progress"); }} onLogin={() => { setShowPopup(false); navigate("/dashboard/progress"); }} />
    </>
  );
};
