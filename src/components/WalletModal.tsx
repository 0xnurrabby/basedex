"use client";

import React from "react";
import { useConnect } from "wagmi";
import { Wallet, Terminal, X } from "lucide-react";
import { triggerFeedback } from "../utils/feedback";

interface WalletModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function WalletModal({ isOpen, onClose }: WalletModalProps) {
  const { connectors, connect } = useConnect();

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm"
      onClick={onClose}
    >
      <div
        className="relative w-full max-w-sm rounded-xl bg-surface-card border border-hairline p-6 shadow-2xl transition-colors duration-200"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between mb-5">
          <div className="flex items-center space-x-1.5">
            <span className="w-3 h-3 rounded-full bg-terminal-red" />
            <span className="w-3 h-3 rounded-full bg-terminal-yellow" />
            <span className="w-3 h-3 rounded-full bg-terminal-green" />
            <span className="text-xs font-mono text-ink-muted ml-2">
              connect://wallet
            </span>
          </div>
          <button
            onClick={() => {
              triggerFeedback();
              onClose();
            }}
            className="text-ink-muted hover:text-ink p-1 rounded-md transition"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        <h3 className="text-base font-semibold text-ink mb-1">
          Connect to Base
        </h3>
        <p className="text-xs text-ink-muted mb-4 font-mono">
          Select your wallet provider to swap on Base.
        </p>

        <div className="space-y-2">
          {connectors.map((connector) => (
            <button
              key={connector.uid}
              onClick={() => {
                triggerFeedback();
                connect({ connector });
                onClose();
              }}
              className="w-full flex items-center justify-between p-3.5 rounded-full bg-surface-soft hover:bg-surface-elevated border border-hairline hover:border-hairline-strong transition text-xs font-mono text-ink cursor-pointer active:scale-[0.98]"
            >
              <div className="flex items-center space-x-3">
                <Wallet className="w-4 h-4 text-ink-muted" />
                <span className="font-sans font-medium">{connector.name}</span>
              </div>
              <span className="text-[11px] text-ink-muted font-mono">
                connect →
              </span>
            </button>
          ))}
        </div>

        <div className="mt-5 pt-3 border-t border-hairline flex items-center justify-between text-[11px] text-ink-muted font-mono">
          <span className="flex items-center gap-1">
            <Terminal className="w-3 h-3 text-terminal-green" />
            Chain: Base (8453)
          </span>
          <span className="text-terminal-green">● Aerodrome Route</span>
        </div>
      </div>
    </div>
  );
}
