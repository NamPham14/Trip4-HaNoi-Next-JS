import React from "react";
import Link from "next/link";
import { Calendar, MapPin, Star, Users, ArrowRight } from "lucide-react";
import { Event } from "../types/event";
import { Badge } from "@/shared/components/ui/badge";
import { Button } from "@/shared/components/ui/button";
import { cn } from "@/shared/lib/utils";

interface EventCardProps {
  event: Event;
  className?: string;
}

export const EventCard: React.FC<EventCardProps> = ({ event, className }) => {
  const isStarted = new Date(event.startTime) <= new Date();
  const isEnded = new Date(event.endTime) < new Date();
  
  const statusColor = isEnded 
    ? "bg-zinc-100 text-zinc-500" 
    : isStarted 
      ? "bg-emerald-50 text-emerald-600 border-emerald-100" 
      : "bg-orange-50 text-orange-600 border-orange-100";

  const statusText = isEnded 
    ? "Đã kết thúc" 
    : isStarted 
      ? "Đang diễn ra" 
      : "Sắp diễn ra";

  return (
    <div className={cn(
      "group bg-white rounded-[32px] border border-zinc-100 overflow-hidden hover:shadow-2xl hover:shadow-zinc-200/50 transition-all duration-500 flex flex-col h-full",
      className
    )}>
      {/* Image Container */}
      <div className="relative aspect-[16/10] overflow-hidden">
        <img 
          src={event.images?.[0]?.imageUrl || "https://images.unsplash.com/photo-1505944270255-bd2b68af6422?q=80&w=800"} 
          alt={event.name}
          className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
        <div className="absolute top-4 left-4 flex flex-col gap-2">
          <Badge className={cn("font-black uppercase tracking-wider text-[10px] px-3 py-1.5 rounded-full border-none shadow-lg backdrop-blur-md", statusColor)}>
            {statusText}
          </Badge>
          {event.followCount !== undefined && event.followCount > 0 && (
            <Badge className="bg-white/90 backdrop-blur-md text-zinc-900 font-black text-[10px] px-3 py-1.5 rounded-full border-none shadow-md flex items-center gap-1.5">
              <Users className="h-3 w-3 text-hanoi-red" /> {event.followCount}
            </Badge>
          )}
        </div>
      </div>

      {/* Content */}
      <div className="p-5 md:p-7 flex flex-col flex-1">
        <div className="mb-4">
          <Link href={`/events/${event.id}`}>
            <h3 className="text-xl md:text-2xl font-black text-zinc-900 group-hover:text-hanoi-red transition-all duration-300 line-clamp-2 leading-tight mb-4">
              {event.name}
            </h3>
          </Link>
          <div className="space-y-2.5">
            <div className="flex items-center gap-3 text-zinc-500 font-bold text-xs md:text-sm">
              <div className="h-8 w-8 rounded-full bg-hanoi-red/5 flex items-center justify-center shrink-0">
                <Calendar className="h-4 w-4 text-hanoi-red" />
              </div>
              <span className="truncate">{new Date(event.startTime).toLocaleDateString('vi-VN')} - {new Date(event.endTime).toLocaleDateString('vi-VN')}</span>
            </div>
            <div className="flex items-center gap-3 text-zinc-500 font-bold text-xs md:text-sm">
              <div className="h-8 w-8 rounded-full bg-hanoi-red/5 flex items-center justify-center shrink-0">
                <MapPin className="h-4 w-4 text-hanoi-red" />
              </div>
              <span className="line-clamp-1">{event.placeName || event.location || "Địa điểm chưa xác định"}</span>
            </div>
          </div>
        </div>

        <p className="text-zinc-500 text-sm md:text-base font-medium line-clamp-2 mb-8 leading-relaxed">
          {event.description}
        </p>

        <div className="mt-auto pt-5 border-t border-zinc-50 flex items-center justify-between group/action">
          <Link href={`/events/${event.id}`} className="flex-1">
            <Button className="w-full bg-zinc-900 hover:bg-hanoi-red text-white font-black rounded-2xl h-12 md:h-14 transition-all duration-300 active:scale-95 group/btn overflow-hidden relative">
              <span className="relative z-10 flex items-center justify-center">
                Xem chi tiết
                <ArrowRight className="ml-2 h-4 w-4 transition-transform duration-300 group-hover/btn:translate-x-1" />
              </span>
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
};
