import axios, { AxiosError, AxiosResponse, InternalAxiosRequestConfig } from "axios";
import Cookies from "js-cookie";
import { authService } from "@/features/auth/services/auth-api";

/**
 * Custom Axios Instance
 */
const axiosInstance = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8080/api',
  timeout: 15000,
});

/**
 * Request Interceptor: Attach Token
 */
axiosInstance.interceptors.request.use(
  (config: InternalAxiosRequestConfig) => {
    const token = Cookies.get('access_token');
    if (token && config.headers) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

/**
 * Response Interceptor: Handle Global Errors & Token Refresh
 */
axiosInstance.interceptors.response.use(
  (response: AxiosResponse) => {
    return response;
  },
  async (error: AxiosError) => {
    const originalRequest = error.config as InternalAxiosRequestConfig & { _retry?: boolean };

    // Tránh vòng lặp vô tận nếu API refresh cũng trả về 401
    if (originalRequest.url?.includes('/auth/refresh-token')) {
      return Promise.reject(error);
    }

    // Handle 403 Forbidden (Dynamic Permission Change)
    if (error.response?.status === 403) {
      if (typeof window !== 'undefined') {
        window.location.href = '/403';
      }
      return Promise.reject(error);
    }

    // Handle 401 Unauthorized (Expired Token)
    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;
      
      try {
        const refreshToken = Cookies.get('refresh_token');
        
        // Nếu không có refresh token (là Guest), không tự động redirect
        if (!refreshToken) {
          return Promise.reject(error);
        }

        // Gọi API refresh để lấy access token mới
        const { accessToken, refreshToken: newRefreshToken } = await authService.refresh(refreshToken);
        
        // Cập nhật access token mới
        Cookies.set('access_token', accessToken, { 
          expires: 7, 
          secure: process.env.NODE_ENV === 'production',
          sameSite: 'lax'
        });

        // Cập nhật refresh token mới (nếu có)
        if (newRefreshToken) {
          Cookies.set('refresh_token', newRefreshToken, { 
            expires: 30, 
            secure: process.env.NODE_ENV === 'production',
            sameSite: 'lax'
          });
        }

        // Gửi lại request ban đầu với token mới
        if (originalRequest.headers) {
          originalRequest.headers.Authorization = `Bearer ${accessToken}`;
        }
        return axiosInstance(originalRequest);
        
      } catch (refreshError) {
        // Chỉ redirect nếu thực sự việc refresh thất bại (Token hết hạn hẳn)
        Cookies.remove('access_token');
        Cookies.remove('refresh_token');
        
        // Kiểm tra xem có đang ở trang public không, nếu có thì không cần redirect mạnh
        const isPublicPage = ['/', '/explore', '/events', '/places'].some(path => 
          typeof window !== 'undefined' && window.location.pathname === path
        );

        if (typeof window !== 'undefined' && !isPublicPage) {
          window.location.href = '/401';
        }
        return Promise.reject(refreshError);
      }
    }

    return Promise.reject(error);
  }
);

export default axiosInstance;
