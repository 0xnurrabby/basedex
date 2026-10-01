"use client";

import { useState, useEffect } from "react";
import { parseUnits, formatUnits, type Address, createPublicClient, http, fallback } from "viem";
import { base } from "viem/chains";
import { usePublicClient } from "wagmi";
import { AERODROME_ROUTER_ABI } from "../constants/abis";
import {
  AERODROME_ROUTER,
  AERODROME_FACTORY,
  WETH_BASE,
  USDC_BASE,
  BASE_CHAIN_ID,
  BASE_RPC_URLS,
} from "../constants/contracts";
import type { Token } from "../constants/tokens";

export interface AerodromeRoute {
  from: Address;
  to: Address;
  stable: boolean;
  factory: Address;
}

export interface QuoteResult {
  amountOut: string;
  amountOutRaw: bigint;
  amountOutMin: bigint;
  amountOutMinFormatted: string;
  routes: AerodromeRoute[];
  executionPrice: string;
  isWrapOrUnwrap: boolean;
  isWrap: boolean;
  isUnwrap: boolean;
  routePath: string[];
}

const fallbackBaseClient = createPublicClient({
  chain: base,
  transport: fallback(
    BASE_RPC_URLS.map((url) => http(url, { timeout: 8_000, retryCount: 2 })),
    { rank: true }
  ),
});

function buildCandidateRoutes(
  tokenIn: Token,
  tokenOut: Token,
  addrIn: Address,
  addrOut: Address
): { routes: AerodromeRoute[]; path: string[] }[] {
  const candidates: { routes: AerodromeRoute[]; path: string[] }[] = [];

  candidates.push({
    routes: [{ from: addrIn, to: addrOut, stable: false, factory: AERODROME_FACTORY }],
    path: [tokenIn.symbol, tokenOut.symbol],
  });
  candidates.push({
    routes: [{ from: addrIn, to: addrOut, stable: true, factory: AERODROME_FACTORY }],
    path: [tokenIn.symbol, tokenOut.symbol],
  });

  const isWethIn = addrIn.toLowerCase() === WETH_BASE.toLowerCase();
  const isWethOut = addrOut.toLowerCase() === WETH_BASE.toLowerCase();
  if (!isWethIn && !isWethOut) {
    for (const s1 of [false, true]) {
      for (const s2 of [false, true]) {
        candidates.push({
          routes: [
            { from: addrIn, to: WETH_BASE, stable: s1, factory: AERODROME_FACTORY },
            { from: WETH_BASE, to: addrOut, stable: s2, factory: AERODROME_FACTORY },
          ],
          path: [tokenIn.symbol, "WETH", tokenOut.symbol],
        });
      }
    }
  }

  const isUsdcIn = addrIn.toLowerCase() === USDC_BASE.toLowerCase();
  const isUsdcOut = addrOut.toLowerCase() === USDC_BASE.toLowerCase();
  if (!isUsdcIn && !isUsdcOut) {
    for (const s1 of [false, true]) {
      for (const s2 of [false, true]) {
        candidates.push({
          routes: [
            { from: addrIn, to: USDC_BASE, stable: s1, factory: AERODROME_FACTORY },
            { from: USDC_BASE, to: addrOut, stable: s2, factory: AERODROME_FACTORY },
          ],
          path: [tokenIn.symbol, "USDC", tokenOut.symbol],
        });
      }
    }
  }

  if (!isWethIn && !isWethOut && !isUsdcIn && !isUsdcOut) {
    candidates.push({
      routes: [
        { from: addrIn, to: USDC_BASE, stable: false, factory: AERODROME_FACTORY },
        { from: USDC_BASE, to: WETH_BASE, stable: false, factory: AERODROME_FACTORY },
        { from: WETH_BASE, to: addrOut, stable: false, factory: AERODROME_FACTORY },
      ],
      path: [tokenIn.symbol, "USDC", "WETH", tokenOut.symbol],
    });
    candidates.push({
      routes: [
        { from: addrIn, to: WETH_BASE, stable: false, factory: AERODROME_FACTORY },
        { from: WETH_BASE, to: USDC_BASE, stable: false, factory: AERODROME_FACTORY },
        { from: USDC_BASE, to: addrOut, stable: false, factory: AERODROME_FACTORY },
      ],
      path: [tokenIn.symbol, "WETH", "USDC", tokenOut.symbol],
    });
  }

  return candidates;
}

export function useAerodromeQuote(
  tokenIn: Token | null,
  tokenOut: Token | null,
  amountIn: string,
  slippagePercent: number
) {
  const wagmiClient = usePublicClient({ chainId: BASE_CHAIN_ID });
  const client = wagmiClient || fallbackBaseClient;

  const [quote, setQuote] = useState<QuoteResult | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!tokenIn || !tokenOut || !amountIn || Number(amountIn) <= 0) {
      setQuote(null);
      setError(null);
      setIsLoading(false);
      return;
    }

    const isWrap = Boolean(
      tokenIn.isNative &&
      tokenOut.address.toLowerCase() === WETH_BASE.toLowerCase()
    );
    const isUnwrap = Boolean(
      tokenIn.address.toLowerCase() === WETH_BASE.toLowerCase() &&
      tokenOut.isNative
    );

    if (isWrap || isUnwrap) {
      try {
        const rawAmount = parseUnits(amountIn, tokenIn.decimals);
        setQuote({
          amountOut: amountIn,
          amountOutRaw: rawAmount,
          amountOutMin: rawAmount,
          amountOutMinFormatted: amountIn,
          routes: [],
          executionPrice: "1.0",
          isWrapOrUnwrap: true,
          isWrap,
          isUnwrap,
          routePath: [tokenIn.symbol, tokenOut.symbol],
        });
        setError(null);
        setIsLoading(false);
        return;
      } catch {
        setError("Invalid amount format");
        return;
      }
    }

    const addrIn: Address = tokenIn.isNative ? WETH_BASE : tokenIn.address;
    const addrOut: Address = tokenOut.isNative ? WETH_BASE : tokenOut.address;

    if (addrIn.toLowerCase() === addrOut.toLowerCase()) {
      setQuote(null);
      setError("Cannot swap identical tokens");
      setIsLoading(false);
      return;
    }

    let cancelled = false;

    async function fetchQuote() {
      setIsLoading(true);
      setError(null);

      try {
        const parsedAmountIn = parseUnits(amountIn, tokenIn!.decimals);
        const queryClient = fallbackBaseClient;

        // 1. Direct candidates (volatile xy=k, then stable)
        const directCandidates: { routes: AerodromeRoute[]; path: string[] }[] = [
          {
            routes: [{ from: addrIn, to: addrOut, stable: false, factory: AERODROME_FACTORY }],
            path: [tokenIn!.symbol, tokenOut!.symbol],
          },
          {
            routes: [{ from: addrIn, to: addrOut, stable: true, factory: AERODROME_FACTORY }],
            path: [tokenIn!.symbol, tokenOut!.symbol],
          },
        ];

        let bestAmountOut = 0n;
        let bestCandidate: { routes: AerodromeRoute[]; path: string[] } | null = null;

        const directResults = await Promise.allSettled(
          directCandidates.map((c) =>
            queryClient.readContract({
              address: AERODROME_ROUTER,
              abi: AERODROME_ROUTER_ABI,
              functionName: "getAmountsOut",
              args: [parsedAmountIn, c.routes],
            })
          )
        );

        if (cancelled) return;

        directResults.forEach((res, i) => {
          if (res.status === "fulfilled" && res.value && res.value.length > 0) {
            const outAmount = res.value[res.value.length - 1];
            if (outAmount > bestAmountOut) {
              bestAmountOut = outAmount;
              bestCandidate = directCandidates[i];
            }
          }
        });

        // 2. If direct route didn't return a quote, try multi-hop candidates (via WETH, USDC)
        if (bestAmountOut === 0n) {
          const allCandidates = buildCandidateRoutes(tokenIn!, tokenOut!, addrIn, addrOut);
          const multiHopCandidates = allCandidates.slice(2);

          if (multiHopCandidates.length > 0) {
            const multiHopResults = await Promise.allSettled(
              multiHopCandidates.map((c) =>
                queryClient.readContract({
                  address: AERODROME_ROUTER,
                  abi: AERODROME_ROUTER_ABI,
                  functionName: "getAmountsOut",
                  args: [parsedAmountIn, c.routes],
                })
              )
            );

            if (cancelled) return;

            multiHopResults.forEach((res, i) => {
              if (res.status === "fulfilled" && res.value && res.value.length > 0) {
                const outAmount = res.value[res.value.length - 1];
                if (outAmount > bestAmountOut) {
                  bestAmountOut = outAmount;
                  bestCandidate = multiHopCandidates[i];
                }
              }
            });
          }
        }

        if (bestAmountOut === 0n || !bestCandidate) {
          setQuote(null);
          setError("No liquidity pool found on Aerodrome for this pair");
          return;
        }

        const formattedOut = formatUnits(bestAmountOut, tokenOut!.decimals);
        const slippageBps = BigInt(
          Math.max(1, Math.min(5000, Math.floor(slippagePercent * 100)))
        );
        const amountOutMin = (bestAmountOut * (10000n - slippageBps)) / 10000n;
        const amountOutMinFormatted = formatUnits(amountOutMin, tokenOut!.decimals);

        const inNum = parseFloat(amountIn);
        const outNum = parseFloat(formattedOut);
        const price = inNum > 0 ? (outNum / inNum).toFixed(6) : "0";

        setQuote({
          amountOut: formattedOut,
          amountOutRaw: bestAmountOut,
          amountOutMin,
          amountOutMinFormatted,
          routes: (bestCandidate as { routes: AerodromeRoute[]; path: string[] }).routes,
          executionPrice: price,
          isWrapOrUnwrap: false,
          isWrap: false,
          isUnwrap: false,
          routePath: (bestCandidate as { routes: AerodromeRoute[]; path: string[] }).path,
        });
        setError(null);
      } catch (err: unknown) {
        if (!cancelled) {
          console.error("Quoting error:", err);
          setQuote(null);
          setError("Failed to fetch price quote from Aerodrome");
        }
      } finally {
        if (!cancelled) {
          setIsLoading(false);
        }
      }
    }

    const timer = setTimeout(() => {
      fetchQuote();
    }, 350);

    return () => {
      cancelled = true;
      clearTimeout(timer);
    };
  }, [tokenIn, tokenOut, amountIn, slippagePercent, client]);

  return { quote, isLoading, error };
}
