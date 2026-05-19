"use client";

import Image from "next/image";
import { Info, Image as ImageIcon, Calendar, Clock } from "lucide-react";
import { Badge } from "@/shared/components/ui/badge";
import { PlaceDetailResponse } from "../../types/place";

interface PlaceInfoProps {
  place: PlaceDetailResponse;
}

export const PlaceInfo = ({ place }: PlaceInfoProps) => {
  return (
    <div className="space-y-10 md:space-y-12">
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
            {/* Deduplicate events by ID to prevent visual repetition */}
            {Array.from(new Map(place.events.map(ev => [ev.id, ev])).values()).map((event) => (
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
    </div>
  );
};
