import React, { useState } from 'react';
import { Fingerprint, Copy, Check, ShieldCheck } from 'lucide-react';

interface Props {
  merkleRoot: string;
  signature: string;
}

export const LedgerSeal: React.FC<Props> = ({ merkleRoot, signature }) => {
  const [copied, setCopied] = useState(false);

  const handleCopy = (text: string) => {
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const trunc = (h: string) => `${h.slice(0, 16)}...${h.slice(-12)}`;

  return (
    <div className="bg-[#0B1F3A] rounded-2xl p-8 border border-[#D4AF37]/30 shadow-2xl overflow-hidden relative group">
      <div className="absolute top-0 right-0 p-8 opacity-5">
        <ShieldCheck className="w-32 h-32 text-[#D4AF37]" />
      </div>

      <div className="relative z-10">
        <div className="flex items-center gap-3 mb-6">
          <div className="bg-[#D4AF37] p-2 rounded-lg text-[#0B1F3A]">
            <Fingerprint className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-white font-bold text-sm tracking-tight uppercase">Ledger Proof of Authenticity</h3>
            <p className="text-[#D4AF37] text-[10px] font-black uppercase tracking-[0.2em]">Immutable Forensic Record</p>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="space-y-2">
            <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Merkle Root</label>
            <button 
              onClick={() => handleCopy(merkleRoot)}
              className="w-full flex items-center justify-between bg-black/20 hover:bg-black/40 border border-white/10 p-3 rounded-xl transition-all group/item"
            >
              <span className="font-mono text-[11px] text-blue-300 truncate mr-4">{merkleRoot ? trunc(merkleRoot) : "Evidence Unavailable"}</span>
              {copied ? <Check className="w-4 h-4 text-[#10B981]" /> : <Copy className="w-4 h-4 text-slate-500 group-hover/item:text-[#D4AF37]" />}
            </button>
          </div>

          <div className="space-y-2">
            <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Authority Signature</label>
            <div className="bg-black/20 border border-white/10 p-3 rounded-xl">
              <span className="font-mono text-[11px] text-slate-300 truncate block">{signature ? trunc(signature) : "Evidence Unavailable"}</span>
            </div>
          </div>
        </div>

        <div className="mt-8 pt-6 border-t border-white/5">
          <p className="text-[9px] text-slate-500 leading-relaxed italic">
            This cryptographic seal confirms that the associated validation outcome has been committed to the 
            Pinnacle Runtime Ledger and cannot be altered or repudiated.
          </p>
        </div>
      </div>
    </div>
  );
};
