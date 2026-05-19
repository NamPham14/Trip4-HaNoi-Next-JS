"use client";

import React, { useState } from "react";
import { Bell } from "lucide-react";
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuItem, 
  DropdownMenuLabel, 
  DropdownMenuSeparator, 
  DropdownMenuTrigger 
} from "@/shared/components/ui/dropdown-menu";
import { Button } from "@/shared/components/ui/button";
import { cn } from "@/shared/lib/utils";
import { useNotifications } from "../hooks/use-notifications";
import { NotificationItem } from "./notification-item";

export const NotificationDropdown = () => {
  const { notifications, unreadCount, markAsRead, markAllAsRead } = useNotifications();
  const [isExpanded, setIsExpanded] = useState(false);

  const displayedNotifications = isExpanded ? notifications : notifications.slice(0, 3);

  return (
    <DropdownMenu onOpenChange={(open) => !open && setIsExpanded(false)}>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" size="icon" className="relative text-zinc-600 hover:bg-hanoi-gold/30 rounded-full h-10 w-10 transition-colors">
          <Bell className="h-5 w-5" />
          {unreadCount > 0 && (
            <span className="absolute top-2 right-2 h-2 w-2 bg-hanoi-red rounded-full border-2 border-hanoi-cream animate-pulse" />
          )}
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-85 mt-2 rounded-3xl p-2 shadow-2xl border-hanoi-gold/20 bg-hanoi-cream/95 backdrop-blur-xl">
        <DropdownMenuLabel className="px-4 py-3 flex items-center justify-between">
          <div className="flex flex-col">
            <span className="text-sm font-black text-hanoi-red uppercase">Thông báo</span>
            {unreadCount > 0 && (
              <span className="text-[10px] font-bold text-zinc-500">{unreadCount} tin mới chưa đọc</span>
            )}
          </div>
          {unreadCount > 0 && (
            <Button 
              variant="ghost" 
              size="sm" 
              className="text-[10px] font-bold text-hanoi-red h-7 px-2 hover:bg-hanoi-gold/20 rounded-lg"
              onClick={() => markAllAsRead()}
            >
              Đánh dấu tất cả đã đọc
            </Button>
          )}
        </DropdownMenuLabel>
        <DropdownMenuSeparator className="bg-hanoi-gold/20" />
        <div className={cn(
          "max-h-[400px] overflow-y-auto custom-scrollbar pr-1",
          isExpanded && "overflow-y-scroll"
        )}>
          {notifications.length === 0 ? (
            <div className="p-8 text-center text-zinc-400 text-xs font-medium italic">
              Bạn chưa có thông báo nào
            </div>
          ) : (
            displayedNotifications.map((n) => (
              <NotificationItem 
                key={n.id} 
                notification={n} 
                onMarkAsRead={markAsRead} 
              />
            ))
          )}
        </div>
        
        {notifications.length > 3 && !isExpanded && (
          <>
            <DropdownMenuSeparator className="bg-hanoi-gold/20" />
            <Button 
              variant="ghost" 
              className="w-full text-xs font-bold text-hanoi-red hover:bg-hanoi-gold/40 rounded-xl py-2 transition-colors"
              onClick={(e) => {
                e.preventDefault();
                setIsExpanded(true);
              }}
            >
              Xem tất cả thông báo
            </Button>
          </>
        )}
      </DropdownMenuContent>
    </DropdownMenu>
  );
};
