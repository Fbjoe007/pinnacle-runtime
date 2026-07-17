import React from 'react';
import { CheckCircle2, AlertCircle, ShieldCheck, Download, RefreshCw } from 'lucide-react';
import { LeadValidationResult } from '../types';

interface Props {
  data: LeadValidationResult;
  onReset: () => void;
}

export const ResultsView: React.FC<Props> = ({ data, onReset }) => {
  const isHighRisk = data.totalScore < 70;

  return (
    <div className="w-full max-w-4xl animate-in fade-in slide-in-from-bottom-8 duration-1000 duration-700">
      {/* Executive Summary Header */}
      <div className="bg-white rounded-2xl shadow-xl border border-slate-100 overflow-hidden mb-8">
        <div className="bg-[#0B1F3A] px-8 py-10 flex flex-col md:flex-row items-center gap-8">
          <div className="relative">
            <div className={`w-32 h-32 rounded-full border-4 flex items-center justify-center bg-white/5 ${
              isHighRisk ? 'border-[#DC2626]' : 'border-[#10B981]'
            }`}>
              <span className={`text-4xl font-black ${isHighRisk ? 'text-[#DC2626]' : 'text-[#10B981]'}`}>
                {data.totalScore}
              </span>
            </div>
            <div className="absolute -bottom-2 left-1/2 -translate-x-1/2 bg-white px-3 py-1 rounded-full shadow-sm">
              <span className="text-[#0B1F3A] text-[10px] font-bold uppercase tracking-widest">Score</span>
            </div>
          </div>
          
          <div className="flex-1 text-center md:text-left">
            <h2 className="text-white text-3xl font-bold tracking-tight mb-2">{data.domain}</h2>
            <div className="flex flex-wrap justify-center md:justify-start gap-3 items-center">
              <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-md text-xs font-bold uppercase tracking-wider ${
                isHighRisk ? 'bg-[#DC2626]/20 text-[#DC2626]' : 'bg-[#10B981]/20 text-[#10B981]'
              }`}>
                {isHighRisk ? <AlertCircle className="w-3 h-3" /> : <ShieldCheck className="w-3 h-3" />}
                {isHighRisk ? 'High Risk Detected' : 'Verified Low Risk'}
              </span>
              <span className="text-[#0B1F3A]/60 text-xs font-medium uppercase tracking-tighter">
                Validated: {new Date(data.processedAt).toLocaleString()}
              </span>
            </div>
          </div>

          <button onClick={() => window.print()} className="hidden md:flex items-center gap-2 text-[#D4AF37] hover:text-white transition-colors text-sm font-bold uppercase tracking-widest">
            <Download className="w-4 h-4" />
            Export
          </button>
        </div>
      </div>

      {/* Validator Matrix */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-12">
        {Object.entries(data.breakdown).map(([key, result]) => (
          <div key={key} className="bg-white border border-slate-200 p-6 rounded-xl flex items-start justify-between group hover:border-[#0F3D91] transition-all">
            <div className="space-y-1">
              <h4 className="text-[10px] font-black text-[#0B1F3A]/60 uppercase tracking-widest">
                {key.replace(/_/g, ' ')}
              </h4>
              <p className="text-[#0B1F3A] font-bold text-sm">
                {result.passed ? 'Criteria Validated' : 'Validation Warning'}
              </p>
            </div>
            <div className={`p-2 rounded-lg ${result.passed ? 'bg-[#10B981]/10 text-[#10B981]' : 'bg-[#DC2626]/10 text-[#DC2626]'}`}>
              {result.passed ? <CheckCircle2 className="w-5 h-5" /> : <AlertCircle className="w-5 h-5" />}
            </div>
          </div>
        ))}
      </div>

      {/* Action Footer */}
      <div className="flex flex-col items-center gap-6">
        <button 
          onClick={onReset}
          className="flex items-center gap-2 text-[#0F3D91] hover:text-[#0B1F3A] font-bold text-sm tracking-widest uppercase transition-colors"
        >
          <RefreshCw className="w-4 h-4" />
          Run New Analysis
        </button>
        <p className="text-[10px] text-[#0B1F3A]/60 font-medium max-w-xs text-center leading-loose">
          This report is a point-in-time projection of the Pinnacle Runtime ledger. Continuous monitoring is recommended for enterprise compliance.
        </p>
      </div>
    </div>
  );
};
