"use client";

/* eslint-disable @typescript-eslint/no-explicit-any */
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { eventService } from "../services/event-api";
import { toast } from "sonner";

/**
 * Query Keys for Events
 */
export const eventKeys = {
  all: ['events'] as const,
  lists: () => [...eventKeys.all, 'list'] as const,
  list: (params: any) => [...eventKeys.lists(), params] as const,
  detail: (id: string | number) => [...eventKeys.all, 'detail', String(id)] as const,
};

/**
 * Hook for fetching all events
 */
export const useEvents = (params: { 
  keyword?: string; 
  placeId?: number; 
  page?: number; 
  size?: number 
}) => {
  return useQuery({
    queryKey: eventKeys.list(params),
    queryFn: () => eventService.getEvents(params),
    staleTime: 5 * 60 * 1000,
  });
};

/**
 * Hook for fetching event detail
 */
export const useEventDetail = (id: string | number) => {
  return useQuery({
    queryKey: eventKeys.detail(id),
    queryFn: () => eventService.getEventById(id),
    enabled: !!id,
    staleTime: 5 * 60 * 1000,
  });
};

/**
 * Hook for following an event
 */
export const useFollowEvent = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (eventId: number) => eventService.followEvent(eventId),
    onSuccess: (_, eventId) => {
      toast.success("Đã theo dõi sự kiện!");
      queryClient.invalidateQueries({ queryKey: eventKeys.detail(eventId) });
      queryClient.invalidateQueries({ queryKey: eventKeys.lists() });
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.message || "Không thể theo dõi sự kiện");
    }
  });
};

/**
 * Hook for unfollowing an event
 */
export const useUnfollowEvent = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (eventId: number | string) => eventService.unfollowEvent(eventId),
    onSuccess: (_, eventId) => {
      toast.success("Đã bỏ theo dõi sự kiện");
      queryClient.invalidateQueries({ queryKey: eventKeys.detail(eventId) });
      queryClient.invalidateQueries({ queryKey: eventKeys.lists() });
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.message || "Không thể bỏ theo dõi");
    }
  });
};
