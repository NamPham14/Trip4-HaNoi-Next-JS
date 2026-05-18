'use client'

import React, { useState, useEffect, useCallback, useRef } from 'react'
import { toast } from 'sonner'
import { postService } from '@/features/posts/services/post-api'
import { Post } from '@/features/posts/types/post'
import { PostCard } from './PostCard'

export const PostFeed: React.FC = () => {
  const [posts, setPosts] = useState<Post[]>([])
  const [loading, setLoading] = useState(false)
  const [page, setPage] = useState(1)
  const [hasMore, setHasMore] = useState(true)
  const isInitialMount = useRef(true)

  const fetchPosts = useCallback(
    async (pageNum: number, isNew: boolean = false) => {
      try {
        setLoading(true)
        const data = await postService.getPosts(pageNum, 10)
        if (isNew) {
          setPosts(data.data)
        } else {
          setPosts((prev) => [...prev, ...data.data])
        }
        setHasMore(data.pageNumber + 1 < data.totalPages)
      } catch (error) {
        toast.error('Không thể tải bài viết')
      } finally {
        setLoading(false)
      }
    },
    []
  )

  // Use a separate effect for initial load to avoid cascading renders
  useEffect(() => {
    if (isInitialMount.current) {
      isInitialMount.current = false
      fetchPosts(1, true)
    }
  }, [fetchPosts])

  const handleLikeUpdate = (postId: number, isLiked: boolean, likeCount: number) => {
    setPosts((prev) =>
      prev.map((p) =>
        p.id === postId
          ? {
              ...p,
              isLiked: isLiked,
              likeCount: likeCount,
            }
          : p
      )
    )
  }

  const loadMore = () => {
    if (!loading && hasMore) {
      const nextPage = page + 1
      setPage(nextPage)
      fetchPosts(nextPage)
    }
  }

  return (
    <div className="max-w-2xl mx-auto px-0 sm:px-4 space-y-3 sm:space-y-6">
      {Array.isArray(posts) &&
        posts.map((post) => (
          <PostCard 
            key={post.id} 
            post={post} 
            onLikeUpdate={handleLikeUpdate} 
          />
        ))}

      {loading && (
        <div className="flex justify-center py-10">
          <Loader2 className="animate-spin text-hanoi-red" size={32} />
        </div>
      )}

      {!loading && hasMore && posts.length > 0 && (
        <div className="flex justify-center py-6">
          <button
            onClick={loadMore}
            className="text-sm font-bold text-hanoi-red hover:underline"
          >
            Xem thêm bài viết
          </button>
        </div>
      )}

      {!hasMore && posts?.length > 0 && (
        <div className="text-center py-10 text-gray-400 text-sm font-medium">
          Bạn đã xem hết bài viết hôm nay rồi ✨
        </div>
      )}
      
      {!loading && posts?.length === 0 && (
        <div className="text-center py-20 text-gray-500 px-4">
          Chưa có bài viết nào. Hãy là người đầu tiên chia sẻ!
        </div>
      )}
    </div>
  )
}

const Loader2 = ({
  className,
  size,
}: {
  className?: string
  size?: number
}) => (
  <svg
    className={className}
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <path d="M21 12a9 9 0 1 1-6.219-8.56" />
  </svg>
)
