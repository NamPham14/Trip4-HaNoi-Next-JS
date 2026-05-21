import React from 'react'
import { X } from 'lucide-react'

interface ChatLightboxProps {
  image: string | null
  onClose: () => void
}

export const ChatLightbox = ({ image, onClose }: ChatLightboxProps) => {
  if (!image) return null

  return (
    <div 
      className="fixed inset-0 z-[9999] bg-black/90 flex items-center justify-center backdrop-blur-sm p-4 animate-in fade-in duration-200"
      onClick={onClose}
    >
      <button 
        className="absolute top-6 right-6 text-white/70 hover:text-white bg-black/50 p-2 rounded-full transition-colors z-50"
        onClick={onClose}
      >
        <X className="h-8 w-8" />
      </button>
      
      <div className="relative w-full max-w-5xl h-full max-h-[90vh] flex items-center justify-center">
        <img 
          src={image} 
          alt="zoomed" 
          className="max-w-full max-h-full object-contain rounded-md shadow-2xl"
          onClick={(e) => e.stopPropagation()}
        />
      </div>
    </div>
  )
}
