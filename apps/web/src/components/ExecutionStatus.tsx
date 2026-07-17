import React from 'react';
import { Loader2, CheckCircle2, Shield, Search, Zap, FileText } from 'lucide-react';

interface Props {
  state: string;
  executionId: string;
}

export const ExecutionStatus: React.FC<Props> = ({ state, executionId }) => {
  const milestones = [
    { id: 'CREATED', label: 'Initializing Engine', icon: Zap },
    { id: 'RUNNING', label: 'Analyzing Infrastructure', icon: Search },
    { id: 'SUCCEEDED', label: 'Finalizing Trust Report', icon: FileText },
  ];

  const getCurrentIndex = () => {
    if (state === 'SUCCEEDED') return 3;
    if (state === 'RUNNING' || state === 'DISPATCHED') return 1;
    return 0;
  };

  const currentIndex = getCurrentIndex();

  return (
    <div className="bg-white rounded-2xl shadow-xl border border-slate-100 p-8 w-full max-w-xl animate-in fade-in zoom-in duration-500">
      <div className="flex items-center justify-between mb-8 pb-6 border-b border-slate-100">
        <div>
          <h3 className="text-[#0B1F3A] font-bold text-lg">System Execution</h3>
          <p className="text-slate-400 text-xs font-mono mt-1 uppercase">ID: {executionId}</p>
        </div>
        <div className="bg-blue-50 px-3 py-1 rounded-full flex items-center gap-2">
          <div className="w-2 h-2 bg-[#0F3D91] rounded-full animate-ping" />
          <span className="text-[#0F3D91] text-[10px] font-bold uppercase tracking-wider">Live Monitoring</span>
        </div>
      </div>

      <div className="space-y-8">
        {milestones.map((m, i) => {
          const isDone = i < currentIndex || state === 'SUCCEEDED';
          const isActive = i === currentIndex && state !== 'SUCCEEDED';
          
          return (
            <div key={m.id} className={`flex items-center gap-4 transition-all duration-500 ${isDone || isActive ? 'opacity-100' : 'opacity-30'}`}>
              <div className={`p-3 rounded-xl transition-colors ${
                isDone ? 'bg-[#10B981]/10 text-[#10B981]' : 
                isActive ? 'bg-[#0F3D91] text-white shadow-lg shadow-blue-900/20' : 
                'bg-slate-100 text-slate-400'
              }`}>
                {isActive ? <Loader2 className="w-5 h-5 animate-spin" /> : 
                 isDone ? <CheckCircle2 className="w-5 h-5" /> : 
                 <m.icon className="w-5 h-5" />}
              </div>
              <div className="flex flex-col">
                <span className={`text-sm font-bold ${isActive ? 'text-[#0B1F3A]' : 'text-slate-600'}`}>
                  {m.label}
                </span>
                {isActive && <span className="text-[10px] text-[#0F3D91] font-medium uppercase animate-pulse">Processing Evidence...</span>}
              </div>
            </div>
          );
        })}
      </div>
      
      <div className="mt-10 pt-6 border-t border-slate-50 flex items-center gap-3">
        <Shield className="w-4 h-4 text-[#D4AF37]" />
        <p className="text-[10px] text-slate-400 leading-relaxed font-medium">
          The Pinnacle Ledger ensures that every state transition is immutable and cryptographically verified.
        </p>
      </div>
    </div>
  );
};
