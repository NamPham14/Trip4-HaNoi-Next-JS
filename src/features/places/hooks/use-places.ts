/* eslint-disable @typescript-eslint/no-explicit-any */
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { placeService } from "../services/place-api";
import { PlaceFilterParams } from "../types/place";
import { useLocationStore } from "@/shared/store/location-store";
import { toast } from "sonner";

/**
 * Query Keys for Places
 */
export const placeKeys = {
  all: ['places'] as const,
  lists: () => [...placeKeys.all, 'list'] as const,
  list: (params: any) => [...placeKeys.lists(), params] as const,
  recommendations: (lat?: number, lng?: number) => [...placeKeys.all, 'recommendations', { lat, lng }] as const,
  detail: (id: string | number) => [...placeKeys.all, 'detail', String(id)] as const,
  favoriteStatus: (id: string | number) => [...placeKeys.all, 'favorite-status', String(id)] as const,
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
 * Hook for checking favorite status
 */
export const useFavoriteStatus = (id: string | number) => {
  return useQuery({
    queryKey: placeKeys.favoriteStatus(id),
    queryFn: () => placeService.checkFavoriteStatus(Number(id)),
    enabled: !!id,
  });
};

/**
 * Hook for toggling favorite
 */
export const useToggleFavorite = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (placeId: number) => placeService.toggleFavorite(placeId),
    onSuccess: (_, placeId) => {
      queryClient.invalidateQueries({ queryKey: placeKeys.favoriteStatus(placeId) });
      queryClient.invalidateQueries({ queryKey: placeKeys.detail(placeId) });
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.message || "Thao tác thất bại");
    }
  });
};

/**
 * Hook for submitting a review
 */
export const useSubmitReview = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: { placeId: number; rating: number; comment: string }) => 
      placeService.submitReview(data),
    onSuccess: (_, variables) => {
      toast.success("Đánh giá của bạn đã được gửi thành công!");
      queryClient.invalidateQueries({ 
        queryKey: placeKeys.detail(variables.placeId),
        exact: true
      });
      queryClient.refetchQueries({
        queryKey: placeKeys.detail(variables.placeId),
        exact: true
      });
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.message || "Không thể gửi đánh giá");
    }
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
