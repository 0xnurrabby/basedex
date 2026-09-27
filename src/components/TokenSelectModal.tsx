"use client";

import React, { useState } from "react";
import { isAddress, type Address, formatUnits } from "viem";
import { useAccount, useReadContracts, useBalance } from "wagmi";
import { Search, X, AlertCircle, CheckCircle2, Trash2 } from "lucide-react";
import { Token } from "../constants/tokens";
import { useCustomToken } from "../hooks/useCustomToken";
import { ERC20_ABI } from "../constants/abis";
import { BASE_CHAIN_ID } from "../constants/contracts";
import { formatTokenBalance, formatUsdValue } from "../utils/formatters";
import { useTokenPrices } from "../hooks/useTokenPrices";

interface TokenSelectModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSelectToken: (token: Token) => void;
  tokens: Token[];
  customTokens: Token[];
  onImportToken: (token: Token) => void;
  onRemoveCustomToken: (address: Address) => void;
  selectedToken?: Token | null;
}

export function TokenSelectModal({
  isOpen,
  onClose,
  onSelectToken,
  tokens,
  customTokens,
  onImportToken,
  onRemoveCustomToken,
  selectedToken,
}: TokenSelectModalProps) {
  const [search, setSearch] = useState("");
  const { address: userAddress } = useAccount();
  const { getPrice } = useTokenPrices(tokens);

  const isCustomAddress = isAddress(search.trim());
  const {
    token: fetchedCustomToken,
    poolStatus,
    isLoading: isCheckingCustom,
    error: customTokenError,
  } = useCustomToken(isCustomAddress ? search.trim() : "");

  const { data: ethBalance } = useBalance({
    address: userAddress,
    chainId: BASE_CHAIN_ID,
  });

  const nonNativeTokens = tokens.filter((t) => !t.isNative);
  const { data: erc20Balances } = useReadContracts({
    contracts: nonNativeTokens.map((t) => ({
      address: t.address,
      abi: ERC20_ABI,
      functionName: "balanceOf",
      args: userAddress ? [userAddress] : undefined,
      chainId: BASE_CHAIN_ID,
    })),
    query: {
      enabled: Boolean(userAddress && isOpen),
    },
  });

  const balanceMap = new Map<string, string>();
  if (ethBalance && ethBalance.value !== undefined) {
    balanceMap.set(
      "0x0000000000000000000000000000000000000000",
      formatUnits(ethBalance.value, ethBalance.decimals)
    );
  }
  if (erc20Balances) {
    nonNativeTokens.forEach((tok, index) => {
      const res = erc20Balances[index];
      if (res?.result !== undefined) {
        try {
          const raw = res.result as bigint;
          balanceMap.set(tok.address.toLowerCase(), formatUnits(raw, tok.decimals));
        } catch {
          balanceMap.set(tok.address.toLowerCase(), "0");
        }
      }
    });
  }

  if (!isOpen) return null;

  const filteredTokens = tokens.filter((t) => {
    const q = search.toLowerCase().trim();
    if (!q) return true;
    return (
      t.symbol.toLowerCase().includes(q) ||
      t.name.toLowerCase().includes(q) ||
      t.address.toLowerCase() === q
    );
  });

  const isAlreadyImported =
    fetchedCustomToken &&
    tokens.some(
      (t) => t.address.toLowerCase() === fetchedCustomToken.address.toLowerCase()
    );

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-sm">
      <div className="relative w-full max-w-md rounded-xl bg-surface-card border border-hairline p-5 shadow-2xl flex flex-col max-h-[85vh]">
        <div className="flex items-center justify-between pb-3 border-b border-hairline mb-4">
          <div className="flex items-center space-x-2">
            <div className="flex items-center space-x-1.5">
              <span className="w-2.5 h-2.5 rounded-full bg-terminal-red" />
              <span className="w-2.5 h-2.5 rounded-full bg-terminal-yellow" />
              <span className="w-2.5 h-2.5 rounded-full bg-terminal-green" />
            </div>
            <span className="text-xs font-mono text-ink-muted ml-2">
              select://token
            </span>
          </div>
          <button
            onClick={onClose}
            className="text-ink-muted hover:text-white p-1 rounded-md transition"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        <div className="relative mb-4">
          <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-ink-muted" />
          <input
            type="text"
            placeholder="Search name, symbol, or paste contract address"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            autoFocus
            className="w-full bg-surface-soft border border-hairline focus:border-hairline-strong focus:outline-none text-white text-xs font-mono pl-10 pr-4 py-2.5 rounded-full placeholder:text-ink-faint transition"
          />
        </div>

        {isCustomAddress && (
          <div className="mb-4 p-3.5 rounded-xl bg-surface-soft border border-hairline font-mono text-xs">
            {isCheckingCustom ? (
              <div className="flex items-center space-x-2 text-ink-muted py-2">
                <span className="w-2 h-2 rounded-full bg-terminal-yellow animate-ping" />
                <span>Querying token & Aerodrome pool on Base...</span>
              </div>
            ) : customTokenError ? (
              <div className="flex items-start space-x-2 text-terminal-red">
                <AlertCircle className="w-4 h-4 mt-0.5 shrink-0" />
                <div>
                  <p className="font-semibold">Unable to import token</p>
                  <p className="text-[11px] text-ink-muted mt-0.5">{customTokenError}</p>
                </div>
              </div>
            ) : fetchedCustomToken ? (
              <div className="space-y-2.5">
                <div className="flex items-center justify-between">
                  <div>
                    <span className="font-bold text-white text-sm">
                      {fetchedCustomToken.symbol}
                    </span>
                    <span className="text-ink-muted ml-2">
                      ({fetchedCustomToken.name})
                    </span>
                  </div>
                  <span className="text-[10px] px-2 py-0.5 rounded-full bg-surface-card border border-hairline text-ink-muted">
                    {fetchedCustomToken.decimals} decimals
                  </span>
                </div>

                <div className="pt-2 border-t border-hairline/60 flex items-center justify-between text-[11px]">
                  <span className="text-ink-muted">Aerodrome Pool:</span>
                  {poolStatus?.hasPool ? (
                    <span className="flex items-center space-x-1 text-terminal-green">
                      <CheckCircle2 className="w-3.5 h-3.5" />
                      <span>
                        Active ({poolStatus.pairToken} ·{" "}
                        {poolStatus.isStable ? "Stable" : "Volatile"})
                      </span>
                    </span>
                  ) : (
                    <span className="flex items-center space-x-1 text-terminal-yellow">
                      <AlertCircle className="w-3.5 h-3.5" />
                      <span>No active pool found</span>
                    </span>
                  )}
                </div>

                <div className="pt-1">
                  {isAlreadyImported ? (
                    <button
                      onClick={() => {
                        onSelectToken(fetchedCustomToken);
                        onClose();
                      }}
                      className="w-full py-2 rounded-full bg-white text-black font-semibold text-xs transition hover:bg-ink-deep"
                    >
                      Already in list · Select {fetchedCustomToken.symbol}
                    </button>
                  ) : (
                    <button
                      onClick={() => {
                        onImportToken(fetchedCustomToken);
                        onSelectToken(fetchedCustomToken);
                        onClose();
                      }}
                      className="w-full py-2 rounded-full bg-white text-black font-semibold text-xs transition hover:bg-ink-deep shadow-sm"
                    >
                      Import & Select {fetchedCustomToken.symbol}
                    </button>
                  )}
                </div>
              </div>
            ) : null}
          </div>
        )}

        <div className="flex-1 overflow-y-auto space-y-1 pr-1">
          <div className="text-[11px] font-mono text-ink-faint px-3 py-1">
            AVAILABLE TOKENS ({filteredTokens.length})
          </div>

          {filteredTokens.length === 0 && !isCustomAddress ? (
            <div className="text-center py-8 text-xs font-mono text-ink-muted">
              No tokens found. Paste a contract address above to import.
            </div>
          ) : (
            filteredTokens.map((tok) => {
              const isSelected =
                selectedToken?.address.toLowerCase() === tok.address.toLowerCase();
              const balance = balanceMap.get(tok.address.toLowerCase());

              return (
                <div
                  key={tok.address}
                  className={`group flex items-center justify-between p-3 rounded-xl hover:bg-surface-soft transition cursor-pointer border ${
                    isSelected
                      ? "border-hairline-strong bg-surface-soft/60"
                      : "border-transparent"
                  }`}
                  onClick={() => {
                    onSelectToken(tok);
                    onClose();
                  }}
                >
                  <div className="flex items-center space-x-3 min-w-0">
                    {tok.logoURI ? (
                      <img
                        src={tok.logoURI}
                        alt={tok.symbol}
                        className="w-7 h-7 rounded-full bg-surface-soft shrink-0"
                      />
                    ) : (
                      <div className="w-7 h-7 rounded-full bg-surface-elevated border border-hairline flex items-center justify-center text-xs font-mono font-bold text-white shrink-0">
                        {tok.symbol.slice(0, 2)}
                      </div>
                    )}

                    <div className="min-w-0">
                      <div className="flex items-center space-x-1.5">
                        <span className="font-semibold text-xs text-white">
                          {tok.symbol}
                        </span>
                        {tok.isCustom && (
                          <span className="text-[9px] font-mono px-1.5 py-0.2 rounded-full bg-surface-dark border border-hairline text-terminal-yellow">
                            custom
                          </span>
                        )}
                      </div>
                      <div className="text-[11px] font-mono text-ink-muted truncate">
                        {tok.name}
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center space-x-2 shrink-0">
                    <div className="text-right">
                      <div className="text-xs font-mono text-white">
                        {balance !== undefined ? formatTokenBalance(balance) : "-"}
                      </div>
                      <div className="text-[10px] font-mono text-ink-faint">
                        {balance !== undefined && Number(balance) > 0 ? (
                          <span>
                            {formatUsdValue(
                              parseFloat(balance),
                              getPrice(
                                tok.isNative
                                  ? "0x0000000000000000000000000000000000000000"
                                  : tok.address
                              )
                            )}
                          </span>
                        ) : (
                          "balance"
                        )}
                      </div>
                    </div>

                    {tok.isCustom && (
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          onRemoveCustomToken(tok.address);
                        }}
                        title="Remove imported token"
                        className="opacity-0 group-hover:opacity-100 p-1 text-ink-faint hover:text-terminal-red transition"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    )}
                  </div>
                </div>
              );
            })
          )}
        </div>

        <div className="mt-4 pt-3 border-t border-hairline flex items-center justify-between text-[11px] font-mono text-ink-faint">
          <span>Base Dex Terminal</span>
          <span>Aerodrome On-Chain Routing</span>
        </div>
      </div>
    </div>
  );
}
