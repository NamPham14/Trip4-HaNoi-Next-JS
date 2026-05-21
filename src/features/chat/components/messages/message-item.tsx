/* eslint-disable @typescript-eslint/no-explicit-any */
import React from 'react'
import { Sparkles, User } from 'lucide-react'
import { Message, ChatAIResponse } from '../../types/chat'
import { cn } from '@/shared/lib/utils'
import { AIContent } from './ai-content'

interface MessageItemProps {
  message: Message
  isSavingItinerary: boolean
  onSaveItinerary: (title: string, timeline: any) => void
  onImageClick: (url: string) => void
}

export const MessageItem = ({ 
  message, 
  isSavingItinerary, 
  onSaveItinerary,
  onImageClick 
}: MessageItemProps) => {
  const { content, mediaUrls, role, senderAvatar, senderName, timestamp } = message
  const isString = typeof content === 'string'

  const renderMessageImages = (urls: string[] | undefined) => {
    if (!urls || urls.length === 0) return null
    
    const count = urls.length
    const gridClass = count === 1 ? 'grid-cols-1' : 'grid-cols-2'
    
    return (
      <div className={`grid ${gridClass} gap-1 mb-2 mt-1 rounded-xl overflow-hidden`}>
        {urls.map((url, idx) => (
          <div 
            key={idx} 
            className="relative aspect-square bg-zinc-100 cursor-pointer overflow-hidden group"
            onClick={() => onImageClick(url)}
          >
             <img 
               src={url} 
               alt="attached" 
               className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105" 
             />
          </div>
        ))}
      </div>
    )
  }

  return (
    <div className={cn(
      'flex gap-2 w-full',
      role === 'user' ? 'flex-row-reverse' : 'flex-row'
    )}>
      {role !== 'user' && role !== 'system' && (
        <div className="flex-shrink-0 mt-1">
          {role === 'ai' ? (
            <div className="w-8 h-8 rounded-full bg-hanoi-gold/20 flex items-center justify-center">
              <Sparkles className="h-4 w-4 text-hanoi-red" />
            </div>
          ) : (
            <div className="w-8 h-8 rounded-full bg-zinc-100 flex items-center justify-center overflow-hidden border border-zinc-200">
              {senderAvatar ? (
                <img
                  src={senderAvatar}
                  alt={senderName}
                  className="w-full h-full object-cover"
                />
              ) : (
                <User className="h-4 w-4 text-zinc-400" />
              )}
            </div>
          )}
        </div>
      )}

      <div className={cn(
        'flex flex-col max-w-[75%]',
        role === 'user' ? 'items-end' : 'items-start',
        role === 'system' ? 'mx-auto max-w-full' : ''
      )}>
        {role === 'staff' && (
          <span className="text-[10px] font-bold text-zinc-400 ml-1 mb-1 uppercase tracking-tighter">
            {senderName || 'Nhân viên'}
          </span>
        )}

        <div className={cn(
          'p-4 rounded-2xl text-sm leading-relaxed shadow-sm w-full',
          role === 'user'
            ? 'bg-hanoi-red text-white rounded-tr-none'
            : role === 'system'
              ? 'bg-zinc-100 text-zinc-500 text-[11px] italic text-center rounded-lg shadow-none border-none'
              : 'bg-white text-zinc-800 rounded-tl-none border border-zinc-100'
        )}>
          {renderMessageImages(mediaUrls)}

          {isString ? (
            content
          ) : (
            <AIContent 
              content={content as ChatAIResponse} 
              isSaving={isSavingItinerary}
              onSaveItinerary={onSaveItinerary}
            />
          )}
        </div>
        
        {role !== 'system' && (
          <span className="text-[10px] text-zinc-400 mt-1 font-medium px-1">
            {new Date(timestamp).toLocaleTimeString([], {
              hour: '2-digit',
              minute: '2-digit',
            })}
          </span>
        )}
      </div>
    </div>
  )
}
