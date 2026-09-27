import type { Address } from "viem";
import { WETH_BASE } from "./contracts";

export interface Token {
  address: Address;
  symbol: string;
  name: string;
  decimals: number;
  isNative?: boolean;
  isCustom?: boolean;
  logoURI?: string;
}

export const NATIVE_ETH: Token = {
  address: "0x0000000000000000000000000000000000000000",
  symbol: "ETH",
  name: "Ethereum",
  decimals: 18,
  isNative: true,
  logoURI: "https://assets.coingecko.com/coins/images/279/small/ethereum.png",
};

export const DEFAULT_TOKENS: Token[] = [
  NATIVE_ETH,
  {
    address: WETH_BASE,
    symbol: "WETH",
    name: "Wrapped Ether",
    decimals: 18,
    logoURI: "https://assets.coingecko.com/coins/images/2518/small/weth.png",
  },
  {
    address: "0x833589fCD6eDb6E08f4c7C32D4f71b54bdA02913",
    symbol: "USDC",
    name: "USD Coin",
    decimals: 6,
    logoURI: "https://assets.coingecko.com/coins/images/6319/small/usdc.png",
  },
  {
    address: "0x940181a94A35A4569E4529A3CDfB74e38FD98631",
    symbol: "AERO",
    name: "Aerodrome Finance",
    decimals: 18,
    logoURI: "https://assets.coingecko.com/coins/images/31745/small/aerodrome.png",
  },
  {
    address: "0xcbB7C0000aB88B473b1f5aFd9ef808440eed33Bf",
    symbol: "cbBTC",
    name: "Coinbase Wrapped BTC",
    decimals: 8,
    logoURI: "https://assets.coingecko.com/coins/images/39947/small/cbbtc.webp",
  },
  {
    address: "0x0b3e328455c4059EEb9e3f84b5543F74E24e7E1b",
    symbol: "VIRTUAL",
    name: "Virtual Protocol",
    decimals: 18,
    logoURI: "https://assets.coingecko.com/coins/images/33452/small/virtual.png",
  },
];
