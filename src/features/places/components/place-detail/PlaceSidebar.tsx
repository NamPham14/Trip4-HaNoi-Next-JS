"use client";

import { MapPin } from "lucide-react";
import { Button } from "@/shared/components/ui/button";
import { toast } from "sonner";
import { PlaceDetailResponse } from "../../types/place";
import { PlaceMap } from "./PlaceMap";

interface PlaceSidebarProps {
  place: PlaceDetailResponse;
  isAuthenticated: boolean;
}

export const PlaceSidebar = ({ place, isAuthenticated }: PlaceSidebarProps) => {
  const handleDirections = () => {
    if (!isAuthenticated) {
      toast.error("Vui lòng đăng nhập để sử dụng tính năng chỉ đường");
      return;
    }
    window.open(`https://www.google.com/maps/dir/?api=1&destination=${place.latitude},${place.longitude}`, '_blank');
  };

  return (
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
            <Button 
              onClick={handleDirections}
              className="w-full bg-hanoi-red hover:bg-hanoi-red/90 h-12 rounded-xl font-bold text-base md:text-lg shadow-lg shadow-hanoi-red/20 transition-all"
            >
              Chỉ đường đi
            </Button>
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
  );
};
