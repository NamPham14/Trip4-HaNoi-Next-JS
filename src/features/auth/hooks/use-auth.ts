/* eslint-disable @typescript-eslint/no-explicit-any */
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { authService } from "../services/auth-api";
import { userService, UserUpdateRequest } from "../services/user-api";
import { useAuthStore } from "@/shared/store/auth-store";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { socketService } from "@/features/chat/services/socket-service";

/**
 * Hook for Login
 */
export const useLogin = () => {
  const setAuth = useAuthStore((state) => state.setAuth);
  const router = useRouter();

  return useMutation({
    mutationFn: authService.login,
    onSuccess: (data) => {
      // Lưu auth vào store và cookie
      setAuth(data.user, data.accessToken, data.refreshToken);
      
      // Kiểm tra role để điều hướng
      const isAdmin = data.user.roles.some(role => role.name === 'ADMIN');
      const isStaff = data.user.roles.some(role => role.name === 'STAFF');
      
      if (isAdmin || isStaff) {
        toast.success(`Chào mừng ${isAdmin ? 'Admin' : 'Nhân viên'} quay trở lại!`);
        router.push('/admin');
      } else {
        toast.success("Đăng nhập thành công!");
        router.push('/');
      }
      
      router.refresh();
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.message || "Đăng nhập thất bại. Vui lòng kiểm tra lại thông tin.");
    }
  });
};

/**
 * Hook for Google Login
 */
export const useGoogleLoginHook = () => {
  const setAuth = useAuthStore((state) => state.setAuth);
  const router = useRouter();

  return useMutation({
    mutationFn: authService.loginGoogle,
    onSuccess: (data) => {
      setAuth(data.user, data.accessToken, data.refreshToken);
      
      const isAdmin = data.user.roles.some(role => role.name === 'ADMIN');
      const isStaff = data.user.roles.some(role => role.name === 'STAFF');
      
      if (isAdmin || isStaff) {
        toast.success(`Chào mừng ${isAdmin ? 'Admin' : 'Nhân viên'} quay trở lại!`);
        router.push('/admin');
      } else {
        toast.success("Đăng nhập bằng Google thành công!");
        router.push('/');
      }
      
      router.refresh();
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.message || "Đăng nhập Google thất bại.");
    }
  });
};

/**
 * Hook for Registration
 */
export const useRegister = () => {
  const router = useRouter();

  return useMutation({
    mutationFn: authService.register,
    onSuccess: () => {
      router.push('/login');
    },
  });
};

/**
 * Hook for Logout
 */
export const useLogout = () => {
  const logout = useAuthStore((state) => state.logout);
  const router = useRouter();

  return () => {
    socketService.disconnect();
    logout();
    router.push('/login');
    router.refresh();
  };
};

/**
 * Hook to get current user session
 */
export const useUser = () => {
  const { user, isAuthenticated } = useAuthStore();
  
  return {
    user,
    isAuthenticated,
    isAdmin: user?.roles.some(role => role.name === 'ADMIN'),
  };
};

/**
 * Hook to fetch my info from server
 */
export const useMyInfo = () => {
  const updateUser = useAuthStore((state) => state.updateUser);
  
  return useQuery({
    queryKey: ['me'],
    queryFn: async () => {
      const data = await authService.getMe();
      updateUser(data);
      return data;
    },
    staleTime: 5 * 60 * 1000,
  });
};

/**
 * Hook to update profile
 */
export const useUpdateProfile = () => {
  const queryClient = useQueryClient();
  const updateUser = useAuthStore((state) => state.updateUser);

  return useMutation({
    mutationFn: (variables: { data: UserUpdateRequest; file?: File }) => 
      userService.updateProfile(variables.data, variables.file),
    onSuccess: async () => {
      toast.success("Cập nhật thông tin thành công!");
      const updatedUser = await authService.getMe();
      updateUser(updatedUser);
      queryClient.invalidateQueries({ queryKey: ['me'] });
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.message || "Cập nhật thất bại");
    }
  });
};
