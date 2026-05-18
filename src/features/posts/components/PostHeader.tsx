'use client'

import React from 'react'
import { Plus } from 'lucide-react'
import { Button } from '@/shared/components/ui/button'
import { Avatar, AvatarFallback, AvatarImage } from '@/shared/components/ui/avatar'
import { useUser } from '@/features/auth/hooks/use-auth'

interface PostHeaderProps {
  onCreateClick: () => void
}

export const PostHeader: React.FC<PostHeaderProps> = ({ onCreateClick }) => {
  const { user } = useUser()

  return (
    <>
      {/* Page Header */}
      <div className="bg-white border-b shadow-sm pt-4 pb-4 sm:pb-6">
        <div className="max-w-2xl mx-auto px-4 flex items-center justify-between">
          <div>
            <h1 className="text-xl sm:text-2xl font-black text-zinc-900">
              Cộng đồng <span className="text-hanoi-red">Trip4Hanoi</span>
            </h1>
            <p className="text-[10px] sm:text-sm text-zinc-500 font-medium mt-0.5">
              Chia sẻ hành trình, kết nối đam mê.
            </p>
          </div>
          <button
            onClick={onCreateClick}
            className="rounded-full bg-hanoi-red hover:bg-hanoi-red/90 shadow-lg shadow-hanoi-red/20 font-bold text-white p-2 sm:px-4 sm:py-2 flex items-center transition-all active:scale-95"
          >
            <Plus size={20} /> 
            <span className="hidden sm:inline ml-2">Đăng bài</span>
          </button>
        </div>
      </div>

      <div className="max-w-2xl mx-auto px-4 mt-4 sm:mt-6">
        {/* Post Input Shortcut */}
        <div className="bg-white rounded-xl p-3 sm:p-4 shadow-sm border border-gray-100 flex gap-3 sm:gap-4 items-center mb-4 sm:mb-6">
          <Avatar className="h-9 w-9 sm:h-10 sm:w-10 border-2 border-zinc-100 overflow-hidden flex-shrink-0 relative">
            <AvatarImage src={user?.avatar} className="object-cover" />
            <AvatarFallback className="bg-hanoi-red text-white font-black text-xs">
              {user?.username?.charAt(0).toUpperCase() || 'U'}
            </AvatarFallback>
          </Avatar>
          <button
            onClick={onCreateClick}
            className="flex-1 bg-gray-100 hover:bg-gray-200 transition-colors rounded-full px-4 sm:px-5 py-2 sm:py-2.5 text-left text-gray-500 text-xs sm:text-sm font-medium"
          >
            <span className="hidden sm:inline">{user ? `Chào ${user.username}, bạn muốn chia sẻ điều gì về Hà Nội?` : 'Bạn đang muốn chia sẻ điều gì về Hà Nội?'}</span>
            <span className="inline sm:hidden">Bạn muốn chia sẻ điều gì?</span>
          </button>
        </div>
      </div>
    </>
  )
}
