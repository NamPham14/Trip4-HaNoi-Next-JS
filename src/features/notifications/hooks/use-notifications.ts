/* eslint-disable @typescript-eslint/no-explicit-any */
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { notificationService } from "../services/notification-api";
import { useUser } from "@/features/auth/hooks/use-auth";

export const useNotifications = () => {
  const { user, isAuthenticated } = useUser();
  const queryClient = useQueryClient();

  // Query lấy danh sách thông báo
  const { data: notifications = [], isLoading } = useQuery({
    queryKey: ["notifications", user?.id],
    queryFn: () => (user?.id ? notificationService.getNotificationsByUserId(Number(user.id)) : []),
    enabled: isAuthenticated && !!user?.id,
    refetchInterval: 5000, // Cập nhật nhanh hơn (5 giây/lần)
  });

  // Mutation đánh dấu một tin là đã đọc
  const markAsReadMutation = useMutation({
    mutationFn: notificationService.markAsRead,
    onMutate: async (id) => {
      await queryClient.cancelQueries({ queryKey: ["notifications", user?.id] });
      const previousNotifications = queryClient.getQueryData(["notifications", user?.id]);
      
      queryClient.setQueryData(["notifications", user?.id], (old: any) => {
        return old?.map((n: any) => n.id === id ? { ...n, status: 'READ' } : n);
      });

      return { previousNotifications };
    },
    onError: (err, id, context: any) => {
      queryClient.setQueryData(["notifications", user?.id], context.previousNotifications);
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ["notifications", user?.id] });
    },
  });

  // Mutation đánh dấu tất cả là đã đọc
  const markAllAsReadMutation = useMutation({
    mutationFn: () => (user?.id ? notificationService.markAllAsRead(Number(user.id)) : Promise.resolve()),
    onMutate: async () => {
      await queryClient.cancelQueries({ queryKey: ["notifications", user?.id] });
      const previousNotifications = queryClient.getQueryData(["notifications", user?.id]);
      
      queryClient.setQueryData(["notifications", user?.id], (old: any) => {
        return old?.map((n: any) => ({ ...n, status: 'READ' }));
      });

      return { previousNotifications };
    },
    onError: (err, variables, context: any) => {
      queryClient.setQueryData(["notifications", user?.id], context.previousNotifications);
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ["notifications", user?.id] });
    },
  });

  // Tính số lượng thông báo chưa đọc
  const unreadCount = notifications.filter((n) => n.status === "UNREAD").length;

  return {
    notifications,
    isLoading,
    unreadCount,
    markAsRead: markAsReadMutation.mutate,
    markAllAsRead: markAllAsReadMutation.mutate,
  };
};
