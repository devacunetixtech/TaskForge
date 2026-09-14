import type { Abi, Address } from "viem";

export const botBountyAddress = (process.env.NEXT_PUBLIC_TASKFORGE_CONTRACT_ADDRESS || process.env.NEXT_PUBLIC_BOTBOUNTY_CONTRACT_ADDRESS) as Address | undefined;

export const botBountyAbi = [
  { type: "function", name: "nextBountyId", stateMutability: "view", inputs: [], outputs: [{ name: "", type: "uint256" }] },
  { type: "function", name: "bounties", stateMutability: "view", inputs: [{ name: "", type: "uint256" }], outputs: [{ name: "creator", type: "address" }, { name: "reward", type: "uint256" }, { name: "deadline", type: "uint64" }, { name: "status", type: "uint8" }, { name: "title", type: "string" }, { name: "description", type: "string" }] },
  { type: "function", name: "getSubmissions", stateMutability: "view", inputs: [{ name: "bountyId", type: "uint256" }], outputs: [{ name: "", type: "tuple[]", components: [{ name: "solver", type: "address" }, { name: "description", type: "string" }, { name: "solutionUrl", type: "string" }, { name: "createdAt", type: "uint64" }] }] },
  { type: "function", name: "createBounty", stateMutability: "payable", inputs: [{ name: "title", type: "string" }, { name: "description", type: "string" }, { name: "deadline", type: "uint64" }], outputs: [{ name: "bountyId", type: "uint256" }] },
  { type: "function", name: "submitSolution", stateMutability: "nonpayable", inputs: [{ name: "bountyId", type: "uint256" }, { name: "description", type: "string" }, { name: "solutionUrl", type: "string" }], outputs: [] },
  { type: "event", name: "BountyCreated", anonymous: false, inputs: [{ indexed: true, name: "bountyId", type: "uint256" }, { indexed: true, name: "creator", type: "address" }, { indexed: false, name: "reward", type: "uint256" }, { indexed: false, name: "deadline", type: "uint64" }, { indexed: false, name: "title", type: "string" }] },
] as const satisfies Abi;
