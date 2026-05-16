/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import React, { useState, useRef } from "react";
import { Navbar } from "@/shared/components/navbar";
import { useUser, useUpdateProfile, useMyInfo } from "@/features/auth/hooks/use-auth";
import { useMyReviews, useSavedPlaces } from "@/features/places/hooks/use-places";
import { useItinerary } from "@/features/itinerary/hooks/use-itinerary";
import { Button } from "@/shared/components/ui/button";
import { Input } from "@/shared/components/ui/input";
import { Label } from "@/shared/components/ui/label";
import { Tabs, TabsContent, TabsTrigger, TabsList } from "@/shared/components/ui/tabs";
import { 
  User as UserIcon, 
  Mail, 
  MapPin, 
  Camera, 
  Calendar, 
  Shield, 
  Check, 
  Loader2, 
  Globe,
  Settings,
  Heart,
  Bookmark,
  ChevronRight,
  Sparkles,
  ArrowLeft,
  PenLine
} from "lucide-react";
import { toast } from "sonner";
import { Avatar, AvatarFallback, AvatarImage } from "@/shared/components/ui/avatar";
import { cn } from "@/shared/lib/utils";
import Link from "next/link";

export default function ProfilePage() {
  const { user, isAuthenticated } = useUser();
  const { data: myInfo, isLoading: isLoadingInfo } = useMyInfo();
  const { data: savedPlaces } = useSavedPlaces();
  const { data: myReviews } = useMyReviews(isAuthenticated);
  const { myItineraries, fetchMyItineraries } = useItinerary();
  const updateProfileMutation = useUpdateProfile();
  
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    username: user?.username || "",
    nationality: user?.nationality || "Vietnam",
    language: user?.language || "vi",
  });
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Load itineraries count
  React.useEffect(() => {
    if (isAuthenticated) {
      fetchMyItineraries();
    }
  }, [isAuthenticated]);

  // Update form data when user info is loaded
  React.useEffect(() => {
    if (user && !isEditing) {
      const timeoutId = setTimeout(() => {
        setFormData({
          username: user.username || "",
          nationality: user.nationality || "Vietnam",
          language: user.language || "vi",
        });
      }, 0);
      return () => clearTimeout(timeoutId);
    }
  }, [user?.username, user?.nationality, user?.language, isEditing]);

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-hanoi-cream flex flex-col items-center justify-center p-4">
        <div className="bg-white p-8 rounded-[40px] shadow-2xl shadow-zinc-200 text-center max-w-sm w-full">
          <div className="bg-hanoi-red/10 w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-6">
            <UserIcon className="h-10 w-10 text-hanoi-red" />
          </div>
          <h2 className="text-2xl font-black text-zinc-900 mb-2">Bạn cần đăng nhập</h2>
          <p className="text-zinc-500 mb-8 font-medium">Vui lòng đăng nhập để xem thông tin cá nhân và quản lý lịch trình.</p>
          <Link href="/login" className="block w-full">
            <Button className="w-full bg-hanoi-red hover:bg-hanoi-red/90 text-white font-black h-14 rounded-2xl shadow-xl shadow-hanoi-red/20">
              Đăng nhập ngay
            </Button>
          </Link>
        </div>
      </div>
    );
  }

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setSelectedFile(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreviewUrl(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;

    try {
      const updateData = {
        id: Number(user.id),
        email: user.email,
        username: user.username,
        nationality: formData.nationality,
        language: formData.language
      };
      
      await updateProfileMutation.mutateAsync({
        data: updateData,
        file: selectedFile || undefined
      });
      
      setIsEditing(false);
      setSelectedFile(null);
      setPreviewUrl(null);
      toast.success("Cập nhật hồ sơ thành công!");
    } catch (error: any) {
      console.error("Profile update error:", error);
      const msg = error.response?.data?.message || "Không thể cập nhật hồ sơ. Thử lại sau.";
      toast.error(msg);
    }
  };

  return (
    <div className="min-h-screen bg-[#FDFCFB] flex flex-col pb-20 md:pb-0">
      <Navbar />

      <main className="flex-1 container mx-auto px-0 md:px-4 py-0 md:py-8 max-w-5xl">
        {/* Profile Header Card */}
        <div className="bg-white md:rounded-[40px] shadow-sm md:shadow-xl md:shadow-zinc-200/50 md:border border-zinc-100 overflow-hidden mb-0 md:mb-10 transition-all">
          {/* Cover Photo */}
          <div className="h-40 md:h-64 bg-gradient-to-br from-hanoi-red via-[#9B2222] to-[#7A1818] relative">
            <div className="absolute inset-0 opacity-10 pointer-events-none flex items-center justify-center">
              <span className="text-9xl font-black text-white italic tracking-tighter select-none">HANOI</span>
            </div>
            {/* Mobile Back Button (Optional) */}
            <div className="md:hidden absolute top-4 left-4">
              <Link href="/">
                <button className="bg-black/20 backdrop-blur-md p-2 rounded-full text-white">
                  <ArrowLeft className="h-5 w-5" />
                </button>
              </Link>
            </div>
          </div>
          
          <div className="px-5 md:px-12 pb-8 md:pb-12">
            <div className="flex flex-col md:flex-row md:items-end justify-between -mt-16 md:-mt-24 gap-6 md:gap-8">
              {/* Avatar & Basic Info */}
              <div className="flex flex-col md:flex-row items-center md:items-end gap-5 md:gap-8 text-center md:text-left">
                <div className="relative group">
                  <div className="relative">
                    <Avatar className="h-32 w-32 md:h-44 md:w-44 border-[5px] md:border-[8px] border-white shadow-2xl">
                      <AvatarImage src={previewUrl || user?.avatar} className="object-cover" />
                      <AvatarFallback className="bg-zinc-100 text-zinc-400 text-4xl md:text-5xl font-black">
                        {user?.username?.charAt(0).toUpperCase()}
                      </AvatarFallback>
                    </Avatar>
                    {isEditing && (
                      <button 
                        onClick={() => fileInputRef.current?.click()}
                        className="absolute bottom-1 right-1 md:bottom-2 md:right-2 bg-hanoi-red text-white p-2.5 md:p-3 rounded-full shadow-lg hover:scale-110 active:scale-95 transition-all z-20 border-2 border-white"
                      >
                        <Camera className="h-4 w-4 md:h-5 md:w-5" />
                      </button>
                    )}
                  </div>
                  <input 
                    type="file" 
                    ref={fileInputRef} 
                    className="hidden" 
                    accept="image/*"
                    onChange={handleFileChange} 
                  />
                </div>
                
                <div className="pb-0 md:pb-3 flex-1">
                  <div className="flex flex-col md:flex-row items-center md:items-baseline gap-2 md:gap-4 mb-3">
                    <h1 className="text-3xl md:text-4xl font-black text-zinc-900 tracking-tight leading-none">
                      {user?.username}
                    </h1>
                    <span className="inline-flex items-center px-2.5 py-1 rounded-full bg-hanoi-gold/30 text-[10px] font-black text-hanoi-red uppercase tracking-wider">
                      Thành viên mới
                    </span>
                  </div>
                  <div className="flex flex-col md:flex-row items-center justify-center md:justify-start gap-2 md:gap-6">
                    <p className="text-zinc-500 font-bold text-sm flex items-center gap-2">
                      <Mail className="h-4 w-4 text-zinc-400" /> {user?.email}
                    </p>
                    <div className="hidden md:block h-1.5 w-1.5 rounded-full bg-zinc-200" />
                    <p className="text-zinc-500 font-bold text-sm flex items-center gap-2">
                      <Globe className="h-4 w-4 text-zinc-400" /> {user?.nationality || "Chưa cập nhật"}
                    </p>
                  </div>
                </div>
              </div>

              {/* Desktop Action Buttons */}
              <div className="hidden md:flex items-center gap-3">
                {!isEditing ? (
                  <Button 
                    onClick={() => setIsEditing(true)}
                    className="bg-zinc-900 hover:bg-zinc-800 text-white rounded-2xl font-black px-8 h-14 shadow-xl shadow-zinc-900/10 transition-all active:scale-95"
                  >
                    <PenLine className="h-5 w-5 mr-2.5" /> Chỉnh sửa hồ sơ
                  </Button>
                ) : (
                  <div className="flex items-center gap-3">
                    <Button 
                      variant="ghost"
                      onClick={() => {
                        setIsEditing(false);
                        setPreviewUrl(null);
                        setSelectedFile(null);
                      }}
                      className="font-black text-zinc-500 hover:bg-zinc-100 rounded-2xl h-14 px-8"
                    >
                      Hủy bỏ
                    </Button>
                    <Button 
                      onClick={handleSubmit}
                      disabled={updateProfileMutation.isPending}
                      className="bg-hanoi-red hover:bg-hanoi-red/90 text-white rounded-2xl font-black h-14 px-8 shadow-xl shadow-hanoi-red/20 transition-all active:scale-95"
                    >
                      {updateProfileMutation.isPending ? (
                        <Loader2 className="h-5 w-5 animate-spin mr-2.5" />
                      ) : (
                        <Check className="h-5 w-5 mr-2.5" />
                      )}
                      Lưu thay đổi
                    </Button>
                  </div>
                )}
              </div>
              
              {/* Mobile Profile Trigger (Visible only when NOT editing) */}
              {!isEditing && (
                <Button 
                  onClick={() => setIsEditing(true)}
                  className="md:hidden w-full bg-zinc-900 hover:bg-zinc-800 text-white rounded-2xl font-black h-14 shadow-xl shadow-zinc-900/10"
                >
                  <PenLine className="h-5 w-5 mr-2" /> Chỉnh sửa hồ sơ
                </Button>
              )}
            </div>

            {/* Stats Row */}
            <div className="grid grid-cols-3 gap-4 md:gap-8 mt-10 md:mt-14 pt-8 md:pt-10 border-t border-zinc-100/80">
              <Link href="/my-itineraries" className="text-center group transition-all active:scale-95">
                <p className="text-2xl md:text-4xl font-black text-zinc-900 group-hover:text-hanoi-red transition-colors">{myItineraries.length}</p>
                <p className="text-[10px] md:text-[11px] font-black text-zinc-400 uppercase tracking-[0.2em] mt-2">Lịch trình</p>
              </Link>
              <Link href="/saved-places" className="text-center group border-x border-zinc-100/80 transition-all active:scale-95">
                <p className="text-2xl md:text-4xl font-black text-zinc-900 group-hover:text-hanoi-red transition-colors">{savedPlaces?.length || 0}</p>
                <p className="text-[10px] md:text-[11px] font-black text-zinc-400 uppercase tracking-[0.2em] mt-2">Yêu thích</p>
              </Link>
              <div className="text-center group transition-all active:scale-95">
                <p className="text-2xl md:text-4xl font-black text-zinc-900 group-hover:text-hanoi-red transition-colors">{myReviews?.length || 0}</p>
                <p className="text-[10px] md:text-[11px] font-black text-zinc-400 uppercase tracking-[0.2em] mt-2">Đánh giá</p>
              </div>
            </div>
          </div>
        </div>

        {/* Content Tabs */}
        <div className="px-4 md:px-0">
          <Tabs defaultValue="info" className="w-full">
            <div className="overflow-x-auto pb-4 -mx-4 px-4 md:mx-0 md:px-0 no-scrollbar sticky top-16 md:static z-40 bg-[#FDFCFB]/80 backdrop-blur-sm md:bg-transparent pt-2 md:pt-0">
              <div className="flex justify-center w-full">
                <TabsList className="bg-white p-1.5 rounded-[24px] border border-zinc-100 mb-6 md:mb-10 h-14 md:h-18 flex items-center justify-center w-full md:w-max shadow-sm">
                  <TabsTrigger 
                    value="info" 
                    className="flex-1 md:flex-none rounded-2xl px-4 md:px-10 h-full font-black text-[10px] md:text-base data-[state=active]:bg-zinc-900 data-[state=active]:text-white transition-all flex items-center justify-center gap-2 md:gap-2.5"
                  >
                    <UserIcon className="h-3.5 w-3.5 md:h-5 md:w-5" /> <span className="hidden xs:inline">Thông tin</span><span className="xs:hidden">Hồ sơ</span>
                  </TabsTrigger>
                  <TabsTrigger 
                    value="security" 
                    className="flex-1 md:flex-none rounded-2xl px-4 md:px-10 h-full font-black text-[10px] md:text-base data-[state=active]:bg-zinc-900 data-[state=active]:text-white transition-all flex items-center justify-center gap-2 md:gap-2.5"
                  >
                    <Shield className="h-3.5 w-3.5 md:h-5 md:w-5" /> Bảo mật
                  </TabsTrigger>
                  <TabsTrigger 
                    value="activity" 
                    className="flex-1 md:flex-none rounded-2xl px-4 md:px-10 h-full font-black text-[10px] md:text-base data-[state=active]:bg-zinc-900 data-[state=active]:text-white transition-all flex items-center justify-center gap-2 md:gap-2.5"
                  >
                    <Calendar className="h-3.5 w-3.5 md:h-5 md:w-5" /> Hoạt động
                  </TabsTrigger>
                </TabsList>
              </div>
            </div>

            <TabsContent value="info" className="mt-0 focus-visible:outline-none">
              <div className="flex flex-col gap-6 md:grid md:grid-cols-3 md:gap-10">
                {/* Profile Details Form */}
                <div className="md:col-span-2 order-2 md:order-1">
                  <div className="bg-white p-6 md:p-12 rounded-[32px] md:rounded-[48px] border border-zinc-100 shadow-sm space-y-10 md:space-y-14">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-10">
                      <div className="space-y-3">
                        <Label className="text-[10px] md:text-[11px] font-black text-zinc-400 uppercase tracking-[0.2em] pl-1">Họ và tên người dùng</Label>
                        <Input 
                          value={user?.username}
                          disabled
                          className="h-14 md:h-16 rounded-2xl border-zinc-100 bg-zinc-50/50 text-zinc-600 font-black cursor-not-allowed text-base px-5 md:px-6"
                        />
                      </div>
                      <div className="space-y-3">
                        <Label className="text-[10px] md:text-[11px] font-black text-zinc-400 uppercase tracking-[0.2em] pl-1">Địa chỉ Email</Label>
                        <Input 
                          value={user?.email}
                          disabled
                          className="h-14 md:h-16 rounded-2xl border-zinc-100 bg-zinc-50/50 text-zinc-600 font-black cursor-not-allowed text-base px-5 md:px-6"
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-10 pt-10 border-t border-zinc-50">
                      <div className="space-y-3">
                        <Label className="text-[10px] md:text-[11px] font-black text-zinc-400 uppercase tracking-[0.2em] pl-1 flex items-center gap-2">
                          <Globe className="h-3.5 w-3.5" /> Quốc tịch
                        </Label>
                        <div className="relative">
                          <select 
                            value={formData.nationality}
                            onChange={(e) => setFormData({...formData, nationality: e.target.value})}
                            disabled={!isEditing}
                            className={cn(
                              "w-full h-14 md:h-16 px-5 md:px-6 rounded-2xl border-2 outline-none transition-all font-black text-base appearance-none pr-12",
                              isEditing 
                                ? "border-hanoi-red/20 focus:border-hanoi-red bg-white text-zinc-900" 
                                : "border-zinc-50 bg-zinc-50 text-zinc-500 cursor-not-allowed"
                            )}
                          >
                            <option value="Vietnam">Việt Nam</option>
                            <option value="USA">Hoa Kỳ</option>
                            <option value="Japan">Nhật Bản</option>
                            <option value="Korea">Hàn Quốc</option>
                            <option value="France">Pháp</option>
                          </select>
                          <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none">
                            <ChevronRight className="h-5 w-5 text-hanoi-red rotate-90" />
                          </div>
                        </div>
                      </div>
                      <div className="space-y-3">
                        <Label className="text-[10px] md:text-[11px] font-black text-zinc-400 uppercase tracking-[0.2em] pl-1">
                          Ngôn ngữ hiển thị
                        </Label>
                        <div className="flex gap-3">
                          <button
                            disabled={!isEditing}
                            onClick={() => setFormData({...formData, language: "vi"})}
                            className={cn(
                              "flex-1 h-14 md:h-16 rounded-2xl border-2 font-black text-sm transition-all shadow-sm",
                              formData.language === "vi" 
                                ? "border-hanoi-red bg-hanoi-red text-white shadow-hanoi-red/20" 
                                : "border-zinc-50 bg-zinc-50 text-zinc-400 hover:border-zinc-200"
                            )}
                          >
                            Tiếng Việt
                          </button>
                          <button
                            disabled={!isEditing}
                            onClick={() => setFormData({...formData, language: "en"})}
                            className={cn(
                              "flex-1 h-14 md:h-16 rounded-2xl border-2 font-black text-sm transition-all shadow-sm",
                              formData.language === "en" 
                                ? "border-hanoi-red bg-hanoi-red text-white shadow-hanoi-red/20" 
                                : "border-zinc-50 bg-zinc-50 text-zinc-400 hover:border-zinc-200"
                            )}
                          >
                            English
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Sidebar Stats/Info */}
                <div className="space-y-6 md:space-y-8 order-1 md:order-2">
                  <div className="bg-zinc-900 p-8 md:p-10 rounded-[32px] md:rounded-[48px] text-white shadow-2xl shadow-zinc-900/30 relative overflow-hidden group">
                    <div className="relative z-10">
                      <div className="flex items-center gap-4 mb-8">
                        <div className="h-10 w-10 md:h-12 md:w-12 rounded-2xl bg-hanoi-red flex items-center justify-center rotate-6 group-hover:rotate-0 transition-transform duration-500">
                          <Sparkles className="h-5 w-5 md:h-6 md:w-6 text-white" />
                        </div>
                        <h3 className="text-xl md:text-2xl font-black">Thành viên vàng</h3>
                      </div>
                      <div className="space-y-6">
                        <div className="flex items-center gap-5">
                          <div className="h-11 w-11 rounded-full bg-white/10 flex items-center justify-center shrink-0">
                            <Check className="h-5 w-5 text-hanoi-gold" />
                          </div>
                          <div>
                            <p className="text-[10px] font-black text-white/40 uppercase tracking-widest leading-none mb-1.5">Ngày tham gia</p>
                            <p className="text-sm font-bold text-white/90">{user?.createdAt ? new Date(user.createdAt).toLocaleDateString('vi-VN') : "Tháng 05, 2026"}</p>
                          </div>
                        </div>
                        <div className="flex items-center gap-5">
                          <div className="h-11 w-11 rounded-full bg-white/10 flex items-center justify-center shrink-0">
                            <Shield className="h-5 w-5 text-hanoi-gold" />
                          </div>
                          <div>
                            <p className="text-[10px] font-black text-white/40 uppercase tracking-widest leading-none mb-1.5">Xác thực</p>
                            <p className="text-sm font-bold text-white/90">Đã bảo mật tài khoản</p>
                          </div>
                        </div>
                      </div>
                    </div>
                    <div className="absolute -bottom-12 -right-12 opacity-10 group-hover:scale-125 transition-transform duration-1000">
                      <MapPin className="h-48 w-48 md:h-64 md:w-64 rotate-12" />
                    </div>
                  </div>

                  <div className="bg-white p-6 md:p-10 rounded-[32px] md:rounded-[48px] border border-zinc-100 shadow-sm">
                    <h4 className="text-[10px] md:text-[11px] font-black text-zinc-400 uppercase tracking-[0.2em] mb-6 md:mb-8">Lối tắt nhanh</h4>
                    <div className="space-y-3">
                      <Link href="/my-itineraries" className="block">
                        <Button variant="ghost" className="w-full justify-between font-black text-zinc-600 hover:text-hanoi-red hover:bg-hanoi-red/5 rounded-2xl h-14 md:h-16 px-5 transition-all group">
                          <span className="flex items-center gap-3 text-base">
                            <Bookmark className="h-5 w-5" /> Lịch trình
                          </span>
                          <ChevronRight className="h-5 w-5 opacity-0 group-hover:opacity-100 transition-all -translate-x-2 group-hover:translate-x-0" />
                        </Button>
                      </Link>
                      <Link href="/saved-places" className="block">
                        <Button variant="ghost" className="w-full justify-between font-black text-zinc-600 hover:text-hanoi-red hover:bg-hanoi-red/5 rounded-2xl h-14 md:h-16 px-5 transition-all group">
                          <span className="flex items-center gap-3 text-base">
                            <Heart className="h-5 w-5" /> Yêu thích
                          </span>
                          <ChevronRight className="h-5 w-5 opacity-0 group-hover:opacity-100 transition-all -translate-x-2 group-hover:translate-x-0" />
                        </Button>
                      </Link>
                    </div>
                  </div>
                </div>
              </div>
            </TabsContent>

            <TabsContent value="security" className="focus-visible:outline-none">
              <div className="bg-white p-8 md:p-12 rounded-[32px] md:rounded-[48px] border border-zinc-100 shadow-sm max-w-2xl">
                <div className="flex items-center gap-4 mb-10">
                  <div className="bg-hanoi-red/10 p-3 rounded-2xl">
                    <Shield className="h-8 w-8 text-hanoi-red" />
                  </div>
                  <div>
                    <h2 className="text-2xl font-black text-zinc-900 leading-none">Bảo mật tài khoản</h2>
                    <p className="text-zinc-500 font-medium text-sm mt-2">Cập nhật mật khẩu để bảo vệ thông tin của bạn</p>
                  </div>
                </div>
                
                <div className="space-y-8">
                  <div className="space-y-3">
                    <Label className="text-[10px] font-black text-zinc-400 uppercase tracking-[0.2em] pl-1">Mật khẩu hiện tại</Label>
                    <Input type="password" placeholder="••••••••" className="h-14 rounded-2xl border-zinc-100 px-5 focus:border-hanoi-red" />
                  </div>
                  <div className="space-y-3">
                    <Label className="text-[10px] font-black text-zinc-400 uppercase tracking-[0.2em] pl-1">Mật khẩu mới</Label>
                    <Input type="password" placeholder="••••••••" className="h-14 rounded-2xl border-zinc-100 px-5 focus:border-hanoi-red" />
                  </div>
                  <div className="space-y-3">
                    <Label className="text-[10px] font-black text-zinc-400 uppercase tracking-[0.2em] pl-1">Xác nhận mật khẩu mới</Label>
                    <Input type="password" placeholder="••••••••" className="h-14 rounded-2xl border-zinc-100 px-5 focus:border-hanoi-red" />
                  </div>
                  <Button className="w-full md:w-auto bg-zinc-900 hover:bg-zinc-800 text-white rounded-2xl font-black px-12 h-16 shadow-xl shadow-zinc-900/20 transition-all active:scale-95 mt-4">
                    Cập nhật mật khẩu
                  </Button>
                </div>
              </div>
            </TabsContent>
            
            <TabsContent value="activity" className="focus-visible:outline-none">
              <div className="text-center py-32 md:py-48 bg-white rounded-[32px] md:rounded-[48px] border border-dashed border-zinc-200">
                <div className="w-24 h-24 bg-zinc-50 rounded-full flex items-center justify-center mx-auto mb-8">
                  <Calendar className="h-12 w-12 text-zinc-200" />
                </div>
                <h3 className="text-xl font-black text-zinc-900 mb-2">Chưa có hoạt động</h3>
                <p className="text-zinc-400 font-medium max-w-xs mx-auto">Mọi hoạt động của bạn sẽ được lưu giữ tại đây để bạn dễ dàng theo dõi.</p>
              </div>
            </TabsContent>
          </Tabs>
        </div>
      </main>

      {/* Mobile Sticky Action Bar - Only when editing */}
      {isEditing && (
        <div className="md:hidden fixed bottom-0 left-0 right-0 bg-white/80 backdrop-blur-xl border-t border-zinc-100 p-4 z-50 animate-in slide-in-from-bottom duration-300">
          <div className="flex items-center gap-3">
            <Button 
              variant="ghost"
              onClick={() => {
                setIsEditing(false);
                setPreviewUrl(null);
                setSelectedFile(null);
              }}
              className="flex-1 font-black text-zinc-500 rounded-2xl h-14"
            >
              Hủy
            </Button>
            <Button 
              onClick={handleSubmit}
              disabled={updateProfileMutation.isPending}
              className="flex-[2] bg-hanoi-red hover:bg-hanoi-red/90 text-white rounded-2xl font-black h-14 shadow-xl shadow-hanoi-red/20"
            >
              {updateProfileMutation.isPending ? (
                <Loader2 className="h-5 w-5 animate-spin mr-2" />
              ) : (
                <Check className="h-5 w-5 mr-2" />
              )}
              Lưu hồ sơ
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}
