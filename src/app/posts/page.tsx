'use client'

import React, { useState, useEffect } from 'react'
import { Navbar } from "@/shared/components/navbar"
import Footer from "@/shared/components/Footer"
import { placeService } from '@/features/places/services/place-api'
import { Place } from '@/features/places/types/place'
import { PostHeader } from '@/features/posts/components/PostHeader'
import { PostFeed } from '@/features/posts/components/PostFeed'
import { CreatePostModal } from '@/features/posts/components/CreatePostModal'

export default function PostPage() {
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false)
  const [allPlaces, setAllPlaces] = useState<Place[]>([])

  useEffect(() => {
    placeService.getPlacesList().then((res) => setAllPlaces(res))
  }, [])

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <Navbar />
      
      <main className="flex-1 pb-20">
        <PostHeader onCreateClick={() => setIsCreateModalOpen(true)} />
        
        <PostFeed />

        <CreatePostModal 
          isOpen={isCreateModalOpen} 
          onClose={() => setIsCreateModalOpen(false)} 
          allPlaces={allPlaces}
        />
      </main>

      <Footer />
    </div>
  )
}
