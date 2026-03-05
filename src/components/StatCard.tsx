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
  <div className="rounded-lg border border-line bg-surface-card p-4">
    <Icon className={`w-5 h-5 ${iconColor} mx-auto mb-1.5`} aria-hidden="true" />
    <div className="text-xl font-medium text-heading tabular-nums font-mono">{value}</div>
    <div className="text-muted text-xs mt-0.5">{label}</div>
  </div>
);
