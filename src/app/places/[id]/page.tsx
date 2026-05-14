"use client";

import React from "react";
import { useParams } from "next/navigation";
import { usePlaceDetail } from "@/features/places/hooks/use-places";
import { Navbar } from "@/shared/components/navbar";
import { 
  MapPin, 
  Star, 
  Clock, 
  Info, 
  Image as ImageIcon, 
  MessageSquare, 
  Calendar,
  ChevronLeft,
  Share2,
  Heart,
  Navigation
} from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { Button } from "@/shared/components/ui/button";
import { Badge } from "@/shared/components/ui/badge";
import { Skeleton } from "@/shared/components/ui/skeleton";
import { toast } from "sonner";

export default function PlaceDetailPage() {
  const params = useParams();
  const id = params.id as string;
  
  const { data: place, isLoading, error } = usePlaceDetail(id);

  if (isLoading) {
    return <PlaceDetailSkeleton />;
  }

  if (error || !place) {
    return (
      <div className="min-h-screen bg-hanoi-cream flex flex-col items-center justify-center p-4">
        <h2 className="text-2xl font-bold text-zinc-900 mb-2">Không tìm thấy địa điểm</h2>
        <p className="text-zinc-500 mb-6">Có vẻ như địa điểm này không tồn tại hoặc đã bị gỡ bỏ.</p>
        <Link href="/explore">
          <Button className="bg-hanoi-red hover:bg-hanoi-red/90 font-bold">Quay lại khám phá</Button>
        </Link>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white flex flex-col">
      <Navbar />

      <main className="flex-1 pb-20">
        {/* Hero Section with Image Gallery Preview */}
        <section className="relative h-[40vh] md:h-[50vh] min-h-[300px] md:min-h-[400px] w-full bg-zinc-900">
          <Image
            src={place.images?.[0]?.imageUrl || "https://images.unsplash.com/photo-1509356861241-713028054452?auto=format&fit=crop&q=80&w=1600"}
            alt={place.name}
            fill
            className="object-cover opacity-80"
            priority
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/20 to-transparent" />
          
          {/* Top Actions */}
          <div className="absolute top-4 md:top-6 left-4 right-4 flex items-center justify-between">
            <Link href="/explore">
              <button className="p-2 bg-white/20 backdrop-blur-md rounded-full text-white hover:bg-white/40 transition-all">
                <ChevronLeft className="h-5 w-5 md:h-6 md:w-6" />
              </button>
            </Link>
            <div className="flex items-center gap-2">
              <button 
                onClick={() => toast.success("Đã sao chép liên kết!")}
                className="p-2 bg-white/20 backdrop-blur-md rounded-full text-white hover:bg-white/40 transition-all"
              >
                <Share2 className="h-4 w-4 md:h-5 md:w-5" />
              </button>
              <button className="p-2 bg-white/20 backdrop-blur-md rounded-full text-white hover:bg-white/40 transition-all">
                <Heart className="h-4 w-4 md:h-5 md:w-5" />
              </button>
            </div>
          </div>

          {/* Place Title Info */}
          <div className="absolute bottom-6 md:bottom-10 left-0 right-0">
            <div className="container mx-auto px-4">
              <div className="flex flex-wrap gap-2 mb-3 md:mb-4">
                <Badge className="bg-hanoi-red text-[10px] md:text-xs text-white border-none">{place.categoryName}</Badge>
                {place.isRecommended && (
                  <Badge className="bg-amber-500 text-[10px] md:text-xs text-white border-none flex items-center gap-1">
                    <Star className="h-3 w-3 fill-current" /> Hợp gu
                  </Badge>
                )}
              </div>
              <h1 className="text-2xl md:text-5xl font-bold text-white mb-3 md:mb-4 tracking-tight leading-tight">
                {place.name}
              </h1>
              <div className="flex flex-wrap items-center gap-4 md:gap-6 text-white/90">
                <div className="flex items-center gap-1.5 font-bold text-sm md:text-base">
                  <Star className="h-4 w-4 md:h-5 md:w-5 text-amber-400 fill-current" />
                  <span>{(place.ratingAvg ?? 0).toFixed(1)}</span>
                  <span className="font-medium text-white/60 text-xs md:text-sm">({place.reviews?.length || 0})</span>
                </div>
                <div className="flex items-center gap-1.5 font-bold text-sm md:text-base">
                  <MapPin className="h-4 w-4 md:h-5 md:w-5 text-hanoi-red" />
                  <span>{place.district}</span>
                </div>
                {place.distance && (
                  <div className="flex items-center gap-1.5 font-bold text-[10px] md:text-sm text-hanoi-red bg-white px-2.5 py-1 md:px-3 md:py-1 rounded-full shadow-sm">
                    <Navigation className="h-3 w-3 md:h-4 md:w-4" />
                    <span>{place.distance.toFixed(1)} km</span>
                  </div>
                )}
              </div>
            </div>
          </div>
        </section>

        <div className="container mx-auto px-4 mt-8 md:mt-12">
          <div className="flex flex-col lg:grid lg:grid-cols-3 gap-8 md:gap-12">
            {/* Right Sidebar (Shown first on mobile for quick actions) */}
            <aside className="lg:order-2 lg:col-span-1">
              <div className="lg:sticky lg:top-24 bg-white border border-zinc-100 rounded-3xl p-6 md:p-8 shadow-sm space-y-6">
                <div className="flex lg:flex-col justify-between items-center lg:items-start gap-4">
                  <div className="space-y-1">
                    <p className="text-[10px] font-bold text-zinc-400 uppercase tracking-widest">Giá trung bình</p>
                    <p className="text-xl md:text-2xl font-bold text-hanoi-red">
                      {place.priceAvg > 0 ? `${place.priceAvg.toLocaleString()}đ` : "Giá liên hệ"}
                    </p>
                  </div>
                  <Button className="flex-1 lg:w-full bg-hanoi-red hover:bg-hanoi-red/90 h-12 rounded-xl font-bold text-base md:text-lg shadow-lg shadow-hanoi-red/20 transition-all">
                    Chỉ đường đi
                  </Button>
                </div>

                <div className="hidden lg:block space-y-1 pt-4 border-t border-zinc-50">
                  <p className="text-[10px] font-bold text-zinc-400 uppercase tracking-widest">Địa chỉ</p>
                  <p className="text-zinc-900 font-medium leading-relaxed">{place.address}</p>
                </div>
                
                <Button variant="outline" className="w-full h-12 rounded-xl font-bold border-zinc-200 hover:bg-zinc-50">
                  Thêm vào kế hoạch
                </Button>
              </div>
            </aside>

            {/* Left Content */}
            <div className="lg:order-1 lg:col-span-2 space-y-10 md:space-y-12">
              {/* Description */}
              <section className="space-y-4">
                <h2 className="text-2xl font-bold flex items-center gap-2">
                  <Info className="h-6 w-6 text-hanoi-red" />
                  Giới thiệu
                </h2>
                <p className="text-zinc-600 leading-relaxed whitespace-pre-line text-lg">
                  {place.description || "Chưa có mô tả chi tiết cho địa điểm này."}
                </p>
              </section>

              {/* Image Album */}
              {place.images && place.images.length > 0 && (
                <section className="space-y-4">
                  <h2 className="text-2xl font-bold flex items-center gap-2">
                    <ImageIcon className="h-6 w-6 text-hanoi-red" />
                    Album ảnh
                  </h2>
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                    {place.images.map((img, idx) => (
                      <div key={img.id} className="relative aspect-square rounded-2xl overflow-hidden group">
                        <Image
                          src={img.imageUrl}
                          alt={`${place.name} - ${idx + 1}`}
                          fill
                          className="object-cover transition-transform duration-500 group-hover:scale-110"
                        />
                      </div>
                    ))}
                  </div>
                </section>
              )}

              {/* Active Events */}
              {place.events && place.events.length > 0 && (
                <section className="space-y-6">
                  <h2 className="text-2xl font-bold flex items-center gap-2">
                    <Calendar className="h-6 w-6 text-hanoi-red" />
                    Sự kiện đang diễn ra
                  </h2>
                  <div className="space-y-4">
                    {place.events.map((event) => (
                      <div key={event.id} className="bg-orange-50 border border-orange-100 p-6 rounded-2xl">
                        <div className="flex justify-between items-start mb-2">
                          <h3 className="text-xl font-bold text-orange-900">{event.name}</h3>
                          <Badge className="bg-orange-600 text-white border-none uppercase text-[10px] tracking-widest">
                            {event.status}
                          </Badge>
                        </div>
                        <p className="text-orange-800/80 mb-4">{event.description}</p>
                        <div className="flex items-center gap-4 text-sm font-bold text-orange-900">
                          <div className="flex items-center gap-1.5">
                            <Clock className="h-4 w-4" />
                            <span>Bắt đầu: {new Date(event.startTime).toLocaleDateString('vi-VN')}</span>
                          </div>
                          <span>-</span>
                          <div className="flex items-center gap-1.5">
                            <Clock className="h-4 w-4" />
                            <span>Kết thúc: {new Date(event.endTime).toLocaleDateString('vi-VN')}</span>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </section>
              )}

              {/* Reviews Section */}
              <section className="space-y-8">
                <div className="flex items-center justify-between">
                  <h2 className="text-2xl font-bold flex items-center gap-2">
                    <MessageSquare className="h-6 w-6 text-hanoi-red" />
                    Đánh giá từ cộng đồng
                  </h2>
                  <Button variant="outline" className="font-bold border-hanoi-red text-hanoi-red hover:bg-hanoi-red hover:text-white transition-all">
                    Viết đánh giá
                  </Button>
                </div>
                
                {place.reviews && place.reviews.length > 0 ? (
                  <div className="space-y-6">
                    {place.reviews.map((review) => (
                      <div key={review.id} className="flex gap-4 p-6 bg-zinc-50 rounded-2xl border border-zinc-100">
                        <div className="h-12 w-12 rounded-full bg-hanoi-red/10 flex items-center justify-center text-hanoi-red font-bold shrink-0">
                          {review.userName.charAt(0)}
                        </div>
                        <div className="flex-1 space-y-2">
                          <div className="flex justify-between items-center">
                            <h4 className="font-bold text-zinc-900">{review.userName}</h4>
                            <span className="text-xs text-zinc-400 font-medium">
                              {new Date(review.createdAt).toLocaleDateString('vi-VN')}
                            </span>
                          </div>
                          <div className="flex items-center gap-0.5 mb-1">
                            {[...Array(5)].map((_, i) => (
                              <Star 
                                key={i} 
                                className={`h-3 w-3 ${i < review.rating ? "text-amber-400 fill-current" : "text-zinc-200"}`} 
                              />
                            ))}
                          </div>
                          <p className="text-zinc-600 leading-relaxed">{review.comment}</p>
                          {review.imageUrl && (
                            <div className="relative h-24 w-24 rounded-lg overflow-hidden mt-3">
                              <Image src={review.imageUrl} alt="Review" fill className="object-cover" />
                            </div>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-12 bg-zinc-50 rounded-3xl border border-dashed border-zinc-200">
                    <p className="text-zinc-400 font-medium">Chưa có đánh giá nào. Hãy là người đầu tiên!</p>
                  </div>
                )}
              </section>
            </div>

            {/* Right Sidebar */}
            <aside className="lg:col-span-1 space-y-8">
              {/* Info Card */}
              <div className="sticky top-24 bg-white border border-zinc-100 rounded-3xl p-8 shadow-sm space-y-6">
                <div className="space-y-1">
                  <p className="text-xs font-bold text-zinc-400 uppercase tracking-widest">Địa chỉ</p>
                  <p className="text-zinc-900 font-medium leading-relaxed">{place.address}</p>
                </div>
                
                <div className="space-y-1">
                  <p className="text-xs font-bold text-zinc-400 uppercase tracking-widest">Giá trung bình</p>
                  <p className="text-2xl font-bold text-hanoi-red">
                    {place.priceAvg > 0 ? `${place.priceAvg.toLocaleString()}đ` : "Giá liên hệ"}
                  </p>
                </div>

                <div className="pt-6 border-t border-zinc-50 space-y-3">
                  <Button className="w-full bg-hanoi-red hover:bg-hanoi-red/90 h-12 rounded-xl font-bold text-lg shadow-lg shadow-hanoi-red/20 transition-all">
                    Chỉ đường đi
                  </Button>
                  <Button variant="outline" className="w-full h-12 rounded-xl font-bold border-zinc-200 hover:bg-zinc-50">
                    Thêm vào kế hoạch
                  </Button>
                </div>

                {/* Map Preview Placeholder */}
                <div className="relative aspect-video w-full rounded-2xl overflow-hidden bg-zinc-100 flex flex-col items-center justify-center border border-zinc-100 mt-4">
                  <MapPin className="h-8 w-8 text-hanoi-red/30 mb-2" />
                  <p className="text-[10px] font-bold text-zinc-400 uppercase tracking-widest">Xem trên bản đồ</p>
                  <div className="absolute inset-0 bg-gradient-to-t from-white/20 to-transparent pointer-events-none" />
                </div>
              </div>
            </aside>
          </div>
        </div>
      </main>
    </div>
  );
}

function PlaceDetailSkeleton() {
  return (
    <div className="min-h-screen bg-white">
      <Skeleton className="h-[50vh] w-full" />
      <div className="container mx-auto px-4 mt-12 grid grid-cols-1 lg:grid-cols-3 gap-12">
        <div className="lg:col-span-2 space-y-12">
          <div className="space-y-4">
            <Skeleton className="h-8 w-48" />
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-3/4" />
          </div>
          <div className="grid grid-cols-3 gap-4">
            <Skeleton className="aspect-square rounded-2xl" />
            <Skeleton className="aspect-square rounded-2xl" />
            <Skeleton className="aspect-square rounded-2xl" />
          </div>
        </div>
        <div className="lg:col-span-1">
          <Skeleton className="h-96 w-full rounded-3xl" />
        </div>
      </div>
    </div>
  );
}
