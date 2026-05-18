"use client";

import React from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Loader2 } from "lucide-react";
import { Button } from "@/shared/components/ui/button";
import { Input } from "@/shared/components/ui/input";
import { Label } from "@/shared/components/ui/label";
import { Category } from "../services/category-api";

const categorySchema = z.object({
  name: z.string().min(2, "Tên danh mục phải có ít nhất 2 ký tự").max(50, "Tên danh mục quá dài"),
});

export type CategoryFormData = z.infer<typeof categorySchema>;

interface CategoryFormProps {
  selectedCategory: Category | null;
  formLoading: boolean;
  onSubmit: (data: CategoryFormData) => Promise<void>;
  onCancel: () => void;
}

export const CategoryForm: React.FC<CategoryFormProps> = ({
  selectedCategory,
  formLoading,
  onSubmit,
  onCancel,
}) => {
  const { register, handleSubmit, formState: { errors } } = useForm<CategoryFormData>({
    resolver: zodResolver(categorySchema),
    defaultValues: {
      name: selectedCategory?.name || "",
    }
  });

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      <div className="space-y-2">
        <Label>Tên danh mục <span className="text-red-500">*</span></Label>
        <Input {...register("name")} placeholder="Nhập tên..." disabled={formLoading} />
        {errors.name && <p className="text-xs text-red-500">{errors.name.message}</p>}
      </div>
      <div className="flex justify-end gap-3 pt-4">
        <Button type="button" variant="outline" onClick={onCancel}>Hủy</Button>
        <Button type="submit" disabled={formLoading}>
          {formLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
          Lưu
        </Button>
      </div>
    </form>
  );
};
