import React from "react";

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "primary" | "secondary" | "ghost" | "outline" | "outlineBlack" | "pink";
  size?: "sm" | "md" | "lg";
  children: React.ReactNode;
}

const variantBase: Record<string, React.CSSProperties> = {
  primary: {
    backgroundColor: "var(--color-primary)",
    color: "var(--color-primary-text)",
    border: "none",
    boxShadow: "none",
  },
  secondary: {
    backgroundColor: "var(--color-surface)",
    color: "var(--color-text)",
    border: "1px solid var(--color-border)",
    boxShadow: "none",
  },
  ghost: {
    backgroundColor: "transparent",
    color: "var(--color-text-secondary)",
    border: "none",
    boxShadow: "none",
  },
  outline: {
    backgroundColor: "transparent",
    color: "var(--color-primary)",
    border: "1.5px solid var(--color-primary)",
    boxShadow: "none",
  },
  outlineBlack: {
    backgroundColor: "transparent",
    color: "var(--color-black)",
    border: "2px solid var(--color-black)",
    boxShadow: "none",
  },
  pink: {
    backgroundColor: "var(--color-pink)",
    color: "var(--color-black)",
    border: "none",
    boxShadow: "none",
  },
};

const sizeBase: Record<string, React.CSSProperties> = {
  sm:  { fontSize: "var(--text-sm)",  padding: "7px 16px",  minHeight: "34px" },
  md:  { fontSize: "var(--text-base)", padding: "10px 22px", minHeight: "40px" },
  lg:  { fontSize: "var(--text-md)",  padding: "12px 26px", minHeight: "46px" },
};

export const Button: React.FC<ButtonProps> = ({
  variant = "primary",
  size = "md",
  children,
  style,
  onMouseEnter,
  onMouseLeave,
  disabled,
  ...props
}) => {
  const [hovered, setHovered] = React.useState(false);

  const hoverOverride: React.CSSProperties = hovered && !disabled
    ? variant === "primary"
      ? { backgroundColor: "var(--color-primary-hover)", transform: "translateY(-1px)" }
      : variant === "pink"
        ? { filter: "brightness(0.97)", transform: "translateY(-1px)" }
        : variant === "outlineBlack"
          ? { backgroundColor: "rgba(26, 26, 26, 0.06)", transform: "translateY(-1px)" }
          : { opacity: 0.82, transform: "translateY(-1px)" }
    : {};

  return (
    <button
      disabled={disabled}
      style={{
        display: "inline-flex",
        alignItems: "center",
        justifyContent: "center",
        gap: "7px",
        fontFamily: "var(--font-sans)",
        fontWeight: 600,
        borderRadius: "var(--radius-lg)",
        cursor: disabled ? "not-allowed" : "pointer",
        transition: "background-color var(--duration-fast) var(--ease-out), transform var(--duration-fast) var(--ease-out), opacity var(--duration-fast)",
        whiteSpace: "nowrap",
        opacity: disabled ? 0.55 : 1,
        ...variantBase[variant],
        ...sizeBase[size],
        ...hoverOverride,
        ...style,
      }}
      onMouseEnter={(e) => { setHovered(true); onMouseEnter?.(e); }}
      onMouseLeave={(e) => { setHovered(false); onMouseLeave?.(e); }}
      {...props}
    >
      {children}
    </button>
  );
};
