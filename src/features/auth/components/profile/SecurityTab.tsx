/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Shield, Eye, EyeOff, Loader2, Check, AlertCircle } from 'lucide-react';
import { Button } from '@/shared/components/ui/button';
import { Input } from '@/shared/components/ui/input';
import { Label } from '@/shared/components/ui/label';
import { userService } from '../../services/user-api';
import { toast } from 'sonner';
import { useLogout } from '../../hooks/use-auth';
import { cn } from '@/shared/lib/utils';

const changePasswordSchema = z.object({
  oldPassword: z.string().min(1, "Vui lòng nhập mật khẩu hiện tại"),
  newPassword: z.string().min(6, "Mật khẩu mới phải có ít nhất 6 ký tự"),
  confirmPassword: z.string().min(1, "Vui lòng xác nhận mật khẩu mới"),
}).refine((data) => data.newPassword === data.confirmPassword, {
  message: "Mật khẩu xác nhận không khớp",
  path: ["confirmPassword"],
});

type ChangePasswordValues = z.infer<typeof changePasswordSchema>;

interface SecurityTabProps {
  user: any;
}

export const SecurityTab: React.FC<SecurityTabProps> = ({ user }) => {
  const [showOld, setShowOld] = useState(false);
  const [showNew, setShowNew] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const logout = useLogout();

  const isGoogleUser = user?.provider === 'GOOGLE';

  const {
    register,
    handleSubmit,
    reset,
    setError,
    formState: { errors },
  } = useForm<ChangePasswordValues>({
    resolver: zodResolver(changePasswordSchema),
  });

  const onSubmit = async (data: ChangePasswordValues) => {
    try {
      setIsLoading(true);
      await userService.changePassword({
        oldPassword: data.oldPassword,
        newPassword: data.newPassword
      });
      toast.success("Đổi mật khẩu thành công! Vui lòng đăng nhập lại.");
      reset();
      // Logout after password change for security
      setTimeout(() => logout(), 2000);
    } catch (error: any) {
      const message = error.response?.data?.message;
      if (message === "Invalid password") {
        setError("oldPassword", { message: "Mật khẩu cũ không chính xác" });
      } else {
        toast.error(message || "Có lỗi xảy ra, vui lòng thử lại");
      }
    } finally {
      setIsLoading(false);
    }
  };

  if (isGoogleUser) {
    return (
      <div className="bg-white p-8 md:p-12 rounded-[32px] md:rounded-[48px] border border-zinc-100 shadow-sm max-w-2xl mx-auto">
        <div className="flex flex-col items-center text-center">
          <div className="bg-blue-50 p-6 rounded-full mb-6">
            <svg className="h-10 w-10 text-blue-500" viewBox="0 0 48 48">
              <path fill="#EA4335" d="M24 9.5c3.54 0 6.71 1.22 9.21 3.6l6.85-6.85C35.9 2.38 30.47 0 24 0 14.62 0 6.51 5.38 2.56 13.22l7.98 6.19C12.43 13.72 17.74 9.5 24 9.5z"/>
              <path fill="#4285F4" d="M46.98 24.55c0-1.57-.15-3.09-.38-4.55H24v9.02h12.94c-.58 2.96-2.26 5.48-4.78 7.18l7.73 6c4.51-4.18 7.09-10.36 7.09-17.65z"/>
              <path fill="#FBBC05" d="M10.53 28.59c-.48-1.45-.76-2.99-.76-4.59s.27-3.14.76-4.59l-7.98-6.19C.92 16.46 0 20.12 0 24c0 3.88.92 7.54 2.56 10.78l7.97-6.19z"/>
              <path fill="#34A853" d="M24 48c6.48 0 11.93-2.13 15.89-5.81l-7.73-6c-2.15 1.45-4.92 2.3-8.16 2.3-6.26 0-11.57-4.22-13.47-9.91l-7.98 6.19C6.51 42.62 14.62 48 24 48z"/>
            </svg>
          </div>
          <h2 className="text-2xl font-black text-zinc-900 mb-2">Tài khoản liên kết Google</h2>
          <p className="text-zinc-500 font-medium max-w-md mx-auto mb-8">
            Bạn đang đăng nhập bằng tài khoản Google. Mật khẩu được quản lý trực tiếp bởi Google để đảm bảo an toàn tối đa cho bạn.
          </p>
          <div className="flex items-center gap-2 p-4 bg-zinc-50 rounded-2xl border border-zinc-100 text-zinc-600 text-sm italic">
            <AlertCircle size={18} className="text-zinc-400" />
            Bạn không cần và không thể đổi mật khẩu tại đây.
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white p-8 md:p-12 rounded-[32px] md:rounded-[48px] border border-zinc-100 shadow-sm max-w-2xl mx-auto">
      <div className="flex items-center gap-4 mb-10 text-left">
        <div className="bg-hanoi-red/10 p-3 rounded-2xl">
          <Shield className="h-8 w-8 text-hanoi-red" />
        </div>
        <div>
          <h2 className="text-2xl font-black text-zinc-900 leading-none">Đổi mật khẩu</h2>
          <p className="text-zinc-500 font-medium text-sm mt-2">Cập nhật mật khẩu để bảo vệ thông tin của bạn</p>
        </div>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6 text-left">
        <div className="space-y-2">
          <Label htmlFor="oldPassword">Mật khẩu hiện tại</Label>
          <div className="relative">
            <Input
              id="oldPassword"
              type={showOld ? "text" : "password"}
              placeholder="••••••••"
              {...register("oldPassword")}
              className={cn(
                "pr-10 h-14 rounded-2xl border-zinc-200 focus:border-hanoi-red focus:ring-hanoi-red",
                errors.oldPassword && "border-red-500 focus:border-red-500 focus:ring-red-500 text-red-500"
              )}
            />
            <button
              type="button"
              onClick={() => setShowOld(!showOld)}
              className="absolute right-4 top-1/2 -translate-y-1/2 text-zinc-400 hover:text-hanoi-red transition-colors"
            >
              {showOld ? <EyeOff size={20} /> : <Eye size={20} />}
            </button>
          </div>
          {errors.oldPassword && (
            <p className="text-sm text-red-500 font-medium pl-2">{errors.oldPassword.message}</p>
          )}
        </div>

        <div className="space-y-2">
          <Label htmlFor="newPassword">Mật khẩu mới</Label>
          <div className="relative">
            <Input
              id="newPassword"
              type={showNew ? "text" : "password"}
              placeholder="••••••••"
              {...register("newPassword")}
              className="pr-10 h-14 rounded-2xl border-zinc-200 focus:border-hanoi-red focus:ring-hanoi-red"
            />
            <button
              type="button"
              onClick={() => setShowNew(!showNew)}
              className="absolute right-4 top-1/2 -translate-y-1/2 text-zinc-400 hover:text-hanoi-red transition-colors"
            >
              {showNew ? <EyeOff size={20} /> : <Eye size={20} />}
            </button>
          </div>
          {errors.newPassword && (
            <p className="text-sm text-red-500 font-medium pl-2">{errors.newPassword.message}</p>
          )}
        </div>

        <div className="space-y-2">
          <Label htmlFor="confirmPassword">Xác nhận mật khẩu mới</Label>
          <div className="relative">
            <Input
              id="confirmPassword"
              type={showConfirm ? "text" : "password"}
              placeholder="••••••••"
              {...register("confirmPassword")}
              className="pr-10 h-14 rounded-2xl border-zinc-200 focus:border-hanoi-red focus:ring-hanoi-red"
            />
            <button
              type="button"
              onClick={() => setShowConfirm(!showConfirm)}
              className="absolute right-4 top-1/2 -translate-y-1/2 text-zinc-400 hover:text-hanoi-red transition-colors"
            >
              {showConfirm ? <EyeOff size={20} /> : <Eye size={20} />}
            </button>
          </div>
          {errors.confirmPassword && (
            <p className="text-sm text-red-500 font-medium pl-2">{errors.confirmPassword.message}</p>
          )}
        </div>

        <Button 
          type="submit" 
          disabled={isLoading}
          className="w-full bg-zinc-900 hover:bg-zinc-800 text-white font-black h-16 rounded-2xl shadow-xl shadow-zinc-200 transition-all active:scale-[0.98] mt-4"
        >
          {isLoading ? (
            <div className="flex items-center gap-2">
              <Loader2 className="h-5 w-5 animate-spin" />
              <span>Đang xử lý...</span>
            </div>
          ) : (
            <div className="flex items-center gap-2">
              <Check className="h-5 w-5" />
              <span>Xác nhận đổi mật khẩu</span>
            </div>
          )}
        </Button>
      </form>
    </div>
  );
};
