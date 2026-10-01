export function formatTokenBalance(
  balanceStr: string | number | undefined | null,
  options?: { fullPrecision?: boolean }
): string {
  if (balanceStr === undefined || balanceStr === null) return "0";
  const num = typeof balanceStr === "string" ? parseFloat(balanceStr) : balanceStr;
  if (!num || isNaN(num) || num <= 0) return "0";

  if (options?.fullPrecision) {
    return num.toString();
  }

  if (num >= 1_000_000_000_000) {
    return (
      (num / 1_000_000_000_000).toLocaleString(undefined, {
        maximumFractionDigits: 3,
      }) + "T"
    );
  }
  if (num >= 1_000_000_000) {
    return (
      (num / 1_000_000_000).toLocaleString(undefined, {
        maximumFractionDigits: 3,
      }) + "B"
    );
  }
  if (num >= 1_000_000) {
    return (
      (num / 1_000_000).toLocaleString(undefined, {
        maximumFractionDigits: 3,
      }) + "M"
    );
  }
  if (num >= 10_000) {
    return num.toLocaleString(undefined, {
      maximumFractionDigits: 2,
    });
  }
  if (num >= 1) {
    return num.toLocaleString(undefined, {
      maximumFractionDigits: 4,
    });
  }
  if (num >= 0.0001) {
    return num.toLocaleString(undefined, {
      maximumFractionDigits: 6,
    });
  }

  const fixed = num.toFixed(8).replace(/\.?0+$/, "");
  return fixed === "0" ? "<0.00000001" : fixed;
}

export function formatUsdValue(
  amountNum: number | undefined | null,
  priceUsd: number | undefined | null
): string {
  if (
    amountNum === undefined ||
    amountNum === null ||
    priceUsd === undefined ||
    priceUsd === null ||
    amountNum <= 0 ||
    priceUsd <= 0
  ) {
    return "$0.00";
  }

  const val = amountNum * priceUsd;

  if (val >= 1_000_000_000) {
    return "$" + (val / 1_000_000_000).toFixed(2) + "B";
  }
  if (val >= 1_000_000) {
    return "$" + (val / 1_000_000).toFixed(2) + "M";
  }
  if (val >= 1) {
    return (
      "$" +
      val.toLocaleString(undefined, {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2,
      })
    );
  }
  if (val >= 0.01) {
    return "$" + val.toFixed(2);
  }
  if (val >= 0.0001) {
    return "$" + val.toFixed(4);
  }
  if (val >= 0.000001) {
    return "$" + val.toFixed(6);
  }
  if (val >= 0.00000001) {
    return "$" + val.toFixed(8);
  }
  return "$" + val.toFixed(10).replace(/\.?0+$/, "");
}
