/* eslint-disable @typescript-eslint/no-explicit-any */
import axiosInstance from "@/shared/api/axios-instance";
import { ApiResponse } from "@/shared/types/api";
import { Itinerary, CreateItineraryRequest, UpdateFullItineraryRequest } from "../types/itinerary";

export const itineraryService = {
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
  }
};
