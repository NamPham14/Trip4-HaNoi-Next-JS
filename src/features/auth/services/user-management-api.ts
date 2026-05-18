import axiosInstance from "@/shared/api/axios-instance";
import { ApiResponse, PageResponse } from "@/shared/types/api";
import { UserManagement, UserUpdateAdminRequest } from "../types/user-management";

export const userManagementService = {
  /**
   * Get list of users with pagination and search
   */
  getUsers: async (params: { keyword?: string; page?: number; size?: number; sort?: string }) => {
    const response = await axiosInstance.get<ApiResponse<PageResponse<UserManagement>>>('/users', {
      params: {
        keyword: params.keyword,
        page: params.page || 1,
        size: params.size || 10,
        sort: params.sort
      }
    });
    return response.data.data;
  },

  /**
   * Update user details (Admin)
   * Supports Multipart/Form-Data for avatar upload
   */
  updateUser: async (data: UserUpdateAdminRequest, file?: File) => {
    const formData = new FormData();
    
    // Send JSON as a plain string
    formData.append('data', JSON.stringify(data));
    
    if (file) {
      formData.append('file', file);
    }
    
    const response = await axiosInstance.put<ApiResponse<void>>('/users', formData);
    return response.data;
  },

  /**
   * Deactivate user (Soft delete)
   */
  deleteUser: async (id: number) => {
    const response = await axiosInstance.delete<ApiResponse<void>>(`/users/${id}`);
    return response.data;
  }
};
