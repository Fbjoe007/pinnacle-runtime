import React, { useState } from "react";
import { createExecution } from "../api";
import { useExecution } from "../hooks/useExecution";
import { LedgerSeal } from "../components/LedgerSeal";
import { LeadValidationResult } from "../types";

export const ExecutionDashboard: React.FC = () => {
  const [legalName, setLegalName] = useState("");
  const [domain, setDomain] = useState("");
  const [activeId, setActiveId] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const { data: response, error, isLive } = useExecution(activeId);
  const execution = response?.execution;
  const output = response?.output as LeadValidationResult | undefined;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!legalName || !domain) return;
    setSubmitting(true);
    try {
      const res = await createExecution({
        capability: "lead_orchestration",
        input: { domain, businessName: legalName }
      });
      if (res.execution) setActiveId(res.execution.executionId);
    } catch (err) {
      console.error(err);
    } finally {
      setSubmitting(false);
    }
  };
  return (
    <div className="min-h-screen bg-[#09090B] text-white p-8 font-sans">
      <div className="max-w-4xl mx-auto space-y-8">
        <div className="border-b border-[#27272A] pb-6">
          <h1 className="text-2xl font-bold tracking-tight text-[#FAFAFA]">PINNACLE ENGINE INTERFACE</h1>
          <p className="text-sm text-[#A1A1AA] mt-1">Real-time state execution monitoring and ledger verification.</p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div className="bg-[#121214] border border-[#27272A] p-6 rounded-sm space-y-4">
            <h2 className="text-sm font-semibold tracking-wider text-[#A1A1AA] uppercase">Initialize Execution</h2>
            <form onSubmit={handleSubmit} className="space-y-4">
              <input type="text" value={legalName} onChange={(e) => setLegalName(e.target.value)} placeholder="Legal Name" className="w-full bg-[#18181B] border border-[#27272A] p-2 text-sm rounded-sm" required />
              <input type="text" value={domain} onChange={(e) => setDomain(e.target.value)} placeholder="Domain" className="w-full bg-[#18181B] border border-[#27272A] p-2 text-sm rounded-sm" required />
              <button type="submit" disabled={submitting || isLive} className="w-full bg-[#FAFAFA] text-black font-semibold text-xs py-2.5 rounded-sm uppercase disabled:opacity-50">
                {submitting ? "INITIALIZING..." : "TRIGGER RUNTIME"}
              </button>
            </form>
          </div>
          <div className="space-y-6">
            <div className="bg-[#121214] border border-[#27272A] p-6 rounded-sm min-h-[220px] flex flex-col justify-between">
              <div>
                <h2 className="text-sm font-semibold tracking-wider text-[#A1A1AA] uppercase mb-4">Live Console</h2>
                {error && <div className="text-red-500 text-xs font-mono mb-4">[ERROR] {error}</div>}
                {execution ? (
                  <div className="space-y-3 font-mono text-xs">
                    <div className="flex justify-between"><span className="text-[#71717A]">EXECUTION_ID:</span><span>{execution.executionId}</span></div>
                    <div className="flex justify-between"><span className="text-[#71717A]">STATE:</span><span className={execution.state === "SUCCEEDED" ? "text-[#00FF41]" : "text-amber-500"}>{execution.state}</span></div>
                    {output && <div className="flex justify-between"><span className="text-[#71717A]">TOTAL_SCORE:</span><span className="text-[#00FF41] font-bold">{output.totalScore}</span></div>}
                  </div>
                ) : (
                  <div className="text-xs font-mono text-[#71717A] italic">Awaiting state runtime initialization...</div>
                )}
              </div>
              {response?.ledger && (
                <div className="mt-4 pt-4 border-t border-[#27272A]">
                  <LedgerSeal merkleRoot={response.ledger.merkleRoot} signature={response.ledger.signature} />
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
