import { LoginForm } from "@/features/auth/components/login-form";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Đăng nhập | Trip4Hanoi",
  description: "Đăng nhập vào hệ thống Trip4Hanoi",
};

export default function LoginPage() {
  return (
    <div className="min-h-screen w-full flex items-center justify-center p-4 relative overflow-hidden bg-hanoi-cream">
      {/* Hanoi-style decorative elements (Abstract) */}
      <div className="absolute top-[-10%] right-[-10%] w-[40%] h-[40%] rounded-full bg-hanoi-gold/20 blur-3xl" />
      <div className="absolute bottom-[-10%] left-[-10%] w-[40%] h-[40%] rounded-full bg-hanoi-red/10 blur-3xl" />
      
      {/* Texture pattern (Optional, simulated with CSS) */}
      <div className="absolute inset-0 opacity-[0.03] pointer-events-none" 
           style={{ backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%238b1d1d' fill-opacity='1'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")` }} 
      />

      <div className="relative z-10 w-full flex justify-center">
        <LoginForm />
      </div>
      
      {/* Footer Branding */}
      <div className="absolute bottom-6 left-0 right-0 text-center">
        <p className="text-zinc-400 text-xs font-medium">
          © 2026 Trip4Hanoi - Tinh hoa ẩm thực & văn hóa Thủ đô
        </p>
      </div>
    </div>
  );
}
