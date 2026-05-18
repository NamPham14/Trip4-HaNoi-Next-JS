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
import { Event } from '@/features/events/types/event'
import { Place } from '@/features/places/types/place'
import { eventService } from '@/features/events/services/event-api'
import { toast } from 'sonner'

// Define Validation Schema
const eventSchema = z.object({
  name: z.string().min(5, "Tên sự kiện phải có ít nhất 5 ký tự").max(100, "Tên sự kiện quá dài"),
  description: z.string().optional(),
  placeId: z.string().min(1, "Vui lòng chọn địa điểm tổ chức"),
  startTime: z.string().min(1, "Vui lòng chọn thời gian bắt đầu"),
  endTime: z.string().min(1, "Vui lòng chọn thời gian kết thúc"),
}).refine((data) => {
    const start = new Date(data.startTime);
    const end = new Date(data.endTime);
    return end > start;
}, {
    message: "Thời gian kết thúc phải sau thời gian bắt đầu",
    path: ["endTime"],
});

type EventFormData = z.infer<typeof eventSchema>;

interface EventFormProps {
  selectedEvent: Event | null
  places: Place[]
  onSuccess: () => void
  onCancel: () => void
}

export const EventForm: React.FC<EventFormProps> = ({
  selectedEvent,
  places,
  onSuccess,
  onCancel,
}) => {
  const [formLoading, setFormLoading] = useState(false)
  const [selectedImages, setSelectedImages] = useState<File[]>([])
  const [keepImageIds, setKeepImageIds] = useState<number[]>(selectedEvent?.images?.map(img => img.id) || [])

  const { register, handleSubmit, control, formState: { errors } } = useForm<EventFormData>({
    resolver: zodResolver(eventSchema),
    defaultValues: {
      name: selectedEvent?.name || '',
      description: selectedEvent?.description || '',
      placeId: selectedEvent?.placeId?.toString() || '',
      startTime: selectedEvent?.startTime ? selectedEvent.startTime.replace(' ', 'T').substring(0, 16) : '',
      endTime: selectedEvent?.endTime ? selectedEvent.endTime.replace(' ', 'T').substring(0, 16) : '',
    }
  });

  const onSave = async (data: EventFormData) => {
    try {
      setFormLoading(true);
      const submitData = new FormData();
      
      const eventJson = {
        ...data,
        placeId: parseInt(data.placeId),
        startTime: data.startTime.replace('T', ' ') + ":00",
        endTime: data.endTime.replace('T', ' ') + ":00",
        keepImageIds: keepImageIds
      };
      
      submitData.append('data', new Blob([JSON.stringify(eventJson)], { type: 'application/json' }));
      selectedImages.forEach(file => submitData.append('images', file));

      if (selectedEvent) {
        await eventService.updateEvent(selectedEvent.id, submitData);
        toast.success("Cập nhật thành công");
      } else {
        await eventService.createEvent(submitData);
        toast.success("Tạo mới thành công");
      }
      
      onSuccess();
    } catch (error: any) {
      toast.error(error.response?.data?.message || "Đã có lỗi xảy ra");
    } finally {
      setFormLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit(onSave)} className="space-y-4 max-h-[70vh] overflow-y-auto px-1 custom-scrollbar">
      <div className="space-y-1">
        <Label>Tên sự kiện <span className="text-red-500">*</span></Label>
        <Input {...register("name")} placeholder="Nhập tên..." disabled={formLoading} />
        {errors.name && <p className="text-[10px] text-red-500">{errors.name.message}</p>}
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-1">
          <Label>Bắt đầu <span className="text-red-500">*</span></Label>
          <Input type="datetime-local" {...register("startTime")} disabled={formLoading} />
          {errors.startTime && <p className="text-[10px] text-red-500">{errors.startTime.message}</p>}
        </div>
        <div className="space-y-1">
          <Label>Kết thúc <span className="text-red-500">*</span></Label>
          <Input type="datetime-local" {...register("endTime")} disabled={formLoading} />
          {errors.endTime && <p className="text-[10px] text-red-500">{errors.endTime.message}</p>}
        </div>
      </div>

      <div className="space-y-1">
        <Label className="font-bold text-gray-700">Địa điểm tổ chức <span className="text-red-500">*</span></Label>
        <Controller
          name="placeId"
          control={control}
          render={({ field }) => (
            <Select onValueChange={field.onChange} value={field.value} disabled={formLoading}>
              <SelectTrigger className="h-11 border-2 border-gray-200 bg-gray-100/50 hover:bg-gray-100 focus:bg-white focus:ring-2 focus:ring-primary/20 transition-all font-semibold text-gray-800">
                <SelectValue placeholder="-- Vui lòng chọn địa điểm tổ chức --" />
              </SelectTrigger>
              <SelectContent className="bg-white border-2 border-gray-200 shadow-xl rounded-xl p-1">
                {places.map(place => (
                    <SelectItem 
                        key={place.id} 
                        value={place.id.toString()} 
                        className="font-medium text-gray-700 cursor-pointer focus:bg-primary/10 focus:text-primary py-2.5 rounded-lg"
                    >
                        {place.name}
                    </SelectItem>
                ))}
              </SelectContent>
            </Select>
          )}
        />
        {errors.placeId && <p className="text-[10px] text-red-500">{errors.placeId.message}</p>}
      </div>

      <div className="space-y-1">
        <Label>Mô tả</Label>
        <Controller
          name="description"
          control={control}
          render={({ field }) => <RichTextEditor value={field.value || ''} onChange={field.onChange} />}
        />
      </div>

      <div className="space-y-2">
        <Label>Hình ảnh</Label>
        <div className="grid grid-cols-4 gap-2">
            {selectedEvent?.images?.filter(img => keepImageIds.includes(img.id)).map(img => (
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
        <Button type="submit" disabled={formLoading}>{formLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}Lưu sự kiện</Button>
      </div>
    </form>
  )
}
