"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { 
  MapPin, 
  Sparkles, 
  LogOut, 
  User as UserIcon, 
  Menu, 
  X, 
  Bookmark, 
  Heart, 
  Bell,
  Calendar,
  Compass,
  History,
  MessageSquare,
  Crown
} from "lucide-react";
import { useUser, useLogout } from "@/features/auth/hooks/use-auth";
import { Button } from "@/shared/components/ui/button";
import { cn } from "@/shared/lib/utils";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/shared/components/ui/dropdown-menu";
import { WeatherWidget } from "./WeatherWidget";
import { Avatar, AvatarFallback, AvatarImage } from "@/shared/components/ui/avatar";

import { NotificationDropdown } from "@/features/notifications/components/notification-dropdown";

export const Navbar = () => {
  const { user, isAuthenticated } = useUser();
  const logout = useLogout();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    if (isMenuOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isMenuOpen]);

  return (
    <nav className={cn(
      "sticky top-0 z-[100] w-full transition-all duration-500",
      isMenuOpen 
        ? "bg-hanoi-cream opacity-100 shadow-none" 
        : (isScrolled 
            ? "bg-hanoi-cream/80 backdrop-blur-xl border-b border-hanoi-gold/30 shadow-sm py-2" 
            : "bg-transparent py-4")
    )}>
      <div className="container mx-auto px-4 flex items-center justify-between relative z-[110]">
        {/* Left: Logo */}
        <Link href="/" className="flex items-center gap-2 group">
          <div className="relative">
            <div className="bg-hanoi-red p-2 rounded-xl shadow-lg shadow-hanoi-red/20 transform group-hover:rotate-12 transition-transform duration-300">
              <MapPin className="h-5 w-5 text-hanoi-cream" />
            </div>
            <div className="absolute -top-1 -right-1 h-3 w-3 bg-hanoi-gold rounded-full border-2 border-hanoi-cream animate-pulse" />
          </div>
          <div className="flex flex-col leading-none">
            <span className="text-xl font-black text-hanoi-red tracking-tighter uppercase">Trip4Hanoi</span>
            <span className="text-[10px] font-bold text-hanoi-red/60 tracking-[0.2em] uppercase">Thủ Đô Của Bạn</span>
          </div>
        </Link>

        {/* Center: Navigation */}
        <div className="hidden md:flex items-center gap-1 bg-white/40 p-1 rounded-2xl border border-hanoi-gold/20 backdrop-blur-sm">
          {[
            { name: "Khám phá", href: "/explore", icon: Compass },
            { name: "Lịch trình", href: "/planner", icon: Calendar },
            { name: "Cộng đồng", href: "/posts", icon: MessageSquare },
            { name: "Gói PRO", href: "/pricing", icon: Crown },
            { name: "Cá nhân", href: "/my-itineraries", icon: History, auth: true },
            { name: "Sự kiện", href: "/events", icon: Sparkles },
          ].map((item) => (
            (!item.auth || isAuthenticated) && (
              <Link 
                key={item.href} 
                href={item.href} 
                className="flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-bold text-zinc-600 hover:text-hanoi-red hover:bg-hanoi-gold/30 transition-all duration-300"
              >
                <item.icon className="h-4 w-4" />
                {item.name}
              </Link>
            )
          ))}
        </div>

        {/* Right Section */}
        <div className="flex items-center gap-1 sm:gap-3">
          <WeatherWidget />

          {isAuthenticated ? (
            <div className="flex items-center gap-1 sm:gap-2">
              <NotificationDropdown />

              {/* User Menu */}
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <button className="flex items-center gap-2 p-1 xs:pr-3 bg-white/60 hover:bg-hanoi-gold/40 rounded-full border border-hanoi-gold/30 transition-all outline-none group shadow-sm">
                    <Avatar className="h-8 w-8 border-2 border-hanoi-red/20 group-hover:border-hanoi-red/40 transition-colors">
                      <AvatarImage src={user?.avatar} />
                      <AvatarFallback className="bg-hanoi-red text-white font-black text-[10px]">
                        {user?.username?.charAt(0).toUpperCase()}
                      </AvatarFallback>
                    </Avatar>
                    <div className="hidden xs:flex flex-col items-start leading-none ml-1">
                      <span className="text-xs font-black text-zinc-900 group-hover:text-hanoi-red transition-colors">
                        {user?.username}
                      </span>
                      <span className="text-[9px] font-bold text-zinc-400 uppercase tracking-tighter">Thành viên</span>
                    </div>
                  </button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-56 mt-2 rounded-3xl p-2 shadow-2xl border-hanoi-gold/20 bg-hanoi-cream/95 backdrop-blur-xl">
                  <DropdownMenuLabel className="px-4 py-3">
                    <div className="flex flex-col">
                      <span className="text-[10px] font-black text-hanoi-red/40 uppercase tracking-[0.2em]">Tài khoản</span>
                      <span className="text-sm font-black text-zinc-900 truncate">{user?.username}</span>
                    </div>
                  </DropdownMenuLabel>
                  <DropdownMenuSeparator className="bg-hanoi-gold/20" />
                  <Link href="/profile">
                    <DropdownMenuItem className="rounded-2xl px-4 py-3 font-bold text-zinc-600 hover:text-hanoi-red cursor-pointer focus:bg-hanoi-gold/40 transition-colors">
                      <UserIcon className="mr-3 h-4 w-4" />
                      Trang cá nhân
                    </DropdownMenuItem>
                  </Link>
                  <Link href="/my-itineraries">
                    <DropdownMenuItem className="rounded-2xl px-4 py-3 font-bold text-zinc-600 hover:text-hanoi-red cursor-pointer focus:bg-hanoi-gold/40 transition-colors">
                      <Bookmark className="mr-3 h-4 w-4" />
                      Lịch trình của tôi
                    </DropdownMenuItem>
                  </Link>
                  <Link href="/saved-places">
                    <DropdownMenuItem className="rounded-2xl px-4 py-3 font-bold text-zinc-600 hover:text-hanoi-red cursor-pointer focus:bg-hanoi-gold/40 transition-colors">
                      <Heart className="mr-3 h-4 w-4" />
                      Địa điểm đã lưu
                    </DropdownMenuItem>
                  </Link>
                  <DropdownMenuSeparator className="bg-hanoi-gold/20" />
                  <DropdownMenuItem 
                    onClick={() => logout()}
                    className="rounded-2xl px-4 py-3 font-bold text-hanoi-red hover:bg-hanoi-red/5 cursor-pointer focus:bg-hanoi-red/5 transition-colors"
                  >
                    <LogOut className="mr-3 h-4 w-4" />
                    Đăng xuất
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          ) : (
            <div className="hidden xs:flex items-center gap-1 sm:gap-2">
              <Link href="/login">
                <Button variant="ghost" className="text-hanoi-red font-black text-xs sm:text-sm hover:bg-hanoi-gold/30 rounded-2xl px-3 sm:px-5 transition-all h-9">Đăng nhập</Button>
              </Link>
              <Link href="/register" className="hidden sm:block">
                <Button className="bg-hanoi-red hover:bg-[#6D1616] text-white font-black rounded-2xl px-6 text-sm shadow-xl shadow-hanoi-red/20 transition-all active:scale-95 border-2 border-transparent">
                  Bắt đầu ngay
                </Button>
              </Link>
            </div>
          )}

          {/* Mobile Menu Toggle */}
          <Button 
            variant="ghost" 
            size="icon" 
            className="md:hidden text-zinc-600 hover:bg-hanoi-gold/30 rounded-xl transition-colors h-10 w-10"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
          >
            {isMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
          </Button>
        </div>
      </div>

      {/* Mobile Menu Overlay */}
      <div className={cn(
        "fixed inset-0 top-0 bg-hanoi-cream z-[90] transition-all duration-500 md:hidden flex flex-col pt-20",
        isMenuOpen ? "opacity-100 translate-y-0" : "opacity-0 -translate-y-full pointer-events-none"
      )}>
        <div className="flex-1 overflow-y-auto px-6 space-y-4">
          {/* Weather on Mobile Menu */}
          <div className="mb-6 animate-in fade-in slide-in-from-top-4 duration-700 delay-150">
            <WeatherWidget variant="full" />
          </div>

          <div className="space-y-2">
            {[
              { name: "Khám phá địa điểm", href: "/explore", icon: Compass },
              { name: "Lịch trình AI", href: "/planner", icon: Sparkles },
              { name: "Cộng đồng Trip4Hanoi", href: "/posts", icon: MessageSquare },
              { name: "Gói PRO", href: "/pricing", icon: Crown },
              { name: "Lịch trình cá nhân", href: "/my-itineraries", icon: Bookmark, auth: true },
              { name: "Sự kiện đặc sắc", href: "/events", icon: MapPin },
            ].map((item) => (
              (!item.auth || isAuthenticated) && (
                <Link 
                  key={item.href}
                  href={item.href} 
                  onClick={() => setIsMenuOpen(false)}
                  className="flex items-center justify-between p-5 rounded-3xl bg-white/50 border border-hanoi-gold/20 text-xl font-black text-zinc-900 active:scale-95 transition-all"
                >
                  {item.name}
                  <item.icon className="h-6 w-6 text-hanoi-red" />
                </Link>
              )
            ))}

            {!isAuthenticated && (
              <div className="grid grid-cols-2 gap-3 mt-8">
                <Link href="/login" onClick={() => setIsMenuOpen(false)}>
                  <Button variant="outline" className="w-full h-16 font-black border-hanoi-gold/50 text-hanoi-red rounded-3xl bg-transparent">Đăng nhập</Button>
                </Link>
                <Link href="/register" onClick={() => setIsMenuOpen(false)}>
                  <Button className="w-full h-16 bg-hanoi-red hover:bg-[#6D1616] text-white font-black rounded-3xl">Bắt đầu ngay</Button>
                </Link>
              </div>
            )}
          </div>
        </div>
        
        <div className="p-10 text-center opacity-5 pointer-events-none mt-auto">
          <span className="text-8xl font-black text-hanoi-red tracking-tighter italic block">HANOI</span>
          <span className="text-xl font-bold text-hanoi-red tracking-[0.5em] uppercase">Culture & Soul</span>
        </div>
      </div>
    </nav>
  );
};
