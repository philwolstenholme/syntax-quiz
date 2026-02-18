import type { ReactNode } from 'react';
import clsx from 'clsx';

interface PageLayoutProps {
  children: ReactNode;
  centered?: boolean;
}

export const PageLayout = ({ children, centered = false }: PageLayoutProps) => (
  <div className={clsx(
    'pt-[calc(2rem+env(safe-area-inset-top))] pb-[calc(2rem+env(safe-area-inset-bottom))] pl-[calc(1.5rem+env(safe-area-inset-left))] pr-[calc(1.5rem+env(safe-area-inset-right))] sm:pl-[calc(1rem+env(safe-area-inset-left))] sm:pr-[calc(1rem+env(safe-area-inset-right))]',
    centered && 'flex items-center justify-center'
  )}>
    <a
      href="#main-content"
      className="sr-only focus:not-sr-only focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500 focus-visible:ring-offset-2 focus-visible:ring-offset-blue-50 rounded-lg bg-white px-3 py-2 text-sm font-semibold text-indigo-700 hover:bg-indigo-50 hover:text-indigo-800 transition-colors touch-manipulation"
    >
      Skip to content
    </a>
    <main id="main-content" className={clsx('w-full', centered && 'flex flex-col items-center')}>
      {children}
    </main>
  </div>
);
