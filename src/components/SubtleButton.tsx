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
      'text-muted hover:text-secondary hover:bg-surface-hover rounded-md',
      'transition-colors cursor-pointer',
      'disabled:opacity-40 disabled:cursor-not-allowed',
      'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2 focus-visible:ring-offset-surface',
      'touch-manipulation',
      className,
    )}
  >
    {children}
  </button>
);
