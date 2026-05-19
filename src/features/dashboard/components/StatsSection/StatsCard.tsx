import React from 'react';
import { LucideIcon, ArrowUpRight, ArrowDownRight } from 'lucide-react';
import Link from 'next/link';

interface StatsCardProps {
  label: string;
  value: number | string;
  growth?: number;
  icon: LucideIcon;
  color: string;
  loading?: boolean;
  href?: string;
}

export const StatsCard: React.FC<StatsCardProps> = ({ 
  label, 
  value, 
  growth, 
  icon: Icon, 
  color,
  loading = false,
  href
}) => {
  if (loading) {
    return (
      <div className="bg-white p-6 rounded-xl border shadow-sm flex items-center gap-4 animate-pulse">
        <div className="p-4 rounded-lg bg-gray-200 w-14 h-14"></div>
        <div className="space-y-2">
          <div className="h-4 bg-gray-200 rounded w-20"></div>
          <div className="h-8 bg-gray-200 rounded w-24"></div>
        </div>
      </div>
    );
  }

  const CardContent = (
    <div className={`bg-white p-6 rounded-xl border shadow-sm flex items-center gap-4 transition-all ${href ? 'hover:shadow-md hover:border-primary/30 cursor-pointer group' : ''}`}>
      <div className={`p-4 rounded-lg transition-colors ${color} ${href ? 'group-hover:opacity-80' : ''}`}>
        <Icon size={24} />
      </div>
      <div>
        <p className="text-sm text-gray-500 font-medium">{label}</p>
        <div className="flex items-baseline gap-2">
          <h3 className="text-2xl font-bold">
            {typeof value === 'number' ? value.toLocaleString() : value}
          </h3>
          {growth !== undefined && (
            <span className={`flex items-center text-xs font-bold ${growth >= 0 ? 'text-green-600' : 'text-red-600'}`}>
              {growth >= 0 ? <ArrowUpRight size={14} /> : <ArrowDownRight size={14} />}
              {Math.abs(growth)}%
            </span>
          )}
        </div>
      </div>
    </div>
  );

  if (href) {
    return (
      <Link href={href}>
        {CardContent}
      </Link>
    );
  }

  return CardContent;
};
