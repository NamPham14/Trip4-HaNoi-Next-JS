/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import React, { useState, useEffect, useCallback } from 'react';
import { 
  Users, 
} from 'lucide-react';
import { DataTable } from '@/shared/components/ui/table-data';
import { ColumnDef } from '@tanstack/react-table';
import { userManagementService } from '@/features/auth/services/user-management-api';
import { securityService } from '@/features/security/services/security-service';
import { UserManagement } from '@/features/auth/types/user-management';
import { Role } from '@/features/security/types/security';
import { DeleteConfirmDialog } from '@/shared/components/ui/delete-confirm-dialog';
import { CrudModal } from '@/shared/components/ui/crud-modal';
import { DetailModal } from '@/shared/components/ui/detail-modal';
import { toast } from 'sonner';
import { StatusBadge } from '@/shared/components/ui/status-badge';
import { AdminFilters } from '@/shared/components/ui/admin-filters';
import { TableActions } from '@/shared/components/ui/table-actions';
import Image from 'next/image';
import { UserForm } from '@/features/auth/components/UserForm';

export default function UserManagementPage() {
  const [data, setData] = useState<UserManagement[]>([]);
  const [allRoles, setAllRoles] = useState<Role[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [pageIndex, setPageIndex] = useState(0);
  const [pageCount, setPageCount] = useState(0);
  const [totalElements, setTotalElements] = useState(0);

  const [isDeleteOpen, setIsDeleteOpen] = useState(false);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [isDetailOpen, setIsDetailOpen] = useState(false);
  const [selectedItem, setSelectedItem] = useState<UserManagement | null>(null);
  const [formLoading, setFormLoading] = useState(false);

  const fetchUsers = useCallback(async () => {
    try {
      setLoading(true);
      const res = await userManagementService.getUsers({
        keyword: searchTerm,
        page: pageIndex + 1,
        size: 10,
        sort: "id:desc"
      });
      setData(res.data);
      setPageCount(res.totalPages);
      setTotalElements(res.totalElements);
    } catch (error) {
      toast.error("Lỗi tải danh sách người dùng");
    } finally {
      setLoading(false);
    }
  }, [searchTerm, pageIndex]);

  useEffect(() => {
    const timer = setTimeout(() => fetchUsers(), 500);
    return () => clearTimeout(timer);
  }, [fetchUsers]);

  useEffect(() => {
    securityService.getRolesList().then(res => setAllRoles(res));
  }, []);

  const handleFormSuccess = () => {
    setIsFormOpen(false);
    fetchUsers();
  };

  const openForm = (item?: UserManagement) => {
    setSelectedItem(item || null);
    setIsFormOpen(true);
  };

  const columns: ColumnDef<UserManagement>[] = [
    { 
      accessorKey: "avatar", 
      header: "Người dùng",
      cell: ({ row }) => (
        <div className="flex items-center gap-3">
          <div className="relative w-10 h-10 rounded-full overflow-hidden border bg-gray-50">
            {row.original.avatar ? (
              <Image src={row.original.avatar} alt={row.original.username} fill className="object-cover" />
            ) : (
              <div className="w-full h-full flex items-center justify-center bg-gray-100 text-gray-400">
                <Users size={20} />
              </div>
            )}
          </div>
          <div>
            <div className="font-bold text-gray-900">{row.original.username}</div>
            <div className="text-xs text-gray-500">{row.original.email}</div>
          </div>
        </div>
      )
    },
    { 
      accessorKey: "roles", 
      header: "Vai trò",
      cell: ({ row }) => (
        <div className="flex flex-wrap gap-1">
          {row.original.roles.map(role => (
            <span key={role.id} className="bg-blue-50 text-blue-700 px-2 py-0.5 rounded text-[10px] font-bold border border-blue-100 uppercase">
              {role.name}
            </span>
          ))}
        </div>
      )
    },
    { 
      accessorKey: "status", 
      header: "Trạng thái",
      cell: ({ row }) => <StatusBadge status={row.original.status} type="user" />
    },
    {
      accessorKey: "createdAt",
      header: "Ngày tạo",
      cell: ({ row }) => <span className="text-xs text-gray-500">{new Date(row.original.createdAt).toLocaleDateString('vi-VN')}</span>
    },
    {
      id: "actions",
      header: () => <div className="text-right">Thao tác</div>,
      cell: ({ row }) => (
        <TableActions 
          onView={() => { setSelectedItem(row.original); setIsDetailOpen(true); }}
          onEdit={() => openForm(row.original)}
          onDelete={() => { setSelectedItem(row.original); setIsDeleteOpen(true); }}
          deleteTitle="Vô hiệu hóa"
        />
      ),
    },
  ];

  return (
    <div className="p-8 max-w-7xl mx-auto">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-2xl font-bold flex items-center gap-2"><Users className="text-primary" />Quản lý Người dùng</h1>
          <p className="text-gray-500">Quản lý tài khoản, phân quyền và trạng thái hoạt động.</p>
        </div>
      </div>

      <AdminFilters 
        searchTerm={searchTerm}
        onSearchChange={(val) => { setSearchTerm(val); setPageIndex(0); }}
        searchPlaceholder="Tìm theo tên, email..."
        onReset={() => {
          setSearchTerm('');
          setPageIndex(0);
        }}
        totalElements={totalElements}
        unitName="người dùng"
      />

      <DataTable 
        columns={columns} 
        data={data} 
        pageCount={pageCount} 
        pageIndex={pageIndex} 
        onPageChange={setPageIndex} 
        isLoading={loading} 
      />

      <DetailModal 
        isOpen={isDetailOpen} 
        onClose={() => setIsDetailOpen(false)} 
        title="Thông tin người dùng" 
        data={selectedItem} 
        fields={[
            { 
              label: "Avatar", 
              key: "avatar", 
              render: (val: string) => val ? <img src={val} className="w-16 h-16 rounded-full object-cover border" /> : "Chưa có"
            },
            { label: "ID", key: "id" },
            { label: "Username", key: "username" }, 
            { label: "Email", key: "email" },
            { label: "Quốc tịch", key: "nationality" },
            { label: "Ngôn ngữ", key: "language" },
            { label: "Trạng thái", key: "status" },
            { label: "Phương thức", key: "provider" },
            { label: "Ngày tham gia", key: "createdAt", render: (val: string) => new Date(val).toLocaleString('vi-VN') },
            { 
                label: "Quyền hạn", 
                key: "roles", 
                render: (val: Role[]) => (
                    <div className="flex flex-wrap gap-1">
                        {val?.map(r => <span key={r.id} className="text-[10px] bg-blue-50 text-blue-700 p-1 px-2 rounded border border-blue-100 font-bold">{r.name}</span>)}
                    </div>
                ) 
            }
        ]} 
      />

      <CrudModal 
        isOpen={isFormOpen} 
        onClose={() => setIsFormOpen(false)} 
        title="Cập nhật thông tin người dùng"
      >
        <UserForm 
          key={selectedItem?.id || 'new'}
          selectedItem={selectedItem}
          allRoles={allRoles}
          onSuccess={handleFormSuccess}
          onCancel={() => setIsFormOpen(false)}
        />
      </CrudModal>

      <DeleteConfirmDialog 
        isOpen={isDeleteOpen} 
        onClose={() => setIsDeleteOpen(false)} 
        title="Vô hiệu hóa tài khoản?" 
        description="Người dùng này sẽ không thể đăng nhập vào hệ thống cho đến khi được kích hoạt lại." 
        onConfirm={async () => {
           try {
             setFormLoading(true);
             await userManagementService.deleteUser(selectedItem!.id);
             toast.success("Đã vô hiệu hóa tài khoản");
             setIsDeleteOpen(false);
             fetchUsers();
           } catch (e: any) { toast.error("Lỗi khi vô hiệu hóa"); }
           finally { setFormLoading(false); }
        }} 
        isLoading={formLoading} 
      />
    </div>
  );
}
