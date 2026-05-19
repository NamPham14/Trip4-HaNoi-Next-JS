/* eslint-disable @typescript-eslint/no-explicit-any */
'use client'

import React, { useState } from 'react'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from '@/shared/components/ui/dialog'
import { Button } from '@/shared/components/ui/button'
import { Label } from '@/shared/components/ui/label'
import { RadioGroup, RadioGroupItem } from '@/shared/components/ui/radio-group'
import { toast } from 'sonner'
import axiosInstance from '@/shared/api/axios-instance'
import { AlertTriangle, Loader2 } from 'lucide-react'

interface ReportModalProps {
  isOpen: boolean
  onClose: () => void
  targetId: number
  reportType: 'POST' | 'COMMENT' | 'USER' | 'REVIEW'
  targetTitle?: string
}

const REPORT_REASONS = [
  { id: 'spam', label: 'Spam hoặc nội dung rác' },
  { id: 'harassment', label: 'Quấy rối hoặc bắt nạt' },
  { id: 'hate_speech', label: 'Ngôn từ gây thù ghét' },
  { id: 'inappropriate', label: 'Nội dung không phù hợp / Nhạy cảm' },
  { id: 'misinformation', label: 'Thông tin sai lệch' },
  { id: 'violence', label: 'Bạo lực hoặc đe dọa' },
  { id: 'other', label: 'Lý do khác' },
]

export const ReportModal = ({
  isOpen,
  onClose,
  targetId,
  reportType,
  targetTitle,
}: ReportModalProps) => {
  const [reason, setReason] = useState(REPORT_REASONS[0].label)
  const [loading, setLoading] = useState(false)

  const handleSubmit = async () => {
    try {
      setLoading(true)
      await axiosInstance.post('/reports', {
        reportType,
        targetId,
        reason,
      })

      toast.success('Cảm ơn bạn! Báo cáo đã được gửi và sẽ được Admin xem xét.')
      onClose()
    } catch (error: any) {
      toast.error(
        error.response?.data?.message ||
          'Không thể gửi báo cáo. Vui lòng thử lại sau.'
      )
    } finally {
      setLoading(false)
    }
  }

  const getTargetLabel = () => {
    switch (reportType) {
      case 'POST':
        return 'bài viết'
      case 'COMMENT':
        return 'bình luận'
      case 'USER':
        return 'người dùng'
      case 'REVIEW':
        return 'đánh giá'
      default:
        return 'nội dung'
    }
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[425px] rounded-2xl">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 text-hanoi-red">
            <AlertTriangle className="h-5 w-5" />
            Báo cáo nội dung
          </DialogTitle>
          <DialogDescription className="text-xs font-medium pt-2">
            Tại sao bạn muốn báo cáo {getTargetLabel()} này?
            {targetTitle && (
              <span className="block mt-1 italic font-bold text-gray-900">
                &quot;{targetTitle}&quot;
              </span>
            )}
          </DialogDescription>
        </DialogHeader>

        <div className="py-4">
          <RadioGroup
            value={reason}
            onValueChange={setReason}
            className="space-y-3"
          >
            {REPORT_REASONS.map((item) => (
              <div
                key={item.id}
                className="flex items-center space-x-3 p-3 rounded-xl border border-gray-100 hover:bg-gray-50 transition-colors cursor-pointer"
                onClick={() => setReason(item.label)}
              >
                <RadioGroupItem value={item.label} id={item.id} />
                <Label
                  htmlFor={item.id}
                  className="flex-1 cursor-pointer font-bold text-sm text-gray-700"
                >
                  {item.label}
                </Label>
              </div>
            ))}
          </RadioGroup>
        </div>

        <DialogFooter className="flex flex-col sm:flex-row gap-2">
          <Button
            variant="ghost"
            onClick={onClose}
            className="rounded-xl font-bold"
          >
            Hủy
          </Button>
          <Button
            onClick={handleSubmit}
            disabled={loading}
            className="bg-hanoi-red hover:bg-hanoi-red/90 rounded-xl font-bold flex-1"
          >
            {loading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Đang gửi...
              </>
            ) : (
              'Gửi báo cáo'
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
