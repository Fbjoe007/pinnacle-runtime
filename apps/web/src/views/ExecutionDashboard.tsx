import React, { useState } from "react";
import { createExecution } from "../api";
import { useExecution } from "../hooks/useExecution";
import { LeadValidationResult } from "../types";
import { Header } from "../components/Header";
import { ValidatorForm } from "../components/ValidatorForm";
import { ExecutionStatus } from "../components/ExecutionStatus";
import { ResultsView } from "../components/ResultsView";
import { LedgerSeal } from "../components/LedgerSeal";

export const ExecutionDashboard: React.FC = () => {
  const [legalName, setLegalName] = useState("");
  const [domain, setDomain] = useState("");
  const [activeId, setActiveId] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  const { data: response, error } = useExecution(activeId);

  const execution = response?.execution;
  const output = response?.output as LeadValidationResult | undefined;
  const ledger = response?.ledger;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!legalName || !domain) return;

    setSubmitting(true);

    try {
      const res = await createExecution({
        capability: "lead_orchestration",
        input: {
          domain,
          businessName: legalName,
        },
      });

      if (res.execution) {
        setActiveId(res.execution.executionId);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setSubmitting(false);
    }
  };

  const handleReset = () => {
    setActiveId(null);
    setLegalName("");
    setDomain("");
  };

  return (
    <div className="min-h-screen bg-[#F8FAFC]">
      <Header />

      <main className="max-w-7xl mx-auto px-4 py-12 sm:px-6 lg:px-8">
        <div className="flex flex-col items-center">
          {!activeId ? (
            <div className="w-full max-w-xl space-y-8">
              <div className="text-center space-y-4">
                <h1 className="text-4xl font-extrabold text-[#0B1F3A] tracking-tight">
                  Enterprise Validator
                </h1>

                <p className="text-slate-500 text-lg max-w-md mx-auto">
                  Verify corporate reputation and infrastructure integrity in
                  real-time.
                </p>
              </div>

              <ValidatorForm
                legalName={legalName}
                setLegalName={setLegalName}
                domain={domain}
                setDomain={setDomain}
                onSubmit={handleSubmit}
                loading={submitting}
              />
            </div>
          ) : (
            <div className="w-full max-w-4xl space-y-8">
              {error && (
                <div className="w-full max-w-xl mx-auto bg-rose-50 border border-rose-100 p-4 rounded-xl text-[#DC2626] text-sm font-bold flex items-center gap-3">
                  <span className="w-2 h-2 bg-[#DC2626] rounded-full" />
                  SYSTEM_ERROR: {error}
                </div>
              )}

              {execution && execution.state !== "SUCCEEDED" && (
                <div className="w-full max-w-xl mx-auto">
                  <ExecutionStatus
                    state={execution.state}
                    executionId={activeId}
                  />
                </div>
              )}

              {output && execution?.state === "SUCCEEDED" && (
                <>
                  <ResultsView
                    data={output}
                    onReset={handleReset}
                  />

                  {ledger && (
                    <div className="mt-12 animate-in fade-in slide-in-from-bottom-6 duration-1000 delay-300">
                      <LedgerSeal
                        merkleRoot={ledger.merkleRoot}
                        signature={ledger.signature}
                      />
                    </div>
                  )}
                </>
              )}
            </div>
          )}
        </div>
      </main>
    </div>
  );
};
