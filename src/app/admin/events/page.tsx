/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import React, { useState, useEffect, useCallback } from 'react';
import { Calendar, Plus, Edit2, Trash2, Search, Eye } from 'lucide-react';
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
import { placeService } from '@/features/places/services/place-api';
import { Place } from '@/features/places/types/place';
import { EventForm } from '@/features/events/components/EventForm';

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

  const handleFormSuccess = () => {
    setIsFormOpen(false);
    fetchEvents();
  };

  const openForm = (event?: Event) => {
    setSelectedEvent(event || null);
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
      <CrudModal 
        isOpen={isFormOpen} 
        onClose={() => setIsFormOpen(false)} 
        title={selectedEvent ? "Cập nhật sự kiện" : "Thêm mới sự kiện"}
      >
        <EventForm 
          key={selectedEvent?.id || 'new'}
          selectedEvent={selectedEvent} 
          places={places} 
          onSuccess={handleFormSuccess} 
          onCancel={() => setIsFormOpen(false)} 
        />
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
