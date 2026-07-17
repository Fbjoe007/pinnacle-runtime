import React from 'react';

export const Card: React.FC<{ children: React.ReactNode; className?: string }> = ({ children, className = "" }) => (
  <div className={`bg-white border border-slate-200 rounded-lg shadow-sm p-6 ${className}`}>
    {children}
  </div>
);
