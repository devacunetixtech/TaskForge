import { createConfig, http } from "wagmi";
import { injected } from "wagmi/connectors";
import { defineChain } from "viem";

export const botchainTestnet = defineChain({
  id: 968,
  name: "BOT Chain Testnet",
  nativeCurrency: { name: "BOT", symbol: "BOT", decimals: 18 },
  rpcUrls: { default: { http: ["https://rpc.bohr.life"] } },
  blockExplorers: { default: { name: "BOT Scan", url: "https://scan.bohr.life" } },
});

export const wagmiConfig = createConfig({
  chains: [botchainTestnet],
  connectors: [injected()],
  transports: { [botchainTestnet.id]: http() },
});
