/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { useRegister } from "../hooks/use-auth";
import { Button } from "@/shared/components/ui/button";
import { Input } from "@/shared/components/ui/input";
import { Label } from "@/shared/components/ui/label";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/shared/components/ui/card";
import { Checkbox } from "@/shared/components/ui/checkbox";
import Link from "next/link";
import { toast } from "sonner";
import { Loader2, UserPlus, Eye, EyeOff } from "lucide-react";
import { useState } from "react";

const registerSchema = z.object({
  username: z.string().min(3, "Tên đăng nhập ít nhất 3 ký tự"),
  email: z.string().email("Email không hợp lệ"),
  password: z.string().min(6, "Mật khẩu ít nhất 6 ký tự"),
  confirmPassword: z.string().min(6, "Xác nhận mật khẩu ít nhất 6 ký tự"),
  agreeTerms: z.boolean().refine((val) => val === true, {
    message: "Bạn cần đồng ý với điều khoản dịch vụ",
  }),
}).refine((data) => data.password === data.confirmPassword, {
  message: "Mật khẩu xác nhận không khớp",
  path: ["confirmPassword"],
});

type RegisterFormValues = z.infer<typeof registerSchema>;

export const RegisterForm = () => {
  const registerMutation = useRegister();
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  
  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors },
  } = useForm<RegisterFormValues>({
    resolver: zodResolver(registerSchema),
    defaultValues: {
      username: "",
      email: "",
      password: "",
      confirmPassword: "",
      agreeTerms: false,
    },
  });

  const onSubmit = (data: RegisterFormValues) => {
    const { username, email, password } = data;
    registerMutation.mutate({ username, email, password }, {
      onSuccess: () => {
        toast.success("Đăng ký thành công! Hãy đăng nhập.");
      },
      onError: (error: any) => {
        toast.error(error.response?.data?.message || "Đăng ký thất bại. Vui lòng thử lại.");
      },
    });
  };

  return (
    <Card className="w-full max-w-md border-hanoi-gold shadow-xl bg-white/80 backdrop-blur-sm">
      <CardHeader className="space-y-1 text-center">
        <div className="flex justify-center mb-2">
          <div className="bg-hanoi-red p-3 rounded-full">
            <UserPlus className="h-6 w-6 text-hanoi-cream" />
          </div>
        </div>
        <CardTitle className="text-3xl font-bold text-hanoi-red tracking-tight">
          Tham gia Trip4Hanoi
        </CardTitle>
        <CardDescription className="text-zinc-500 font-medium">
          Khám phá Hà Nội theo cách của riêng bạn
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="username" className="text-zinc-700">Tên đăng nhập</Label>
            <Input
              id="username"
              placeholder="Username của bạn"
              {...register("username")}
              className="border-zinc-200 focus:border-hanoi-red focus:ring-hanoi-red"
            />
            {errors.username && (
              <p className="text-sm text-destructive font-medium">{errors.username.message}</p>
            )}
          </div>
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
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="password" className="text-zinc-700">Mật khẩu</Label>
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
                  {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
              {errors.password && (
                <p className="text-xs text-destructive font-medium">{errors.password.message}</p>
              )}
            </div>
            <div className="space-y-2">
              <Label htmlFor="confirmPassword" className="text-zinc-700">Xác nhận</Label>
              <div className="relative">
                <Input
                  id="confirmPassword"
                  type={showConfirmPassword ? "text" : "password"}
                  placeholder="••••••••"
                  {...register("confirmPassword")}
                  className="border-zinc-200 focus:border-hanoi-red focus:ring-hanoi-red pr-10"
                />
                <button
                  type="button"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-zinc-400 hover:text-hanoi-red transition-colors"
                >
                  {showConfirmPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
              {errors.confirmPassword && (
                <p className="text-xs text-destructive font-medium">{errors.confirmPassword.message}</p>
              )}
            </div>
          </div>
          <div className="flex items-start space-x-2 pt-2">
            <Checkbox 
              id="terms" 
              checked={watch("agreeTerms")}
              onCheckedChange={(checked) => setValue("agreeTerms", checked as boolean)}
              className="mt-1 border-zinc-300 data-[state=checked]:bg-hanoi-red data-[state=checked]:border-hanoi-red"
            />
            <Label htmlFor="terms" className="text-xs text-zinc-600 leading-normal">
              Tôi đồng ý với{" "}
              <Link href="/terms" className="text-hanoi-red hover:underline font-medium">
                Điều khoản
              </Link>{" "}
              &{" "}
              <Link href="/privacy" className="text-hanoi-red hover:underline font-medium">
                Chính sách
              </Link>
            </Label>
          </div>
          {errors.agreeTerms && (
            <p className="text-xs text-destructive font-medium">{errors.agreeTerms.message}</p>
          )}
          <Button
            type="submit"
            className="w-full bg-hanoi-red hover:bg-[#6D1616] text-white py-6 rounded-xl text-lg font-semibold transition-all duration-200 shadow-md mt-4"
            disabled={registerMutation.isPending}
          >
            {registerMutation.isPending ? (
              <>
                <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                Đang tạo...
              </>
            ) : (
              "Đăng ký ngay"
            )}
          </Button>
        </form>
      </CardContent>
      <CardFooter>
        <p className="w-full text-center text-sm text-zinc-600">
          Đã có tài khoản?{" "}
          <Link href="/login" className="text-hanoi-red font-bold hover:underline">
            Đăng nhập
          </Link>
        </p>
      </CardFooter>
    </Card>
  );
};
