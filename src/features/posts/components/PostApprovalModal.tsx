/* eslint-disable @typescript-eslint/no-explicit-any */
'use client'

import React, { useState } from 'react'
import { 
  CheckCircle, 
  XCircle, 
  User, 
  Calendar, 
  FileText, 
  Loader2,
  MapPin
} from 'lucide-react'
import { Button } from '@/shared/components/ui/button'
import { 
  Dialog, 
  DialogContent, 
  DialogHeader, 
  DialogTitle,
  DialogFooter
} from '@/shared/components/ui/dialog'
import { PostManagement, PostStatus } from '@/features/places/types/post-management'
import { postManagementService } from '@/features/places/services/post-management-api'
import { toast } from 'sonner'
import Image from 'next/image'

interface PostApprovalModalProps {
  post: PostManagement | null
  isOpen: boolean
  onClose: () => void
  onSuccess: () => void
}

export const PostApprovalModal: React.FC<PostApprovalModalProps> = ({
  post,
  isOpen,
  onClose,
  onSuccess,
}) => {
  const [loading, setLoading] = useState(false)

  if (!post) return null

  const handleUpdateStatus = async (status: PostStatus) => {
    try {
      setLoading(true)
      await postManagementService.updateStatus(post.id, status)
      toast.success(`Đã ${status === 'APPROVED' ? 'phê duyệt' : 'từ chối'} bài viết thành công`)
      onSuccess()
    } catch (error: any) {
      toast.error(error.response?.data?.message || "Lỗi khi cập nhật trạng thái")
    } finally {
      setLoading(false)
    }
  }

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="sm:max-w-[700px] max-h-[90vh] flex flex-col p-0 gap-0 overflow-hidden bg-white">
        <DialogHeader className="p-6 border-b bg-gray-50/50">
          <div className="flex items-center gap-2 text-primary mb-1">
            <FileText size={20} />
            <span className="text-xs font-bold uppercase tracking-wider">Chi tiết bài viết cần duyệt</span>
          </div>
          <DialogTitle className="text-xl font-black text-zinc-900 leading-tight">
            {post.title}
          </DialogTitle>
          <div className="flex flex-wrap items-center gap-4 mt-3 text-sm text-zinc-500 font-medium">
            <div className="flex items-center gap-1.5">
              <User size={14} className="text-zinc-400" />
              <span>{post.username}</span>
            </div>
            <div className="flex items-center gap-1.5">
              <Calendar size={14} className="text-zinc-400" />
              <span>{new Date(post.createdAt).toLocaleString('vi-VN')}</span>
            </div>
            <div className="flex items-center gap-1.5">
              <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold border ${
                post.status === 'APPROVED' ? 'bg-green-50 text-green-700 border-green-100' :
                post.status === 'REJECTED' ? 'bg-red-50 text-red-700 border-red-100' :
                'bg-yellow-50 text-yellow-700 border-yellow-100'
              }`}>
                {post.status}
              </span>
            </div>
          </div>
        </DialogHeader>

        <div className="flex-1 overflow-y-auto p-6 space-y-6 custom-scrollbar">
          {/* Content Section */}
          <div className="space-y-2">
            <h4 className="text-xs font-black text-zinc-400 uppercase tracking-widest">Nội dung bài viết</h4>
            <div className="bg-zinc-50 p-4 rounded-xl border border-zinc-100 text-zinc-700 text-sm leading-relaxed whitespace-pre-wrap italic">
              {post.content}
            </div>
          </div>

          {/* Tagged Places */}
          {post.taggedPlaces && post.taggedPlaces.length > 0 && (
            <div className="space-y-2">
              <h4 className="text-xs font-black text-zinc-400 uppercase tracking-widest">Địa điểm gắn thẻ</h4>
              <div className="flex flex-wrap gap-2">
                {post.taggedPlaces.map((place) => (
                  <span key={place.id} className="flex items-center gap-1 text-[10px] bg-blue-50 text-blue-600 px-2 py-1 rounded-full font-bold border border-blue-100">
                    <MapPin size={10} /> {place.name}
                  </span>
                ))}
              </div>
            </div>
          )}

          {/* Images Section */}
          {post.images && post.images.length > 0 && (
            <div className="space-y-3">
              <h4 className="text-xs font-black text-zinc-400 uppercase tracking-widest">Hình ảnh trải nghiệm</h4>
              <div className="grid grid-cols-2 gap-3">
                {post.images.map((img) => (
                  <div key={img.id} className="relative aspect-video rounded-xl overflow-hidden border shadow-sm group">
                    <Image 
                      src={img.imageUrl} 
                      alt={post.title} 
                      fill 
                      className="object-cover transition-transform group-hover:scale-105" 
                    />
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        <DialogFooter className="p-4 border-t bg-gray-50 flex items-center justify-between gap-3">
          <Button variant="outline" onClick={onClose} disabled={loading} className="font-bold">
            Đóng
          </Button>
          
          <div className="flex gap-2">
            {post.status === 'PENDING' && (
              <>
                <Button 
                  variant="outline" 
                  className="bg-white border-red-200 text-red-600 hover:bg-red-50 hover:text-red-700 font-bold gap-2"
                  onClick={() => handleUpdateStatus('REJECTED')}
                  disabled={loading}
                >
                  {loading ? <Loader2 size={16} className="animate-spin" /> : <XCircle size={16} />}
                  Từ chối
                </Button>
                <Button 
                  className="bg-green-600 hover:bg-green-700 text-white font-bold gap-2 shadow-lg shadow-green-200"
                  onClick={() => handleUpdateStatus('APPROVED')}
                  disabled={loading}
                >
                  {loading ? <Loader2 size={16} className="animate-spin" /> : <CheckCircle size={16} />}
                  Phê duyệt bài viết
                </Button>
              </>
            )}
            
            {post.status !== 'PENDING' && (
              <p className="text-xs text-zinc-400 font-medium italic">
                Bài viết này đã được xử lý.
              </p>
            )}
          </div>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
