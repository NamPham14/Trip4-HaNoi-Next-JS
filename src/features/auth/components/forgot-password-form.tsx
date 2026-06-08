/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { useForgotPassword } from "../hooks/use-auth";
import { Button } from "@/shared/components/ui/button";
import { Input } from "@/shared/components/ui/input";
import { Label } from "@/shared/components/ui/label";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/shared/components/ui/card";
import Link from "next/link";
import { Loader2, Mail } from "lucide-react";

const forgotPasswordSchema = z.object({
  email: z.string().email("Email không hợp lệ"),
});

type ForgotPasswordFormValues = z.infer<typeof forgotPasswordSchema>;

export const ForgotPasswordForm = () => {
  const forgotPasswordMutation = useForgotPassword();
  
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<ForgotPasswordFormValues>({
    resolver: zodResolver(forgotPasswordSchema),
    defaultValues: {
      email: "",
    },
  });

  const onSubmit = (data: ForgotPasswordFormValues) => {
    forgotPasswordMutation.mutate(data);
  };

  return (
    <Card className="w-full max-w-md border-hanoi-gold shadow-xl bg-white/80 backdrop-blur-sm">
      <CardHeader className="space-y-1 text-center">
        <div className="flex justify-center mb-2">
          <div className="bg-hanoi-red p-3 rounded-full">
            <Mail className="h-6 w-6 text-hanoi-cream" />
          </div>
        </div>
        <CardTitle className="text-3xl font-bold text-hanoi-red tracking-tight">
          Quên mật khẩu
        </CardTitle>
        <CardDescription className="text-zinc-500 font-medium">
          Nhập email của bạn để nhận mã OTP đặt lại mật khẩu
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
          <Button
            type="submit"
            className="w-full bg-hanoi-red hover:bg-[#6D1616] text-white py-6 rounded-xl text-lg font-semibold transition-all duration-200 shadow-md"
            disabled={forgotPasswordMutation.isPending}
          >
            {forgotPasswordMutation.isPending ? (
              <>
                <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                Đang gửi...
              </>
            ) : (
              "Gửi mã OTP"
            )}
          </Button>
        </form>
      </CardContent>
      <CardFooter className="flex justify-center">
        <p className="text-sm text-zinc-600">
          Nhớ mật khẩu?{" "}
          <Link href="/login" className="text-hanoi-red font-bold hover:underline">
            Đăng nhập ngay
          </Link>
        </p>
      </CardFooter>
    </Card>
  );
};
