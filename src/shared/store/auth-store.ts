import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import Cookies from 'js-cookie';
import { User } from '@/features/auth/types/auth';

interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  setAuth: (user: User, accessToken: string, refreshToken: string) => void;
  logout: () => void;
  updateUser: (user: Partial<User>) => void;
}

/**
* Lưu trữ trạng thái xác thực và phiên người dùng
*/
export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      user: null,
      isAuthenticated: false,

      setAuth: (user, accessToken, refreshToken) => {
        // Lưu trữ mã thông báo trong cookie cho các trình chặn SSR và API
        const cookieOptions = { 
          expires: 7, // 7 ngày
          secure: process.env.NODE_ENV === 'production',
          sameSite: 'lax' as const
        };
        
        Cookies.set('access_token', accessToken, cookieOptions);
        Cookies.set('refresh_token', refreshToken, cookieOptions);
        
        set({ user, isAuthenticated: true });
      },

      logout: () => {
        Cookies.remove('access_token');
        Cookies.remove('refresh_token');
        set({ user: null, isAuthenticated: false });
      },

      updateUser: (userData) => {
        set((state) => ({
          user: state.user ? { ...state.user, ...userData } : null
        }));
      }
    }),
    {
      name: 'auth-storage',
      storage: createJSONStorage(() => localStorage), // Lưu trữ thông tin người dùng trong localStorage
      partialize: (state) => ({ user: state.user, isAuthenticated: state.isAuthenticated }),
    }
  )
);
