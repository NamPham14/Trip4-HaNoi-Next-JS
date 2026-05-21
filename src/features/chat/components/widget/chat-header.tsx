import React from 'react'
import { X, Sparkles, Headset, Bot } from 'lucide-react'
import { ChatMode } from '../../types/chat'
import { cn } from '@/shared/lib/utils'

interface ChatHeaderProps {
  chatMode: ChatMode
  staffName?: string
  onClose: () => void
  onToggleMode: (mode: ChatMode) => void
}

export const ChatHeader = ({ 
  chatMode, 
  staffName, 
  onClose, 
  onToggleMode 
}: ChatHeaderProps) => {
  return (
    <div className="bg-hanoi-red p-4 flex items-center justify-between text-white">
      <div className="flex items-center gap-3">
        <div className="bg-white/20 p-2 rounded-xl backdrop-blur-md">
          {chatMode === 'AI' ? (
            <Sparkles className="h-5 w-5" />
          ) : (
            <Headset className="h-5 w-5" />
          )}
        </div>
        <div>
          <h3 className="font-bold">
            {chatMode === 'AI'
              ? 'Local Buddy AI'
              : staffName
                ? `Hỗ trợ: ${staffName}`
                : 'Hỗ trợ trực tuyến'}
          </h3>
          <p className="text-[10px] text-white/70 uppercase tracking-widest font-bold">
            {chatMode === 'AI'
              ? 'Người bạn đồng hành Hà Nội'
              : 'Đội ngũ Trip4 Hà Nội'}
          </p>
        </div>
      </div>
      <div className="flex items-center gap-2">
        <div className="flex bg-black/20 rounded-full p-1 mr-2">
          <button
            onClick={() => onToggleMode('AI')}
            className={cn(
              'p-1.5 rounded-full transition-all',
              chatMode === 'AI'
                ? 'bg-white text-hanoi-red'
                : 'text-white/70 hover:text-white'
            )}
            title="Chat với AI"
          >
            <Bot className="h-4 w-4" />
          </button>
          <button
            onClick={() => onToggleMode('LIVE')}
            className={cn(
              'p-1.5 rounded-full transition-all',
              chatMode === 'LIVE'
                ? 'bg-white text-hanoi-red'
                : 'text-white/70 hover:text-white'
            )}
            title="Gặp nhân viên"
          >
            <Headset className="h-4 w-4" />
          </button>
        </div>
        <button
          onClick={onClose}
          className="p-1 hover:bg-white/10 rounded-full transition-colors"
        >
          <X className="h-6 w-6" />
        </button>
      </div>
    </div>
  )
}
