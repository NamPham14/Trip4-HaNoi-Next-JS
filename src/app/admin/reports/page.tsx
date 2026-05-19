/* eslint-disable @typescript-eslint/no-explicit-any */
'use client'

import React, { useState, useEffect, useCallback } from 'react'
import {
  AlertTriangle,
  User,
  Calendar,
  Eye,
  CheckCircle,
  XCircle,
  MessageSquare,
  FileText,
  Star,
} from 'lucide-react'
import { DataTable } from '@/shared/components/ui/table-data'
import { ColumnDef } from '@tanstack/react-table'
import { reportService, Report } from '@/features/security/services/report-api'
import { toast } from 'sonner'
import {
  AdminFilters,
  FilterOption,
} from '@/shared/components/ui/admin-filters'
import { Badge } from '@/shared/components/ui/badge'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from '@/shared/components/ui/dialog'
import { Button } from '@/shared/components/ui/button'

export default function ReportManagementPage() {
  const [data, setData] = useState<Report[]>([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedStatus, setSelectedStatus] = useState<string>('PENDING')

  const [isDetailOpen, setIsDetailOpen] = useState(false)
  const [selectedItem, setSelectedItem] = useState<Report | null>(null)
  const [actionLoading, setActionLoading] = useState(false)

  const fetchReports = useCallback(async () => {
    try {
      setLoading(true)
      const res =
        selectedStatus === 'PENDING'
          ? await reportService.getPendingReports()
          : await reportService.getAllReports()
      setData(res)
    } catch (error) {
      toast.error('Lỗi tải danh sách báo cáo')
    } finally {
      setLoading(false)
    }
  }, [selectedStatus])

  const filteredData = React.useMemo(() => {
    return data.filter(
      (item) =>
        item.reporterName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.reason.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.reportType.toLowerCase().includes(searchTerm.toLowerCase())
    )
  }, [data, searchTerm])

  useEffect(() => {
    const loadReports = async () => {
      await fetchReports()
    }

    loadReports()
  }, [fetchReports])

  const handleUpdateStatus = async (id: number, status: string) => {
    try {
      setActionLoading(true)
      await reportService.updateReportStatus(id, status)
      toast.success(`Đã cập nhật trạng thái: ${status}`)
      setIsDetailOpen(false)
      fetchReports()
    } catch (error) {
      toast.error('Lỗi khi cập nhật trạng thái')
    } finally {
      setActionLoading(false)
    }
  }

  const getReportTypeIcon = (type: string) => {
    switch (type) {
      case 'POST':
        return <FileText size={14} className="text-blue-500" />
      case 'COMMENT':
        return <MessageSquare size={14} className="text-green-500" />
      case 'USER':
        return <User size={14} className="text-purple-500" />
      case 'REVIEW':
        return <Star size={14} className="text-amber-500" />
      default:
        return <AlertTriangle size={14} />
    }
  }

  const columns: ColumnDef<Report>[] = [
    {
      accessorKey: 'targetTitle',
      header: 'Đối tượng bị báo cáo',
      cell: ({ row }) => (
        <div className="flex flex-col max-w-[250px]">
          <span className="font-bold text-gray-900 line-clamp-1">
            {row.original.targetTitle || 'N/A'}
          </span>
          <div className="flex items-center gap-2 text-[10px] text-gray-500">
            {getReportTypeIcon(row.original.reportType)}
            <span>ID: {row.original.targetId}</span>
          </div>
        </div>
      ),
    },
    {
      accessorKey: 'reporterName',
      header: 'Người báo cáo',
      cell: ({ row }) => (
        <div className="flex flex-col">
          <span className="font-medium text-sm text-gray-900">
            {row.original.reporterName}
          </span>
          <span className="text-[10px] text-gray-400">
            ID: {row.original.reporterId}
          </span>
        </div>
      ),
    },
    {
      accessorKey: 'reason',
      header: 'Lý do',
      cell: ({ row }) => (
        <span className="text-xs line-clamp-1 italic">
          &quot;{row.original.reason}&quot;
        </span>
      ),
    },
    {
      accessorKey: 'status',
      header: 'Trạng thái',
      cell: ({ row }) => {
        const status = row.original.status
        return (
          <Badge
            className={
              status === 'PENDING'
                ? 'bg-yellow-100 text-yellow-700 hover:bg-yellow-100 border-none'
                : status === 'RESOLVED'
                  ? 'bg-green-100 text-green-700 hover:bg-green-100 border-none'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-100 border-none'
            }
          >
            {status}
          </Badge>
        )
      },
    },
    {
      accessorKey: 'createdAt',
      header: 'Ngày gửi',
      cell: ({ row }) => (
        <div className="flex items-center gap-1 text-[10px] text-gray-500">
          <Calendar size={12} />{' '}
          {new Date(row.original.createdAt).toLocaleDateString('vi-VN')}
        </div>
      ),
    },
    {
      id: 'actions',
      header: () => <div className="text-right">Thao tác</div>,
      cell: ({ row }) => (
        <div className="flex justify-end gap-2">
          <button
            onClick={() => {
              setSelectedItem(row.original)
              setIsDetailOpen(true)
            }}
            className="p-2 hover:bg-gray-100 rounded-lg text-gray-500 transition-colors"
            title="Xem chi tiết"
          >
            <Eye size={18} />
          </button>
          {row.original.status === 'PENDING' && (
            <>
              <button
                onClick={() => handleUpdateStatus(row.original.id, 'RESOLVED')}
                className="p-2 hover:bg-green-50 rounded-lg text-green-600 transition-colors"
                title="Đã xử lý"
              >
                <CheckCircle size={18} />
              </button>
              <button
                onClick={() => handleUpdateStatus(row.original.id, 'DISMISSED')}
                className="p-2 hover:bg-red-50 rounded-lg text-red-600 transition-colors"
                title="Bỏ qua"
              >
                <XCircle size={18} />
              </button>
            </>
          )}
        </div>
      ),
    },
  ]

  const statusOptions: FilterOption[] = [
    {
      label: 'Chờ xử lý',
      value: 'PENDING',
      icon: <div className="w-2 h-2 rounded-full bg-yellow-400" />,
    },
    {
      label: 'Tất cả báo cáo',
      value: 'ALL',
      icon: <div className="w-2 h-2 rounded-full bg-blue-500" />,
    },
  ]

  return (
    <div className="p-8 max-w-7xl mx-auto">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-2xl font-bold flex items-center gap-2">
            <AlertTriangle className="text-primary" /> Quản lý Báo cáo vi phạm
          </h1>
          <p className="text-gray-500">
            Xử lý các báo cáo nội dung không phù hợp từ người dùng.
          </p>
        </div>
      </div>

      <AdminFilters
        searchTerm={searchTerm}
        onSearchChange={(val) => {
          setSearchTerm(val)
        }}
        searchPlaceholder="Tìm kiếm theo lý do, người gửi..."
        statusValue={selectedStatus}
        onStatusChange={(val) => {
          setSelectedStatus(val)
        }}
        statusOptions={statusOptions}
        onReset={() => {
          setSearchTerm('')
          setSelectedStatus('PENDING')
        }}
        totalElements={data.length}
        unitName="báo cáo"
      />

      <DataTable columns={columns} data={filteredData} isLoading={loading} />

      {/* Report Detail Modal */}
      <Dialog open={isDetailOpen} onOpenChange={setIsDetailOpen}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <AlertTriangle className="text-hanoi-red" />
              Chi tiết báo cáo #{selectedItem?.id}
            </DialogTitle>
            <DialogDescription>
              Thông tin chi tiết về nội dung bị báo cáo.
            </DialogDescription>
          </DialogHeader>

          {selectedItem && (
            <div className="py-4 space-y-4">
              <div className="bg-gray-50 p-4 rounded-xl border border-gray-200">
                <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-1">
                  Đối tượng vi phạm
                </p>
                <p className="font-bold text-lg text-gray-900 line-clamp-2">
                  {selectedItem.targetTitle}
                </p>
                <div className="flex items-center gap-2 mt-2">
                  <Badge
                    variant="outline"
                    className="text-[10px] uppercase font-bold"
                  >
                    {selectedItem.reportType}
                  </Badge>
                  <span className="text-xs text-gray-500 font-medium">
                    ID: {selectedItem.targetId}
                  </span>
                </div>
              </div>

              <div className="bg-gray-50 p-3 rounded-xl border">
                <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">
                  Người báo cáo
                </p>
                <p className="font-bold text-gray-900">
                  {selectedItem.reporterName} (ID: {selectedItem.reporterId})
                </p>
              </div>

              <div className="bg-red-50 p-4 rounded-xl border border-red-100">
                <p className="text-[10px] font-bold text-red-400 uppercase tracking-widest mb-1">
                  Lý do vi phạm
                </p>
                <p className="text-sm font-medium text-red-900 italic">
                  &quot;{selectedItem.reason}&quot;
                </p>
              </div>

              <div className="bg-blue-50 p-4 rounded-xl border border-blue-100">
                <p className="text-xs text-blue-800 font-bold mb-1 flex items-center gap-1">
                  <Eye size={14} /> Gợi ý xử lý:
                </p>
                <p className="text-[11px] text-blue-700 leading-relaxed">
                  Bạn nên kiểm tra {selectedItem.reportType.toLowerCase()} có ID
                  là {selectedItem.targetId} trước khi thực hiện các hành động
                  gỡ bỏ hoặc cảnh cáo người dùng.
                </p>
              </div>
            </div>
          )}

          <DialogFooter className="flex flex-col sm:flex-row gap-2">
            <Button
              variant="outline"
              onClick={() => setIsDetailOpen(false)}
              className="font-bold"
            >
              Đóng
            </Button>
            {selectedItem?.status === 'PENDING' && (
              <>
                <Button
                  variant="ghost"
                  onClick={() =>
                    handleUpdateStatus(selectedItem.id, 'DISMISSED')
                  }
                  disabled={actionLoading}
                  className="text-red-500 font-bold"
                >
                  Bỏ qua
                </Button>
                <Button
                  onClick={() =>
                    handleUpdateStatus(selectedItem.id, 'RESOLVED')
                  }
                  disabled={actionLoading}
                  className="bg-green-600 hover:bg-green-700 text-white font-bold flex-1"
                >
                  Đã xử lý xong
                </Button>
              </>
            )}
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
