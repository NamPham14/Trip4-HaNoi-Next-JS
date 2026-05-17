import React from 'react';
import Link from 'next/link';
import { Button } from '@/shared/components/ui/button';

export default function ForbiddenPage() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50 px-4">
      <h1 className="text-9xl font-extrabold text-red-600 tracking-widest">403</h1>
      <div className="bg-red-600 text-white px-2 text-sm rounded rotate-12 absolute">
        Truy cập bị từ chối
      </div>
      <div className="mt-8 text-center">
        <h3 className="text-2xl font-semibold md:text-3xl">Bạn không có quyền truy cập trang này.</h3>
        <p className="mt-4 text-gray-500">Vui lòng liên hệ quản trị viên nếu bạn cho rằng đây là một sự nhầm lẫn.</p>
        <div className="mt-6">
          <Link href="/">
            <Button variant="default">Quay lại trang chủ</Button>
          </Link>
        </div>
      </div>
    </div>
  );
}
