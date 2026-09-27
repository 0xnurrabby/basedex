"use client";

import React, { useState } from "react";
import { useAccount } from "wagmi";
import { BASESCAN_URL } from "../constants/contracts";
import {
  ExternalLink,
  ArrowRight,
  RotateCw,
  CheckCircle2,
  Clock,
  ArrowLeft,
  Copy,
  Check,
} from "lucide-react";
import { useTransactionHistory } from "../hooks/useTransactionHistory";

interface HistoryCardProps {
  onBack: () => void;
}

export function HistoryCard({ onBack }: HistoryCardProps) {
  const { address: userAddress } = useAccount();
  const {
    transactions,
    isLoading,
    filterMode,
    setFilterMode,
    refetch,
  } = useTransactionHistory();

  const [copiedHash, setCopiedHash] = useState<string | null>(null);

  const handleCopy = (hash: string) => {
    navigator.clipboard.writeText(hash);
    setCopiedHash(hash);
    setTimeout(() => setCopiedHash(null), 1800);
  };

  const formatLocalTime = (timestamp: number) => {
    try {
      const date = new Date(Number(timestamp));
      const dateStr = date.toLocaleDateString(undefined, {
        month: "short",
        day: "numeric",
        year: "numeric",
      });
      const timeStr = date.toLocaleTimeString(undefined, {
        hour: "2-digit",
        minute: "2-digit",
        second: "2-digit",
      });
      return `${dateStr} · ${timeStr}`;
    } catch {
      return "Recent";
    }
  };

  return (
    <div className="w-full max-w-[460px] mx-auto animate-in fade-in zoom-in-95 duration-200">
      <div className="rounded-2xl bg-surface-card border border-hairline p-4 sm:p-5 shadow-2xl relative transition-colors duration-200">
        {/* Top Header */}
        <div className="flex items-center justify-between pb-3 sm:pb-4 border-b border-hairline mb-3 sm:mb-4">
          <div className="flex items-center space-x-2">
            <div className="flex items-center space-x-1.5">
              <span className="w-2.5 h-2.5 sm:w-3 sm:h-3 rounded-full bg-terminal-red" />
              <span className="w-2.5 h-2.5 sm:w-3 sm:h-3 rounded-full bg-terminal-yellow" />
              <span className="w-2.5 h-2.5 sm:w-3 sm:h-3 rounded-full bg-terminal-green" />
            </div>
            <span className="text-xs font-mono text-ink-muted ml-1.5 sm:ml-2">
              terminal://history
            </span>
          </div>

          <div className="flex items-center space-x-2">
            <button
              onClick={() => refetch()}
              disabled={isLoading}
              className="p-1.5 rounded-full hover:bg-surface-soft text-ink-muted hover:text-ink transition active:scale-95"
              title="Refresh transaction history"
              aria-label="Refresh transactions"
            >
              <RotateCw
                className={`w-3.5 h-3.5 ${isLoading ? "animate-spin text-cyan-400" : ""}`}
              />
            </button>

            <button
              onClick={onBack}
              className="px-2.5 py-1 rounded-full bg-surface-soft hover:bg-surface-elevated border border-hairline text-ink text-[11px] font-mono flex items-center gap-1 transition active:scale-95"
              title="Return to swap terminal"
            >
              <ArrowLeft className="w-3 h-3" />
              <span>Swap</span>
            </button>
          </div>
        </div>

        {/* Filter Tabs */}
        <div className="flex items-center justify-between mb-3 text-xs font-mono">
          <div className="flex items-center gap-1.5 p-0.5 rounded-lg bg-surface-soft border border-hairline">
            <button
              onClick={() => setFilterMode("my")}
              className={`px-3 py-1 rounded-md text-[11px] transition ${
                filterMode === "my"
                  ? "bg-surface-card text-ink shadow-sm font-semibold"
                  : "text-ink-muted hover:text-ink"
              }`}
            >
              My Swaps
            </button>
            <button
              onClick={() => setFilterMode("all")}
              className={`px-3 py-1 rounded-md text-[11px] transition ${
                filterMode === "all"
                  ? "bg-surface-card text-ink shadow-sm font-semibold"
                  : "text-ink-muted hover:text-ink"
              }`}
            >
              All Swaps
            </button>
          </div>

          <span className="text-[11px] text-ink-muted">
            {transactions.length} record{transactions.length === 1 ? "" : "s"}
          </span>
        </div>

        {/* Transaction List */}
        <div className="space-y-2.5 max-h-[380px] sm:max-h-[420px] overflow-y-auto pr-1">
          {transactions.length === 0 ? (
            <div className="p-8 text-center rounded-xl bg-surface-soft border border-hairline font-mono space-y-2">
              <Clock className="w-8 h-8 text-ink-faint mx-auto opacity-50" />
              <p className="text-xs text-ink">No transactions found</p>
              <p className="text-[11px] text-ink-muted">
                {filterMode === "my" && !userAddress
                  ? "Connect your wallet to view your personal swaps."
                  : "Swaps executed through BaseDex will automatically record here."}
              </p>
            </div>
          ) : (
            transactions.map((tx, idx) => (
              <div
                key={tx.txHash || idx}
                className="p-3 sm:p-3.5 rounded-xl bg-surface-soft border border-hairline hover:border-hairline-strong transition duration-150 font-mono space-y-2"
              >
                {/* Flow and Badges */}
                <div className="flex items-center justify-between gap-2">
                  <div className="flex items-center gap-1.5 flex-wrap">
                    {/* Pay Token Badge */}
                    <span className="px-2 py-0.5 rounded-md text-[11px] sm:text-xs font-medium bg-sky-500/10 text-sky-400 border border-sky-500/20">
                      {tx.tokenInAmount} {tx.tokenInSymbol}
                    </span>

                    {/* Animated Minimalist Arrow */}
                    <div className="flex items-center space-x-1 px-0.5">
                      <span className="w-1.5 h-1.5 rounded-full bg-cyan-400 animate-ping shrink-0" />
                      <ArrowRight className="w-3.5 h-3.5 text-cyan-400 animate-pulse shrink-0" />
                    </div>

                    {/* Receive Token Badge */}
                    <span className="px-2 py-0.5 rounded-md text-[11px] sm:text-xs font-medium bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                      {tx.tokenOutAmount} {tx.tokenOutSymbol}
                    </span>
                  </div>

                  {/* Status Indicator */}
                  <span className="text-[10px] text-terminal-green font-medium flex items-center gap-1 shrink-0 bg-terminal-green/10 px-1.5 py-0.5 rounded-md border border-terminal-green/20">
                    <CheckCircle2 className="w-3 h-3" />
                    <span>Done</span>
                  </span>
                </div>

                {/* Footer Details: Time & Basescan Link */}
                <div className="flex items-center justify-between text-[11px] text-ink-muted pt-1 border-t border-hairline/60">
                  <div className="flex items-center gap-1 text-ink-muted text-[10px] sm:text-[11px]">
                    <Clock className="w-3 h-3 shrink-0" />
                    <span>{formatLocalTime(tx.timestamp)}</span>
                  </div>

                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => handleCopy(tx.txHash)}
                      className="p-1 rounded hover:bg-surface-card text-ink-muted hover:text-ink transition"
                      title="Copy transaction hash"
                    >
                      {copiedHash === tx.txHash ? (
                        <Check className="w-3 h-3 text-terminal-green" />
                      ) : (
                        <Copy className="w-3 h-3" />
                      )}
                    </button>

                    <a
                      href={`${BASESCAN_URL}/tx/${tx.txHash}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-1 text-violet-400 hover:text-violet-300 hover:underline text-[10px] sm:text-[11px]"
                      title="View on Basescan"
                    >
                      <span>
                        {tx.txHash.slice(0, 6)}...{tx.txHash.slice(-4)}
                      </span>
                      <ExternalLink className="w-3 h-3" />
                    </a>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Bottom Return Button */}
        <button
          onClick={onBack}
          className="mt-3.5 w-full py-2.5 rounded-full bg-surface-soft hover:bg-surface-elevated border border-hairline font-mono text-xs text-ink transition active:scale-[0.99] flex items-center justify-center gap-1.5"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          <span>Back to Terminal</span>
        </button>
      </div>
    </div>
  );
}
