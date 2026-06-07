import React from 'react';
import { LucideIcon, ArrowUpRight, ArrowDownRight } from 'lucide-react';
import Link from 'next/link';
import { cn } from '@/shared/lib/utils';

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
    <div className={cn(
        "bg-white p-5 rounded-2xl border border-gray-100/50 shadow-[var(--shadow-soft)] flex items-center gap-4 transition-all duration-300",
        href ? "hover:shadow-[var(--shadow-glass)] hover:-translate-y-1 cursor-pointer group" : ""
    )}>
      <div className={cn(
          "p-3.5 rounded-xl transition-all duration-500 shrink-0",
          color,
          href ? "group-hover:scale-110 group-hover:rotate-3" : ""
      )}>
        <Icon size={22} strokeWidth={2.5} />
      </div>
      <div className="min-w-0 flex-1">
        <p className="text-[11px] uppercase tracking-[0.1em] text-gray-400 font-black mb-1 truncate">{label}</p>
        <div className="flex items-baseline gap-1.5 flex-wrap">
          <h3 className={cn(
            "font-black tracking-tight break-all leading-tight text-gray-900",
            typeof value === 'string' && value.length > 12 ? "text-lg" : "text-2xl"
          )}>
            {typeof value === 'number' ? value.toLocaleString() : value}
          </h3>
          {growth !== undefined && (
            <div className={cn(
                "flex items-center px-1.5 py-0.5 rounded-full text-[10px] font-black",
                growth >= 0 ? "bg-green-50 text-green-600" : "bg-red-50 text-red-600"
            )}>
              {growth >= 0 ? <ArrowUpRight size={12} strokeWidth={3} /> : <ArrowDownRight size={12} strokeWidth={3} />}
              {Math.abs(growth)}%
            </div>
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
