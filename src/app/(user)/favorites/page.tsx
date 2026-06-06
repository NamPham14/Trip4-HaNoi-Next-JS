"use client";

import React, { useState } from "react";
import { Navbar } from "@/shared/components/navbar";
import { useSavedPlaces } from "@/features/places/hooks/use-places";
import { useFollowedEvents } from "@/features/events/hooks/use-events";
import { PlaceCard } from "@/features/places/components/place-card";
import { EventCard } from "@/features/events/components/event-card";
import { Heart, MapPin, Calendar, LayoutGrid, Search, Loader2, BookmarkX } from "lucide-react";
import { Button } from "@/shared/components/ui/button";
import Link from "next/link";
import { Skeleton } from "@/shared/components/ui/skeleton";
import { cn } from "@/shared/lib/utils";

type FilterType = "all" | "places" | "events";

export default function FavoritesPage() {
  const [filter, setFilter] = useState<FilterType>("all");
  const [searchQuery, setSearchQuery] = useState("");

  const { data: savedPlaces, isLoading: isPlacesLoading, error: placesError } = useSavedPlaces();
  const { data: followedEvents, isLoading: isEventsLoading, error: eventsError } = useFollowedEvents();

  const isLoading = isPlacesLoading || isEventsLoading;
  const hasError = placesError || eventsError;

  // Filter logic with safety checks for data structure
  // savedPlaces is [{ id, place: Place }, ...]
  const filteredPlaces = (savedPlaces || [])
    .filter(item => !!item.place)
    .filter(item => {
      const p = item.place;
      return (p.name?.toLowerCase() || "").includes(searchQuery.toLowerCase()) || 
             (p.address?.toLowerCase() || "").includes(searchQuery.toLowerCase());
    });

  // followedEvents is [Event, ...]
  const filteredEvents = (followedEvents || []).filter(e => 
    (e.name?.toLowerCase() || "").includes(searchQuery.toLowerCase()) || 
    (e.description?.toLowerCase() || "").includes(searchQuery.toLowerCase())
  );

  const totalItems = (filter === "all" || filter === "places" ? filteredPlaces.length : 0) + 
                     (filter === "all" || filter === "events" ? filteredEvents.length : 0);

  return (
    <div className="min-h-screen bg-zinc-50 flex flex-col">
      <Navbar />

      <main className="flex-1 container mx-auto px-4 py-8 md:py-12 max-w-7xl">
        {/* Header Section */}
        <div className="mb-10 flex flex-col md:flex-row md:items-end justify-between gap-6">
          <div className="space-y-2">
            <h1 className="text-3xl md:text-5xl font-black text-zinc-900 flex items-center gap-4">
              <div className="bg-hanoi-red/10 p-3 rounded-2xl">
                <Heart className="h-8 w-8 md:h-10 md:w-10 text-hanoi-red fill-current" />
              </div>
              Yêu thích
            </h1>
            <p className="text-zinc-500 font-medium max-w-2xl text-sm md:text-base">
              Nơi lưu giữ những địa điểm tuyệt vời và sự kiện đặc sắc bạn không muốn bỏ lỡ tại Hà Nội.
            </p>
          </div>

          {/* Search Bar */}
          <div className="relative w-full md:w-80 lg:w-96">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-zinc-400" />
            <input 
              type="text" 
              placeholder="Tìm kiếm trong mục đã lưu..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-12 pr-4 py-4 bg-white border border-zinc-100 rounded-2xl text-sm font-bold shadow-sm focus:ring-2 focus:ring-hanoi-red/20 focus:border-hanoi-red outline-none transition-all"
            />
          </div>
        </div>

        {/* Filter Tabs */}
        <div className="flex items-center gap-2 mb-8 overflow-x-auto pb-2 no-scrollbar">
          <FilterChip 
            label="Tất cả" 
            count={(savedPlaces?.length || 0) + (followedEvents?.length || 0)} 
            active={filter === "all"} 
            onClick={() => setFilter("all")} 
            icon={<LayoutGrid className="h-4 w-4" />}
          />
          <FilterChip 
            label="Địa điểm" 
            count={savedPlaces?.length || 0} 
            active={filter === "places"} 
            onClick={() => setFilter("places")} 
            icon={<MapPin className="h-4 w-4" />}
          />
          <FilterChip 
            label="Sự kiện" 
            count={followedEvents?.length || 0} 
            active={filter === "events"} 
            onClick={() => setFilter("events")} 
            icon={<Calendar className="h-4 w-4" />}
          />
        </div>

        {isLoading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 md:gap-8">
            {[...Array(8)].map((_, i) => (
              <div key={i} className="space-y-4">
                <Skeleton className="aspect-[4/3] w-full rounded-3xl" />
                <Skeleton className="h-6 w-3/4 rounded-lg" />
                <Skeleton className="h-4 w-1/2 rounded-lg" />
              </div>
            ))}
          </div>
        ) : hasError ? (
          <div className="text-center py-20 bg-white rounded-[40px] border border-zinc-100 shadow-sm">
            <p className="text-hanoi-red font-bold">Đã có lỗi xảy ra khi tải dữ liệu. Vui lòng thử lại sau.</p>
          </div>
        ) : totalItems > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 md:gap-8">
            {(filter === "all" || filter === "places") && filteredPlaces.map((item) => (
              <div key={`place-${item.id}`} className="group transition-all hover:-translate-y-1 animate-in fade-in slide-in-from-bottom-4 duration-500">
                <PlaceCard place={item.place} />
              </div>
            ))}
            {(filter === "all" || filter === "events") && filteredEvents.map((event) => (
              <div key={`event-${event.id}`} className="group transition-all hover:-translate-y-1 animate-in fade-in slide-in-from-bottom-4 duration-500">
                <EventCard event={event} />
              </div>
            ))}
          </div>
        ) : (
          /* Empty State */
          <div className="text-center py-24 bg-white rounded-[40px] border border-zinc-100 shadow-sm max-w-4xl mx-auto px-6">
            <div className="w-24 h-24 bg-zinc-50 rounded-full flex items-center justify-center mx-auto mb-8 border border-dashed border-zinc-200">
              <BookmarkX className="h-10 w-10 text-zinc-200" />
            </div>
            <h2 className="text-2xl font-black text-zinc-900 mb-4">
              {searchQuery ? "Không tìm thấy kết quả" : "Chưa có nội dung nào"}
            </h2>
            <p className="text-zinc-500 mb-10 max-w-md mx-auto leading-relaxed">
              {searchQuery 
                ? `Không tìm thấy nội dung nào phù hợp với từ khóa "${searchQuery}"`
                : "Hãy khám phá thêm nhiều quán ăn ngon và sự kiện thú vị, sau đó nhấn nút trái tim để lưu lại tại đây nhé!"}
            </p>
            {!searchQuery && (
              <Link href="/explore">
                <Button className="bg-hanoi-red hover:bg-hanoi-red/90 text-white rounded-2xl font-bold h-14 px-10 shadow-xl shadow-hanoi-red/20 transition-all active:scale-95">
                  Khám phá ngay
                </Button>
              </Link>
            )}
          </div>
        )}
      </main>

      <footer className="py-10 text-center text-zinc-400 text-[10px] font-bold uppercase tracking-[0.2em]">
        Trip4Hanoi © 2026 - Bản lưu trữ cá nhân
      </footer>
    </div>
  );
}

interface FilterChipProps {
  label: string;
  count: number;
  active: boolean;
  onClick: () => void;
  icon: React.ReactNode;
}

const FilterChip = ({ label, count, active, onClick, icon }: FilterChipProps) => (
  <button
    onClick={onClick}
    className={cn(
      "flex items-center gap-2 px-6 py-3 rounded-2xl text-sm font-black transition-all whitespace-nowrap border",
      active 
        ? "bg-zinc-900 text-white border-zinc-900 shadow-lg shadow-zinc-200" 
        : "bg-white text-zinc-500 border-zinc-100 hover:border-zinc-300 shadow-sm"
    )}
  >
    {icon}
    {label}
    <span className={cn(
      "ml-1 text-[10px] px-2 py-0.5 rounded-full font-black",
      active ? "bg-white/20 text-white" : "bg-zinc-100 text-zinc-500"
    )}>
      {count}
    </span>
  </button>
);
