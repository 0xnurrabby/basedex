"use client";

import { useState, useEffect, useCallback } from "react";
import { useAccount } from "wagmi";

export interface TransactionRecord {
  id?: number | string;
  txHash: string;
  userAddress: string;
  tokenInSymbol: string;
  tokenInAddress: string;
  tokenInAmount: string;
  tokenInUsd?: number;
  tokenOutSymbol: string;
  tokenOutAddress: string;
  tokenOutAmount: string;
  tokenOutUsd?: number;
  timestamp: number;
  createdAt?: string;
}

const LOCAL_STORAGE_KEY = "basedex_recent_txs";

export function useTransactionHistory() {
  const { address: userAddress } = useAccount();
  const [transactions, setTransactions] = useState<TransactionRecord[]>([]);
  const [filterMode, setFilterMode] = useState<"my" | "all">("my");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const getCachedTxs = useCallback((): TransactionRecord[] => {
    if (typeof window === "undefined") return [];
    try {
      const raw = localStorage.getItem(LOCAL_STORAGE_KEY);
      return raw ? JSON.parse(raw) : [];
    } catch {
      return [];
    }
  }, []);

  const saveCachedTx = useCallback((tx: TransactionRecord) => {
    if (typeof window === "undefined") return;
    try {
      const existing = getCachedTxs();
      const updated = [tx, ...existing.filter((item) => item.txHash !== tx.txHash)].slice(0, 30);
      localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(updated));
    } catch (err) {
      console.warn("Failed to cache tx", err);
    }
  }, [getCachedTxs]);

  const fetchTransactions = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      const queryAddress = filterMode === "my" && userAddress ? userAddress : "all";
      const res = await fetch(`/api/transactions?address=${encodeURIComponent(queryAddress)}`);
      const data = await res.json();
      if (data.success && Array.isArray(data.transactions)) {
        const cached = getCachedTxs();
        const combined = [...cached, ...data.transactions];
        const uniqueMap = new Map<string, TransactionRecord>();
        for (const item of combined) {
          if (!uniqueMap.has(item.txHash)) {
            uniqueMap.set(item.txHash, item);
          }
        }
        const sorted = Array.from(uniqueMap.values()).sort(
          (a, b) => Number(b.timestamp) - Number(a.timestamp)
        );

        if (filterMode === "my" && userAddress) {
          const myFiltered = sorted.filter(
            (tx) => tx.userAddress.toLowerCase() === userAddress.toLowerCase()
          );
          setTransactions(myFiltered);
        } else {
          setTransactions(sorted);
        }
      }
    } catch (err: any) {
      console.error("fetchTransactions error", err);
      setError("Failed to fetch transactions");
      setTransactions(getCachedTxs());
    } finally {
      setIsLoading(false);
    }
  }, [filterMode, userAddress, getCachedTxs]);

  useEffect(() => {
    fetchTransactions();
  }, [fetchTransactions]);

  const recordTransaction = useCallback(
    async (tx: Omit<TransactionRecord, "id" | "createdAt">) => {
      saveCachedTx(tx);
      setTransactions((prev) => [tx, ...prev.filter((item) => item.txHash !== tx.txHash)]);
      try {
        await fetch("/api/transactions", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(tx),
        });
      } catch (err) {
        console.warn("Failed to record tx to backend", err);
      }
    },
    [saveCachedTx]
  );

  return {
    transactions,
    isLoading,
    error,
    filterMode,
    setFilterMode,
    refetch: fetchTransactions,
    recordTransaction,
  };
}
