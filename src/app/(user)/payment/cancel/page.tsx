'use client'

import React from 'react';
import { XCircle, RefreshCcw, Home } from 'lucide-react';
import Link from 'next/link';

export default function PaymentCancelPage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4">
      <div className="max-w-md w-full bg-white rounded-3xl shadow-xl p-8 text-center animate-in fade-in zoom-in duration-500">
        <div className="w-20 h-20 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-6">
          <XCircle className="w-12 h-12 text-red-600" />
        </div>
        
        <h1 className="text-3xl font-bold text-zinc-900 mb-2">Đã hủy thanh toán</h1>
        <p className="text-zinc-600 mb-8">
          Giao dịch đã bị hủy. Đừng lo lắng, tiền của bạn vẫn chưa bị trừ. 
          Bạn có thể thử lại hoặc quay lại trang chủ.
        </p>

        <div className="space-y-4">
          <Link 
            href="/pricing"
            className="w-full bg-hanoi-red text-white py-4 rounded-2xl font-bold flex items-center justify-center gap-2 hover:bg-[#6D1616] transition"
          >
            Thử lại <RefreshCcw className="w-5 h-5" />
          </Link>
          
          <Link 
            href="/"
            className="w-full bg-white border-2 border-zinc-100 text-zinc-900 py-4 rounded-2xl font-bold flex items-center justify-center gap-2 hover:bg-zinc-50 transition"
          >
            Quay lại trang chủ <Home className="w-5 h-5" />
          </Link>
        </div>
      </div>
    </div>
  );
}
