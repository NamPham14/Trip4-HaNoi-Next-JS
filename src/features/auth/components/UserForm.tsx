/* eslint-disable @typescript-eslint/no-explicit-any */
'use client'

import React, { useState, useEffect } from 'react'
import { useForm, Controller } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import * as z from "zod"
import { Users, Camera, Globe, Shield, Loader2 } from 'lucide-react'
import { Button } from '@/shared/components/ui/button'
import { Input } from '@/shared/components/ui/input'
import { Label } from '@/shared/components/ui/label'
import { MultiSelect } from "react-multi-select-component"
import { UserManagement } from '@/features/auth/types/user-management'
import { Role } from '@/features/security/types/security'
import { userManagementService } from '@/features/auth/services/user-management-api'
import { toast } from 'sonner'

const userSchema = z.object({
  username: z.string().min(3, "Tên người dùng ít nhất 3 ký tự"),
  email: z.string().email("Email không hợp lệ"),
  status: z.enum(['ACTIVE', 'INACTIVE', 'NONE']),
  roles: z.array(z.number()).min(1, "Vui lòng gán ít nhất 1 vai trò"),
  nationality: z.string().optional(),
  language: z.string().optional(),
});

type UserFormData = z.infer<typeof userSchema>;

interface UserFormProps {
  selectedItem: UserManagement | null
  allRoles: Role[]
  onSuccess: () => void
  onCancel: () => void
}

export const UserForm: React.FC<UserFormProps> = ({
  selectedItem,
  allRoles,
  onSuccess,
  onCancel,
}) => {
  const [formLoading, setFormLoading] = useState(false)
  const [selectedFile, setSelectedFile] = useState<File | null>(null)
  const [previewUrl, setPreviewUrl] = useState<string | null>(selectedItem?.avatar || null)

  const { register, handleSubmit, control, formState: { errors } } = useForm<UserFormData>({
    resolver: zodResolver(userSchema),
    defaultValues: {
      username: selectedItem?.username || '',
      email: selectedItem?.email || '',
      status: selectedItem?.status || 'ACTIVE',
      nationality: selectedItem?.nationality || 'Vietnam',
      language: selectedItem?.language || 'vi',
      roles: selectedItem?.roles?.map(r => r.id) || []
    }
  });

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setSelectedFile(file);
      const reader = new FileReader();
      reader.onloadend = () => setPreviewUrl(reader.result as string);
      reader.readAsDataURL(file);
    }
  };

  const onSave = async (formData: UserFormData) => {
    try {
      setFormLoading(true);
      if (selectedItem) {
        const updateData: any = { id: selectedItem.id };
        
        Object.keys(formData).forEach((key) => {
          const value = (formData as any)[key];
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
        onSuccess();
      }
    } catch (error: any) {
      toast.error(error.response?.data?.message || "Đã có lỗi xảy ra");
    } finally {
      setFormLoading(false);
    }
  };

  const roleOptions = allRoles.map(r => ({ label: r.name, value: r.id }));

  return (
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
        <Label className="font-bold text-gray-700 flex items-center gap-2">
          <Shield size={14} className="text-primary"/> Gán vai trò <span className="text-red-500">*</span>
        </Label>
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
                        overrideStrings={{ 
                          "selectSomeItems": "Chọn vai trò...", 
                          "allItemsAreSelected": "Tất cả vai trò", 
                          "selectAll": "Chọn tất cả", 
                          "search": "Tìm kiếm vai trò..." 
                        }}
                    />
                )}
            />
        </div>
        {errors.roles && <p className="text-xs text-red-500">{errors.roles.message}</p>}
      </div>

      <div className="flex justify-end gap-3 pt-6 border-t mt-4">
        <Button type="button" variant="outline" onClick={onCancel} className="h-11 px-6 font-semibold">Hủy</Button>
        <Button type="submit" disabled={formLoading} className="h-11 px-6 font-bold">
          {formLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
          Lưu thay đổi
        </Button>
      </div>
    </form>
  )
}
