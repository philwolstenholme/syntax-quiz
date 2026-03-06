import type { LucideIcon } from 'lucide-react';
import type { ReactNode } from 'react';

interface StatCardProps {
  icon: LucideIcon;
  iconColor: string;
  value: ReactNode;
  label: string;
}

export const StatCard = ({
  icon: Icon,
  iconColor,
  value,
  label,
}: StatCardProps) => (
  <div className="rounded-lg border border-neutral-200 bg-neutral-50 dark:border-neutral-800 dark:bg-neutral-900/50 p-4">
    <Icon className={`w-5 h-5 ${iconColor} mx-auto mb-1.5`} aria-hidden="true" />
    <div className="text-xl font-medium text-neutral-900 dark:text-neutral-100 tabular-nums font-mono">{value}</div>
    <div className="text-neutral-500 dark:text-neutral-400 text-xs mt-0.5">{label}</div>
  </div>
);
