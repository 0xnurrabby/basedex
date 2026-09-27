"use client";

import React, { useState } from "react";
import { useAccount, useConnect, useDisconnect, useSwitchChain } from "wagmi";
import { BASE_CHAIN_ID, BASESCAN_URL } from "../constants/contracts";
import { Wallet, ChevronDown, LogOut, ExternalLink, Terminal } from "lucide-react";

export function Header() {
  const { address, isConnected, chain } = useAccount();
  const { switchChain } = useSwitchChain();
  const { connectors, connect } = useConnect();
  const { disconnect } = useDisconnect();
  const [showWalletModal, setShowWalletModal] = useState(false);
  const [showAccountDropdown, setShowAccountDropdown] = useState(false);

  const isWrongNetwork = isConnected && chain?.id !== BASE_CHAIN_ID;

  return (
    <>
      <header className="w-full border-b border-hairline/80 bg-canvas/90 backdrop-blur-md sticky top-0 z-40">
        <div className="max-w-6xl mx-auto px-4 h-16 flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="w-8 h-8 rounded-full bg-white text-black flex items-center justify-center font-bold text-base shadow-sm">
              B
            </div>
            <div className="flex items-center space-x-2">
              <span className="font-semibold text-lg tracking-tight text-ink">
                Base Dex
              </span>
              <span className="text-[11px] font-mono px-2 py-0.5 rounded-full bg-surface-soft text-ink-muted border border-hairline">
                terminal
              </span>
            </div>
          </div>

          <div className="flex items-center space-x-2">
            <div className="flex items-center space-x-2 px-3 py-1.5 rounded-full bg-surface-soft border border-hairline text-xs font-mono">
              <span
                className={`w-2 h-2 rounded-full ${
                  isWrongNetwork ? "bg-terminal-red animate-pulse" : "bg-terminal-green"
                }`}
              />
              <span className="text-white font-medium">
                {isWrongNetwork
                  ? `Wrong Network (${chain?.name || "Mainnet"})`
                  : "Base (8453)"}
              </span>
            </div>
          </div>

          <div className="flex items-center space-x-3">
            {isWrongNetwork ? (
              <button
                onClick={() => switchChain({ chainId: BASE_CHAIN_ID })}
                className="px-4 py-2 rounded-full bg-terminal-red text-white text-xs font-medium hover:opacity-90 transition font-mono"
              >
                Switch to Base
              </button>
            ) : isConnected && address ? (
              <div className="relative">
                <button
                  onClick={() => setShowAccountDropdown(!showAccountDropdown)}
                  className="flex items-center space-x-2 px-4 py-1.5 rounded-full bg-surface-soft hover:bg-surface-elevated border border-hairline text-xs font-mono text-ink transition"
                >
                  <span className="w-2 h-2 rounded-full bg-terminal-green" />
                  <span>
                    {address.slice(0, 6)}...{address.slice(-4)}
                  </span>
                  <ChevronDown className="w-3.5 h-3.5 text-ink-muted" />
                </button>

                {showAccountDropdown && (
                  <div className="absolute right-0 mt-2 w-56 rounded-xl bg-surface-card border border-hairline p-2 shadow-2xl z-50">
                    <div className="px-3 py-2 border-b border-hairline mb-1">
                      <p className="text-[11px] text-ink-muted font-mono">Connected as</p>
                      <p className="text-xs font-mono text-white truncate">{address}</p>
                    </div>

                    <a
                      href={`${BASESCAN_URL}/address/${address}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center justify-between px-3 py-2 text-xs font-mono text-ink-muted hover:text-white rounded-lg hover:bg-surface-soft transition"
                    >
                      <span>View on Basescan</span>
                      <ExternalLink className="w-3.5 h-3.5" />
                    </a>

                    <button
                      onClick={() => {
                        disconnect();
                        setShowAccountDropdown(false);
                      }}
                      className="w-full flex items-center justify-between px-3 py-2 text-xs font-mono text-terminal-red hover:bg-surface-soft rounded-lg transition"
                    >
                      <span>Disconnect</span>
                      <LogOut className="w-3.5 h-3.5" />
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <button
                onClick={() => setShowWalletModal(true)}
                className="px-5 py-2 rounded-full bg-white text-black hover:bg-ink-deep active:scale-95 text-xs font-semibold tracking-wide transition shadow-sm"
              >
                Connect Wallet
              </button>
            )}
          </div>
        </div>
      </header>

      {showWalletModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
          <div className="relative w-full max-w-sm rounded-xl bg-surface-card border border-hairline p-6 shadow-2xl">
            <div className="flex items-center justify-between mb-5">
              <div className="flex items-center space-x-1.5">
                <div className="w-3 h-3 rounded-full bg-terminal-red" />
                <div className="w-3 h-3 rounded-full bg-terminal-yellow" />
                <div className="w-3 h-3 rounded-full bg-terminal-green" />
                <span className="text-xs font-mono text-ink-muted ml-2">connect://wallet</span>
              </div>
              <button
                onClick={() => setShowWalletModal(false)}
                className="text-ink-muted hover:text-white text-xs font-mono"
              >
                esc
              </button>
            </div>

            <h3 className="text-base font-medium text-white mb-1">Connect to Base</h3>
            <p className="text-xs text-ink-muted mb-4 font-mono">
              Select your wallet provider to swap on Aerodrome pools.
            </p>

            <div className="space-y-2">
              {connectors.map((connector) => (
                <button
                  key={connector.uid}
                  onClick={() => {
                    connect({ connector });
                    setShowWalletModal(false);
                  }}
                  className="w-full flex items-center justify-between p-3.5 rounded-full bg-surface-soft hover:bg-surface-elevated border border-hairline hover:border-hairline-strong transition text-xs font-mono text-white"
                >
                  <div className="flex items-center space-x-3">
                    <Wallet className="w-4 h-4 text-ink-muted" />
                    <span className="font-sans font-medium">{connector.name}</span>
                  </div>
                  <span className="text-[11px] text-ink-muted">connect →</span>
                </button>
              ))}
            </div>

            <div className="mt-5 pt-3 border-t border-hairline flex items-center justify-between text-[11px] text-ink-muted font-mono">
              <span className="flex items-center gap-1">
                <Terminal className="w-3 h-3 text-terminal-green" />
                Chain: Base (8453)
              </span>
              <span className="text-terminal-green">● Aerodrome Direct Routing</span>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
