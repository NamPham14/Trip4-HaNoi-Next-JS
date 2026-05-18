/* eslint-disable @typescript-eslint/no-explicit-any */
'use client'

import React, { useState } from 'react'
import { useForm, Controller } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import * as z from "zod"
import { ImageIcon, X, Loader2 } from 'lucide-react'
import { Button } from '@/shared/components/ui/button'
import { Input } from '@/shared/components/ui/input'
import { Label } from '@/shared/components/ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/shared/components/ui/select'
import { RichTextEditor } from '@/shared/components/RichTextEditor'
import { Place } from '@/features/places/types/place'
import { Category } from '@/features/category/services/category-api'
import { placeService } from '@/features/places/services/place-api'
import { toast } from 'sonner'

// Districts in Hanoi
const DISTRICTS = [
  "Ba Đình", "Hoàn Kiếm", "Tây Hồ", "Long Biên", "Cầu Giấy", "Đống Đa", 
  "Hai Bà Trưng", "Hoàng Mai", "Thanh Xuân", "Nam Từ Liêm", "Bắc Từ Liêm", "Hà Đông"
];

// Validation Schema
const placeSchema = z.object({
  name: z.string().min(3, "Tên địa điểm ít nhất 3 ký tự"),
  description: z.string().optional(),
  categoryId: z.string().min(1, "Vui lòng chọn danh mục"),
  address: z.string().min(5, "Địa chỉ ít nhất 5 ký tự"),
  district: z.string().min(1, "Vui lòng chọn quận/huyện"),
  latitude: z.string().min(1, "Vĩ độ không được trống"),
  longitude: z.string().min(1, "Kinh độ không được trống"),
  priceAvg: z.string().optional(),
});

type PlaceFormData = z.infer<typeof placeSchema>;

interface PlaceFormProps {
  currentPlace: Place | null
  categories: Category[]
  onSuccess: () => void
  onCancel: () => void
}

export const PlaceForm: React.FC<PlaceFormProps> = ({
  currentPlace,
  categories,
  onSuccess,
  onCancel,
}) => {
  const [formLoading, setFormLoading] = useState(false)
  const [selectedImages, setSelectedImages] = useState<File[]>([])
  const [keepImageIds, setKeepImageIds] = useState<number[]>(currentPlace?.images?.map(img => img.id) || [])

  const { register, handleSubmit, control, formState: { errors } } = useForm<PlaceFormData>({
    resolver: zodResolver(placeSchema),
    defaultValues: {
      name: currentPlace?.name || '',
      description: currentPlace?.description || '',
      categoryId: currentPlace?.categoryId?.toString() || '',
      address: currentPlace?.address || '',
      district: currentPlace?.district || '',
      latitude: currentPlace?.latitude?.toString() || '',
      longitude: currentPlace?.longitude?.toString() || '',
      priceAvg: currentPlace?.priceAvg?.toString() || '',
    }
  });

  const onSave = async (data: PlaceFormData) => {
    try {
      setFormLoading(true);
      const submitData = new FormData();
      
      const placeJson = {
        ...data,
        categoryId: parseInt(data.categoryId),
        latitude: parseFloat(data.latitude),
        longitude: parseFloat(data.longitude),
        priceAvg: data.priceAvg ? parseInt(data.priceAvg) : null,
        keepImageIds: keepImageIds
      };
      
      submitData.append('data', new Blob([JSON.stringify(placeJson)], { type: 'application/json' }));
      selectedImages.forEach(file => submitData.append('images', file));

      if (currentPlace) {
        await placeService.updatePlace(currentPlace.id, submitData);
        toast.success("Cập nhật thành công");
      } else {
        await placeService.createPlace(submitData);
        toast.success("Thêm mới thành công");
      }
      
      onSuccess();
    } catch (error: any) {
      toast.error(error.response?.data?.message || "Đã có lỗi xảy ra");
    } finally {
      setFormLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit(onSave)} className="space-y-4 max-h-[75vh] overflow-y-auto px-1 custom-scrollbar">
      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-1">
            <Label>Tên địa điểm <span className="text-red-500">*</span></Label>
            <Input {...register("name")} placeholder="Tên..." disabled={formLoading} />
            {errors.name && <p className="text-[10px] text-red-500">{errors.name.message}</p>}
        </div>
        <div className="space-y-1">
            <Label>Danh mục <span className="text-red-500">*</span></Label>
            <Controller
            name="categoryId"
            control={control}
            render={({ field }) => (
                <Select onValueChange={field.onChange} value={field.value} disabled={formLoading}>
                <SelectTrigger><SelectValue placeholder="Chọn..." /></SelectTrigger>
                <SelectContent>
                    {categories.map(c => <SelectItem key={c.id} value={c.id.toString()}>{c.name}</SelectItem>)}
                </SelectContent>
                </Select>
            )}
            />
            {errors.categoryId && <p className="text-[10px] text-red-500">{errors.categoryId.message}</p>}
        </div>
      </div>

      <div className="space-y-1">
        <Label>Địa chỉ <span className="text-red-500">*</span></Label>
        <Input {...register("address")} placeholder="Số nhà, tên đường..." disabled={formLoading} />
        {errors.address && <p className="text-[10px] text-red-500">{errors.address.message}</p>}
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-1">
            <Label>Quận/Huyện <span className="text-red-500">*</span></Label>
            <Controller
            name="district"
            control={control}
            render={({ field }) => (
                <Select onValueChange={field.onChange} value={field.value} disabled={formLoading}>
                <SelectTrigger><SelectValue placeholder="Chọn..." /></SelectTrigger>
                <SelectContent>
                    {DISTRICTS.map(d => <SelectItem key={d} value={d}>{d}</SelectItem>)}
                </SelectContent>
                </Select>
            )}
            />
            {errors.district && <p className="text-[10px] text-red-500">{errors.district.message}</p>}
        </div>
        <div className="space-y-1">
            <Label>Giá trung bình (VNĐ)</Label>
            <Input type="number" {...register("priceAvg")} placeholder="Vd: 50000" disabled={formLoading} />
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-1">
          <Label>Vĩ độ (Latitude) <span className="text-red-500">*</span></Label>
          <Input {...register("latitude")} placeholder="21.0285..." disabled={formLoading} />
          {errors.latitude && <p className="text-[10px] text-red-500">{errors.latitude.message}</p>}
        </div>
        <div className="space-y-1">
          <Label>Kinh độ (Longitude) <span className="text-red-500">*</span></Label>
          <Input {...register("longitude")} placeholder="105.8542..." disabled={formLoading} />
          {errors.longitude && <p className="text-[10px] text-red-500">{errors.longitude.message}</p>}
        </div>
      </div>

      <div className="space-y-1">
        <Label>Mô tả chi tiết</Label>
        <Controller
          name="description"
          control={control}
          render={({ field }) => <RichTextEditor value={field.value || ''} onChange={field.onChange} />}
        />
      </div>

      <div className="space-y-2">
        <Label>Hình ảnh Album</Label>
        <div className="grid grid-cols-4 gap-2">
            {currentPlace?.images?.filter(img => keepImageIds.includes(img.id)).map(img => (
                <div key={img.id} className="relative aspect-square border rounded overflow-hidden">
                    <img src={img.imageUrl} className="w-full h-full object-cover" />
                    <button type="button" onClick={() => setKeepImageIds(prev => prev.filter(id => id !== img.id))} className="absolute top-0.5 right-0.5 bg-red-500 text-white rounded-full p-0.5"><X size={10} /></button>
                </div>
            ))}
            {selectedImages.map((file, idx) => (
                <div key={idx} className="relative aspect-square border rounded overflow-hidden">
                    <img src={URL.createObjectURL(file)} className="w-full h-full object-cover" />
                    <button type="button" onClick={() => setSelectedImages(prev => prev.filter((_, i) => i !== idx))} className="absolute top-0.5 right-0.5 bg-red-500 text-white rounded-full p-0.5"><X size={10} /></button>
                </div>
            ))}
            <label className="flex flex-col items-center justify-center aspect-square border-2 border-dashed rounded cursor-pointer hover:border-primary">
                <ImageIcon size={18} className="text-gray-400" />
                <input type="file" multiple accept="image/*" className="hidden" onChange={(e) => e.target.files && setSelectedImages(prev => [...prev, ...Array.from(e.target.files!)])} />
            </label>
        </div>
      </div>

      <div className="flex justify-end gap-3 pt-4 border-t sticky bottom-0 bg-white">
        <Button type="button" variant="outline" onClick={onCancel}>Hủy</Button>
        <Button type="submit" disabled={formLoading}>{formLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}Lưu địa điểm</Button>
      </div>
    </form>
  )
}
