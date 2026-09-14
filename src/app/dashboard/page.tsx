"use client";

import { ArrowUpRight, CheckCircle2, Clock3, Plus, Wallet } from "lucide-react";
import { formatEther } from "viem";
import { useAccount, useBalance } from "wagmi";
import { SiteHeader } from "../components/SiteHeader";
import { bounties } from "../data";
import { botchainTestnet } from "../web3";

export default function DashboardPage() {
  const { address } = useAccount();
  const { data: balance, isLoading: balanceLoading } = useBalance({ address, chainId: botchainTestnet.id });
  const balanceLabel = !address ? "Connect wallet" : balanceLoading ? "Loading..." : balance ? Number(formatEther(balance.value)).toLocaleString(undefined, { maximumFractionDigits: 4 }) : "0";
  return <main className="app-shell"><SiteHeader /><section className="dashboard-page"><div className="dashboard-heading"><div><span className="section-kicker">YOUR WORKSPACE</span><h1 className="page-title">Dashboard</h1><p className="page-intro">Track bounties you create, contribute to, and win.</p></div><a className="primary-button" href="/create"><Plus size={16} /> Post a bounty</a></div><div className="wallet-banner"><Wallet size={20} /><div><strong>{address ? `${address.slice(0, 8)}...${address.slice(-6)}` : "Wallet not connected"}</strong><span>{address ? "Connected on BOT Chain testnet" : "Connect your wallet to see your on-chain activity"}</span></div>{!address && <a className="text-link" href="#wallet">Connect <ArrowUpRight size={15} /></a>}</div><div className="dashboard-stats"><div className="balance-stat"><span>BOT BALANCE</span><strong>{balanceLabel}</strong><small>Native BOT on testnet</small></div><div><span>CREATED</span><strong>0</strong><small>BOT 0 escrowed</small></div><div><span>SUBMITTED</span><strong>0</strong><small>Awaiting review</small></div></div><div className="dashboard-columns"><section><div className="dashboard-section-title"><h2>Your bounties</h2><span>0 active</span></div><div className="empty-panel"><CheckCircle2 size={22} /><strong>Your created bounties will appear here.</strong><p>Post a task and monitor submissions from one place.</p><a className="text-link" href="/create">Create your first bounty <ArrowUpRight size={15} /></a></div></section><section><div className="dashboard-section-title"><h2>Recent opportunities</h2><span><Clock3 size={13} /> Open now</span></div><div className="mini-list">{bounties.slice(0, 3).map(item => <a href={`/bounties/${item.id}`} key={item.id}><div><span className="category">{item.category}</span><strong>{item.title}</strong></div><b>{item.reward}</b></a>)}</div></section></div></section></main>;
}
