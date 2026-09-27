"use client";

import React from "react";
import { Terminal, ExternalLink } from "lucide-react";
import { AERODROME_ROUTER, AERODROME_FACTORY } from "../constants/contracts";

export function Footer() {
  return (
    <footer className="w-full border-t border-hairline py-8 mt-16 bg-canvas text-ink-muted text-xs font-mono">
      <div className="max-w-6xl mx-auto px-4 flex flex-col md:flex-row items-center justify-between gap-4">
        <div className="flex items-center space-x-2">
          <Terminal className="w-4 h-4 text-terminal-green" />
          <span className="text-white font-medium">Base Dex</span>
          <span>· Direct On-Chain Terminal for Base (8453)</span>
        </div>

        <div className="flex flex-wrap items-center justify-center gap-4 text-[11px]">
          <a
            href="https://aerodrome.finance"
            target="_blank"
            rel="noopener noreferrer"
            className="hover:text-white transition flex items-center gap-1"
          >
            <span>Aerodrome Finance</span>
            <ExternalLink className="w-3 h-3" />
          </a>
          <a
            href="https://base.org"
            target="_blank"
            rel="noopener noreferrer"
            className="hover:text-white transition flex items-center gap-1 text-terminal-green"
          >
            <span>Base Network</span>
            <ExternalLink className="w-3 h-3" />
          </a>
          <a
            href="https://basescan.org"
            target="_blank"
            rel="noopener noreferrer"
            className="hover:text-white transition flex items-center gap-1"
          >
            <span>Basescan</span>
            <ExternalLink className="w-3 h-3" />
          </a>
        </div>

        <div className="text-[10px] text-ink-faint text-center md:text-right">
          Router: {AERODROME_ROUTER.slice(0, 6)}...{AERODROME_ROUTER.slice(-4)} · Factory: {AERODROME_FACTORY.slice(0, 6)}...{AERODROME_FACTORY.slice(-4)}
        </div>
      </div>
    </footer>
  );
}
