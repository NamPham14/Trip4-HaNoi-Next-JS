import axiosInstance from "@/shared/api/axios-instance";
import { ApiResponse } from "@/shared/types/api";
import { Post, PostCreateRequest } from "../types/post";
import { PageResponse } from "@/shared/types/api";

export const postService = {
  /**
   * Get public feed (APPROVED posts only)
   */
  getPosts: async (page: number = 1, size: number = 10) => {
    const response = await axiosInstance.get<ApiResponse<PageResponse<Post>>>('/posts', {
      params: { page, size }
    });
    return response.data.data;
  },

  /**
   * Get post details
   */
  getPostById: async (id: number) => {
    const response = await axiosInstance.get<ApiResponse<Post>>(`/posts/${id}`);
    return response.data.data;
  },

  /**
   * Create new post
   */
  createPost: async (data: PostCreateRequest, images?: File[]) => {
    const formData = new FormData();
    formData.append('data', new Blob([JSON.stringify(data)], { type: 'application/json' }));
    
    if (images && images.length > 0) {
      images.forEach(file => formData.append('images', file));
    }
    
    const response = await axiosInstance.post<ApiResponse<Post>>('/posts', formData);
    return response.data;
  },

  /**
   * Toggle like on a post
   */
  toggleLike: async (id: number) => {
    const response = await axiosInstance.post<ApiResponse<void>>(`/posts/${id}/like`);
    return response.data;
  },

  /**
   * Get my posts
   */
  getMyPosts: async () => {
    const response = await axiosInstance.get<ApiResponse<Post[]>>('/posts/me');
    return response.data.data;
  }
};
