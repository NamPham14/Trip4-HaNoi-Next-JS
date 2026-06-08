/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { useResetPassword } from "../hooks/use-auth";
import { Button } from "@/shared/components/ui/button";
import { Input } from "@/shared/components/ui/input";
import { Label } from "@/shared/components/ui/label";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/shared/components/ui/card";
import Link from "next/link";
import { Loader2, KeyRound, Eye, EyeOff } from "lucide-react";
import { useState } from "react";

const resetPasswordSchema = z.object({
  token: z.string().min(6, "Mã OTP gồm 6 chữ số"),
  newPassword: z.string().min(6, "Mật khẩu ít nhất 6 ký tự"),
  confirmPassword: z.string()
}).refine((data) => data.newPassword === data.confirmPassword, {
  message: "Mật khẩu xác nhận không khớp",
  path: ["confirmPassword"],
});

type ResetPasswordFormValues = z.infer<typeof resetPasswordSchema>;

export const ResetPasswordForm = () => {
  const resetPasswordMutation = useResetPassword();
  const [showPassword, setShowPassword] = useState(false);
  
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<ResetPasswordFormValues>({
    resolver: zodResolver(resetPasswordSchema),
    defaultValues: {
      token: "",
      newPassword: "",
      confirmPassword: "",
    },
  });

  const onSubmit = (data: ResetPasswordFormValues) => {
    resetPasswordMutation.mutate({
      token: data.token,
      newPassword: data.newPassword,
    });
  };

  return (
    <Card className="w-full max-w-md border-hanoi-gold shadow-xl bg-white/80 backdrop-blur-sm">
      <CardHeader className="space-y-1 text-center">
        <div className="flex justify-center mb-2">
          <div className="bg-hanoi-red p-3 rounded-full">
            <KeyRound className="h-6 w-6 text-hanoi-cream" />
          </div>
        </div>
        <CardTitle className="text-3xl font-bold text-hanoi-red tracking-tight">
          Đặt lại mật khẩu
        </CardTitle>
        <CardDescription className="text-zinc-500 font-medium">
          Nhập mã OTP và mật khẩu mới của bạn
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="token" className="text-zinc-700">Mã OTP</Label>
            <Input
              id="token"
              type="text"
              placeholder="123456"
              {...register("token")}
              className="border-zinc-200 focus:border-hanoi-red focus:ring-hanoi-red"
            />
            {errors.token && (
              <p className="text-sm text-destructive font-medium">{errors.token.message}</p>
            )}
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="newPassword" className="text-zinc-700">Mật khẩu mới</Label>
            <div className="relative">
              <Input
                id="newPassword"
                type={showPassword ? "text" : "password"}
                placeholder="••••••••"
                {...register("newPassword")}
                className="border-zinc-200 focus:border-hanoi-red focus:ring-hanoi-red pr-10"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-zinc-400 hover:text-hanoi-red transition-colors"
              >
                {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>
            {errors.newPassword && (
              <p className="text-sm text-destructive font-medium">{errors.newPassword.message}</p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="confirmPassword" className="text-zinc-700">Xác nhận mật khẩu mới</Label>
            <Input
              id="confirmPassword"
              type={showPassword ? "text" : "password"}
              placeholder="••••••••"
              {...register("confirmPassword")}
              className="border-zinc-200 focus:border-hanoi-red focus:ring-hanoi-red"
            />
            {errors.confirmPassword && (
              <p className="text-sm text-destructive font-medium">{errors.confirmPassword.message}</p>
            )}
          </div>

          <Button
            type="submit"
            className="w-full bg-hanoi-red hover:bg-[#6D1616] text-white py-6 rounded-xl text-lg font-semibold transition-all duration-200 shadow-md"
            disabled={resetPasswordMutation.isPending}
          >
            {resetPasswordMutation.isPending ? (
              <>
                <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                Đang xử lý...
              </>
            ) : (
              "Xác nhận thay đổi"
            )}
          </Button>
        </form>
      </CardContent>
      <CardFooter className="flex justify-center">
        <Link href="/forgot-password" className="text-sm text-hanoi-red font-medium hover:underline">
          Gửi lại mã OTP?
        </Link>
      </CardFooter>
    </Card>
  );
};
