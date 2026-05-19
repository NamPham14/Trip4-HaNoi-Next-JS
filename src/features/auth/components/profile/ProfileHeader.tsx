/* eslint-disable @typescript-eslint/no-explicit-any */
import React from "react";
import { Avatar, AvatarFallback, AvatarImage } from "@/shared/components/ui/avatar";
import { Button } from "@/shared/components/ui/button";
import { Camera, PenLine, Check, Loader2, Mail, Globe } from "lucide-react";

interface ProfileHeaderProps {
  user: any;
  isEditing: boolean;
  previewUrl: string | null;
  isPending: boolean;
  onStartEditing: () => void;
  onCancelEditing: () => void;
  onSave: (e: React.FormEvent) => void;
  onFileClick: () => void;
  onFileChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  fileInputRef: React.RefObject<HTMLInputElement | null>;
}

export const ProfileHeader = ({
  user,
  isEditing,
  previewUrl,
  isPending,
  onStartEditing,
  onCancelEditing,
  onSave,
  onFileClick,
  onFileChange,
  fileInputRef
}: ProfileHeaderProps) => {
  return (
    <div className="bg-white md:rounded-[40px] shadow-sm md:shadow-xl md:shadow-zinc-200/50 md:border border-zinc-100 overflow-hidden mb-0 md:mb-10 transition-all">
      <div className="h-40 md:h-64 bg-gradient-to-br from-hanoi-red via-[#9B2222] to-[#7A1818] relative">
        <div className="absolute inset-0 opacity-10 pointer-events-none flex items-center justify-center">
          <span className="text-9xl font-black text-white italic tracking-tighter select-none">HANOI</span>
        </div>
      </div>
      
      <div className="px-5 md:px-12 pb-8 md:pb-12">
        <div className="flex flex-col md:flex-row md:items-end justify-between -mt-16 md:-mt-24 gap-6 md:gap-8">
          <div className="flex flex-col md:flex-row items-center md:items-end gap-5 md:gap-8 text-center md:text-left">
            <div className="relative group">
              <Avatar className="h-32 w-32 md:h-44 md:w-44 border-[5px] md:border-[8px] border-white shadow-2xl">
                <AvatarImage src={previewUrl || user?.avatar} className="object-cover" />
                <AvatarFallback className=" pt-5 bg-zinc-100 text-zinc-600 text-4xl md:text-5xl font-black">
                  {user?.username?.charAt(0).toUpperCase()}
                </AvatarFallback>
              </Avatar>
              {isEditing && (
                <button 
                  onClick={onFileClick}
                  className="absolute bottom-1 right-1 md:bottom-2 md:right-2 bg-hanoi-red text-white p-2.5 md:p-3 rounded-full shadow-lg hover:scale-110 active:scale-95 transition-all z-20 border-2 border-white"
                >
                  <Camera className="h-4 w-4 md:h-5 md:w-5" />
                </button>
              )}
              <input 
                type="file" 
                ref={fileInputRef} 
                className="hidden" 
                accept="image/*"
                onChange={onFileChange} 
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

          <div className="hidden md:flex items-center gap-3">
            {!isEditing ? (
              <Button 
                onClick={onStartEditing}
                className="bg-zinc-900 hover:bg-zinc-800 text-white rounded-2xl font-black px-8 h-14 shadow-xl shadow-zinc-900/10 transition-all active:scale-95"
              >
                <PenLine className="h-5 w-5 mr-2.5" /> Chỉnh sửa hồ sơ
              </Button>
            ) : (
              <div className="flex items-center gap-3">
                <Button variant="ghost" onClick={onCancelEditing} className="font-black text-zinc-500 hover:bg-zinc-100 rounded-2xl h-14 px-8">
                  Hủy bỏ
                </Button>
                <Button 
                  onClick={onSave}
                  disabled={isPending}
                  className="bg-hanoi-red hover:bg-hanoi-red/90 text-white rounded-2xl font-black h-14 px-8 shadow-xl shadow-hanoi-red/20 transition-all active:scale-95"
                >
                  {isPending ? <Loader2 className="h-5 w-5 animate-spin mr-2.5" /> : <Check className="h-5 w-5 mr-2.5" />}
                  Lưu thay đổi
                </Button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
