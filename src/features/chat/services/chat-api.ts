import axiosInstance from "@/shared/api/axios-instance";
import { ApiResponse } from "@/shared/types/api";
import { ChatResponse } from "../types/chat";

export const chatService = {
  sendMessage: async (message: string): Promise<ChatResponse> => {
    const response = await axiosInstance.post<ApiResponse<ChatResponse>>('/chat', { message });
    return response.data.data;
  }
};
