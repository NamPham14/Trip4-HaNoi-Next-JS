/* eslint-disable @typescript-eslint/no-explicit-any */
import axiosInstance from "@/shared/api/axios-instance";
import { ApiResponse, PageResponse } from "@/shared/types/api";
import { Itinerary, CreateItineraryRequest, UpdateFullItineraryRequest } from "../types/itinerary";

export const itineraryService = {
  /**
   * ADMIN: Get all itineraries with pagination
   */
  getAllItinerariesAdmin: async (params: { page?: number; size?: number; keyword?: string; isSample?: boolean; status?: string }): Promise<PageResponse<Itinerary>> => {
    const response = await axiosInstance.get<ApiResponse<PageResponse<Itinerary>>>('/itineraries/admin', {
      params: {
        ...params,
        page: params.page || 1,
        size: params.size || 10
      }
    });
    return response.data.data;
  },

  getFeaturedItineraries: async (): Promise<Itinerary[]> => {
    const response = await axiosInstance.get<ApiResponse<Itinerary[]>>('/itineraries/featured');
    return response.data.data;
  },

  getSampleItineraries: async (): Promise<Itinerary[]> => {
    const response = await axiosInstance.get<ApiResponse<Itinerary[]>>('/itineraries/samples');
    return response.data.data;
  },

  getMyItineraries: async (): Promise<Itinerary[]> => {
    const response = await axiosInstance.get<ApiResponse<Itinerary[]>>('/itineraries/my');
    return response.data.data;
  },

  createItinerary: async (data: CreateItineraryRequest): Promise<Itinerary> => {
    const response = await axiosInstance.post<ApiResponse<Itinerary>>('/itineraries/create', data);
    return response.data.data;
  },

  updateFullItinerary: async (data: UpdateFullItineraryRequest): Promise<Itinerary> => {
    const response = await axiosInstance.put<ApiResponse<Itinerary>>('/itineraries/update-full', data);
    return response.data.data;
  },

  updateItinerary: async (id: number, data: Partial<CreateItineraryRequest>): Promise<Itinerary> => {
    const response = await axiosInstance.put<ApiResponse<Itinerary>>(`/itineraries/update-itinerary/${id}`, data);
    return response.data.data;
  },

  saveAIItinerary: async (title: string, timeline: any[]): Promise<Itinerary> => {
    const response = await axiosInstance.post<ApiResponse<Itinerary>>('/itineraries/save-ai', { title, timeline });
    return response.data.data;
  },

  getItineraryDetail: async (id: number): Promise<Itinerary> => {
    const response = await axiosInstance.get<ApiResponse<Itinerary>>(`/itineraries/detail/${id}`);
    return response.data.data;
  },

  deleteItinerary: async (id: number): Promise<void> => {
    await axiosInstance.delete(`/itineraries/remove-itinerary/${id}`);
  },

  addPlaceToItinerary: async (data: { itineraryId: number, placeId: number, dayNumber: number }): Promise<Itinerary> => {
    const response = await axiosInstance.post<ApiResponse<Itinerary>>('/itineraries/add-place', data);
    return response.data.data;
  }
};
