"use client";

import React, { useState } from "react";
import { Navbar } from "@/shared/components/navbar";
import Footer from "@/shared/components/Footer";
import { useEvents } from "@/features/events/hooks/use-events";
import { EventCard } from "@/features/events/components/event-card";
import { EventFilterBar } from "@/features/events/components/event-filter-bar";
import { Loader2, Sparkles, Calendar, Search as SearchIconLucide, MapPin, Wind, History, Scroll } from "lucide-react";
import { Button } from "@/shared/components/ui/button";
import { cn } from "@/shared/lib/utils";

export default function EventsPage() {
  const [keyword, setKeyword] = useState("");
  const [page, setPage] = useState(0);

  const { data, isLoading, isError } = useEvents({
    keyword: keyword || undefined,
    page: page,
    size: 9
  });

  const events = data?.data || [];

  return (
    <div className="min-h-screen bg-[#FAF9F6] flex flex-col selection:bg-hanoi-red/10 selection:text-hanoi-red">
      <Navbar />

      <main className="flex-1">
        {/* Concept: The Gateway to Hanoi (Khuê Văn Các Spirit) */}
        <section className="relative pt-24 pb-40 overflow-hidden border-b border-hanoi-red/10 bg-[#F1EDE4]">
          {/* Subtle Traditional Texture */}
          <div className="absolute inset-0 opacity-[0.04] pointer-events-none" 
            style={{ backgroundImage: `url("data:image/svg+xml,%3Csvg width='100' height='100' viewBox='0 0 100 100' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M11 18c3.866 0 7-3.134 7-7s-3.134-7-7-7-7 3.134-7 7 3.134 7 7 7zm48 25c3.866 0 7-3.134 7-7s-3.134-7-7-7-7 3.134-7 7 3.134 7 7 7zm-43-7c1.657 0 3-1.343 3-3s-1.343-3-3-3-3 1.343-3 3 1.343 3 3 3zm63 31c1.657 0 3-1.343 3-3s-1.343-3-3-3-3 1.343-3 3 1.343 3 3 3zM34 90c1.657 0 3-1.343 3-3s-1.343-3-3-3-3 1.343-3 3 1.343 3 3 3zm56-76c1.105 0 2-.895 2-2s-.895-2-2-2-2 .895-2 2 .895 2 2 2zM12 86c1.105 0 2-.895 2-2s-.895-2-2-2-2 .895-2 2 .895 2 2 2zm66-3c1.105 0 2-.895 2-2s-.895-2-2-2-2 .895-2 2 .895 2 2 2zm-46-4c1.105 0 2-.895 2-2s-.895-2-2-2-2 .895-2 2 .895 2 2 2zm37-39c1.105 0 2-.895 2-2s-.895-2-2-2-2 .895-2 2 .895 2 2 2z' fill='%238B1D1D' fill-opacity='1' fill-rule='evenodd'/%3E%3C/svg%3E")` }} 
          />

          <div className="container mx-auto px-6 relative z-10">
            <div className="flex flex-col items-center text-center">
              <div className="flex items-center gap-4 mb-8 opacity-60">
                 <div className="h-px w-12 bg-hanoi-red" />
                 <History className="h-5 w-5 text-hanoi-red" />
                 <div className="h-px w-12 bg-hanoi-red" />
              </div>
              
              <h1 className="text-6xl md:text-9xl font-black text-zinc-900 tracking-tighter mb-6 relative inline-block">
                TINH HOA <br />
                <span className="text-hanoi-red italic font-serif">Sự Kiện</span>
                {/* Cultural Decoration */}
                <div className="absolute -right-8 -top-8 hidden md:block opacity-20 rotate-12">
                   <Scroll className="h-24 w-24 text-hanoi-red" />
                </div>
              </h1>
              
              <p className="text-zinc-500 text-lg md:text-xl font-medium mb-16 leading-relaxed max-w-2xl font-serif italic">
                &ldquo;Dẫu không thanh lịch cũng người Tràng An&rdquo; <br />
                <span className="not-italic font-sans text-sm font-black uppercase tracking-[0.3em] text-zinc-400 mt-4 block">
                  Trải nghiệm nhịp đập văn hóa Thăng Long
                </span>
              </p>

              <div className="w-full max-w-4xl bg-white shadow-[0_32px_64px_-16px_rgba(139,29,29,0.1)] rounded-[32px] p-2 md:p-3 border border-hanoi-red/5">
                <EventFilterBar 
                  keyword={keyword}
                  onKeywordChange={setKeyword}
                  onClear={() => setKeyword("")}
                />
              </div>
            </div>
          </div>
          
          {/* Side Decoration */}
          <div className="absolute left-10 top-1/2 -translate-y-1/2 hidden xl:flex flex-col items-center gap-20 opacity-10">
             <span className="rotate-90 font-black text-xs uppercase tracking-[1em] text-hanoi-red origin-center">THĂNG LONG</span>
             <Wind className="h-6 w-6 text-hanoi-red" />
             <span className="rotate-90 font-black text-xs uppercase tracking-[1em] text-hanoi-red origin-center">HÀ NỘI</span>
          </div>
        </section>

        {/* Content Section: The Gallery Concept */}
        <section className="container mx-auto px-6 py-24">
          <div className="flex flex-col md:flex-row md:items-end justify-between mb-16 gap-8">
            <div className="space-y-4">
              <div className="flex items-center gap-3">
                 <div className="w-10 h-10 rounded-xl bg-hanoi-red/5 flex items-center justify-center">
                    <Sparkles className="h-5 w-5 text-hanoi-red" />
                 </div>
                 <h2 className="text-3xl md:text-4xl font-black text-zinc-900 tracking-tight">Kỳ Đài Sự Kiện</h2>
              </div>
              <p className="text-zinc-500 font-medium max-w-md">Những hoạt động văn hóa, nghệ thuật và giải trí tiêu biểu đang diễn ra tại Thủ đô.</p>
            </div>
            
            <div className="flex items-center gap-4 bg-white px-6 py-3 rounded-2xl border border-zinc-100 shadow-sm">
               <span className="text-xs font-black uppercase tracking-widest text-zinc-400">Trạng thái:</span>
               <div className="flex items-center gap-2 text-hanoi-red font-black text-sm">
                  <div className="w-2 h-2 rounded-full bg-hanoi-red animate-pulse" />
                  Sống động
               </div>
            </div>
          </div>

          {isLoading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-12">
              {[1, 2, 3, 4, 5, 6].map((i) => (
                <div key={i} className="animate-pulse space-y-6">
                  <div className="aspect-[4/5] bg-zinc-100 rounded-[40px]" />
                  <div className="h-8 bg-zinc-100 rounded-2xl w-3/4 mx-auto" />
                </div>
              ))}
            </div>
          ) : isError ? (
            <div className="py-40 text-center bg-white rounded-[60px] border border-dashed border-hanoi-red/20 max-w-3xl mx-auto">
               <div className="w-20 h-20 bg-hanoi-red/5 rounded-full flex items-center justify-center mx-auto mb-8">
                  <History className="h-10 w-10 text-hanoi-red" />
               </div>
               <h3 className="text-2xl font-black text-zinc-900 mb-4">Giao thoa đứt đoạn</h3>
               <p className="text-zinc-500 mb-10">Máy chủ gặp lỗi trong quá trình đồng bộ dữ liệu sự kiện. Vui lòng quay lại sau.</p>
               <Button onClick={() => window.location.reload()} className="bg-zinc-900 hover:bg-hanoi-red text-white font-black px-10 h-14 rounded-2xl shadow-xl transition-all">
                  Thử lại ngay
               </Button>
            </div>
          ) : events.length === 0 ? (
            <div className="py-40 text-center bg-white rounded-[60px] border border-zinc-100 shadow-2xl shadow-hanoi-red/5 max-w-4xl mx-auto overflow-hidden relative">
               <div className="absolute inset-0 opacity-[0.02] pointer-events-none" style={{ backgroundImage: 'radial-gradient(#8B1D1D 1px, transparent 1px)', backgroundSize: '20px 20px' }} />
               <div className="relative z-10">
                 <SearchIconLucide className="h-20 w-20 text-zinc-100 mx-auto mb-8" />
                 <h3 className="text-3xl font-black text-zinc-900 mb-4">Không tìm thấy &ldquo;Bản sắc&rdquo;</h3>
                 <p className="text-zinc-500 text-lg mb-10 font-serif italic">Tiếc rằng chưa có sự kiện nào khớp với tìm kiếm của bạn tại thời điểm này.</p>
                 <Button onClick={() => setKeyword("")} variant="outline" className="h-14 px-10 rounded-2xl border-zinc-200 font-black uppercase tracking-widest text-xs">
                    Xem tất cả sự kiện
                 </Button>
               </div>
            </div>
          ) : (
            <>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-12 lg:gap-16">
                {events.map((event, index) => (
                  <div 
                    key={event.id} 
                    className="animate-in fade-in slide-in-from-bottom duration-1000 fill-mode-both"
                    style={{ animationDelay: `${index * 100}ms` }}
                  >
                    <EventCard event={event} />
                  </div>
                ))}
              </div>

              {/* Cultural Pagination */}
              {data && data.totalPages > 1 && (
                <div className="mt-32 flex flex-col items-center gap-12">
                   <div className="flex items-center gap-12">
                      <div className="h-px w-24 bg-zinc-100 hidden md:block" />
                      <div className="flex gap-4">
                        {Array.from({ length: data.totalPages }).map((_, i) => (
                          <button
                            key={i}
                            onClick={() => setPage(i)}
                            className={cn(
                              "w-14 h-14 rounded-2xl font-black transition-all active:scale-90 text-base border-2",
                              page === i 
                                ? "bg-hanoi-red border-hanoi-red text-white shadow-2xl shadow-hanoi-red/30 scale-110" 
                                : "bg-white border-zinc-50 text-zinc-400 hover:border-hanoi-red/20 hover:text-hanoi-red"
                            )}
                          >
                            {String(i + 1).padStart(2, '0')}
                          </button>
                        ))}
                      </div>
                      <div className="h-px w-24 bg-zinc-100 hidden md:block" />
                   </div>
                   <p className="text-[10px] font-black text-zinc-400 uppercase tracking-[0.5em]">Kế Thừa & Phát Huy</p>
                </div>
              )}
            </>
          )}
        </section>
        
        {/* Concept: Cultural Note */}
        <section className="bg-zinc-900 py-32 relative overflow-hidden">
           <div className="container mx-auto px-6 text-center">
              <div className="max-w-3xl mx-auto space-y-10">
                 <h3 className="text-white text-3xl md:text-5xl font-black tracking-tight leading-tight">
                    Hà Nội không chỉ là một địa điểm, <br />
                    <span className="text-hanoi-red italic font-serif">Đó là một tâm hồn.</span>
                 </h3>
                 <div className="h-px w-20 bg-hanoi-gold/30 mx-auto" />
                 <p className="text-zinc-500 font-medium leading-relaxed italic font-serif text-lg">
                    Cảm ơn bạn đã cùng Trip4Hanoi gìn giữ và lan tỏa những giá trị văn hóa Thủ đô qua từng hành trình.
                 </p>
              </div>
           </div>
           {/* Background Deco */}
           <div className="absolute top-1/2 left-0 -translate-y-1/2 opacity-[0.02] pointer-events-none">
              <span className="text-[40vw] font-black italic tracking-tighter text-white select-none">HANOI</span>
           </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
