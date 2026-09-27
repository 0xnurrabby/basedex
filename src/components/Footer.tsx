"use client";

import React from "react";

export function Footer() {
  return (
    <footer className="w-full py-2.5 sm:py-3.5 px-4 text-xs font-mono text-ink-muted transition-colors duration-200 shrink-0">
      <div className="max-w-lg mx-auto flex flex-col items-center justify-center gap-1.5 text-center">
        <div className="flex items-center gap-3 text-ink-muted">
          <a
            href="https://github.com/0xnurrabby/basedex"
            target="_blank"
            rel="noopener noreferrer"
            className="p-1 rounded-md hover:text-ink hover:bg-surface-soft transition active:scale-95 flex items-center gap-1.5"
            title="GitHub Repository (Open Source)"
            aria-label="GitHub Repository"
          >
            <svg
              width="14"
              height="14"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M15 22v-4a4.8 4.8 0 0 0-1-3.5c3 0 6-2 6-5.5.08-1.25-.27-2.48-1-3.5.28-1.15.28-2.35 0-3.5 0 0-1 0-3 1.5-2.64-.5-5.36-.5-8 0C6 2 5 2 5 2c-.3 1.15-.3 2.35 0 3.5A5.403 5.403 0 0 0 4 9c0 3.5 3 5.5 6 5.5-.39.49-.68 1.05-.85 1.65-.17.6-.22 1.23-.15 1.85v4" />
              <path d="M9 18c-4.51 2-5-2-7-2" />
            </svg>
            <span className="text-[11px]">GitHub</span>
          </a>

          <span className="text-hairline">·</span>

          <a
            href="https://x.com/nurlab_dev"
            target="_blank"
            rel="noopener noreferrer"
            className="p-1 rounded-md hover:text-ink hover:bg-surface-soft transition active:scale-95 flex items-center gap-1.5"
            title="Follow @nurlab_dev on X"
            aria-label="Twitter / X profile"
          >
            <svg
              width="12"
              height="12"
              viewBox="0 0 24 24"
              fill="currentColor"
            >
              <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
            </svg>
            <span className="text-[11px]">@nurlab_dev</span>
          </a>
        </div>

        <div className="flex items-center justify-center gap-1.5 text-[10px] text-ink-faint">
          <span className="w-1.5 h-1.5 rounded-full bg-terminal-green" />
          <span>Open source & secure · Direct on-chain</span>
        </div>
      </div>
    </footer>
  );
}
