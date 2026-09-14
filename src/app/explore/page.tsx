"use client";

import { ArrowUpRight, Clock3, Search, Sparkles } from "lucide-react";
import { formatEther } from "viem";
import { useEffect, useState } from "react";
import { usePublicClient } from "wagmi";
import { SiteHeader } from "../components/SiteHeader";
import { Bounty, bounties as demoBounties } from "../data";
import { botBountyAbi, botBountyAddress } from "../contract";

export default function ExplorePage() {
  const [filter, setFilter] = useState("All bounties");
  const [query, setQuery] = useState("");
  const [bounties, setBounties] = useState<Bounty[]>([]);
  const [loading, setLoading] = useState(true);
  const publicClient = usePublicClient();

  useEffect(() => {
    let active = true;
    async function loadBounties() {
      const contractAddress = botBountyAddress;
      if (!publicClient || !contractAddress) { setBounties(demoBounties); setLoading(false); return; }
      try {
        const total = await publicClient.readContract({ address: contractAddress, abi: botBountyAbi, functionName: "nextBountyId" });
        const records = await Promise.all(Array.from({ length: Number(total) }, (_, id) => publicClient.readContract({ address: contractAddress, abi: botBountyAbi, functionName: "bounties", args: [BigInt(id)] }).then(async bounty => {
          const submissions = await publicClient.readContract({ address: contractAddress, abi: botBountyAbi, functionName: "getSubmissions", args: [BigInt(id)] });
          return { id, title: bounty[4], category: "ON-CHAIN", reward: `${Number(formatEther(bounty[1])).toLocaleString(undefined, { maximumFractionDigits: 4 })} BOT`, time: new Date(Number(bounty[2]) * 1000).toLocaleDateString(), submissions: submissions.length, creator: `${bounty[0].slice(0, 6)}...${bounty[0].slice(-4)}`, description: bounty[5], featured: id === Number(total) - 1 };
        })));
        if (active) setBounties(records);
      } catch { if (active) setBounties(demoBounties); }
      if (active) setLoading(false);
    }
    loadBounties();
    return () => { active = false; };
  }, [publicClient]);

  const visible = bounties.filter(item => (filter === "All bounties" || item.category.toLowerCase() === filter.toLowerCase() || filter === "Development" && item.category === "ON-CHAIN") && item.title.toLowerCase().includes(query.toLowerCase()));
  return <main className="app-shell"><SiteHeader /><section className="explore-section page-section"><span className="section-kicker">THE OPEN BOARD</span><div className="section-heading"><div><h1 className="page-title">Find work worth doing.</h1><p className="page-intro">Browse open tasks secured by BOT Chain escrow.</p></div><a className="primary-button" href="/create">Post a bounty <ArrowUpRight size={16} /></a></div><div className="toolbar"><div className="search-box"><Search size={17} /><input value={query} onChange={event => setQuery(event.target.value)} placeholder="Search bounties" /></div><div className="filter-tabs">{["All bounties", "Development", "Design", "Data"].map(item => <button className={filter === item ? "selected" : ""} key={item} onClick={() => setFilter(item)}>{item}</button>)}</div></div>{loading ? <div className="empty-state">Loading on-chain bounties...</div> : <div className="bounty-grid">{visible.map(item => <a className={`bounty-card ${item.featured ? "featured" : ""}`} key={item.id} href={`/bounties/${item.id}`}><div className="card-top"><span className="category">{item.category}</span>{item.featured && <span className="featured-label"><Sparkles size={13} /> FEATURED</span>}</div><h3>{item.title}</h3><p>{item.description}</p><div className="card-meta"><span><strong>{item.reward.split(" ")[0]}</strong> BOT</span><span><Clock3 size={14} /> {item.time}</span></div><div className="card-footer"><span>{item.submissions} submissions</span><ArrowUpRight size={14} /></div></a>)}</div>}{!loading && visible.length === 0 && <div className="empty-state">No open bounties match that search.</div>}</section></main>;
}
