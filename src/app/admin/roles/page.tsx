/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import React, { useState, useEffect, useCallback } from 'react';
import { ShieldAlert, Plus, Edit2, Trash2, Search, Eye } from 'lucide-react';
import { Button } from '@/shared/components/ui/button';
import { Input } from '@/shared/components/ui/input';
import { DataTable } from '@/shared/components/ui/table-data';
import { ColumnDef } from '@tanstack/react-table';
import { securityService } from '@/features/security/services/security-service';
import { Permission, Role } from '@/features/security/types/security';
import { DeleteConfirmDialog } from '@/shared/components/ui/delete-confirm-dialog';
import { CrudModal } from '@/shared/components/ui/crud-modal';
import { DetailModal } from '@/shared/components/ui/detail-modal';
import { toast } from 'sonner';
import { RoleForm, RoleFormData } from '@/features/security/components/RoleForm';

export default function RoleManagementPage() {
  const [data, setData] = useState<Role[]>([]);
  const [allPermissions, setAllPermissions] = useState<Permission[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [pageIndex, setPageIndex] = useState(0);
  const [pageCount, setPageCount] = useState(0);
  const [totalElements, setTotalElements] = useState(0);

  const [isDeleteOpen, setIsDeleteOpen] = useState(false);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [isDetailOpen, setIsDetailOpen] = useState(false);
  const [selectedItem, setSelectedItem] = useState<Role | null>(null);
  const [formLoading, setFormLoading] = useState(false);

  const fetchRoles = useCallback(async () => {
    try {
      setLoading(true);
      const res = await securityService.getRoles({
        keyword: searchTerm,
        page: pageIndex + 1,
        size: 10,
      });
      setData(res.data);
      setPageCount(res.totalPages);
      setTotalElements(res.totalElements);
    } catch (error) {
      toast.error("Lỗi tải danh sách vai trò");
    } finally {
      setLoading(false);
    }
  }, [searchTerm, pageIndex]);

  useEffect(() => {
    const timer = setTimeout(() => fetchRoles(), 500);
    return () => clearTimeout(timer);
  }, [fetchRoles]);

  useEffect(() => {
    securityService.getPermissions({ size: 100 }).then(res => setAllPermissions(res.data));
  }, []);

  const onSave = async (formData: RoleFormData) => {
    try {
      setFormLoading(true);
      if (selectedItem) {
        await securityService.updateRole(selectedItem.id, formData);
        toast.success("Cập nhật thành công");
      } else {
        await securityService.createRole(formData);
        toast.success("Tạo mới thành công");
      }
      setIsFormOpen(false);
      fetchRoles();
    } catch (error: any) {
      toast.error(error.response?.data?.message || "Đã có lỗi xảy ra");
    } finally {
      setFormLoading(false);
    }
  };

  const openForm = (item?: Role) => {
    setSelectedItem(item || null);
    setIsFormOpen(true);
  };

  const columns: ColumnDef<Role>[] = [
    { accessorKey: "name", header: "Vai trò", cell: ({ row }) => <span className="font-bold text-primary">{row.original.name}</span> },
    { accessorKey: "description", header: "Mô tả" },
    { 
        accessorKey: "permissions", 
        header: "Số lượng quyền", 
        cell: ({ row }) => <span className="bg-blue-50 text-blue-700 px-2 py-1 rounded-full text-[10px] font-bold border border-blue-100">{row.original.permissions.length} quyền</span> 
    },
    {
      id: "actions",
      header: () => <div className="text-right">Thao tác</div>,
      cell: ({ row }) => (
        <div className="flex justify-end gap-1">
          <Button variant="ghost" size="icon" onClick={() => { setSelectedItem(row.original); setIsDetailOpen(true); }}><Eye size={16} /></Button>
          <Button variant="ghost" size="icon" onClick={() => openForm(row.original)}><Edit2 size={16} /></Button>
          <Button variant="ghost" size="icon" className="text-red-500 hover:bg-red-50" onClick={() => { setSelectedItem(row.original); setIsDeleteOpen(true); }}><Trash2 size={16} /></Button>
        </div>
      ),
    },
  ];

  return (
    <div className="p-8 max-w-6xl mx-auto">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-2xl font-bold flex items-center gap-2"><ShieldAlert className="text-primary" />Quản lý Vai trò (Roles)</h1>
          <p className="text-gray-500">Phân nhóm các quyền hạn cho người dùng.</p>
        </div>
        <Button onClick={() => openForm()} className="gap-2"><Plus size={18} />Thêm vai trò</Button>
      </div>

      <div className="bg-white p-6 rounded-xl border shadow-sm mb-6 flex justify-between items-center">
        <div className="relative max-w-sm w-full">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
          <Input className="pl-10 h-11" placeholder="Tìm tên vai trò..." value={searchTerm} onChange={(e) => { setSearchTerm(e.target.value); setPageIndex(0); }} />
        </div>
        <div className="text-sm">Tổng: <strong>{totalElements}</strong> vai trò</div>
      </div>

      <DataTable columns={columns} data={data} pageCount={pageCount} pageIndex={pageIndex} onPageChange={setPageIndex} isLoading={loading} />

      <DetailModal 
        isOpen={isDetailOpen} 
        onClose={() => setIsDetailOpen(false)} 
        title="Chi tiết vai trò" 
        data={selectedItem} 
        fields={[
            { label: "Tên vai trò", key: "name" }, 
            { label: "Mô tả", key: "description" },
            { 
                label: "Danh sách quyền", 
                key: "permissions", 
                render: (val: Permission[]) => (
                    <div className="flex flex-wrap gap-1">
                        {val?.map(p => <code key={p.id} className="text-[10px] bg-slate-100 p-1 rounded border">{p.name}</code>)}
                    </div>
                ) 
            }
        ]} 
      />

      <CrudModal 
        isOpen={isFormOpen} 
        onClose={() => setIsFormOpen(false)} 
        title={selectedItem ? "Cập nhật vai trò" : "Tạo vai trò mới"}
      >
        <RoleForm 
          selectedRole={selectedItem} 
          allPermissions={allPermissions} 
          formLoading={formLoading} 
          onSubmit={onSave} 
          onCancel={() => setIsFormOpen(false)} 
        />
      </CrudModal>

      <DeleteConfirmDialog 
        isOpen={isDeleteOpen} 
        onClose={() => setIsDeleteOpen(false)} 
        title="Xóa vai trò?" 
        description="Việc xóa vai trò sẽ gỡ bỏ vai trò này khỏi tất cả người dùng hiện tại." 
        onConfirm={async () => {
          try {
            setFormLoading(true);
            await securityService.deleteRole(selectedItem!.id);
            toast.success("Xóa thành công");
            setIsDeleteOpen(false);
            fetchRoles();
          } catch (e: any) { 
            toast.error("Lỗi khi xóa"); 
          } finally { 
            setFormLoading(false); 
          }
        }} 
        isLoading={formLoading} 
      />
    </div>
  );
}
