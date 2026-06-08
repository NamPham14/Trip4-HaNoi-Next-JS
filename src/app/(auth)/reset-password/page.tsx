import { ResetPasswordForm } from "@/features/auth/components/reset-password-form";
import { Metadata } from "next";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";

export const metadata: Metadata = {
  title: "Đặt lại mật khẩu | Trip4Hanoi",
  description: "Thiết lập mật khẩu mới cho tài khoản Trip4Hanoi",
};

export default function ResetPasswordPage() {
  return (
    <div className="min-h-screen w-full flex items-center justify-center p-4 relative overflow-hidden bg-hanoi-cream">
      <Link 
        href="/forgot-password" 
        className="absolute top-6 left-6 md:top-10 md:left-10 z-20 flex items-center gap-2 text-zinc-500 hover:text-hanoi-red transition-all font-bold group"
      >
        <div className="bg-white p-2 rounded-full shadow-md group-hover:shadow-lg transition-all">
          <ArrowLeft className="h-5 w-5 group-hover:-translate-x-1 transition-transform" />
        </div>
        <span className="hidden sm:inline">Quay lại nhập email</span>
      </Link>

      <div className="absolute top-[-10%] right-[-10%] w-[40%] h-[40%] rounded-full bg-hanoi-gold/20 blur-3xl" />
      <div className="absolute bottom-[-10%] left-[-10%] w-[40%] h-[40%] rounded-full bg-hanoi-red/10 blur-3xl" />
      
      <div className="relative z-10 w-full flex justify-center">
        <ResetPasswordForm />
      </div>
      
      <div className="absolute bottom-6 left-0 right-0 text-center">
        <p className="text-zinc-400 text-xs font-medium">
          © 2026 Trip4Hanoi - Tinh hoa ẩm thực & văn hóa Thủ đô
        </p>
      </div>
    </div>
  );
}
