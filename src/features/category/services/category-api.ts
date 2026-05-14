import axiosInstance from "@/shared/api/axios-instance";
import { ApiResponse, PageResponse } from "@/shared/types/api";

export interface Category {
  id: number;
  name: string;
  description?: string;
}

export const categoryService = {
  getAllCategories: async (): Promise<Category[]> => {
    const response = await axiosInstance.get<ApiResponse<PageResponse<Category>>>('/categories', {
      params: { size: 100 }
    });
    // Backend PageResponse dùng trường 'data' để chứa danh sách
    return response.data.data.data || [];
  }
};
