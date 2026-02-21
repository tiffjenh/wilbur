import React from "react";

interface MascotGreenProps {
  size?: number;
  style?: React.CSSProperties;
  className?: string;
  animate?: boolean;
}

/**
 * Full-body dark green pig illustration — second mascot on the landing page.
 * Positioned slightly behind the pink pig in the hero layout.
 */
export const MascotGreen: React.FC<MascotGreenProps> = ({ size = 170, style, className, animate = false }) => (
  <svg
    width={size}
    height={size * (200 / 170)}
    viewBox="0 0 170 200"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    className={className}
    style={{ display: "block", animation: animate ? "floatY 3.8s ease-in-out infinite 0.6s" : "none", ...style }}
    aria-hidden="true"
  >
    {/* Left ear */}
    <ellipse cx="42" cy="52" rx="20" ry="26" fill="#163220" transform="rotate(-16 42 52)" />
    <ellipse cx="42" cy="52" rx="12" ry="17" fill="#0d2418" transform="rotate(-16 42 52)" />

    {/* Right ear */}
    <ellipse cx="128" cy="52" rx="20" ry="26" fill="#163220" transform="rotate(16 128 52)" />
    <ellipse cx="128" cy="52" rx="12" ry="17" fill="#0d2418" transform="rotate(16 128 52)" />

    {/* Body */}
    <ellipse cx="85" cy="128" rx="72" ry="60" fill="#1c3f2a" />

    {/* Subtle body highlight */}
    <ellipse cx="85" cy="136" rx="46" ry="38" fill="#2a5c3e" opacity="0.45" />

    {/* Front legs */}
    <ellipse cx="50" cy="182" rx="19" ry="15" fill="#163220" />
    <ellipse cx="120" cy="182" rx="19" ry="15" fill="#163220" />

    {/* Left eye (white with dark pupil) */}
    <circle cx="65" cy="108" r="10" fill="white" />
    <circle cx="65" cy="108" r="5" fill="#1a1010" />
    <circle cx="63" cy="106" r="1.8" fill="white" />

    {/* Right eye */}
    <circle cx="105" cy="108" r="10" fill="white" />
    <circle cx="105" cy="108" r="5" fill="#1a1010" />
    <circle cx="103" cy="106" r="1.8" fill="white" />

    {/* Snout (cream/white on dark green) */}
    <ellipse cx="85" cy="133" rx="26" ry="19" fill="#f5f0e8" />
    {/* Nostrils */}
    <circle cx="76" cy="132" r="4.5" fill="#0d2418" />
    <circle cx="94" cy="132" r="4.5" fill="#0d2418" />

    {/* Smile */}
    <path d="M72 147 Q85 157 98 147" stroke="#0d2418" strokeWidth="2.2" fill="none" strokeLinecap="round" />

    {/* Tail */}
    <path d="M154 82 Q166 70 162 58 Q156 48 148 54 Q140 60 142 70" stroke="#163220" strokeWidth="4.5" fill="none" strokeLinecap="round" />
  </svg>
);
