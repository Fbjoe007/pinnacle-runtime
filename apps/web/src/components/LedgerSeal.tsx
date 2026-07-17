import React, { useState } from 'react';

interface Props {
  merkleRoot: string;
  signature: string;
}

export const LedgerSeal: React.FC<Props> = ({ merkleRoot, signature }) => {
  const [copied, setCopied] = useState(false);

  const handleCopy = (text: string) => {
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 1500);
  };

  const trunc = (h: string) => h ? `${h.slice(0, 12)}...${h.slice(-8)}` : 'N/A';

  return (
    <div className="border border-[#27272A] bg-[#121214] p-4 font-mono text-xs text-[#D4D4D8] rounded-sm">
      <div className="flex justify-between items-center mb-3">
        <span className="text-[#00FF41] font-bold tracking-widest text-[10px]">[!] CRYPTOGRAPHIC LEDGER SEAL</span>
        <span className="text-[10px] bg-[#00FF41]/10 text-[#00FF41] px-2 py-0.5 border border-[#00FF41]/20 rounded-sm">
          VERIFIED_RECORD
        </span>
      </div>
      <div className="space-y-2">
        <div className="flex justify-between cursor-pointer" onClick={() => handleCopy(merkleRoot)}>
          <span className="text-[#A1A1AA]">MERKLE_ROOT:</span>
          <span className="text-[#0066FF] hover:underline">{copied ? 'COPIED' : trunc(merkleRoot)}</span>
        </div>
        <div className="flex justify-between">
          <span className="text-[#A1A1AA]">SIGNATURE:</span>
          <span>{trunc(signature)}</span>
        </div>
      </div>
    </div>
  );
};