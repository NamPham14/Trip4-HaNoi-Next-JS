"use client";

import React, { useState } from "react";
import { useSavedPlaces } from "@/features/places/hooks/use-places";
import { useFollowedEvents } from "@/features/events/hooks/use-events";
import { MapPin, Calendar, LayoutGrid, Search, BookmarkX } from "lucide-react";
import { cn } from "@/shared/lib/utils";
import { PlaceCard } from "@/features/places/components/place-card";
import { EventCard } from "@/features/events/components/event-card";
import { Loader2 } from "lucide-react";

type FilterType = "all" | "places" | "events";

interface FilterChipProps {
  label: string;
  count: number;
  active: boolean;
  onClick: () => void;
  icon: React.ReactNode;
}

export const ActivityTab = () => {
  const [filter, setFilter] = useState<FilterType>("all");
  const [searchQuery, setSearchQuery] = useState("");

  const { data: savedPlaces, isLoading: isPlacesLoading } = useSavedPlaces();
  const { data: followedEvents, isLoading: isEventsLoading } = useFollowedEvents();

  const isLoading = isPlacesLoading || isEventsLoading;

  // Filter logic with safety checks
  const filteredPlaces = (savedPlaces || [])
    .filter(item => !!item.place)
    .filter(item => {
      const p = item.place;
      return (p.name?.toLowerCase() || "").includes(searchQuery.toLowerCase()) || 
             (p.address?.toLowerCase() || "").includes(searchQuery.toLowerCase());
    });

  const filteredEvents = (followedEvents || []).filter(e => 
    (e.name?.toLowerCase() || "").includes(searchQuery.toLowerCase()) || 
    (e.description?.toLowerCase() || "").includes(searchQuery.toLowerCase())
  );

  const totalItems = (filter === "all" || filter === "places" ? filteredPlaces.length : 0) + 
                     (filter === "all" || filter === "events" ? filteredEvents.length : 0);

  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center py-32 bg-white rounded-[32px] border border-zinc-100">
        <Loader2 className="h-10 w-10 animate-spin text-hanoi-red mb-4" />
        <p className="text-zinc-500 font-bold">Đang tải hoạt động...</p>
      </div>
    );
  }

  return (
    <div className="space-y-6 md:space-y-8 animate-in fade-in duration-500">
      {/* Search & Filter Header */}
      <div className="bg-white p-4 md:p-6 rounded-[32px] border border-zinc-100 shadow-sm space-y-4 md:space-y-0 md:flex md:items-center md:justify-between gap-4">
        {/* Filter Chips */}
        <div className="flex items-center gap-2 overflow-x-auto pb-2 md:pb-0 no-scrollbar">
          <FilterChip 
            label="Tất cả" 
            count={filteredPlaces.length + filteredEvents.length} 
            active={filter === "all"} 
            onClick={() => setFilter("all")} 
            icon={<LayoutGrid className="h-4 w-4" />}
          />
          <FilterChip 
            label="Địa điểm" 
            count={filteredPlaces.length} 
            active={filter === "places"} 
            onClick={() => setFilter("places")} 
            icon={<MapPin className="h-4 w-4" />}
          />
          <FilterChip 
            label="Sự kiện" 
            count={filteredEvents.length} 
            active={filter === "events"} 
            onClick={() => setFilter("events")} 
            icon={<Calendar className="h-4 w-4" />}
          />
        </div>

        {/* Search Bar */}
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-zinc-400" />
          <input 
            type="text" 
            placeholder="Tìm trong mục đã lưu..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-11 pr-4 py-3 bg-zinc-50 border-none rounded-2xl text-sm font-bold focus:ring-2 focus:ring-hanoi-red/20 transition-all"
          />
        </div>
      </div>

      {/* Grid Content */}
      {totalItems > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6">
          {(filter === "all" || filter === "places") && filteredPlaces.map(item => (
            <div key={`place-${item.id}`} className="animate-in fade-in slide-in-from-bottom-4 duration-500">
              <PlaceCard place={item.place} />
            </div>
          ))}
          {(filter === "all" || filter === "events") && filteredEvents.map(event => (
            <div key={`event-${event.id}`} className="animate-in fade-in slide-in-from-bottom-4 duration-500">
              <EventCard event={event} />
            </div>
          ))}
        </div>
      ) : (
        <EmptyState searchQuery={searchQuery} />
      )}
    </div>
  );
};

const FilterChip = ({ label, count, active, onClick, icon }: FilterChipProps) => (
  <button
    onClick={onClick}
    className={cn(
      "flex items-center gap-2 px-5 py-2.5 rounded-2xl text-sm font-black transition-all whitespace-nowrap border",
      active 
        ? "bg-zinc-900 text-white border-zinc-900 shadow-lg shadow-zinc-200" 
        : "bg-white text-zinc-500 border-zinc-100 hover:border-zinc-300"
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

const EmptyState = ({ searchQuery }: { searchQuery: string }) => (
  <div className="text-center py-24 md:py-32 bg-white rounded-[40px] border border-dashed border-zinc-200">
    <div className="w-20 h-20 bg-zinc-50 rounded-full flex items-center justify-center mx-auto mb-6">
      <BookmarkX className="h-10 w-10 text-zinc-200" />
    </div>
    <h3 className="text-xl font-black text-zinc-900 mb-2">
      {searchQuery ? "Không tìm thấy kết quả" : "Chưa có nội dung đã lưu"}
    </h3>
    <p className="text-zinc-400 font-medium max-w-xs mx-auto">
      {searchQuery 
        ? `Không tìm thấy nội dung nào phù hợp với từ khóa "${searchQuery}"`
        : "Hãy khám phá và lưu lại những địa điểm, sự kiện mà bạn yêu thích."}
    </p>
  </div>
);
