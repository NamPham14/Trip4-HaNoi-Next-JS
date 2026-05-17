"use client";

import React, { useState, useEffect, useCallback } from 'react';
import { MapPin, Plus, Edit2, Trash2, Loader2, Search, ImageIcon, X, Eye, Filter } from 'lucide-react';
import { Button } from '@/shared/components/ui/button';
import { Input } from '@/shared/components/ui/input';
import { DataTable } from '@/shared/components/ui/table-data';
import { ColumnDef } from '@tanstack/react-table';
import { placeService } from '@/features/places/services/place-api';
import { Place } from '@/features/places/types/place';
import { Category, categoryService } from '@/features/category/services/category-api';
import { DeleteConfirmDialog } from '@/shared/components/ui/delete-confirm-dialog';
import { CrudModal } from '@/shared/components/ui/crud-modal';
import { DetailModal } from '@/shared/components/ui/detail-modal';
import { toast } from 'sonner';
import { Label } from '@/shared/components/ui/label';
import { RichTextEditor } from '@/shared/components/RichTextEditor';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/shared/components/ui/select';
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";

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

export default function PlaceManagementPage() {
  // Data State
  const [places, setPlaces] = useState<Place[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedDistrict, setSelectedDistrict] = useState<string>('all');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  
  const [pageIndex, setPageIndex] = useState(0);
  const [pageCount, setPageCount] = useState(0);
  const [totalElements, setTotalElements] = useState(0);
  const pageSize = 10;

  // Modal State
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [isDetailOpen, setIsDetailOpen] = useState(false);
  const [currentPlace, setCurrentPlace] = useState<Place | null>(null);
  const [formLoading, setFormLoading] = useState(false);

  // Form State (for Images)
  const [selectedImages, setSelectedImages] = useState<File[]>([]);
  const [keepImageIds, setKeepImageIds] = useState<number[]>([]);

  const { register, handleSubmit, control, reset, setValue, formState: { errors } } = useForm<PlaceFormData>({
    resolver: zodResolver(placeSchema),
  });

  const fetchPlaces = useCallback(async () => {
    try {
      setLoading(true);
      const data = await placeService.getPlacesAdmin({
        keyword: searchTerm,
        categoryId: selectedCategory === 'all' ? undefined : parseInt(selectedCategory),
        district: selectedDistrict === 'all' ? undefined : selectedDistrict,
        page: pageIndex + 1,
        size: pageSize,
      });
      setPlaces(data.data);
      setPageCount(data.totalPages);
      setTotalElements(data.totalElements);
    } catch (error) {
      toast.error("Không thể tải danh sách địa điểm");
    } finally {
      setLoading(false);
    }
  }, [searchTerm, selectedCategory, selectedDistrict, pageIndex]);

  useEffect(() => {
    const timer = setTimeout(() => fetchPlaces(), 500);
    return () => clearTimeout(timer);
  }, [fetchPlaces]);

  useEffect(() => {
    categoryService.getAllCategories({size: 100}).then(data => setCategories(data.data));
  }, []);

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
      
      setIsFormOpen(false);
      fetchPlaces();
    } catch (error: any) {
      toast.error(error.response?.data?.message || "Đã có lỗi xảy ra");
    } finally {
      setFormLoading(false);
    }
  };

  const openForm = (place?: Place) => {
    setCurrentPlace(place || null);
    if (place) {
      reset({
        name: place.name,
        description: place.description || '',
        categoryId: place.categoryId?.toString() || '',
        address: place.address || '',
        district: place.district || '',
        latitude: place.latitude?.toString() || '',
        longitude: place.longitude?.toString() || '',
        priceAvg: place.priceAvg?.toString() || '',
      });
      setKeepImageIds(place.images?.map(img => img.id) || []);
    } else {
      reset({
        name: '', description: '', categoryId: '', address: '', district: '', latitude: '', longitude: '', priceAvg: '',
      });
      setKeepImageIds([]);
    }
    setSelectedImages([]);
    setIsFormOpen(true);
  };

  const columns: ColumnDef<Place>[] = [
    {
      accessorKey: "name",
      header: "Địa điểm",
      cell: ({ row }) => (
        <div className="flex flex-col">
          <span className="font-bold text-gray-900">{row.original.name}</span>
          <span className="text-xs text-gray-500 line-clamp-1">{row.original.address}</span>
        </div>
      ),
    },
    {
      accessorKey: "categoryName",
      header: "Danh mục",
      cell: ({ row }) => <span className="px-2 py-1 bg-gray-100 rounded text-xs">{row.original.categoryName}</span>,
    },
    {
        accessorKey: "district",
        header: "Quận/Huyện",
    },
    {
      accessorKey: "ratingAvg",
      header: "Đánh giá",
      cell: ({ row }) => <span className="text-orange-500 font-bold">{row.original.ratingAvg || 0} ★</span>,
    },
    {
      id: "actions",
      header: () => <div className="text-right">Thao tác</div>,
      cell: ({ row }) => (
        <div className="flex justify-end gap-1">
          <Button variant="ghost" size="icon" onClick={() => { setCurrentPlace(row.original); setIsDetailOpen(true); }}>
            <Eye size={16} />
          </Button>
          <Button variant="ghost" size="icon" onClick={() => openForm(row.original)}>
            <Edit2 size={16} />
          </Button>
          <Button variant="ghost" size="icon" className="text-red-500 hover:bg-red-50" onClick={() => { setCurrentPlace(row.original); setIsDeleteOpen(true); }}>
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
          <h1 className="text-2xl font-bold flex items-center gap-2"><MapPin className="text-primary" />Quản lý Địa điểm</h1>
          <p className="text-gray-500">Quản lý các điểm đến, nhà hàng, di tích lịch sử.</p>
        </div>
        <Button onClick={() => openForm()} className="gap-2"><Plus size={18} />Thêm địa điểm</Button>
      </div>

      <div className="bg-white p-6 rounded-xl border-2 border-gray-100 shadow-md mb-8 space-y-4">
        <div className="flex flex-col md:flex-row gap-4 items-end">
            <div className="relative flex-1 w-full">
                <Label className="mb-2 block text-xs font-bold uppercase tracking-wider text-gray-500">Tìm kiếm</Label>
                <div className="relative">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                    <Input 
                        className="pl-10 h-11 bg-gray-50/50 border-gray-200 focus:bg-white transition-all font-medium" 
                        placeholder="Tìm theo tên hoặc địa chỉ..." 
                        value={searchTerm} 
                        onChange={(e) => { setSearchTerm(e.target.value); setPageIndex(0); }} 
                    />
                </div>
            </div>
            
            <div className="w-full md:w-[220px]">
                <Label className="mb-2 block text-xs font-bold uppercase tracking-wider text-gray-500">Danh mục</Label>
                <Select value={selectedCategory} onValueChange={(val) => { setSelectedCategory(val); setPageIndex(0); }}>
                    <SelectTrigger className="h-11 border-2 border-gray-100 bg-gray-50/30 font-semibold text-gray-700 hover:bg-gray-100/50 transition-colors">
                        <div className="flex items-center gap-2">
                            <Filter size={14} className="text-primary" />
                            <SelectValue placeholder="Danh mục" />
                        </div>
                    </SelectTrigger>
                    <SelectContent>
                        <SelectItem value="all" className="font-bold text-primary">Tất cả danh mục</SelectItem>
                        {categories.map(c => <SelectItem key={c.id} value={c.id.toString()}>{c.name}</SelectItem>)}
                    </SelectContent>
                </Select>
            </div>

            <div className="w-full md:w-[200px]">
                <Label className="mb-2 block text-xs font-bold uppercase tracking-wider text-gray-500">Khu vực</Label>
                <Select value={selectedDistrict} onValueChange={(val) => { setSelectedDistrict(val); setPageIndex(0); }}>
                    <SelectTrigger className="h-11 border-2 border-gray-100 bg-gray-50/30 font-semibold text-gray-700 hover:bg-gray-100/50 transition-colors">
                         <div className="flex items-center gap-2">
                            <MapPin size={14} className="text-primary" />
                            <SelectValue placeholder="Quận/Huyện" />
                        </div>
                    </SelectTrigger>
                    <SelectContent>
                        <SelectItem value="all" className="font-bold text-primary">Tất cả quận</SelectItem>
                        {DISTRICTS.map(d => <SelectItem key={d} value={d}>{d}</SelectItem>)}
                    </SelectContent>
                </Select>
            </div>

            <Button 
                variant="outline" 
                className="h-11 px-4 border-2 border-gray-100 text-gray-500 hover:text-primary hover:border-primary transition-all"
                onClick={() => {
                    setSearchTerm('');
                    setSelectedCategory('all');
                    setSelectedDistrict('all');
                    setPageIndex(0);
                }}
            >
                Đặt lại
            </Button>
        </div>
        <div className="flex items-center gap-2 text-sm text-gray-500 bg-gray-50 w-fit px-3 py-1 rounded-full border border-gray-100">
            <div className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse"></div>
            Tìm thấy <strong>{totalElements}</strong> địa điểm phù hợp
        </div>
      </div>

      <DataTable columns={columns} data={places} pageCount={pageCount} pageIndex={pageIndex} onPageChange={setPageIndex} isLoading={loading} />

      {/* Detail Modal */}
      <DetailModal 
        isOpen={isDetailOpen} 
        onClose={() => setIsDetailOpen(false)} 
        title="Chi tiết địa điểm" 
        data={currentPlace} 
        fields={[
            { label: "Tên địa điểm", key: "name" },
            { label: "Danh mục", key: "categoryName" },
            { label: "Địa chỉ", key: "address" },
            { label: "Quận/Huyện", key: "district" },
            { label: "Tọa độ", key: "id", render: (val) => `${currentPlace?.latitude}, ${currentPlace?.longitude}` },
            { label: "Giá TB", key: "priceAvg", render: (val) => val ? `${val.toLocaleString()} VNĐ` : "Chưa cập nhật" },
            { label: "Lượt xem", key: "viewCount" },
            { label: "Yêu thích", key: "favoriteCount" },
            { label: "Mô tả", key: "description", render: (val) => <div dangerouslySetInnerHTML={{ __html: val }} className="text-xs" /> },
            { label: "Hình ảnh", key: "images", render: (val: any[]) => (
                <div className="flex gap-2 flex-wrap">
                    {val?.map(img => <img key={img.id} src={img.imageUrl} className="w-16 h-16 object-cover rounded border" />)}
                </div>
            )}
        ]}
      />

      {/* Form Modal */}
      <CrudModal isOpen={isFormOpen} onClose={() => setIsFormOpen(false)} title={currentPlace ? "Cập nhật địa điểm" : "Thêm địa điểm mới"}>
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
            <Button type="button" variant="outline" onClick={() => setIsFormOpen(false)}>Hủy</Button>
            <Button type="submit" disabled={formLoading}>{formLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}Lưu địa điểm</Button>
          </div>
        </form>
      </CrudModal>

      <DeleteConfirmDialog isOpen={isDeleteOpen} onClose={() => setIsDeleteOpen(false)} onConfirm={async () => {
         try {
           setFormLoading(true);
           await placeService.deletePlace(currentPlace!.id);
           toast.success("Xóa thành công");
           setIsDeleteOpen(false);
           fetchPlaces();
         } catch (e: any) { toast.error("Lỗi khi xóa"); }
         finally { setFormLoading(false); }
      }} isLoading={formLoading} />
    </div>
  );
}
