"use client";

import React from 'react';
import { Shield, Plus, MoreVertical, Edit2, Trash2 } from 'lucide-react';
import { Button } from '@/shared/components/ui/button';
import { Badge } from '@/shared/components/ui/badge';

const mockRoles = [
  { id: 1, name: 'ADMIN', description: 'Toàn quyền hệ thống', usersCount: 2, permissions: ['ALL_ACCESS'] },
  { id: 2, name: 'STAFF', description: 'Quản lý dữ liệu địa điểm, sự kiện', usersCount: 5, permissions: ['READ_PLACE', 'WRITE_PLACE', 'READ_EVENT', 'WRITE_EVENT'] },
  { id: 3, name: 'USER', description: 'Người dùng cuối', usersCount: 1200, permissions: ['VIEW_PUBLIC'] },
];

export default function RoleManagementPage() {
  return (
    <div className="p-8">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-2xl font-bold flex items-center gap-2">
            <Shield className="text-primary" />
            Quản lý Vai trò & Quyền hạn
          </h1>
          <p className="text-gray-500">Phân quyền chi tiết cho các nhóm người dùng trong hệ thống.</p>
        </div>
        <Button className="flex items-center gap-2">
          <Plus size={18} />
          Thêm vai trò mới
        </Button>
      </div>

      <div className="bg-white rounded-xl border shadow-sm overflow-hidden">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-gray-50 border-b">
              <th className="px-6 py-4 text-sm font-semibold text-gray-600">Vai trò</th>
              <th className="px-6 py-4 text-sm font-semibold text-gray-600">Mô tả</th>
              <th className="px-6 py-4 text-sm font-semibold text-gray-600">Số người dùng</th>
              <th className="px-6 py-4 text-sm font-semibold text-gray-600">Quyền hạn chính</th>
              <th className="px-6 py-4 text-sm font-semibold text-gray-600 text-right">Thao tác</th>
            </tr>
          </thead>
          <tbody className="divide-y">
            {mockRoles.map((role) => (
              <tr key={role.id} className="hover:bg-gray-50 transition-colors">
                <td className="px-6 py-4 font-bold text-gray-900">{role.name}</td>
                <td className="px-6 py-4 text-sm text-gray-500">{role.description}</td>
                <td className="px-6 py-4 text-sm text-gray-500">{role.usersCount}</td>
                <td className="px-6 py-4">
                  <div className="flex flex-wrap gap-1">
                    {role.permissions.slice(0, 2).map(p => (
                      <Badge key={p} variant="secondary" className="text-[10px]">{p}</Badge>
                    ))}
                    {role.permissions.length > 2 && (
                      <Badge variant="outline" className="text-[10px]">+{role.permissions.length - 2}</Badge>
                    )}
                  </div>
                </td>
                <td className="px-6 py-4 text-right">
                   <div className="flex justify-end gap-2">
                     <Button variant="ghost" size="icon"><Edit2 size={16} /></Button>
                     <Button variant="ghost" size="icon" className="text-red-500 hover:text-red-600"><Trash2 size={16} /></Button>
                   </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
