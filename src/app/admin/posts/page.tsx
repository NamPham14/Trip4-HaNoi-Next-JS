/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import React, { useState, useEffect, useCallback } from 'react';
import { 
  FileText, 
  User,
  Calendar,
  Image as ImageIcon
} from 'lucide-react';
import { DataTable } from '@/shared/components/ui/table-data';
import { ColumnDef } from '@tanstack/react-table';
import { postManagementService } from '@/features/places/services/post-management-api';
import { PostManagement, PostStatus } from '@/features/places/types/post-management';
import { DeleteConfirmDialog } from '@/shared/components/ui/delete-confirm-dialog';
import { toast } from 'sonner';
import { StatusBadge } from '@/shared/components/ui/status-badge';
import { AdminFilters, FilterOption } from '@/shared/components/ui/admin-filters';
import { TableActions } from '@/shared/components/ui/table-actions';
import Image from 'next/image';
import { PostApprovalModal } from '@/features/posts/components/PostApprovalModal';

export default function PostManagementPage() {
  const [data, setData] = useState<PostManagement[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedStatus, setSelectedStatus] = useState<string>('all');
  
  const [pageIndex, setPageIndex] = useState(0);
  const [pageCount, setPageCount] = useState(0);
  const [totalElements, setTotalElements] = useState(0);

  const [isDeleteOpen, setIsDeleteOpen] = useState(false);
  const [isApprovalOpen, setIsApprovalOpen] = useState(false);
  const [selectedItem, setSelectedItem] = useState<PostManagement | null>(null);
  const [actionLoading, setActionLoading] = useState(false);

  const fetchPosts = useCallback(async () => {
    try {
      setLoading(true);
      const res = await postManagementService.getPostsAdmin({
        keyword: searchTerm,
        status: selectedStatus === 'all' ? undefined : selectedStatus as PostStatus,
        page: pageIndex + 1,
        size: 10,
      });
      setData(res.data);
      setPageCount(res.totalPages);
      setTotalElements(res.totalElements);
    } catch (error) {
      toast.error("Lỗi tải danh sách bài viết");
    } finally {
      setLoading(false);
    }
  }, [searchTerm, selectedStatus, pageIndex]);

  useEffect(() => {
    const timer = setTimeout(() => fetchPosts(), 500);
    return () => clearTimeout(timer);
  }, [fetchPosts]);

  const handleApprovalSuccess = () => {
    setIsApprovalOpen(false);
    fetchPosts();
  };

  const columns: ColumnDef<PostManagement>[] = [
    {
      accessorKey: "title",
      header: "Bài viết",
      cell: ({ row }) => (
        <div className="flex items-center gap-3">
          <div className="relative w-12 h-12 rounded-lg overflow-hidden border bg-gray-50 flex-shrink-0">
            {row.original.images && row.original.images.length > 0 ? (
              <Image src={row.original.images[0].imageUrl} alt={row.original.title} fill className="object-cover" />
            ) : (
              <div className="w-full h-full flex items-center justify-center bg-gray-100 text-gray-400">
                <ImageIcon size={20} />
              </div>
            )}
          </div>
          <div className="flex flex-col max-w-[300px]">
            <span className="font-bold text-gray-900 line-clamp-1">{row.original.title}</span>
            <div className="flex items-center gap-2 text-[10px] text-gray-500">
                <User size={10} /> {row.original.username}
                <span>•</span>
                <Calendar size={10} /> {new Date(row.original.createdAt).toLocaleDateString('vi-VN')}
            </div>
          </div>
        </div>
      ),
    },
    { 
      accessorKey: "status", 
      header: "Trạng thái",
      cell: ({ row }) => <StatusBadge status={row.original.status} type="post" />
    },
    {
      accessorKey: "viewCount",
      header: "Lượt xem",
      cell: ({ row }) => <span className="text-xs font-medium">{row.original.viewCount}</span>
    },
    {
      id: "actions",
      header: () => <div className="text-right">Thao tác</div>,
      cell: ({ row }) => (
        <TableActions 
          onView={() => { setSelectedItem(row.original); setIsApprovalOpen(true); }}
          onDelete={() => { setSelectedItem(row.original); setIsDeleteOpen(true); }}
          viewTitle="Duyệt bài viết"
        />
      ),
    },
  ];

  const statusOptions: FilterOption[] = [
    { label: 'Đang chờ duyệt', value: 'PENDING', icon: <div className="w-2 h-2 rounded-full bg-yellow-400" /> },
    { label: 'Đã phê duyệt', value: 'APPROVED', icon: <div className="w-2 h-2 rounded-full bg-green-500" /> },
    { label: 'Đã từ chối', value: 'REJECTED', icon: <div className="w-2 h-2 rounded-full bg-red-500" /> },
  ];

  return (
    <div className="p-8 max-w-7xl mx-auto">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-2xl font-bold flex items-center gap-2"><FileText className="text-primary" />Kiểm duyệt Bài viết</h1>
          <p className="text-gray-500">Xem và phê duyệt nội dung đóng góp từ cộng đồng.</p>
        </div>
      </div>

      <AdminFilters 
        searchTerm={searchTerm}
        onSearchChange={(val) => { setSearchTerm(val); setPageIndex(0); }}
        searchPlaceholder="Tìm tiêu đề bài viết..."
        statusValue={selectedStatus}
        onStatusChange={(val) => { setSelectedStatus(val); setPageIndex(0); }}
        statusOptions={statusOptions}
        onReset={() => {
          setSearchTerm('');
          setSelectedStatus('all');
          setPageIndex(0);
        }}
        totalElements={totalElements}
        unitName="bài viết"
      />

      <DataTable 
        columns={columns} 
        data={data} 
        pageCount={pageCount} 
        pageIndex={pageIndex} 
        onPageChange={setPageIndex} 
        isLoading={loading} 
      />

      {/* Post Approval & Detail Modal */}
      <PostApprovalModal 
        key={selectedItem?.id || 'none'}
        post={selectedItem}
        isOpen={isApprovalOpen}
        onClose={() => setIsApprovalOpen(false)}
        onSuccess={handleApprovalSuccess}
      />

      <DeleteConfirmDialog 
        isOpen={isDeleteOpen} 
        onClose={() => setIsDeleteOpen(false)} 
        title="Xóa bài viết?" 
        description="Hành động này sẽ xóa vĩnh viễn bài viết khỏi hệ thống và không thể khôi phục." 
        onConfirm={async () => {
           try {
             setActionLoading(true);
             await postManagementService.deletePost(selectedItem!.id);
             toast.success("Đã xóa bài viết");
             setIsDeleteOpen(false);
             fetchPosts();
           } catch (e: any) { toast.error("Lỗi khi xóa bài viết"); }
           finally { setActionLoading(false); }
        }} 
        isLoading={actionLoading} 
      />
    </div>
  );
}
