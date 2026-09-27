"use client";

import { useState, useEffect, useCallback } from "react";
import { maxUint256, parseUnits } from "viem";
import {
  useAccount,
  useReadContract,
  useWriteContract,
  useWaitForTransactionReceipt,
  usePublicClient,
  useSwitchChain,
} from "wagmi";
import { ERC20_ABI } from "../constants/abis";
import { AERODROME_ROUTER, BASE_CHAIN_ID } from "../constants/contracts";
import { BUILDER_DATA_SUFFIX } from "../config/wagmi";
import type { Token } from "../constants/tokens";

export function useTokenApproval(token: Token | null, amountNeeded: string) {
  const { address: userAddress, chain } = useAccount();
  const { switchChainAsync } = useSwitchChain();
  const publicClient = usePublicClient({ chainId: BASE_CHAIN_ID });
  const [isApproving, setIsApproving] = useState(false);
  const [approvalError, setApprovalError] = useState<string | null>(null);

  const isNative = Boolean(token?.isNative);

  const {
    data: allowance,
    refetch: refetchAllowance,
    isLoading: isCheckingAllowance,
  } = useReadContract({
    address: isNative ? undefined : token?.address,
    abi: ERC20_ABI,
    functionName: "allowance",
    args: userAddress && token?.address ? [userAddress, AERODROME_ROUTER] : undefined,
    chainId: BASE_CHAIN_ID,
    query: {
      enabled: Boolean(userAddress && token && !isNative),
      refetchInterval: () => (isApproving ? 1500 : 4000),
    },
  });

  const {
    data: approveTxHash,
    writeContractAsync,
    isPending: isWritePending,
    error: writeError,
    reset: resetWrite,
  } = useWriteContract();

  const {
    isLoading: isWaitingReceipt,
    isSuccess: isApproveSuccess,
  } = useWaitForTransactionReceipt({
    hash: approveTxHash,
    chainId: BASE_CHAIN_ID,
  });

  let isApproved = true;
  if (!isNative && token && amountNeeded && Number(amountNeeded) > 0) {
    try {
      const required = parseUnits(amountNeeded, token.decimals);
      isApproved = allowance !== undefined ? allowance >= required : false;
    } catch {
      isApproved = false;
    }
  }

  useEffect(() => {
    if (isApproved || isApproveSuccess) {
      setIsApproving(false);
      refetchAllowance();
    }
  }, [isApproved, isApproveSuccess, refetchAllowance]);

  useEffect(() => {
    if (!isApproving) return;
    const timeout = setTimeout(() => {
      refetchAllowance();
      setIsApproving(false);
    }, 30_000);
    return () => clearTimeout(timeout);
  }, [isApproving, refetchAllowance]);

  const approve = useCallback(async () => {
    if (!token || isNative || !userAddress) return;
    setIsApproving(true);
    setApprovalError(null);
    resetWrite();

    try {
      if (chain?.id !== BASE_CHAIN_ID) {
        try {
          await switchChainAsync({ chainId: BASE_CHAIN_ID });
        } catch {
          throw new Error("Please switch your wallet network to Base (8453) to approve tokens.");
        }
      }

      const hash = await writeContractAsync({
        address: token.address,
        abi: ERC20_ABI,
        functionName: "approve",
        args: [AERODROME_ROUTER, maxUint256],
        chainId: BASE_CHAIN_ID,
        dataSuffix: BUILDER_DATA_SUFFIX,
      });

      if (publicClient && hash) {
        try {
          await publicClient.waitForTransactionReceipt({
            hash,
            timeout: 30_000,
          });
        } catch (waitErr) {
          console.warn("Direct wait timeout, falling back to background polling", waitErr);
        }
      }

      await refetchAllowance();
      return hash;
    } catch (err: unknown) {
      console.error("Token approval failed:", err);
      const msg = err instanceof Error ? err.message : "Approval transaction failed";
      setApprovalError(msg.slice(0, 120));
      throw err;
    } finally {
      setIsApproving(false);
      refetchAllowance();
    }
  }, [token, isNative, userAddress, writeContractAsync, resetWrite, publicClient, refetchAllowance, chain, switchChainAsync]);

  const resetApprovalState = useCallback(() => {
    setIsApproving(false);
    setApprovalError(null);
    resetWrite();
    refetchAllowance();
  }, [resetWrite, refetchAllowance]);

  return {
    isApproved,
    isApproving: isApproving || isWritePending,
    isCheckingAllowance,
    approve,
    resetApprovalState,
    approveTxHash,
    error: approvalError || writeError,
    allowance,
  };
}
