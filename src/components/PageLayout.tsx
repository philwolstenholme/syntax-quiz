import type { ReactNode } from 'react';
import clsx from 'clsx';

interface PageLayoutProps {
  children: ReactNode;
  centered?: boolean;
}

export const PageLayout = ({ children, centered = false }: PageLayoutProps) => (
  <div className={clsx(
    'px-4 sm:px-6 pt-[calc(1.5rem+env(safe-area-inset-top))] pb-[calc(5rem+env(safe-area-inset-bottom))] sm:pb-[calc(1.5rem+env(safe-area-inset-bottom))]',
    centered && 'min-h-dvh flex items-center justify-center'
  )}>
    <a
      href="#main-content"
      className="sr-only focus:not-sr-only focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2 focus-visible:ring-offset-[var(--bg)] rounded-md bg-neutral-100 dark:bg-neutral-900 px-3 py-2 text-sm font-medium text-neutral-700 dark:text-neutral-200 transition-colors touch-manipulation"
    >
      Skip to content
    </a>
    <main id="main-content" className={clsx('w-full max-w-3xl mx-auto', centered && 'flex flex-col items-center')}>
      {children}
    </main>
  </div>
);
