"use client";

import React, { useEffect, useState } from "react";
import { useTheme } from "../providers/ThemeProvider";

interface ArchiveIconProps {
  size?: number;
  className?: string;
  trigger?: "loop" | "loop-on-hover";
}

export function ArchiveIcon({
  size = 22,
  className = "",
  trigger = "loop",
}: ArchiveIconProps) {
  const { theme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    if (!document.querySelector('script[src*="embed-animated-icons.js"]')) {
      const script = document.createElement("script");
      script.src = "https://animatedicons.co/scripts/embed-animated-icons.js";
      script.async = true;
      document.body.appendChild(script);
    }
  }, []);

  const groupColor = theme === "dark" ? "#FFFFFF" : "#000000";
  const bgColor = theme === "dark" ? "#0052FF40" : "#A7C9FFFF";

  const attributes = JSON.stringify({
    variationThumbColour: "#A4A7A9",
    variationName: "Gray Tone",
    variationNumber: 3,
    numberOfGroups: 1,
    strokeWidth: 1.3,
    backgroundIsGroup: true,
    defaultColours: {
      "group-1": groupColor,
      background: bgColor,
    },
  });

  return (
    <div
      className={`relative inline-flex items-center justify-center select-none overflow-hidden ${className}`}
      style={{ width: size, height: size }}
    >
      {mounted &&
        React.createElement("animated-icons", {
          key: `${theme}-${trigger}`,
          src: "https://animatedicons.co/get-icon?name=Archive&style=minimalistic&token=0c93ad53-7a21-4237-831d-5173da67987d",
          trigger,
          attributes,
          height: String(size),
          width: String(size),
          style: {
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            width: "100%",
            height: "100%",
          },
        })}
      {!mounted && (
        <svg
          width={size}
          height={size}
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.8"
          strokeLinecap="round"
          strokeLinejoin="round"
          className="text-ink"
        >
          <rect width="20" height="5" x="2" y="3" rx="1" />
          <path d="M4 8v11a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8" />
          <path d="M10 12h4" />
        </svg>
      )}
    </div>
  );
}
