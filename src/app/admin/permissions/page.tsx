/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import React, { useState, useEffect, useCallback } from 'react';
import { ShieldCheck, Plus, Edit2, Trash2, Search, Eye } from 'lucide-react';
import { Button } from '@/shared/components/ui/button';
import { Input } from '@/shared/components/ui/input';
import { DataTable } from '@/shared/components/ui/table-data';
import { ColumnDef } from '@tanstack/react-table';
import { securityService } from '@/features/security/services/security-service';
import { Permission } from '@/features/security/types/security';
import { DeleteConfirmDialog } from '@/shared/components/ui/delete-confirm-dialog';
import { CrudModal } from '@/shared/components/ui/crud-modal';
import { DetailModal } from '@/shared/components/ui/detail-modal';
import { toast } from 'sonner';
import { PermissionForm, PermissionFormData } from '@/features/security/components/PermissionForm';

export default function PermissionManagementPage() {
  const [data, setData] = useState<Permission[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [pageIndex, setPageIndex] = useState(0);
  const [pageCount, setPageCount] = useState(0);
  const [totalElements, setTotalElements] = useState(0);

  const [isDeleteOpen, setIsDeleteOpen] = useState(false);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [isDetailOpen, setIsDetailOpen] = useState(false);
  const [selectedItem, setSelectedItem] = useState<Permission | null>(null);
  const [formLoading, setFormLoading] = useState(false);

  const fetchPermissions = useCallback(async () => {
    try {
      setLoading(true);
      const res = await securityService.getPermissions({
        keyword: searchTerm,
        page: pageIndex + 1,
        size: 10,
      });
      setData(res.data);
      setPageCount(res.totalPages);
      setTotalElements(res.totalElements);
    } catch (error) {
      toast.error("Lỗi tải danh sách quyền");
    } finally {
      setLoading(false);
    }
  }, [searchTerm, pageIndex]);

  useEffect(() => {
    const timer = setTimeout(() => fetchPermissions(), 500);
    return () => clearTimeout(timer);
  }, [fetchPermissions]);

  const onSave = async (formData: PermissionFormData) => {
    try {
      setFormLoading(true);
      if (selectedItem) {
        await securityService.updatePermission(selectedItem.id, formData);
        toast.success("Cập nhật thành công");
      } else {
        await securityService.createPermission(formData);
        toast.success("Tạo mới thành công");
      }
      setIsFormOpen(false);
      fetchPermissions();
    } catch (error: any) {
      toast.error(error.response?.data?.message || "Đã có lỗi xảy ra");
    } finally {
      setFormLoading(false);
    }
  };

  const openForm = (item?: Permission) => {
    setSelectedItem(item || null);
    setIsFormOpen(true);
  };

  const columns: ColumnDef<Permission>[] = [
    { accessorKey: "name", header: "Quyền hệ thống", cell: ({ row }) => <code className="bg-slate-100 px-2 py-1 rounded text-primary font-bold text-xs">{row.original.name}</code> },
    { accessorKey: "description", header: "Mô tả" },
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
          <h1 className="text-2xl font-bold flex items-center gap-2"><ShieldCheck className="text-primary" />Quản lý Quyền (Permissions)</h1>
          <p className="text-gray-500">Định nghĩa các hành động chi tiết trong hệ thống.</p>
        </div>
        <Button onClick={() => openForm()} className="gap-2"><Plus size={18} />Thêm quyền mới</Button>
      </div>

      <div className="bg-white p-6 rounded-xl border shadow-sm mb-6 flex justify-between items-center">
        <div className="relative max-w-sm w-full">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
          <Input className="pl-10 h-11" placeholder="Tìm tên quyền..." value={searchTerm} onChange={(e) => { setSearchTerm(e.target.value); setPageIndex(0); }} />
        </div>
        <div className="text-sm">Tổng: <strong>{totalElements}</strong></div>
      </div>

      <DataTable columns={columns} data={data} pageCount={pageCount} pageIndex={pageIndex} onPageChange={setPageIndex} isLoading={loading} />

      <DetailModal isOpen={isDetailOpen} onClose={() => setIsDetailOpen(false)} title="Chi tiết quyền" data={selectedItem} fields={[{ label: "Tên quyền", key: "name" }, { label: "Mô tả", key: "description" }]} />

      <CrudModal isOpen={isFormOpen} onClose={() => setIsFormOpen(false)} title={selectedItem ? "Cập nhật quyền" : "Tạo quyền mới"}>
        <PermissionForm 
          selectedPermission={selectedItem} 
          formLoading={formLoading} 
          onSubmit={onSave} 
          onCancel={() => setIsFormOpen(false)} 
        />
      </CrudModal>

      <DeleteConfirmDialog 
        isOpen={isDeleteOpen} 
        onClose={() => setIsDeleteOpen(false)} 
        title="Xóa quyền này?" 
        description="Xóa quyền có thể ảnh hưởng đến các vai trò đang sử dụng quyền này." 
        onConfirm={async () => {
          try {
            setFormLoading(true);
            await securityService.deletePermission(selectedItem!.id);
            toast.success("Xóa thành công");
            setIsDeleteOpen(false);
            fetchPermissions();
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
