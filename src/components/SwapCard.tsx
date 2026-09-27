"use client";

import React, { useState, useEffect } from "react";
import { formatUnits } from "viem";
import {
  useAccount,
  useBalance,
  useReadContract,
  useSwitchChain,
  useConnect,
} from "wagmi";
import {
  ArrowUpDown,
  ChevronDown,
  Loader2,
  ExternalLink,
  CheckCircle2,
  AlertTriangle,
  Terminal,
} from "lucide-react";
import { BASE_CHAIN_ID, BASESCAN_URL } from "../constants/contracts";
import { DEFAULT_TOKENS, Token } from "../constants/tokens";
import { ERC20_ABI } from "../constants/abis";
import { useTokenList } from "../hooks/useTokenList";
import { useAerodromeQuote } from "../hooks/useAerodromeQuote";
import { useTokenApproval } from "../hooks/useTokenApproval";
import { useSwapExecution } from "../hooks/useSwapExecution";
import { useTokenPrices } from "../hooks/useTokenPrices";
import { formatTokenBalance, formatUsdValue } from "../utils/formatters";
import { TokenSelectModal } from "./TokenSelectModal";
import { SlippageSettings } from "./SlippageSettings";

export function SwapCard() {
  const { address: userAddress, isConnected, chain } = useAccount();
  const { switchChain, switchChainAsync, isPending: isSwitchingChain } = useSwitchChain();
  const { connectors, connect } = useConnect();

  const isWrongNetwork = isConnected && chain?.id !== BASE_CHAIN_ID;

  const { tokens, customTokens, importToken, removeCustomToken } = useTokenList();
  const { getPrice } = useTokenPrices(tokens);

  const [tokenIn, setTokenIn] = useState<Token>(DEFAULT_TOKENS[0]);
  const [tokenOut, setTokenOut] = useState<Token>(DEFAULT_TOKENS[2]);

  const [amountIn, setAmountIn] = useState<string>("");
  const [slippage, setSlippage] = useState<number>(0.5);
  const [modalTarget, setModalTarget] = useState<"in" | "out" | null>(null);

  const priceIn = getPrice(tokenIn.isNative ? "0x0000000000000000000000000000000000000000" : tokenIn.address);
  const priceOut = getPrice(tokenOut.isNative ? "0x0000000000000000000000000000000000000000" : tokenOut.address);

  const { data: ethBalance, refetch: refetchEth } = useBalance({
    address: userAddress,
    chainId: BASE_CHAIN_ID,
  });

  const { data: erc20BalanceInRaw, refetch: refetchErc20In } = useReadContract({
    address: tokenIn.isNative ? undefined : tokenIn.address,
    abi: ERC20_ABI,
    functionName: "balanceOf",
    args: userAddress ? [userAddress] : undefined,
    chainId: BASE_CHAIN_ID,
    query: { enabled: Boolean(userAddress && !tokenIn.isNative) },
  });

  const { data: erc20BalanceOutRaw, refetch: refetchErc20Out } = useReadContract({
    address: tokenOut.isNative ? undefined : tokenOut.address,
    abi: ERC20_ABI,
    functionName: "balanceOf",
    args: userAddress ? [userAddress] : undefined,
    chainId: BASE_CHAIN_ID,
    query: { enabled: Boolean(userAddress && !tokenOut.isNative) },
  });

  const refetchBalances = () => {
    refetchEth();
    if (!tokenIn.isNative) refetchErc20In();
    if (!tokenOut.isNative) refetchErc20Out();
  };

  const balanceIn = tokenIn.isNative
    ? ethBalance?.value !== undefined
      ? formatUnits(ethBalance.value, ethBalance.decimals)
      : "0"
    : erc20BalanceInRaw !== undefined
    ? formatUnits(erc20BalanceInRaw as bigint, tokenIn.decimals)
    : "0";

  const balanceOut = tokenOut.isNative
    ? ethBalance?.value !== undefined
      ? formatUnits(ethBalance.value, ethBalance.decimals)
      : "0"
    : erc20BalanceOutRaw !== undefined
    ? formatUnits(erc20BalanceOutRaw as bigint, tokenOut.decimals)
    : "0";

  const { quote, isLoading: isQuoteLoading, error: quoteError } = useAerodromeQuote(
    tokenIn,
    tokenOut,
    amountIn,
    slippage
  );

  const {
    isApproved,
    isApproving,
    approve,
    resetApprovalState,
    approveTxHash,
    error: approveError,
  } = useTokenApproval(tokenIn, amountIn);

  const {
    executeSwap,
    txHash: swapTxHash,
    isPending: isSwapPending,
    isConfirming: isSwapConfirming,
    isSuccess: isSwapSuccess,
    error: swapError,
    reset: resetSwap,
  } = useSwapExecution();

  useEffect(() => {
    if (isSwapSuccess) {
      refetchBalances();
      setAmountIn("");
    }
  }, [isSwapSuccess]);

  const handleMax = () => {
    if (!balanceIn || Number(balanceIn) <= 0) return;
    if (tokenIn.isNative) {
      const num = parseFloat(balanceIn);
      if (num <= 0.0001) {
        const maxVal = num * 0.9;
        setAmountIn(maxVal > 0 ? maxVal.toFixed(8) : "0");
      } else {
        const maxVal = Math.max(0, num - 0.00005);
        setAmountIn(maxVal.toFixed(6));
      }
    } else {
      setAmountIn(balanceIn);
    }
  };

  const handleSwitchTokens = () => {
    const temp = tokenIn;
    setTokenIn(tokenOut);
    setTokenOut(temp);
    setAmountIn("");
    resetSwap();
  };

  const hasInsufficientBalance =
    Boolean(userAddress) &&
    Boolean(amountIn) &&
    Number(amountIn) > Number(balanceIn);

  let actionLabel = "Swap";
  let isActionDisabled = false;

  if (!isConnected) {
    actionLabel = "Connect Wallet";
  } else if (isWrongNetwork) {
    actionLabel = isSwitchingChain ? "Switching to Base..." : "Switch Network to Base (8453)";
  } else if (!amountIn || Number(amountIn) <= 0) {
    actionLabel = "Enter an amount";
    isActionDisabled = true;
  } else if (hasInsufficientBalance) {
    actionLabel = `Insufficient ${tokenIn.symbol} balance`;
    isActionDisabled = true;
  } else if (isQuoteLoading) {
    actionLabel = "Fetching best Aerodrome route...";
    isActionDisabled = true;
  } else if (quoteError) {
    actionLabel = "Insufficient Liquidity on Aerodrome";
    isActionDisabled = true;
  } else if (!isApproved && !tokenIn.isNative) {
    actionLabel = isApproving ? `Approving ${tokenIn.symbol}...` : `Approve ${tokenIn.symbol}`;
  } else if (isSwapPending || isSwapConfirming) {
    actionLabel = isSwapConfirming ? "Confirming on Base..." : "Executing Swap...";
    isActionDisabled = true;
  } else if (quote?.isWrap) {
    actionLabel = "Wrap ETH to WETH";
  } else if (quote?.isUnwrap) {
    actionLabel = "Unwrap WETH to ETH";
  } else {
    actionLabel = `Swap ${tokenIn.symbol} for ${tokenOut.symbol}`;
  }

  const handleAction = async () => {
    if (!isConnected) {
      if (connectors[0]) connect({ connector: connectors[0] });
      return;
    }
    if (isWrongNetwork || (chain?.id && chain.id !== BASE_CHAIN_ID)) {
      try {
        await switchChainAsync({ chainId: BASE_CHAIN_ID });
        return;
      } catch (err) {
        console.warn("Chain switch rejected or cancelled", err);
        return;
      }
    }
    if (!isApproved && !tokenIn.isNative) {
      await approve();
      return;
    }
    if (quote) {
      await executeSwap(tokenIn, tokenOut, amountIn, quote);
    }
  };

  return (
    <div className="w-full max-w-lg mx-auto">
      <div className="rounded-xl bg-surface-card border border-hairline p-5 shadow-2xl relative transition-colors duration-200">
        <div className="flex items-center justify-between pb-4 border-b border-hairline mb-4">
          <div className="flex items-center space-x-2">
            <div className="flex items-center space-x-1.5">
              <span className="w-3 h-3 rounded-full bg-terminal-red" />
              <span className="w-3 h-3 rounded-full bg-terminal-yellow" />
              <span className="w-3 h-3 rounded-full bg-terminal-green" />
            </div>
            <span className="text-xs font-mono text-ink-muted ml-2">
              terminal://swap
            </span>
          </div>

          <div className="flex items-center space-x-2">
            <SlippageSettings
              slippage={slippage}
              onSlippageChange={setSlippage}
            />
          </div>
        </div>

        <div className="p-4 rounded-xl bg-surface-soft border border-hairline transition focus-within:border-hairline-strong mb-2">
          <div className="flex items-center justify-between text-xs font-mono text-ink-muted mb-2">
            <span>YOU PAY</span>
            <div className="flex items-center space-x-1.5">
              <span>
                Balance:{" "}
                <span className="text-ink font-medium">
                  {formatTokenBalance(balanceIn)}
                </span>
                {Number(balanceIn) > 0 && priceIn > 0 && (
                  <span className="text-ink-muted ml-1">
                    (~{formatUsdValue(parseFloat(balanceIn), priceIn)})
                  </span>
                )}
              </span>
              {isConnected && Number(balanceIn) > 0 && (
                <button
                  onClick={handleMax}
                  className="px-2 py-0.5 rounded-full bg-surface-card border border-hairline text-ink hover:border-hairline-strong transition text-[10px] font-mono"
                >
                  MAX
                </button>
              )}
            </div>
          </div>

          <div className="flex items-center justify-between space-x-3">
            <div className="w-full">
              <input
                type="number"
                inputMode="decimal"
                placeholder="0.0"
                value={amountIn}
                onChange={(e) => {
                  setAmountIn(e.target.value);
                  resetSwap();
                }}
                className="w-full bg-transparent text-2xl font-mono text-ink placeholder:text-ink-faint focus:outline-none"
              />
              {amountIn && Number(amountIn) > 0 && priceIn > 0 && (
                <div className="text-[11px] font-mono text-ink-muted mt-0.5">
                  ≈ {formatUsdValue(parseFloat(amountIn), priceIn)}
                </div>
              )}
            </div>

            <button
              onClick={() => setModalTarget("in")}
              className="flex items-center space-x-2 px-3.5 py-2 rounded-full bg-surface-card hover:bg-surface-elevated border border-hairline text-ink transition shrink-0"
            >
              {tokenIn.logoURI ? (
                <img
                  src={tokenIn.logoURI}
                  alt={tokenIn.symbol}
                  className="w-5 h-5 rounded-full bg-surface-soft"
                />
              ) : (
                <div className="w-5 h-5 rounded-full bg-surface-soft border border-hairline flex items-center justify-center text-[10px] font-mono font-bold text-ink">
                  {tokenIn.symbol.slice(0, 2)}
                </div>
              )}
              <span className="text-xs font-semibold">{tokenIn.symbol}</span>
              <ChevronDown className="w-3.5 h-3.5 text-ink-muted" />
            </button>
          </div>
        </div>

        <div className="flex justify-center -my-3 z-10 relative">
          <button
            onClick={handleSwitchTokens}
            className="w-8 h-8 rounded-full bg-surface-card hover:bg-surface-elevated border border-hairline hover:border-hairline-strong flex items-center justify-center text-ink-muted hover:text-ink transition shadow-lg active:scale-95"
            title="Invert tokens"
          >
            <ArrowUpDown className="w-4 h-4" />
          </button>
        </div>

        <div className="p-4 rounded-xl bg-surface-soft border border-hairline transition mb-4">
          <div className="flex items-center justify-between text-xs font-mono text-ink-muted mb-2">
            <span>YOU RECEIVE</span>
            <div className="flex items-center space-x-1.5">
              <span>
                Balance:{" "}
                <span className="text-ink font-medium">
                  {formatTokenBalance(balanceOut)}
                </span>
                {Number(balanceOut) > 0 && priceOut > 0 && (
                  <span className="text-ink-muted ml-1">
                    (~{formatUsdValue(parseFloat(balanceOut), priceOut)})
                  </span>
                )}
              </span>
            </div>
          </div>

          <div className="flex items-center justify-between space-x-3">
            <div className="w-full">
              <div className="text-2xl font-mono text-ink truncate py-0.5">
                {isQuoteLoading ? (
                  <div className="flex items-center space-x-2 text-ink-muted text-base">
                    <Loader2 className="w-4 h-4 animate-spin text-ink-muted" />
                    <span>Quoting Aerodrome...</span>
                  </div>
                ) : quote ? (
                  formatTokenBalance(quote.amountOut)
                ) : (
                  <span className="text-ink-faint">0.0</span>
                )}
              </div>
              {quote && quote.amountOut && Number(quote.amountOut) > 0 && priceOut > 0 && (
                <div className="text-[11px] font-mono text-ink-muted mt-0.5">
                  ≈ {formatUsdValue(parseFloat(quote.amountOut), priceOut)}
                </div>
              )}
            </div>

            <button
              onClick={() => setModalTarget("out")}
              className="flex items-center space-x-2 px-3.5 py-2 rounded-full bg-surface-card hover:bg-surface-elevated border border-hairline text-ink transition shrink-0"
            >
              {tokenOut.logoURI ? (
                <img
                  src={tokenOut.logoURI}
                  alt={tokenOut.symbol}
                  className="w-5 h-5 rounded-full bg-surface-soft"
                />
              ) : (
                <div className="w-5 h-5 rounded-full bg-surface-soft border border-hairline flex items-center justify-center text-[10px] font-mono font-bold text-ink">
                  {tokenOut.symbol.slice(0, 2)}
                </div>
              )}
              <span className="text-xs font-semibold">{tokenOut.symbol}</span>
              <ChevronDown className="w-3.5 h-3.5 text-ink-muted" />
            </button>
          </div>
        </div>

        {quote && (
          <div className="mb-4 p-3.5 rounded-xl bg-surface-soft border border-hairline font-mono text-xs space-y-2">
            <div className="flex items-center justify-between text-ink-muted">
              <span>Rate</span>
              <span className="text-ink">
                1 {tokenIn.symbol} ≈ {quote.executionPrice} {tokenOut.symbol}
              </span>
            </div>

            <div className="flex items-center justify-between text-ink-muted">
              <span>Guaranteed Min ({100 - slippage}%)</span>
              <span className="text-ink">
                {Number(quote.amountOutMinFormatted).toLocaleString(undefined, {
                  maximumFractionDigits: 6,
                })}{" "}
                {tokenOut.symbol}
              </span>
            </div>

            <div className="flex items-center justify-between text-ink-muted">
              <span>Routing Protocol</span>
              <span className="text-terminal-green flex items-center gap-1">
                <CheckCircle2 className="w-3 h-3" />
                <span>
                  Aerodrome On-Chain (
                  {quote.isWrapOrUnwrap
                    ? "WETH Wrap"
                    : quote.routePath.join(" → ")})
                </span>
              </span>
            </div>
          </div>
        )}

        {isWrongNetwork && (
          <div className="mb-4 p-3.5 rounded-xl bg-surface-soft border border-terminal-yellow/50 text-xs font-mono flex items-center justify-between">
            <div className="flex items-center space-x-2 text-ink-muted">
              <span className="w-2 h-2 rounded-full bg-terminal-yellow animate-ping shrink-0" />
              <span>
                Wallet on {chain?.name ? chain.name : "Wrong Network"}. Swaps occur on Base.
              </span>
            </div>
            <button
              onClick={() => switchChain({ chainId: BASE_CHAIN_ID })}
              disabled={isSwitchingChain}
              className="px-3.5 py-1.5 rounded-full bg-ink text-canvas font-semibold text-[11px] hover:opacity-90 transition shadow shrink-0 active:scale-95"
            >
              {isSwitchingChain ? "Switching..." : "Switch to Base"}
            </button>
          </div>
        )}

        {(quoteError || approveError || swapError) && (
          <div className="mb-4 p-3 rounded-xl bg-surface-soft border border-terminal-red/40 text-terminal-red text-xs font-mono flex items-start space-x-2">
            <AlertTriangle className="w-4 h-4 shrink-0 mt-0.5" />
            <div className="flex-1 truncate">
              {quoteError ||
                (typeof approveError === "string"
                  ? approveError.includes("does not match the target chain")
                    ? "Wallet is on a different chain. Please switch to Base Network."
                    : approveError
                  : (approveError as any)?.message?.includes("does not match the target chain")
                  ? "Wallet is on a different chain. Please switch to Base Network."
                  : (approveError as any)?.message?.slice(0, 120)) ||
                (typeof swapError === "string"
                  ? swapError.includes("does not match the target chain")
                    ? "Wallet is on a different chain. Please switch to Base Network."
                    : swapError
                  : (swapError as any)?.message?.includes("does not match the target chain")
                  ? "Wallet is on a different chain. Please switch to Base Network."
                  : (swapError as any)?.message?.slice(0, 120))}
            </div>
            <button
              onClick={() => {
                resetApprovalState();
                resetSwap();
              }}
              className="text-ink hover:underline text-[10px] shrink-0 font-mono ml-2"
            >
              Clear
            </button>
          </div>
        )}

        <button
          onClick={handleAction}
          disabled={isActionDisabled}
          className={`w-full py-3.5 rounded-full font-semibold text-xs transition tracking-wide flex items-center justify-center space-x-2 shadow-sm font-sans ${
            isActionDisabled
              ? "bg-surface-soft text-ink-faint border border-hairline cursor-not-allowed"
              : "bg-ink text-canvas hover:opacity-90 active:scale-[0.99] cursor-pointer"
          }`}
        >
          {(isApproving || isSwapPending || isSwapConfirming) && (
            <Loader2 className="w-4 h-4 animate-spin" />
          )}
          <span>{actionLabel}</span>
        </button>

        {isApproving && (
          <div className="mt-2.5 flex items-center justify-between px-2 text-[11px] font-mono text-ink-muted">
            <span className="flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-terminal-yellow animate-ping" />
              <span>Confirming on Base (blocks take ~2s)...</span>
            </span>
            <button
              onClick={resetApprovalState}
              className="text-ink hover:underline"
            >
              Reset / Force check
            </button>
          </div>
        )}

        {(swapTxHash || approveTxHash) && (
          <div className="mt-4 p-3 rounded-xl bg-surface-soft border border-hairline font-mono text-[11px] space-y-1.5">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-1.5 text-ink-muted">
                <Terminal className="w-3.5 h-3.5 text-terminal-green" />
                <span>terminal://tx-status</span>
              </div>
              {isSwapSuccess && (
                <span className="text-terminal-green font-semibold flex items-center gap-1">
                  <CheckCircle2 className="w-3 h-3" />
                  Confirmed
                </span>
              )}
            </div>

            {swapTxHash && (
              <div className="flex items-center justify-between text-ink-muted">
                <span>Swap Hash:</span>
                <a
                  href={`${BASESCAN_URL}/tx/${swapTxHash}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-ink hover:underline flex items-center gap-1"
                >
                  <span>
                    {swapTxHash.slice(0, 8)}...{swapTxHash.slice(-6)}
                  </span>
                  <ExternalLink className="w-3 h-3" />
                </a>
              </div>
            )}

            {approveTxHash && (
              <div className="flex items-center justify-between text-ink-muted">
                <span>Approval Hash:</span>
                <div className="flex items-center gap-2">
                  <a
                    href={`${BASESCAN_URL}/tx/${approveTxHash}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-ink hover:underline flex items-center gap-1"
                  >
                    <span>
                      {approveTxHash.slice(0, 8)}...{approveTxHash.slice(-6)}
                    </span>
                    <ExternalLink className="w-3 h-3" />
                  </a>
                  {!isApproved && (
                    <button
                      onClick={resetApprovalState}
                      className="px-2 py-0.5 rounded-full bg-surface-card border border-hairline text-ink hover:border-hairline-strong text-[10px]"
                    >
                      Re-check
                    </button>
                  )}
                </div>
              </div>
            )}
          </div>
        )}
      </div>

      <TokenSelectModal
        isOpen={modalTarget !== null}
        onClose={() => setModalTarget(null)}
        onSelectToken={(selected) => {
          if (modalTarget === "in") {
            if (selected.address.toLowerCase() === tokenOut.address.toLowerCase()) {
              setTokenOut(tokenIn);
            }
            setTokenIn(selected);
          } else if (modalTarget === "out") {
            if (selected.address.toLowerCase() === tokenIn.address.toLowerCase()) {
              setTokenIn(tokenOut);
            }
            setTokenOut(selected);
          }
          setAmountIn("");
          resetSwap();
        }}
        tokens={tokens}
        customTokens={customTokens}
        onImportToken={importToken}
        onRemoveCustomToken={removeCustomToken}
        selectedToken={modalTarget === "in" ? tokenIn : tokenOut}
      />
    </div>
  );
}
