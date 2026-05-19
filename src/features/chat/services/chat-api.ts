import axiosInstance from "@/shared/api/axios-instance";
import { ApiResponse } from "@/shared/types/api";
import { ChatAIResponse, ChatMessageResponse, ChatRoomResponse, ChatRoomStatus } from "../types/chat";

export const chatService = {
  // AI Chat
  sendMessage: async (message: string): Promise<ChatAIResponse> => {
    const response = await axiosInstance.post<ApiResponse<ChatAIResponse>>('/chat', { message });
    return response.data.data;
  },

  // Staff/Admin APIs
  getRooms: async (status: ChatRoomStatus): Promise<ChatRoomResponse[]> => {
    const response = await axiosInstance.get<ApiResponse<ChatRoomResponse[]>>(`/chat/rooms?status=${status}`);
    return response.data.data;
  },

  getChatHistory: async (roomId: number): Promise<ChatMessageResponse[]> => {
    const response = await axiosInstance.get<ApiResponse<ChatMessageResponse[]>>(`/chat/rooms/${roomId}/messages`);
    return response.data.data;
  },

  getMyActiveRoom: async (): Promise<ChatRoomResponse | null> => {
    const response = await axiosInstance.get<ApiResponse<ChatRoomResponse>>('/chat/my-room');
    return response.data.data;
  }
};
