/* eslint-disable @typescript-eslint/no-explicit-any */
import axiosInstance from "@/shared/api/axios-instance";
import { ApiResponse } from "@/shared/types/api";
import { User } from "../types/auth";

export interface UserUpdateRequest {
  id: number;
  username?: string;
  avatar?: string;
  nationality?: string;
  language?: string;
  password?: string;
}

export const userService = {
  /**
   * Update user profile
   * Sends data as multipart/form-data to support avatar upload
   */
  updateProfile: async (data: UserUpdateRequest, file?: File): Promise<void> => {
    const formData = new FormData();
    
    // Send JSON as a plain string
    formData.append('data', JSON.stringify(data));
    
    if (file) {
      formData.append('file', file);
    }
    
    // Important: Do not set Content-Type header manually for FormData
    await axiosInstance.put<ApiResponse<void>>('/users', formData);
  },

  /**
   * Change password
   */
  changePassword: async (data: any): Promise<void> => {
    await axiosInstance.put<ApiResponse<void>>('/users/change-password', data);
  }
};
