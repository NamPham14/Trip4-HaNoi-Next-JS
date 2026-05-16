/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import React, { useState } from "react";
import { useParams } from "next/navigation";
import Image from "next/image";
import { usePlaceDetail, useFavoriteStatus, useToggleFavorite } from "@/features/places/hooks/use-places";
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
  Navigation,
  Loader2
} from "lucide-react";
import Link from "next/link";
import Script from "next/script";
import { Button } from "@/shared/components/ui/button";
import { Badge } from "@/shared/components/ui/badge";
import { Skeleton } from "@/shared/components/ui/skeleton";
import { toast } from "sonner";
import { cn } from "@/shared/lib/utils";

import { useLocationStore } from "@/shared/store/location-store";
import { ReviewModal } from "@/features/places/components/review-modal";
import { useUser } from "@/features/auth/hooks/use-auth";

// Component Bản đồ nhỏ cho địa điểm
const PlaceMap = ({ lat, lng, name }: { lat: number, lng: number, name: string }) => {
  const mapContainerRef = React.useRef<HTMLDivElement>(null);
  const mapRef = React.useRef<any>(null);
  const [isLeafletReady, setIsLeafletReady] = React.useState(false);
  const [isMapLoaded, setIsMapLoaded] = React.useState(false);
  const { lat: userLat, lng: userLng } = useLocationStore();

  // Robust check for Leaflet availability
  React.useEffect(() => {
    const checkL = () => {
      if ((window as any).L) {
        setIsLeafletReady(true);
        return true;
      }
      return false;
    };

    if (!checkL()) {
      const interval = setInterval(() => {
        if (checkL()) clearInterval(interval);
      }, 100);
      return () => clearInterval(interval);
    }
  }, []);

  // Safety timeout: Hide loading after 3.5s no matter what
  React.useEffect(() => {
    const timer = setTimeout(() => {
      setIsMapLoaded(true);
    }, 3500);
    return () => clearTimeout(timer);
  }, []);

  React.useEffect(() => {
    if (!isLeafletReady || !mapContainerRef.current || mapRef.current) return;
    const L = (window as any).L;
    if (!L) return;

    try {
      const map = L.map(mapContainerRef.current, {
        zoomControl: false,
        scrollWheelZoom: false,
        dragging: true,
        touchZoom: true,
        zoomAnimation: true,
        fadeAnimation: false
      }).setView([lat, lng], 15);

      const tiles = L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
        attribution: '&copy; OpenStreetMap'
      });

      // Hide spinner as soon as tiles start arriving or map is ready
      tiles.on('load', () => setIsMapLoaded(true));
      map.whenReady(() => {
        // Fallback: if tiles are taking too long but map structure is there
        setTimeout(() => setIsMapLoaded(true), 1000);
      });

      tiles.addTo(map);

      const customIcon = L.divIcon({
        className: 'custom-marker',
        html: `<div style="width: 30px; height: 30px; background-color: #8B1D1D; border-radius: 50%; border: 3px solid white; display: flex; align-items: center; justify-content: center; color: white; box-shadow: 0 4px 10px rgba(0,0,0,0.3);"><svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"></path><circle cx="12" cy="10" r="3"></circle></svg></div>`,
        iconSize: [30, 30],
        iconAnchor: [15, 30]
      });

      L.marker([lat, lng], { icon: customIcon }).addTo(map).bindPopup(`<strong>${name}</strong>`);
      
      if (userLat && userLng) {
        const fetchRoute = async () => {
          try {
            const response = await fetch(
              `https://router.project-osrm.org/route/v1/driving/${userLng},${userLat};${lng},${lat}?overview=full&geometries=geojson`
            );
            const data = await response.json();
            
            if (data.routes && data.routes[0]) {
              const route = data.routes[0].geometry;
              L.geoJSON(route, {
                style: {
                  color: '#8B1D1D',
                  weight: 5,
                  opacity: 0.6,
                  dashArray: '5, 10'
                }
              }).addTo(map);
              
              const userIcon = L.divIcon({
                className: 'user-marker',
                html: `<div style="width: 16px; height: 16px; background-color: #3B82F6; border: 2px solid white; border-radius: 50%; box-shadow: 0 0 8px rgba(59, 130, 246, 0.5);"></div>`,
                iconSize: [16, 16],
                iconAnchor: [8, 8]
              });
              
              L.marker([userLat, userLng], { icon: userIcon }).addTo(map);
              const bounds = L.latLngBounds([lat, lng], [userLat, userLng]);
              map.fitBounds(bounds, { padding: [30, 30], animate: true });
            }
          } catch (e) {}
        };
        fetchRoute();
      }

      mapRef.current = map;
    } catch (e) {}

    return () => {
      if (mapRef.current) {
        mapRef.current.remove();
        mapRef.current = null;
      }
    };
  }, [isLeafletReady, lat, lng, userLat, userLng, name]);

  return (
    <div className="relative h-full w-full bg-zinc-100 overflow-hidden">
      <link rel="stylesheet" href="https://unpkg.com/leaflet@1.9.4/dist/leaflet.css" />
      <Script 
        src="https://unpkg.com/leaflet@1.9.4/dist/leaflet.js"
        onLoad={() => setIsLeafletReady(true)}
        strategy="afterInteractive"
      />
      
      {!isMapLoaded && (
        <div className="absolute inset-0 z-20 flex flex-col items-center justify-center bg-zinc-100">
          <Loader2 className="h-5 w-5 text-hanoi-red animate-spin mb-2" />
          <p className="text-[9px] font-bold text-zinc-400 uppercase tracking-widest">Đang tải bản đồ...</p>
        </div>
      )}
      
      <div ref={mapContainerRef} className="h-full w-full z-10" />
    </div>
  );
};

export default function PlaceDetailPage() {
  const params = useParams();
  const id = params.id as string;
  const { isAuthenticated } = useUser();
  const { lat: userLat, lng: userLng } = useLocationStore();

  const [isReviewModalOpen, setIsReviewModalOpen] = useState(false);
  const [showAllReviews, setShowAllReviews] = useState(false);

  const { data: place, isLoading, error } = usePlaceDetail(id);
  const { data: isFavoriteStatus } = useFavoriteStatus(id);
  const toggleFavoriteMutation = useToggleFavorite();


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

  const handleToggleFavorite = async () => {
    if (!isAuthenticated) {
      toast.error("Vui lòng đăng nhập để lưu địa điểm yêu thích");
      return;
    }
    toggleFavoriteMutation.mutate(Number(id));
  };

  const isFavorite = !!isFavoriteStatus;

  return (
    <div className="min-h-screen bg-white flex flex-col">
      <Navbar />

      <main className="flex-1 pb-32 lg:pb-20">
        {/* Hero Section with Image Gallery Preview */}
        <section className="relative h-[35vh] md:h-[50vh] min-h-[280px] md:min-h-[400px] w-full bg-zinc-900">
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
                onClick={() => {
                  navigator.clipboard.writeText(window.location.href);
                  toast.success("Đã sao chép liên kết!");
                }}
                className="p-2 bg-white/20 backdrop-blur-md rounded-full text-white hover:bg-white/40 transition-all"
              >
                <Share2 className="h-4 w-4 md:h-5 md:w-5" />
              </button>
              {/* Heart Button */}
              <button 
                onClick={handleToggleFavorite}
                disabled={toggleFavoriteMutation.isPending}
                className={cn(
                  "p-2 backdrop-blur-md rounded-full transition-all",
                  isFavorite ? "bg-hanoi-red text-white" : "bg-white/20 text-white hover:bg-white/40"
                )}
              >
                {toggleFavoriteMutation.isPending ? (
                  <Loader2 className="h-4 w-4 md:h-5 md:w-5 animate-spin" />
                ) : (
                  <Heart className={cn("h-4 w-4 md:h-5 md:w-5", isFavorite && "fill-current")} />
                )}
              </button>
            </div>
          </div>

          {/* Place Title Info */}
          <div className="absolute bottom-6 md:bottom-10 left-0 right-0">
            <div className="container mx-auto px-4">
              <div className="flex flex-wrap gap-2 mb-2 md:mb-4">
                <Badge className="bg-hanoi-red text-[10px] md:text-xs text-white border-none">{place.categoryName}</Badge>
                {place.isRecommended && (
                  <Badge className="bg-amber-500 text-[10px] md:text-xs text-white border-none flex items-center gap-1">
                    <Star className="h-3 w-3 fill-current" /> Hợp gu
                  </Badge>
                )}
              </div>
              <h1 className="text-2xl md:text-5xl font-extrabold text-white mb-2 md:mb-4 tracking-tight leading-tight">
                {place.name}
              </h1>
              <div className="flex flex-wrap items-center gap-3 md:gap-6 text-white/90">
                <div className="flex items-center gap-1.5 font-bold text-xs md:text-base">
                  <Star className="h-3.5 w-3.5 md:h-5 md:w-5 text-amber-400 fill-current" />
                  <span>{(place.ratingAvg ?? 0).toFixed(1)}</span>
                  <span className="font-medium text-white/60 text-[10px] md:text-sm">({place.reviews?.length || 0})</span>
                </div>
                <div className="flex items-center gap-1.5 font-bold text-xs md:text-base">
                  <MapPin className="h-3.5 w-3.5 md:h-5 md:w-5 text-hanoi-red" />
                  <span>{place.district}</span>
                </div>
                {place.distance && (
                  <div className="flex items-center gap-1.5 font-bold text-[10px] md:text-sm text-hanoi-red bg-white px-2 py-0.5 md:px-3 md:py-1 rounded-full shadow-sm">
                    <Navigation className="h-3 w-3 md:h-4 md:w-4" />
                    <span>{place.distance.toFixed(1)} km</span>
                  </div>
                )}
              </div>
            </div>
          </div>
        </section>

        <div className="container mx-auto px-4 mt-6 md:mt-12">
          {/* Mobile Quick Info (Price & Address) */}
          <div className="lg:hidden bg-zinc-50 border border-zinc-100 rounded-3xl p-5 mb-8 space-y-4">
            <div className="flex justify-between items-center">
              <div className="space-y-0.5">
                <p className="text-[10px] font-black text-zinc-400 uppercase tracking-widest">Giá trung bình</p>
                <p className="text-xl font-black text-hanoi-red">
                  {place.priceAvg > 0 ? `${place.priceAvg.toLocaleString()}đ` : "Giá liên hệ"}
                </p>
              </div>
              <div className="w-12 h-12 bg-hanoi-red/10 rounded-2xl flex items-center justify-center text-hanoi-red">
                <Info className="h-6 w-6" />
              </div>
            </div>
            <div className="space-y-0.5 pt-3 border-t border-zinc-200/50">
              <p className="text-[10px] font-black text-zinc-400 uppercase tracking-widest">Địa chỉ</p>
              <p className="text-sm font-bold text-zinc-800 leading-snug">{place.address}</p>
            </div>
          </div>

          <div className="flex flex-col lg:grid lg:grid-cols-3 gap-8 md:gap-12">
            {/* Left Content */}
            <div className="lg:col-span-2 space-y-10 md:space-y-12">
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
                  <Button 
                    onClick={() => {
                      if (!isAuthenticated) {
                        toast.error("Vui lòng đăng nhập để viết đánh giá");
                        return;
                      }
                      setIsReviewModalOpen(true);
                    }}
                    variant="outline" 
                    className="font-bold border-hanoi-red text-hanoi-red hover:bg-hanoi-red hover:text-white transition-all"
                  >
                    Viết đánh giá
                  </Button>
                </div>
                
                {place.reviews && place.reviews.length > 0 ? (
                  <div className="space-y-6">
                    {(() => {
                      // Sort reviews by date (newest first)
                      const sortedReviews = [...place.reviews].sort((a, b) => {
                        const dateA = a.createdAt ? new Date(a.createdAt).getTime() : 0;
                        const dateB = b.createdAt ? new Date(b.createdAt).getTime() : 0;
                        return dateB - dateA;
                      });
                      
                      const displayedReviews = showAllReviews ? sortedReviews : sortedReviews.slice(0, 3);
                      
                      return (
                        <>
                          {displayedReviews.map((review) => (
                            <div key={review.id} className="flex gap-4 p-6 bg-zinc-50 rounded-2xl border border-zinc-100">
                              <div className="h-12 w-12 rounded-full bg-hanoi-red/10 flex items-center justify-center text-hanoi-red font-bold shrink-0">
                                {review.userName?.charAt(0) || "U"}
                              </div>
                              <div className="flex-1 space-y-2">
                                <div className="flex justify-between items-center">
                                  <h4 className="font-bold text-zinc-900">{review.userName || "Người dùng"}</h4>
                                  <span className="text-xs text-zinc-400 font-medium">
                                    {review.createdAt ? new Date(review.createdAt).toLocaleDateString('vi-VN') : "Gần đây"}
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
                          
                          {place.reviews.length > 3 && (
                            <div className="flex justify-center pt-4">
                              <Button 
                                variant="ghost" 
                                onClick={() => setShowAllReviews(!showAllReviews)}
                                className="font-bold text-zinc-500 hover:text-hanoi-red transition-colors"
                              >
                                {showAllReviews 
                                  ? "Thu gọn đánh giá" 
                                  : `Xem thêm ${place.reviews.length - 3} đánh giá`
                                }
                              </Button>
                            </div>
                          )}
                        </>
                      );
                    })()}
                  </div>
                ) : (
                  <div className="text-center py-12 bg-zinc-50 rounded-3xl border border-dashed border-zinc-200">
                    <p className="text-zinc-400 font-medium">Chưa có đánh giá nào. Hãy là người đầu tiên!</p>
                  </div>
                )}
              </section>
            </div>

            {/* Right Sidebar (Responsive) */}
            <aside className="lg:col-span-1">
              <div className="sticky top-24 space-y-6">
                {/* Info Card */}
                <div className="bg-white border border-zinc-100 rounded-3xl p-6 md:p-8 shadow-sm space-y-6">
                  <div className="space-y-1">
                    <p className="text-[10px] font-bold text-zinc-400 uppercase tracking-widest">Giá trung bình</p>
                    <p className="text-xl md:text-2xl font-bold text-hanoi-red">
                      {place.priceAvg > 0 ? `${place.priceAvg.toLocaleString()}đ` : "Giá liên hệ"}
                    </p>
                  </div>

                  <div className="space-y-1 pt-4 border-t border-zinc-50">
                    <p className="text-[10px] font-bold text-zinc-400 uppercase tracking-widest">Địa chỉ</p>
                    <p className="text-zinc-900 font-medium leading-relaxed">{place.address}</p>
                  </div>
                  
                  <div className="pt-2">
                    <a 
                      href={`https://www.google.com/maps/dir/?api=1&destination=${place.latitude},${place.longitude}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="block w-full"
                    >
                      <Button className="w-full bg-hanoi-red hover:bg-hanoi-red/90 h-12 rounded-xl font-bold text-base md:text-lg shadow-lg shadow-hanoi-red/20 transition-all">
                        Chỉ đường đi
                      </Button>
                    </a>
                  </div>
                </div>

                {/* Map Interactive Card */}
                <div className="bg-white border border-zinc-100 rounded-3xl p-2 shadow-sm overflow-hidden">
                  <div className="relative aspect-square w-full rounded-2xl overflow-hidden bg-zinc-100 border border-zinc-50">
                    <PlaceMap lat={place.latitude} lng={place.longitude} name={place.name} />
                    
                    {/* Overlay Info */}
                    <div className="absolute bottom-4 left-4 right-4 z-10 bg-white/90 backdrop-blur-md p-3 rounded-xl border border-zinc-200 shadow-sm flex items-center gap-3">
                      <div className="w-8 h-8 bg-hanoi-red rounded-lg flex items-center justify-center text-white shrink-0">
                        <MapPin className="h-4 w-4" />
                      </div>
                      <div className="min-w-0">
                        <p className="text-[8px] font-bold text-zinc-400 uppercase tracking-widest">Vị trí</p>
                        <p className="text-[10px] font-bold text-zinc-900 truncate">{place.district}, Hà Nội</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </aside>
          </div>
        </div>
      </main>

      <ReviewModal 
        isOpen={isReviewModalOpen} 
        onClose={() => setIsReviewModalOpen(false)} 
        placeId={Number(id)}
        placeName={place.name}
      />

      {/* Sticky Bottom Action Bar (Mobile Only) */}
      <div className="fixed bottom-0 left-0 right-0 z-[40] bg-white/80 backdrop-blur-xl border-t border-zinc-100 p-4 md:hidden flex items-center gap-3 shadow-[0_-10px_40px_rgba(0,0,0,0.05)]">
        <button 
          onClick={handleToggleFavorite}
          disabled={toggleFavoriteMutation.isPending}
          className={cn(
            "p-3.5 rounded-2xl transition-all border shrink-0",
            isFavorite 
              ? "bg-hanoi-red border-hanoi-red text-white shadow-lg shadow-hanoi-red/20" 
              : "bg-zinc-50 border-zinc-100 text-zinc-400"
          )}
        >
          {toggleFavoriteMutation.isPending ? (
            <Loader2 className="h-6 w-6 animate-spin" />
          ) : (
            <Heart className={cn("h-6 w-6", isFavorite && "fill-current")} />
          )}
        </button>
        <a 
          href={`https://www.google.com/maps/dir/?api=1&destination=${place.latitude},${place.longitude}`}
          target="_blank"
          rel="noopener noreferrer"
          className="flex-1"
        >
          <Button className="w-full bg-hanoi-red hover:bg-hanoi-red/90 h-14 rounded-2xl font-bold text-base shadow-lg shadow-hanoi-red/20 active:scale-[0.98] transition-all">
            Chỉ đường đi ngay
          </Button>
        </a>
      </div>
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
