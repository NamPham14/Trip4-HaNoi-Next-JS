/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import React, { useState, useEffect, useCallback } from 'react';
import { 
  Users, 
  Search, 
  Edit2, 
  Trash2, 
  Loader2, 
  Eye, 
  UserCheck, 
  UserMinus, 
  Shield, 
  Globe, 
  Mail,
  Calendar,
  Camera
} from 'lucide-react';
import { Button } from '@/shared/components/ui/button';
import { Input } from '@/shared/components/ui/input';
import { DataTable } from '@/shared/components/ui/table-data';
import { ColumnDef } from '@tanstack/react-table';
import { userManagementService } from '@/features/auth/services/user-management-api';
import { securityService } from '@/features/security/services/security-service';
import { UserManagement, UserStatus } from '@/features/auth/types/user-management';
import { Role } from '@/features/security/types/security';
import { DeleteConfirmDialog } from '@/shared/components/ui/delete-confirm-dialog';
import { CrudModal } from '@/shared/components/ui/crud-modal';
import { DetailModal } from '@/shared/components/ui/detail-modal';
import { toast } from 'sonner';
import { Label } from '@/shared/components/ui/label';
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { MultiSelect } from "react-multi-select-component";
import Image from 'next/image';

const userSchema = z.object({
  username: z.string().min(3, "Tên người dùng ít nhất 3 ký tự"),
  email: z.string().email("Email không hợp lệ"),
  status: z.enum(['ACTIVE', 'INACTIVE', 'NONE']),
  roles: z.array(z.number()).min(1, "Vui lòng gán ít nhất 1 vai trò"),
  nationality: z.string().optional(),
  language: z.string().optional(),
});

type UserFormData = z.infer<typeof userSchema>;

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
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);

  const { register, handleSubmit, control, reset, setValue, formState: { errors } } = useForm<UserFormData>({
    resolver: zodResolver(userSchema),
  });

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

  const onSave = async (formData: UserFormData) => {
    try {
      setFormLoading(true);
      if (selectedItem) {
        // Filter data: Only send fields with values to allow partial updates
        const updateData: any = { id: selectedItem.id };
        
        Object.keys(formData).forEach((key) => {
          const value = (formData as any)[key];
          // Only include non-empty, non-null values
          if (value !== "" && value !== null && value !== undefined) {
            if (Array.isArray(value)) {
              if (value.length > 0) updateData[key] = value;
            } else {
              updateData[key] = value;
            }
          }
        });

        await userManagementService.updateUser(updateData, selectedFile || undefined);
        toast.success("Cập nhật người dùng thành công");
      } else {
        // Create user logic if needed, but usually users register themselves.
        // If we want to support Admin creating users:
        // await userManagementService.createUser(formData, selectedFile);
        toast.info("Chức năng tạo mới người dùng từ Admin đang được cập nhật");
      }
      setIsFormOpen(false);
      fetchUsers();
    } catch (error: any) {
      toast.error(error.response?.data?.message || "Đã có lỗi xảy ra");
    } finally {
      setFormLoading(false);
    }
  };

  const openForm = (item?: UserManagement) => {
    setSelectedItem(item || null);
    setSelectedFile(null);
    setPreviewUrl(item?.avatar || null);
    
    if (item) {
      reset({ 
        username: item.username, 
        email: item.email,
        status: item.status,
        nationality: item.nationality || "",
        language: item.language || "",
        roles: item.roles.map(r => r.id) 
      });
    } else {
      reset({ username: "", email: "", status: "ACTIVE", roles: [], nationality: "Vietnam", language: "vi" });
    }
    setIsFormOpen(true);
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setSelectedFile(file);
      const reader = new FileReader();
      reader.onloadend = () => setPreviewUrl(reader.result as string);
      reader.readAsDataURL(file);
    }
  };

  const roleOptions = allRoles.map(r => ({ label: r.name, value: r.id }));

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
      cell: ({ row }) => {
        const status = row.original.status;
        let styles = "bg-gray-100 text-gray-600";
        if (status === 'ACTIVE') styles = "bg-green-50 text-green-700 border-green-100";
        if (status === 'NONE') styles = "bg-red-50 text-red-700 border-red-100";
        if (status === 'INACTIVE') styles = "bg-yellow-50 text-yellow-700 border-yellow-100";
        
        return (
          <span className={`px-2 py-1 rounded-full text-[10px] font-bold border ${styles}`}>
            {status}
          </span>
        );
      }
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
        <div className="flex justify-end gap-1">
          <Button variant="ghost" size="icon" onClick={() => { setSelectedItem(row.original); setIsDetailOpen(true); }}><Eye size={16} /></Button>
          <Button variant="ghost" size="icon" onClick={() => openForm(row.original)}><Edit2 size={16} /></Button>
          <Button 
            variant="ghost" 
            size="icon" 
            className="text-red-500 hover:bg-red-50" 
            onClick={() => { setSelectedItem(row.original); setIsDeleteOpen(true); }}
            disabled={row.original.status === 'INACTIVE'}
          >
            <UserMinus size={16} />
          </Button>
        </div>
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
        {/* <Button onClick={() => openForm()} className="gap-2"><UserCheck size={18} />Thêm người dùng</Button> */}
      </div>

      <div className="bg-white p-6 rounded-xl border shadow-sm mb-6 flex justify-between items-center">
        <div className="relative max-w-sm w-full">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
          <Input 
            className="pl-10 h-11" 
            placeholder="Tìm theo tên, email..." 
            value={searchTerm} 
            onChange={(e) => { setSearchTerm(e.target.value); setPageIndex(0); }} 
          />
        </div>
        <div className="flex gap-4 items-center">
          <div className="text-sm">Tổng: <strong>{totalElements}</strong> người dùng</div>
        </div>
      </div>

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
        <form onSubmit={handleSubmit(onSave)} className="space-y-4 w-full">
          {/* Avatar Upload */}
          <div className="flex flex-col items-center justify-center py-4 bg-gray-50 rounded-xl border-2 border-dashed border-gray-200 mb-4">
            <div className="relative w-24 h-24 rounded-full overflow-hidden border-4 border-white shadow-md bg-white">
              {previewUrl ? (
                <img src={previewUrl} alt="Preview" className="w-full h-full object-cover" />
              ) : (
                <div className="w-full h-full flex items-center justify-center text-gray-300">
                  <Users size={40} />
                </div>
              )}
              <label className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 hover:opacity-100 transition-opacity cursor-pointer">
                <Camera className="text-white" size={24} />
                <input type="file" className="hidden" onChange={handleFileChange} accept="image/*" />
              </label>
            </div>
            <p className="text-[10px] text-gray-500 mt-2 font-medium">Nhấp vào ảnh để thay đổi</p>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label className="font-bold text-gray-700">Tên hiển thị</Label>
              <Input {...register("username")} disabled className="h-11 bg-gray-50" />
              {errors.username && <p className="text-xs text-red-500">{errors.username.message}</p>}
            </div>
            
            <div className="space-y-2">
              <Label className="font-bold text-gray-700">Email</Label>
              <Input {...register("email")} disabled className="h-11 bg-gray-50" />
              {errors.email && <p className="text-xs text-red-500">{errors.email.message}</p>}
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label className="font-bold text-gray-700">Quốc tịch</Label>
              <div className="relative">
                <Globe className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={16} />
                <Input {...register("nationality")} placeholder="Vietnam, USA..." className="pl-10 h-11" />
              </div>
            </div>
            
            <div className="space-y-2">
              <Label className="font-bold text-gray-700">Trạng thái tài khoản</Label>
              <select 
                {...register("status")}
                className="w-full h-11 px-3 bg-white border rounded-md text-sm outline-none focus:ring-2 ring-primary/20"
              >
                <option value="ACTIVE">Hoạt động (ACTIVE)</option>
                <option value="INACTIVE">Vô hiệu hóa (INACTIVE)</option>
                <option value="NONE">Khóa vĩnh viễn (NONE)</option>
              </select>
            </div>
          </div>

          <div className="space-y-2">
            <Label className="font-bold text-gray-700 flex items-center gap-2"><Shield size={14} className="text-primary"/> Gán vai trò <span className="text-red-500">*</span></Label>
            <div className="w-full">
                <style jsx global>{`
                    [data-slot="dialog-content"] {
                        overflow: visible !important;
                    }
                    .user-role-multiselect .dropdown-container {
                        border-radius: 8px !important;
                        border: 1px solid #e5e7eb !important;
                        padding: 2px !important;
                        background-color: #ffffff !important;
                    }
                    .user-role-multiselect .multi-select {
                        --rmsc-p: 10px;
                        --rmsc-radius: 8px;
                        --rmsc-bg: #ffffff;
                    }
                    .user-role-multiselect .dropdown-content {
                        position: absolute !important;
                        width: 100% !important;
                        z-index: 9999 !important;
                        max-height: 300px !important;
                        background: white !important;
                        box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.1) !important;
                        border: 1px solid #e5e7eb !important;
                        border-radius: 8px !important;
                    }
                `}</style>
                <Controller
                    name="roles"
                    control={control}
                    render={({ field }) => (
                        <MultiSelect
                            options={roleOptions}
                            value={roleOptions.filter(opt => field.value?.includes(opt.value))}
                            onChange={(val: any[]) => field.onChange(val.map(v => v.value))}
                            labelledBy="Chọn vai trò..."
                            className="user-role-multiselect"
                            overrideStrings={{ "selectSomeItems": "Chọn vai trò...", "allItemsAreSelected": "Tất cả vai trò", "selectAll": "Chọn tất cả", "search": "Tìm kiếm vai trò..." }}
                        />
                    )}
                />
            </div>
            {errors.roles && <p className="text-xs text-red-500">{errors.roles.message}</p>}
          </div>

          <div className="flex justify-end gap-3 pt-6 border-t mt-4">
            <Button type="button" variant="outline" onClick={() => setIsFormOpen(false)} className="h-11 px-6 font-semibold">Hủy</Button>
            <Button type="submit" disabled={formLoading} className="h-11 px-6 font-bold">
              {formLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              Lưu thay đổi
            </Button>
          </div>
        </form>
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
