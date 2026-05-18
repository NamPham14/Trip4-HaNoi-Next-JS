/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import React, { useState, useEffect, useCallback } from 'react';
import { 
  FileText, 
  Search, 
  Trash2, 
  Eye, 
  CheckCircle, 
  XCircle, 
  Clock, 
  User,
  Filter,
  Calendar,
  Image as ImageIcon
} from 'lucide-react';
import { Button } from '@/shared/components/ui/button';
import { Input } from '@/shared/components/ui/input';
import { DataTable } from '@/shared/components/ui/table-data';
import { ColumnDef } from '@tanstack/react-table';
import { postManagementService } from '@/features/places/services/post-management-api';
import { PostManagement, PostStatus } from '@/features/places/types/post-management';
import { DeleteConfirmDialog } from '@/shared/components/ui/delete-confirm-dialog';
import { DetailModal } from '@/shared/components/ui/detail-modal';
import { toast } from 'sonner';
import { Label } from '@/shared/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/shared/components/ui/select';
import Image from 'next/image';

export default function PostManagementPage() {
  const [data, setData] = useState<PostManagement[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedStatus, setSelectedStatus] = useState<string>('all');
  
  const [pageIndex, setPageIndex] = useState(0);
  const [pageCount, setPageCount] = useState(0);
  const [totalElements, setTotalElements] = useState(0);

  const [isDeleteOpen, setIsDeleteOpen] = useState(false);
  const [isDetailOpen, setIsDetailOpen] = useState(false);
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

  const handleUpdateStatus = async (id: number, status: PostStatus) => {
    try {
      setActionLoading(true);
      await postManagementService.updateStatus(id, status);
      toast.success(`Đã ${status === 'APPROVED' ? 'duyệt' : 'từ chối'} bài viết`);
      fetchPosts();
    } catch (error: any) {
      toast.error("Lỗi khi cập nhật trạng thái");
    } finally {
      setActionLoading(false);
    }
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
      cell: ({ row }) => {
        const status = row.original.status;
        let styles = "bg-gray-100 text-gray-600";
        let icon = <Clock size={12} />;
        if (status === 'APPROVED') {
            styles = "bg-green-50 text-green-700 border-green-100";
            icon = <CheckCircle size={12} />;
        }
        if (status === 'REJECTED') {
            styles = "bg-red-50 text-red-700 border-red-100";
            icon = <XCircle size={12} />;
        }
        if (status === 'PENDING') {
            styles = "bg-yellow-50 text-yellow-700 border-yellow-100";
            icon = <Clock size={12} />;
        }
        
        return (
          <span className={`px-2 py-1 rounded-full text-[10px] font-bold border flex items-center gap-1 w-fit ${styles}`}>
            {icon}
            {status}
          </span>
        );
      }
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
        <div className="flex justify-end gap-1">
          <Button variant="ghost" size="icon" onClick={() => { setSelectedItem(row.original); setIsDetailOpen(true); }}><Eye size={16} /></Button>
          
          {row.original.status === 'PENDING' && (
              <>
                <Button 
                    variant="ghost" 
                    size="icon" 
                    className="text-green-600 hover:bg-green-50" 
                    onClick={() => handleUpdateStatus(row.original.id, 'APPROVED')}
                    disabled={actionLoading}
                >
                    <CheckCircle size={16} />
                </Button>
                <Button 
                    variant="ghost" 
                    size="icon" 
                    className="text-orange-600 hover:bg-orange-50" 
                    onClick={() => handleUpdateStatus(row.original.id, 'REJECTED')}
                    disabled={actionLoading}
                >
                    <XCircle size={16} />
                </Button>
              </>
          )}

          <Button 
            variant="ghost" 
            size="icon" 
            className="text-red-500 hover:bg-red-50" 
            onClick={() => { setSelectedItem(row.original); setIsDeleteOpen(true); }}
          >
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
          <h1 className="text-2xl font-bold flex items-center gap-2"><FileText className="text-primary" />Kiểm duyệt Bài viết</h1>
          <p className="text-gray-500">Xem và phê duyệt nội dung đóng góp từ cộng đồng.</p>
        </div>
      </div>

      <div className="bg-white p-6 rounded-xl border-2 border-gray-100 shadow-md mb-8 space-y-4">
        <div className="flex flex-col md:flex-row gap-4 items-end">
            <div className="relative flex-1 w-full">
                <Label className="mb-2 block text-xs font-bold uppercase tracking-wider text-gray-500">Tìm kiếm</Label>
                <div className="relative">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                    <Input 
                        className="pl-10 h-11 bg-gray-50/50 border-gray-200 focus:bg-white transition-all font-medium" 
                        placeholder="Tìm tiêu đề bài viết..." 
                        value={searchTerm} 
                        onChange={(e) => { setSearchTerm(e.target.value); setPageIndex(0); }} 
                    />
                </div>
            </div>
            
            <div className="w-full md:w-[260px]">
                <Label className="mb-2 block text-xs font-bold uppercase tracking-wider text-gray-400 ml-1">Lọc theo trạng thái</Label>
                <Select value={selectedStatus} onValueChange={(val) => { setSelectedStatus(val); setPageIndex(0); }}>
                    <SelectTrigger className="h-11 border-2 border-gray-200 bg-gray-100 font-bold text-gray-800 hover:border-primary/50 hover:bg-gray-200 transition-all shadow-sm rounded-xl">
                        <div className="flex items-center gap-2">
                            {selectedStatus === 'all' && <Filter size={16} className="text-gray-500" />}
                            {selectedStatus === 'PENDING' && <Clock size={16} className="text-yellow-600" />}
                            {selectedStatus === 'APPROVED' && <CheckCircle size={16} className="text-green-600" />}
                            {selectedStatus === 'REJECTED' && <XCircle size={16} className="text-red-600" />}
                            <SelectValue placeholder="Chọn trạng thái" />
                        </div>
                    </SelectTrigger>
                    <SelectContent className="rounded-xl border-2 border-gray-100 shadow-xl p-1">
                        <SelectItem value="all" className="rounded-lg focus:bg-primary/5 focus:text-primary transition-colors cursor-pointer py-2.5">
                            <div className="flex items-center gap-2 font-bold">
                                <div className="w-2 h-2 rounded-full bg-gray-300"></div>
                                Tất cả bài viết
                            </div>
                        </SelectItem>
                        <SelectItem value="PENDING" className="rounded-lg focus:bg-yellow-50 focus:text-yellow-700 transition-colors cursor-pointer py-2.5">
                            <div className="flex items-center gap-2 font-bold">
                                <div className="w-2 h-2 rounded-full bg-yellow-400 animate-pulse"></div>
                                Đang chờ duyệt
                            </div>
                        </SelectItem>
                        <SelectItem value="APPROVED" className="rounded-lg focus:bg-green-50 focus:text-green-700 transition-colors cursor-pointer py-2.5">
                            <div className="flex items-center gap-2 font-bold">
                                <div className="w-2 h-2 rounded-full bg-green-500"></div>
                                Đã phê duyệt
                            </div>
                        </SelectItem>
                        <SelectItem value="REJECTED" className="rounded-lg focus:bg-red-50 focus:text-red-700 transition-colors cursor-pointer py-2.5">
                            <div className="flex items-center gap-2 font-bold">
                                <div className="w-2 h-2 rounded-full bg-red-500"></div>
                                Đã từ chối
                            </div>
                        </SelectItem>
                    </SelectContent>
                </Select>
            </div>

            <Button 
                variant="outline" 
                className="h-11 px-4 border-2 border-gray-100 text-gray-500 hover:text-primary hover:border-primary transition-all"
                onClick={() => {
                    setSearchTerm('');
                    setSelectedStatus('all');
                    setPageIndex(0);
                }}
            >
                Đặt lại
            </Button>
        </div>
        <div className="flex items-center gap-2 text-sm text-gray-500 bg-gray-50 w-fit px-3 py-1 rounded-full border border-gray-100">
            <div className="w-1.5 h-1.5 rounded-full bg-blue-500 animate-pulse"></div>
            Có <strong>{totalElements}</strong> bài viết trong hệ thống
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
        title="Nội dung bài viết" 
        data={selectedItem} 
        fields={[
            { label: "Tiêu đề", key: "title" },
            { label: "Người đăng", key: "username" },
            { label: "Trạng thái", key: "status" },
            { label: "Ngày đăng", key: "createdAt", render: (val: string) => new Date(val).toLocaleString('vi-VN') },
            { label: "Nội dung", key: "content", render: (val) => <div className="text-sm p-4 bg-gray-50 rounded-lg border leading-relaxed whitespace-pre-wrap">{val}</div> },
            { label: "Hình ảnh", key: "images", render: (val: any[]) => (
                <div className="grid grid-cols-3 gap-2">
                    {val?.map(img => <img key={img.id} src={img.imageUrl} className="w-full aspect-video object-cover rounded border" />)}
                </div>
            )}
        ]} 
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
