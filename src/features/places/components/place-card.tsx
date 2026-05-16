import React from "react";
import Image from "next/image";
import Link from "next/link";
import {  Star, Eye, Flame } from "lucide-react";
import { Place } from "../types/place";
import { Badge } from "@/shared/components/ui/badge";
import { cn } from "@/shared/lib/utils";

interface PlaceCardProps {
  place: Place;
  className?: string;
}

export const PlaceCard = ({ place, className }: PlaceCardProps) => {
  if (!place) return null;
  
  const mainImage = place.images?.[0]?.imageUrl || "https://images.unsplash.com/photo-1509356861241-713028054452?auto=format&fit=crop&q=80&w=800";

  return (
    <Link href={`/places/${place.id}`}>
      <div className={cn(
        "group relative flex flex-col overflow-hidden rounded-2xl bg-white transition-all duration-300 hover:shadow-2xl border border-zinc-100",
        className
      )}>
        {/* Badges */}
        <div className="absolute left-3 top-3 z-10 flex flex-col gap-2">
          {place.isRecommended && (
            <Badge className="bg-hanoi-red hover:bg-hanoi-red text-white border-none shadow-sm px-2 py-1 flex items-center gap-1">
              <Star className="h-3 w-3 fill-current" />
              Hợp gu
            </Badge>
          )}
          {place.hasActiveEvent && (
            <Badge className="bg-orange-500 hover:bg-orange-600 text-white border-none shadow-sm px-2 py-1 flex items-center gap-1">
              <Flame className="h-3 w-3 fill-current" />
              Sự kiện
            </Badge>
          )}
        </div>

        {/* Favorite/Distance Badge */}
        <div className="absolute right-3 top-3 z-10">
          <Badge variant="secondary" className="bg-white/90 backdrop-blur-sm text-hanoi-red border-none font-bold">
            {place.distance != null && place.distance > 0 
              ? `${place.distance.toFixed(1)} km` 
              : place.district}
          </Badge>
        </div>

        {/* Image Section */}
        <div className="relative aspect-[4/3] w-full overflow-hidden">
          <Image
            src={mainImage}
            alt={place.name}
            fill
            className="object-cover transition-transform duration-500 group-hover:scale-110"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
        </div>

        {/* Content Section */}
        <div className="flex flex-col flex-1 p-4">
          <div className="flex items-center gap-1 text-[10px] uppercase tracking-wider text-zinc-500 font-bold mb-1">
            <span className="text-hanoi-red">{place.categoryName}</span>
            <span>•</span>
            <span>{place.district}</span>
          </div>
          
          <h3 className="text-lg font-bold text-zinc-900 line-clamp-1 group-hover:text-hanoi-red transition-colors mb-2">
            {place.name}
          </h3>

          <div className="flex items-center gap-3 mt-auto pt-2 border-t border-zinc-50">
            <div className="flex items-center gap-1">
              <Star className="h-4 w-4 text-yellow-500 fill-current" />
              <span className="text-sm font-bold">{(place.ratingAvg ?? 0).toFixed(1)}</span>
            </div>
            <div className="flex items-center gap-1 text-zinc-400">
              <Eye className="h-4 w-4" />
              <span className="text-xs">{place.viewCount}</span>
            </div>
            <div className="ml-auto text-hanoi-red font-bold text-sm">
              {place.priceAvg > 0 ? `${place.priceAvg.toLocaleString()}đ` : "Giá liên hệ"}
            </div>
          </div>
        </div>
      </div>
    </Link>
  );
};
