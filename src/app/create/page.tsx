"use client";

import { ArrowLeft, CalendarDays, CheckCircle2, ExternalLink, LockKeyhole, Plus } from "lucide-react";
import { FormEvent, useState } from "react";
import { parseEther } from "viem";
import { useRouter } from "next/navigation";
import { useAccount, useWaitForTransactionReceipt, useWriteContract } from "wagmi";
import { SiteHeader } from "../components/SiteHeader";
import { botBountyAbi, botBountyAddress } from "../contract";

export default function CreatePage() {
  const [submitted, setSubmitted] = useState(false);
  const [fundedReward, setFundedReward] = useState("");
  const router = useRouter();
  const { isConnected } = useAccount();
  const { data: hash, isPending, writeContract, error } = useWriteContract();
  const { isLoading: confirming, isSuccess } = useWaitForTransactionReceipt({ hash });
  function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const form = new FormData(event.currentTarget);
    const deadline = Math.floor(new Date(String(form.get("deadline"))).getTime() / 1000);
    setFundedReward(String(form.get("reward")));
    if (!isConnected || !botBountyAddress) { setSubmitted(true); return; }
    writeContract({ address: botBountyAddress, abi: botBountyAbi, functionName: "createBounty", args: [String(form.get("title")), String(form.get("description")), BigInt(deadline)], value: parseEther(String(form.get("reward"))) });
  }
  return <main className="app-shell"><SiteHeader /><section className="form-page"><a className="back-link" href="/explore"><ArrowLeft size={15} /> Back to open bounties</a><div className="form-layout"><div><span className="section-kicker">NEW BOUNTY</span><h1 className="page-title">Make something useful.</h1><p className="page-intro">Describe the outcome, lock a BOT reward, and let contributors do their best work.</p><div className="escrow-note"><LockKeyhole size={19} /><span><strong>Protected by escrow</strong><br />Your reward stays in the contract until you approve a submission.</span></div></div><form className="bounty-form" onSubmit={submit}><label>Title<input name="title" required placeholder="What needs to be done?" /></label><label>Description<textarea name="description" required rows={6} placeholder="Describe the outcome and acceptance criteria..." /></label><div className="form-row"><label>Reward (BOT)<input name="reward" required min="0.0001" step="any" type="number" placeholder="0.00" /></label><label>Deadline<input name="deadline" required type="date" /></label></div><button className="primary-button full" disabled={isPending || confirming} type="submit"><Plus size={16} />{isSuccess ? "Bounty created" : isPending || confirming ? "Confirming transaction..." : submitted ? "Connect wallet to continue" : "Lock reward and post"}</button>{error && <p className="form-error">Transaction failed. Check the wallet network and balance, then try again.</p>}<p className="form-caption">You will review the transaction before any BOT is locked.</p></form></div><div className="form-footer"><CalendarDays size={15} /> BOT Chain testnet · Native BOT escrow {hash && <a href={`https://scan.bohr.life/tx/${hash}`} target="_blank" rel="noreferrer">View transaction</a>}</div></section>{isSuccess && <div className="modal-backdrop"><div className="modal success-modal"><CheckCircle2 className="success-icon" size={42} /><span className="section-kicker">TRANSACTION CONFIRMED</span><h2>Bounty created and funded.</h2><p>Your reward is locked in BOT Chain escrow and the bounty is now visible on the open board.</p><div className="success-reward"><span>FUNDED REWARD</span><strong>{fundedReward} BOT</strong></div>{hash && <a className="explorer-link" href={`https://scan.bohr.life/tx/${hash}`} target="_blank" rel="noreferrer">View transaction on BOT Scan <ExternalLink size={14} /></a>}<button className="primary-button full" onClick={() => router.push("/explore")}>View open bounties <ArrowLeft size={16} /></button><small className="redirect-note">Choose Explore when you are ready.</small></div></div>}</main>;
}
