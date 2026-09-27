"use client";

import React, { useState } from "react";
import { useAccount, useConnect, useDisconnect, useSwitchChain } from "wagmi";
import { BASE_CHAIN_ID, BASESCAN_URL } from "../constants/contracts";
import { Wallet, ChevronDown, LogOut, ExternalLink, Terminal, Sun, Moon } from "lucide-react";
import { useTheme } from "../providers/ThemeProvider";
import { WalletModal } from "./WalletModal";
import { Logo } from "./Logo";

export function Header() {
  const { address, isConnected, chain } = useAccount();
  const { switchChain } = useSwitchChain();
  const { connectors, connect } = useConnect();
  const { disconnect } = useDisconnect();
  const { theme, toggleTheme } = useTheme();
  const [showWalletModal, setShowWalletModal] = useState(false);
  const [showAccountDropdown, setShowAccountDropdown] = useState(false);

  const isWrongNetwork = isConnected && chain?.id !== BASE_CHAIN_ID;

  return (
    <>
      <header className="w-full border-b border-hairline bg-canvas/90 backdrop-blur-md sticky top-0 z-40 transition-colors duration-200">
        <div className="max-w-6xl mx-auto px-4 h-16 flex items-center justify-between">
          <div className="flex items-center space-x-2.5">
            <Logo size={26} className="text-ink shrink-0" />
            <span className="font-semibold text-base sm:text-lg tracking-tight text-ink">
              Base Dex
            </span>
          </div>

          <div className="flex items-center space-x-2 sm:space-x-3 shrink-0">
            <button
              onClick={toggleTheme}
              className="p-2 rounded-full text-ink-muted hover:text-ink hover:bg-surface-soft/60 transition active:scale-95 shrink-0 flex items-center justify-center"
              title={theme === "dark" ? "Switch to light mode" : "Switch to dark mode"}
              aria-label="Toggle theme"
            >
              {theme === "dark" ? (
                <Sun className="w-4 h-4 text-terminal-yellow" />
              ) : (
                <Moon className="w-4 h-4 text-ink" />
              )}
            </button>

            {isWrongNetwork ? (
              <button
                onClick={() => switchChain({ chainId: BASE_CHAIN_ID })}
                className="whitespace-nowrap px-3 sm:px-4 py-1.5 sm:py-2 rounded-full bg-terminal-red text-white text-xs font-medium hover:opacity-90 transition font-mono shrink-0"
              >
                Switch to Base
              </button>
            ) : isConnected && address ? (
              <div className="relative shrink-0">
                <button
                  onClick={() => setShowAccountDropdown(!showAccountDropdown)}
                  className="whitespace-nowrap flex items-center space-x-1.5 sm:space-x-2 px-3 sm:px-4 py-1.5 rounded-full bg-surface-soft hover:bg-surface-elevated border border-hairline text-xs font-mono text-ink transition shrink-0"
                >
                  <span className="w-2 h-2 rounded-full bg-terminal-green shrink-0" />
                  <span>
                    {address.slice(0, 6)}...{address.slice(-4)}
                  </span>
                  <ChevronDown className="w-3.5 h-3.5 text-ink-muted shrink-0" />
                </button>

                {showAccountDropdown && (
                  <div className="absolute right-0 mt-2 w-56 rounded-xl bg-surface-card border border-hairline p-2 shadow-2xl z-50">
                    <div className="px-3 py-2 border-b border-hairline mb-1">
                      <p className="text-[11px] text-ink-muted font-mono">Connected as</p>
                      <p className="text-xs font-mono text-ink truncate">{address}</p>
                    </div>

                    <a
                      href={`${BASESCAN_URL}/address/${address}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center justify-between px-3 py-2 text-xs font-mono text-ink-muted hover:text-ink rounded-lg hover:bg-surface-soft transition"
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
                className="whitespace-nowrap px-3.5 sm:px-4 py-1.5 sm:py-2 rounded-full bg-ink text-canvas hover:opacity-90 active:scale-95 text-xs font-semibold tracking-wide transition shadow-sm font-sans shrink-0"
              >
                Connect Wallet
              </button>
            )}
          </div>
        </div>
      </header>

      <WalletModal
        isOpen={showWalletModal}
        onClose={() => setShowWalletModal(false)}
      />
    </>
  );
}
