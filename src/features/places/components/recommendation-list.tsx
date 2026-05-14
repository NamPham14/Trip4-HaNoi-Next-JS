"use client";

import React from "react";
import { useRecommendations } from "../hooks/use-places";
import { PlaceCard } from "./place-card";
import { Skeleton } from "@/shared/components/ui/skeleton";

export const RecommendationList = () => {
  const { data: recommendations, isLoading, error } = useRecommendations();

  if (isLoading) {
    return (
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {[...Array(4)].map((_, i) => (
          <div key={i} className="flex flex-col space-y-3">
            <Skeleton className="h-[200px] w-full rounded-2xl" />
            <Skeleton className="h-4 w-[250px]" />
            <Skeleton className="h-4 w-[200px]" />
          </div>
        ))}
      </div>
    );
  }

  if (error || !recommendations || recommendations.length === 0) {
    return (
      <div className="text-center py-10 bg-zinc-50 rounded-2xl border border-dashed border-zinc-200">
        <p className="text-zinc-500">Chưa có gợi ý phù hợp cho bạn. Hãy thử bật GPS hoặc chọn sở thích nhé!</p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
      {recommendations.map((place) => (
        <PlaceCard key={place.id} place={place} />
      ))}
    </div>
  );
};
