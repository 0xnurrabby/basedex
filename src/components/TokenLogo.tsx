"use client";

import React, { useState, useEffect } from "react";
import type { Token } from "../constants/tokens";

interface TokenLogoProps {
  token: Token;
  size?: "sm" | "md" | "lg";
  className?: string;
}

export function TokenLogo({
  token,
  size = "md",
  className = "",
}: TokenLogoProps) {
  const [hasError, setHasError] = useState(false);

  useEffect(() => {
    setHasError(false);
  }, [token.address, token.logoURI]);

  const sizeClasses = {
    sm: "w-5 h-5 text-[10px]",
    md: "w-7 h-7 text-xs",
    lg: "w-9 h-9 text-sm",
  }[size];

  if (!token.logoURI || hasError) {
    return (
      <div
        className={`${sizeClasses} rounded-full bg-surface-card border border-hairline flex items-center justify-center font-mono font-bold text-ink shrink-0 select-none shadow-sm ${className}`}
        title={token.symbol}
      >
        {token.symbol.slice(0, 2).toUpperCase()}
      </div>
    );
  }

  return (
    <img
      src={token.logoURI}
      alt={token.symbol}
      onError={() => setHasError(true)}
      referrerPolicy="no-referrer"
      loading="lazy"
      className={`${sizeClasses} rounded-full bg-surface-soft object-cover shrink-0 select-none border border-hairline/30 ${className}`}
    />
  );
}
