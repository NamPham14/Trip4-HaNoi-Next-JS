/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { useLogin, useGoogleLoginHook } from "../hooks/use-auth";
import { Button } from "@/shared/components/ui/button";
import { Input } from "@/shared/components/ui/input";
import { Label } from "@/shared/components/ui/label";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/shared/components/ui/card";
import Link from "next/link";
import { toast } from "sonner";
import { Loader2, MapPin, Eye, EyeOff } from "lucide-react";
import { useState } from "react";
import { GoogleLogin } from '@react-oauth/google';

const loginSchema = z.object({
  email: z.string().email("Email không hợp lệ"),
  password: z.string().min(6, "Mật khẩu ít nhất 6 ký tự"),
});

type LoginFormValues = z.infer<typeof loginSchema>;

export const LoginForm = () => {
  const loginMutation = useLogin();
  const googleLoginMutation = useGoogleLoginHook();
  const [showPassword, setShowPassword] = useState(false);
  
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginFormValues>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  const onSubmit = (data: LoginFormValues) => {
    loginMutation.mutate(data, {
      onError: (error: any) => {
        toast.error(error.response?.data?.message || "Đăng nhập thất bại. Vui lòng thử lại.");
      },
    });
  };

  return (
    <Card className="w-full max-w-md border-hanoi-gold shadow-xl bg-white/80 backdrop-blur-sm">
      <CardHeader className="space-y-1 text-center">
        <div className="flex justify-center mb-2">
          <div className="bg-hanoi-red p-3 rounded-full">
            <MapPin className="h-6 w-6 text-hanoi-cream" />
          </div>
        </div>
        <CardTitle className="text-3xl font-bold text-hanoi-red tracking-tight">
          Trip4Hanoi
        </CardTitle>
        <CardDescription className="text-zinc-500 font-medium">
          Chào mừng bạn quay lại với Thủ đô
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="email" className="text-zinc-700">Email</Label>
            <Input
              id="email"
              type="email"
              placeholder="example@gmail.com"
              {...register("email")}
              className="border-zinc-200 focus:border-hanoi-red focus:ring-hanoi-red"
            />
            {errors.email && (
              <p className="text-sm text-destructive font-medium">{errors.email.message}</p>
            )}
          </div>
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <Label htmlFor="password" className="text-zinc-700">Mật khẩu</Label>
              <Link
                href="/forgot-password"
                className="text-xs text-hanoi-red hover:underline font-medium"
              >
                Quên mật khẩu?
              </Link>
            </div>
            <div className="relative">
              <Input
                id="password"
                type={showPassword ? "text" : "password"}
                placeholder="••••••••"
                {...register("password")}
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
            {errors.password && (
              <p className="text-sm text-destructive font-medium">{errors.password.message}</p>
            )}
          </div>
          <Button
            type="submit"
            className="w-full bg-hanoi-red hover:bg-[#6D1616] text-white py-6 rounded-xl text-lg font-semibold transition-all duration-200 shadow-md"
            disabled={loginMutation.isPending}
          >
            {loginMutation.isPending ? (
              <>
                <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                Đang xử lý...
              </>
            ) : (
              "Đăng nhập ngay"
            )}
          </Button>
        </form>
      </CardContent>
      <CardFooter className="flex flex-col space-y-4">
        <div className="relative w-full">
          <div className="absolute inset-0 flex items-center">
            <span className="w-full border-t border-zinc-200" />
          </div>
          <div className="relative flex justify-center text-xs uppercase">
            <span className="bg-white px-2 text-zinc-500 font-medium">Hoặc đăng nhập với</span>
          </div>
        </div>
        <div className="flex justify-center w-full">
          <GoogleLogin
            onSuccess={credentialResponse => {
              if (credentialResponse.credential) {
                googleLoginMutation.mutate(credentialResponse.credential);
              }
            }}
            onError={() => {
              toast.error("Đăng nhập Google thất bại.");
            }}
            useOneTap
            shape="rectangular"
            theme="outline"
            text="signin_with"
            size="large"
            width="100%"
          />
        </div>
        <p className="text-center text-sm text-zinc-600">
          Chưa có tài khoản?{" "}
          <Link href="/register" className="text-hanoi-red font-bold hover:underline">
            Đăng ký ngay
          </Link>
        </p>
      </CardFooter>
    </Card>
  );
};
