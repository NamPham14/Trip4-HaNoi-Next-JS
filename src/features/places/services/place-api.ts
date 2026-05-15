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
    // Backend mong đợi trang được đánh số từ 1 (trang=1 là trang đầu tiên)
    // Frontend (Truy vấn/Thành phần TanStack) sử dụng chỉ số từ 0
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
