"use client";

import React from "react";
import { Sparkles, ArrowRight, MapPin, Star, Heart, Clock, ChevronRight, Compass } from "lucide-react";
import { RecommendationList } from "@/features/places/components/recommendation-list";
import { PopularPlacesList } from "@/features/places/components/popular-places-list";
import { Navbar } from "@/shared/components/navbar";
import { Button } from "@/shared/components/ui/button";
import { AIQuickPlanner } from "@/shared/components/AIQuickPlanner";
import Footer from "@/shared/components/Footer";
import { useEvents } from "@/features/events/hooks/use-events";
import { EventCard } from "@/features/events/components/event-card";
import { Event } from "@/features/events/types/event";
import Link from "next/link";
import { useUser } from "@/features/auth/hooks/use-auth";
import { useFeaturedItineraries } from "@/features/itinerary/hooks/use-featured-itineraries";
import { ItineraryCard } from "@/features/itinerary/components/ItineraryCard";
import { Itinerary } from "@/features/itinerary/types/itinerary";
import { PricingSection } from "@/features/payment/components/pricing-section";

export default function HomePage() {
  const { isAuthenticated } = useUser();
  return (
    <div className="min-h-screen bg-hanoi-cream selection:bg-hanoi-red selection:text-white">
      <Navbar />

      {/* Hero Section */}
      <section className="relative min-h-[90vh] flex items-center justify-center pt-20 pb-12 px-4 overflow-hidden">
        {/* Background Image with Cinematic Overlay */}
        <div className="absolute inset-0 z-0">
          <img 
            src="https://images.unsplash.com/photo-1509062522246-3755977927d7?q=80&w=2000&auto=format&fit=crop" 
            alt="Hanoi Ancient Street" 
            className="w-full h-full object-cover scale-105 animate-slow-zoom"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-black/40 via-black/20 to-hanoi-cream" />
          <div className="absolute inset-0 bg-black/20 backdrop-blur-[2px]" />
        </div>

        <div className="container mx-auto relative z-10 text-center">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/10 backdrop-blur-md border border-white/20 text-hanoi-gold text-xs font-black uppercase tracking-widest mb-8 animate-fade-in-down">
            <Sparkles className="h-4 w-4 fill-current" />
            AI-Powered Personal Travel Planner
          </div>
          
          <h1 className="text-5xl md:text-8xl font-black text-white mb-6 tracking-tighter leading-none animate-fade-in">
            Khám phá Hà Nội <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-hanoi-gold via-white to-hanoi-gold bg-300% animate-gradient-text">
              Theo Cách Riêng
            </span>
          </h1>
          
          <p className="max-w-2xl mx-auto text-white/80 text-lg md:text-xl mb-12 font-medium leading-relaxed px-4 animate-fade-in-up">
            Trải nghiệm hành trình du lịch thông minh, nơi di sản ngàn năm giao thoa cùng công nghệ tương lai.
          </p>

          <div className="animate-fade-in-up-delay">
            <AIQuickPlanner />
          </div>
        </div>

        {/* Decorative Elements */}
        <div className="absolute bottom-10 left-10 hidden lg:block animate-bounce-slow">
          <div className="flex items-center gap-3 bg-white/10 backdrop-blur-md p-4 rounded-3xl border border-white/10">
            <div className="h-10 w-10 bg-hanoi-red rounded-full flex items-center justify-center">
              <MapPin className="h-5 w-5 text-white" />
            </div>
            <div className="text-left">
              <p className="text-[10px] font-black text-hanoi-gold uppercase">Địa điểm hot nhất</p>
              <p className="text-sm font-bold text-white">Phố Cổ Hà Nội</p>
            </div>
          </div>
        </div>
      </section>

      {/* Featured Places Section */}
      <section className="py-24 px-4 relative overflow-hidden">
        <div className="container mx-auto relative z-10">
          
          {isAuthenticated ? (
            <>
              {/* Logged in: Recommendations Section */}
              <div className="flex flex-col md:flex-row md:items-end justify-between mb-16 gap-6">
                <div>
                  <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-hanoi-red/10 text-hanoi-red text-[10px] font-black uppercase tracking-widest mb-4">
                    <Star className="h-3 w-3 fill-current" /> Dành riêng cho bạn
                  </div>
                  <h2 className="text-4xl md:text-6xl font-black text-zinc-900 tracking-tighter">
                    Gợi ý từ <span className="text-hanoi-red italic">Trip4Hanoi</span>
                  </h2>
                </div>
              </div>
              
              <RecommendationList limit={8} />

              {/* Logged in: Popular Places Section */}
              <div className="flex flex-col md:flex-row md:items-end justify-between mt-24 mb-16 gap-6">
                <div>
                  <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-hanoi-red/10 text-hanoi-red text-[10px] font-black uppercase tracking-widest mb-4">
                    <Compass className="h-3 w-3" /> Xu hướng
                  </div>
                  <h2 className="text-4xl md:text-6xl font-black text-zinc-900 tracking-tighter">
                    Các địa điểm <span className="text-hanoi-red italic">phổ biến</span>
                  </h2>
                </div>
                <Link href="/explore">
                  <Button variant="ghost" className="text-hanoi-red font-black hover:bg-hanoi-red/5 rounded-2xl group text-lg">
                    Khám phá thêm <ChevronRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform" />
                  </Button>
                </Link>
              </div>
              
              <PopularPlacesList limit={8} />
            </>
          ) : (
            <>
              {/* Logged out: Only Popular Places Section */}
              <div className="flex flex-col md:flex-row md:items-end justify-between mb-16 gap-6">
                <div>
                  <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-hanoi-red/10 text-hanoi-red text-[10px] font-black uppercase tracking-widest mb-4">
                    <Star className="h-3 w-3 fill-current" /> Điểm đến tiêu biểu
                  </div>
                  <h2 className="text-4xl md:text-6xl font-black text-zinc-900 tracking-tighter">
                    Khám phá <span className="text-hanoi-red italic">Hà Nội</span>
                  </h2>
                </div>
              </div>
              
              <PopularPlacesList limit={8} />
              
              <div className="mt-16 text-center">
                <Link href="/explore">
                  <Button className="bg-zinc-900 hover:bg-hanoi-red text-white font-black px-10 h-16 rounded-2xl shadow-2xl transition-all">
                    Khám phá thêm hàng trăm địa điểm <ChevronRight className="ml-2 h-6 w-6" />
                  </Button>
                </Link>
              </div>
            </>
          )}

        </div>
        
        {/* Background Patterns */}
        <div className="absolute top-0 right-0 w-1/3 h-full bg-hanoi-gold/5 -skew-x-12 translate-x-1/2 pointer-events-none" />
        <div className="absolute top-40 left-10 opacity-[0.03] pointer-events-none select-none">
          <span className="text-[15vw] font-black italic tracking-tighter text-hanoi-red">HANOI</span>
        </div>
      </section>

      {/* Events Section */}
      <FeaturedEventsSection />

      {/* Admin Curated Itineraries Section */}
      <FeaturedItinerariesSection />

      {/* Community / Testimonials */}
      <section className="py-24 px-4 bg-hanoi-cream overflow-hidden">
        <div className="container mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            <div>
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-hanoi-gold/30 text-hanoi-red text-[10px] font-black uppercase tracking-widest mb-4">
                <Heart className="h-3 w-3 fill-current" /> Cộng đồng Trip4Hanoi
              </div>
              <h2 className="text-4xl md:text-6xl font-black text-zinc-900 tracking-tighter mb-8 leading-tight">
                Cùng nhau chia sẻ <br />
                <span className="text-hanoi-red italic">khoảnh khắc Hà Nội</span>
              </h2>
              <div className="space-y-6 mb-10">
                <blockquote className="bg-white/50 backdrop-blur-md p-8 rounded-[32px] border border-hanoi-gold/30 shadow-xl relative">
                  <span className="absolute -top-6 left-8 text-8xl text-hanoi-gold font-serif opacity-50">“</span>
                  <p className="text-xl font-medium text-zinc-800 italic relative z-10">
                    Chưa bao giờ việc lên kế hoạch đi chơi Hà Nội lại dễ dàng đến thế. AI của Trip4Hanoi gợi ý những quán cà phê thực sự đúng gu mình!
                  </p>
                  <div className="flex items-center gap-4 mt-6">
                    <div className="h-12 w-12 bg-hanoi-red rounded-full overflow-hidden border-2 border-white shadow-lg">
                      <img src="https://i.pravatar.cc/150?u=1" alt="" />
                    </div>
                    <div>
                      <p className="font-black text-zinc-900 text-sm">Minh Anh</p>
                      <p className="text-xs text-zinc-500 font-bold uppercase tracking-widest">Travel Enthusiast</p>
                    </div>
                  </div>
                </blockquote>
              </div>
              <Button className="bg-zinc-900 text-white font-black px-10 h-16 rounded-2xl shadow-2xl hover:bg-hanoi-red transition-all">
                Tham gia cộng đồng ngay
              </Button>
            </div>

            <div className="grid grid-cols-2 gap-4 relative">
              <div className="space-y-4 pt-12">
                <img src="https://images.unsplash.com/photo-1509062522246-3755977927d7?w=400&h=600&fit=crop" className="rounded-3xl shadow-2xl hover:scale-105 transition-transform duration-500" alt="" />
                <img src="https://images.unsplash.com/photo-1555921015-5532091f6026?w=400&h=400&fit=crop" className="rounded-3xl shadow-2xl hover:scale-105 transition-transform duration-500" alt="" />
              </div>
              <div className="space-y-4">
                <img src="https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?w=400&h=400&fit=crop" className="rounded-3xl shadow-2xl hover:scale-105 transition-transform duration-500" alt="" />
                <img src="https://images.unsplash.com/photo-1562307534-a03738d2a81a?w=400&h=600&fit=crop" className="rounded-3xl shadow-2xl hover:scale-105 transition-transform duration-500" alt="" />
              </div>
              
              {/* Decorative particles */}
              <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 h-32 w-32 bg-hanoi-red/20 blur-[60px] rounded-full" />
            </div>
          </div>
        </div>
      </section>

      <PricingSection />

      <Footer />
    </div>
  );
}

function FeaturedEventsSection() {
  const { data, isLoading } = useEvents({ page: 0, size: 3 });
  const events = data?.data || [];

  if (!isLoading && events.length === 0) return null;

  return (
    <section className="py-24 px-4 bg-white border-y border-hanoi-gold/20 overflow-hidden relative">
      <div className="container mx-auto relative z-10">
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-16 gap-6">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-hanoi-gold/30 text-hanoi-red text-[10px] font-black uppercase tracking-widest mb-4">
              <Sparkles className="h-3 w-3 fill-current" /> Đừng bỏ lỡ
            </div>
            <h2 className="text-4xl md:text-6xl font-black text-zinc-900 tracking-tighter">
              Sự kiện đang <span className="text-hanoi-red italic underline decoration-hanoi-gold/50 underline-offset-8">diễn ra</span>
            </h2>
          </div>
          <Link href="/events">
            <Button className="bg-zinc-900 hover:bg-hanoi-red text-white font-black px-8 h-14 rounded-2xl shadow-xl transition-all active:scale-95 group">
              Tất cả sự kiện <ArrowRight className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform" />
            </Button>
          </Link>
        </div>

        {isLoading ? (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[1, 2, 3].map((i) => (
              <div key={i} className="bg-zinc-100 rounded-[40px] aspect-[4/5] animate-pulse" />
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {events.map((event: Event) => (
              <div key={event.id} className="group cursor-pointer">
                <EventCard event={event} />
              </div>
            ))}
          </div>
        )}
      </div>
      
      {/* Hanoi Decoration */}
      <div className="absolute bottom-[-5%] right-[-5%] p-20 opacity-[0.02] pointer-events-none select-none">
        <span className="text-[25vw] font-black italic tracking-tighter text-hanoi-red leading-none">HANOI</span>
      </div>
    </section>
  );
}

function FeaturedItinerariesSection() {
  const { data: itineraries, isLoading } = useFeaturedItineraries();

  if (!isLoading && (!itineraries || itineraries.length === 0)) return null;

  return (
    <section className="py-24 px-4 bg-zinc-900 text-white overflow-hidden relative">
      <div className="container mx-auto relative z-10">
        <div className="text-center mb-16">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-hanoi-gold/20 text-hanoi-gold text-[10px] font-black uppercase tracking-widest mb-4">
            <Sparkles className="h-3 w-3 fill-current" /> Đề xuất bởi Chuyên gia
          </div>
          <h2 className="text-4xl md:text-6xl font-black tracking-tighter mb-6 italic">
            Hành trình <span className="text-hanoi-gold">đã được chọn lọc</span>
          </h2>
          <p className="text-zinc-400 max-w-2xl mx-auto text-lg">
            Từ tour ẩm thực phố cổ đến hành trình văn hóa tâm linh, chúng tôi đã chuẩn bị sẵn những trải nghiệm tuyệt vời nhất cho bạn.
          </p>
        </div>

        {isLoading ? (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[1, 2, 3].map((i) => (
              <div key={i} className="bg-white/5 rounded-[40px] aspect-[4/5] animate-pulse" />
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {itineraries?.map((itinerary: Itinerary) => (
              <ItineraryCard key={itinerary.id} itinerary={itinerary} />
            ))}
          </div>
        )}
      </div>

      {/* Traditional Patterns Background */}
      <div className="absolute inset-0 opacity-5 pointer-events-none" style={{ backgroundImage: 'radial-gradient(#F5E6CA 0.5px, transparent 0.5px)', backgroundSize: '24px 24px' }} />
    </section>
  );
}
