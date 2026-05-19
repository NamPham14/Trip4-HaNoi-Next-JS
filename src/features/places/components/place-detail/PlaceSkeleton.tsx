"use client";

import { Skeleton } from "@/shared/components/ui/skeleton";

export const PlaceSkeleton = () => {
  return (
    <div className="min-h-screen bg-white">
      <Skeleton className="h-[50vh] w-full" />
      <div className="container mx-auto px-4 mt-12 grid grid-cols-1 lg:grid-cols-3 gap-12">
        <div className="lg:col-span-2 space-y-12">
          <div className="space-y-4">
            <Skeleton className="h-8 w-48" />
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-3/4" />
          </div>
          <div className="grid grid-cols-3 gap-4">
            <Skeleton className="aspect-square rounded-2xl" />
            <Skeleton className="aspect-square rounded-2xl" />
            <Skeleton className="aspect-square rounded-2xl" />
          </div>
        </div>
        <div className="lg:col-span-1">
          <Skeleton className="h-96 w-full rounded-3xl" />
        </div>
      </div>
    </div>
  );
};
