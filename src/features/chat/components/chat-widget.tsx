'use client'

import React, { useState, useEffect } from 'react'
import { X, Sparkles, Headset } from 'lucide-react'
import { useChat } from '../hooks/use-chat'
import { useLiveChat } from '../hooks/use-live-chat'
import { useChatAttachments } from '../hooks/use-chat-attachments'
import { useUser } from '@/features/auth/hooks/use-auth'
import { useItinerary } from '@/features/itinerary/hooks/use-itinerary'
import { cn } from '@/shared/lib/utils'
import { ChatMode } from '../types/chat'
import { usePathname } from 'next/navigation'
import { useChatStore } from '@/shared/store/chat-store'
import { toast } from 'sonner'

// Sub-components
import { ChatHeader } from './widget/chat-header'
import { ChatLightbox } from './widget/chat-lightbox'
import { ChatInput } from './widget/chat-input'
import { ChatMessages } from './messages/chat-messages'

export const ChatWidget = () => {
  const pathname = usePathname()
  const { isOpen, chatMode, setChatMode, closeChat, toggleChat } = useChatStore()
  const [inputText, setInputText] = useState('')
  const [isSending, setIsSending] = useState(false)
  const [selectedImage, setSelectedImage] = useState<string | null>(null)

  const aiChat = useChat()
  const liveChat = useLiveChat()
  const { saveAIItinerary, isLoading: isSaving } = useItinerary()
  const { isAuthenticated } = useUser()
  
  const attachments = useChatAttachments()

  // Use either AI or Live messages based on mode
  const currentMessages = chatMode === 'AI' ? aiChat.messages : liveChat.messages
  const isLoading = chatMode === 'AI' ? aiChat.isLoading : liveChat.isLoadingHistory

  const handleSend = async () => {
    const hasText = inputText.trim().length > 0
    const hasFiles = attachments.selectedFiles.length > 0

    if (!hasText && !hasFiles) return
    
    setIsSending(true)

    try {
      if (chatMode === 'AI') {
        if (aiChat.isLoading) return
        aiChat.sendMessage(inputText)
        setInputText('')
      } else {
        await liveChat.sendMessage(inputText, attachments.selectedFiles)
        setInputText('')
        attachments.clearAttachments()
      }
    } catch (error) {
       toast.error('Lỗi khi gửi tin nhắn')
    } finally {
       setIsSending(false)
    }
  }

  // Don't show chat widget on admin pages
  if (pathname?.startsWith('/admin')) {
    return null
  }

  return (
    <>
      <div className="fixed bottom-6 right-6 z-[100] flex flex-col items-end">
        {/* Chat Window */}
        {isOpen && (
          <div className={cn(
            'mb-4 w-[90vw] md:w-[400px] h-[70vh] md:h-[600px] bg-white rounded-3xl shadow-2xl border border-zinc-100 flex flex-col overflow-hidden transition-all duration-300 animate-in fade-in zoom-in slide-in-from-bottom-10'
          )}>
            <ChatHeader 
              chatMode={chatMode}
              staffName={liveChat.room?.staffName ?? undefined}
              onClose={closeChat}
              onToggleMode={setChatMode}
            />

            <ChatMessages 
              messages={currentMessages}
              isLoading={isLoading}
              chatMode={chatMode}
              onSendMessage={aiChat.sendMessage}
              isSavingItinerary={isSaving}
              onSaveItinerary={saveAIItinerary}
              onImageClick={setSelectedImage}
            />

            <ChatInput 
              chatMode={chatMode}
              inputText={inputText}
              setInputText={setInputText}
              onSend={handleSend}
              isAuthenticated={isAuthenticated}
              isLoading={isLoading}
              isSending={isSending}
              fileInputRef={attachments.fileInputRef}
              previewUrls={attachments.previewUrls}
              onFileSelect={attachments.handleFileSelect}
              onRemoveFile={attachments.removeFile}
              selectedFilesCount={attachments.selectedFiles.length}
            />
          </div>
        )}

        {/* Floating Button */}
        <button
          onClick={toggleChat}
          className={cn(
            'w-14 h-14 md:w-16 md:h-16 rounded-full flex items-center justify-center shadow-2xl transition-all duration-500 hover:scale-110',
            isOpen
              ? 'bg-zinc-900 text-white rotate-90'
              : 'bg-hanoi-red text-white hover:bg-[#6D1616]'
          )}
        >
          {isOpen ? (
            <X className="h-8 w-8" />
          ) : chatMode === 'AI' ? (
            <Sparkles className="h-8 w-8" />
          ) : (
            <Headset className="h-8 w-8" />
          )}
          {!isOpen && (
            <div className="absolute -top-1 -right-1 flex h-5 w-5">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-hanoi-gold opacity-75"></span>
              <span className="relative inline-flex rounded-full h-5 w-5 bg-hanoi-gold border-2 border-white text-[10px] font-bold text-hanoi-red items-center justify-center">
                {chatMode === 'AI' ? 'AI' : 'LIVE'}
              </span>
            </div>
          )}
        </button>
      </div>

      <ChatLightbox 
        image={selectedImage}
        onClose={() => setSelectedImage(null)}
      />
    </>
  )
}
