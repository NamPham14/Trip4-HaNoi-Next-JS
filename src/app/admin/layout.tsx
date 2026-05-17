"use client";

import React, { useEffect } from "react";
import { AdminSidebar } from "./AdminSidebar";
import { useAuthStore } from "@/shared/store/auth-store";
import { Avatar, AvatarFallback, AvatarImage } from "@/shared/components/ui/avatar";
import { Button } from "@/shared/components/ui/button";
import { LogOut, Bell } from "lucide-react";
import { usePathname, useRouter } from "next/navigation";

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { user, logout, isAuthenticated } = useAuthStore();
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
        <header className="h-16 bg-white border-b flex items-center justify-between px-8 sticky top-0 z-10">
          <div className="text-sm text-gray-500">
            Hệ thống quản trị / <span className="text-gray-900 font-medium capitalize">
              {pathname.split("/").filter(Boolean).pop() || "Dashboard"}
            </span>
          </div>
          <div className="flex items-center gap-6">
            <Button variant="ghost" size="icon" className="relative">
              <Bell size={20} />
              <span className="absolute top-2 right-2 w-2 h-2 bg-red-500 rounded-full"></span>
            </Button>
            <div className="flex items-center gap-3">
              <div className="text-right hidden sm:block">
                <p className="text-sm font-semibold">{user?.username || 'Admin'}</p>
                <p className="text-xs text-gray-500 capitalize">{user?.roles?.[0]?.name || 'Administrator'}</p>
              </div>
              <Avatar>
                <AvatarImage src={user?.avatar || ""} />
                <AvatarFallback>{user?.username?.substring(0, 2).toUpperCase() || 'AD'}</AvatarFallback>
              </Avatar>
              <Button variant="ghost" size="icon" onClick={logout}>
                <LogOut size={20} className="text-gray-500" />
              </Button>
            </div>
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
