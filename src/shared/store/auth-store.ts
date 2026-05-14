import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import Cookies from 'js-cookie';
import { User } from '@/features/auth/types/auth';

interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  setAuth: (user: User, token: string) => void;
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

      setAuth: (user, token) => {
        // Lưu trữ mã thông báo trong cookie cho các trình chặn SSR và API
        Cookies.set('access_token', token, { 
          expires: 7, // 7 days
          secure: process.env.NODE_ENV === 'production',
          sameSite: 'lax'
        });
        set({ user, isAuthenticated: true });
      },

      logout: () => {
        Cookies.remove('access_token');
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
