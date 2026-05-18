/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import React from "react";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { MultiSelect } from "react-multi-select-component";
import { Key, Loader2 } from "lucide-react";
import { Button } from "@/shared/components/ui/button";
import { Input } from "@/shared/components/ui/input";
import { Label } from "@/shared/components/ui/label";
import { Role, Permission } from "../types/security";

const roleSchema = z.object({
  name: z.string().min(3, "Tên vai trò ít nhất 3 ký tự"),
  description: z.string().min(5, "Mô tả ít nhất 5 ký tự"),
  permissions: z.array(z.number()).min(1, "Vui lòng chọn ít nhất 1 quyền"),
});

export type RoleFormData = z.infer<typeof roleSchema>;

interface RoleFormProps {
  selectedRole: Role | null;
  allPermissions: Permission[];
  formLoading: boolean;
  onSubmit: (data: RoleFormData) => Promise<void>;
  onCancel: () => void;
}

export const RoleForm: React.FC<RoleFormProps> = ({
  selectedRole,
  allPermissions,
  formLoading,
  onSubmit,
  onCancel,
}) => {
  const { register, handleSubmit, control, setValue, formState: { errors } } = useForm<RoleFormData>({
    resolver: zodResolver(roleSchema),
    defaultValues: {
      name: selectedRole?.name || "",
      description: selectedRole?.description || "",
      permissions: selectedRole?.permissions.map(p => p.id) || [],
    }
  });

  const permissionOptions = allPermissions.map(p => ({ label: p.name, value: p.id }));

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 w-full relative">
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
                .role-multiselect .dropdown-content {
                    position: absolute !important;
                    width: 100% !important;
                    z-index: 9999 !important;
                    max-height: 400px !important;
                    background: white !important;
                    box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.25) !important;
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
        <Button type="button" variant="outline" onClick={onCancel} className="h-11 px-6 font-semibold">Hủy</Button>
        <Button type="submit" disabled={formLoading} className="h-11 px-6 font-bold">
          {formLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
          {selectedRole ? "Cập nhật ngay" : "Tạo vai trò"}
        </Button>
      </div>
    </form>
  );
};
