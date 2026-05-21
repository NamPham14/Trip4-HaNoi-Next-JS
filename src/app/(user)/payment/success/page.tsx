'use client'

import React, { useEffect } from 'react';
import { CheckCircle2, ArrowRight, MessageSquare } from 'lucide-react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

export default function PaymentSuccessPage() {
  const router = useRouter();

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4">
      <div className="max-w-md w-full bg-white rounded-3xl shadow-xl p-8 text-center animate-in fade-in zoom-in duration-500">
        <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
          <CheckCircle2 className="w-12 h-12 text-green-600" />
        </div>
        
        <h1 className="text-3xl font-bold text-zinc-900 mb-2">Thanh toán thành công!</h1>
        <p className="text-zinc-600 mb-8">
          Chúc mừng! Tài khoản của bạn đã được nâng cấp lên gói <span className="font-bold text-hanoi-red">PRO</span>. 
          Hãy bắt đầu khám phá Hà Nội với sức mạnh AI mới nhé.
        </p>

        <div className="space-y-4">
          <Link 
            href="/"
            className="w-full bg-zinc-900 text-white py-4 rounded-2xl font-bold flex items-center justify-center gap-2 hover:bg-zinc-800 transition"
          >
            Quay lại trang chủ <ArrowRight className="w-5 h-5" />
          </Link>
          
          <button 
            onClick={() => {
              // Logic to open chat might be needed if using a global store
              router.push('/');
            }}
            className="w-full bg-white border-2 border-zinc-100 text-zinc-900 py-4 rounded-2xl font-bold flex items-center justify-center gap-2 hover:bg-zinc-50 transition"
          >
            Mở Chat AI ngay <MessageSquare className="w-5 h-5" />
          </button>
        </div>
      </div>
    </div>
  );
}
