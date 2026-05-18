/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import React, { useState, useEffect, useCallback } from 'react';
import { Tags, Plus, Search, Edit2, Trash2, Eye } from 'lucide-react';
import { Button } from '@/shared/components/ui/button';
import { Input } from '@/shared/components/ui/input';
import { DataTable } from '@/shared/components/ui/table-data';
import { ColumnDef } from '@tanstack/react-table';
import { Category, categoryService } from '@/features/category/services/category-api';
import { DeleteConfirmDialog } from '@/shared/components/ui/delete-confirm-dialog';
import { CrudModal } from '@/shared/components/ui/crud-modal';
import { DetailModal } from '@/shared/components/ui/detail-modal';
import { toast } from 'sonner';
import { CategoryForm, CategoryFormData } from '@/features/category/components/CategoryForm';

export default function CategoryManagementPage() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [pageIndex, setPageIndex] = useState(0);
  const [pageCount, setPageCount] = useState(0);
  const [totalElements, setTotalElements] = useState(0);
  const pageSize = 10;

  const [isDeleteOpen, setIsDeleteOpen] = useState(false);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [isDetailOpen, setIsDetailOpen] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState<Category | null>(null);
  const [formLoading, setFormLoading] = useState(false);

  const fetchCategories = useCallback(async () => {
    try {
      setLoading(true);
      const data = await categoryService.getAllCategories({
        keyword: searchTerm,
        page: pageIndex + 1,
        size: pageSize,
      });
      setCategories(data.data);
      setPageCount(data.totalPages);
      setTotalElements(data.totalElements);
    } catch (error) {
      toast.error("Không thể tải danh sách danh mục");
    } finally {
      setLoading(false);
    }
  }, [searchTerm, pageIndex]);

  useEffect(() => {
    const timer = setTimeout(() => fetchCategories(), 500);
    return () => clearTimeout(timer);
  }, [fetchCategories]);

  const onSave = async (data: CategoryFormData) => {
    try {
      setFormLoading(true);
      if (selectedCategory) {
        await categoryService.updateCategory(selectedCategory.id, data);
        toast.success("Cập nhật thành công");
      } else {
        await categoryService.createCategory(data);
        toast.success("Thêm mới thành công");
      }
      setIsFormOpen(false);
      fetchCategories();
    } catch (error: any) {
      toast.error(error.response?.data?.message || "Đã có lỗi xảy ra");
    } finally {
      setFormLoading(false);
    }
  };

  const openForm = (category?: Category) => {
    setSelectedCategory(category || null);
    setIsFormOpen(true);
  };

  const columns: ColumnDef<Category>[] = [
    { accessorKey: "id", header: "ID" },
    { accessorKey: "name", header: "Tên danh mục", cell: ({ row }) => <span className="font-bold">{row.original.name}</span> },
    {
      id: "actions",
      header: () => <div className="text-right">Thao tác</div>,
      cell: ({ row }) => (
        <div className="flex justify-end gap-1">
          <Button variant="ghost" size="icon" onClick={() => { setSelectedCategory(row.original); setIsDetailOpen(true); }}>
            <Eye size={16} />
          </Button>
          <Button variant="ghost" size="icon" onClick={() => openForm(row.original)}>
            <Edit2 size={16} />
          </Button>
          <Button variant="ghost" size="icon" className="text-red-500 hover:bg-red-50" onClick={() => { setSelectedCategory(row.original); setIsDeleteOpen(true); }}>
            <Trash2 size={16} />
          </Button>
        </div>
      ),
    },
  ];

  return (
    <div className="p-8 max-w-6xl mx-auto">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-2xl font-bold flex items-center gap-2"><Tags className="text-primary" />Quản lý Danh mục</h1>
          <p className="text-gray-500">Quản lý các loại hình địa điểm và sự kiện.</p>
        </div>
        <Button onClick={() => openForm()} className="gap-2"><Plus size={18} />Thêm danh mục</Button>
      </div>

      <div className="bg-white p-6 rounded-xl border shadow-sm mb-6 flex justify-between items-center">
        <div className="relative max-w-sm w-full">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
          <Input className="pl-10" placeholder="Tìm kiếm..." value={searchTerm} onChange={(e) => { setSearchTerm(e.target.value); setPageIndex(0); }} />
        </div>
        <div className="text-sm">Tổng: <strong>{totalElements}</strong></div>
      </div>

      <DataTable columns={columns} data={categories} pageCount={pageCount} pageIndex={pageIndex} onPageChange={setPageIndex} isLoading={loading} />

      <DetailModal 
        isOpen={isDetailOpen} 
        onClose={() => setIsDetailOpen(false)} 
        title="Chi tiết danh mục" 
        data={selectedCategory} 
        fields={[
            { label: "ID", key: "id" },
            { label: "Tên danh mục", key: "name" }
        ]}
      />

      <CrudModal isOpen={isFormOpen} onClose={() => setIsFormOpen(false)} title={selectedCategory ? "Cập nhật" : "Thêm mới"}>
        <CategoryForm 
          selectedCategory={selectedCategory} 
          formLoading={formLoading} 
          onSubmit={onSave} 
          onCancel={() => setIsFormOpen(false)} 
        />
      </CrudModal>

      <DeleteConfirmDialog 
        isOpen={isDeleteOpen} 
        onClose={() => setIsDeleteOpen(false)} 
        onConfirm={async () => {
          try {
            setFormLoading(true);
            await categoryService.deleteCategory(selectedCategory!.id);
            toast.success("Xóa thành công");
            setIsDeleteOpen(false);
            fetchCategories();
          } catch (e: any) {
            toast.error(e.response?.data?.message || "Lỗi khi xóa");
          } finally { 
            setFormLoading(false); 
          }
        }} 
        isLoading={formLoading} 
      />
    </div>
  );
}
