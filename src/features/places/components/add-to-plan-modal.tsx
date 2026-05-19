/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import React, { useEffect, useState } from "react";
import { Plus, Calendar, MapPin, Loader2 } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/shared/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/shared/components/ui/select";
import { Button } from "@/shared/components/ui/button";
import { itineraryService } from "@/features/itinerary/services/itinerary-api";
import { Itinerary } from "@/features/itinerary/types/itinerary";
import { toast } from "sonner";
import Link from "next/link";
import { cn } from "@/shared/lib/utils";

interface AddToPlanModalProps {
  placeId: number;
  placeName: string;
  isOpen: boolean;
  onClose: () => void;
}

export const AddToPlanModal = ({ placeId, placeName, isOpen, onClose }: AddToPlanModalProps) => {
  const [itineraries, setItineraries] = useState<Itinerary[]>([]);
  const [selectedItineraryId, setSelectedItineraryId] = useState<string>("");
  const [selectedDay, setSelectedDay] = useState<string>("1");
  const [isLoading, setIsLoading] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const loadItineraries = async () => {
    setIsLoading(true);
    try {
      const data = await itineraryService.getMyItineraries();
      setItineraries(data);
      if (data.length > 0) {
        setSelectedItineraryId(data[0].id.toString());
      }
    } catch (error) {
      toast.error("Không thể tải danh sách lịch trình");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (isOpen) {
      const init = async () => {
        await Promise.resolve();
        loadItineraries();
      };
      init();
    }
  }, [isOpen]);

  const handleAdd = async () => {
    if (!selectedItineraryId) return;
    
    setIsSubmitting(true);
    try {
      await itineraryService.addPlaceToItinerary({
        itineraryId: parseInt(selectedItineraryId),
        placeId,
        dayNumber: parseInt(selectedDay)
      });
      toast.success(`Đã thêm ${placeName} vào kế hoạch!`);
      onClose();
    } catch (error: any) {
      toast.error(error.response?.data?.message || "Lỗi khi thêm vào kế hoạch");
    } finally {
      setIsSubmitting(false);
    }
  };

  const selectedItinerary = itineraries.find(it => it.id.toString() === selectedItineraryId);
  const totalDays = selectedItinerary?.days || 1;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[500px] rounded-3xl bg-white p-0 overflow-hidden border-none shadow-2xl">
        <DialogHeader className="p-6 pb-0">
          <DialogTitle className="text-2xl font-black text-zinc-900 tracking-tight">Thêm vào kế hoạch</DialogTitle>
          <DialogDescription className="text-zinc-500 font-medium">
            Chọn lịch trình để lưu <span className="text-hanoi-red font-bold">{placeName}</span>
          </DialogDescription>
        </DialogHeader>

        <div className="p-6 space-y-8">
          {isLoading ? (
            <div className="flex flex-col items-center justify-center py-12 space-y-4">
              <div className="relative">
                <Loader2 className="h-10 w-10 text-hanoi-red animate-spin" />
                <div className="absolute inset-0 blur-xl bg-hanoi-red/20 animate-pulse"></div>
              </div>
              <p className="text-sm text-zinc-400 font-bold uppercase tracking-widest">Đang kết nối dữ liệu...</p>
            </div>
          ) : itineraries.length === 0 ? (
            <div className="py-10 text-center space-y-6 bg-zinc-50 rounded-3xl border border-dashed border-zinc-200">
              <div className="w-20 h-20 bg-white rounded-full flex items-center justify-center mx-auto shadow-sm">
                <Plus className="h-10 w-10 text-zinc-200" />
              </div>
              <div className="space-y-2 px-6">
                <p className="font-bold text-zinc-900 text-lg">Danh sách trống</p>
                <p className="text-sm text-zinc-500 leading-relaxed">Bạn chưa có lịch trình nào. Hãy để AI giúp bạn khởi tạo một chuyến đi tuyệt vời!</p>
              </div>
              <Link href="/planner" onClick={onClose} className="inline-block px-8">
                <Button className="bg-hanoi-red hover:bg-hanoi-red/90 rounded-2xl font-bold h-12 px-8 shadow-lg shadow-hanoi-red/20 transition-all active:scale-95">
                  Tạo ngay với AI
                </Button>
              </Link>
            </div>
          ) : (
            <div className="space-y-8">
              {/* Itinerary Selection Grid/List */}
              <div className="space-y-3">
                <label className="text-[10px] font-black text-zinc-400 uppercase tracking-[0.2em]">Chuyến đi của bạn</label>
                <div className="grid grid-cols-1 gap-3 max-h-[220px] overflow-y-auto pr-2 custom-scrollbar">
                  {itineraries.map((itinerary) => {
                    const isSelected = selectedItineraryId === itinerary.id.toString();
                    return (
                      <button
                        key={itinerary.id}
                        onClick={() => {
                          setSelectedItineraryId(itinerary.id.toString());
                          setSelectedDay("1");
                        }}
                        className={cn(
                          "group relative flex items-center gap-4 p-4 rounded-2xl border-2 transition-all text-left",
                          isSelected 
                            ? "bg-zinc-900 border-zinc-900 shadow-xl shadow-zinc-900/10" 
                            : "bg-white border-zinc-100 hover:border-zinc-200 hover:bg-zinc-50"
                        )}
                      >
                        <div className={cn(
                          "w-12 h-12 rounded-xl flex items-center justify-center shrink-0 transition-colors",
                          isSelected ? "bg-white/10 text-white" : "bg-zinc-100 text-zinc-400 group-hover:bg-zinc-200"
                        )}>
                          <MapPin className="h-6 w-6" />
                        </div>
                        <div className="min-w-0 flex-1">
                          <p className={cn("font-bold truncate transition-colors", isSelected ? "text-white" : "text-zinc-900")}>
                            {itinerary.title}
                          </p>
                          <div className={cn("flex items-center gap-3 text-[10px] font-bold uppercase tracking-wider mt-1 opacity-60", isSelected ? "text-white" : "text-zinc-400")}>
                            <span className="flex items-center gap-1"><Calendar className="h-3 w-3" /> {itinerary.days} ngày</span>
                            <span className="flex items-center gap-1">• {"Hà Nội"}</span>
                          </div>
                        </div>
                        {isSelected && (
                          <div className="absolute right-4 top-1/2 -translate-y-1/2 w-2 h-2 bg-hanoi-red rounded-full shadow-[0_0_10px_rgba(139,29,29,0.8)]" />
                        )}
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Day Selection Grid */}
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <label className="text-[10px] font-black text-zinc-400 uppercase tracking-[0.2em]">Chọn ngày đến</label>
                  <span className="text-[10px] font-bold text-hanoi-red bg-hanoi-red/5 px-2 py-0.5 rounded-full">
                    {totalDays} ngày có sẵn
                  </span>
                </div>
                <div className="flex flex-wrap gap-2">
                  {Array.from({ length: totalDays }, (_, i) => i + 1).map((day) => {
                    const isSelected = selectedDay === day.toString();
                    return (
                      <button
                        key={day}
                        onClick={() => setSelectedDay(day.toString())}
                        className={cn(
                          "min-w-[64px] h-14 rounded-2xl border-2 font-bold text-sm transition-all flex flex-col items-center justify-center gap-0.5",
                          isSelected
                            ? "bg-hanoi-red border-hanoi-red text-white shadow-lg shadow-hanoi-red/20 -translate-y-1"
                            : "bg-white border-zinc-100 text-zinc-500 hover:border-zinc-300"
                        )}
                      >
                        <span className="text-[9px] uppercase opacity-60">Ngày</span>
                        <span className="text-base">{day}</span>
                      </button>
                    );
                  })}
                </div>
              </div>
            </div>
          )}
        </div>

        <div className="p-6 bg-zinc-50 border-t border-zinc-100 flex items-center gap-4">
          <Button
            variant="ghost"
            onClick={onClose}
            className="flex-1 h-14 rounded-2xl font-bold text-zinc-500 hover:bg-white transition-all"
          >
            Đóng
          </Button>
          {itineraries.length > 0 && (
            <Button
              onClick={handleAdd}
              disabled={isSubmitting || !selectedItineraryId}
              className="flex-[2] h-14 bg-hanoi-red hover:bg-hanoi-red/90 rounded-2xl font-bold text-base shadow-xl shadow-hanoi-red/20 transition-all active:scale-95"
            >
              {isSubmitting ? (
                <div className="flex items-center gap-2">
                  <Loader2 className="h-5 w-5 animate-spin" />
                  Đang thêm...
                </div>
              ) : (
                <div className="flex items-center gap-2">
                  <Plus className="h-5 w-5" />
                  Xác nhận lưu
                </div>
              )}
            </Button>
          )}
        </div>
      </DialogContent>
      <style jsx global>{`
        .custom-scrollbar::-webkit-scrollbar {
          width: 4px;
        }
        .custom-scrollbar::-webkit-scrollbar-track {
          background: transparent;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background: #e4e4e7;
          border-radius: 10px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover {
          background: #d4d4d8;
        }
      `}</style>
    </Dialog>
  );
};
