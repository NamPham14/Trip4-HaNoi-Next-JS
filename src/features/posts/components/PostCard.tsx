'use client'

import React, { useState } from 'react'
import {
  Heart,
  MessageSquare,
  Share2,
  MoreHorizontal,
  MapPin,
  User,
  AlertCircle,
  Link as LinkIcon,
  EyeOff,
} from 'lucide-react'
import Image from 'next/image'
import { Post } from '@/features/posts/types/post'
import { postService } from '@/features/posts/services/post-api'
import { toast } from 'sonner'
import { CommentModal } from './CommentModal'
import { ReportModal } from './ReportModal'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/shared/components/ui/dropdown-menu'

interface PostCardProps {
  post: Post
  onLikeUpdate?: (postId: number, isLiked: boolean, likeCount: number) => void
}

export const PostCard: React.FC<PostCardProps> = ({ post, onLikeUpdate }) => {
  const [isCommentModalOpen, setIsCommentModalOpen] = useState(false)
  const [isReportModalOpen, setIsReportModalOpen] = useState(false)
  const [commentCount, setCommentCount] = useState(post.commentCount)

  const handleCopyLink = () => {
    const url = `${window.location.origin}/posts/${post.id}`
    navigator.clipboard.writeText(url)
    toast.success('Đã sao chép liên kết bài viết')
  }

  const handleLike = async () => {
    try {
      await postService.toggleLike(post.id)
      const newIsLiked = !post.isLiked
      const newLikeCount = post.isLiked
        ? post.likeCount - 1
        : post.likeCount + 1
      if (onLikeUpdate) {
        onLikeUpdate(post.id, newIsLiked, newLikeCount)
      }
    } catch (error) {
      toast.error('Vui lòng đăng nhập để thích bài viết')
    }
  }

  return (
    <div className="bg-white sm:rounded-xl shadow-sm border-y sm:border border-gray-100 overflow-hidden transition-all hover:shadow-md">
      {/* Post Header */}
      <div className="p-3 sm:p-4 flex items-center justify-between">
        <div className="flex items-center gap-2 sm:gap-3">
          <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-full bg-gray-100 overflow-hidden border">
            {post.userAvatar ? (
              <Image
                src={post.userAvatar}
                alt={post.username}
                width={40}
                height={40}
                className="object-cover"
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center text-gray-400">
                <User size={18} />
              </div>
            )}
          </div>
          <div>
            <h3 className="font-bold text-gray-900 text-xs sm:text-sm">
              {post.username}
            </h3>
            <p className="text-[9px] sm:text-[10px] text-gray-500">
              {new Date(post.createdAt).toLocaleString('vi-VN')}
            </p>
          </div>
        </div>

        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <button className="text-gray-400 hover:text-gray-600 p-1 rounded-full hover:bg-gray-100 transition-colors">
              <MoreHorizontal size={18} />
            </button>
          </DropdownMenuTrigger>
          <DropdownMenuContent
            align="end"
            className="w-48 rounded-xl p-1 shadow-xl border-gray-100 bg-white"
          >
            <DropdownMenuItem
              onClick={handleCopyLink}
              className="flex items-center gap-2 font-bold text-xs p-2.5 rounded-lg cursor-pointer"
            >
              <LinkIcon size={14} />
              Sao chép liên kết
            </DropdownMenuItem>

            <DropdownMenuItem
              onClick={() => setIsReportModalOpen(true)}
              className="flex items-center gap-2 font-bold text-xs p-2.5 rounded-lg cursor-pointer text-red-600 focus:text-red-700 focus:bg-red-50"
            >
              <AlertCircle size={14} />
              Báo cáo bài viết
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>

      {/* Post Content */}
      <div className="px-3 sm:px-4 pb-2">
        <h2 className="font-bold text-gray-900 text-sm sm:text-base mb-1">
          {post.title}
        </h2>
        <p className="text-xs sm:text-sm text-gray-700 leading-relaxed whitespace-pre-wrap">
          {post.content}
        </p>

        {post.taggedPlaces && post.taggedPlaces.length > 0 && (
          <div className="flex flex-wrap gap-1.5 sm:gap-2 mt-3">
            {post.taggedPlaces.map((place) => (
              <span
                key={place.id}
                className="flex items-center gap-1 text-[9px] sm:text-[10px] bg-blue-50 text-blue-600 px-2 py-1 rounded-full font-bold border border-blue-100"
              >
                <MapPin size={10} /> {place.name}
              </span>
            ))}
          </div>
        )}
      </div>

      {/* Post Images */}
      {post.images && post.images.length > 0 && (
        <div
          className={`mt-2 grid gap-0.5 ${post.images.length === 1 ? 'grid-cols-1' : 'grid-cols-2'}`}
        >
          {post.images.map((img, idx) => (
            <div
              key={img.id}
              className={`relative aspect-square ${post.images.length === 3 && idx === 0 ? 'row-span-2' : ''}`}
            >
              <Image
                src={img.imageUrl}
                alt={post.title}
                fill
                className="object-cover"
                sizes="(max-width: 768px) 100vw, 50vw"
              />
            </div>
          ))}
        </div>
      )}

      {/* Actions */}
      <div className="px-3 py-2 sm:p-4 flex items-center justify-between border-t border-gray-50">
        <div className="flex items-center gap-4 sm:gap-6">
          <button
            onClick={handleLike}
            className={`flex items-center gap-1.5 transition-colors ${post.isLiked ? 'text-hanoi-red' : 'text-gray-500 hover:text-hanoi-red'}`}
          >
            <Heart size={18} fill={post.isLiked ? 'currentColor' : 'none'} />
            <span className="text-xs font-bold">{post.likeCount}</span>
          </button>
          <button
            onClick={() => setIsCommentModalOpen(true)}
            className="flex items-center gap-1.5 text-gray-500 hover:text-blue-500 transition-colors"
          >
            <MessageSquare size={18} />
            <span className="text-xs font-bold">{commentCount}</span>
          </button>
          <button className="text-gray-500 hover:text-green-500 transition-colors">
            <Share2 size={18} />
          </button>
        </div>
        <div className="text-[9px] sm:text-[10px] text-gray-400 font-medium">
          {post.viewCount} lượt xem
        </div>
      </div>

      <CommentModal
        isOpen={isCommentModalOpen}
        onClose={() => setIsCommentModalOpen(false)}
        postId={post.id}
        postTitle={post.title}
        onCommentCountChange={(newCount) => setCommentCount(newCount)}
      />

      <ReportModal
        isOpen={isReportModalOpen}
        onClose={() => setIsReportModalOpen(false)}
        targetId={post.id}
        reportType="POST"
        targetTitle={post.title}
      />
    </div>
  )
}
