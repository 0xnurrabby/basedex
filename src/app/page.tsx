"use client";

import React from "react";
import { Header } from "../components/Header";
import { SwapCard } from "../components/SwapCard";
import { Footer } from "../components/Footer";
import { Shield, Zap, RefreshCw } from "lucide-react";

export default function Home() {
  return (
    <div className="min-h-screen flex flex-col bg-canvas text-ink">
      <Header />

      <main className="flex-1 flex flex-col items-center justify-center px-4 pt-10 pb-16 max-w-5xl mx-auto w-full">
        <div className="text-center max-w-2xl mx-auto mb-8">
          <h1 className="text-3xl sm:text-4xl md:text-5xl font-semibold tracking-tight text-white">
            The minimalist DEX terminal for Base.
          </h1>
        </div>

        <SwapCard />

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-16 w-full max-w-4xl">
          <div className="p-5 rounded-xl bg-surface-card border border-hairline font-mono">
            <div className="w-8 h-8 rounded-full bg-surface-soft border border-hairline flex items-center justify-center text-white mb-3">
              <Zap className="w-4 h-4 text-terminal-yellow" />
            </div>
            <h4 className="text-sm font-semibold text-white mb-1">
              Direct Aerodrome Routing
            </h4>
            <p className="text-xs text-ink-muted leading-relaxed">
              Interacts directly with Aerodrome PoolFactory and Router. Eliminates
              indexing delays so newly launched pairs can be swapped instantly.
            </p>
          </div>

          <div className="p-5 rounded-xl bg-surface-card border border-hairline font-mono">
            <div className="w-8 h-8 rounded-full bg-surface-soft border border-hairline flex items-center justify-center text-white mb-3">
              <RefreshCw className="w-4 h-4 text-terminal-green" />
            </div>
            <h4 className="text-sm font-semibold text-white mb-1">
              Custom Token Import
            </h4>
            <p className="text-xs text-ink-muted leading-relaxed">
              Paste any ERC-20 contract address. The terminal reads metadata and pool
              status on-chain and persists imports to browser localStorage.
            </p>
          </div>

          <div className="p-5 rounded-xl bg-surface-card border border-hairline font-mono">
            <div className="w-8 h-8 rounded-full bg-surface-soft border border-hairline flex items-center justify-center text-white mb-3">
              <Shield className="w-4 h-4 text-terminal-green" />
            </div>
            <h4 className="text-sm font-semibold text-white mb-1">
              Non-Custodial & Secure
            </h4>
            <p className="text-xs text-ink-muted leading-relaxed">
              Every swap executes directly against verified on-chain liquidity pools
              with zero custody, zero protocol fees, and automated slippage control.
            </p>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
