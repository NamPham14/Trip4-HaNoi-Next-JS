"use client";

import Image from "next/image";
import Link from "next/link";
import { ChevronLeft, Share2, Heart, Star, MapPin, Navigation, Loader2 } from "lucide-react";
import { Badge } from "@/shared/components/ui/badge";
import { toast } from "sonner";
import { cn } from "@/shared/lib/utils";
import { PlaceDetailResponse } from "../../types/place";

interface PlaceHeroProps {
  place: PlaceDetailResponse;
  isFavorite: boolean;
  isPending: boolean;
  onToggleFavorite: () => void;
}

export const PlaceHero = ({ place, isFavorite, isPending, onToggleFavorite }: PlaceHeroProps) => {
  return (
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
            onClick={onToggleFavorite}
            disabled={isPending}
            className={cn(
              "p-2 backdrop-blur-md rounded-full transition-all",
              isFavorite ? "bg-hanoi-red text-white" : "bg-white/20 text-white hover:bg-white/40"
            )}
          >
            {isPending ? (
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
  );
};
