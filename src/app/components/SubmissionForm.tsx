"use client";

import { ArrowUpRight, CheckCircle2, Wallet } from "lucide-react";
import { FormEvent, useState } from "react";
import { useAccount, useConnect, useWaitForTransactionReceipt, useWriteContract } from "wagmi";
import { botBountyAbi, botBountyAddress } from "../contract";

export function SubmissionForm({ bountyId, count }: { bountyId: number; count: number }) {
  const { isConnected } = useAccount();
  const { connect, connectors } = useConnect();
  const { data: hash, error, isPending, writeContract } = useWriteContract();
  const { isLoading: confirming, isSuccess } = useWaitForTransactionReceipt({ hash });
  const [message, setMessage] = useState("");
  const [url, setUrl] = useState("");

  function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!isConnected || !botBountyAddress) {
      connect({ connector: connectors[0] });
      return;
    }
    writeContract({ address: botBountyAddress, abi: botBountyAbi, functionName: "submitSolution", args: [BigInt(bountyId), message, url] });
  }

  return <div className="submission-area"><div className="submission-heading"><h2>Submit your solution</h2><span>{count} submissions so far</span></div>{isSuccess ? <div className="submission-placeholder success-state"><CheckCircle2 size={20} /><span>Solution submitted successfully.</span>{hash && <a className="text-link" href={`https://scan.botchain.ai/tx/${hash}`} target="_blank" rel="noreferrer">View transaction <ArrowUpRight size={15} /></a>}</div> : <form className="submission-form" onSubmit={submit}><textarea required rows={4} value={message} onChange={event => setMessage(event.target.value)} placeholder="Describe your approach and what you delivered..." /><input value={url} onChange={event => setUrl(event.target.value)} placeholder="Optional solution URL" type="url" /><button className="primary-button" disabled={isPending || confirming} type="submit">{isConnected ? <><CheckCircle2 size={16} />{isPending || confirming ? "Confirming..." : "Submit solution"}</> : <><Wallet size={16} /> Connect wallet</>}</button>{error && <p className="form-error">Submission failed. Check the wallet network and try again.</p>}</form>}</div>;
}
