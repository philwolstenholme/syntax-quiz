import clsx from "clsx";
import type { ButtonHTMLAttributes, ReactNode } from "react";

const VARIANTS = {
  primary:
    "w-full bg-neutral-900 text-neutral-100 dark:bg-neutral-100 dark:text-neutral-900 font-medium text-sm px-4 py-2.5 rounded-lg hover:bg-neutral-700 dark:hover:bg-white transition-colors duration-150 flex items-center justify-center gap-2 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2 focus-visible:ring-offset-[var(--bg)] touch-manipulation",
  secondary:
    "w-full bg-transparent border border-neutral-300 text-neutral-700 dark:border-neutral-800 dark:text-neutral-300 font-medium text-sm px-4 py-2.5 rounded-lg hover:bg-neutral-100 hover:border-neutral-400 dark:hover:bg-neutral-900 dark:hover:border-neutral-700 transition-colors duration-150 flex items-center justify-center gap-2 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2 focus-visible:ring-offset-[var(--bg)] touch-manipulation",
};

export function completionButtonClass(variant: "primary" | "secondary"): string {
  return VARIANTS[variant];
}

interface CompletionButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "primary" | "secondary";
  children: ReactNode;
}

export const CompletionButton = ({
  variant = "secondary",
  children,
  className,
  ...props
}: CompletionButtonProps) => (
  <button type="button" {...props} className={clsx(VARIANTS[variant], className)}>
    {children}
  </button>
);
