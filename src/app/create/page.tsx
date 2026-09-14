"use client";

import { ArrowLeft, CalendarDays, LockKeyhole, Plus } from "lucide-react";
import { FormEvent, useState } from "react";
import { parseEther } from "viem";
import { useAccount, useWaitForTransactionReceipt, useWriteContract } from "wagmi";
import { SiteHeader } from "../components/SiteHeader";
import { botBountyAbi, botBountyAddress } from "../contract";

export default function CreatePage() {
  const [submitted, setSubmitted] = useState(false);
  const { isConnected } = useAccount();
  const { data: hash, isPending, writeContract, error } = useWriteContract();
  const { isLoading: confirming, isSuccess } = useWaitForTransactionReceipt({ hash });
  function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const form = new FormData(event.currentTarget);
    const deadline = Math.floor(new Date(String(form.get("deadline"))).getTime() / 1000);
    if (!isConnected || !botBountyAddress) { setSubmitted(true); return; }
    writeContract({ address: botBountyAddress, abi: botBountyAbi, functionName: "createBounty", args: [String(form.get("title")), String(form.get("description")), BigInt(deadline)], value: parseEther(String(form.get("reward"))) });
  }
  return <main className="app-shell"><SiteHeader /><section className="form-page"><a className="back-link" href="/explore"><ArrowLeft size={15} /> Back to open bounties</a><div className="form-layout"><div><span className="section-kicker">NEW BOUNTY</span><h1 className="page-title">Make something useful.</h1><p className="page-intro">Describe the outcome, lock a BOT reward, and let contributors do their best work.</p><div className="escrow-note"><LockKeyhole size={19} /><span><strong>Protected by escrow</strong><br />Your reward stays in the contract until you approve a submission.</span></div></div><form className="bounty-form" onSubmit={submit}><label>Title<input name="title" required placeholder="What needs to be done?" /></label><label>Description<textarea name="description" required rows={6} placeholder="Describe the outcome and acceptance criteria..." /></label><div className="form-row"><label>Reward (BOT)<input name="reward" required min="0.0001" step="any" type="number" placeholder="0.00" /></label><label>Deadline<input name="deadline" required type="date" /></label></div><button className="primary-button full" disabled={isPending || confirming} type="submit"><Plus size={16} />{isSuccess ? "Bounty created" : isPending || confirming ? "Confirming transaction..." : submitted ? "Connect wallet to continue" : "Lock reward and post"}</button>{error && <p className="form-error">Transaction failed. Check the wallet network and balance, then try again.</p>}<p className="form-caption">You will review the transaction before any BOT is locked.</p></form></div><div className="form-footer"><CalendarDays size={15} /> BOT Chain testnet · Native BOT escrow {hash && <a href={`https://scan.bohr.life/tx/${hash}`} target="_blank" rel="noreferrer">View transaction</a>}</div></section></main>;
}
