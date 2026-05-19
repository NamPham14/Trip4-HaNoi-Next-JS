"use client";

import React, { useEffect, useState } from 'react';
import { 
  Users, 
  MapPin, 
  Calendar, 
  TrendingUp, 
  TrendingDown,
  ArrowUpRight,
  ArrowDownRight
} from 'lucide-react';
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer, 
  LineChart, 
  Line,
  PieChart,
  Pie,
  Cell
} from 'recharts';

import { mockDashboardData } from '@/features/dashboard/services/dashboard-api';

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042'];

export default function DashboardPage() {
  const [data, setData] = useState(mockDashboardData);

  const stats = [
    { 
      label: 'Tổng người dùng', 
      value: data.summary.totalUsers, 
      growth: data.summary.userGrowth, 
      icon: Users,
      color: 'bg-blue-100 text-blue-600'
    },
    { 
      label: 'Địa điểm du lịch', 
      value: data.summary.totalPlaces, 
      growth: data.summary.placeGrowth, 
      icon: MapPin,
      color: 'bg-green-100 text-green-600'
    },
    { 
      label: 'Sự kiện sắp tới', 
      value: data.summary.totalEvents, 
      growth: data.summary.eventGrowth, 
      icon: Calendar,
      color: 'bg-purple-100 text-purple-600'
    },
  ];

  return (
    <div className="p-8 space-y-8">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Tổng quan quản trị</h1>
        <p className="text-gray-500">Dữ liệu thống kê hệ thống tính đến ngày hôm nay.</p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {stats.map((stat) => (
          <div key={stat.label} className="bg-white p-6 rounded-xl border shadow-sm flex items-center gap-4">
            <div className={`p-4 rounded-lg ${stat.color}`}>
              <stat.icon size={24} />
            </div>
            <div>
              <p className="text-sm text-gray-500 font-medium">{stat.label}</p>
              <div className="flex items-baseline gap-2">
                <h3 className="text-2xl font-bold" suppressHydrationWarning>
                  {stat.value.toLocaleString()}
                </h3>
                <span className={`flex items-center text-xs font-bold ${stat.growth >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                  {stat.growth >= 0 ? <ArrowUpRight size={14} /> : <ArrowDownRight size={14} />}
                  {Math.abs(stat.growth)}%
                </span>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Charts Row 1 */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div className="bg-white p-6 rounded-xl border shadow-sm">
          <h3 className="text-lg font-bold mb-6">Tăng trưởng người dùng & Địa điểm</h3>
          <div className="h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={data.monthlyGrowth}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} />
                <XAxis dataKey="month" />
                <YAxis />
                <Tooltip />
                <Line type="monotone" dataKey="users" stroke="#3b82f6" strokeWidth={2} name="Người dùng" />
                <Line type="monotone" dataKey="places" stroke="#10b981" strokeWidth={2} name="Địa điểm" />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="bg-white p-6 rounded-xl border shadow-sm">
          <h3 className="text-lg font-bold mb-6">Địa điểm được quan tâm nhiều nhất</h3>
          <div className="h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={data.placeAnalytics.mostVisited} layout="vertical">
                <CartesianGrid strokeDasharray="3 3" horizontal={false} />
                <XAxis type="number" hide />
                <YAxis dataKey="name" type="category" width={120} tick={{ fontSize: 12 }} />
                <Tooltip />
                <Bar dataKey="visits" fill="#3b82f6" radius={[0, 4, 4, 0]} name="Lượt xem" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* Charts Row 2 */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="bg-white p-6 rounded-xl border shadow-sm lg:col-span-1">
          <h3 className="text-lg font-bold mb-6">Phân loại địa điểm</h3>
          <div className="h-[250px]">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={data.placeAnalytics.categoryDistribution}
                  innerRadius={60}
                  outerRadius={80}
                  paddingAngle={5}
                  dataKey="value"
                >
                  {data.placeAnalytics.categoryDistribution.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </div>
          <div className="mt-4 space-y-2">
             {data.placeAnalytics.categoryDistribution.map((entry, index) => (
               <div key={entry.name} className="flex items-center justify-between text-sm">
                 <div className="flex items-center gap-2">
                   <div className="w-3 h-3 rounded-full" style={{ backgroundColor: COLORS[index % COLORS.length] }}></div>
                   <span>{entry.name}</span>
                 </div>
                 <span className="font-bold">{entry.value}%</span>
               </div>
             ))}
          </div>
        </div>

        <div className="bg-white p-6 rounded-xl border shadow-sm lg:col-span-2">
          <h3 className="text-lg font-bold mb-4">Hoạt động gần đây</h3>
          <div className="space-y-6">
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="flex items-start gap-4">
                <div className="w-2 h-2 mt-2 rounded-full bg-primary"></div>
                <div>
                  <p className="text-sm font-medium">Người dùng mới vừa đăng ký: user_{i}@example.com</p>
                  <p className="text-xs text-gray-400">2 giờ trước</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
