"use client";

import React, { useState, useEffect, useCallback } from 'react';
import { Calendar, Plus, Edit2, Trash2, Loader2, Search, ImageIcon, X, Eye } from 'lucide-react';
import { Button } from '@/shared/components/ui/button';
import { Input } from '@/shared/components/ui/input';
import { DataTable } from '@/shared/components/ui/table-data';
import { ColumnDef } from '@tanstack/react-table';
import { eventService } from '@/features/events/services/event-api';
import { Event } from '@/features/events/types/event';
import { DeleteConfirmDialog } from '@/shared/components/ui/delete-confirm-dialog';
import { CrudModal } from '@/shared/components/ui/crud-modal';
import { DetailModal } from '@/shared/components/ui/detail-modal';
import { toast } from 'sonner';
import { Label } from '@/shared/components/ui/label';
import { RichTextEditor } from '@/shared/components/RichTextEditor';
import { placeService } from '@/features/places/services/place-api';
import { Place } from '@/features/places/types/place';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/shared/components/ui/select';
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";

// 1. Define Validation Schema
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

export default function EventManagementPage() {
  // Data State
  const [events, setEvents] = useState<Event[]>([]);
  const [places, setPlaces] = useState<Place[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [pageIndex, setPageIndex] = useState(0);
  const [pageCount, setPageCount] = useState(0);
  const [totalElements, setTotalElements] = useState(0);
  const pageSize = 10;

  // Modal State
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [isDetailOpen, setIsDetailOpen] = useState(false);
  const [selectedEvent, setSelectedEvent] = useState<Event | null>(null);
  const [formLoading, setFormLoading] = useState(false);

  // Form State
  const [selectedImages, setSelectedImages] = useState<File[]>([]);
  const [keepImageIds, setKeepImageIds] = useState<number[]>([]);

  // 2. Setup Form with Validation
  const { register, handleSubmit, control, reset, setValue, formState: { errors } } = useForm<EventFormData>({
    resolver: zodResolver(eventSchema),
  });

  const fetchEvents = useCallback(async () => {
    try {
      setLoading(true);
      const data = await eventService.getEventsAdmin({
        keyword: searchTerm,
        page: pageIndex + 1,
        size: pageSize,
      });
      setEvents(data.data);
      setPageCount(data.totalPages);
      setTotalElements(data.totalElements);
    } catch (error) {
      toast.error("Không thể tải danh sách sự kiện");
    } finally {
      setLoading(false);
    }
  }, [searchTerm, pageIndex]);

  useEffect(() => {
    const timer = setTimeout(() => fetchEvents(), 500);
    return () => clearTimeout(timer);
  }, [fetchEvents]);

  useEffect(() => {
    const fetchPlaces = async () => {
      try {
        const data = await placeService.getPlacesList();
        setPlaces(data);
      } catch (error) {
        console.error("Failed to fetch places", error);
      }
    };
    fetchPlaces();
  }, []);

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
      
      setIsFormOpen(false);
      fetchEvents();
    } catch (error: any) {
      toast.error(error.response?.data?.message || "Đã có lỗi xảy ra");
    } finally {
      setFormLoading(false);
    }
  };

  const openForm = (event?: Event) => {
    setSelectedEvent(event || null);
    if (event) {
      reset({
        name: event.name,
        description: event.description || '',
        placeId: event.placeId?.toString() || '',
        startTime: event.startTime ? event.startTime.replace(' ', 'T').substring(0, 16) : '',
        endTime: event.endTime ? event.endTime.replace(' ', 'T').substring(0, 16) : '',
      });
      setKeepImageIds(event.images?.map(img => img.id) || []);
    } else {
      reset({
        name: '',
        description: '',
        placeId: '',
        startTime: '',
        endTime: '',
      });
      setKeepImageIds([]);
    }
    setSelectedImages([]);
    setIsFormOpen(true);
  };

  const columns: ColumnDef<Event>[] = [
    {
      accessorKey: "name",
      header: "Tên sự kiện",
      cell: ({ row }) => (
        <div className="flex flex-col">
          <span className="font-bold text-gray-900">{row.original.name}</span>
          <span className="text-xs text-gray-500">{row.original.placeName}</span>
        </div>
      ),
    },
    {
        accessorKey: "status",
        header: "Trạng thái",
        cell: ({ row }) => {
          const status = row.original.status;
          const colors: Record<string, string> = {
            'UPCOMING': 'bg-blue-100 text-blue-700',
            'ONGOING': 'bg-green-100 text-green-700',
            'ENDED': 'bg-gray-100 text-gray-600'
          };
          return <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${colors[status] || colors.ENDED}`}>{status}</span>;
        }
    },
    {
      id: "actions",
      header: () => <div className="text-right">Thao tác</div>,
      cell: ({ row }) => (
        <div className="flex justify-end gap-1">
          <Button variant="ghost" size="icon" onClick={() => { setSelectedEvent(row.original); setIsDetailOpen(true); }}>
            <Eye size={16} />
          </Button>
          <Button variant="ghost" size="icon" onClick={() => openForm(row.original)}>
            <Edit2 size={16} />
          </Button>
          <Button variant="ghost" size="icon" className="text-red-500 hover:bg-red-50" onClick={() => { setSelectedEvent(row.original); setIsDeleteOpen(true); }}>
            <Trash2 size={16} />
          </Button>
        </div>
      ),
    },
  ];

  return (
    <div className="p-8 max-w-7xl mx-auto">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-2xl font-bold flex items-center gap-2"><Calendar className="text-primary" />Quản lý Sự kiện</h1>
          <p className="text-gray-500">Quản lý các sự kiện văn hóa, du lịch.</p>
        </div>
        <Button onClick={() => openForm()} className="gap-2"><Plus size={18} />Thêm sự kiện</Button>
      </div>

      <div className="bg-white p-6 rounded-xl border shadow-sm mb-6 flex justify-between items-center">
        <div className="relative max-w-sm w-full">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
          <Input className="pl-10" placeholder="Tìm kiếm..." value={searchTerm} onChange={(e) => { setSearchTerm(e.target.value); setPageIndex(0); }} />
        </div>
        <div className="text-sm text-gray-500">Tổng cộng: <strong>{totalElements}</strong> sự kiện</div>
      </div>

      <DataTable columns={columns} data={events} pageCount={pageCount} pageIndex={pageIndex} onPageChange={setPageIndex} isLoading={loading} />

      {/* Detail Modal */}
      <DetailModal 
        isOpen={isDetailOpen} 
        onClose={() => setIsDetailOpen(false)} 
        title="Chi tiết sự kiện" 
        data={selectedEvent} 
        fields={[
            { label: "Tên sự kiện", key: "name" },
            { label: "Địa điểm", key: "placeName" },
            { label: "Bắt đầu", key: "startTime" },
            { label: "Kết thúc", key: "endTime" },
            { label: "Trạng thái", key: "status" },
            { label: "Mô tả", key: "description", render: (val) => <div dangerouslySetInnerHTML={{ __html: val }} className="text-xs" /> },
            { label: "Hình ảnh", key: "images", render: (val: any[]) => (
                <div className="flex gap-2 flex-wrap">
                    {val?.map(img => <img key={img.id} src={img.imageUrl} className="w-16 h-16 object-cover rounded border" />)}
                </div>
            )}
        ]}
      />

      {/* Form Modal */}
      <CrudModal isOpen={isFormOpen} onClose={() => setIsFormOpen(false)} title={selectedEvent ? "Cập nhật" : "Thêm mới"}>
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
            <Label>Địa điểm <span className="text-red-500">*</span></Label>
            <Controller
              name="placeId"
              control={control}
              render={({ field }) => (
                <Select onValueChange={field.onChange} value={field.value} disabled={formLoading}>
                  <SelectTrigger><SelectValue placeholder="Chọn địa điểm..." /></SelectTrigger>
                  <SelectContent>
                    {places.map(place => <SelectItem key={place.id} value={place.id.toString()}>{place.name}</SelectItem>)}
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
            <Button type="button" variant="outline" onClick={() => setIsFormOpen(false)}>Hủy</Button>
            <Button type="submit" disabled={formLoading}>{formLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}Lưu</Button>
          </div>
        </form>
      </CrudModal>

      <DeleteConfirmDialog isOpen={isDeleteOpen} onClose={() => setIsDeleteOpen(false)} onConfirm={async () => {
         try {
           setFormLoading(true);
           await eventService.deleteEvent(selectedEvent!.id);
           toast.success("Xóa thành công");
           setIsDeleteOpen(false);
           fetchEvents();
         } catch (e: any) { toast.error("Lỗi khi xóa"); }
         finally { setFormLoading(false); }
      }} isLoading={formLoading} />
    </div>
  );
}
