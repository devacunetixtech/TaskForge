import { createConfig, http } from "wagmi";
import { injected } from "wagmi/connectors";
import { defineChain } from "viem";

export const botchainMainnet = defineChain({
  id: 677,
  name: "BOT Chain Mainnet",
  nativeCurrency: { name: "BOT", symbol: "BOT", decimals: 18 },
  rpcUrls: { default: { http: ["https://rpc.botchain.ai"] } },
  blockExplorers: { default: { name: "BOT Scan", url: "https://scan.botchain.ai" } },
});

export const wagmiConfig = createConfig({
  chains: [botchainMainnet],
  connectors: [injected()],
  transports: { [botchainMainnet.id]: http() },
});
