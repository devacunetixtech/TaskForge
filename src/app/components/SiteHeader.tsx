"use client";

import { CircleHelp, LogOut, Menu, Wallet } from "lucide-react";
import Link from "next/link";
import { useState } from "react";
import { useAccount, useConnect, useDisconnect } from "wagmi";

export function SiteHeader() {
  const [mobileNav, setMobileNav] = useState(false);
  const { address, isConnected } = useAccount();
  const { connect, connectors } = useConnect();
  const { disconnect } = useDisconnect();
  const label = address ? `${address.slice(0, 4)}...${address.slice(-4)}` : "Connect wallet";
  const toggleWallet = () => isConnected ? disconnect() : connect({ connector: connectors[0] });

  return <nav className="topbar">
    <Link className="brand" href="/"><span className="brand-mark">B</span><span>Bot<span className="muted-brand">Bounty</span></span></Link>
    <div className={`nav-links ${mobileNav ? "show" : ""}`}><Link href="/explore">Explore</Link><Link href="/#how">How it works</Link><Link href="/dashboard">Dashboard</Link></div>
    <div className="nav-actions"><button className="icon-button mobile-menu" onClick={() => setMobileNav(!mobileNav)} aria-label="Toggle menu"><Menu size={18} /></button><button className="help-button"><CircleHelp size={16} /> Help</button>{isConnected ? <><span className="wallet-label"><Wallet size={15} />{label}</span><button className="disconnect-button" onClick={() => disconnect()}><LogOut size={15} /> Disconnect</button></> : <button className="connect-button" onClick={toggleWallet}><Wallet size={16} />Connect wallet</button>}</div>
  </nav>;
}
