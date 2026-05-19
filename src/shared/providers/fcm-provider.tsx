/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useEffect } from "react";
import { requestForToken, onMessageListener } from "@/shared/lib/firebase";
import { useUser } from "@/features/auth/hooks/use-auth";
import axiosInstance from "@/shared/api/axios-instance";
import { toast } from "sonner";
import { Bell } from "lucide-react";

export const FcmTokenHandler = () => {
  const { user, isAuthenticated } = useUser();

  useEffect(() => {
    const setupFcm = async () => {
      if (isAuthenticated && user?.id) {
        const token = await requestForToken();
        if (token) {
          try {
            // Gửi token lên Backend để lưu
            // Backend dùng JWT để lấy userId nên không cần truyền userId qua params
            await axiosInstance.post("/notifications/token", null, {
              params: { token: token }
            });
            console.log("FCM Token registered successfully");
          } catch (error) {
            console.error("Failed to register FCM token", error);
          }
        }
      }
    };

    setupFcm();
  }, [isAuthenticated, user?.id]);

  useEffect(() => {
    onMessageListener()
      .then((payload: any) => {
        // Hiển thị thông báo khi người dùng đang mở web (Foreground)
        toast(payload.notification.title, {
          description: payload.notification.body,
          icon: <Bell className="h-4 w-4 text-hanoi-red" />,
          duration: 5000,
        });
      })
      .catch((err) => console.log("failed: ", err));
  });

  return null; // Component này không render UI
};
