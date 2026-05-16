import axios, { AxiosError, AxiosResponse, InternalAxiosRequestConfig } from "axios";
import Cookies from "js-cookie";

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
    // Backend usually wraps data in 'result'
    return response;
  },
  async (error: AxiosError) => {
    const originalRequest = error.config as InternalAxiosRequestConfig & { _retry?: boolean };

    // Handle 401 Unauthorized (Expired Token)
    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;
      
      // TODO: Implement Refresh Token Logic here
      // const refreshToken = Cookies.get('refresh_token');
      // if (refreshToken) { ... }
      
      // For now, just clear cookies and redirect if 401
      Cookies.remove('access_token');
      if (typeof window !== 'undefined') {
        window.location.href = '/login';
      }
    }

    return Promise.reject(error);
  }
);

export default axiosInstance;
