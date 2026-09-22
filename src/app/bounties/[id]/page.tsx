import { ArrowLeft, Clock3, ExternalLink, LockKeyhole } from "lucide-react";
import { notFound } from "next/navigation";
import { createPublicClient, formatEther, http } from "viem";
import { bounties } from "../../data";
import { SiteHeader } from "../../components/SiteHeader";
import { SubmissionForm } from "../../components/SubmissionForm";
import { botBountyAbi, botBountyAddress } from "../../contract";
import { botchainMainnet } from "../../web3";

export function generateStaticParams() { return bounties.map(bounty => ({ id: String(bounty.id) })); }

export default async function BountyDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  let bounty = bounties.find(item => item.id === Number(id));
  if (!bounty && botBountyAddress) {
    try {
      const client = createPublicClient({ chain: botchainMainnet, transport: http() });
      const record = await client.readContract({ address: botBountyAddress, abi: botBountyAbi, functionName: "bounties", args: [BigInt(id)] });
      const submissions = await client.readContract({ address: botBountyAddress, abi: botBountyAbi, functionName: "getSubmissions", args: [BigInt(id)] });
      bounty = { id: Number(id), title: record[4], category: "ON-CHAIN", reward: `${Number(formatEther(record[1])).toLocaleString(undefined, { maximumFractionDigits: 4 })} BOT`, time: new Date(Number(record[2]) * 1000).toLocaleDateString(), submissions: submissions.length, creator: `${record[0].slice(0, 6)}...${record[0].slice(-4)}`, description: record[5] };
    } catch { bounty = undefined; }
  }
  if (!bounty) notFound();
  return <main className="app-shell"><SiteHeader /><section className="detail-page"><a className="back-link" href="/explore"><ArrowLeft size={15} /> Back to open bounties</a><div className="detail-layout"><article><div className="detail-heading"><span className="category">{bounty.category}</span><span className="open-pill"><span className="pulse-dot" /> OPEN</span></div><h1 className="page-title">{bounty.title}</h1><p className="detail-description">{bounty.description}</p><div className="detail-author"><span className="avatar">{bounty.creator.slice(2, 4).toUpperCase()}</span><span>Posted by <strong>{bounty.creator}</strong></span></div><div className="brief"><span className="section-kicker">THE BRIEF</span><p>This bounty is looking for a thoughtful, production-ready solution. Include your approach, relevant links, and enough detail for the creator to evaluate the work.</p></div><SubmissionForm bountyId={bounty.id} count={bounty.submissions} /></article><aside className="detail-sidebar"><div className="reward-box"><span className="section-kicker">BOUNTY REWARD</span><strong>{bounty.reward}</strong><span><LockKeyhole size={14} /> Locked in escrow</span></div><div className="sidebar-row"><span><Clock3 size={15} /> Deadline</span><strong>{bounty.time}</strong></div><div className="sidebar-row"><span>Submissions</span><strong>{bounty.submissions}</strong></div><div className="sidebar-row"><span>Network</span><strong>BOT Chain mainnet</strong></div><a className="explorer-link" href="https://scan.botchain.ai" target="_blank" rel="noreferrer">View network explorer <ExternalLink size={14} /></a></aside></div></section></main>;
}
