"use client";

import React, { useState, useEffect, useCallback } from 'react';
import { ShieldAlert, Plus, Edit2, Trash2, Loader2, Search, Eye, Key } from 'lucide-react';
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
import { Label } from '@/shared/components/ui/label';
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { MultiSelect } from "react-multi-select-component";

const roleSchema = z.object({
  name: z.string().min(3, "Tên vai trò ít nhất 3 ký tự"),
  description: z.string().min(5, "Mô tả ít nhất 5 ký tự"),
  permissions: z.array(z.number()).min(1, "Vui lòng chọn ít nhất 1 quyền"),
});

type RoleFormData = z.infer<typeof roleSchema>;

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

  const { register, handleSubmit, control, reset, setValue, formState: { errors } } = useForm<RoleFormData>({
    resolver: zodResolver(roleSchema),
  });

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
    if (item) {
      reset({ 
        name: item.name, 
        description: item.description, 
        permissions: item.permissions.map(p => p.id) 
      });
    } else {
      reset({ name: "", description: "", permissions: [] });
    }
    setIsFormOpen(true);
  };

  const permissionOptions = allPermissions.map(p => ({ label: p.name, value: p.id }));

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
        <form onSubmit={handleSubmit(onSave)} className="space-y-4 w-full relative">
          <div className="space-y-2">
            <Label className="font-bold text-gray-700">Tên vai trò <span className="text-red-500">*</span></Label>
            <Input {...register("name")} placeholder="VD: ADMIN, MANAGER..." disabled={formLoading} className="font-bold h-11 w-full" />
            {errors.name && <p className="text-xs text-red-500">{errors.name.message}</p>}
          </div>
          
          <div className="space-y-2">
            <Label className="font-bold text-gray-700">Mô tả <span className="text-red-500">*</span></Label>
            <Input {...register("description")} placeholder="Mô tả chức năng vai trò..." disabled={formLoading} className="h-11 w-full" />
            {errors.description && <p className="text-xs text-red-500">{errors.description.message}</p>}
          </div>

          <div className="space-y-2">
            <Label className="font-bold text-gray-700 flex items-center gap-2"><Key size={14} className="text-primary"/> Gán quyền <span className="text-red-500">*</span></Label>
            <div className="w-full">
                <style jsx global>{`
                    /* Loại bỏ việc cắt cụt của các container cha */
                    [data-slot="dialog-content"] {
                        overflow: visible !important;
                    }
                    .role-multiselect .dropdown-container {
                        border-radius: 8px !important;
                        border: 2px solid #e5e7eb !important;
                        padding: 2px !important;
                        background-color: #f9fafb !important;
                    }
                    .role-multiselect .dropdown-heading {
                        height: 44px !important;
                    }
                    .role-multiselect .dropdown-heading-value {
                        overflow: hidden !important;
                        text-overflow: ellipsis !important;
                        white-space: nowrap !important;
                        display: block !important;
                        width: 100% !important;
                    }
                    .role-multiselect .multi-select {
                        --rmsc-p: 10px;
                        --rmsc-radius: 8px;
                        --rmsc-bg: #f9fafb;
                    }
                    /* Ép danh sách quyền nổi lên trên popup */
                    .role-multiselect .dropdown-content {
                        position: absolute !important;
                        width: 100% !important;
                        z-index: 99999 !important;
                        max-height: 400px !important;
                        background: white !important;
                        box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.25) !important;
                        border: 2px solid #primary !important;
                        border-radius: 12px !important;
                    }
                    .role-multiselect .select-panel {
                        max-height: 380px !important;
                        overflow-y: auto !important;
                    }
                `}</style>
                <Controller
                    name="permissions"
                    control={control}
                    render={({ field }) => (
                        <MultiSelect
                            options={permissionOptions}
                            value={permissionOptions.filter(opt => field.value?.includes(opt.value))}
                            onChange={(val: any[]) => field.onChange(val.map(v => v.value))}
                            labelledBy="Chọn quyền..."
                            className="role-multiselect"
                            valueRenderer={(selected, _options) => {
                                if (selected.length === 0) return "--- Chọn quyền hệ thống ---";
                                if (selected.length === _options.length) return "👑 QUYỀN TỐI CAO (Full Admin)";
                                if (selected.length > 3) return `✅ Đã chọn ${selected.length} quyền`;
                                return selected.map((s) => s.label).join(", ");
                            }}
                            overrideStrings={{ "selectSomeItems": "Chọn danh sách quyền...", "allItemsAreSelected": "Đã chọn tất cả quyền", "selectAll": "Chọn tất cả", "search": "Tìm kiếm nhanh quyền..." }}
                        />
                    )}
                />
            </div>
            {errors.permissions && <p className="text-xs text-red-500">{errors.permissions.message}</p>}
            
            <div className="flex justify-end mt-1">
                <Button 
                    type="button" 
                    variant="link" 
                    className="text-[11px] h-6 p-0 text-primary font-bold decoration-primary underline-offset-4"
                    onClick={() => setValue("permissions", allPermissions.map(p => p.id))}
                >
                    ⚡ Gán nhanh FULL QUYỀN Admin
                </Button>
            </div>
          </div>

          <div className="flex justify-end gap-3 pt-6 border-t mt-8">
            <Button type="button" variant="outline" onClick={() => setIsFormOpen(false)} className="h-11 px-6 font-semibold">Hủy</Button>
            <Button type="submit" disabled={formLoading} className="h-11 px-6 font-bold">
              {formLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              {selectedItem ? "Cập nhật ngay" : "Tạo vai trò"}
            </Button>
          </div>
        </form>
      </CrudModal>

      <DeleteConfirmDialog isOpen={isDeleteOpen} onClose={() => setIsDeleteOpen(false)} title="Xóa vai trò?" description="Việc xóa vai trò sẽ gỡ bỏ vai trò này khỏi tất cả người dùng hiện tại." onConfirm={async () => {
         try {
           setFormLoading(true);
           await securityService.deleteRole(selectedItem!.id);
           toast.success("Xóa thành công");
           setIsDeleteOpen(false);
           fetchRoles();
         } catch (e: any) { toast.error("Lỗi khi xóa"); }
         finally { setFormLoading(false); }
      }} isLoading={formLoading} />
    </div>
  );
}
