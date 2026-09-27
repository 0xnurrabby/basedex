"use client";

import { useState, useCallback } from "react";
import { parseUnits, type Address } from "viem";
import {
  useAccount,
  useWriteContract,
  useWaitForTransactionReceipt,
  usePublicClient,
  useSwitchChain,
} from "wagmi";
import { AERODROME_ROUTER_ABI, WETH_ABI } from "../constants/abis";
import { AERODROME_ROUTER, WETH_BASE, BASE_CHAIN_ID } from "../constants/contracts";
import { BUILDER_DATA_SUFFIX } from "../config/wagmi";
import type { Token } from "../constants/tokens";
import type { QuoteResult } from "./useAerodromeQuote";

export function useSwapExecution() {
  const { address: userAddress, chain } = useAccount();
  const { switchChainAsync } = useSwitchChain();
  const publicClient = usePublicClient({ chainId: BASE_CHAIN_ID });
  const [isPreparing, setIsPreparing] = useState(false);
  const [swapError, setSwapError] = useState<string | null>(null);

  const {
    data: txHash,
    writeContractAsync,
    isPending: isWritePending,
    error: writeError,
    reset: resetWrite,
  } = useWriteContract();

  const {
    isLoading: isConfirming,
    isSuccess,
    error: receiptError,
  } = useWaitForTransactionReceipt({
    hash: txHash,
    chainId: BASE_CHAIN_ID,
  });

  const executeSwap = useCallback(
    async (
      tokenIn: Token,
      tokenOut: Token,
      amountIn: string,
      quote: QuoteResult
    ) => {
      if (!userAddress) throw new Error("Wallet not connected");
      setIsPreparing(true);
      setSwapError(null);
      resetWrite();

      try {
        if (chain?.id !== BASE_CHAIN_ID) {
          try {
            await switchChainAsync({ chainId: BASE_CHAIN_ID });
          } catch {
            throw new Error("Please switch your wallet network to Base (8453) to execute swap.");
          }
        }
        const amountInRaw = parseUnits(amountIn, tokenIn.decimals);
        const deadline = BigInt(Math.floor(Date.now() / 1000) + 1200);

        let hash: Address;

        if (quote.isWrap) {
          hash = await writeContractAsync({
            address: WETH_BASE,
            abi: WETH_ABI,
            functionName: "deposit",
            value: amountInRaw,
            chainId: BASE_CHAIN_ID,
            dataSuffix: BUILDER_DATA_SUFFIX,
          });
        } else if (quote.isUnwrap) {
          hash = await writeContractAsync({
            address: WETH_BASE,
            abi: WETH_ABI,
            functionName: "withdraw",
            args: [amountInRaw],
            chainId: BASE_CHAIN_ID,
            dataSuffix: BUILDER_DATA_SUFFIX,
          });
        } else if (tokenIn.isNative) {
          hash = await writeContractAsync({
            address: AERODROME_ROUTER,
            abi: AERODROME_ROUTER_ABI,
            functionName: "swapExactETHForTokens",
            args: [quote.amountOutMin, quote.routes, userAddress, deadline],
            value: amountInRaw,
            chainId: BASE_CHAIN_ID,
            dataSuffix: BUILDER_DATA_SUFFIX,
          });
        } else if (tokenOut.isNative) {
          hash = await writeContractAsync({
            address: AERODROME_ROUTER,
            abi: AERODROME_ROUTER_ABI,
            functionName: "swapExactTokensForETH",
            args: [amountInRaw, quote.amountOutMin, quote.routes, userAddress, deadline],
            chainId: BASE_CHAIN_ID,
            dataSuffix: BUILDER_DATA_SUFFIX,
          });
        } else {
          hash = await writeContractAsync({
            address: AERODROME_ROUTER,
            abi: AERODROME_ROUTER_ABI,
            functionName: "swapExactTokensForTokens",
            args: [amountInRaw, quote.amountOutMin, quote.routes, userAddress, deadline],
            chainId: BASE_CHAIN_ID,
            dataSuffix: BUILDER_DATA_SUFFIX,
          });
        }

        if (publicClient && hash) {
          try {
            await publicClient.waitForTransactionReceipt({
              hash,
              timeout: 45_000,
            });
          } catch (waitErr) {
            console.warn("Swap direct receipt wait timeout", waitErr);
          }
        }

        return hash;
      } catch (err: unknown) {
        console.error("Swap execution failed:", err);
        const msg = err instanceof Error ? err.message : "Swap transaction failed";
        setSwapError(msg.slice(0, 120));
        throw err;
      } finally {
        setIsPreparing(false);
      }
    },
    [userAddress, writeContractAsync, resetWrite, publicClient, chain, switchChainAsync]
  );

  return {
    executeSwap,
    txHash,
    isPending: isPreparing || isWritePending,
    isConfirming,
    isSuccess,
    error: swapError || writeError?.message || receiptError?.message,
    reset: resetWrite,
  };
}
