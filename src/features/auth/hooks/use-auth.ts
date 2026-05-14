import { useMutation, useQuery } from "@tanstack/react-query";
import { authService } from "../services/auth-api";
import { useAuthStore } from "@/shared/store/auth-store";
import { useRouter } from "next/navigation";

/**
 * Hook for Login
 */
export const useLogin = () => {
  const setAuth = useAuthStore((state) => state.setAuth);
  const router = useRouter();

  return useMutation({
    mutationFn: authService.login,
    onSuccess: (data) => {
      setAuth(data.user, data.accessToken);
      router.push('/');
      router.refresh();
    },
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
