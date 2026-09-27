"use client";

import React, { useState } from "react";
import { SlidersHorizontal } from "lucide-react";
import { triggerFeedback } from "../utils/feedback";

interface SlippageSettingsProps {
  slippage: number;
  onSlippageChange: (value: number) => void;
}

export function SlippageSettings({
  slippage,
  onSlippageChange,
}: SlippageSettingsProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [customValue, setCustomValue] = useState("");

  const presets = [0.1, 0.5, 1.0];

  const handleCustomChange = (val: string) => {
    setCustomValue(val);
    const parsed = parseFloat(val);
    if (!isNaN(parsed) && parsed > 0 && parsed <= 50) {
      onSlippageChange(parsed);
    }
  };

  return (
    <div className="relative">
      <button
        onClick={() => {
          triggerFeedback();
          setIsOpen(!isOpen);
        }}
        className="flex items-center space-x-1.5 px-3 py-1 rounded-full bg-surface-soft hover:bg-surface-elevated border border-hairline text-ink-muted hover:text-ink transition text-xs font-mono active:scale-95"
        title="Slippage settings"
      >
        <SlidersHorizontal className="w-3.5 h-3.5" />
        <span>{slippage}%</span>
      </button>

      {isOpen && (
        <div className="absolute right-0 mt-2 w-64 p-4 rounded-xl bg-surface-card border border-hairline shadow-2xl z-30 transition-colors duration-200">
          <div className="flex items-center justify-between mb-3 pb-2 border-b border-hairline">
            <span className="text-xs font-mono font-semibold text-ink">
              Slippage Tolerance
            </span>
            <button
              onClick={() => {
                triggerFeedback();
                setIsOpen(false);
              }}
              className="text-ink-muted hover:text-ink text-xs font-mono"
            >
              done
            </button>
          </div>

          <div className="flex items-center space-x-2 mb-3">
            {presets.map((preset) => (
              <button
                key={preset}
                onClick={() => {
                  triggerFeedback();
                  onSlippageChange(preset);
                  setCustomValue("");
                }}
                className={`flex-1 py-1.5 rounded-full text-xs font-mono transition border active:scale-95 ${
                  slippage === preset && !customValue
                    ? "bg-ink text-canvas font-semibold border-ink"
                    : "bg-surface-soft text-ink-muted hover:text-ink border-hairline"
                }`}
              >
                {preset}%
              </button>
            ))}
          </div>

          <div className="flex items-center space-x-2">
            <div className="relative flex-1">
              <input
                type="number"
                step="0.1"
                placeholder="Custom"
                value={customValue}
                onChange={(e) => handleCustomChange(e.target.value)}
                className="w-full bg-surface-soft border border-hairline focus:border-hairline-strong text-ink text-xs font-mono px-3 py-1.5 rounded-full placeholder:text-ink-faint focus:outline-none"
              />
              <span className="absolute right-3 top-1/2 -translate-y-1/2 text-ink-muted text-xs font-mono">
                %
              </span>
            </div>
          </div>

          {slippage > 3 && (
            <p className="mt-2 text-[11px] font-mono text-terminal-yellow">
              Warning: High slippage may result in unfavorable rates.
            </p>
          )}
        </div>
      )}
    </div>
  );
}
