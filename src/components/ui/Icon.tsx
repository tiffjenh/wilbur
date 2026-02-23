import React from "react";

export type IconName =
  | "trend-up"
  | "wallet"
  | "credit-card"
  | "home"
  | "graduation-cap"
  | "heart"
  | "sunset"
  | "book-open"
  | "clipboard"
  | "piggy-bank"
  | "bar-chart"
  | "user"
  | "target"
  | "settings"
  | "shield"
  | "lock"
  | "check"
  | "star"
  | "sparkle"
  | "chevron-down"
  | "chevron-right"
  | "chevron-left"
  | "arrow-right"
  | "x"
  | "menu"
  | "clock"
  | "thumbs-up"
  | "thumbs-down"
  | "brain"
  | "money-bag"
  | "plus"
  | "eye"
  | "eye-off"
  | "log-out";

interface IconProps {
  name: IconName;
  size?: number;
  color?: string;
  strokeWidth?: number;
  style?: React.CSSProperties;
  className?: string;
}

const PATHS: Record<IconName, React.ReactNode> = {
  "trend-up": (
    <path d="M3 17L9 11L13 15L21 7M21 7H15M21 7V13" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" />
  ),
  "wallet": (
    <>
      <rect x="2" y="7" width="20" height="13" rx="2" stroke="currentColor" />
      <path d="M16 13.5a.5.5 0 1 1-1 0 .5.5 0 0 1 1 0z" fill="currentColor" />
      <path d="M2 11h20" stroke="currentColor" strokeLinecap="round" />
    </>
  ),
  "credit-card": (
    <>
      <rect x="2" y="5" width="20" height="14" rx="2" stroke="currentColor" />
      <path d="M2 10h20" stroke="currentColor" strokeLinecap="round" />
      <rect x="5" y="14" width="4" height="2" rx="0.5" fill="currentColor" />
    </>
  ),
  "home": (
    <>
      <path d="M3 12L12 4L21 12V20H15V15H9V20H3V12Z" stroke="currentColor" strokeLinejoin="round" />
    </>
  ),
  "graduation-cap": (
    <>
      <path d="M12 3L22 8L12 13L2 8L12 3Z" stroke="currentColor" strokeLinejoin="round" />
      <path d="M6 10.5V16C6 16 8.5 19 12 19C15.5 19 18 16 18 16V10.5" stroke="currentColor" strokeLinecap="round" />
      <path d="M22 8V13" stroke="currentColor" strokeLinecap="round" />
    </>
  ),
  "heart": (
    <path d="M12 21C12 21 3 15 3 8.5A4.5 4.5 0 0 1 12 7.5a4.5 4.5 0 0 1 9 1C21 15 12 21 12 21Z" stroke="currentColor" strokeLinejoin="round" />
  ),
  "sunset": (
    <>
      <path d="M12 7V3M4.22 10.22L2 8M21.78 10.22L20 8M12 16a4 4 0 0 1-4-4h8a4 4 0 0 1-4 4Z" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M2 16h20" stroke="currentColor" strokeLinecap="round" />
      <path d="M4 20h16" stroke="currentColor" strokeLinecap="round" />
    </>
  ),
  "book-open": (
    <>
      <path d="M2 4h8a2 2 0 0 1 2 2v14a1.5 1.5 0 0 0-1.5-1.5H2V4Z" stroke="currentColor" strokeLinejoin="round" />
      <path d="M22 4h-8a2 2 0 0 0-2 2v14a1.5 1.5 0 0 1 1.5-1.5H22V4Z" stroke="currentColor" strokeLinejoin="round" />
    </>
  ),
  "clipboard": (
    <>
      <rect x="5" y="3" width="14" height="18" rx="2" stroke="currentColor" />
      <path d="M9 3v2h6V3" stroke="currentColor" strokeLinejoin="round" />
      <path d="M8 10h8M8 14h5" stroke="currentColor" strokeLinecap="round" />
    </>
  ),
  "piggy-bank": (
    <>
      <path d="M19 9.5C19 9.5 20 10 20 12C20 15.5 16.5 18 12 18C7.5 18 4 15.5 4 12C4 8.5 7.5 6 12 6H14" stroke="currentColor" strokeLinecap="round" />
      <circle cx="16" cy="6" r="2.5" stroke="currentColor" />
      <circle cx="9.5" cy="11.5" r="0.75" fill="currentColor" />
      <path d="M20 12h2M20 14l1.5 2" stroke="currentColor" strokeLinecap="round" />
      <path d="M9 18v2M15 18v2" stroke="currentColor" strokeLinecap="round" />
    </>
  ),
  "bar-chart": (
    <>
      <rect x="3" y="14" width="4" height="7" rx="1" stroke="currentColor" />
      <rect x="10" y="9" width="4" height="12" rx="1" stroke="currentColor" />
      <rect x="17" y="4" width="4" height="17" rx="1" stroke="currentColor" />
    </>
  ),
  "user": (
    <>
      <circle cx="12" cy="7" r="4" stroke="currentColor" />
      <path d="M3 21c0-4 4-7 9-7s9 3 9 7" stroke="currentColor" strokeLinecap="round" />
    </>
  ),
  "target": (
    <>
      <circle cx="12" cy="12" r="9" stroke="currentColor" />
      <circle cx="12" cy="12" r="5" stroke="currentColor" />
      <circle cx="12" cy="12" r="1" fill="currentColor" />
    </>
  ),
  "settings": (
    <>
      <circle cx="12" cy="12" r="3" stroke="currentColor" />
      <path d="M12 2v3M12 19v3M4.22 4.22l2.12 2.12M17.66 17.66l2.12 2.12M2 12h3M19 12h3M4.22 19.78l2.12-2.12M17.66 6.34l2.12-2.12" stroke="currentColor" strokeLinecap="round" />
    </>
  ),
  "shield": (
    <path d="M12 3L4 7v5c0 4.5 3.5 8.5 8 10 4.5-1.5 8-5.5 8-10V7L12 3Z" stroke="currentColor" strokeLinejoin="round" />
  ),
  "lock": (
    <>
      <rect x="5" y="11" width="14" height="10" rx="2" stroke="currentColor" />
      <path d="M8 11V7a4 4 0 0 1 8 0v4" stroke="currentColor" strokeLinecap="round" />
    </>
  ),
  "check": (
    <path d="M4 12L9 17L20 6" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
  ),
  "star": (
    <path d="M12 2l2.9 6.3L22 9.3l-5 4.9 1.2 7L12 18l-6.2 3.2 1.2-7-5-4.9 7.1-1L12 2Z" stroke="currentColor" strokeLinejoin="round" />
  ),
  "sparkle": (
    <>
      <path d="M12 3v3M12 18v3M3 12h3M18 12h3M5.6 5.6l2.1 2.1M16.3 16.3l2.1 2.1M5.6 18.4l2.1-2.1M16.3 7.7l2.1-2.1" stroke="currentColor" strokeLinecap="round" />
      <circle cx="12" cy="12" r="3" stroke="currentColor" />
    </>
  ),
  "chevron-down": (
    <path d="M5 9L12 16L19 9" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" />
  ),
  "chevron-right": (
    <path d="M9 5L16 12L9 19" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" />
  ),
  "chevron-left": (
    <path d="M15 5L8 12L15 19" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" />
  ),
  "arrow-right": (
    <path d="M5 12H19M13 6L19 12L13 18" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" />
  ),
  "x": (
    <path d="M6 6L18 18M18 6L6 18" stroke="currentColor" strokeLinecap="round" />
  ),
  "menu": (
    <path d="M3 6h18M3 12h18M3 18h18" stroke="currentColor" strokeLinecap="round" />
  ),
  "clock": (
    <>
      <circle cx="12" cy="12" r="9" stroke="currentColor" />
      <path d="M12 7v5l3 3" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" />
    </>
  ),
  "thumbs-up": (
    <path d="M7 11v8a1 1 0 0 1-1 1H4a1 1 0 0 1-1-1v-8a1 1 0 0 1 1-1h2a1 1 0 0 1 1 1zM14 10V8a2 2 0 0 0-2-2h-2v10h4a2 2 0 0 0 2-2v-4h2a1 1 0 0 0 1-1v-2a1 1 0 0 0-1-1h-4z" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" />
  ),
  "thumbs-down": (
    <path d="M17 13V5a1 1 0 0 0-1-1h-2v10h4a2 2 0 0 1 2 2v2a1 1 0 0 1-1 1h-4v2a2 2 0 0 0 2-2zM7 11V3a1 1 0 0 0-1-1H4a1 1 0 0 0-1 1v8a1 1 0 0 0 1 1h2a1 1 0 0 0 1-1z" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" />
  ),
  "brain": (
    <>
      <path d="M9.5 6.5a2.5 2.5 0 0 1 2 2.5v1a1 1 0 0 1-1 1 1 1 0 0 0-1 1v3a1 1 0 0 0 1 1h4a1 1 0 0 0 1-1v-3a1 1 0 0 0-1-1 1 1 0 0 1-1-1V9a2.5 2.5 0 0 1 2-2.5" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M14.5 6.5a2.5 2.5 0 0 0-2 2.5v1a1 1 0 0 0 1 1 1 1 0 0 1 1 1v3a1 1 0 0 1-1 1h-4a1 1 0 0 1-1-1v-3a1 1 0 0 1 1-1 1 1 0 0 0 1-1V9a2.5 2.5 0 0 0-2-2.5" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" />
    </>
  ),
  "money-bag": (
    <>
      <path d="M12 4c-2 0-3.5 1.5-4 3H5a1 1 0 0 0-1 1v11a1 1 0 0 0 1 1h14a1 1 0 0 0 1-1V8a1 1 0 0 0-1-1h-3c-.5-1.5-2-3-4-3z" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M10 5h4" stroke="currentColor" strokeLinecap="round" />
    </>
  ),
  "plus": (
    <path d="M12 5v14M5 12h14" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" />
  ),
  "eye": (
    <>
      <path d="M2 12s3-7 10-7 10 7 10 7-3 7-10 7-10-7-10-7z" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" />
      <circle cx="12" cy="12" r="3" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" />
    </>
  ),
  "eye-off": (
    <>
      <path d="M17.94 17.94A10.94 10.94 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M1 1l22 22" stroke="currentColor" strokeLinecap="round" />
    </>
  ),
  "log-out": (
    <>
      <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M16 17l5-5-5-5M21 12H9" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" />
    </>
  ),
};

export const Icon: React.FC<IconProps> = ({
  name,
  size = 20,
  color = "currentColor",
  strokeWidth = 1.75,
  style,
  className,
}) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="none"
    strokeWidth={strokeWidth}
    color={color}
    xmlns="http://www.w3.org/2000/svg"
    style={{ display: "inline-block", flexShrink: 0, ...style }}
    className={className}
    aria-hidden="true"
  >
    {PATHS[name]}
  </svg>
);

/** Icon in a soft square container (used in Library / Resource cards) */
export const IconBox: React.FC<{ name: IconName; size?: number; boxSize?: number }> = ({
  name,
  size = 20,
  boxSize = 44,
}) => (
  <div style={{
    width: boxSize,
    height: boxSize,
    borderRadius: "var(--radius-md)",
    backgroundColor: "var(--color-surface-hover)",
    border: "1px solid var(--color-border-light)",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    flexShrink: 0,
  }}>
    <Icon name={name} size={size} color="var(--color-text-secondary)" strokeWidth={1.6} />
  </div>
);
