import axiosInstance from "@/shared/api/axios-instance";
import { ApiResponse, PageResponse } from "@/shared/types/api";
import { Event } from "../types/event";

export const eventService = {
  /**
   * Get all events with filtering and pagination (for Admin)
   */
  getEventsAdmin: async (params: {
    keyword?: string;
    placeId?: number;
    page?: number;
    size?: number;
  }): Promise<PageResponse<Event>> => {
    const response = await axiosInstance.get<ApiResponse<PageResponse<Event>>>('/events/admin', {
      params: {
        keyword: params.keyword,
        placeId: params.placeId,
        page: params.page || 1,
        size: params.size || 10
      }
    });
    return response.data.data;
  },

  /**
   * Get all events with filtering and pagination (for User)
   */
  getEvents: async (params: {
    keyword?: string;
    placeId?: number;
    page?: number;
    size?: number;
  }): Promise<PageResponse<Event>> => {
    const response = await axiosInstance.get<ApiResponse<PageResponse<Event>>>('/events', {
      params: {
        keyword: params.keyword,
        placeId: params.placeId,
        page: params.page || 1,
        size: params.size || 10
      }
    });
    return response.data.data;
  },

  /**
   * Get event details by ID
   */
  getEventById: async (id: number | string): Promise<Event> => {
    const response = await axiosInstance.get<ApiResponse<Event>>(`/events/${id}`);
    return response.data.data;
  },

  /**
   * Create a new event with images
   */
  createEvent: async (formData: FormData): Promise<Event> => {
    const response = await axiosInstance.post<ApiResponse<Event>>('/events', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return response.data.data;
  },

  /**
   * Update an existing event with images
   */
  updateEvent: async (id: number, formData: FormData): Promise<Event> => {
    const response = await axiosInstance.put<ApiResponse<Event>>(`/events/${id}`, formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return response.data.data;
  },

  /**
   * Delete an event (soft delete)
   */
  deleteEvent: async (id: number): Promise<ApiResponse<void>> => {
    const response = await axiosInstance.delete<ApiResponse<void>>(`/events/${id}`);
    return response.data;
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
