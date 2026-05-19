"use client";

import React, { useEffect } from "react";
import { AdminSidebar } from "./AdminSidebar";
import { useAuthStore } from "@/shared/store/auth-store";
import { Avatar, AvatarFallback, AvatarImage } from "@/shared/components/ui/avatar";
import { Button } from "@/shared/components/ui/button";
import { LogOut, User as UserIcon, Settings, Layout } from "lucide-react";
import { usePathname, useRouter } from "next/navigation";
import { NotificationDropdown } from "@/features/notifications/components/notification-dropdown";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/shared/components/ui/dropdown-menu";
import Link from "next/link";
import { useLogout } from "@/features/auth/hooks/use-auth";

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { user, isAuthenticated } = useAuthStore();
  const logout = useLogout();
  const pathname = usePathname();
  const router = useRouter();

  // Route Guard: Chỉ Admin mới được vào /admin/roles hoặc /admin/users
  useEffect(() => {
    if (isAuthenticated && user) {
      const isAdmin = user.roles?.some(role => role.name === "ADMIN");
      const isSensitiveRoute = pathname.startsWith("/admin/roles") || pathname.startsWith("/admin/users");
      
      if (isSensitiveRoute && !isAdmin) {
        router.push("/403");
      }
    }
  }, [user, isAuthenticated, pathname, router]);

  return (
    <div className="flex min-h-screen bg-gray-50">
      <AdminSidebar />
      <div className="flex-1 flex flex-col">
        {/* Admin Header */}
        <header className="h-16 bg-white border-b flex items-center justify-between px-8 sticky top-0 z-10 shadow-sm">
          <div className="text-sm text-gray-500">
            Hệ thống quản trị / <span className="text-gray-900 font-medium capitalize">
              {pathname.split("/").filter(Boolean).pop() || "Dashboard"}
            </span>
          </div>
          <div className="flex items-center gap-4">
            <NotificationDropdown />
            
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <button className="flex items-center gap-3 p-1 pr-3 hover:bg-gray-100 rounded-full transition-all outline-none group border border-transparent hover:border-gray-200">
                  <Avatar className="h-8 w-8 border border-gray-200">
                    <AvatarImage src={user?.avatar || ""} />
                    <AvatarFallback className="bg-hanoi-red text-white text-[10px] font-black">
                      {user?.username?.substring(0, 2).toUpperCase() || 'AD'}
                    </AvatarFallback>
                  </Avatar>
                  <div className="text-left hidden sm:block">
                    <p className="text-xs font-black text-gray-900 leading-none">{user?.username || 'Admin'}</p>
                    <p className="text-[10px] font-bold text-gray-400 uppercase tracking-tighter mt-0.5">
                      {user?.roles?.[0]?.name || 'Administrator'}
                    </p>
                  </div>
                </button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-56 mt-2 rounded-2xl p-2 shadow-2xl border-gray-100 bg-white">
                <DropdownMenuLabel className="px-4 py-3">
                  <div className="flex flex-col">
                    <span className="text-[10px] font-black text-gray-400 uppercase tracking-[0.2em]">Quản trị viên</span>
                    <span className="text-sm font-black text-gray-900 truncate">{user?.username}</span>
                  </div>
                </DropdownMenuLabel>
                <DropdownMenuSeparator />
                <Link href="/profile">
                  <DropdownMenuItem className="rounded-xl px-4 py-3 font-bold text-gray-600 hover:text-hanoi-red cursor-pointer transition-colors">
                    <UserIcon className="mr-3 h-4 w-4" />
                    Trang cá nhân
                  </DropdownMenuItem>
                </Link>
                <Link href="/">
                  <DropdownMenuItem className="rounded-xl px-4 py-3 font-bold text-gray-600 hover:text-hanoi-red cursor-pointer transition-colors">
                    <Layout className="mr-3 h-4 w-4" />
                    Về trang chủ
                  </DropdownMenuItem>
                </Link>
                <DropdownMenuSeparator />
                <DropdownMenuItem 
                  onClick={() => logout()}
                  className="rounded-xl px-4 py-3 font-bold text-hanoi-red hover:bg-red-50 cursor-pointer transition-colors"
                >
                  <LogOut className="mr-3 h-4 w-4" />
                  Đăng xuất
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </header>

        {/* Main Content */}
        <main className="flex-1 overflow-x-hidden">
          {children}
        </main>
      </div>
    </div>
  );
}
