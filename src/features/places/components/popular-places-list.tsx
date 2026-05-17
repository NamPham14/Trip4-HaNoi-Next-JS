"use client";

import React from "react";
import { usePlacesList } from "../hooks/use-places";
import { PlaceCard } from "./place-card";
import { Skeleton } from "@/shared/components/ui/skeleton";

interface PopularPlacesListProps {
  limit?: number;
}

export const PopularPlacesList = ({ limit = 8 }: PopularPlacesListProps) => {
  // Call usePlacesList
  const { data: placesArray, isLoading, error } = usePlacesList();
  const places = Array.isArray(placesArray) ? placesArray.slice(0, limit) : [];

  if (isLoading) {
    return (
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {[...Array(limit)].map((_, i) => (
          <div key={i} className="flex flex-col space-y-3">
            <Skeleton className="h-[200px] w-full rounded-2xl" />
            <Skeleton className="h-4 w-[250px]" />
            <Skeleton className="h-4 w-[200px]" />
          </div>
        ))}
      </div>
    );
  }

  if (error || places.length === 0) {
    return (
      <div className="text-center py-10 bg-zinc-50 rounded-2xl border border-dashed border-zinc-200">
        <p className="text-zinc-500">Chưa có dữ liệu địa điểm.</p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
      {places.map((place) => (
        <PlaceCard key={place.id} place={place} />
      ))}
    </div>
  );
};
