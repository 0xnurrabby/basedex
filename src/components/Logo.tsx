import React from "react";

export interface LogoProps {
  size?: number | string;
  width?: number | string;
  height?: number | string;
  className?: string;
  withBackground?: boolean;
  topColor?: string;
  bottomColor?: string;
}

export function Logo({
  size = 28,
  width,
  height,
  className = "",
  withBackground = false,
  topColor,
  bottomColor = "#0052FF",
}: LogoProps) {
  const finalWidth = width ?? size;
  const finalHeight = height ?? size;
  const resolvedTopColor = topColor ?? "currentColor";

  return (
    <svg
      width={finalWidth}
      height={finalHeight}
      viewBox="0 0 40 40"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={`shrink-0 select-none ${className}`.trim()}
      aria-label="Base Dex Logo"
    >
      {withBackground && (
        <rect
          width="40"
          height="40"
          rx="10"
          fill="#0A0B0E"
          stroke="rgba(255, 255, 255, 0.1)"
          strokeWidth="1"
        />
      )}
      <path
        d="M 6 14 H 32 M 24 7 L 32 14 L 24 21"
        stroke={resolvedTopColor}
        strokeWidth="3.25"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M 34 26 H 8 M 16 19 L 8 26 L 16 33"
        stroke={bottomColor}
        strokeWidth="3.25"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

export default Logo;
