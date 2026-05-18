'use client'

import React, { useState } from 'react'
import { Heart, MessageSquare, Share2, MoreHorizontal, MapPin, User } from 'lucide-react'
import Image from 'next/image'
import { Post } from '@/features/posts/types/post'
import { postService } from '@/features/posts/services/post-api'
import { toast } from 'sonner'
import { CommentModal } from './CommentModal'

interface PostCardProps {
  post: Post
  onLikeUpdate: (postId: number, isLiked: boolean, likeCount: number) => void
}

export const PostCard: React.FC<PostCardProps> = ({ post, onLikeUpdate }) => {
  const [isCommentModalOpen, setIsCommentModalOpen] = useState(false)
  const [commentCount, setCommentCount] = useState(post.commentCount)

  const handleLike = async () => {
    try {
      await postService.toggleLike(post.id)
      const newIsLiked = !post.isLiked
      const newLikeCount = post.isLiked ? post.likeCount - 1 : post.likeCount + 1
      onLikeUpdate(post.id, newIsLiked, newLikeCount)
    } catch (error) {
      toast.error('Vui lòng đăng nhập để thích bài viết')
    }
  }

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden transition-all hover:shadow-md">
      {/* Post Header */}
      <div className="p-4 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-gray-100 overflow-hidden border">
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
                <User size={20} />
              </div>
            )}
          </div>
          <div>
            <h3 className="font-bold text-gray-900 text-sm">{post.username}</h3>
            <p className="text-[10px] text-gray-500">
              {new Date(post.createdAt).toLocaleString('vi-VN')}
            </p>
          </div>
        </div>
        <button className="text-gray-400 hover:text-gray-600">
          <MoreHorizontal size={20} />
        </button>
      </div>

      {/* Post Content */}
      <div className="px-4 pb-2">
        <h2 className="font-bold text-gray-900 mb-1">{post.title}</h2>
        <p className="text-sm text-gray-700 leading-relaxed whitespace-pre-wrap">
          {post.content}
        </p>

        {post.taggedPlaces && post.taggedPlaces.length > 0 && (
          <div className="flex flex-wrap gap-2 mt-3">
            {post.taggedPlaces.map((place) => (
              <span
                key={place.id}
                className="flex items-center gap-1 text-[10px] bg-blue-50 text-blue-600 px-2 py-1 rounded-full font-bold border border-blue-100"
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
              />
            </div>
          ))}
        </div>
      )}

      {/* Actions */}
      <div className="p-4 flex items-center justify-between border-t border-gray-50">
        <div className="flex items-center gap-6">
          <button
            onClick={handleLike}
            className={`flex items-center gap-1.5 transition-colors ${post.isLiked ? 'text-hanoi-red' : 'text-gray-500 hover:text-hanoi-red'}`}
          >
            <Heart
              size={20}
              fill={post.isLiked ? 'currentColor' : 'none'}
            />
            <span className="text-xs font-bold">{post.likeCount}</span>
          </button>
          <button 
            onClick={() => setIsCommentModalOpen(true)}
            className="flex items-center gap-1.5 text-gray-500 hover:text-blue-500 transition-colors"
          >
            <MessageSquare size={20} />
            <span className="text-xs font-bold">{commentCount}</span>
          </button>
          <button className="text-gray-500 hover:text-green-500 transition-colors">
            <Share2 size={20} />
          </button>
        </div>
        <div className="text-[10px] text-gray-400 font-medium">
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
    </div>
  )
}
