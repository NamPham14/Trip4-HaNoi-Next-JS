"use client";

import React from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Loader2 } from "lucide-react";
import { Button } from "@/shared/components/ui/button";
import { Input } from "@/shared/components/ui/input";
import { Label } from "@/shared/components/ui/label";
import { Permission } from "../types/security";

const permissionSchema = z.object({
  name: z.string().min(3, "Tên quyền ít nhất 3 ký tự").regex(/^[A-Z_]+$/, "Quyền phải viết hoa và dùng dấu gạch dưới (VD: MANAGE_USER)"),
  description: z.string().min(5, "Mô tả ít nhất 5 ký tự"),
});

export type PermissionFormData = z.infer<typeof permissionSchema>;

interface PermissionFormProps {
  selectedPermission: Permission | null;
  formLoading: boolean;
  onSubmit: (data: PermissionFormData) => Promise<void>;
  onCancel: () => void;
}

export const PermissionForm: React.FC<PermissionFormProps> = ({
  selectedPermission,
  formLoading,
  onSubmit,
  onCancel,
}) => {
  const { register, handleSubmit, formState: { errors } } = useForm<PermissionFormData>({
    resolver: zodResolver(permissionSchema),
    defaultValues: {
      name: selectedPermission?.name || "",
      description: selectedPermission?.description || "",
    }
  });

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      <div className="space-y-2">
        <Label className="font-bold">Mã quyền (vd: MANAGE_USER) <span className="text-red-500">*</span></Label>
        <Input {...register("name")} placeholder="MANAGE_..." disabled={formLoading} />
        {errors.name && <p className="text-xs text-red-500">{errors.name.message}</p>}
      </div>
      <div className="space-y-2">
        <Label className="font-bold">Mô tả chi tiết <span className="text-red-500">*</span></Label>
        <Input {...register("description")} placeholder="Mô tả cho quyền này..." disabled={formLoading} />
        {errors.description && <p className="text-xs text-red-500">{errors.description.message}</p>}
      </div>
      <div className="flex justify-end gap-3 pt-4 border-t">
        <Button type="button" variant="outline" onClick={onCancel}>Hủy</Button>
        <Button type="submit" disabled={formLoading}>
          {formLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
          Lưu lại
        </Button>
      </div>
    </form>
  );
};
