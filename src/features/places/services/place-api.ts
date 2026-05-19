/* eslint-disable @typescript-eslint/no-explicit-any */
import axiosInstance from "@/shared/api/axios-instance";
import { ApiResponse, PageResponse } from "@/shared/types/api";
import { Place, PlaceDetailResponse, PlaceFilterParams } from "../types/place";

/**
 * Service for fetching place data
 */
export const placeService = {
  /**
   * Get list of all places (Basic info)
   */
  getPlacesList: async (categoryId?: number): Promise<Place[]> => {
    const response = await axiosInstance.get<ApiResponse<Place[]>>('/places', {
      params: { categoryId }
    });
    return response.data.data;
  },

  /**
   * Search and filter places (For Users)
   */
  getPlaces: async (params: PlaceFilterParams): Promise<PageResponse<Place>> => {
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
   * ADMIN: Get all places for admin dashboard
   */
  getPlacesAdmin: async (params: {
    keyword?: string;
    categoryId?: number;
    district?: string;
    page?: number;
    size?: number;
    sort?: string;
  }): Promise<PageResponse<Place>> => {
    const response = await axiosInstance.get<ApiResponse<PageResponse<Place>>>('/places/admin', {
      params: {
        ...params,
        page: params.page || 1,
        size: params.size || 10
      }
    });
    return response.data.data;
  },

  /**
   * ADMIN: Create a new place
   */
  createPlace: async (formData: FormData): Promise<Place> => {
    const response = await axiosInstance.post<ApiResponse<Place>>('/places', formData, {
      headers: { 'Content-Type': 'multipart/form-data' }
    });
    return response.data.data;
  },

  /**
   * ADMIN: Update an existing place
   */
  updatePlace: async (id: number, formData: FormData): Promise<Place> => {
    const response = await axiosInstance.put<ApiResponse<Place>>(`/places/${id}`, formData, {
      headers: { 'Content-Type': 'multipart/form-data' }
    });
    return response.data.data;
  },

  /**
   * ADMIN: Delete a place (soft delete)
   */
  deletePlace: async (id: number): Promise<ApiResponse<void>> => {
    const response = await axiosInstance.delete<ApiResponse<void>>(`/places/${id}`);
    return response.data;
  },

  // ... (User related methods like recommendations, reviews, favorites)
  getRecommendations: async (userLat?: number, userLng?: number, limit: number = 6): Promise<Place[]> => {
    const response = await axiosInstance.get<ApiResponse<Place[]>>('/recommendations', {
      params: { userLat, userLng, limit }
    });
    return response.data.data;
  },

  submitReview: async (data: { placeId: number; rating: number; comment: string }): Promise<any> => {
    const response = await axiosInstance.post<ApiResponse<any>>('/reviews', data);
    return response.data.data;
  },

  getMyReviews: async (): Promise<any[]> => {
    const response = await axiosInstance.get<ApiResponse<any[]>>('/reviews/my');
    return response.data.data;
  },

  toggleFavorite: async (placeId: number): Promise<any> => {
    const response = await axiosInstance.post<ApiResponse<any>>(`/saved-places/${placeId}`);
    return response.data.data;
  },

  checkFavoriteStatus: async (placeId: number): Promise<boolean> => {
    const response = await axiosInstance.get<ApiResponse<boolean>>(`/saved-places/check/${placeId}`);
    return response.data.data;
  },

  getSavedPlaces: async (): Promise<any[]> => {
    const response = await axiosInstance.get<ApiResponse<any[]>>('/saved-places/my');
    return response.data.data;
  },

  deleteReview: async (reviewId: number): Promise<void> => {
    await axiosInstance.delete(`/reviews/${reviewId}`);
  }
};
