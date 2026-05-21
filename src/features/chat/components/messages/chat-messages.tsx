/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useRef, useEffect } from 'react'
import { Sparkles, Headset } from 'lucide-react'
import { Message, ChatMode } from '../../types/chat'
import { MessageItem } from './message-item'

interface ChatMessagesProps {
  messages: Message[]
  isLoading: boolean
  chatMode: ChatMode
  onSendMessage: (text: string) => void
  isSavingItinerary: boolean
  onSaveItinerary: (title: string, timeline: any) => void
  onImageClick: (url: string) => void
}

export const ChatMessages = ({
  messages,
  isLoading,
  chatMode,
  onSendMessage,
  isSavingItinerary,
  onSaveItinerary,
  onImageClick
}: ChatMessagesProps) => {
  const scrollRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight
    }
  }, [messages, isLoading])

  return (
    <div
      ref={scrollRef}
      className="flex-1 overflow-y-auto p-4 space-y-4 bg-hanoi-cream/30"
    >
      {messages.length === 0 && !isLoading && (
        <div className="text-center py-10 space-y-4">
          <div className="bg-hanoi-gold/20 w-16 h-16 rounded-full flex items-center justify-center mx-auto">
            {chatMode === 'AI' ? (
              <Sparkles className="h-8 w-8 text-hanoi-red" />
            ) : (
              <Headset className="h-8 w-8 text-hanoi-red" />
            )}
          </div>
          <div className="space-y-1">
            <p className="font-bold text-zinc-900">
              {chatMode === 'AI'
                ? 'Xin chào! Tôi là Local Buddy'
                : 'Chào bạn! Chúng tôi có thể giúp gì?'}
            </p>
            <p className="text-xs text-zinc-500 px-10">
              {chatMode === 'AI'
                ? 'Tôi có thể giúp bạn lên lịch trình, tìm quán ăn ngon hoặc các sự kiện tại Hà Nội.'
                : 'Gửi tin nhắn để kết nối trực tiếp với đội ngũ hỗ trợ của Trip4 Hà Nội.'}
            </p>
          </div>
          {chatMode === 'AI' && (
            <div className="flex flex-wrap justify-center gap-2 pt-4">
              {[
                'Đi đâu ở Cầu Giấy?',
                'Lên lịch trình 1 ngày',
                'Món ăn phải thử',
              ].map((suggestion) => (
                <button
                  key={suggestion}
                  onClick={() => onSendMessage(suggestion)}
                  className="text-[10px] font-bold bg-white border border-zinc-100 px-3 py-1.5 rounded-full text-zinc-600 hover:border-hanoi-red hover:text-hanoi-red transition-all"
                >
                  {suggestion}
                </button>
              ))}
            </div>
          )}
        </div>
      )}

      {messages.map((msg, idx) => (
        <MessageItem
          key={`${msg.id}-${msg.role}-${idx}`}
          message={msg}
          isSavingItinerary={isSavingItinerary}
          onSaveItinerary={onSaveItinerary}
          onImageClick={onImageClick}
        />
      ))}

      {isLoading && (
        <div className="flex items-start max-w-[85%]">
          <div className="bg-white p-4 rounded-2xl rounded-tl-none border border-zinc-100 shadow-sm flex items-center gap-2">
            <div className="flex gap-1">
              <div className="w-1.5 h-1.5 bg-hanoi-red rounded-full animate-bounce [animation-delay:-0.3s]" />
              <div className="w-1.5 h-1.5 bg-hanoi-red rounded-full animate-bounce [animation-delay:-0.15s]" />
              <div className="w-1.5 h-1.5 bg-hanoi-red rounded-full animate-bounce" />
            </div>
            <span className="text-xs font-bold text-zinc-400 uppercase tracking-widest">
              {chatMode === 'AI'
                ? 'Local Buddy đang nghĩ...'
                : 'Đang kết nối...'}
            </span>
          </div>
        </div>
      )}
    </div>
  )
}
