import type { ReactNode, ButtonHTMLAttributes } from 'react';
import clsx from 'clsx';

interface SubtleButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  children?: ReactNode;
}

export const SubtleButton = ({ children, className, ...props }: SubtleButtonProps) => (
  <button
    type="button"
    {...props}
    className={clsx(
      'inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium',
      'text-neutral-500 dark:text-neutral-400 hover:text-neutral-700 hover:bg-neutral-100 dark:hover:text-neutral-300 dark:hover:bg-neutral-900 rounded-md',
      'transition-colors cursor-pointer',
      'disabled:opacity-40 disabled:cursor-not-allowed',
      'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2 focus-visible:ring-offset-[var(--bg)]',
      'touch-manipulation',
      className,
    )}
  >
    {children}
  </button>
);
