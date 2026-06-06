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
  
  // Xử lý URL ảnh để tránh các lỗi định dạng thường gặp từ database
  const rawImage = place.images?.[0]?.imageUrl || "";
  const cleanImage = rawImage.startsWith('ihttp') ? rawImage.substring(1) : rawImage;
  const mainImage = cleanImage || "https://images.unsplash.com/photo-1501233321112-999aa1234567?q=80&w=1200&auto=format";

  return (
    <Link href={`/places/${place.id}`}>
      <div className={cn(
        "group relative flex flex-col overflow-hidden rounded-2xl bg-white transition-all duration-300 hover:shadow-2xl border border-zinc-100 h-full",
        className
      )}>
        {/* ... (phần Badge giữ nguyên) */}
        
        {/* Image Section */}
        <div className="relative aspect-[4/3] w-full overflow-hidden bg-zinc-100">
          <Image
            src={mainImage}
            alt={place.name}
            fill
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
            className="object-cover transition-transform duration-500 group-hover:scale-110"
            onError={(e) => {
              // Nếu ảnh lỗi, thay bằng ảnh placeholder ngay lập tức
              const target = e.target as HTMLImageElement;
              target.src = "https://images.unsplash.com/photo-1441260038675-7329ab4cc264?q=80&w=800";
            }}
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
