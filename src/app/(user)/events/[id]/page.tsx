"use client";

import React from "react";
import { useParams, useRouter } from "next/navigation";
import { Navbar } from "@/shared/components/navbar";
import Footer from "@/shared/components/Footer";
import { useEventDetail, useFollowEvent, useUnfollowEvent } from "@/features/events/hooks/use-events";
import { usePlaceDetail } from "@/features/places/hooks/use-places";
import { 
  Calendar, 
  MapPin, 
  Users, 
  ArrowLeft, 
  Share2, 
  Bookmark, 
  Clock, 
  Info,
  ChevronRight,
  Loader2,
  Sparkles,
  Heart,
  Star,
  Wind,
  Scroll,
  History
} from "lucide-react";
import { Button } from "@/shared/components/ui/button";
import { Badge } from "@/shared/components/ui/badge";
import { cn } from "@/shared/lib/utils";
import Link from "next/link";
import { toast } from "sonner";

import { useLocationStore } from "@/shared/store/location-store";
import { useUser } from "@/features/auth/hooks/use-auth";

export default function EventDetailPage() {
  const params = useParams();
  const router = useRouter();
  const eventId = params.id as string;
  const { isAuthenticated } = useUser();

  const { data: event, isLoading, isError } = useEventDetail(eventId);
  const { data: place } = usePlaceDetail(event?.placeId || "");
  const followMutation = useFollowEvent();
  const unfollowMutation = useUnfollowEvent();

  if (isLoading) {
    return (
      <div className="min-h-screen bg-[#FAF9F6] flex flex-col items-center justify-center">
        <div className="relative">
          <Loader2 className="h-16 w-16 text-hanoi-red animate-spin" />
          <div className="absolute inset-0 h-16 w-16 border-4 border-hanoi-red/10 rounded-full" />
        </div>
        <p className="text-zinc-400 font-black uppercase tracking-[0.3em] text-xs mt-8">Đang mở cuộn thư di sản...</p>
      </div>
    );
  }

  if (isError || !event) {
    return (
      <div className="min-h-screen bg-[#FAF9F6] flex flex-col items-center justify-center p-6 text-center">
        <div className="w-24 h-24 bg-hanoi-red/5 rounded-full flex items-center justify-center mb-8">
           <History className="h-10 w-10 text-hanoi-red" />
        </div>
        <h2 className="text-3xl font-black text-zinc-900 mb-4">Mảnh ghép chưa tìm thấy</h2>
        <p className="text-zinc-500 mb-10 max-w-md font-serif italic text-lg">Thông tin về sự kiện này có thể đã trôi vào dòng thời gian hoặc liên kết không chính xác.</p>
        <Button onClick={() => router.push("/events")} className="bg-zinc-900 hover:bg-hanoi-red text-white font-black px-10 h-14 rounded-2xl shadow-xl transition-all">
          Quay lại Kỳ Đài
        </Button>
      </div>
    );
  }

  const handleFollow = () => {
    if (!isAuthenticated) {
      toast.error("Vui lòng đăng nhập để theo dõi sự kiện");
      return;
    }
    if (event.isFollowed) {
      unfollowMutation.mutate(event.id);
    } else {
      followMutation.mutate(event.id);
    }
  };

  const handleShare = () => {
    if (navigator.share) {
      navigator.share({
        title: event.name,
        text: event.description,
        url: window.location.href,
      }).catch(console.error);
    } else {
      navigator.clipboard.writeText(window.location.href);
      toast.success("Đã sao chép liên kết vào tâm thức!");
    }
  };

  const startDate = new Date(event.startTime);
  const endDate = new Date(event.endTime);
  const isStarted = startDate <= new Date();
  const isEnded = endDate < new Date();

  return (
    <div className="min-h-screen bg-[#FAF9F6] flex flex-col pb-20 md:pb-0 selection:bg-hanoi-red/10 selection:text-hanoi-red">
      <Navbar />

      <main className="flex-1">
        {/* Cinematic Hero Section */}
        <section className="relative h-[65vh] md:h-[85vh] w-full overflow-hidden">
          <img 
            src={event.images?.[0]?.imageUrl || "https://images.unsplash.com/photo-1505944270255-bd2b68af6422?q=80&w=1200"} 
            className="w-full h-full object-cover transition-transform duration-1000 scale-105"
            alt={event.name}
          />
          <div className="absolute inset-0 bg-gradient-to-t from-[#1A1A1A] via-[#1A1A1A]/40 to-transparent" />
          
          {/* Back Button Desktop */}
          <div className="absolute top-10 left-10 hidden md:block z-20">
             <button 
                onClick={() => router.back()}
                className="group flex items-center gap-3 text-white/70 hover:text-white transition-all font-black uppercase tracking-widest text-xs"
             >
                <div className="h-12 w-12 rounded-full border border-white/20 flex items-center justify-center group-hover:bg-white group-hover:text-black transition-all">
                   <ArrowLeft className="h-5 w-5" />
                </div>
                Quay lại
             </button>
          </div>

          <div className="absolute bottom-0 left-0 w-full p-6 md:p-20 z-10">
            <div className="container mx-auto">
              <div className="flex flex-wrap gap-4 mb-8">
                <Badge className={cn(
                  "font-black uppercase tracking-[0.2em] text-[10px] md:text-xs px-6 py-2.5 rounded-full border-none shadow-2xl backdrop-blur-xl",
                  isEnded ? "bg-zinc-800 text-white/50" : isStarted ? "bg-emerald-500 text-white" : "bg-hanoi-red text-white"
                )}>
                  {isEnded ? "Dấu ấn lịch sử" : isStarted ? "Đang diễn ra" : "Kỳ hội sắp tới"}
                </Badge>
                {event.isFollowed && (
                  <Badge className="bg-hanoi-gold text-hanoi-red font-black uppercase tracking-[0.2em] text-[10px] md:text-xs px-6 py-2.5 rounded-full border-none shadow-2xl flex items-center gap-2 backdrop-blur-xl">
                    <Bookmark className="h-3.5 w-3.5 fill-current" /> Đã lưu dấu
                  </Badge>
                )}
              </div>
              
              <h1 className="text-4xl md:text-8xl font-black text-white tracking-tighter mb-8 leading-none max-w-5xl">
                {event.name}
              </h1>
              
              <div className="flex flex-wrap items-center gap-6 md:gap-12 text-white/90 font-bold text-sm md:text-xl">
                <div className="flex items-center gap-4">
                  <div className="h-12 w-12 rounded-2xl bg-white/10 backdrop-blur-md flex items-center justify-center border border-white/10">
                    <Calendar className="h-6 w-6 text-hanoi-gold" />
                  </div>
                  <span className="font-serif italic">{startDate.toLocaleDateString('vi-VN')} — {endDate.toLocaleDateString('vi-VN')}</span>
                </div>
                <div className="flex items-center gap-4">
                  <div className="h-12 w-12 rounded-2xl bg-white/10 backdrop-blur-md flex items-center justify-center border border-white/10">
                    <MapPin className="h-6 w-6 text-hanoi-gold" />
                  </div>
                  <span className="font-serif italic">{event.placeName || event.location || "Địa điểm linh thiêng"}</span>
                </div>
              </div>
            </div>
          </div>

          {/* Decorative Side Text */}
          <div className="absolute right-10 top-1/2 -translate-y-1/2 hidden lg:flex flex-col items-center gap-10 opacity-30 pointer-events-none">
             <div className="h-24 w-px bg-gradient-to-b from-transparent via-white to-transparent" />
             <span className="rotate-90 font-black text-[10px] uppercase tracking-[1em] text-white">CULTURAL HERITAGE</span>
             <div className="h-24 w-px bg-gradient-to-b from-transparent via-white to-transparent" />
          </div>
        </section>

        {/* Content Section: The Storytelling Layout */}
        <section className="container mx-auto px-6 py-20 md:py-32 relative">
          {/* Subtle Background Pattern */}
          <div className="absolute top-0 right-0 w-1/3 h-full opacity-[0.02] pointer-events-none overflow-hidden">
             <Scroll className="h-96 w-96 text-hanoi-red rotate-12" />
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-16 md:gap-24">
            {/* Left Column: The Narrative */}
            <div className="lg:col-span-8 space-y-20">
              <div className="space-y-10">
                <div className="flex items-center gap-4 text-hanoi-red">
                   <div className="h-px w-12 bg-hanoi-red" />
                   <span className="font-black uppercase tracking-[0.4em] text-[10px]">Tâm Tình Sự Kiện</span>
                </div>
                
                <div className="prose prose-zinc max-w-none">
                  <p className="text-zinc-700 text-xl md:text-2xl leading-[1.8] font-serif italic border-l-4 border-hanoi-red/10 pl-8 md:pl-12 py-4">
                    {event.description}
                  </p>
                </div>
              </div>

              {/* Album: The Visual Gallery */}
              {event.images && event.images.length > 1 && (
                <div className="space-y-12">
                   <div className="flex items-center justify-between">
                      <h3 className="text-2xl md:text-4xl font-black text-zinc-900 tracking-tight flex items-center gap-4">
                         <Sparkles className="h-8 w-8 text-hanoi-red" />
                         Dấu Ấn Hình Ảnh
                      </h3>
                      <div className="h-px flex-1 bg-zinc-100 ml-8 hidden md:block" />
                   </div>
                   
                   <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    {event.images.slice(1).map((img, i) => (
                      <div 
                        key={img.id} 
                        className={cn(
                           "rounded-[40px] overflow-hidden border border-zinc-100 shadow-2xl shadow-hanoi-red/5 group",
                           i % 3 === 0 ? "md:col-span-2 aspect-[21/9]" : "aspect-[4/5]"
                        )}
                      >
                        <img 
                          src={img.imageUrl} 
                          alt={`${event.name} ${i}`} 
                          className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-110"
                        />
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Right Column: The Action Scroll */}
            <div className="lg:col-span-4 space-y-10">
              {/* Interaction Card */}
              <div className="bg-white p-10 md:p-12 rounded-[48px] border border-hanoi-red/5 shadow-[0_40px_80px_-20px_rgba(139,29,29,0.08)] sticky top-32">
                <div className="flex items-center justify-between mb-12">
                  <div className="space-y-1">
                    <span className="text-[10px] font-black text-zinc-400 uppercase tracking-widest">Sức hút cộng đồng</span>
                    <div className="flex items-center gap-3">
                       <Users className="h-6 w-6 text-hanoi-red" />
                       <span className="text-3xl font-black text-zinc-900">{event.followCount || 0}</span>
                       <span className="text-zinc-400 font-medium font-serif italic">quan tâm</span>
                    </div>
                  </div>
                </div>

                <div className="space-y-6">
                  <Button 
                    onClick={handleFollow}
                    disabled={followMutation.isPending || unfollowMutation.isPending}
                    className={cn(
                      "w-full h-20 rounded-2xl font-black text-xl transition-all active:scale-95 shadow-2xl overflow-hidden group/btn relative",
                      event.isFollowed 
                        ? "bg-hanoi-red text-white border-none hover:bg-hanoi-red/90" 
                        : "bg-zinc-900 hover:bg-hanoi-red text-white shadow-hanoi-red/20"
                    )}
                  >
                    {followMutation.isPending || unfollowMutation.isPending ? (
                      <Loader2 className="h-6 w-6 animate-spin" />
                    ) : event.isFollowed ? (
                      <>
                        <Star className="mr-3 h-6 w-6 fill-hanoi-gold text-hanoi-gold" /> Đã theo dõi
                      </>
                    ) : (
                      <>
                        <Star className="mr-3 h-6 w-6 transition-transform group-hover/btn:rotate-12" /> Theo dõi hội ngộ
                      </>
                    )}
                  </Button>

                  {event.isFollowed && (
                     <p className="text-[10px] text-center text-zinc-400 font-bold uppercase tracking-widest animate-in fade-in duration-500">
                        Nhấn lần nữa để bỏ theo dõi
                     </p>
                  )}
                  
                  <div className="grid grid-cols-2 gap-4">
                    <Button 
                      variant="outline" 
                      onClick={handleShare}
                      className="h-16 rounded-2xl border-zinc-100 font-black text-zinc-600 hover:bg-zinc-50 hover:border-hanoi-red/20 transition-all group"
                    >
                      <Share2 className="mr-2 h-5 w-5 transition-transform group-hover:-translate-y-1" /> Chia sẻ
                    </Button>
                    <Button 
                      variant="outline" 
                      onClick={() => {
                        if (!isAuthenticated) {
                          toast.error("Vui lòng đăng nhập để lên lịch trình");
                          return;
                        }
                        router.push(`/planner?placeId=${event.placeId}`);
                      }}
                      className="w-full h-16 rounded-2xl border-zinc-100 font-black text-zinc-600 hover:bg-zinc-50 hover:border-hanoi-red/20 transition-all group"
                    >
                      <Wind className="mr-2 h-5 w-5 transition-transform group-hover:translate-x-1" /> Lên lịch
                    </Button>
                  </div>
                </div>

                {/* Place Connection */}
                {place && (
                  <div className="mt-12 pt-10 border-t border-zinc-50">
                    <span className="text-[10px] font-black text-zinc-300 uppercase tracking-[0.3em] block mb-6 text-center">Ghé thăm tọa độ</span>
                    <Link href={`/places/${place.id}`}>
                      <div className="group relative p-6 rounded-[32px] bg-[#F1EDE4] hover:bg-hanoi-red transition-all duration-500 overflow-hidden shadow-sm">
                        <div className="relative z-10 flex items-center gap-5">
                           <div className="h-16 w-16 rounded-2xl overflow-hidden shrink-0 border-2 border-white/20">
                             <img 
                               src={place.images?.[0]?.imageUrl || "https://images.unsplash.com/photo-1599708145755-9a84d4df0128?q=80&w=200"} 
                               alt={place.name}
                               className="w-full h-full object-cover"
                             />
                           </div>
                           <div className="flex-1 min-w-0">
                             <h4 className="font-black text-zinc-900 truncate group-hover:text-white transition-colors">{place.name}</h4>
                             <p className="text-xs font-bold text-zinc-500 truncate group-hover:text-white/70">{place.address}</p>
                           </div>
                           <ChevronRight className="h-6 w-6 text-hanoi-red group-hover:text-white group-hover:translate-x-2 transition-all" />
                        </div>
                        {/* Decorative Wave on Hover */}
                        <div className="absolute bottom-[-20px] right-[-20px] opacity-10 group-hover:opacity-20 transition-opacity">
                           <MapPin className="h-24 w-24 text-black group-hover:text-white rotate-12" />
                        </div>
                      </div>
                    </Link>
                  </div>
                )}
              </div>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
