import axiosInstance from "@/shared/api/axios-instance";
import { ApiResponse } from "@/shared/types/api";
import { Notification } from "../types/notification";

export const notificationService = {
  /**
   * Lấy danh sách thông báo của user
   */
  getNotificationsByUserId: async (userId: number): Promise<Notification[]> => {
    const response = await axiosInstance.get<ApiResponse<Notification[]>>(`/notifications/user/${userId}`);
    return response.data.data;
  },

  /**
   * Đánh dấu thông báo là đã đọc
   */
  markAsRead: async (id: number): Promise<void> => {
    await axiosInstance.patch<ApiResponse<void>>(`/notifications/${id}/read`);
  },

  /**
   * Đánh dấu tất cả thông báo là đã đọc
   */
  markAllAsRead: async (userId: number): Promise<void> => {
    await axiosInstance.patch<ApiResponse<void>>(`/notifications/user/${userId}/read-all`);
  }
};
