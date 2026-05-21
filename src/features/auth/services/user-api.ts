import axiosInstance from "@/shared/api/axios-instance";
import { ApiResponse } from "@/shared/types/api";

export interface ChangePasswordRequest {
  oldPassword: String;
  newPassword: String;
}

export interface UserUpdateRequest {
  id?: number;
  username?: string;
  email?: string;
  avatar?: string;
  password?: string;
  isLocationTrackingEnabled?: boolean;
  roles?: string[];
}

export const userService = {
  /**
   * Update current user profile
   */
  updateProfile: async (data: UserUpdateRequest, file?: File): Promise<void> => {
    const formData = new FormData();
    formData.append('data', JSON.stringify(data));
    if (file) {
      formData.append('file', file);
    }
    await axiosInstance.put('/users', formData, {
      headers: { 'Content-Type': 'multipart/form-data' }
    });
  },

  /**
   * Change user password
   */
  changePassword: async (data: ChangePasswordRequest): Promise<void> => {
    await axiosInstance.put<ApiResponse<void>>('/users/change-password', data);
  }
};
