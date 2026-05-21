import axiosInstance from "@/shared/api/axios-instance";
import { ApiResponse } from "@/shared/types/api";
import { AuthResponse, LoginRequest, RegisterRequest, User } from "../types/auth";

/**
 * Authentication Service
 */
export const authService = {
  /**
   * Login with email/password
   */
  login: async (data: LoginRequest): Promise<AuthResponse> => {
    const response = await axiosInstance.post<ApiResponse<AuthResponse>>('/auth/login', data);
    return response.data.data;
  },

  /**
   * Login with Google
   */
  loginGoogle: async (idToken: string): Promise<AuthResponse> => {
    const response = await axiosInstance.post<ApiResponse<AuthResponse>>('/auth/login-google', { idToken });
    return response.data.data;
  },

  /**
   * Register a new account
   * Note: Backend uses /api/users (POST) with multipart/form-data
   */
  register: async (data: RegisterRequest): Promise<User> => {
    const formData = new FormData();
    
    // Create the 'data' part as a Blob with application/json type
    const jsonBlob = new Blob([JSON.stringify(data)], { type: 'application/json' });
    formData.append('data', jsonBlob);
    
    const response = await axiosInstance.post<ApiResponse<User>>('/users', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return response.data.data;
  },

  /**
   * Get current user profile
   */
  getMe: async (): Promise<User> => {
    const response = await axiosInstance.get<ApiResponse<User>>('/users/me');
    return response.data.data;
  },

  /**
   * Introspect token validity
   */
  introspect: async (token: string): Promise<boolean> => {
    const response = await axiosInstance.post<ApiResponse<{ valid: boolean }>>('/auth/introspect', { token });
    return response.data.data.valid;
  },

  /**
   * Refresh access token
   */
  refresh: async (refreshToken: string): Promise<AuthResponse> => {
    const response = await axiosInstance.post<ApiResponse<AuthResponse>>('/auth/refresh-token', { refreshToken });
    return response.data.data;
  }
};
