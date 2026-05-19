'use client'

import React, { useState, useEffect, useCallback } from 'react'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/shared/components/ui/dialog'
import { Button } from '@/shared/components/ui/button'
import { Input } from '@/shared/components/ui/input'
import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from '@/shared/components/ui/avatar'
import { Send, Loader2, MessageSquare, Trash2, Flag } from 'lucide-react'
import { commentService, Comment } from '../services/comment-api'
import { toast } from 'sonner'
import { useUser } from '@/features/auth/hooks/use-auth'
import { ReportModal } from './ReportModal'
import { DeleteConfirmDialog } from '@/shared/components/ui/delete-confirm-dialog'

interface CommentModalProps {
  postId: number
  postTitle: string
  isOpen: boolean
  onClose: () => void
  onCommentCountChange: (newCount: number) => void
}

export const CommentModal: React.FC<CommentModalProps> = ({
  postId,
  postTitle,
  isOpen,
  onClose,
  onCommentCountChange,
}) => {
  const { user } = useUser()
  const [comments, setComments] = useState<Comment[]>([])
  const [loading, setLoading] = useState(false)
  const [submitting, setSubmitting] = useState(false)
  const [content, setContent] = useState('')

  // Report Modal State
  const [isReportModalOpen, setIsReportModalOpen] = useState(false)
  const [reportTargetId, setReportTargetId] = useState<number | null>(null)

  // Delete State
  const [isDeleteOpen, setIsDeleteOpen] = useState(false)
  const [commentToDelete, setCommentToDelete] = useState<number | null>(null)
  const [isDeleting, setIsDeleting] = useState(false)

  const fetchComments = useCallback(async () => {
    if (!postId) return
    try {
      setLoading(true)
      const data = await commentService.getCommentsByPost(postId, 1, 50)
      setComments(data.data)
      onCommentCountChange(data.totalElements)
    } catch (error) {
      toast.error('Không thể tải bình luận')
    } finally {
      setLoading(false)
    }
  }, [postId, onCommentCountChange])

  useEffect(() => {
    if (isOpen) {
      const init = async () => {
        await Promise.resolve()
        fetchComments()
      }
      init()
    }
  }, [isOpen, fetchComments])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!content.trim() || submitting) return

    try {
      setSubmitting(true)
      const newComment = await commentService.createComment({
        postId,
        content: content.trim(),
      })
      setComments((prev) => [newComment, ...prev])
      setContent('')
      onCommentCountChange(comments.length + 1)
      toast.success('Đã đăng bình luận')
    } catch (error) {
      toast.error('Không thể gửi bình luận. Vui lòng thử lại.')
    } finally {
      setSubmitting(false)
    }
  }

  const handleDeleteClick = (commentId: number) => {
    setCommentToDelete(commentId)
    setIsDeleteOpen(true)
  }

  const confirmDelete = async () => {
    if (!commentToDelete) return
    try {
      setIsDeleting(true)
      await commentService.deleteComment(commentToDelete)
      setComments((prev) => prev.filter((c) => c.id !== commentToDelete))
      onCommentCountChange(comments.length - 1)
      toast.success('Đã xóa bình luận thành công')
      setIsDeleteOpen(false)
    } catch (error) {
      toast.error('Lỗi khi xóa bình luận')
    } finally {
      setIsDeleting(false)
      setCommentToDelete(null)
    }
  }

  const handleReport = (commentId: number) => {
    if (!user) {
      toast.error('Vui lòng đăng nhập để báo cáo nội dung vi phạm')
      return
    }
    setReportTargetId(commentId)
    setIsReportModalOpen(true)
  }

  return (
    <>
      <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
        <DialogContent className="sm:max-w-[500px] h-[80vh] flex flex-col p-0 gap-0 overflow-hidden bg-white">
          <DialogHeader className="p-4 border-b">
            <DialogTitle className="text-zinc-900 flex items-center gap-2">
              <MessageSquare className="w-5 h-5 text-hanoi-red" />
              Bình luận về bài viết
            </DialogTitle>
            <p className="text-xs text-zinc-500 font-medium truncate italic mt-1">
              &ldquo;{postTitle}&rdquo;
            </p>
          </DialogHeader>

          <div className="flex-1 overflow-y-auto p-4 space-y-6 custom-scrollbar">
            {loading ? (
              <div className="flex flex-col items-center justify-center h-full gap-2 text-zinc-400">
                <Loader2 className="animate-spin" />
                <p className="text-sm font-medium">Đang tải bình luận...</p>
              </div>
            ) : comments.length > 0 ? (
              comments.map((comment) => (
                <div key={comment.id} className="flex gap-3 group">
                  <Avatar className="h-8 w-8 mt-0.5">
                    <AvatarImage src={comment.avatar} />
                    <AvatarFallback className="bg-hanoi-gold/30 text-hanoi-red font-black text-[10px]">
                      {comment.username.charAt(0).toUpperCase()}
                    </AvatarFallback>
                  </Avatar>
                  <div className="flex-1 space-y-1">
                    <div className="bg-zinc-100 p-3 rounded-2xl rounded-tl-none relative">
                      <div className="flex items-center justify-between mb-1">
                        <span className="text-xs font-black text-zinc-900">
                          {comment.username}
                        </span>
                        <div className="flex items-center gap-2">
                          <span className="text-[9px] text-zinc-400 font-medium">
                            {new Date(comment.createdAt).toLocaleDateString(
                              'vi-VN'
                            )}
                          </span>

                          {/* Action Buttons (Delete/Report) */}
                          <div className="flex items-center opacity-50 hover:opacity-100 transition-all">
                            {user?.id === comment.userId ? (
                              <button
                                onClick={() => handleDeleteClick(comment.id)}
                                className="p-1 text-zinc-400 hover:text-red-500 transition-colors"
                                title="Xóa bình luận"
                              >
                                <Trash2 size={12} />
                              </button>
                            ) : (
                              <button
                                onClick={() => handleReport(comment.id)}
                                className="p-1 text-zinc-400 hover:text-orange-500 transition-colors"
                                title="Báo cáo vi phạm"
                              >
                                <Flag size={12} />
                              </button>
                            )}
                          </div>
                        </div>
                      </div>
                      <p className="text-sm text-zinc-700 leading-relaxed">
                        {comment.content}
                      </p>
                    </div>
                  </div>
                </div>
              ))
            ) : (
              <div className="flex flex-col items-center justify-center h-full gap-3 text-zinc-400">
                <div className="p-4 bg-zinc-50 rounded-full">
                  <MessageSquare className="w-10 h-10 opacity-20" />
                </div>
                <p className="text-sm font-bold">Chưa có bình luận nào</p>
                <p className="text-xs">
                  Hãy là người đầu tiên chia sẻ cảm nghĩ!
                </p>
              </div>
            )}
          </div>

          <div className="p-4 border-t bg-zinc-50">
            <form onSubmit={handleSubmit} className="flex gap-2">
              <Avatar className="h-9 w-9 border-2 border-white shadow-sm">
                <AvatarImage src={user?.avatar} />
                <AvatarFallback className="bg-hanoi-red text-white font-black text-xs">
                  {user?.username?.charAt(0).toUpperCase()}
                </AvatarFallback>
              </Avatar>
              <div className="flex-1 relative">
                <Input
                  value={content}
                  onChange={(e) => setContent(e.target.value)}
                  placeholder={
                    user
                      ? 'Viết bình luận của bạn...'
                      : 'Đăng nhập để bình luận'
                  }
                  className="pr-12 bg-white rounded-2xl h-10 border-zinc-200 focus:ring-hanoi-red/20 text-sm"
                  disabled={!user || submitting}
                />
                <button
                  type="submit"
                  disabled={!user || !content.trim() || submitting}
                  className="absolute right-2 top-1/2 -translate-y-1/2 p-2 text-hanoi-red disabled:text-zinc-300 transition-colors"
                >
                  {submitting ? (
                    <Loader2 className="w-4 h-4 animate-spin" />
                  ) : (
                    <Send className="w-4 h-4" />
                  )}
                </button>
              </div>
            </form>
            {!user && (
              <p className="text-[10px] text-center text-zinc-400 mt-2 font-medium">
                Bạn cần đăng nhập để tham gia thảo luận.
              </p>
            )}
          </div>
        </DialogContent>
      </Dialog>

      {reportTargetId && (
        <ReportModal
          isOpen={isReportModalOpen}
          onClose={() => setIsReportModalOpen(false)}
          targetId={reportTargetId}
          reportType="COMMENT"
        />
      )}

      <DeleteConfirmDialog
        isOpen={isDeleteOpen}
        onClose={() => setIsDeleteOpen(false)}
        title="Xóa bình luận"
        description="Bạn có chắc chắn muốn xóa bình luận này? Hành động này không thể hoàn tác."
        onConfirm={confirmDelete}
        isLoading={isDeleting}
      />
    </>
  )
}
