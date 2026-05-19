'use client'

import React from 'react'
import { useParams, useRouter } from 'next/navigation'
import { useQuery } from '@tanstack/react-query'
import { postService } from '@/features/posts/services/post-api'
import { Navbar } from "@/shared/components/navbar"
import Footer from "@/shared/components/Footer"

import { Button } from '@/shared/components/ui/button'
import { ChevronLeft, Loader2 } from 'lucide-react'
import Link from 'next/link'
import { PostCard } from '@/features/posts/components/PostCard'
import { useQueryClient } from '@tanstack/react-query'
import { Post } from '@/features/posts/types/post'

export default function PostDetailPage() {
  const params = useParams()
  const router = useRouter()
  const id = params.id as string
  const queryClient = useQueryClient()

  const { data: post, isLoading, error } = useQuery({
    queryKey: ['post', id],
    queryFn: () => postService.getPostById(Number(id)),
    enabled: !!id,
    staleTime: 0, // Luôn lấy dữ liệu mới nhất
    refetchInterval: 5000, // Tự động làm mới mỗi 5 giây để cập nhật comment/like
  })

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex flex-col">
        <Navbar />
        <div className="flex-1 flex items-center justify-center">
          <Loader2 className="h-8 w-8 text-hanoi-red animate-spin" />
        </div>
        <Footer />
      </div>
    )
  }

  if (error || !post) {
    return (
      <div className="min-h-screen bg-gray-50 flex flex-col">
        <Navbar />
        <div className="flex-1 flex flex-col items-center justify-center p-4">
          <h2 className="text-2xl font-bold text-zinc-900 mb-2">Không tìm thấy bài viết</h2>
          <p className="text-zinc-500 mb-6">Bài viết này có thể đã bị gỡ bỏ hoặc không tồn tại.</p>
          <Link href="/posts">
            <Button className="bg-hanoi-red hover:bg-hanoi-red/90 font-bold">Quay lại cộng đồng</Button>
          </Link>
        </div>
        <Footer />
      </div>
    )
  }

  const handleLikeUpdate = (postId: number, isLiked: boolean, likeCount: number) => {
    queryClient.setQueryData(['post', id], (oldData: Post | undefined) => {
      if (!oldData) return oldData
      return {
        ...oldData,
        isLiked,
        likeCount,
      }
    })
  }

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <Navbar />
      
      <main className="flex-1 py-8 md:py-12">
        <div className="container mx-auto px-4 max-w-3xl">
          <button 
            onClick={() => router.back()}
            className="flex items-center gap-2 text-zinc-500 hover:text-hanoi-red font-bold mb-6 transition-colors"
          >
            <ChevronLeft className="h-5 w-5" />
            Quay lại
          </button>

          <PostCard post={post} onLikeUpdate={handleLikeUpdate} />
        </div>
      </main>

      <Footer />
    </div>
  )
}
