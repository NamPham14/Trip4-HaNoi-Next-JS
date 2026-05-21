/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useState, useRef, useEffect } from 'react';
import { ChatRoomResponse, Message } from '../../types/chat';
import { cn } from '@/shared/lib/utils';
import { 
  Send, Shield, Info, Lock, Loader2, MessageSquare, 
  MoreVertical, X, StickyNote, User, Image as ImageIcon 
} from 'lucide-react';
import { Button } from '@/shared/components/ui/button';
import { Badge } from '@/shared/components/ui/badge';
import { toast } from 'sonner';

interface ChatRoomProps {
  room: ChatRoomResponse | undefined;
  messages: Message[];
  internalNotes: any[];
  // CẬP NHẬT: onSendMessage nhận thêm mảng Files
  onSendMessage: (content: string, files?: File[]) => void;
  onAddNote: (content: string) => void;
  onClaim: () => void;
  isLoading: boolean;
}

export const ChatRoom = ({ room, messages, internalNotes, onSendMessage, onAddNote, onClaim, isLoading }: ChatRoomProps) => {
  const [inputText, setInputText] = useState("");
  const [isNoteMode, setIsNoteMode] = useState(false);
  const [showNotesPanel, setShowNotesPanel] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  // --- THÊM STATE ĐỂ QUẢN LÝ ẢNH (Tương tự ChatWidget) ---
  const [selectedFiles, setSelectedFiles] = useState<File[]>([]);
  const [previewUrls, setPreviewUrls] = useState<string[]>([]);
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [isSending, setIsSending] = useState(false);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages, isLoading]);

  // Giải phóng bộ nhớ preview
  useEffect(() => {
    return () => previewUrls.forEach(url => URL.revokeObjectURL(url));
  }, [previewUrls]);

  // --- HÀM XỬ LÝ CHỌN ẢNH ---
  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files) return;
    const newFiles = Array.from(e.target.files);
    if (selectedFiles.length + newFiles.length > 5) {
      toast.error("Chỉ được gửi tối đa 5 ảnh.");
      return;
    }
    setSelectedFiles(prev => [...prev, ...newFiles]);
    const newUrls = newFiles.map(file => URL.createObjectURL(file));
    setPreviewUrls(prev => [...prev, ...newUrls]);
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  // --- HÀM XÓA ẢNH PREVIEW ---
  const removeFile = (index: number) => {
    setSelectedFiles(prev => prev.filter((_, i) => i !== index));
    setPreviewUrls(prev => {
      const newUrls = [...prev];
      URL.revokeObjectURL(newUrls[index]);
      newUrls.splice(index, 1);
      return newUrls;
    });
  };

  const handleSend = async () => {
    const hasText = inputText.trim().length > 0;
    const hasFiles = selectedFiles.length > 0;

    if (!hasText && !hasFiles) return;
    
    setIsSending(true);
    try {
      if (isNoteMode) {
        onAddNote(inputText);
      } else {
        // Gửi cả chữ và ảnh cho khách
        await onSendMessage(inputText, selectedFiles);
        // Reset ảnh sau khi gửi
        setSelectedFiles([]);
        setPreviewUrls([]);
      }
      setInputText("");
    } finally {
      setIsSending(false);
    }
  };

  // --- HÀM RENDER ẢNH TRONG TIN NHẮN ---
  const renderMessageImages = (urls: string[] | undefined) => {
    if (!urls || urls.length === 0) return null;
    const count = urls.length;
    const gridClass = count === 1 ? "grid-cols-1" : "grid-cols-2";
    
    return (
      <div className={`grid ${gridClass} gap-1 mb-2 mt-1 rounded-xl overflow-hidden`}>
        {urls.map((url, idx) => (
          <div 
            key={idx} 
            className="relative aspect-square bg-zinc-100 cursor-pointer overflow-hidden group"
            onClick={() => setSelectedImage(url)}
          >
             <img 
               src={url} 
               alt="attached" 
               className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105" 
             />
          </div>
        ))}
      </div>
    );
  };

  if (!room) {
    return (
      <div className="flex-1 flex flex-col items-center justify-center bg-zinc-50 text-zinc-400 p-10">
        <div className="bg-white p-8 rounded-3xl shadow-sm border border-zinc-100 flex flex-col items-center gap-4">
          <div className="bg-zinc-50 w-20 h-20 rounded-full flex items-center justify-center">
            <MessageSquare className="h-10 w-10 text-zinc-200" />
          </div>
          <p className="text-sm font-medium">Chọn một hội thoại để bắt đầu hỗ trợ</p>
        </div>
      </div>
    );
  }

  return (
    <>
      <div className="flex-1 flex flex-row bg-white h-full relative overflow-hidden">
        <div className="flex-1 flex flex-col h-full min-w-0">
          {/* Header */}
          <div className="p-4 border-b border-zinc-200 flex justify-between items-center bg-white z-10 shadow-sm">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-hanoi-gold/10 flex items-center justify-center text-hanoi-red font-bold overflow-hidden">
                {room.userAvatar ? (
                      <img src={room.userAvatar} alt={room.userName} className="w-full h-full object-cover" />
                ) : room.userName.charAt(0)}
              </div>
              <div>
                <h3 className="font-bold text-zinc-900">{room.userName}</h3>
                <div className="flex items-center gap-2">
                  <span className="text-[10px] text-zinc-400 font-medium">User ID: #{room.userId}</span>
                  <Badge variant="secondary" className={cn(
                      "text-[9px] h-4 uppercase font-bold px-1.5",
                      room.status === 'PENDING' ? "bg-amber-100 text-amber-700" : "bg-emerald-100 text-emerald-700"
                  )}>
                      {room.status}
                  </Badge>
                </div>
              </div>
            </div>
            
            <div className="flex items-center gap-2">
              {room.status === 'PENDING' && (
                  <Button 
                  onClick={onClaim}
                  className="bg-hanoi-red hover:bg-[#6D1616] text-white font-bold text-xs px-6 rounded-full"
                  >
                  Tiếp nhận hỗ trợ
                  </Button>
              )}
              <button 
                  onClick={() => setShowNotesPanel(!showNotesPanel)}
                  className={cn(
                      "p-2 rounded-full transition-all relative",
                      showNotesPanel ? "bg-emerald-50 text-emerald-600" : "hover:bg-zinc-100 text-zinc-400"
                  )}
                  title="Ghi chú nội bộ"
              >
                  <MoreVertical className="h-5 w-5" />
                  {internalNotes.length > 0 && !showNotesPanel && (
                      <span className="absolute top-1 right-1 w-2 h-2 bg-emerald-500 rounded-full border border-white"></span>
                  )}
              </button>
            </div>
          </div>

          {/* Messages */}
          <div ref={scrollRef} className="flex-1 overflow-y-auto p-6 space-y-4 bg-[#F8F9FA]">
            {isLoading && (
              <div className="flex justify-center py-10">
                <Loader2 className="h-6 w-6 animate-spin text-hanoi-red" />
              </div>
            )}
            
            {messages.map((msg, idx) => (
              <div
                key={`${msg.id}-${msg.role}-${idx}`}
                className={cn(
                  "flex gap-3 w-full animate-in fade-in slide-in-from-bottom-2 duration-300",
                  msg.role === "staff" ? "flex-row-reverse" : "flex-row"
                )}
              >
                {msg.role !== "staff" && msg.role !== "system" && (
                  <div className="flex-shrink-0 mt-1">
                    <div className="w-8 h-8 rounded-full bg-white flex items-center justify-center overflow-hidden border border-zinc-200">
                      {msg.senderAvatar ? (
                        <img src={msg.senderAvatar} alt={msg.senderName} className="w-full h-full object-cover" />
                      ) : (
                        <span className="text-[10px] font-bold text-zinc-400">{msg.senderName?.charAt(0) || 'U'}</span>
                      )}
                    </div>
                  </div>
                )}

                <div className={cn(
                    "flex flex-col max-w-[70%]",
                    msg.role === "staff" ? "items-end" : "items-start",
                    msg.role === "system" ? "mx-auto max-w-full" : ""
                  )}
                >
                  <div className={cn(
                      "p-3.5 rounded-2xl text-[14px] leading-relaxed shadow-sm w-full",
                      msg.role === "user"
                        ? "bg-white text-zinc-800 rounded-tl-none border border-zinc-100"
                        : msg.role === "system"
                        ? "bg-zinc-200/50 text-zinc-500 text-[11px] italic mx-auto max-w-full rounded-lg shadow-none border-none text-center px-6"
                        : "bg-[#8B1D1D] text-white rounded-tr-none"
                    )}
                  >
                    <div className="flex flex-col gap-1">
                      {msg.role === 'staff' && (
                        <span className="text-[9px] font-bold uppercase tracking-widest opacity-70 mb-1 flex items-center gap-1">
                          <Shield className="h-2.5 w-2.5" /> Bạn
                        </span>
                      )}
                      
                      {/* --- THÊM: Render ảnh trong tin nhắn --- */}
                      {renderMessageImages(msg.mediaUrls)}
                      
                      {typeof msg.content === 'string' ? msg.content : 'Dữ liệu không hợp lệ'}
                    </div>
                  </div>
                  {msg.role !== 'system' && (
                    <span className="text-[10px] text-zinc-400 mt-1 font-medium px-1">
                      {new Date(msg.timestamp).toLocaleTimeString([], {
                        hour: "2-digit",
                        minute: "2-digit",
                      })}
                    </span>
                  )}
                </div>
              </div>
            ))}
          </div>

          {/* Input */}
          <div className="p-4 border-t border-zinc-100 bg-white">
            <div className="flex flex-col gap-3">
              {/* Note / Message Toggle */}
              <div className="flex gap-2">
                <button
                  onClick={() => setIsNoteMode(false)}
                  className={cn(
                    "px-3 py-1.5 rounded-full text-[10px] font-bold uppercase tracking-wider transition-all border",
                    !isNoteMode 
                      ? "bg-[#8B1D1D] text-white border-[#8B1D1D] shadow-md shadow-red-900/20" 
                      : "bg-white text-zinc-400 border-zinc-100 hover:bg-zinc-50"
                  )}
                >
                  Tin nhắn khách
                </button>
                <button
                  onClick={() => setIsNoteMode(true)}
                  className={cn(
                    "px-3 py-1.5 rounded-full text-[10px] font-bold uppercase tracking-wider transition-all border flex items-center gap-1.5",
                    isNoteMode 
                      ? "bg-emerald-600 text-white border-emerald-600 shadow-md shadow-emerald-600/20" 
                      : "bg-white text-zinc-400 border-zinc-100 hover:bg-zinc-50"
                  )}
                >
                  <Lock className="h-3 w-3" />
                  Ghi chú nội bộ
                </button>
              </div>

              {/* Image Preview (Chỉ hiện ở mode nhắn khách) */}
              {!isNoteMode && previewUrls.length > 0 && (
                <div className="flex gap-2 mb-1 overflow-x-auto pb-2">
                  {previewUrls.map((url, idx) => (
                    <div key={idx} className="relative flex-shrink-0">
                      <img src={url} alt="preview" className="w-16 h-16 object-cover rounded-xl border border-zinc-200" />
                      <button
                        onClick={() => removeFile(idx)}
                        className="absolute -top-1 -right-1 bg-zinc-800 text-white p-0.5 rounded-full hover:bg-hanoi-red shadow-sm"
                      >
                        <X className="h-3 w-3" />
                      </button>
                    </div>
                  ))}
                </div>
              )}
              
              <div className="flex items-center gap-2">
                <div className={cn(
                  "flex-1 rounded-2xl px-4 py-3 border transition-all flex items-center gap-3",
                  isNoteMode 
                    ? "bg-emerald-50 border-emerald-100 focus-within:border-emerald-500" 
                    : "bg-zinc-50 border-zinc-100 focus-within:border-[#8B1D1D]"
                )}>
                  {/* --- THÊM: Nút chọn ảnh (Chỉ hiện ở chế độ nhắn khách) --- */}
                  {!isNoteMode && (
                    <>
                      <input 
                        type="file" 
                        multiple 
                        accept="image/*"
                        className="hidden" 
                        ref={fileInputRef}
                        onChange={handleFileSelect}
                      />
                      <button 
                        onClick={() => fileInputRef.current?.click()}
                        className="p-1 text-zinc-400 hover:text-hanoi-red transition-colors"
                        title="Đính kèm ảnh"
                      >
                        <ImageIcon className="h-5 w-5" />
                      </button>
                    </>
                  )}

                  <textarea 
                    rows={1}
                    placeholder={isNoteMode ? "Chỉ Staff & Admin thấy ghi chú này..." : "Nhập câu trả lời..."} 
                    className="flex-1 bg-transparent outline-none text-sm font-medium text-zinc-700 resize-none max-h-32"
                    value={inputText}
                    onChange={(e) => setInputText(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter' && !e.shiftKey) {
                        e.preventDefault();
                        handleSend();
                      }
                    }}
                  />
                  <button 
                    onClick={handleSend}
                    disabled={isSending || ((!inputText.trim() && selectedFiles.length === 0) || (room.status === 'PENDING' && !isNoteMode))}
                    className={cn(
                      "p-2.5 rounded-xl text-white transition-all disabled:opacity-50 flex-shrink-0",
                      isNoteMode ? "bg-emerald-600 hover:bg-emerald-700" : "bg-[#8B1D1D] hover:bg-[#6D1616]"
                    )}
                  >
                    {isSending ? <Loader2 className="h-4 w-4 animate-spin" /> : <Send className="h-4 w-4" />}
                  </button>
                </div>
              </div>
              {room.status === 'PENDING' && !isNoteMode && (
                <p className="text-[10px] text-amber-600 font-bold italic flex items-center gap-1 ml-2">
                 <Info className="h-3 w-3" /> Hãy &quot;Tiếp nhận&quot; trước khi trả lời khách
                </p>
              )}
            </div>
          </div>
        </div>

        {/* Notes Side Panel */}
        <div className={cn(
          "w-80 border-l border-zinc-200 bg-zinc-50 h-full flex flex-col transition-all duration-300 absolute right-0 top-0 z-20 shadow-2xl md:relative md:shadow-none",
          showNotesPanel ? "translate-x-0" : "translate-x-full md:hidden"
        )}>
          <div className="p-4 border-b border-zinc-200 bg-white flex justify-between items-center">
            <div className="flex items-center gap-2 text-emerald-700 font-bold text-sm">
              <StickyNote className="h-4 w-4" />
              Ghi chú nội bộ
            </div>
            <button 
              onClick={() => setShowNotesPanel(false)}
              className="p-1 hover:bg-zinc-100 rounded-full transition-colors text-zinc-400"
            >
              <X className="h-5 w-5" />
            </button>
          </div>
          
          <div className="flex-1 overflow-y-auto p-4 space-y-4">
            {internalNotes.length === 0 ? (
              <div className="text-center py-10 space-y-2">
                <div className="bg-white w-12 h-12 rounded-full flex items-center justify-center mx-auto border border-zinc-100">
                  <Lock className="h-6 w-6 text-zinc-200" />
                </div>
                <p className="text-xs text-zinc-400">Chưa có ghi chú nào cho phòng này</p>
              </div>
            ) : (
              internalNotes.map((note) => (
                <div key={note.id} className="bg-white p-4 rounded-2xl border border-emerald-100 shadow-sm space-y-2 animate-in fade-in slide-in-from-right-4">
                  <div className="flex justify-between items-center border-b border-zinc-50 pb-2">
                    <span className="text-[10px] font-bold text-emerald-600 uppercase tracking-tighter flex items-center gap-1">
                      <User className="h-2.5 w-2.5" /> {note.authorName}
                    </span>
                    <span className="text-[9px] text-zinc-400 font-medium">
                      {new Date(note.createdAt).toLocaleString([], { hour: '2-digit', minute: '2-digit', day: '2-digit', month: '2-digit' })}
                    </span>
                  </div>
                  <p className="text-xs text-zinc-700 leading-relaxed font-medium">
                    {note.content}
                  </p>
                </div>
              ))
            )}
          </div>
          
          <div className="p-4 bg-emerald-50 text-[10px] text-emerald-600 font-medium italic border-t border-emerald-100">
            <Info className="h-3 w-3 inline mr-1" />
            Mọi ghi chú ở đây khách hàng đều không thể thấy.
          </div>
        </div>
      </div>

      {/* --- MÀN HÌNH XEM ẢNH PHÓNG TO (LIGHTBOX) --- */}
      {selectedImage && (
        <div 
          className="fixed inset-0 z-[9999] bg-black/90 flex items-center justify-center backdrop-blur-sm p-4 animate-in fade-in duration-200"
          onClick={() => setSelectedImage(null)}
        >
          <button 
            className="absolute top-6 right-6 text-white/70 hover:text-white bg-black/50 p-2 rounded-full transition-colors"
            onClick={() => setSelectedImage(null)}
          >
            <X className="h-8 w-8" />
          </button>
          
          <div className="relative w-full max-w-5xl max-h-[90vh] flex items-center justify-center">
            <img 
              src={selectedImage} 
              alt="zoomed" 
              className="max-w-full max-h-[90vh] object-contain rounded-md shadow-2xl"
              onClick={(e) => e.stopPropagation()}
            />
          </div>
        </div>
      )}
    </>
  );
};
