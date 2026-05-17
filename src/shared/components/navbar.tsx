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
  History
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

  const notifications = [
    { id: 1, title: "Lễ hội Chùa Hương", desc: "Sắp diễn ra vào cuối tuần này tại Mỹ Đức.", time: "2 giờ trước", image: "https://images.unsplash.com/photo-1555921015-5532091f6026?w=100&h=100&fit=crop" },
    { id: 2, title: "Gợi ý mới", desc: "Một quán cà phê muối vừa được thêm vào danh sách yêu thích của bạn.", time: "5 giờ trước", image: "https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?w=100&h=100&fit=crop" },
    { id: 3, title: "Thời tiết Hà Nội", desc: "Dự báo có nắng đẹp, rất thích hợp để dạo quanh Hồ Tây.", time: "1 ngày trước", image: "https://images.unsplash.com/photo-1509062522246-3755977927d7?w=100&h=100&fit=crop" },
  ];

  return (
    <nav className={cn(
      "sticky top-0 z-[100] w-full transition-all duration-500",
      isScrolled 
        ? "bg-hanoi-cream/80 backdrop-blur-xl border-b border-hanoi-gold/30 shadow-sm py-2" 
        : "bg-transparent py-4"
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
        <div className="flex items-center gap-3">
          <WeatherWidget />

          {/* Notifications */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="icon" className="relative text-zinc-600 hover:bg-hanoi-gold/30 rounded-full h-10 w-10 transition-colors">
                <Bell className="h-5 w-5" />
                <span className="absolute top-2 right-2 h-2 w-2 bg-hanoi-red rounded-full border-2 border-hanoi-cream" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-80 mt-2 rounded-3xl p-2 shadow-2xl border-hanoi-gold/20 bg-hanoi-cream/95 backdrop-blur-xl">
              <DropdownMenuLabel className="px-4 py-3 flex items-center justify-between">
                <span className="text-sm font-black text-hanoi-red uppercase">Thông báo mới</span>
                <span className="text-[10px] font-bold bg-hanoi-red text-white px-2 py-0.5 rounded-full">3 tin mới</span>
              </DropdownMenuLabel>
              <DropdownMenuSeparator className="bg-hanoi-gold/20" />
              <div className="max-h-[400px] overflow-y-auto custom-scrollbar">
                {notifications.map((n) => (
                  <DropdownMenuItem key={n.id} className="rounded-2xl p-3 mb-1 cursor-pointer focus:bg-hanoi-gold/40 flex gap-3 transition-colors">
                    <img src={n.image} alt="" className="h-12 w-12 rounded-xl object-cover shadow-sm" />
                    <div className="flex flex-col gap-0.5">
                      <span className="text-sm font-bold text-zinc-900 leading-tight">{n.title}</span>
                      <p className="text-xs text-zinc-500 line-clamp-2 leading-tight">{n.desc}</p>
                      <span className="text-[10px] font-medium text-hanoi-red/60 mt-1">{n.time}</span>
                    </div>
                  </DropdownMenuItem>
                ))}
              </div>
              <DropdownMenuSeparator className="bg-hanoi-gold/20" />
              <Button variant="ghost" className="w-full text-xs font-bold text-hanoi-red hover:bg-hanoi-gold/40 rounded-xl py-2 transition-colors">
                Xem tất cả thông báo
              </Button>
            </DropdownMenuContent>
          </DropdownMenu>
          
          {isAuthenticated ? (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <button className="flex items-center gap-2 p-1 pr-3 bg-white/60 hover:bg-hanoi-gold/40 rounded-full border border-hanoi-gold/30 transition-all outline-none group shadow-sm">
                  <Avatar className="h-8 w-8 border-2 border-hanoi-red/20 group-hover:border-hanoi-red/40 transition-colors">
                    <AvatarImage src={user?.avatar} />
                    <AvatarFallback className="bg-hanoi-red text-white font-black text-[10px]">
                      {user?.username?.charAt(0).toUpperCase()}
                    </AvatarFallback>
                  </Avatar>
                  <div className="flex flex-col items-start leading-none ml-1">
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
          ) : (
            <div className="hidden sm:flex items-center gap-2">
              <Link href="/login">
                <Button variant="ghost" className="text-hanoi-red font-black text-sm hover:bg-hanoi-gold/30 rounded-2xl px-5 transition-all">Đăng nhập</Button>
              </Link>
              <Link href="/register">
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
            className="md:hidden text-zinc-600 hover:bg-hanoi-gold/30 rounded-xl transition-colors"
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
        <div className="flex-1 overflow-y-auto px-6 space-y-2">
          {[
            { name: "Khám phá địa điểm", href: "/explore", icon: Compass },
            { name: "Lịch trình AI", href: "/planner", icon: Sparkles },
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
                <Button className="w-full h-16 bg-hanoi-red hover:bg-[#6D1616] text-white font-black rounded-3xl">Tham gia</Button>
              </Link>
            </div>
          )}
        </div>
        
        <div className="p-10 text-center opacity-5 pointer-events-none mt-auto">
          <span className="text-8xl font-black text-hanoi-red tracking-tighter italic block">HANOI</span>
          <span className="text-xl font-bold text-hanoi-red tracking-[0.5em] uppercase">Culture & Soul</span>
        </div>
      </div>
    </nav>
  );
};
