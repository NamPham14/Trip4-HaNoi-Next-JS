/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import React, { useRef, useEffect, useState } from "react";
import { MessageSquare, X, Send, Sparkles, MapPin, Clock, Info, Bookmark, Loader2, Headset, Bot, User } from "lucide-react";
import { useChat } from "../hooks/use-chat";
import { useLiveChat } from "../hooks/use-live-chat";
import { useUser } from "@/features/auth/hooks/use-auth";
import { useItinerary } from "@/features/itinerary/hooks/use-itinerary";
import { Button } from "@/shared/components/ui/button";
import { cn } from "@/shared/lib/utils";
import { ChatAIResponse, ChatMode, Message, ScheduleItem } from "../types/chat";
import { Badge } from "@/shared/components/ui/badge";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useChatStore } from "@/shared/store/chat-store";

export const ChatWidget = () => {
  const pathname = usePathname();
  const { isOpen, chatMode, setChatMode, closeChat, toggleChat } = useChatStore();
  const [inputText, setInputText] = useState("");

  useEffect(() => {
    console.log(">>>>>>>ChatWidget State Change - isOpen:", isOpen, "mode:", chatMode);
  }, [isOpen, chatMode]);
  
  const aiChat = useChat();
  const liveChat = useLiveChat();
  
  const { saveAIItinerary, isLoading: isSaving } = useItinerary();
  const { isAuthenticated, user } = useUser();
  const scrollRef = useRef<HTMLDivElement>(null);

  // Use either AI or Live messages based on mode
  const currentMessages = chatMode === "AI" ? aiChat.messages : liveChat.messages;
  const isLoading = chatMode === "AI" ? aiChat.isLoading : liveChat.isLoadingHistory;

  // Auto scroll to bottom when new messages arrive
  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [currentMessages, isLoading]);

  const handleSend = () => {
    if (!inputText.trim()) return;
    
    if (chatMode === "AI") {
      if (aiChat.isLoading) return;
      aiChat.sendMessage(inputText);
    } else {
      liveChat.sendMessage(inputText);
    }
    
    setInputText("");
  };

  const toggleMode = (mode: ChatMode) => {
    setChatMode(mode);
  };

  // Don't show chat widget on admin pages
  if (pathname?.startsWith('/admin')) {
    return null;
  }

  return (
    <div className="fixed bottom-6 right-6 z-[100] flex flex-col items-end">
      {/* Chat Window */}
      {isOpen && (
        <div className={cn(
          "mb-4 w-[90vw] md:w-[400px] h-[70vh] md:h-[600px] bg-white rounded-3xl shadow-2xl border border-zinc-100 flex flex-col overflow-hidden transition-all duration-300 animate-in fade-in zoom-in slide-in-from-bottom-10",
        )}>
          {/* Header */}
          <div className="bg-hanoi-red p-4 flex items-center justify-between text-white">
            <div className="flex items-center gap-3">
              <div className="bg-white/20 p-2 rounded-xl backdrop-blur-md">
                {chatMode === "AI" ? <Sparkles className="h-5 w-5" /> : <Headset className="h-5 w-5" />}
              </div>
              <div>
                <h3 className="font-bold">
                  {chatMode === "AI" ? "Local Buddy AI" : (liveChat.room?.staffName ? `Hỗ trợ: ${liveChat.room.staffName}` : "Hỗ trợ trực tuyến")}
                </h3>
                <p className="text-[10px] text-white/70 uppercase tracking-widest font-bold">
                  {chatMode === "AI" ? "Người bạn đồng hành Hà Nội" : "Đội ngũ Trip4 Hà Nội"}
                </p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              {/* Mode Switcher */}
              <div className="flex bg-black/20 rounded-full p-1 mr-2">
                <button 
                  onClick={() => toggleMode("AI")}
                  className={cn(
                    "p-1.5 rounded-full transition-all",
                    chatMode === "AI" ? "bg-white text-hanoi-red" : "text-white/70 hover:text-white"
                  )}
                  title="Chat với AI"
                >
                  <Bot className="h-4 w-4" />
                </button>
                <button 
                  onClick={() => toggleMode("LIVE")}
                  className={cn(
                    "p-1.5 rounded-full transition-all",
                    chatMode === "LIVE" ? "bg-white text-hanoi-red" : "text-white/70 hover:text-white"
                  )}
                  title="Gặp nhân viên"
                >
                  <Headset className="h-4 w-4" />
                </button>
              </div>
              <button 
                onClick={closeChat}
                className="p-1 hover:bg-white/10 rounded-full transition-colors"
              >
                <X className="h-6 w-6" />
              </button>
            </div>
          </div>

          {/* Messages Area */}
          <div ref={scrollRef} className="flex-1 overflow-y-auto p-4 space-y-4 bg-hanoi-cream/30">
            {currentMessages.length === 0 && !isLoading && (
              <div className="text-center py-10 space-y-4">
                <div className="bg-hanoi-gold/20 w-16 h-16 rounded-full flex items-center justify-center mx-auto">
                  {chatMode === "AI" ? (
                    <Sparkles className="h-8 w-8 text-hanoi-red" />
                  ) : (
                    <Headset className="h-8 w-8 text-hanoi-red" />
                  )}
                </div>
                <div className="space-y-1">
                  <p className="font-bold text-zinc-900">
                    {chatMode === "AI" ? "Xin chào! Tôi là Local Buddy" : "Chào bạn! Chúng tôi có thể giúp gì?"}
                  </p>
                  <p className="text-xs text-zinc-500 px-10">
                    {chatMode === "AI" 
                      ? "Tôi có thể giúp bạn lên lịch trình, tìm quán ăn ngon hoặc các sự kiện tại Hà Nội."
                      : "Gửi tin nhắn để kết nối trực tiếp với đội ngũ hỗ trợ của Trip4 Hà Nội."}
                  </p>
                </div>
                {chatMode === "AI" && (
                  <div className="flex flex-wrap justify-center gap-2 pt-4">
                    {["Đi đâu ở Cầu Giấy?", "Lên lịch trình 1 ngày", "Món ăn phải thử"].map((suggestion) => (
                      <button 
                        key={suggestion}
                        onClick={() => aiChat.sendMessage(suggestion)}
                        className="text-[10px] font-bold bg-white border border-zinc-100 px-3 py-1.5 rounded-full text-zinc-600 hover:border-hanoi-red hover:text-hanoi-red transition-all"
                      >
                        {suggestion}
                      </button>
                    ))}
                  </div>
                )}
              </div>
            )}

            {currentMessages.map((msg, idx) => {
              const { content } = msg;
              const isString = typeof content === "string";

              return (
                <div
                  key={`${msg.id}-${msg.role}-${idx}`}
                  className={cn(
                    "flex gap-2 w-full",
                    msg.role === "user" ? "flex-row-reverse" : "flex-row"
                  )}
                >
                  {/* Avatar for Staff or AI */}
                  {msg.role !== "user" && msg.role !== "system" && (
                    <div className="flex-shrink-0 mt-1">
                      {msg.role === "ai" ? (
                        <div className="w-8 h-8 rounded-full bg-hanoi-gold/20 flex items-center justify-center">
                          <Sparkles className="h-4 w-4 text-hanoi-red" />
                        </div>
                      ) : (
                        <div className="w-8 h-8 rounded-full bg-zinc-100 flex items-center justify-center overflow-hidden border border-zinc-200">
                          {msg.senderAvatar ? (
                            <img src={msg.senderAvatar} alt={msg.senderName} className="w-full h-full object-cover" />
                          ) : (
                            <User className="h-4 w-4 text-zinc-400" />
                          )}
                        </div>
                      )}
                    </div>
                  )}

                  <div
                    className={cn(
                      "flex flex-col max-w-[75%]",
                      msg.role === "user" ? "items-end" : "items-start",
                      msg.role === "system" ? "mx-auto max-w-full" : ""
                    )}
                  >
                    {/* Sender Name for Staff */}
                    {msg.role === "staff" && (
                      <span className="text-[10px] font-bold text-zinc-400 ml-1 mb-1 uppercase tracking-tighter">
                        {msg.senderName || "Nhân viên"}
                      </span>
                    )}

                    <div
                      className={cn(
                        "p-4 rounded-2xl text-sm leading-relaxed shadow-sm",
                        msg.role === "user"
                          ? "bg-hanoi-red text-white rounded-tr-none"
                          : msg.role === "system"
                          ? "bg-zinc-100 text-zinc-500 text-[11px] italic text-center rounded-lg shadow-none border-none"
                          : "bg-white text-zinc-800 rounded-tl-none border border-zinc-100"
                      )}
                    >
                      {isString ? (
                        content
                      ) : (
                        <div className="space-y-4">
                          <p className={cn(
                            "font-medium text-zinc-800",
                            (content as ChatAIResponse).timeline.length > 0 ? "text-zinc-900" : ""
                          )}>
                            {(content as ChatAIResponse).introduction}
                          </p>

                          {/* Timeline Rendering */}
                          {(content as ChatAIResponse).timeline && (content as ChatAIResponse).timeline.length > 0 && (
                            <div className="space-y-3 pt-4 border-t border-zinc-100">
                              {(content as ChatAIResponse).timeline.map((item, idx) => (
                                <div key={idx} className="flex gap-3 group">
                                  <div className="flex flex-col items-center">
                                    <div className="h-6 w-6 rounded-full bg-hanoi-red/10 flex items-center justify-center text-[10px] font-bold text-hanoi-red">
                                      {idx + 1}
                                    </div>
                                    {idx !== (content as ChatAIResponse).timeline.length - 1 && (
                                      <div className="w-px flex-1 bg-hanoi-red/10 my-1" />
                                    )}
                                  </div>
                                  <div className="flex-1 pb-4">
                                    <div className="flex items-center gap-2 mb-1">
                                      <Badge
                                        variant="secondary"
                                        className="text-[10px] bg-zinc-50 font-bold px-1.5 py-0"
                                      >
                                        {item.time}
                                      </Badge>
                                      <span className="text-[10px] font-bold text-zinc-400 uppercase tracking-widest">
                                        {item.estimatedCost
                                          ? `${item.estimatedCost.toLocaleString()}đ`
                                          : ""}
                                      </span>
                                    </div>
                                    <p className="font-bold text-zinc-900 text-xs">
                                      {item.activity}
                                    </p>
                                    {item.note && (
                                      <p className="text-[11px] text-zinc-500 italic mt-1">
                                        {item.note}
                                      </p>
                                    )}
                                    {item.placeId && (
                                      <Link
                                        href={`/places/${item.placeId}`}
                                        className="inline-flex items-center gap-1 mt-2 text-[10px] font-bold text-hanoi-red hover:underline"
                                      >
                                        <Info className="h-3 w-3" /> Xem chi tiết
                                      </Link>
                                    )}
                                  </div>
                                </div>
                              ))}
                            </div>
                          )}

                          {(content as ChatAIResponse).summary && (
                            <p className="text-xs text-zinc-500 pt-2 italic">
                              {(content as ChatAIResponse).summary}
                            </p>
                          )}

                          {/* Save Itinerary Button */}
                          {(content as ChatAIResponse).timeline && (content as ChatAIResponse).timeline.length > 0 && (
                            <div className="pt-2 border-t border-zinc-50 mt-2 flex justify-end">
                              <Button
                                variant="ghost"
                                size="sm"
                                className="text-[10px] font-bold text-hanoi-red hover:bg-hanoi-red/5 h-8 gap-2 rounded-xl"
                                disabled={isSaving}
                                onClick={() =>
                                  saveAIItinerary("Lịch trình từ AI", (content as ChatAIResponse).timeline)
                                }
                              >
                                {isSaving ? (
                                  <Loader2 className="h-3 w-3 animate-spin" />
                                ) : (
                                  <Bookmark className="h-3 w-3" />
                                )}
                                Lưu lịch trình này
                              </Button>
                            </div>
                          )}
                        </div>
                      )}
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
              );
            })}

            {isLoading && (
              <div className="flex items-start max-w-[85%]">
                <div className="bg-white p-4 rounded-2xl rounded-tl-none border border-zinc-100 shadow-sm flex items-center gap-2">
                  <div className="flex gap-1">
                    <div className="w-1.5 h-1.5 bg-hanoi-red rounded-full animate-bounce [animation-delay:-0.3s]" />
                    <div className="w-1.5 h-1.5 bg-hanoi-red rounded-full animate-bounce [animation-delay:-0.15s]" />
                    <div className="w-1.5 h-1.5 bg-hanoi-red rounded-full animate-bounce" />
                  </div>
                  <span className="text-xs font-bold text-zinc-400 uppercase tracking-widest">
                    {chatMode === "AI" ? "Local Buddy đang nghĩ..." : "Đang kết nối..."}
                  </span>
                </div>
              </div>
            )}
          </div>

          {/* Input Area */}
          <div className="p-4 bg-white border-t border-zinc-100">
            {!isAuthenticated ? (
              <div className="text-center space-y-3 py-2">
                <p className="text-xs text-zinc-500 font-medium">Bạn cần đăng nhập để trò chuyện</p>
                <Link href="/login">
                  <Button size="sm" className="bg-hanoi-red hover:bg-[#6D1616] font-bold rounded-full px-8">
                    Đăng nhập ngay
                  </Button>
                </Link>
              </div>
            ) : (
              <div className="flex items-center gap-2">
                <div className="flex-1 bg-zinc-50 rounded-2xl px-4 py-2 border border-zinc-100 flex items-center gap-2 focus-within:border-hanoi-red transition-all">
                  <input 
                    type="text" 
                    placeholder={chatMode === "AI" ? "Hỏi Local Buddy..." : "Nhắn cho đội ngũ hỗ trợ..."} 
                    className="flex-1 bg-transparent outline-none text-sm font-medium text-zinc-700"
                    value={inputText}
                    onChange={(e) => setInputText(e.target.value)}
                    onKeyDown={(e) => e.key === 'Enter' && handleSend()}
                  />
                  <button 
                    onClick={handleSend}
                    disabled={!inputText.trim() || (chatMode === "AI" && aiChat.isLoading)}
                    className="p-1.5 bg-hanoi-red text-white rounded-xl hover:bg-[#6D1616] disabled:opacity-50 transition-all"
                  >
                    <Send className="h-4 w-4" />
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Floating Button */}
      <button 
        onClick={toggleChat}
        className={cn(
          "w-14 h-14 md:w-16 md:h-16 rounded-full flex items-center justify-center shadow-2xl transition-all duration-500 hover:scale-110",
          isOpen 
            ? "bg-zinc-900 text-white rotate-90" 
            : "bg-hanoi-red text-white hover:bg-[#6D1616]"
        )}
      >
        {isOpen ? <X className="h-8 w-8" /> : (chatMode === "AI" ? <Sparkles className="h-8 w-8" /> : <Headset className="h-8 w-8" />)}
        {!isOpen && (
          <div className="absolute -top-1 -right-1 flex h-5 w-5">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-hanoi-gold opacity-75"></span>
            <span className="relative inline-flex rounded-full h-5 w-5 bg-hanoi-gold border-2 border-white text-[10px] font-bold text-hanoi-red items-center justify-center">
              {chatMode === "AI" ? "AI" : "LIVE"}
            </span>
          </div>
        )}
      </button>
    </div>
  );
};