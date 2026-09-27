"use client";

import { useState, useEffect } from "react";
import { isAddress, type Address, zeroAddress, createPublicClient, http, fallback } from "viem";
import { base } from "viem/chains";
import { usePublicClient } from "wagmi";
import { ERC20_ABI, AERODROME_FACTORY_ABI } from "../constants/abis";
import { AERODROME_FACTORY, WETH_BASE, BASE_CHAIN_ID, BASE_RPC_URLS, USDC_BASE } from "../constants/contracts";
import type { Token } from "../constants/tokens";

export interface PoolStatusInfo {
  hasPool: boolean;
  poolAddress?: Address;
  pairToken?: string;
  isStable?: boolean;
}

const fallbackBaseClient = createPublicClient({
  chain: base,
  transport: fallback(
    BASE_RPC_URLS.map((url) => http(url)),
    { rank: false }
  ),
});

export function useCustomToken(inputAddress: string) {
  const wagmiClient = usePublicClient({ chainId: BASE_CHAIN_ID });
  const publicClient = wagmiClient || fallbackBaseClient;
  const [token, setToken] = useState<Token | null>(null);
  const [poolStatus, setPoolStatus] = useState<PoolStatusInfo | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const trimmed = inputAddress.trim();
    if (!trimmed || !isAddress(trimmed)) {
      setToken(null);
      setPoolStatus(null);
      setError(null);
      setIsLoading(false);
      return;
    }

    const targetAddress = trimmed as Address;
    let cancelled = false;

    async function fetchTokenData() {
      if (!publicClient) return;
      setIsLoading(true);
      setError(null);

      try {
        const [name, symbol, decimals] = await Promise.all([
          publicClient.readContract({
            address: targetAddress,
            abi: ERC20_ABI,
            functionName: "name",
          }),
          publicClient.readContract({
            address: targetAddress,
            abi: ERC20_ABI,
            functionName: "symbol",
          }),
          publicClient.readContract({
            address: targetAddress,
            abi: ERC20_ABI,
            functionName: "decimals",
          }),
        ]);

        if (cancelled) return;

        const resolvedToken: Token = {
          address: targetAddress,
          name: name as string,
          symbol: symbol as string,
          decimals: Number(decimals),
          isCustom: true,
        };

        setToken(resolvedToken);

        try {
          const wethVolatilePool = (await publicClient.readContract({
            address: AERODROME_FACTORY,
            abi: AERODROME_FACTORY_ABI,
            functionName: "getPool",
            args: [targetAddress, WETH_BASE, false],
          })) as Address;

          if (wethVolatilePool && wethVolatilePool !== zeroAddress) {
            setPoolStatus({
              hasPool: true,
              poolAddress: wethVolatilePool,
              pairToken: "WETH",
              isStable: false,
            });
            setIsLoading(false);
            return;
          }

          const wethStablePool = (await publicClient.readContract({
            address: AERODROME_FACTORY,
            abi: AERODROME_FACTORY_ABI,
            functionName: "getPool",
            args: [targetAddress, WETH_BASE, true],
          })) as Address;

          if (wethStablePool && wethStablePool !== zeroAddress) {
            setPoolStatus({
              hasPool: true,
              poolAddress: wethStablePool,
              pairToken: "WETH",
              isStable: true,
            });
            setIsLoading(false);
            return;
          }

          const usdcVolatilePool = (await publicClient.readContract({
            address: AERODROME_FACTORY,
            abi: AERODROME_FACTORY_ABI,
            functionName: "getPool",
            args: [targetAddress, USDC_BASE, false],
          })) as Address;

          if (usdcVolatilePool && usdcVolatilePool !== zeroAddress) {
            setPoolStatus({
              hasPool: true,
              poolAddress: usdcVolatilePool,
              pairToken: "USDC",
              isStable: false,
            });
            setIsLoading(false);
            return;
          }

          setPoolStatus({
            hasPool: false,
          });
        } catch (poolErr) {
          console.warn("Failed to check Aerodrome pool existence", poolErr);
          setPoolStatus({ hasPool: false });
        }
      } catch (err: unknown) {
        if (!cancelled) {
          console.error("Error reading token data:", err);
          setError(
            err instanceof Error
              ? err.message.slice(0, 120)
              : "Invalid ERC-20 contract address on Base"
          );
          setToken(null);
          setPoolStatus(null);
        }
      } finally {
        if (!cancelled) {
          setIsLoading(false);
        }
      }
    }

    fetchTokenData();

    return () => {
      cancelled = true;
    };
  }, [inputAddress, publicClient]);

  return { token, poolStatus, isLoading, error };
}
