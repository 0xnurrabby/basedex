import { http, createConfig } from "wagmi";
import { base, mainnet } from "wagmi/chains";
import { injected } from "wagmi/connectors";
import { Attribution } from "ox/erc8021";
import { BASE_BUILDER_CODE, BASE_RPC_URL } from "../constants/contracts";

export const BUILDER_DATA_SUFFIX = Attribution.toDataSuffix({
  codes: [BASE_BUILDER_CODE],
});

export const config = createConfig({
  chains: [base, mainnet],
  connectors: [
    injected({
      target: "metaMask",
    }),
    injected({
      target: "coinbaseWallet",
    }),
    injected(),
  ],
  transports: {
    [base.id]: http(BASE_RPC_URL),
    [mainnet.id]: http(),
  },
  dataSuffix: BUILDER_DATA_SUFFIX,
});

declare module "wagmi" {
  interface Register {
    config: typeof config;
  }
}
