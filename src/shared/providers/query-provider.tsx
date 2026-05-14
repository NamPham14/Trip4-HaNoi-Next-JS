'use client';

import { useState } from 'react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ReactQueryDevtools } from '@tanstack/react-query-devtools';

/**
* Trình cung cấp truy vấn TanStack toàn cầu
*/
export default function QueryProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const [queryClient] = useState(
    () =>
      new QueryClient({
        defaultOptions: {
          queries: {
            staleTime: 5 * 60 * 1000, // Thời gian chờ mặc định là 5 phút
            gcTime: 10 * 60 * 1000,    // Thời gian lưu vào bộ nhớ cache: 10 phút
            retry: 1,                 // Thử lại một lần nữa nếu thất bại
            refetchOnWindowFocus: false, // Tránh tải lại trang khi chuyển đổi tab
          },
        },
      })
  );

  return (
    <QueryClientProvider client={queryClient}>
      {children}
      <ReactQueryDevtools initialIsOpen={false} />
    </QueryClientProvider>
  );
}
