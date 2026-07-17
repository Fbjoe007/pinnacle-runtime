import React from 'react';

export const Section: React.FC<{ title?: string; children: React.ReactNode }> = ({ title, children }) => (
  <div className="space-y-4">
    {title && <h3 className="text-xs font-bold uppercase tracking-widest text-pinnacle-secondary/60">{title}</h3>}
    {children}
  </div>
);
