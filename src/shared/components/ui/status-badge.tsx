"use client";

import React from 'react';
import { 
  CheckCircle, 
  XCircle, 
  Clock, 
  AlertCircle,
  ShieldCheck,
  User as UserIcon
} from 'lucide-react';
import { cn } from '@/shared/lib/utils';

export type BadgeType = 'post' | 'user' | 'event' | 'itinerary' | 'report';

interface StatusBadgeProps {
  status: string;
  type?: BadgeType;
  className?: string;
}

export const StatusBadge: React.FC<StatusBadgeProps> = ({ status, type = 'post', className }) => {
  const s = status.toUpperCase();
  
  let styles = "bg-gray-100 text-gray-600 border-gray-200";
  let icon = <Clock size={12} />;
  const label = status;//let

  // Logic theo từng loại module
  switch (s) {
    case 'APPROVED':
    case 'ACTIVE':
    case 'PUBLISHED':
    case 'COMPLETED':
    case 'SUCCESS':
      styles = "bg-green-50 text-green-700 border-green-100";
      icon = <CheckCircle size={12} />;
      break;
    
    case 'REJECTED':
    case 'INACTIVE':
    case 'CANCELLED':
    case 'BLOCKED':
    case 'DELETED':
      styles = "bg-red-50 text-red-700 border-red-100";
      icon = <XCircle size={12} />;
      break;
    
    case 'PENDING':
    case 'WAITING':
    case 'PROCESSING':
      styles = "bg-yellow-50 text-yellow-700 border-yellow-100";
      icon = <Clock size={12} />;
      break;

    case 'RESOLVED':
      styles = "bg-blue-50 text-blue-700 border-blue-100";
      icon = <ShieldCheck size={12} />;
      break;

    case 'REPORTED':
    case 'WARNING':
      styles = "bg-orange-50 text-orange-700 border-orange-100";
      icon = <AlertCircle size={12} />;
      break;
  }

  return (
    <span className={cn(
      "px-2.5 py-1 rounded-full text-[10px] font-black border flex items-center gap-1.5 w-fit uppercase tracking-wider",
      styles,
      className
    )}>
      {icon}
      {label}
    </span>
  );
};
