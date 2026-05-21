import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { 
  LayoutDashboard, 
  MapPin, 
  Calendar, 
  Users, 
  ShieldCheck, 
  Settings,
  Tags,
  MessageSquare,
  Star,
  AlertTriangle,
  CreditCard
} from 'lucide-react';
import { cn } from '@/shared/lib/utils';
import { useAuthStore } from '@/shared/store/auth-store';

const menuItems = [
  { icon: LayoutDashboard, label: 'Dashboard', href: '/admin', roles: ['ADMIN', 'STAFF'] },
  { icon: MapPin, label: 'Địa điểm', href: '/admin/places', roles: ['ADMIN', 'STAFF'] },
  { icon: Calendar, label: 'Lịch trình', href: '/admin/itineraries', roles: ['ADMIN', 'STAFF'] },
  { icon: Calendar, label: 'Sự kiện', href: '/admin/events', roles: ['ADMIN', 'STAFF'] },
  { icon: Tags, label: 'Danh mục', href: '/admin/categories', roles: ['ADMIN', 'STAFF'] },
  { icon: MessageSquare, label: 'Bài viết', href: '/admin/posts', roles: ['ADMIN', 'STAFF'] },
  { icon: MessageSquare, label: 'Hỗ trợ trực tuyến', href: '/admin/chat', roles: ['ADMIN', 'STAFF'] },
  { icon: MessageSquare, label: 'Bình luận', href: '/admin/comments', roles: ['ADMIN', 'STAFF'] },
  { icon: Star, label: 'Đánh giá (Review)', href: '/admin/reviews', roles: ['ADMIN', 'STAFF'] },
  { icon: AlertTriangle, label: 'Báo cáo vi phạm', href: '/admin/reports', roles: ['ADMIN', 'STAFF'] },
  { icon: CreditCard, label: 'Giao dịch', href: '/admin/payments', roles: ['ADMIN', 'STAFF'] },
  { icon: Users, label: 'Người dùng', href: '/admin/users', roles: ['ADMIN'] },
  { icon: ShieldCheck, label: 'Quản lý Vai trò', href: '/admin/roles', roles: ['ADMIN'] },
  { icon: ShieldCheck, label: 'Quản lý Quyền', href: '/admin/permissions', roles: ['ADMIN'] },
];

export function AdminSidebar() {
  const pathname = usePathname();
  const { user } = useAuthStore();
  const userRoles = user?.roles.map(r => r.name) || [];

  const filteredMenuItems = menuItems.filter(item => 
    item.roles.some(role => userRoles.includes(role))
  );

  return (
    <div className="w-64 bg-white border-r h-screen flex flex-col sticky top-0">
      <div className="p-6 border-b">
        <h2 className="text-xl font-bold text-primary">Trip4Hanoi Admin</h2>
      </div>
      <nav className="flex-1 overflow-y-auto p-4 space-y-2">
        {filteredMenuItems.map((item) => (
          <Link
            key={item.href}
            href={item.href}
            className={cn(
              "flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium transition-colors",
              pathname.startsWith(item.href)
                ? "bg-primary text-white"
                : "text-gray-600 hover:bg-gray-100"
            )}
          >
            <item.icon size={20} />
            {item.label}
          </Link>
        ))}
      </nav>
      <div className="p-4 border-t">
        <button className="flex items-center gap-3 px-4 py-3 w-full rounded-lg text-sm font-medium text-red-600 hover:bg-red-50 transition-colors">
          <Settings size={20} />
          Cài đặt hệ thống
        </button>
      </div>
    </div>
  );
}
