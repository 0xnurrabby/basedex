import type { Address } from "viem";

export const BASE_CHAIN_ID = 8453 as const;

export const AERODROME_FACTORY: Address = "0x420DD381b31aEf6683db6B902084cB0FFECe40Da";
export const AERODROME_ROUTER: Address = "0xcF77a3Ba9A5CA399B7c97c74d54e5b1Beb874E43";

export const WETH_BASE: Address = "0x4200000000000000000000000000000000000006";

export const BASE_BUILDER_CODE = "bc_lvmj6y65";

export const BASESCAN_URL = "https://basescan.org";
export const BASE_RPC_URL = "https://mainnet.base.org";
export const USDC_BASE: Address = "0x833589fCD6eDb6E08f4c7C32D4f71b54bdA02913";

export const BASE_RPC_URLS = [
  "https://base-rpc.publicnode.com",
  "https://base.llamarpc.com",
  "https://1rpc.io/base",
  "https://mainnet.base.org",
] as const;

