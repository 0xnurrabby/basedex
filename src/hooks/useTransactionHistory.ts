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
  const { address: userAddress, isConnected } = useAccount();
  const [transactions, setTransactions] = useState<TransactionRecord[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const getCachedTxs = useCallback((): TransactionRecord[] => {
    if (typeof window === "undefined" || !userAddress) return [];
    try {
      const raw = localStorage.getItem(LOCAL_STORAGE_KEY);
      const all: TransactionRecord[] = raw ? JSON.parse(raw) : [];
      return all.filter((item) => item.userAddress?.toLowerCase() === userAddress.toLowerCase());
    } catch {
      return [];
    }
  }, [userAddress]);

  const saveCachedTx = useCallback((tx: TransactionRecord) => {
    if (typeof window === "undefined" || !userAddress) return;
    try {
      const raw = localStorage.getItem(LOCAL_STORAGE_KEY);
      const existing: TransactionRecord[] = raw ? JSON.parse(raw) : [];
      const updated = [tx, ...existing.filter((item) => item.txHash !== tx.txHash)].slice(0, 30);
      localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(updated));
    } catch (err) {
      console.warn("Failed to cache tx", err);
    }
  }, [userAddress]);

  const fetchTransactions = useCallback(async () => {
    if (!isConnected || !userAddress) {
      setTransactions([]);
      setIsLoading(false);
      return;
    }

    setIsLoading(true);
    setError(null);
    try {
      const res = await fetch(`/api/transactions?address=${encodeURIComponent(userAddress.toLowerCase())}`);
      const data = await res.json();
      if (data.success && Array.isArray(data.transactions)) {
        const cached = getCachedTxs();
        const combined = [...cached, ...data.transactions];
        const uniqueMap = new Map<string, TransactionRecord>();
        for (const item of combined) {
          if (item.userAddress?.toLowerCase() === userAddress.toLowerCase() && !uniqueMap.has(item.txHash)) {
            uniqueMap.set(item.txHash, item);
          }
        }
        const sorted = Array.from(uniqueMap.values()).sort(
          (a, b) => Number(b.timestamp) - Number(a.timestamp)
        );
        setTransactions(sorted);
      }
    } catch (err: any) {
      console.error("fetchTransactions error", err);
      setError("Failed to fetch transactions");
      setTransactions(getCachedTxs());
    } finally {
      setIsLoading(false);
    }
  }, [isConnected, userAddress, getCachedTxs]);

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
    refetch: fetchTransactions,
    recordTransaction,
  };
}
