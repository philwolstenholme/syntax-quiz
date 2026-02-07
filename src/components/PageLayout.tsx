import type { ReactNode } from 'react';

export const PageLayout = ({ children, centered = false }: { children: ReactNode; centered?: boolean }) => (
  <div className={`min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 py-8 px-6 sm:px-4${centered ? ' flex items-center justify-center' : ''}`}>
    {children}
  </div>
);
