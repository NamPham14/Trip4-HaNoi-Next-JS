import axiosInstance from "@/shared/api/axios-instance";
import { ApiResponse, PageResponse } from "@/shared/types/api";

export interface Category {
  id: number;
  name: string;
}

export interface CategoryRequest {
  name: string;
}

export const categoryService = {
  getAllCategories: async (params?: { keyword?: string; page?: number; size?: number; sort?: string }) => {
    const response = await axiosInstance.get<ApiResponse<PageResponse<Category>>>('/categories', {
      params: {
        keyword: params?.keyword,
        page: params?.page || 1,
        size: params?.size || 10,
        sort: params?.sort
      }
    });
    return response.data.data;
  },

  getCategoryById: async (id: number) => {
    const response = await axiosInstance.get<ApiResponse<Category>>(`/categories/${id}`);
    return response.data.data;
  },

  createCategory: async (request: CategoryRequest) => {
    const response = await axiosInstance.post<ApiResponse<Category>>('/categories', request);
    return response.data.data;
  },

  updateCategory: async (id: number, request: CategoryRequest) => {
    const response = await axiosInstance.put<ApiResponse<Category>>(`/categories/${id}`, request);
    return response.data.data;
  },

  deleteCategory: async (id: number) => {
    const response = await axiosInstance.delete<ApiResponse<void>>(`/categories/${id}`);
    return response.data;
  }
};
