import "@nomicfoundation/hardhat-toolbox";
import "dotenv/config";
import type { HardhatUserConfig } from "hardhat/config";

const config: HardhatUserConfig = {
  solidity: "0.8.24",
  networks: {
    botchainTestnet: {
      url: process.env.BOTCHAIN_RPC_URL || "https://rpc.bohr.life",
      chainId: 968,
      accounts: process.env.DEPLOYER_PRIVATE_KEY ? [process.env.DEPLOYER_PRIVATE_KEY] : [],
    },
    botchain: {
      url: process.env.BOTCHAIN_MAINNET_RPC_URL || "https://rpc.botchain.ai",
      chainId: 677,
      accounts: process.env.DEPLOYER_PRIVATE_KEY ? [process.env.DEPLOYER_PRIVATE_KEY] : [],
    },
  },
  etherscan: {
    apiKey: { botchainTestnet: process.env.BOTCHAIN_VERIFIER_API_KEY || "blockscout" },
    customChains: [{
      network: "botchainTestnet",
      chainId: 968,
      urls: { apiURL: process.env.BOTCHAIN_VERIFIER_URL || "https://scan.bohr.life/api", browserURL: "https://scan.bohr.life" },
    }],
  },
};

export default config;
