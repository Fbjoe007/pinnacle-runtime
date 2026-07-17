import React from 'react';

export const PageContainer: React.FC<{ children: React.ReactNode }> = ({ children }) => (
  <div className="min-h-screen overflow-x-hidden bg-pinnacle-background px-4 py-8 md:px-8">
    <div className="max-w-5xl mx-auto w-full space-y-8">
      {children}
    </div>
  </div>
);
