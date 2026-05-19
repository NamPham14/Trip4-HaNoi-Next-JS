/* eslint-disable @typescript-eslint/no-explicit-any */
import React from "react";
import { Label } from "@/shared/components/ui/label";
import { Input } from "@/shared/components/ui/input";
import { Globe, MapPin, Sparkles, Check, ChevronRight } from "lucide-react";
import { cn } from "@/shared/lib/utils";
import Link from "next/link";
import { Bookmark, Heart } from "lucide-react";
import { Button } from "@/shared/components/ui/button";

interface ProfileInfoTabProps {
  user: any;
  isEditing: boolean;
  formData: any;
  setFormData: (data: any) => void;
}

export const ProfileInfoTab = ({ user, isEditing, formData, setFormData }: ProfileInfoTabProps) => {
  return (
    <div className="flex flex-col gap-6 md:grid md:grid-cols-3 md:gap-10">
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
                {["vi", "en"].map((lang) => (
                  <button
                    key={lang}
                    disabled={!isEditing}
                    onClick={() => setFormData({...formData, language: lang})}
                    className={cn(
                      "flex-1 h-14 md:h-16 rounded-2xl border-2 font-black text-sm transition-all shadow-sm",
                      formData.language === lang 
                        ? "border-hanoi-red bg-hanoi-red text-white shadow-hanoi-red/20" 
                        : "border-zinc-50 bg-zinc-50 text-zinc-400 hover:border-zinc-200"
                    )}
                  >
                    {lang === "vi" ? "Tiếng Việt" : "English"}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>

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
  );
};
