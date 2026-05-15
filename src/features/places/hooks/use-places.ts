/* eslint-disable @typescript-eslint/no-explicit-any */
import { useQuery } from "@tanstack/react-query";
import { placeService } from "../services/place-api";
import { PlaceFilterParams } from "../types/place";
import { useLocationStore } from "@/shared/store/location-store";

/**
 * Query Keys for Places
 */
export const placeKeys = {
  all: ['places'] as const,
  lists: () => [...placeKeys.all, 'list'] as const,
  list: (params: any) => [...placeKeys.lists(), params] as const,
  recommendations: (lat?: number, lng?: number) => [...placeKeys.all, 'recommendations', { lat, lng }] as const,
  detail: (id: string | number) => [...placeKeys.all, 'detail', id] as const,
};

/**
 * Hook for fetching a single place detail
 */
export const usePlaceDetail = (id: string | number) => {
  const { lat, lng } = useLocationStore();

  return useQuery({
    queryKey: placeKeys.detail(id),
    queryFn: () => placeService.getPlaceById(id, lat || undefined, lng || undefined),
    enabled: !!id,
    staleTime: 5 * 60 * 1000,
  });
};

/**
 * Hook for fetching recommended places
 */
export const useRecommendations = () => {
  const { lat, lng } = useLocationStore();
  
  return useQuery({
    queryKey: placeKeys.recommendations(lat || undefined, lng || undefined),
    queryFn: () => placeService.getRecommendations(lat || undefined, lng || undefined),
    staleTime: 30 * 60 * 1000, // 30 minutes (Matches Backend Redis TTL)
  });
};

/**
 * Hook for searching/filtering places
 */
export const usePlaces = (params: PlaceFilterParams) => {
  const { lat, lng } = useLocationStore();
  
  const mergedParams = {
    ...params,
    userLat: params.userLat || lat || undefined,
    userLng: params.userLng || lng || undefined,
  };

  return useQuery({
    queryKey: placeKeys.list(mergedParams),
    queryFn: () => placeService.getPlaces(mergedParams),
    staleTime: 5 * 60 * 1000,
  });
};
