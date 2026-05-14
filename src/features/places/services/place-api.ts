import axiosInstance from "@/shared/api/axios-instance";
import { ApiResponse, PageResponse } from "@/shared/types/api";
import { Place, PlaceDetailResponse, PlaceFilterParams } from "../types/place";

/**
 * Service for fetching place data
 */
export const placeService = {
  /**
   * Search and filter places
   */
  getPlaces: async (params: PlaceFilterParams): Promise<PageResponse<Place>> => {
    // Backend expects page to be 1-indexed (page=1 is first page)
    // Frontend (TanStack Query / Component) uses 0-indexed
    const adjustedParams = {
      ...params,
      page: (params.page !== undefined ? params.page + 1 : 1),
    };
    
    const response = await axiosInstance.get<ApiResponse<PageResponse<Place>>>('/places/search', { 
      params: adjustedParams 
    });
    return response.data.data;
  },

  /**
   * Get detail of a specific place
   */
  getPlaceById: async (id: string | number, userLat?: number, userLng?: number): Promise<PlaceDetailResponse> => {
    const response = await axiosInstance.get<ApiResponse<PlaceDetailResponse>>(`/places/${id}`, {
      params: { userLat, userLng }
    });
    return response.data.data;
  },

  /**
   * Get personalized recommendations (Redis Cached)
   */
  getRecommendations: async (userLat?: number, userLng?: number): Promise<Place[]> => {
    const response = await axiosInstance.get<ApiResponse<Place[]>>('/recommendations', {
      params: { userLat, userLng }
    });
    return response.data.data;
  }
};
