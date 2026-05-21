"use client";

import React from 'react';
import { RefreshCw, Download } from 'lucide-react';

import { useDashboardData } from '@/features/dashboard/hooks/useDashboardData';
import { StatsSection } from '@/features/dashboard/components/StatsSection';
import { GrowthChart } from '@/features/dashboard/components/AnalyticsSection/GrowthChart';
import { PlaceAnalytics } from '@/features/dashboard/components/AnalyticsSection/PlaceAnalytics';
import { ActivityFeed } from '@/features/dashboard/components/ActivityFeed';

export default function DashboardPage() {
  const { data, pendingReports, loading, error } = useDashboardData();

  if (error) {
    return (
      <div className="p-8 flex flex-col items-center justify-center min-h-[600px] space-y-4">
        <div className="text-red-500 text-xl font-bold">Đã xảy ra lỗi khi tải dữ liệu</div>
        <p className="text-gray-500">{error}</p>
        <button 
          onClick={() => window.location.reload()}
          className="flex items-center gap-2 bg-primary text-white px-4 py-2 rounded-lg"
        >
          <RefreshCw size={18} /> Thử lại
        </button>
      </div>
    );
  }

  return (
    <div className="p-8 space-y-8 animate-in fade-in duration-500">
      {/* Header */}
      <div className="flex justify-between items-end">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Tổng quan quản trị</h1>
          <p className="text-gray-500">Theo dõi hoạt động và hiệu suất của hệ thống Trip4Hanoi.</p>
        </div>
        <div className="flex gap-3">
          <button className="flex items-center gap-2 px-4 py-2 border rounded-lg hover:bg-gray-50 transition-colors">
            <Download size={18} /> Xuất báo cáo
          </button>
          <button 
            onClick={() => window.location.reload()}
            className="flex items-center gap-2 px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary/90 transition-colors shadow-sm"
          >
            <RefreshCw size={18} /> Làm mới
          </button>
        </div>
      </div>

      {/* 1. Stats Overview */}
      <StatsSection 
        summary={data?.summary} 
        pendingReports={pendingReports} 
        loading={loading} 
      />

      {/* 2. Charts Row */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2">
           <PlaceAnalytics 
             topPlaces={data?.places.top10Places || []} 
             sentimentData={data?.places.sentimentByCategory || {}} 
             loading={loading} 
           />
        </div>
        <div className="lg:col-span-1">
          <GrowthChart 
            data={data?.social.postGrowthByMonth || {}} 
            title="Tăng trưởng bài viết" 
            loading={loading} 
          />
        </div>
        <div className="lg:col-span-3">
          <GrowthChart 
            data={data?.operations.revenueGrowth || {}} 
            title="Tăng trưởng doanh thu (VNĐ)" 
            loading={loading}
            color="#10b981"
            isCurrency={true}
          />
        </div>
      </div>

      {/* 3. Operational Row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <ActivityFeed 
          pendingReports={pendingReports} 
          loading={loading} 
        />
        
        {/* Placeholder for System Health or AI Keywords */}
        <div className="bg-white p-6 rounded-xl border shadow-sm">
          <h3 className="text-lg font-bold mb-6">Từ khóa AI tìm kiếm phổ biến</h3>
          <div className="flex flex-wrap gap-2">
            {loading ? (
              [1, 2, 3, 4, 5].map(i => <div key={i} className="h-8 w-20 bg-gray-100 rounded-full animate-pulse"></div>)
            ) : (
              data?.operations.aiTopKeywords.map(keyword => (
                <span key={keyword} className="px-4 py-2 bg-gray-100 hover:bg-gray-200 rounded-full text-sm font-medium transition-colors cursor-default">
                  #{keyword}
                </span>
              ))
            )}
          </div>
          <div className="mt-8">
             <h4 className="text-sm font-semibold text-gray-500 mb-4 uppercase tracking-wider">Hiệu suất lịch trình</h4>
             <div className="space-y-4">
                <div>
                   <div className="flex justify-between text-sm mb-1">
                      <span>Tỷ lệ hoàn thành</span>
                      <span className="font-bold">{data?.itinerary.avgCompletionRate}%</span>
                   </div>
                   <div className="w-full bg-gray-100 h-2 rounded-full overflow-hidden">
                      <div 
                        className="bg-green-500 h-full transition-all duration-1000" 
                        style={{ width: loading ? '0%' : `${data?.itinerary.avgCompletionRate}%` }}
                      ></div>
                   </div>
                </div>
                <div>
                   <div className="flex justify-between text-sm mb-1">
                      <span>Thời gian đi trung bình</span>
                      <span className="font-bold">{data?.itinerary.avgTripDuration} ngày</span>
                   </div>
                   <div className="w-full bg-gray-100 h-2 rounded-full overflow-hidden">
                      <div 
                        className="bg-blue-500 h-full transition-all duration-1000" 
                        style={{ width: loading ? '0%' : '65%' }}
                      ></div>
                   </div>
                </div>
             </div>
          </div>
        </div>
      </div>
    </div>
  );
}
