"use client";

import { useState, useEffect, useCallback } from "react";
import type { Address } from "viem";
import { DEFAULT_TOKENS, Token } from "../constants/tokens";

const STORAGE_KEY = "basedex_custom_tokens";

export function useTokenList() {
  const [customTokens, setCustomTokens] = useState<Token[]>([]);

  useEffect(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored) {
        const parsed = JSON.parse(stored) as Token[];
        setCustomTokens(parsed);
      }
    } catch (e) {
      console.error("Failed to load custom tokens from storage", e);
    }
  }, []);

  const importToken = useCallback((token: Token) => {
    setCustomTokens((prev) => {
      const exists = prev.some(
        (t) => t.address.toLowerCase() === token.address.toLowerCase()
      );
      if (exists) return prev;
      const updated = [...prev, { ...token, isCustom: true }];
      try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
      } catch (e) {
        console.error("Failed to save custom token", e);
      }
      return updated;
    });
  }, []);

  const removeCustomToken = useCallback((address: Address) => {
    setCustomTokens((prev) => {
      const updated = prev.filter(
        (t) => t.address.toLowerCase() !== address.toLowerCase()
      );
      try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
      } catch (e) {
        console.error("Failed to update custom tokens in storage", e);
      }
      return updated;
    });
  }, []);

  const allTokens = [...DEFAULT_TOKENS];
  for (const ct of customTokens) {
    if (
      !allTokens.some(
        (t) => t.address.toLowerCase() === ct.address.toLowerCase()
      )
    ) {
      allTokens.push(ct);
    }
  }

  return {
    tokens: allTokens,
    customTokens,
    importToken,
    removeCustomToken,
  };
}
