import React from 'react';
import Link from 'next/link';
import { Button } from '@/shared/components/ui/button';

export default function UnauthorizedPage() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50 px-4">
      <h1 className="text-9xl font-extrabold text-blue-600 tracking-widest">401</h1>
      <div className="bg-blue-600 text-white px-2 text-sm rounded rotate-12 absolute">
        Phiên đăng nhập hết hạn
      </div>
      <div className="mt-8 text-center">
        <h3 className="text-2xl font-semibold md:text-3xl">Bạn cần đăng nhập để tiếp tục.</h3>
        <p className="mt-4 text-gray-500">Phiên làm việc của bạn đã hết hạn hoặc bạn chưa đăng nhập.</p>
        <div className="mt-6 flex gap-4 justify-center">
          <Link href="/login">
            <Button variant="default">Đăng nhập ngay</Button>
          </Link>
          <Link href="/">
            <Button variant="outline">Quay lại trang chủ</Button>
          </Link>
        </div>
      </div>
    </div>
  );
}
