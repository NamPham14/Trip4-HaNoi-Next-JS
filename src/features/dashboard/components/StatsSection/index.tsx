import React from 'react';
import { Users, MapPin, FileText, Map, AlertCircle, DollarSign, Crown } from 'lucide-react';
import { StatsCard } from './StatsCard';
import { DashboardSummary, ReportResponse } from '../../types';

interface StatsSectionProps {
  summary?: DashboardSummary;
  pendingReports?: ReportResponse[];
  loading: boolean;
}

export const StatsSection: React.FC<StatsSectionProps> = ({ 
  summary, 
  pendingReports = [], 
  loading 
}) => {
  const stats = [
    { 
      label: 'Doanh thu', 
      value: new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(summary?.totalRevenue || 0), 
      icon: DollarSign,
      color: 'bg-emerald-100 text-green-700',
      href: '/admin/payments'
    },
    { 
      label: 'Gói PRO', 
      value: summary?.proUserCount || 0, 
      icon: Crown,
      color: 'bg-yellow-100 text-orange-600',
      href: '/admin/payments'
    },
    { 
      label: 'Người dùng', 
      value: summary?.totalUsers || 0, 
      icon: Users,
      color: 'bg-blue-100 text-blue-600',
      href: '/admin/users'
    },
    { 
      label: 'Địa điểm', 
      value: summary?.totalPlaces || 0, 
      icon: MapPin,
      color: 'bg-green-100 text-green-600',
      href: '/admin/places'
    },
    { 
      label: 'Bài viết', 
      value: summary?.totalPosts || 0, 
      icon: FileText,
      color: 'bg-orange-100 text-orange-600',
      href: '/admin/posts'
    },
    { 
      label: 'Lịch trình', 
      value: summary?.totalItineraries || 0, 
      icon: Map,
      color: 'bg-purple-100 text-purple-600',
      href: '/admin/itineraries'
    },
    { 
      label: 'Báo cáo vi phạm', 
      value: pendingReports.length, 
      icon: AlertCircle,
      color: pendingReports.length > 0 ? 'bg-red-100 text-red-600' : 'bg-gray-100 text-gray-600',
      href: '/admin/reports'
    },
  ];

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-7 gap-4">
      {stats.map((stat) => (
        <StatsCard 
          key={stat.label} 
          {...stat} 
          loading={loading} 
        />
      ))}
    </div>
  );
};
