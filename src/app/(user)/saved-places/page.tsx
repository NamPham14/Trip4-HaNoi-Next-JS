"use client";

import React from "react";
import { Navbar } from "@/shared/components/navbar";
import { useSavedPlaces } from "@/features/places/hooks/use-places";
import { PlaceCard } from "@/features/places/components/place-card";
import { Heart, MapPin, Loader2, Search } from "lucide-react";
import { Button } from "@/shared/components/ui/button";
import Link from "next/link";
import { Skeleton } from "@/shared/components/ui/skeleton";

export default function SavedPlacesPage() {
  const { data: savedPlaces, isLoading, error } = useSavedPlaces();

  React.useEffect(() => {
    if (savedPlaces) {
      console.log("Saved places data received:", savedPlaces);
    }
  }, [savedPlaces]);

  return (
    <div className="min-h-screen bg-zinc-50 flex flex-col">
      <Navbar />

      <main className="flex-1 container mx-auto px-4 py-8 md:py-12">
        {/* Header Section */}
        <div className="mb-10">
          <h1 className="text-3xl md:text-4xl font-black text-zinc-900 flex items-center gap-3">
            <div className="bg-hanoi-red/10 p-2.5 rounded-2xl">
              <Heart className="h-8 w-8 text-hanoi-red fill-current" />
            </div>
            Địa điểm đã lưu
          </h1>
          <p className="text-zinc-500 font-medium mt-2 max-w-2xl">
            Danh sách những địa điểm tuyệt vời bạn đã lưu lại để chuẩn bị cho chuyến khám phá Hà Nội sắp tới.
          </p>
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
        ) : error ? (
          <div className="text-center py-20 bg-white rounded-[40px] border border-zinc-100 shadow-sm">
            <p className="text-hanoi-red font-bold">Đã có lỗi xảy ra khi tải dữ liệu. Vui lòng thử lại sau.</p>
          </div>
        ) : savedPlaces && savedPlaces.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 md:gap-8">
            {savedPlaces
              .filter(saved => !!saved.place) // Bỏ qua nếu dữ liệu địa điểm bị thiếu
              .map((saved) => (
                <div key={saved.id} className="group transition-all hover:-translate-y-1">
                  <PlaceCard place={saved.place} />
                </div>
              ))}
          </div>
        ) : (
          /* Empty State */
          <div className="text-center py-24 bg-white rounded-[40px] border border-zinc-100 shadow-sm max-w-4xl mx-auto px-6">
            <div className="w-24 h-24 bg-zinc-50 rounded-full flex items-center justify-center mx-auto mb-8 border border-dashed border-zinc-200">
              <Search className="h-10 w-10 text-zinc-300" />
            </div>
            <h2 className="text-2xl font-black text-zinc-900 mb-4">Chưa có địa điểm nào</h2>
            <p className="text-zinc-500 mb-10 max-w-md mx-auto leading-relaxed">
              Khám phá thêm nhiều quán ăn ngon và địa danh thú vị, sau đó nhấn nút trái tim để lưu lại tại đây nhé!
            </p>
            <Link href="/explore">
              <Button className="bg-hanoi-red hover:bg-hanoi-red/90 text-white rounded-2xl font-bold h-14 px-10 shadow-xl shadow-hanoi-red/20 transition-all active:scale-95">
                Bắt đầu khám phá ngay
              </Button>
            </Link>
          </div>
        )}
      </main>

      <footer className="py-10 text-center text-zinc-400 text-[10px] font-bold uppercase tracking-[0.2em]">
        Trip4Hanoi © 2026 - Bản lưu trữ cá nhân
      </footer>
    </div>
  );
}
