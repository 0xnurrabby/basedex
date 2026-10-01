"use client";

import { useState, useEffect } from "react";
import { createPublicClient, http, fallback, parseUnits, formatUnits, type Address } from "viem";
import { base } from "viem/chains";
import {
  WETH_BASE,
  USDC_BASE,
  AERODROME_ROUTER,
  AERODROME_FACTORY,
  BASE_RPC_URLS,
} from "../constants/contracts";
import { AERODROME_ROUTER_ABI } from "../constants/abis";
import type { Token } from "../constants/tokens";

const fallbackBaseClient = createPublicClient({
  chain: base,
  transport: fallback(
    BASE_RPC_URLS.map((url) => http(url)),
    { rank: false }
  ),
});

export function useTokenPrices(tokens: Token[]) {
  const [prices, setPrices] = useState<Record<string, number>>({
    "0x0000000000000000000000000000000000000000": 2690,
    [WETH_BASE.toLowerCase()]: 2690,
    [USDC_BASE.toLowerCase()]: 1.0,
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
        let ethPrice = 2690;
        const updated: Record<string, number> = {
          "0x833589fcd6edb6e08f4c7c32d4f71b54bda02913": 1.0,
          [USDC_BASE.toLowerCase()]: 1.0,
        };

        try {
          const res = await fetch(`https://coins.llama.fi/prices/current/${queryParams}`);
          if (res.ok) {
            const data = await res.json();
            const coins = data.coins || {};
            ethPrice = coins["coingecko:ethereum"]?.price || 2690;

            for (const tok of tokens) {
              if (!tok.isNative) {
                const coin = coins[`base:${tok.address.toLowerCase()}`];
                if (coin && coin.price) {
                  updated[tok.address.toLowerCase()] = coin.price;
                }
              }
            }
          }
        } catch (llamaErr) {
          console.warn("DefiLlama fetch failed, using on-chain fallback", llamaErr);
        }

        updated["0x0000000000000000000000000000000000000000"] = ethPrice;
        updated[WETH_BASE.toLowerCase()] = ethPrice;

        // ON-CHAIN AERODROME PRICE FALLBACK: For newly created or unindexed custom tokens
        for (const tok of tokens) {
          if (!tok.isNative && (!updated[tok.address.toLowerCase()] || updated[tok.address.toLowerCase()] === 0)) {
            const tokAddr = tok.address.toLowerCase();
            try {
              const targetAddr = tok.address as Address;
              const sampleAmount = parseUnits("1000", tok.decimals || 18);

              // 1. Try Direct Route to WETH
              const wethRoute = [
                { from: targetAddr, to: WETH_BASE, stable: false, factory: AERODROME_FACTORY },
              ];

              try {
                const amounts = (await fallbackBaseClient.readContract({
                  address: AERODROME_ROUTER,
                  abi: AERODROME_ROUTER_ABI,
                  functionName: "getAmountsOut",
                  args: [sampleAmount, wethRoute],
                })) as bigint[];

                if (amounts && amounts.length > 0) {
                  const outWeth = parseFloat(formatUnits(amounts[amounts.length - 1], 18));
                  const calculatedPrice = (outWeth / 1000) * ethPrice;
                  if (calculatedPrice > 0) {
                    updated[tokAddr] = calculatedPrice;
                    continue;
                  }
                }
              } catch {
                // Not a direct volatile WETH pair, try multi-hop
              }

              // 2. Try Direct Route to USDC
              const usdcRoute = [
                { from: targetAddr, to: USDC_BASE, stable: false, factory: AERODROME_FACTORY },
              ];

              try {
                const amountsUsdc = (await fallbackBaseClient.readContract({
                  address: AERODROME_ROUTER,
                  abi: AERODROME_ROUTER_ABI,
                  functionName: "getAmountsOut",
                  args: [sampleAmount, usdcRoute],
                })) as bigint[];

                if (amountsUsdc && amountsUsdc.length > 0) {
                  const outUsdc = parseFloat(formatUnits(amountsUsdc[amountsUsdc.length - 1], 6));
                  const calculatedPrice = outUsdc / 1000;
                  if (calculatedPrice > 0) {
                    updated[tokAddr] = calculatedPrice;
                    continue;
                  }
                }
              } catch {
                // Not direct USDC pair
              }

              // 3. Try Multi-Hop via other tokens in the list that have a known price
              for (const bridgeTok of tokens) {
                if (
                  !bridgeTok.isNative &&
                  bridgeTok.address.toLowerCase() !== tokAddr &&
                  updated[bridgeTok.address.toLowerCase()] &&
                  updated[bridgeTok.address.toLowerCase()] > 0
                ) {
                  try {
                    const bridgeAddr = bridgeTok.address as Address;
                    const bridgePrice = updated[bridgeTok.address.toLowerCase()];

                    const bridgeRoute = [
                      { from: targetAddr, to: bridgeAddr, stable: false, factory: AERODROME_FACTORY },
                    ];

                    const amountsBridge = (await fallbackBaseClient.readContract({
                      address: AERODROME_ROUTER,
                      abi: AERODROME_ROUTER_ABI,
                      functionName: "getAmountsOut",
                      args: [sampleAmount, bridgeRoute],
                    })) as bigint[];

                    if (amountsBridge && amountsBridge.length > 0) {
                      const outBridge = parseFloat(
                        formatUnits(amountsBridge[amountsBridge.length - 1], bridgeTok.decimals || 18)
                      );
                      const calculatedPrice = (outBridge / 1000) * bridgePrice;
                      if (calculatedPrice > 0) {
                        updated[tokAddr] = calculatedPrice;
                        break;
                      }
                    }
                  } catch {
                    // Try next bridge token
                  }
                }
              }
            } catch (onChainErr) {
              console.debug("On-chain price quote skipped for", tok.symbol, onChainErr);
            }
          }
        }

        if (!cancelled) {
          setPrices((prev) => ({ ...prev, ...updated }));
        }
      } catch (err) {
        console.warn("Failed to update prices", err);
      }
    }

    fetchPrices();
    const interval = setInterval(fetchPrices, 12_000); // Refresh every 12s

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
