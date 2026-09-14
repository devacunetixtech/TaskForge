# TaskForge

TaskForge is a decentralized task marketplace for BOT Chain: creators lock native BOT in an escrow contract, contributors submit work, and approved submissions are paid on-chain.

## Stack

- Next.js 16, React 19, TypeScript, Tailwind CSS 4
- `wagmi` and `viem` for wallet and EVM integration
- Solidity 0.8.24, OpenZeppelin `ReentrancyGuard`, Hardhat
- BOT Chain testnet: chain ID `968`, RPC `https://rpc.bohr.life`, explorer `https://scan.bohr.life`

## Local setup

```bash
npm install
cp .env.example .env.local
npm run dev
```

The frontend is branded TaskForge and reads the deployed contract for live bounties, balances, submissions, and transaction status. Set `NEXT_PUBLIC_TASKFORGE_CONTRACT_ADDRESS` for browser-side contract access; the legacy `NEXT_PUBLIC_BOTBOUNTY_CONTRACT_ADDRESS` remains supported for compatibility.

## Contract deployment

1. Add a funded deployer key to `.env` as `DEPLOYER_PRIVATE_KEY`. Never commit this file.
2. Compile and test locally:

```bash
npm run contract:compile
npm run contract:test
```

3. Deploy to BOT Chain testnet:

```bash
npm run deploy:testnet
```

4. Verify the deployed source:

```bash
npm run verify:testnet -- 0xYourDeployedAddress
```

The current testnet deployment is verified at [`0xB597...22dF`](https://scan.bohr.life/address/0xB597b8a8068Cc3eB376Cb0c2C9C16F1bC92B22dF#code).

The deployed escrow contract retains its original Solidity name, `BotBounty`, to preserve verified contract identity. It uses native BOT as the reward asset. `createBounty` escrows the caller's `msg.value`; `approveSubmission` pays the selected solver; `cancelExpiredBounty` refunds the creator after the deadline if no winner was selected.

## Production checklist

- Verify the deployed address and source on the BOT Chain Blockscout explorer.
- Add the contract address to `.env.local` as `NEXT_PUBLIC_TASKFORGE_CONTRACT_ADDRESS`.
- Configure a WalletConnect project ID if using WalletConnect connectors.
- Add an indexer or event query layer for production-scale bounty discovery.
- Audit the contract before mainnet use; this MVP intentionally keeps the contract surface small and uses reentrancy protection around native-token transfers.This is a [Next.js](https://nextjs.org) project bootstrapped with [`create-next-app`](https://nextjs.org/docs/app/api-reference/cli/create-next-app).

## Getting Started

First, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `app/page.tsx`. The page auto-updates as you edit the file.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.
