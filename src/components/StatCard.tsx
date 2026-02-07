import type { LucideIcon } from 'lucide-react';
import type { ReactNode } from 'react';

export const StatCard = ({
  icon: Icon,
  iconColor,
  value,
  label,
}: {
  icon: LucideIcon;
  iconColor: string;
  value: ReactNode;
  label: string;
}) => (
  <div className="bg-gray-50 rounded-xl p-6">
    <Icon className={`w-8 h-8 ${iconColor} mx-auto mb-2`} />
    <div className="text-3xl font-bold text-gray-800">{value}</div>
    <div className="text-gray-600 mt-1">{label}</div>
  </div>
);
