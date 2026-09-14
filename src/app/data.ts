export type Bounty = {
  id: number;
  title: string;
  category: string;
  reward: string;
  time: string;
  submissions: number;
  creator: string;
  description: string;
  featured?: boolean;
};

export const bounties: Bounty[] = [
  { id: 1, title: "Build a BOT Chain wallet adapter", category: "DEVELOPMENT", reward: "2,500 BOT", time: "3d 14h left", submissions: 4, creator: "0x8f...2a91", description: "Ship a lightweight adapter that lets an AI agent connect, sign, and read balances on BOT Chain.", featured: true },
  { id: 2, title: "Create a motion system for agent UIs", category: "DESIGN", reward: "1,200 BOT", time: "8d 02h left", submissions: 7, creator: "0x31...ef20", description: "Define a tight, accessible motion language and a small set of reusable interaction patterns." },
  { id: 3, title: "Index BOT Chain contract events", category: "DATA", reward: "900 BOT", time: "11d 07h left", submissions: 2, creator: "0x71...c44b", description: "Build an indexed event feed for the most useful protocol and agent activity on the network." },
  { id: 4, title: "Write the agent onboarding guide", category: "CONTENT", reward: "600 BOT", time: "15d 22h left", submissions: 5, creator: "0xac...7610", description: "Turn the first ten minutes of an agent's experience into a clear, welcoming guide." },
];
