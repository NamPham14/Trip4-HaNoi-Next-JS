import axiosInstance from "@/shared/api/axios-instance";
import { ApiResponse, PageResponse } from "@/shared/types/api";
import { PostManagement, PostStatus } from "../types/post-management";

export const postManagementService = {
  /**
   * Get list of posts for Admin with filtering
   */
  getPostsAdmin: async (params: { keyword?: string; status?: PostStatus; page?: number; size?: number }) => {
    const response = await axiosInstance.get<ApiResponse<PageResponse<PostManagement>>>('/posts/admin', {
      params: {
        keyword: params.keyword,
        status: params.status,
        page: params.page || 1,
        size: params.size || 10
      }
    });
    return response.data.data;
  },

  /**
   * Update post status (Approve/Reject)
   */
  updateStatus: async (id: number, status: PostStatus) => {
    const response = await axiosInstance.put<ApiResponse<void>>(`/posts/${id}/status`, null, {
      params: { status }
    });
    return response.data;
  },

  /**
   * Delete post
   */
  deletePost: async (id: number) => {
    const response = await axiosInstance.delete<ApiResponse<void>>(`/posts/${id}`);
    return response.data;
  }
};
