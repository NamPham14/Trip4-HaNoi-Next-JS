import React from 'react'
import { Send, Loader2, Image as ImageIcon, X } from 'lucide-react'
import { ChatMode } from '../../types/chat'
import { Button } from '@/shared/components/ui/button'
import Link from 'next/link'

interface ChatInputProps {
  chatMode: ChatMode
  inputText: string
  setInputText: (text: string) => void
  onSend: () => void
  isAuthenticated: boolean
  isLoading: boolean
  isSending: boolean
  // Attachments
  fileInputRef: React.RefObject<HTMLInputElement | null>
  previewUrls: string[]
  onFileSelect: (e: React.ChangeEvent<HTMLInputElement>) => void
  onRemoveFile: (index: number) => void
  selectedFilesCount: number
}

export const ChatInput = ({
  chatMode,
  inputText,
  setInputText,
  onSend,
  isAuthenticated,
  isLoading,
  isSending,
  fileInputRef,
  previewUrls,
  onFileSelect,
  onRemoveFile,
  selectedFilesCount
}: ChatInputProps) => {
  if (!isAuthenticated) {
    return (
      <div className="p-3 bg-white border-t border-zinc-100 flex flex-col items-center space-y-3 py-4">
        <p className="text-xs text-zinc-500 font-medium">
          Bạn cần đăng nhập để trò chuyện
        </p>
        <Link href="/login">
          <Button
            size="sm"
            className="bg-hanoi-red hover:bg-[#6D1616] font-bold rounded-full px-8"
          >
            Đăng nhập ngay
          </Button>
        </Link>
      </div>
    )
  }

  return (
    <div className="p-3 bg-white border-t border-zinc-100 flex flex-col">
      {previewUrls.length > 0 && (
        <div className="flex gap-2 mb-3 overflow-x-auto pb-2 px-1">
          {previewUrls.map((url, idx) => (
            <div key={idx} className="relative flex-shrink-0">
              <img 
                src={url} 
                alt="preview" 
                className="w-14 h-14 object-cover rounded-xl border border-zinc-200" 
              />
              <button
                onClick={() => onRemoveFile(idx)}
                className="absolute -top-1 -right-1 bg-zinc-800 text-white p-0.5 rounded-full hover:bg-hanoi-red"
              >
                <X className="h-3 w-3" />
              </button>
            </div>
          ))}
        </div>
      )}

      <div className="flex items-center gap-2">
        <div className="flex-1 bg-zinc-50 rounded-2xl px-3 py-2 border border-zinc-100 flex items-center gap-2 focus-within:border-hanoi-red transition-all">
          {chatMode === 'LIVE' && (
            <>
              <input 
                type="file" 
                multiple 
                accept="image/*"
                className="hidden" 
                ref={fileInputRef}
                onChange={onFileSelect}
              />
              <button 
                onClick={() => fileInputRef.current?.click()}
                className="p-1.5 text-zinc-400 hover:text-hanoi-red hover:bg-hanoi-red/10 rounded-xl transition-colors"
                title="Đính kèm ảnh"
              >
                <ImageIcon className="h-4 w-4" />
              </button>
            </>
          )}

          <input
            type="text"
            placeholder={
              chatMode === 'AI'
                ? 'Hỏi Local Buddy...'
                : 'Nhắn cho đội ngũ hỗ trợ...'
            }
            className="flex-1 bg-transparent outline-none text-sm font-medium text-zinc-700 min-w-0"
            value={inputText}
            onChange={(e) => setInputText(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && onSend()}
          />
        </div>
        
        <button
          onClick={onSend}
          disabled={
            (!inputText.trim() && selectedFilesCount === 0) ||
            isLoading || 
            isSending
          }
          className="p-3 bg-hanoi-red text-white rounded-2xl hover:bg-[#6D1616] disabled:opacity-50 transition-all shadow-sm"
        >
          {isSending ? <Loader2 className="h-4 w-4 animate-spin" /> : <Send className="h-4 w-4" />}
        </button>
      </div>
    </div>
  )
}
