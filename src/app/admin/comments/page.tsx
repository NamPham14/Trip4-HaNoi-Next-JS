/* eslint-disable @typescript-eslint/no-explicit-any */
'use client'

import React, { useState, useEffect, useCallback } from 'react'
import { 
  Trash2, 
  MessageSquare, 
  Search, 
  Eye, 
  Clock, 
  User as UserIcon,
  Loader2
} from 'lucide-react'
import { Button } from '@/shared/components/ui/button'
import { Input } from '@/shared/components/ui/input'
import { DataTable } from '@/shared/components/ui/table-data'
import { ColumnDef } from '@tanstack/react-table'
import { Avatar, AvatarFallback, AvatarImage } from '@/shared/components/ui/avatar'
import { DeleteConfirmDialog } from '@/shared/components/ui/delete-confirm-dialog'
import { DetailModal } from '@/shared/components/ui/detail-modal'
import { toast } from 'sonner'
import { commentService, Comment } from '@/features/posts/services/comment-api'

export default function AdminCommentsPage() {
  // Data State
  const [comments, setComments] = useState<Comment[]>([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState('')
  const [pageIndex, setPageIndex] = useState(0)
  const [pageCount, setPageCount] = useState(0)
  const [totalElements, setTotalElements] = useState(0)
  const pageSize = 10

  // Modal State
  const [isDeleteOpen, setIsDeleteOpen] = useState(false)
  const [isDetailOpen, setIsDetailOpen] = useState(false)
  const [selectedComment, setSelectedComment] = useState<Comment | null>(null)
  const [formLoading, setFormLoading] = useState(false)

  const fetchAllComments = useCallback(async () => {
    try {
      setLoading(true)
      const data = await commentService.getAllComments(pageIndex + 1, pageSize)
      setComments(data.data)
      setPageCount(data.totalPages)
      setTotalElements(data.totalElements)
    } catch (error) {
      toast.error('Không thể tải danh sách bình luận')
    } finally {
      setLoading(false)
    }
  }, [pageIndex])

  useEffect(() => {
    // Basic debounce for search if needed, but here we just fetch based on pageIndex
    // We use an async wrapper to ensure the state update (setLoading) is not synchronous in the effect
    const init = async () => {
      await Promise.resolve()
      fetchAllComments()
    }
    init()
  }, [fetchAllComments])

  const columns: ColumnDef<Comment>[] = [
    { 
      accessorKey: "id", 
      header: "ID",
      cell: ({ row }) => <span className="text-xs font-bold text-zinc-400">#{row.original.id}</span>
    },
    { 
      accessorKey: "username", 
      header: "Người dùng",
      cell: ({ row }) => (
        <div className="flex items-center gap-3">
          <Avatar className="h-8 w-8 border shadow-sm">
            <AvatarImage src={row.original.avatar} />
            <AvatarFallback className="bg-zinc-100 text-zinc-400 text-[10px] font-black">
              {row.original.username.charAt(0).toUpperCase()}
            </AvatarFallback>
          </Avatar>
          <span className="text-sm font-bold text-zinc-900">{row.original.username}</span>
        </div>
      )
    },
    { 
      accessorKey: "content", 
      header: "Nội dung bình luận",
      cell: ({ row }) => (
        <p className="text-sm text-zinc-600 line-clamp-1 max-w-[300px]">
          {row.original.content}
        </p>
      )
    },
    { 
      accessorKey: "createdAt", 
      header: "Ngày đăng",
      cell: ({ row }) => (
        <div className="flex items-center gap-1.5 text-zinc-500">
          <Clock size={14} />
          <span className="text-xs font-medium">
            {new Date(row.original.createdAt).toLocaleDateString('vi-VN')}
          </span>
        </div>
      )
    },
    {
      id: "actions",
      header: () => <div className="text-right">Thao tác</div>,
      cell: ({ row }) => (
        <div className="flex justify-end gap-1">
          <Button 
            variant="ghost" 
            size="icon" 
            onClick={() => { setSelectedComment(row.original); setIsDetailOpen(true); }}
            title="Xem chi tiết"
          >
            <Eye size={16} />
          </Button>
          <Button 
            variant="ghost" 
            size="icon" 
            className="text-red-500 hover:bg-red-50" 
            onClick={() => { setSelectedComment(row.original); setIsDeleteOpen(true); }}
            title="Xóa bình luận"
          >
            <Trash2 size={16} />
          </Button>
        </div>
      ),
    },
  ]

  // Client-side filtering for display if search term exists
  const displayData = searchTerm 
    ? comments.filter(c => 
        c.content.toLowerCase().includes(searchTerm.toLowerCase()) || 
        c.username.toLowerCase().includes(searchTerm.toLowerCase())
      )
    : comments

  return (
    <div className="p-8 max-w-7xl mx-auto space-y-6">
      <div className="flex justify-between items-center mb-4">
        <div>
          <h1 className="text-2xl font-black text-zinc-900 flex items-center gap-2">
            <MessageSquare className="text-hanoi-red" />
            Quản lý Bình luận
          </h1>
          <p className="text-gray-500 font-medium">Giám sát và kiểm duyệt các cuộc thảo luận trên toàn hệ thống.</p>
        </div>
        <div className="text-sm text-gray-500">
          Tổng cộng: <strong>{totalElements}</strong> bình luận
        </div>
      </div>

      <div className="bg-white p-6 rounded-xl border shadow-sm mb-6 flex justify-between items-center">
        <div className="relative max-w-sm w-full">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
          <Input 
            className="pl-10 h-10 rounded-xl" 
            placeholder="Tìm kiếm nội dung hoặc người dùng..." 
            value={searchTerm} 
            onChange={(e) => setSearchTerm(e.target.value)} 
          />
        </div>
      </div>

      <DataTable 
        columns={columns} 
        data={displayData} 
        pageCount={pageCount} 
        pageIndex={pageIndex} 
        onPageChange={setPageIndex} 
        isLoading={loading} 
      />

      {/* Detail View Modal */}
      <DetailModal 
        isOpen={isDetailOpen} 
        onClose={() => setIsDetailOpen(false)} 
        title="Chi tiết bình luận" 
        data={selectedComment} 
        fields={[
            { label: "ID", key: "id" },
            { label: "Người dùng", key: "username" },
            { label: "Nội dung", key: "content" },
            { label: "Ngày đăng", key: "createdAt", render: (val) => new Date(val).toLocaleString('vi-VN') },
            { label: "Bài viết ID", key: "postId" }
        ]}
      />

      {/* Delete Confirmation Dialog */}
      <DeleteConfirmDialog 
        isOpen={isDeleteOpen} 
        onClose={() => setIsDeleteOpen(false)} 
        title="Xóa bình luận?"
        description="Hành động này sẽ xóa vĩnh viễn bình luận này khỏi hệ thống. Bạn không thể hoàn tác."
        onConfirm={async () => {
          try {
            setFormLoading(true)
            await commentService.deleteComment(selectedComment!.id)
            toast.success("Xóa bình luận thành công")
            setIsDeleteOpen(false)
            fetchAllComments()
          } catch (e: any) {
            toast.error(e.response?.data?.message || "Lỗi khi xóa bình luận")
          } finally {
            setFormLoading(false)
          }
        }} 
        isLoading={formLoading} 
      />
    </div>
  )
}
