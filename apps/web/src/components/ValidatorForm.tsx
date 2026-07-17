import React from 'react';
import { Search, Building2, Globe, ArrowRight } from 'lucide-react';

interface Props {
  legalName: string;
  setLegalName: (val: string) => void;
  domain: string;
  setDomain: (val: string) => void;
  onSubmit: (e: React.FormEvent) => void;
  loading: boolean;
}

export const ValidatorForm: React.FC<Props> = ({ 
  legalName, setLegalName, domain, setDomain, onSubmit, loading 
}) => {
  return (
    <div className="bg-white rounded-2xl shadow-xl shadow-slate-200/50 border border-slate-100 overflow-hidden">
      <div className="bg-[#0B1F3A] px-8 py-6">
        <h2 className="text-white font-bold text-lg">Identity Verification</h2>
        <p className="text-slate-400 text-xs mt-1 uppercase tracking-wider font-semibold">Business Reputation Engine</p>
      </div>
      
      <form onSubmit={onSubmit} className="p-8 space-y-6">
        <div className="space-y-4">
          <div>
            <label htmlFor="legalName" className="block text-sm font-bold text-[#0B1F3A] mb-2 flex items-center gap-2">
              <Building2 className="w-4 h-4 text-[#D4AF37]" />
              LEGAL BUSINESS NAME
            </label>
            <input
              id="legalName" type="text"
              value={legalName}
              onChange={(e) => setLegalName(e.target.value)}
              placeholder="e.g. Acme Corporation"
              className="w-full bg-[#F8FAFC] border border-slate-200 rounded-xl px-4 py-3 text-[#0B1F3A] placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-[#0F3D91] focus:ring-offset-2 focus:border-[#0F3D91] transition-all"
              required
            />
          </div>

          <div>
            <label htmlFor="legalName" className="block text-sm font-bold text-[#0B1F3A] mb-2 flex items-center gap-2">
              <Globe className="w-4 h-4 text-[#D4AF37]" />
              CORPORATE DOMAIN
            </label>
            <input
              id="legalName" type="text"
              value={domain}
              onChange={(e) => setDomain(e.target.value)}
              placeholder="acme.com"
              className="w-full bg-[#F8FAFC] border border-slate-200 rounded-xl px-4 py-3 text-[#0B1F3A] placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-[#0F3D91] focus:ring-offset-2 focus:border-[#0F3D91] transition-all"
              required
            />
          </div>
        </div>

        <button
          type="submit"
          disabled={loading}
          className="w-full bg-[#0F3D91] hover:bg-[#0B1F3A] disabled:bg-slate-300 text-white font-bold py-4 rounded-xl transition-all active:scale-[0.98] shadow-lg shadow-blue-900/20 flex items-center justify-center gap-2 group"
        >
          {loading ? (
            <span className="flex items-center gap-2">
              <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              ANALYZING...
            </span>
          ) : (
            <>
              INITIATE VALIDATION
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </>
          )}
        </button>

        <p className="text-center text-[10px] text-slate-400 font-medium uppercase tracking-tighter">
          SECURED BY PINNACLE RUNTIME • RC1 INFRASTRUCTURE
        </p>
      </form>
    </div>
  );
};
