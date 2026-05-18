import axiosInstance from "@/shared/api/axios-instance";
import { ApiResponse, PageResponse } from "@/shared/types/api";

export interface Comment {
  id: number;
  postId: number;
  userId: number;
  username: string;
  avatar?: string;
  content: string;
  createdAt: string;
}

export interface CommentRequest {
  postId: number;
  content: string;
}

export const commentService = {
  getCommentsByPost: async (postId: number, page: number = 1, size: number = 10) => {
    const response = await axiosInstance.get<ApiResponse<PageResponse<Comment>>>(
      `/comments/post/${postId}`,
      {
        params: { page, size },
      }
    );
    return response.data.data;
  },

  createComment: async (request: CommentRequest) => {
    const response = await axiosInstance.post<ApiResponse<Comment>>("/comments", request);
    return response.data.data;
  },

  getAllComments: async (page: number = 1, size: number = 10) => {
    const response = await axiosInstance.get<ApiResponse<PageResponse<Comment>>>(
      "/comments",
      {
        params: { page, size },
      }
    );
    return response.data.data;
  },

  deleteComment: async (id: number) => {
    await axiosInstance.delete<ApiResponse<void>>(`/comments/${id}`);
  },
};
