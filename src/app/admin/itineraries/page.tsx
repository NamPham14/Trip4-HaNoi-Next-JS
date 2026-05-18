/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import React, { useState, useEffect, useCallback } from 'react';
import { Calendar, Search, Trash2, Eye, MapPin, Users, Wallet, Plus, Sparkles } from 'lucide-react';
import { Button } from '@/shared/components/ui/button';
import { Input } from '@/shared/components/ui/input';
import { DataTable } from '@/shared/components/ui/table-data';
import { ColumnDef } from '@tanstack/react-table';
import { itineraryService } from '@/features/itinerary/services/itinerary-api';
import { Itinerary } from '@/features/itinerary/types/itinerary';
import { DeleteConfirmDialog } from '@/shared/components/ui/delete-confirm-dialog';
import { DetailModal } from '@/shared/components/ui/detail-modal';
import { toast } from 'sonner';
import { useRouter } from 'next/navigation';
import { Badge } from '@/shared/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/shared/components/ui/select';
import { AdminItineraryModal } from '@/features/itinerary/components/AdminItineraryModal';
import { Edit, CheckCircle } from 'lucide-react';
import { useUser } from '@/features/auth/hooks/use-auth';

export default function ItineraryManagementPage() {
  const router = useRouter();
  const { user: currentUser } = useUser();
  const [data, setData] = useState<Itinerary[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [isSampleFilter, setIsSampleFilter] = useState<boolean | undefined>(undefined);
  const [statusFilter, setStatusFilter] = useState<string | undefined>(undefined);
  const [pageIndex, setPageIndex] = useState(0);
  const [pageCount, setPageCount] = useState(0);
  const [totalElements, setTotalElements] = useState(0);
  const pageSize = 10;

  const [isDeleteOpen, setIsDeleteOpen] = useState(false);
  const [isDetailOpen, setIsDetailOpen] = useState(false);
  const [isAdminModalOpen, setIsAdminModalOpen] = useState(false);
  const [selectedItinerary, setSelectedItinerary] = useState<Itinerary | null>(null);
  const [deleteLoading, setDeleteLoading] = useState(false);

  const fetchItineraries = useCallback(async () => {
    try {
      setLoading(true);
      const res = await itineraryService.getAllItinerariesAdmin({
        keyword: searchTerm,
        isSample: isSampleFilter,
        status: statusFilter,
        page: pageIndex + 1,
        size: pageSize,
      });
      setData(res.data);
      setPageCount(res.totalPages);
      setTotalElements(res.totalElements);
    } catch (error) {
      toast.error("Không thể tải danh sách lịch trình");
    } finally {
      setLoading(false);
    }
  }, [searchTerm, pageIndex, isSampleFilter, statusFilter]);

  useEffect(() => {
    const timer = setTimeout(() => fetchItineraries(), 500);
    return () => clearTimeout(timer);
  }, [fetchItineraries]);

  const handleDelete = async () => {
    if (!selectedItinerary) return;
    try {
      setDeleteLoading(true);
      await itineraryService.deleteItinerary(selectedItinerary.id);
      toast.success("Xóa lịch trình thành công");
      setIsDeleteOpen(false);
      fetchItineraries();
    } catch (error) {
      toast.error("Lỗi khi xóa: Chỉ được xóa lịch trình do hệ thống tạo!");
    } finally {
      setDeleteLoading(false);
    }
  };

  const handleQuickPublish = async (itinerary: Itinerary) => {
    try {
      await itineraryService.updateItinerary(itinerary.id, {
        status: 'PUBLISHED'
      });
      toast.success("Đã công khai lịch trình!");
      // QUAN TRỌNG: Gọi lại fetchItineraries để UI cập nhật
      fetchItineraries();
    } catch (error) {
      toast.error("Không thể công khai lịch trình");
    }
  };

  const columns: ColumnDef<Itinerary>[] = [
    { 
      accessorKey: "title", 
      header: "Tên lịch trình",
      cell: ({ row }) => (
        <div className="flex flex-col">
            <span className="font-bold text-gray-900">{row.original.title}</span>
            {row.original.isSample && (
                <div className="flex items-center gap-1 text-[10px] text-hanoi-red font-black uppercase mt-1">
                    <Sparkles size={10} /> Lịch trình mẫu
                </div>
            )}
        </div>
      )
    },
    { 
      accessorKey: "status", 
      header: "Trạng thái",
      cell: ({ row }) => {
        const status = row.original.status;
        return (
          <Badge 
            variant={status === 'PUBLISHED' ? "default" : status === 'DRAFT' ? "outline" : "secondary"}
            className={status === 'PUBLISHED' ? "bg-green-500 hover:bg-green-600" : ""}
          >
            {status}
          </Badge>
        );
      }
    },
    { 
      accessorKey: "userName", 
      header: "Người tạo",
      cell: ({ row }) => (
        <Badge variant={row.original.isSample ? "default" : "outline"} className={row.original.isSample ? "bg-hanoi-red" : ""}>
            {row.original.userName || "N/A"}
        </Badge>
      )
    },
    { 
      accessorKey: "days", 
      header: "Số ngày",
      cell: ({ row }) => <span className="bg-blue-50 text-blue-700 px-2 py-1 rounded-full text-[10px] font-bold border border-blue-100">{row.original.days} ngày</span>
    },
    { 
      accessorKey: "numberOfPeople", 
      header: "Số người",
      cell: ({ row }) => (
        <div className="flex items-center gap-1 text-zinc-500">
          <Users size={14} />
          <span className="text-xs">{row.original.numberOfPeople}</span>
        </div>
      )
    },
    { 
      accessorKey: "budget", 
      header: "Ngân sách",
      cell: ({ row }) => (
        <div className="flex items-center gap-1 text-green-600 font-bold">
          <Wallet size={14} />
          <span className="text-xs">{row.original.budget?.toLocaleString()}đ</span>
        </div>
      )
    },
    {
      id: "actions",
      header: () => <div className="text-right">Thao tác</div>,
      cell: ({ row }) => {
        const itinerary = row.original;
        // Quyền quản trị: Nếu là Sample HOẶC được tạo bởi Admin hiện tại (hoặc bất kỳ ai có role ADMIN)
        // Vì đây là trang Admin, chúng ta cho phép sửa bất kỳ Sample nào hoặc do chính user admin này tạo.
        const canManage = itinerary.isSample || itinerary.userName?.toLowerCase().includes('admin');

        return (
          <div className="flex justify-end gap-1">
            {/* Quick Publish - Only if can manage and is Draft */}
            {canManage && itinerary.status === 'DRAFT' && (
              <Button variant="ghost" size="icon" className="text-green-600 hover:bg-green-50" onClick={() => handleQuickPublish(itinerary)} title="Công khai nhanh">
                <CheckCircle size={16} />
              </Button>
            )}

            {/* View - Always */}
            <Button variant="ghost" size="icon" onClick={() => { setSelectedItinerary(itinerary); setIsDetailOpen(true); }}>
              <Eye size={16} />
            </Button>

            {/* Edit & Delete - Only if can manage */}
            {canManage && (
              <>
                <Button variant="ghost" size="icon" className="text-blue-500 hover:bg-blue-50" onClick={() => { setSelectedItinerary(itinerary); setIsAdminModalOpen(true); }}>
                  <Edit size={16} />
                </Button>
                <Button variant="ghost" size="icon" className="text-red-500 hover:bg-red-50" onClick={() => { setSelectedItinerary(itinerary); setIsDeleteOpen(true); }}>
                  <Trash2 size={16} />
                </Button>
              </>
            )}
          </div>
        );
      },
    },
  ];

  return (
    <div className="p-8 max-w-7xl mx-auto">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-2xl font-bold flex items-center gap-2"><Calendar className="text-primary" />Quản lý Lịch trình (Itineraries)</h1>
          <p className="text-gray-500">Giám sát lịch trình người dùng và tạo lịch trình mẫu quảng bá.</p>
        </div>
        <Button onClick={() => { setSelectedItinerary(null); setIsAdminModalOpen(true); }} className="gap-2 bg-hanoi-red hover:bg-[#6D1616]">
            <Plus size={18} /> Tạo lịch trình mẫu
        </Button>
      </div>

      <div className="bg-white p-6 rounded-xl border shadow-sm mb-6 flex flex-wrap gap-4 justify-between items-center">
        <div className="flex flex-wrap gap-4 items-center flex-1">
          <div className="relative max-w-sm w-full">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
            <Input 
              className="pl-10 h-11" 
              placeholder="Tìm theo tên lịch trình, người tạo..." 
              value={searchTerm} 
              onChange={(e) => { setSearchTerm(e.target.value); setPageIndex(0); }} 
            />
          </div>

          <Select 
            value={isSampleFilter === undefined ? "all" : isSampleFilter.toString()} 
            onValueChange={(val) => {
              setIsSampleFilter(val === "all" ? undefined : val === "true");
              setPageIndex(0);
            }}
          >
            <SelectTrigger className="w-[180px] h-11">
              <SelectValue placeholder="Loại lịch trình" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Tất cả loại</SelectItem>
              <SelectItem value="true">Lịch trình mẫu</SelectItem>
              <SelectItem value="false">Lịch trình User</SelectItem>
            </SelectContent>
          </Select>

          <Select 
            value={statusFilter || "all"} 
            onValueChange={(val) => {
              setStatusFilter(val === "all" ? undefined : val);
              setPageIndex(0);
            }}
          >
            <SelectTrigger className="w-[180px] h-11">
              <SelectValue placeholder="Trạng thái" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Tất cả trạng thái</SelectItem>
              <SelectItem value="DRAFT">Bản nháp</SelectItem>
              <SelectItem value="PUBLISHED">Công khai</SelectItem>
              <SelectItem value="ARCHIVED">Lưu trữ</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <div className="text-sm font-medium whitespace-nowrap">Tổng số: <strong className="text-primary">{totalElements}</strong> lịch trình</div>
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
        title="Chi tiết lịch trình" 
        data={selectedItinerary} 
        fields={[
            { label: "ID", key: "id" },
            { label: "Tên lịch trình", key: "title" },
            { label: "Mô tả", key: "description" },
            { 
              label: "Ảnh bìa", 
              key: "coverImage", 
              render: (val: string) => val ? <img src={val} className="w-full h-40 object-cover rounded-lg mt-2" alt="Cover" /> : "N/A"
            },
            { label: "Người tạo", key: "userName" },
            { label: "Số ngày", key: "days" },
            { label: "Số người", key: "numberOfPeople" },
            { 
              label: "Ngân sách", 
              key: "budget", 
              render: (val: number) => <span className="font-bold text-green-600">{val?.toLocaleString()}đ</span> 
            },
            { 
              label: "Lịch trình chi tiết", 
              key: "itineraryDays", 
              render: (val: any[]) => (
                <div className="space-y-4 mt-2">
                  {val?.map((day: any) => (
                    <div key={day.dayNumber} className="border rounded-xl p-4 bg-gray-50">
                      <h4 className="font-bold text-sm mb-2 text-primary">Ngày {day.dayNumber}</h4>
                      <div className="space-y-2">
                        {day.places?.map((p: any) => (
                          <div key={p.id} className="flex items-center gap-2 bg-white p-2 rounded-lg border text-xs">
                            <span className="w-5 h-5 flex items-center justify-center bg-zinc-100 rounded-full font-bold">{p.orderIndex}</span>
                            <MapPin size={12} className="text-hanoi-red" />
                            <span className="font-medium">{p.placeName}</span>
                            <span className="ml-auto text-zinc-400">{p.session}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              )
            },
            { label: "Ngày tạo", key: "createdAt", render: (val: string) => new Date(val).toLocaleString('vi-VN') }
        ]} 
      />

      <DeleteConfirmDialog 
        isOpen={isDeleteOpen} 
        onClose={() => setIsDeleteOpen(false)} 
        title="Xóa lịch trình này?" 
        description="Lịch trình sẽ bị xóa vĩnh viễn khỏi tài khoản của người dùng. Bạn có chắc chắn?" 
        onConfirm={handleDelete} 
        isLoading={deleteLoading} 
      />

      <AdminItineraryModal
        key={isAdminModalOpen ? `itinerary-${selectedItinerary?.id || 'new'}` : 'closed'}
        isOpen={isAdminModalOpen}
        onClose={() => setIsAdminModalOpen(false)}
        itinerary={selectedItinerary}
        onSuccess={fetchItineraries}
      />
    </div>
  );
}
