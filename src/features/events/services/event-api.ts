import axiosInstance from "@/shared/api/axios-instance";
import { ApiResponse, PageResponse } from "@/shared/types/api";
import { Event, EventResponse } from "../types/event";

/**
 * Service for fetching event data
 */
export const eventService = {
  /**
   * Get all events with filtering and pagination
   */
  getEvents: async (params: { 
    keyword?: string; 
    placeId?: number; 
    page?: number; 
    size?: number 
  }): Promise<PageResponse<Event>> => {
    // Backend expects page starting from 1
    const adjustedParams = {
      ...params,
      page: (params.page !== undefined ? params.page + 1 : 1),
      size: params.size || 10
    };
    
    const response = await axiosInstance.get<ApiResponse<PageResponse<Event>>>('/events', { 
      params: adjustedParams 
    });
    return response.data.data;
  },

  /**
   * Get event details by ID
   * Note: This might require BE support if not exists. 
   * Falling back to filtering from list if necessary, but assuming standard REST.
   */
  getEventById: async (id: number | string): Promise<Event> => {
    const response = await axiosInstance.get<ApiResponse<Event>>(`/events/${id}`);
    return response.data.data;
  },

  /**
   * Follow an event
   */
  followEvent: async (eventId: number): Promise<string> => {
    const response = await axiosInstance.post<ApiResponse<string>>('/events/follow', { eventId });
    return response.data.data;
  },

  /**
   * Unfollow an event
   */
  unfollowEvent: async (eventId: number | string): Promise<string> => {
    const response = await axiosInstance.delete<ApiResponse<string>>(`/events/${eventId}/unfollow`);
    return response.data.data;
  }
};
