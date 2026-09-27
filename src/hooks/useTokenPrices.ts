"use client";

import { useState, useEffect } from "react";
import { WETH_BASE } from "../constants/contracts";
import type { Token } from "../constants/tokens";

export function useTokenPrices(tokens: Token[]) {
  const [prices, setPrices] = useState<Record<string, number>>({
    "0x0000000000000000000000000000000000000000": 2690,
    [WETH_BASE.toLowerCase()]: 2690,
    "0x833589fcd6edb6e08f4c7c32d4f71b54bda02913": 1.0,
  });

  useEffect(() => {
    let cancelled = false;

    async function fetchPrices() {
      try {
        const baseAddresses = tokens
          .filter((t) => !t.isNative)
          .map((t) => `base:${t.address.toLowerCase()}`);

        const queryParams = ["coingecko:ethereum", ...baseAddresses].join(",");
        const res = await fetch(`https://coins.llama.fi/prices/current/${queryParams}`);
        if (!res.ok) return;

        const data = await res.json();
        const coins = data.coins || {};

        if (cancelled) return;

        const updated: Record<string, number> = {
          "0x833589fcd6edb6e08f4c7c32d4f71b54bda02913": 1.0,
        };

        const ethPrice = coins["coingecko:ethereum"]?.price || 2690;
        updated["0x0000000000000000000000000000000000000000"] = ethPrice;
        updated[WETH_BASE.toLowerCase()] = ethPrice;

        for (const tok of tokens) {
          if (!tok.isNative) {
            const coin = coins[`base:${tok.address.toLowerCase()}`];
            if (coin && coin.price) {
              updated[tok.address.toLowerCase()] = coin.price;
            }
          }
        }

        setPrices((prev) => ({ ...prev, ...updated }));
      } catch (err) {
        console.warn("Failed to fetch DefiLlama prices", err);
      }
    }

    fetchPrices();
    const interval = setInterval(fetchPrices, 30_000);

    return () => {
      cancelled = true;
      clearInterval(interval);
    };
  }, [tokens]);

  const getPrice = (addressOrNative: string): number => {
    const key = addressOrNative.toLowerCase();
    return prices[key] || 0;
  };

  return { prices, getPrice };
}
