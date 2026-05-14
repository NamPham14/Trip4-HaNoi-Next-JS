"use client";

import React, { useState } from "react";
import { Navbar } from "@/shared/components/navbar";
import { ExploreFilters } from "@/features/places/components/explore-filters";
import { ExploreResults } from "@/features/places/components/explore-results";
import { MapPin, Search, Filter, ChevronDown } from "lucide-react";
import { Button } from "@/shared/components/ui/button";

export default function ExplorePage() {
  const [filters, setFilters] = useState({
    keyword: "",
    categoryId: undefined as number | undefined,
    district: "",
    radius: 5,
  });

  return (
    <div className="min-h-screen bg-hanoi-cream flex flex-col">
      <Navbar />

      <main className="flex-1 container mx-auto px-4 py-8 md:py-12">
        {/* Header Section */}
        <div className="mb-10 flex flex-col md:flex-row md:items-end justify-between gap-4">
          <div className="space-y-1">
            <div className="flex items-center gap-2 text-hanoi-red font-bold text-sm uppercase tracking-widest">
              <MapPin className="h-4 w-4" />
              Khám phá Hà Nội
            </div>
            <h1 className="text-4xl font-bold text-zinc-900 tracking-tight">
              Tìm kiếm địa điểm <span className="text-hanoi-red">quanh bạn</span>
            </h1>
            <p className="text-zinc-500 font-medium max-w-xl leading-relaxed">
              Sử dụng bộ lọc để tìm kiếm những địa điểm ăn uống, vui chơi phù hợp nhất với vị trí và sở thích của bạn.
            </p>
          </div>
          
          <div className="flex items-center gap-2 px-4 py-2 bg-white rounded-full border border-zinc-100 shadow-sm text-xs font-bold text-zinc-400 uppercase tracking-widest">
            <Search className="h-3 w-3" />
            Tự động cập nhật theo GPS
          </div>
        </div>

        {/* Content Grid */}
        <div className="flex flex-col lg:grid lg:grid-cols-4 gap-8">
          {/* Mobile Filter Toggle (Hidden on Desktop) */}
          <div className="lg:hidden mb-4">
            <Button 
              variant="outline" 
              className="w-full justify-between font-bold border-zinc-200 h-12 rounded-xl"
              onClick={() => {
                const filterEl = document.getElementById('explore-filters');
                if (filterEl) filterEl.classList.toggle('hidden');
              }}
            >
              <div className="flex items-center gap-2">
                <Filter className="h-4 w-4 text-hanoi-red" />
                Bộ lọc tìm kiếm
              </div>
              <ChevronDown className="h-4 w-4" />
            </Button>
          </div>

          {/* Sidebar Filters */}
          <aside id="explore-filters" className="hidden lg:block lg:col-span-1">
            <div className="sticky top-24">
              <ExploreFilters filters={filters} setFilters={setFilters} />
            </div>
          </aside>

          {/* Main Results */}
          <section className="lg:col-span-3">
            <ExploreResults filters={filters} />
          </section>
        </div>
      </main>

      {/* Simple Footer */}
      <footer className="py-8 text-center text-zinc-400 text-xs font-medium uppercase tracking-widest border-t border-zinc-100 mt-12 bg-white">
        Trip4Hanoi © 2026 - Bản đồ ẩm thực & văn hóa Thủ Đô
      </footer>
    </div>
  );
}
