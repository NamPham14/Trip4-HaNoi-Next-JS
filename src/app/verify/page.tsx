"use client";

import { useEffect, useState, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import { CheckCircle, XCircle, Loader2, ArrowRight } from "lucide-react";
import { Button } from "@/shared/components/ui/button";
import Link from "next/link";

function VerifyContent() {
  const searchParams = useSearchParams();
  const token = searchParams.get("token");
  
  const [status, setStatus] = useState<"loading" | "success" | "error">("loading");
  const [message, setMessage] = useState("");

  useEffect(() => {
    const verify = async () => {
      if (!token) {
        setStatus("error");
        setMessage("Mã xác thực không hợp lệ hoặc đã hết hạn.");
        return;
      }

      try {
        const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'https://api.trip4hanoi.online/api'}/auth/verify?token=${token}`);
        
        if (response.ok) {
          setStatus("success");
          setMessage("Tài khoản của bạn đã được xác thực thành công!");
        } else {
          const data = await response.json();
          setStatus("error");
          setMessage(data.message || "Xác thực thất bại. Vui lòng thử lại sau.");
        }
      } catch {
        setStatus("error");
        setMessage("Đã có lỗi xảy ra trong quá trình xác thực.");
      }
    };

    verify();
  }, [token]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4">
      <div className="max-w-md w-full bg-white rounded-2xl shadow-xl p-8 text-center border border-gray-100">
        {status === "loading" && (
          <div className="space-y-4">
            <Loader2 className="h-12 w-12 text-primary animate-spin mx-auto" />
            <h2 className="text-xl font-bold text-gray-900">Đang xác thực tài khoản</h2>
            <p className="text-gray-500 text-sm">Vui lòng chờ trong giây lát...</p>
          </div>
        )}

        {status === "success" && (
          <div className="space-y-6">
            <div className="bg-green-100 rounded-full w-20 h-20 flex items-center justify-center mx-auto">
              <CheckCircle className="h-12 w-12 text-green-600" />
            </div>
            <div className="space-y-2">
              <h2 className="text-2xl font-bold text-gray-900">Chúc mừng!</h2>
              <p className="text-gray-600">{message}</p>
            </div>
            <Button asChild className="w-full h-12 rounded-xl text-md font-bold group">
              <Link href="/login">
                Đăng nhập ngay
                <ArrowRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform" />
              </Link>
            </Button>
          </div>
        )}

        {status === "error" && (
          <div className="space-y-6">
            <div className="bg-red-100 rounded-full w-20 h-20 flex items-center justify-center mx-auto">
              <XCircle className="h-12 w-12 text-red-600" />
            </div>
            <div className="space-y-2">
              <h2 className="text-2xl font-bold text-gray-900">Xác thực thất bại</h2>
              <p className="text-gray-600">{message}</p>
            </div>
            <div className="grid grid-cols-1 gap-3">
              <Button asChild variant="outline" className="w-full h-12 rounded-xl">
                <Link href="/register">Đăng ký lại</Link>
              </Button>
              <Button asChild variant="ghost" className="w-full h-12 text-primary">
                <Link href="/">Quay lại trang chủ</Link>
              </Button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default function VerifyPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <Loader2 className="h-12 w-12 text-primary animate-spin" />
      </div>
    }>
      <VerifyContent />
    </Suspense>
  );
}
