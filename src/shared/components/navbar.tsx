"use client";

import React, { useState } from "react";
import Link from "next/link";
import { Search, MapPin, Sparkles, LogOut, User, Menu, X, Bookmark } from "lucide-react";
import { useUser, useLogout } from "@/features/auth/hooks/use-auth";
import { Button } from "@/shared/components/ui/button";
import { cn } from "@/shared/lib/utils";

export const Navbar = () => {
  const { user, isAuthenticated } = useUser();
  const logout = useLogout();
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  return (
    <nav className="sticky top-0 z-[100] w-full bg-white border-b border-zinc-100 md:bg-white/90 md:backdrop-blur-md">
      <div className="container mx-auto px-4 h-16 flex items-center justify-between relative z-[110] bg-white md:bg-transparent">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-2">
          <div className="bg-hanoi-red p-1.5 rounded-lg">
            <MapPin className="h-4 w-4 md:h-5 md:w-5 text-hanoi-cream" />
          </div>
          <span className="text-lg md:text-xl font-bold text-hanoi-red tracking-tight">Trip4Hanoi</span>
        </Link>

        {/* Desktop Menu */}
        <div className="hidden md:flex items-center gap-8">
          <Link href="/explore" className="text-sm font-medium text-zinc-600 hover:text-hanoi-red transition-colors">Khám phá</Link>
          <Link href="/planner" className="text-sm font-medium text-zinc-600 hover:text-hanoi-red transition-colors">Lên lịch trình</Link>
          {isAuthenticated && (
            <Link href="/my-itineraries" className="text-sm font-medium text-zinc-600 hover:text-hanoi-red transition-colors flex items-center gap-1">
              <Bookmark className="h-3.5 w-3.5" /> Lịch trình của tôi
            </Link>
          )}
          <Link href="/events" className="text-sm font-medium text-zinc-600 hover:text-hanoi-red transition-colors">Sự kiện</Link>
        </div>

        {/* Right Section */}
        <div className="flex items-center gap-2 md:gap-4">
          <Button variant="ghost" size="icon" className="text-zinc-500 hidden sm:flex">
            <Search className="h-5 w-5" />
          </Button>
          
          {isAuthenticated ? (
            <div className="flex items-center gap-2 md:gap-4">
              <div className="flex items-center gap-2 px-2 md:px-3 py-1.5 bg-hanoi-gold/30 rounded-full border border-hanoi-gold/50">
                <div className="bg-hanoi-red h-5 w-5 md:h-6 md:w-6 rounded-full flex items-center justify-center text-[8px] md:text-[10px] text-white font-bold">
                  {user?.username?.charAt(0).toUpperCase()}
                </div>
                <span className="text-[10px] md:text-xs font-bold text-hanoi-red truncate max-w-[60px] md:max-w-none">
                  {user?.username}
                </span>
              </div>
              <Button variant="ghost" size="icon" onClick={logout} className="text-zinc-500 hover:text-hanoi-red hidden sm:flex">
                <LogOut className="h-5 w-5" />
              </Button>
            </div>
          ) : (
            <div className="hidden sm:flex items-center gap-2">
              <Link href="/login">
                <Button variant="ghost" className="text-zinc-600 font-bold text-sm">Đăng nhập</Button>
              </Link>
              <Link href="/register">
                <Button className="bg-hanoi-red hover:bg-[#6D1616] text-white font-bold rounded-full px-4 md:px-6 text-sm">Bắt đầu ngay</Button>
              </Link>
            </div>
          )}

          {/* Mobile Menu Toggle */}
          <Button 
            variant="ghost" 
            size="icon" 
            className="md:hidden text-zinc-600"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
          >
            {isMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
          </Button>
        </div>
      </div>

      {/* Mobile Menu Overlay */}
      <div className={cn(
        "fixed inset-0 top-16 bg-hanoi-cream z-[90] transition-transform duration-300 md:hidden flex flex-col",
        isMenuOpen ? "translate-x-0" : "translate-x-full"
      )} style={{ backdropFilter: 'none' }}>
        <div className="flex-1 overflow-y-auto">
          <div className="flex flex-col p-6 gap-2">
            <Link 
              href="/explore" 
              onClick={() => setIsMenuOpen(false)}
              className="text-xl font-bold text-zinc-900 hover:text-hanoi-red py-4 border-b border-zinc-200/50 flex items-center justify-between"
            >
              Khám phá địa điểm
              <MapPin className="h-5 w-5 text-hanoi-red" />
            </Link>
            <Link 
              href="/planner" 
              onClick={() => setIsMenuOpen(false)}
              className="text-xl font-bold text-zinc-900 hover:text-hanoi-red py-4 border-b border-zinc-200/50 flex items-center justify-between"
            >
              Lên lịch trình AI
              <Sparkles className="h-5 w-5 text-hanoi-red" />
            </Link>
            {isAuthenticated && (
              <Link 
                href="/my-itineraries" 
                onClick={() => setIsMenuOpen(false)}
                className="text-xl font-bold text-zinc-900 hover:text-hanoi-red py-4 border-b border-zinc-200/50 flex items-center justify-between"
              >
                Lịch trình của tôi
                <Bookmark className="h-5 w-5 text-hanoi-red" />
              </Link>
            )}
            <Link 
              href="/events" 
              onClick={() => setIsMenuOpen(false)}
              className="text-xl font-bold text-zinc-900 hover:text-hanoi-red py-4 border-b border-zinc-200/50 flex items-center justify-between"
            >
              Sự kiện đang diễn ra
              <div className="h-2 w-2 rounded-full bg-hanoi-red animate-pulse" />
            </Link>

            <div className="mt-8 space-y-4">
              {!isAuthenticated ? (
                <div className="grid grid-cols-1 gap-3">
                  <Link href="/login" onClick={() => setIsMenuOpen(false)}>
                    <Button variant="outline" className="w-full h-12 font-bold border-zinc-300 text-zinc-900">Đăng nhập</Button>
                  </Link>
                  <Link href="/register" onClick={() => setIsMenuOpen(false)}>
                    <Button className="w-full h-12 bg-hanoi-red hover:bg-[#6D1616] text-white font-bold">Bắt đầu ngay</Button>
                  </Link>
                </div>
              ) : (
                <div className="space-y-4">
                  <div className="flex items-center gap-3 p-4 bg-white rounded-2xl border border-zinc-100">
                    <div className="bg-hanoi-red h-10 w-10 rounded-full flex items-center justify-center text-white font-bold">
                      {user?.username?.charAt(0).toUpperCase()}
                    </div>
                    <div>
                      <p className="text-xs font-bold text-zinc-400 uppercase tracking-widest">Tài khoản</p>
                      <p className="text-lg font-bold text-zinc-900">{user?.username}</p>
                    </div>
                  </div>
                  <Button 
                    variant="ghost" 
                    className="w-full justify-start h-12 text-hanoi-red font-bold hover:bg-hanoi-red/5 px-4 rounded-xl"
                    onClick={() => {
                      logout();
                      setIsMenuOpen(false);
                    }}
                  >
                    <LogOut className="h-5 w-5 mr-3" /> Đăng xuất tài khoản
                  </Button>
                </div>
              )}
            </div>
          </div>
        </div>
        
        {/* Hanoi Decoration for Mobile Menu */}
        <div className="mt-auto p-10 text-center opacity-10 pointer-events-none">
          <span className="text-6xl font-black text-hanoi-red uppercase tracking-tighter italic">HANOI</span>
        </div>
      </div>
    </nav>
  );
};
