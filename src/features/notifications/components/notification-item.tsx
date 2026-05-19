import React from "react";
import { Bell, Eye } from "lucide-react";
import { cn } from "@/shared/lib/utils";
import { DropdownMenuItem } from "@/shared/components/ui/dropdown-menu";
import { Notification } from "../types/notification";
import { usePathname, useRouter } from "next/navigation";
import { useQueryClient } from "@tanstack/react-query";

import { useChatStore } from "@/shared/store/chat-store";

interface NotificationItemProps {
  notification: Notification;
  onMarkAsRead: (id: number) => void;
}

// Helper function to format time
const formatTimeAgo = (dateString: string) => {
  if (!dateString) return "";
  const date = new Date(dateString);
  const now = new Date();
  const diffInSeconds = Math.floor((now.getTime() - date.getTime()) / 1000);

  if (diffInSeconds < 60) return "vừa xong";
  const diffInMinutes = Math.floor(diffInSeconds / 60);
  if (diffInMinutes < 60) return `${diffInMinutes} phút trước`;
  const diffInHours = Math.floor(diffInMinutes / 60);
  if (diffInHours < 24) return `${diffInHours} giờ trước`;
  const diffInDays = Math.floor(diffInHours / 24);
  if (diffInDays < 30) return `${diffInDays} ngày trước`;
  
  return date.toLocaleDateString('vi-VN');
};

export const NotificationItem = ({ notification: n, onMarkAsRead }: NotificationItemProps) => {
  const router = useRouter();
  const pathname = usePathname();
  const queryClient = useQueryClient();
  const openChat = useChatStore((state) => state.openChat);

  const handleAction = () => {
    // Đánh dấu đã đọc trước
    if (n.status === 'UNREAD') {
      onMarkAsRead(n.id);
    }
    
    // Kiểm tra xem đây có phải là thông báo Chat không (ngay cả khi targetUrl bị null)
    const isChatNotification = n.targetUrl?.includes('#chat') || 
                               n.message.toLowerCase().includes('đã trả lời tin nhắn');

    if (isChatNotification) {
      setTimeout(() => {
        openChat("LIVE");
      }, 100);
      
      if (pathname === '/' && !n.targetUrl) return;
    }
    
    // Nếu có targetUrl thì chuyển trang
    if (n.targetUrl) {
      // Nếu đang ở chính trang đó rồi (không tính hash), router.push sẽ không load lại data
      const cleanTarget = n.targetUrl.split('#')[0];
      if (cleanTarget === pathname) {
        queryClient.invalidateQueries();
      }
      router.push(n.targetUrl);
    }
  };

  return (
    <DropdownMenuItem 
      className={cn(
        "rounded-2xl p-3 mb-1 cursor-pointer focus:bg-hanoi-gold/40 flex flex-col gap-2 transition-colors",
        n.status === 'UNREAD' ? "bg-hanoi-gold/10" : "opacity-70"
      )}
      onSelect={handleAction}
    >
      <div className="flex gap-3 w-full text-left">
        <div className={cn(
          "h-10 w-10 rounded-xl flex items-center justify-center shrink-0",
          n.status === 'UNREAD' ? "bg-hanoi-red/10 text-hanoi-red" : "bg-zinc-100 text-zinc-400"
        )}>
          <Bell className="h-5 w-5" />
        </div>
        <div className="flex flex-col gap-0.5 flex-1 overflow-hidden">
          <span className={cn(
            "text-sm leading-tight break-words",
            n.status === 'UNREAD' ? "font-black text-zinc-900" : "font-bold text-zinc-500"
          )}>
            {n.message}
          </span>
          <span className="text-[10px] font-medium text-zinc-400 mt-1">
            {formatTimeAgo(n.createdAt)}
          </span>
        </div>
      </div>
      
      {n.targetUrl && (
        <div className="flex justify-end w-full">
          <div className="flex items-center gap-1 text-[10px] font-black text-hanoi-red bg-hanoi-gold/20 px-3 py-1 rounded-lg">
            <Eye className="h-3 w-3" />
            XEM CHI TIẾT
          </div>
        </div>
      )}
    </DropdownMenuItem>
  );
};
