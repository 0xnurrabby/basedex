"use client";

import { useState, useEffect } from "react";
import { parseUnits, formatUnits, type Address, zeroAddress } from "viem";
import { usePublicClient } from "wagmi";
import { AERODROME_ROUTER_ABI, AERODROME_FACTORY_ABI } from "../constants/abis";
import { AERODROME_ROUTER, AERODROME_FACTORY, WETH_BASE } from "../constants/contracts";
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

export function useAerodromeQuote(
  tokenIn: Token | null,
  tokenOut: Token | null,
  amountIn: string,
  slippagePercent: number
) {
  const publicClient = usePublicClient();
  const [quote, setQuote] = useState<QuoteResult | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!tokenIn || !tokenOut || !amountIn || Number(amountIn) <= 0 || !publicClient) {
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
      if (!publicClient) return;
      setIsLoading(true);
      setError(null);

      try {
        const parsedAmountIn = parseUnits(amountIn, tokenIn!.decimals);
        const candidateRoutes: { routes: AerodromeRoute[]; path: string[] }[] = [];

        candidateRoutes.push({
          routes: [
            {
              from: addrIn,
              to: addrOut,
              stable: false,
              factory: AERODROME_FACTORY,
            },
          ],
          path: [tokenIn!.symbol, tokenOut!.symbol],
        });

        candidateRoutes.push({
          routes: [
            {
              from: addrIn,
              to: addrOut,
              stable: true,
              factory: AERODROME_FACTORY,
            },
          ],
          path: [tokenIn!.symbol, tokenOut!.symbol],
        });

        if (
          addrIn.toLowerCase() !== WETH_BASE.toLowerCase() &&
          addrOut.toLowerCase() !== WETH_BASE.toLowerCase()
        ) {
          candidateRoutes.push({
            routes: [
              {
                from: addrIn,
                to: WETH_BASE,
                stable: false,
                factory: AERODROME_FACTORY,
              },
              {
                from: WETH_BASE,
                to: addrOut,
                stable: false,
                factory: AERODROME_FACTORY,
              },
            ],
            path: [tokenIn!.symbol, "WETH", tokenOut!.symbol],
          });
        }

        let bestAmountOut = 0n;
        let bestRoute: AerodromeRoute[] = [];
        let bestPath: string[] = [];

        for (const candidate of candidateRoutes) {
          try {
            if (candidate.routes.length === 1) {
              const r = candidate.routes[0];
              const pool = (await publicClient.readContract({
                address: AERODROME_FACTORY,
                abi: AERODROME_FACTORY_ABI,
                functionName: "getPool",
                args: [r.from, r.to, r.stable],
              })) as Address;
              if (!pool || pool === zeroAddress) continue;
            }

            const amounts = (await publicClient.readContract({
              address: AERODROME_ROUTER,
              abi: AERODROME_ROUTER_ABI,
              functionName: "getAmountsOut",
              args: [parsedAmountIn, candidate.routes],
            })) as bigint[];

            if (amounts && amounts.length > 0) {
              const outAmount = amounts[amounts.length - 1];
              if (outAmount > bestAmountOut) {
                bestAmountOut = outAmount;
                bestRoute = candidate.routes;
                bestPath = candidate.path;
              }
            }
          } catch {
            continue;
          }
        }

        if (cancelled) return;

        if (bestAmountOut === 0n) {
          setQuote(null);
          setError("No liquidity pool found on Aerodrome for this pair");
          return;
        }

        const formattedOut = formatUnits(bestAmountOut, tokenOut!.decimals);
        const slippageBps = BigInt(Math.max(1, Math.min(5000, Math.floor(slippagePercent * 100))));
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
          routes: bestRoute,
          executionPrice: price,
          isWrapOrUnwrap: false,
          isWrap: false,
          isUnwrap: false,
          routePath: bestPath,
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
    }, 250);

    return () => {
      cancelled = true;
      clearTimeout(timer);
    };
  }, [tokenIn, tokenOut, amountIn, slippagePercent, publicClient]);

  return { quote, isLoading, error };
}
