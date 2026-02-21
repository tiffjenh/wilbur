import React from "react";

interface WilburLogoProps {
  size?: number;
  className?: string;
  style?: React.CSSProperties;
}

/** Simplified pink pig face — matches the Figma mascot illustration */
export const WilburLogo: React.FC<WilburLogoProps> = ({ size = 32, className, style }) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 40 40"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    className={className}
    style={style}
    aria-label="Wilbur mascot"
  >
    {/* Left ear */}
    <ellipse cx="8" cy="10" rx="5.5" ry="6.5" fill="#f0a8bc" />
    <ellipse cx="8" cy="10" rx="3.5" ry="4.5" fill="#e07898" />
    {/* Right ear */}
    <ellipse cx="32" cy="10" rx="5.5" ry="6.5" fill="#f0a8bc" />
    <ellipse cx="32" cy="10" rx="3.5" ry="4.5" fill="#e07898" />
    {/* Head */}
    <ellipse cx="20" cy="21" rx="17" ry="16" fill="#f5bfcc" />
    {/* Eyes */}
    <circle cx="14" cy="18" r="2" fill="#3a2020" />
    <circle cx="26" cy="18" r="2" fill="#3a2020" />
    {/* Eye shine */}
    <circle cx="14.8" cy="17.2" r="0.7" fill="white" />
    <circle cx="26.8" cy="17.2" r="0.7" fill="white" />
    {/* Snout */}
    <ellipse cx="20" cy="25" rx="6.5" ry="4.5" fill="#e07898" />
    {/* Nostrils */}
    <circle cx="17.5" cy="25.5" r="1.3" fill="#c05070" />
    <circle cx="22.5" cy="25.5" r="1.3" fill="#c05070" />
  </svg>
);

/** Smaller variant for nav bar */
export const WilburNavLogo: React.FC<{ size?: number }> = ({ size = 28 }) => (
  <WilburLogo size={size} />
);
