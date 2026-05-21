/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import React, { useState, useEffect, useCallback } from 'react';
import { 
  CreditCard, 
  Search,
  Filter,
  Eye,
  Calendar,
  User as UserIcon,
  DollarSign
} from 'lucide-react';
import { DataTable } from '@/shared/components/ui/table-data';
import { ColumnDef } from '@tanstack/react-table';
import { adminPaymentApi, AdminPaymentOrder } from '@/features/payment/services/admin-payment-api';
import { DetailModal } from '@/shared/components/ui/detail-modal';
import { toast } from 'sonner';
import { StatusBadge } from '@/shared/components/ui/status-badge';
import { AdminFilters } from '@/shared/components/ui/admin-filters';
import { TableActions } from '@/shared/components/ui/table-actions';

export default function PaymentManagementPage() {
  const [data, setData] = useState<AdminPaymentOrder[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [pageIndex, setPageIndex] = useState(0);
  const [pageCount, setPageCount] = useState(0);
  const [totalElements, setTotalElements] = useState(0);

  const [isDetailOpen, setIsDetailOpen] = useState(false);
  const [selectedItem, setSelectedItem] = useState<AdminPaymentOrder | null>(null);

  const fetchOrders = useCallback(async () => {
    try {
      setLoading(true);
      const res = await adminPaymentApi.getOrders({
        keyword: searchTerm,
        status: statusFilter,
        page: pageIndex + 1,
        size: 10
      });
      setData(res.data);
      setPageCount(res.totalPages);
      setTotalElements(res.totalElements);
    } catch (error) {
      toast.error("Lỗi tải danh sách giao dịch");
    } finally {
      setLoading(false);
    }
  }, [searchTerm, statusFilter, pageIndex]);

  useEffect(() => {
    const timer = setTimeout(() => fetchOrders(), 500);
    return () => clearTimeout(timer);
  }, [fetchOrders]);

  const columns: ColumnDef<AdminPaymentOrder>[] = [
    { 
      accessorKey: "orderCode", 
      header: "Mã Đơn",
      cell: ({ row }) => (
        <div className="font-mono font-bold text-gray-900">{row.original.orderCode}</div>
      )
    },
    { 
      accessorKey: "username", 
      header: "Khách hàng",
      cell: ({ row }) => (
        <div className="flex flex-col">
          <div className="font-bold text-gray-900">{row.original.username}</div>
          <div className="text-[10px] text-gray-500">{row.original.email}</div>
        </div>
      )
    },
    { 
      accessorKey: "packageType", 
      header: "Gói cước",
      cell: ({ row }) => (
        <span className="bg-purple-50 text-purple-700 px-2 py-0.5 rounded text-[10px] font-bold border border-purple-100">
          {row.original.packageType}
        </span>
      )
    },
    { 
      accessorKey: "amount", 
      header: "Số tiền",
      cell: ({ row }) => (
        <div className="font-bold text-gray-900">
          {new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(row.original.amount)}
        </div>
      )
    },
    { 
      accessorKey: "status", 
      header: "Trạng thái",
      cell: ({ row }) => <StatusBadge status={row.original.status} />
    },
    {
      accessorKey: "createdAt",
      header: "Ngày GD",
      cell: ({ row }) => (
        <div className="text-xs text-gray-500">
          {new Date(row.original.createdAt).toLocaleDateString('vi-VN')}
        </div>
      )
    },
    {
      id: "actions",
      header: () => <div className="text-right">Chi tiết</div>,
      cell: ({ row }) => (
        <div className="text-right">
          <button 
            onClick={() => { setSelectedItem(row.original); setIsDetailOpen(true); }}
            className="p-2 hover:bg-gray-100 rounded-lg text-gray-600 transition-colors"
          >
            <Eye size={18} />
          </button>
        </div>
      ),
    },
  ];

  return (
    <div className="p-8 max-w-7xl mx-auto">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-2xl font-bold flex items-center gap-2">
            <CreditCard className="text-primary" /> Quản lý Giao dịch
          </h1>
          <p className="text-gray-500">Xem và quản lý các đơn hàng nâng cấp gói PRO.</p>
        </div>
      </div>

      <div className="mb-6 flex flex-wrap gap-4 items-end bg-white p-4 rounded-2xl border shadow-sm">
        <div className="flex-1 min-w-[300px]">
          <label className="text-xs font-bold text-gray-400 uppercase mb-2 block">Tìm kiếm</label>
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
            <input 
              type="text" 
              placeholder="Tìm theo mã đơn, username..." 
              className="w-full pl-10 pr-4 py-2 rounded-xl border border-gray-200 focus:ring-2 focus:ring-primary/20 outline-none transition-all"
              value={searchTerm}
              onChange={(e) => { setSearchTerm(e.target.value); setPageIndex(0); }}
            />
          </div>
        </div>

        <div className="w-48">
          <label className="text-xs font-bold text-gray-400 uppercase mb-2 block">Trạng thái</label>
          <div className="relative">
            <Filter className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
            <select 
              className="w-full pl-10 pr-4 py-2 rounded-xl border border-gray-200 focus:ring-2 focus:ring-primary/20 outline-none appearance-none bg-white transition-all cursor-pointer"
              value={statusFilter}
              onChange={(e) => { setStatusFilter(e.target.value); setPageIndex(0); }}
            >
              <option value="">Tất cả</option>
              <option value="PENDING">Đang chờ</option>
              <option value="SUCCESS">Thành công</option>
              <option value="CANCELLED">Đã hủy</option>
            </select>
          </div>
        </div>

        <div className="bg-primary/5 px-4 py-2 rounded-xl border border-primary/10">
          <div className="text-[10px] font-bold text-primary uppercase">Tổng số đơn</div>
          <div className="text-xl font-black text-primary">{totalElements}</div>
        </div>
      </div>

      <DataTable 
        columns={columns} 
        data={data} 
        pageCount={pageCount} 
        pageIndex={pageIndex} 
        onPageChange={setPageIndex} 
        isLoading={loading} 
      />

      <DetailModal 
        isOpen={isDetailOpen} 
        onClose={() => setIsDetailOpen(false)} 
        title="Chi tiết giao dịch" 
        data={selectedItem} 
        fields={[
            { label: "Mã đơn hàng", key: "orderCode" },
            { label: "Mã PayOS", key: "payosOrderCode", render: (val: any) => val || "N/A" },
            { 
              label: "Khách hàng", 
              key: "username", 
              render: (val: string, item: any) => (
                <div className="flex flex-col">
                  <span className="font-bold text-gray-900">{val}</span>
                  <span className="text-xs text-gray-500">{item.email}</span>
                </div>
              ) 
            },
            { label: "Gói cước", key: "packageType" },
            { 
              label: "Số tiền", 
              key: "amount", 
              render: (val: number) => new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(val) 
            },
            { 
              label: "Trạng thái", 
              key: "status", 
              render: (val: string) => <StatusBadge status={val} /> 
            },
            { label: "Ngày tạo", key: "createdAt", render: (val: string) => new Date(val).toLocaleString('vi-VN') },
            { label: "Cập nhật lần cuối", key: "updatedAt", render: (val: string) => new Date(val).toLocaleString('vi-VN') },
        ]} 
      />
    </div>
  );
}
