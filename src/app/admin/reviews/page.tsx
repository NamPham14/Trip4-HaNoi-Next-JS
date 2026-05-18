"use client";

import React, { useState, useEffect, useCallback } from 'react';
import { MessageSquare, Search, Trash2, Eye, Star } from 'lucide-react';
import { Button } from '@/shared/components/ui/button';
import { Input } from '@/shared/components/ui/input';
import { DataTable } from '@/shared/components/ui/table-data';
import { ColumnDef } from '@tanstack/react-table';
import { reviewService } from '@/features/reviews/services/review-api';
import { Review } from '@/features/reviews/types/review';
import { DeleteConfirmDialog } from '@/shared/components/ui/delete-confirm-dialog';
import { DetailModal } from '@/shared/components/ui/detail-modal';
import { toast } from 'sonner';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/shared/components/ui/select';

export default function ReviewManagementPage() {
  const [data, setData] = useState<Review[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [ratingFilter, setRatingFilter] = useState<string>('all');
  const [pageIndex, setPageIndex] = useState(0);
  const [pageCount, setPageCount] = useState(0);
  const [totalElements, setTotalElements] = useState(0);
  const pageSize = 10;

  const [isDeleteOpen, setIsDeleteOpen] = useState(false);
  const [isDetailOpen, setIsDetailOpen] = useState(false);
  const [selectedReview, setSelectedReview] = useState<Review | null>(null);
  const [deleteLoading, setDeleteLoading] = useState(false);

  const fetchReviews = useCallback(async () => {
    try {
      setLoading(true);
      const res = await reviewService.getAllReviews({
        keyword: searchTerm,
        rating: ratingFilter === 'all' ? undefined : parseInt(ratingFilter),
        page: pageIndex + 1,
        size: pageSize,
      });
      setData(res.data);
      setPageCount(res.totalPages);
      setTotalElements(res.totalElements);
    } catch (error) {
      toast.error("Không thể tải danh sách đánh giá");
    } finally {
      setLoading(false);
    }
  }, [searchTerm, ratingFilter, pageIndex]);

  useEffect(() => {
    const timer = setTimeout(() => fetchReviews(), 500);
    return () => clearTimeout(timer);
  }, [fetchReviews]);

  const handleDelete = async () => {
    if (!selectedReview) return;
    try {
      setDeleteLoading(true);
      await reviewService.deleteReview(selectedReview.id);
      toast.success("Xóa đánh giá thành công");
      setIsDeleteOpen(false);
      fetchReviews();
    } catch (error) {
      toast.error("Lỗi khi xóa đánh giá");
    } finally {
      setDeleteLoading(false);
    }
  };

  const columns: ColumnDef<Review>[] = [
    { 
      accessorKey: "userName", 
      header: "Người dùng",
      cell: ({ row }) => <span className="font-bold text-gray-900">{row.original.userName}</span>
    },
    { 
      accessorKey: "placeName", 
      header: "Địa điểm",
      cell: ({ row }) => <span className="text-gray-600 italic">{row.original.placeName}</span>
    },
    { 
      accessorKey: "rating", 
      header: "Đánh giá",
      cell: ({ row }) => (
        <div className="flex items-center gap-0.5">
          {[...Array(5)].map((_, i) => (
            <Star 
              key={i} 
              size={12} 
              className={i < row.original.rating ? "fill-hanoi-gold text-hanoi-gold" : "text-gray-300"} 
            />
          ))}
        </div>
      )
    },
    { 
      accessorKey: "comment", 
      header: "Nội dung",
      cell: ({ row }) => <p className="max-w-xs truncate text-xs">{row.original.comment}</p>
    },
    { 
      accessorKey: "createdAt", 
      header: "Ngày gửi",
      cell: ({ row }) => <span className="text-[10px] text-gray-500">{new Date(row.original.createdAt).toLocaleDateString('vi-VN')}</span>
    },
    {
      id: "actions",
      header: () => <div className="text-right">Thao tác</div>,
      cell: ({ row }) => (
        <div className="flex justify-end gap-1">
          <Button variant="ghost" size="icon" onClick={() => { setSelectedReview(row.original); setIsDetailOpen(true); }}>
            <Eye size={16} />
          </Button>
          <Button variant="ghost" size="icon" className="text-red-500 hover:bg-red-50" onClick={() => { setSelectedReview(row.original); setIsDeleteOpen(true); }}>
            <Trash2 size={16} />
          </Button>
        </div>
      ),
    },
  ];

  return (
    <div className="p-8 max-w-7xl mx-auto">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-2xl font-bold flex items-center gap-2"><MessageSquare className="text-primary" />Quản lý Đánh giá (Reviews)</h1>
          <p className="text-gray-500">Giám sát và kiểm duyệt các đánh giá từ người dùng.</p>
        </div>
      </div>

      <div className="bg-white p-6 rounded-xl border shadow-sm mb-6 flex flex-wrap gap-4 items-center justify-between">
        <div className="flex flex-wrap gap-4 flex-1">
          <div className="relative max-w-sm w-full">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
            <Input 
              className="pl-10 h-11" 
              placeholder="Tìm theo nội dung, địa điểm..." 
              value={searchTerm} 
              onChange={(e) => { setSearchTerm(e.target.value); setPageIndex(0); }} 
            />
          </div>
          
          <Select value={ratingFilter} onValueChange={(val) => { setRatingFilter(val); setPageIndex(0); }}>
            <SelectTrigger className="w-[180px] h-11">
              <SelectValue placeholder="Lọc theo sao" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Tất cả đánh giá</SelectItem>
              <SelectItem value="5">5 sao ⭐⭐⭐⭐⭐</SelectItem>
              <SelectItem value="4">4 sao ⭐⭐⭐⭐</SelectItem>
              <SelectItem value="3">3 sao ⭐⭐⭐</SelectItem>
              <SelectItem value="2">2 sao ⭐⭐</SelectItem>
              <SelectItem value="1">1 sao ⭐</SelectItem>
            </SelectContent>
          </Select>
        </div>
        
        <div className="text-sm font-medium">Tổng số: <strong className="text-primary">{totalElements}</strong> đánh giá</div>
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
        title="Chi tiết đánh giá" 
        data={selectedReview} 
        fields={[
            { label: "ID", key: "id" },
            { label: "Người dùng", key: "userName" },
            { label: "Địa điểm", key: "placeName" },
            { 
              label: "Xếp hạng", 
              key: "rating", 
              render: (val: number) => (
                <div className="flex items-center gap-1">
                  <span className="font-bold">{val}</span>
                  <Star size={14} className="fill-hanoi-gold text-hanoi-gold" />
                </div>
              )
            },
            { label: "Nội dung", key: "comment" },
            { 
              label: "Hình ảnh", 
              key: "imageUrl", 
              render: (val: string) => val ? <img src={val} className="max-w-xs rounded-xl shadow-sm border" alt="Review" /> : "Không có hình ảnh"
            },
            { label: "Ngày tạo", key: "createdAt", render: (val: string) => new Date(val).toLocaleString('vi-VN') }
        ]} 
      />

      <DeleteConfirmDialog 
        isOpen={isDeleteOpen} 
        onClose={() => setIsDeleteOpen(false)} 
        title="Xóa đánh giá này?" 
        description="Hành động này sẽ gỡ bỏ đánh giá vĩnh viễn khỏi hệ thống. Bạn có chắc chắn muốn tiếp tục?" 
        onConfirm={handleDelete} 
        isLoading={deleteLoading} 
      />
    </div>
  );
}
