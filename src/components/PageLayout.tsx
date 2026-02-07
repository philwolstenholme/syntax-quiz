import type { ReactNode } from 'react';
import clsx from 'clsx';

interface PageLayoutProps {
  children: ReactNode;
  centered?: boolean;
}

export const PageLayout = ({ children, centered = false }: PageLayoutProps) => (
  <div
    className={clsx(
      'min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 py-8 px-6 sm:px-4',
      centered && 'flex items-center justify-center',
    )}
  >
    {children}
  </div>
);
