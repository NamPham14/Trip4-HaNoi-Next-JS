import axiosInstance from "@/shared/api/axios-instance";
import { ApiResponse, PageResponse } from "@/shared/types/api";
import { Review, ReviewFilterParams } from "../types/review";

export const reviewService = {
  /**
   * ADMIN: Get all reviews with pagination and filtering
   */
  getAllReviews: async (params: ReviewFilterParams): Promise<PageResponse<Review>> => {
    const response = await axiosInstance.get<ApiResponse<PageResponse<Review>>>('/reviews/admin', {
      params: {
        ...params,
        page: params.page || 1,
        size: params.size || 10
      }
    });
    return response.data.data;
  },

  /**
   * ADMIN/USER: Delete a review
   */
  deleteReview: async (id: number): Promise<void> => {
    await axiosInstance.delete(`/reviews/${id}`);
  },

  /**
   * USER: Get reviews for a specific place
   */
  getReviewsByPlace: async (placeId: number): Promise<Review[]> => {
    const response = await axiosInstance.get<ApiResponse<Review[]>>(`/reviews/place/${placeId}`);
    return response.data.data;
  },

  /**
   * USER: Submit a new review
   */
  submitReview: async (data: { placeId: number; rating: number; comment: string }): Promise<Review> => {
    const response = await axiosInstance.post<ApiResponse<Review>>('/reviews', data);
    return response.data.data;
  }
};
