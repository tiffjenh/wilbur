import React from "react";

interface MascotPinkProps {
  size?: number;
  style?: React.CSSProperties;
  className?: string;
  animate?: boolean;
}

/**
 * Full-body pink pig illustration — matches the landing page mock exactly.
 * viewBox 0 0 200 220, designed at ~200px width.
 */
export const MascotPink: React.FC<MascotPinkProps> = ({ size = 200, style, className, animate = false }) => (
  <svg
    width={size}
    height={size * (220 / 200)}
    viewBox="0 0 200 220"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    className={className}
    style={{ display: "block", animation: animate ? "floatY 3.2s ease-in-out infinite" : "none", ...style }}
    aria-hidden="true"
  >
    {/* Tail */}
    <path d="M180 95 Q196 80 192 64 Q185 50 172 56 Q162 62 165 74" stroke="#e898b0" strokeWidth="5" fill="none" strokeLinecap="round" />

    {/* Left back ear */}
    <ellipse cx="50" cy="60" rx="24" ry="30" fill="#f8cad6" transform="rotate(-18 50 60)" />
    <ellipse cx="50" cy="60" rx="14" ry="20" fill="#e898b0" transform="rotate(-18 50 60)" />

    {/* Right back ear */}
    <ellipse cx="150" cy="60" rx="24" ry="30" fill="#f8cad6" transform="rotate(18 150 60)" />
    <ellipse cx="150" cy="60" rx="14" ry="20" fill="#e898b0" transform="rotate(18 150 60)" />

    {/* Main body */}
    <ellipse cx="100" cy="140" rx="82" ry="68" fill="#f8cad6" />

    {/* Belly highlight (subtle inner circle) */}
    <ellipse cx="100" cy="150" rx="52" ry="42" fill="#fcd8e4" opacity="0.55" />

    {/* Left front leg */}
    <ellipse cx="60" cy="200" rx="22" ry="17" fill="#f5bfcc" />
    {/* Right front leg */}
    <ellipse cx="140" cy="200" rx="22" ry="17" fill="#f5bfcc" />

    {/* Face */}
    {/* Left eye */}
    <circle cx="76" cy="120" r="11" fill="#1a1010" />
    <circle cx="76" cy="120" r="4.5" fill="white" opacity="0.9" />
    <circle cx="78.5" cy="117.5" r="2" fill="white" />

    {/* Right eye */}
    <circle cx="124" cy="120" r="11" fill="#1a1010" />
    <circle cx="124" cy="120" r="4.5" fill="white" opacity="0.9" />
    <circle cx="126.5" cy="117.5" r="2" fill="white" />

    {/* Snout */}
    <ellipse cx="100" cy="147" rx="30" ry="22" fill="#f0a8bc" />
    {/* Nostrils */}
    <circle cx="89" cy="146" r="5.5" fill="#c0507a" />
    <circle cx="111" cy="146" r="5.5" fill="#c0507a" />

    {/* Smile */}
    <path d="M83 162 Q100 174 117 162" stroke="#c0607a" strokeWidth="2.5" fill="none" strokeLinecap="round" />

    {/* Rosy cheeks */}
    <circle cx="62" cy="138" r="12" fill="#f0a8bc" opacity="0.35" />
    <circle cx="138" cy="138" r="12" fill="#f0a8bc" opacity="0.35" />
  </svg>
);
