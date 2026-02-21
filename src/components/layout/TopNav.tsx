import React, { useState, useRef, useEffect, useCallback } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { Button } from "../ui/Button";
import { AccountPopup } from "../ui/Modal";
import { MascotPink } from "../ui/MascotPink";
import { Icon } from "../ui/Icon";
import { isAuthed } from "@/lib/stubData";
import { Drawer } from "../ui/Drawer";

interface DropdownItem { label: string; description?: string; href: string; }
interface NavItem {
  label: string;
  href: string;
  dropdown?: { header?: string; items: DropdownItem[] };
}

const NAV_ITEMS: NavItem[] = [
  {
    label: "Dashboard", href: "/dashboard",
    dropdown: {
      header: "GET STARTED",
      items: [
        { label: "Progress Tracker",  description: "Track your learning journey",    href: "/dashboard" },
        { label: "My Roadmap",        description: "Personalized lesson sequence",   href: "/dashboard" },
        { label: "Confidence Meter",  description: "See how confident you are",      href: "/dashboard" },
      ],
    },
  },
  {
    label: "Library", href: "/library",
    dropdown: {
      header: "EXPLORE",
      items: [
        { label: "All Topics",    description: "Browse all lessons by category",    href: "/library" },
        { label: "Investing",     description: "Stocks, bonds, real estate & more", href: "/library/investing" },
        { label: "Budgeting",     description: "Managing your money",               href: "/library/budgeting" },
        { label: "Credit & Debt", description: "Credit scores and debt management", href: "/library/credit-debt" },
      ],
    },
  },
  {
    label: "Resources", href: "/resources",
    dropdown: {
      header: "EXPLORE",
      items: [
        { label: "Simulators",        description: "Interactive learning tools",    href: "/resources/simulators" },
        { label: "Templates",         description: "Budget and planning templates", href: "/resources/templates" },
        { label: "Glossary",          description: "Financial terms explained",     href: "/resources/glossary" },
        { label: "Recommended Books", description: "Curated reading list",          href: "/resources/books" },
      ],
    },
  },
  { label: "My Profile", href: "/profile" },
];

/* ── Nav item with click-open dropdown ── */
interface NavDropdownProps {
  item: NavItem;
  isOpen: boolean;
  onOpen: () => void;
  onClose: () => void;
}

const NavDropdown: React.FC<NavDropdownProps> = ({ item, isOpen, onOpen, onClose }) => {
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
            border: "1px solid var(--color-border-light)",
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
              onClick={onClose}
              style={{
                display: "block",
                padding: "9px 10px",
                borderRadius: "var(--radius-md)",
                textDecoration: "none",
                transition: "background-color var(--duration-fast)",
              }}
              onMouseEnter={(e) => { (e.currentTarget as HTMLElement).style.backgroundColor = "var(--color-surface-hover)"; }}
              onMouseLeave={(e) => { (e.currentTarget as HTMLElement).style.backgroundColor = "transparent"; }}
            >
              <div style={{ fontSize: "var(--text-sm)", fontWeight: 600, color: "var(--color-text)", lineHeight: 1.25, marginBottom: "2px" }}>
                {d.label}
              </div>
              {d.description && (
                <div style={{ fontSize: "12px", color: "var(--color-text-muted)", lineHeight: 1.35 }}>
                  {d.description}
                </div>
              )}
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
  const navigate  = useNavigate();
  const location  = useLocation();

  /* Close dropdown on ESC */
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => { if (e.key === "Escape") setOpenDropdown(null); };
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, []);

  useEffect(() => { setOpenDropdown(null); setMobileOpen(false); }, [location.pathname]);

  const handleGetStarted = useCallback(() => {
    if (!isAuthed) setShowPopup(true);
    else navigate("/onboarding");
  }, [navigate]);

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
        {/* Mobile hamburger */}
        <button
          aria-label="Open menu"
          className="nav-hamburger"
          onClick={() => { setMobileOpen(true); onMenuOpen?.(); }}
          style={{ display: "none", padding: "8px", color: "var(--color-text)" }}
        >
          <Icon name="menu" size={20} />
        </button>

        {/* Logo — small pig matches nav in all mocks */}
        <Link to="/" style={{ display: "flex", alignItems: "center", gap: "8px", textDecoration: "none", flexShrink: 0 }}>
          <div style={{ width: "26px", height: "26px", overflow: "hidden", borderRadius: "50%", backgroundColor: "var(--color-pink-bg)", display: "flex", alignItems: "center", justifyContent: "center" }}>
            <MascotPink size={34} style={{ marginTop: "6px" }} />
          </div>
          <span style={{ fontFamily: "var(--font-serif)", fontSize: "var(--text-xl)", fontWeight: 600, color: "var(--color-text)", letterSpacing: "-0.01em" }}>
            Wilbur
          </span>
        </Link>

        {/* Spacer — pushes nav + CTA to the right */}
        <div style={{ flex: 1, minWidth: 0 }} />

        {/* Desktop nav + CTA aligned right, grouped together */}
        <div className="nav-links" style={{ display: "flex", alignItems: "center", gap: "var(--space-6)", flexShrink: 0 }}>
          {NAV_ITEMS.map((item) => (
            <NavDropdown
              key={item.label}
              item={item}
              isOpen={openDropdown === item.label}
              onOpen={() => setOpenDropdown(item.label)}
              onClose={() => setOpenDropdown(null)}
            />
          ))}
          <Button
            variant="primary" size="sm"
            onClick={handleGetStarted}
            style={{ flexShrink: 0, fontSize: "var(--text-sm)", padding: "8px 18px" }}
          >
            Get Started
          </Button>
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
          {NAV_ITEMS.map((item) => (
            <Link key={item.label} to={item.href} onClick={() => setMobileOpen(false)} style={{ display: "block", padding: "13px 0", borderBottom: "1px solid var(--color-border-light)", fontSize: "var(--text-md)", fontWeight: 500, color: "var(--color-text)" }}>
              {item.label}
            </Link>
          ))}
          <div style={{ marginTop: "24px" }}>
            <Button variant="primary" size="md" onClick={handleGetStarted} style={{ width: "100%" }}>Get Started</Button>
          </div>
        </div>
      </Drawer>

      <AccountPopup open={showPopup} onClose={() => setShowPopup(false)} onSignUp={() => { setShowPopup(false); navigate("/"); }} onLogin={() => { setShowPopup(false); navigate("/"); }} />
    </>
  );
};
