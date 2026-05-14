"use client";

import React from "react";
import { usePlaces } from "../hooks/use-places";
import { PlaceCard } from "./place-card";
import { Skeleton } from "@/shared/components/ui/skeleton";
import { Button } from "@/shared/components/ui/button";
import { SearchX } from "lucide-react";

interface ExploreResultsProps {
  filters: {
    keyword: string;
    categoryId: number | undefined;
    district: string;
    radius: number;
  };
}

export const ExploreResults = ({ filters }: ExploreResultsProps) => {
  const [page, setPage] = React.useState(0);

  const { data, isLoading, isFetching, error } = usePlaces({
    ...filters,
    page,
    size: 12,
  });

  if (isLoading && page === 0) {
    return (
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {[...Array(6)].map((_, i) => (
          <div key={i} className="flex flex-col space-y-3">
            <Skeleton className="h-[220px] w-full rounded-2xl" />
            <Skeleton className="h-4 w-[250px]" />
            <Skeleton className="h-4 w-[200px]" />
          </div>
        ))}
      </div>
    );
  }

  if (error || !data || !data.data || data.data.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-20 bg-white rounded-3xl border border-dashed border-zinc-200">
        <div className="bg-zinc-50 p-4 rounded-full mb-4">
          <SearchX className="h-10 w-10 text-zinc-300" />
        </div>
        <h3 className="text-xl font-bold text-zinc-900 mb-2">Không tìm thấy kết quả</h3>
        <p className="text-zinc-500 max-w-xs text-center">
          Chúng tôi không tìm thấy địa điểm nào khớp với bộ lọc của bạn. Hãy thử thay đổi từ khóa hoặc mở rộng bán kính nhé!
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-10">
      {/* Grid Results */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {data.data.map((place) => (
          <PlaceCard key={place.id} place={place} />
        ))}
      </div>

      {/* Pagination / Load More */}
      {data.totalPages > 1 && (
        <div className="flex items-center justify-center gap-2 pt-6">
          <Button
            variant="outline"
            disabled={page === 0 || isFetching}
            onClick={() => setPage(p => p - 1)}
            className="font-bold border-zinc-200"
          >
            Trang trước
          </Button>
          
          <div className="flex items-center gap-2 px-4">
            {[...Array(data.totalPages)].map((_, i) => (
              <button
                key={i}
                onClick={() => setPage(i)}
                className={`w-8 h-8 rounded-lg text-xs font-bold transition-all ${
                  page === i 
                    ? "bg-hanoi-red text-white" 
                    : "bg-white text-zinc-500 hover:bg-zinc-50 border border-zinc-100"
                }`}
              >
                {i + 1}
              </button>
            ))}
          </div>

          <Button
            variant="outline"
            disabled={page === data.totalPages - 1 || isFetching}
            onClick={() => setPage(p => p + 1)}
            className="font-bold border-zinc-200"
          >
            Trang sau
          </Button>
        </div>
      )}

      {/* Total Elements Count */}
      <div className="text-center text-xs font-medium text-zinc-400 uppercase tracking-widest">
        Hiển thị {data.data.length} trên tổng số {data.totalElements} địa điểm
      </div>
    </div>
  );
};
