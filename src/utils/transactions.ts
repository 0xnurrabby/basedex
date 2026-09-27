export interface SwapRecordPayload {
  txHash: string;
  userAddress: string;
  tokenInSymbol: string;
  tokenInAddress: string;
  tokenInAmount: string;
  tokenInUsd?: number;
  tokenOutSymbol: string;
  tokenOutAddress: string;
  tokenOutAmount: string;
  tokenOutUsd?: number;
  timestamp: number;
}

export async function recordSwapTransaction(payload: SwapRecordPayload) {
  try {
    if (typeof window !== "undefined") {
      const LOCAL_STORAGE_KEY = "basedex_recent_txs";
      const raw = localStorage.getItem(LOCAL_STORAGE_KEY);
      const existing = raw ? JSON.parse(raw) : [];
      const updated = [
        payload,
        ...existing.filter((item: any) => item.txHash !== payload.txHash),
      ].slice(0, 30);
      localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(updated));
    }
  } catch (err) {
    console.warn("Local storage cache failed", err);
  }

  try {
    await fetch("/api/transactions", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });
  } catch (err) {
    console.warn("Failed to record swap transaction", err);
  }
}
