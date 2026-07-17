import React, { useState } from 'react';
import { Shield, Menu, X } from 'lucide-react';

export const Header: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <nav className="bg-[#0B1F3A] border-b border-[#D4AF37]/20 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          <div className="flex items-center gap-3">
            <div className="bg-[#D4AF37] p-2 rounded-lg">
              <Shield className="w-6 h-6 text-[#0B1F3A]" />
            </div>
            <div className="flex flex-col">
              <span className="text-white font-bold tracking-tight text-xl leading-tight">PINNACLE</span>
              <span className="text-[#D4AF37] text-[10px] font-bold tracking-[0.2em] uppercase">Review Group</span>
            </div>
          </div>
          
          {/* Desktop Navigation */}
          <div className="hidden md:block">
            <div className="flex items-baseline space-x-8 text-sm font-semibold">
              <a href="#" className="text-white hover:text-[#D4AF37] transition-colors">VALIDATOR</a>
              <a href="#" className="text-slate-400 hover:text-white transition-colors">LEDGER</a>
              <a href="#" className="text-slate-400 hover:text-white transition-colors">DOCUMENTATION</a>
            </div>
          </div>

          {/* Mobile button */}
          <div className="md:hidden">
            <button onClick={() => setIsOpen(!isOpen)} className="text-slate-400 hover:text-white">
              {isOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      {isOpen && (
        <div className="md:hidden bg-[#0B1F3A] border-t border-[#D4AF37]/10 px-4 pt-2 pb-6 space-y-1">
          <a href="#" className="block px-3 py-4 text-base font-medium text-[#D4AF37] border-b border-[#D4AF37]/10">Validator</a>
          <a href="#" className="block px-3 py-4 text-base font-medium text-slate-300">Ledger</a>
          <a href="#" className="block px-3 py-4 text-base font-medium text-slate-300">Documentation</a>
        </div>
      )}
    </nav>
  );
};
