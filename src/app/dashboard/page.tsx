"use client";

import { ArrowUpRight, CheckCircle2, Clock3, Plus, Wallet } from "lucide-react";
import { formatEther } from "viem";
import { useEffect, useState, useSyncExternalStore } from "react";
import { useAccount, useBalance, usePublicClient } from "wagmi";
import { botBountyAbi, botBountyAddress } from "../contract";
import { SiteHeader } from "../components/SiteHeader";
import { bounties } from "../data";
import { botchainTestnet } from "../web3";

export default function DashboardPage() {
  const { address } = useAccount();
  const walletReady = useSyncExternalStore(() => () => {}, () => true, () => false);
  const visibleAddress = walletReady ? address : undefined;
  const { data: balance, isLoading: balanceLoading } = useBalance({ address: visibleAddress, chainId: botchainTestnet.id });
  const publicClient = usePublicClient();
  const [createdCount, setCreatedCount] = useState(0);
  const [activeCount, setActiveCount] = useState(0);
  const [createdEscrow, setCreatedEscrow] = useState("0");
  const balanceLabel = !walletReady || !visibleAddress ? "Connect wallet" : balanceLoading ? "Loading..." : balance ? Number(formatEther(balance.value)).toLocaleString(undefined, { maximumFractionDigits: 4 }) : "0";
  useEffect(() => {
    let active = true;
    async function loadCreatedBounties() {
      const contractAddress = botBountyAddress;
      if (!publicClient || !contractAddress || !visibleAddress) {
        setCreatedCount(0);
        setActiveCount(0);
        setCreatedEscrow("0");
        return;
      }
      try {
        const total = await publicClient.readContract({ address: contractAddress, abi: botBountyAbi, functionName: "nextBountyId" });
        const records = await Promise.all(Array.from({ length: Number(total) }, (_, id) => publicClient.readContract({ address: contractAddress, abi: botBountyAbi, functionName: "bounties", args: [BigInt(id)] })));
        const mine = records.filter(record => record[0].toLowerCase() === visibleAddress.toLowerCase());
        const activeMine = mine.filter(record => record[3] === 0);
        const escrow = activeMine.reduce((sum, record) => sum + record[1], BigInt(0));
        if (active) {
          setCreatedCount(mine.length);
          setActiveCount(activeMine.length);
          setCreatedEscrow(Number(formatEther(escrow)).toLocaleString(undefined, { maximumFractionDigits: 4 }));
        }
      } catch {
        if (active) { setCreatedCount(0); setActiveCount(0); setCreatedEscrow("0"); }
      }
    }
    loadCreatedBounties();
    return () => { active = false; };
  }, [publicClient, visibleAddress]);

  return <main className="app-shell"><SiteHeader /><section className="dashboard-page"><div className="dashboard-heading"><div><span className="section-kicker">YOUR WORKSPACE</span><h1 className="page-title">Dashboard</h1><p className="page-intro">Track bounties you create, contribute to, and win.</p></div><a className="primary-button" href="/create"><Plus size={16} /> Post a bounty</a></div><div className="wallet-banner"><Wallet size={20} /><div><strong>{visibleAddress ? `${visibleAddress.slice(0, 8)}...${visibleAddress.slice(-6)}` : "Wallet not connected"}</strong><span>{visibleAddress ? "Connected on BOT Chain testnet" : "Connect your wallet to see your on-chain activity"}</span></div>{!visibleAddress && <a className="text-link" href="#wallet">Connect <ArrowUpRight size={15} /></a>}</div><div className="dashboard-stats"><div className="balance-stat"><span>BOT BALANCE</span><strong>{balanceLabel}</strong><small>Native BOT on testnet</small></div><div><span>CREATED</span><strong>{createdCount}</strong><small>BOT {createdEscrow} escrowed</small></div><div><span>SUBMITTED</span><strong>0</strong><small>Awaiting review</small></div></div><div className="dashboard-columns"><section><div className="dashboard-section-title"><h2>Your bounties</h2><span>{activeCount} active</span></div><div className="empty-panel"><CheckCircle2 size={22} /><strong>{createdCount ? "Your created bounties are on-chain." : "Your created bounties will appear here."}</strong><p>{createdCount ? `${createdCount} bounty${createdCount === 1 ? "" : "ies"} linked to this wallet.` : "Post a task and monitor submissions from one place."}</p><a className="text-link" href="/create">Create another bounty <ArrowUpRight size={15} /></a></div></section><section><div className="dashboard-section-title"><h2>Recent opportunities</h2><span><Clock3 size={13} /> Open now</span></div><div className="mini-list">{bounties.slice(0, 3).map(item => <a href={`/bounties/${item.id}`} key={item.id}><div><span className="category">{item.category}</span><strong>{item.title}</strong></div><b>{item.reward}</b></a>)}</div></section></div></section></main>;
}
