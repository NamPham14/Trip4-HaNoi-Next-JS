"use client";

import React from "react";
import { Search, MapPin, Sparkles } from "lucide-react";
import { RecommendationList } from "@/features/places/components/recommendation-list";
import { Navbar } from "@/shared/components/navbar";
import { Button } from "@/shared/components/ui/button";

export default function HomePage() {
  return (
    <div className="min-h-screen bg-hanoi-cream">
      <Navbar />

      {/* Hero Section */}
      <section className="relative py-12 md:py-20 px-4 overflow-hidden">
        <div className="container mx-auto text-center relative z-10">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 md:px-4 md:py-2 rounded-full bg-hanoi-gold/40 border border-hanoi-gold text-hanoi-red text-[10px] md:text-xs font-bold mb-6 animate-bounce">
            <Sparkles className="h-3 w-3" />
            Khám phá Hà Nội theo cách của bạn
          </div>
          <h1 className="text-4xl md:text-7xl font-bold text-zinc-900 mb-6 tracking-tight">
            Thủ Đô Trong <br className="hidden md:block" />
            <span className="text-hanoi-red">Tầm Tay Bạn</span>
          </h1>
          <p className="max-w-2xl mx-auto text-zinc-600 text-base md:text-lg mb-8 md:mb-10 leading-relaxed px-2">
            Hệ thống gợi ý địa điểm thông minh tích hợp AI, giúp bạn tìm thấy những quán ngon, 
            điểm đến đậm chất văn hóa dựa trên sở thích và vị trí của chính bạn.
          </p>

          {/* Quick Search Bar */}
          <div className="max-w-3xl mx-auto bg-white p-2 rounded-2xl shadow-2xl flex flex-col md:flex-row gap-2 border border-zinc-100 mx-2 md:mx-auto">
            <div className="flex-1 flex items-center px-4 gap-3 border-b md:border-b-0 md:border-r border-zinc-50 md:border-zinc-100">
              <Search className="h-5 w-5 text-zinc-400 shrink-0" />
              <input 
                type="text" 
                placeholder="Bạn muốn đi đâu hôm nay?" 
                className="w-full py-3 md:py-4 outline-none text-zinc-700 font-medium text-sm md:text-base"
              />
            </div>
            <div className="flex-1 flex items-center px-4 gap-3">
              <MapPin className="h-5 w-5 text-hanoi-red shrink-0" />
              <select className="w-full py-3 md:py-4 outline-none bg-transparent text-zinc-700 font-medium text-sm md:text-base appearance-none">
                <option>Tất cả các quận</option>
                <option>Hoàn Kiếm</option>
                <option>Ba Đình</option>
                <option>Cầu Giấy</option>
                <option>Tây Hồ</option>
              </select>
            </div>
            <Button className="bg-hanoi-red hover:bg-[#6D1616] text-white w-full md:w-auto px-8 py-6 md:py-7 rounded-xl font-bold transition-all text-sm md:text-base">
              Tìm kiếm ngay
            </Button>
          </div>
        </div>

        {/* Abstract Background Elements */}
        <div className="absolute top-20 left-[-10%] w-[50%] h-[50%] bg-hanoi-red/5 blur-[120px] rounded-full" />
        <div className="absolute bottom-0 right-[-10%] w-[40%] h-[40%] bg-hanoi-gold/20 blur-[100px] rounded-full" />
      </section>

      {/* Recommendations Section */}
      <section className="py-16 px-4 bg-white/50 backdrop-blur-sm border-t border-zinc-100">
        <div className="container mx-auto">
          <div className="flex items-end justify-between mb-10">
            <div>
              <h2 className="text-3xl font-bold text-zinc-900 mb-2">Gợi ý riêng cho bạn</h2>
              <p className="text-zinc-500 font-medium">Dựa trên gu ẩm thực và lịch sử di chuyển của bạn</p>
            </div>
            <Button variant="link" className="text-hanoi-red font-bold hover:no-underline underline-offset-4 decoration-2">
              Xem tất cả
            </Button>
          </div>
          
          <RecommendationList />
        </div>
      </section>

      {/* Events Section */}
      <FeaturedEventsSection />

      <Footer />
    </div>
  );
}

import { useEvents } from "@/features/events/hooks/use-events";
import Footer from "@/shared/components/Footer";
import { EventCard } from "@/features/events/components/event-card";
import { Event } from "@/features/events/types/event";
import Link from "next/link";
import { ArrowRight } from "lucide-react";

function FeaturedEventsSection() {
  const { data, isLoading } = useEvents({ page: 0, size: 3 });
  const events = data?.data || [];

  if (!isLoading && events.length === 0) return null;

  return (
    <section className="py-16 md:py-24 px-4 bg-zinc-50 border-t border-zinc-100 overflow-hidden relative">
      <div className="container mx-auto relative z-10">
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-10 md:mb-16 gap-4">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-hanoi-red/10 text-hanoi-red text-[10px] font-black uppercase tracking-widest mb-4">
              <Sparkles className="h-3 w-3" /> Đừng bỏ lỡ
            </div>
            <h2 className="text-3xl md:text-5xl font-black text-zinc-900 mb-4 tracking-tighter">
              Sự kiện đang <span className="text-hanoi-red">diễn ra</span>
            </h2>
            <p className="text-zinc-500 font-medium max-w-xl">
              Hà Nội luôn sôi động với các lễ hội truyền thống, triển lãm nghệ thuật và các sự kiện giải trí đặc sắc.
            </p>
          </div>
          <Link href="/events">
            <Button className="bg-zinc-900 hover:bg-hanoi-red text-white font-black px-8 h-14 rounded-2xl shadow-xl shadow-zinc-900/10 transition-all active:scale-95">
              Xem tất cả sự kiện <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
          </Link>
        </div>

        {isLoading ? (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 opacity-50">
            {[1, 2, 3].map((i) => (
              <div key={i} className="bg-white rounded-[32px] aspect-[4/5] animate-pulse" />
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {events.map((event: Event) => (
              <EventCard key={event.id} event={event} />
            ))}
          </div>
        )}
      </div>
      
      {/* Decoration */}
      <div className="absolute top-0 right-0 p-20 opacity-[0.03] pointer-events-none select-none">
        <span className="text-[20vw] font-black italic tracking-tighter">HANOI</span>
      </div>
    </section>
  );
}
