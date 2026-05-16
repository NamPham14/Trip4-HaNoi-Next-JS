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
  },

  /**
   * Submit a review for a place
   */
  submitReview: async (data: { placeId: number; rating: number; comment: string }): Promise<any> => {
    const response = await axiosInstance.post<ApiResponse<any>>('/reviews', data);
    return response.data.data;
  },

  /**
   * Get reviews written by the current user
   */
  getMyReviews: async (): Promise<any[]> => {
    const response = await axiosInstance.get<ApiResponse<any[]>>('/reviews/my');
    return response.data.data;
  },

  /**
   * Toggle favorite status of a place
   */
  toggleFavorite: async (placeId: number): Promise<any> => {
    const response = await axiosInstance.post<ApiResponse<any>>(`/saved-places/${placeId}`);
    return response.data.data;
  },

  /**
   * Check if a place is favorited by the current user
   */
  checkFavoriteStatus: async (placeId: number): Promise<boolean> => {
    const response = await axiosInstance.get<ApiResponse<boolean>>(`/saved-places/check/${placeId}`);
    return response.data.data;
  },

  /**
   * Get favorited places for the current user
   */
  getSavedPlaces: async (): Promise<any[]> => {
    const response = await axiosInstance.get<ApiResponse<any[]>>('/saved-places/my');
    return response.data.data;
  }
};
