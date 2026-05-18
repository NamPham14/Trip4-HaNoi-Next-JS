/* eslint-disable @typescript-eslint/no-explicit-any */
'use client'

import React, { useState } from 'react'
import { useForm, Controller } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import * as z from 'zod'
import { X, ImageIcon, Send, Clock, Loader2 } from 'lucide-react'
import { Button } from '@/shared/components/ui/button'
import { Input } from '@/shared/components/ui/input'
import { Label } from '@/shared/components/ui/label'
import { toast } from 'sonner'
import { MultiSelect } from "react-multi-select-component"
import { CrudModal } from '@/shared/components/ui/crud-modal'
import { postService } from '@/features/posts/services/post-api'
import { Place } from '@/features/places/types/place'

const postSchema = z.object({
  title: z.string().min(5, 'Tiêu đề ít nhất 5 ký tự'),
  content: z.string().min(10, 'Nội dung ít nhất 10 ký tự'),
  taggedPlaceIds: z.array(z.number()).optional(),
})

type PostFormData = z.infer<typeof postSchema>

interface CreatePostModalProps {
  isOpen: boolean
  onClose: () => void
  allPlaces: Place[]
}

export const CreatePostModal: React.FC<CreatePostModalProps> = ({
  isOpen,
  onClose,
  allPlaces,
}) => {
  const [selectedImages, setSelectedImages] = useState<File[]>([])
  const [imagePreviews, setImagePreviews] = useState<string[]>([])
  const [isSubmitting, setIsSubmitting] = useState(false)

  const {
    register,
    handleSubmit,
    control,
    reset,
    formState: { errors },
  } = useForm<PostFormData>({
    resolver: zodResolver(postSchema),
    defaultValues: { taggedPlaceIds: [] },
  })

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const files = Array.from(e.target.files)
      setSelectedImages((prev) => [...prev, ...files])

      const newPreviews = files.map((file) => URL.createObjectURL(file))
      setImagePreviews((prev) => [...prev, ...newPreviews])
    }
  }

  const removeImage = (index: number) => {
    setSelectedImages((prev) => prev.filter((_, i) => i !== index))
    setImagePreviews((prev) => prev.filter((_, i) => i !== index))
  }

  const onSubmit = async (data: PostFormData) => {
    try {
      setIsSubmitting(true)
      await postService.createPost(data, selectedImages)
      toast.success('Bài viết đã được gửi và đang chờ quản trị viên phê duyệt!')
      onClose()
      reset()
      setSelectedImages([])
      setImagePreviews([])
    } catch (error: any) {
      toast.error(error.response?.data?.message || 'Lỗi khi đăng bài')
    } finally {
      setIsSubmitting(false)
    }
  }

  const placeOptions = allPlaces.map((p) => ({ label: p.name, value: p.id }))

  return (
    <CrudModal
      isOpen={isOpen}
      onClose={onClose}
      title="Tạo bài viết mới"
    >
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        <div className="space-y-2">
          <Label className="font-bold">
            Tiêu đề bài viết <span className="text-red-500">*</span>
          </Label>
          <Input
            {...register('title')}
            placeholder="Vd: Một ngày lang thang Hồ Tây..."
            className="h-11 font-medium"
            disabled={isSubmitting}
          />
          {errors.title && (
            <p className="text-xs text-red-500 font-medium">
              {errors.title.message}
            </p>
          )}
        </div>

        <div className="space-y-2">
          <Label className="font-bold">
            Nội dung chia sẻ <span className="text-red-500">*</span>
          </Label>
          <textarea
            {...register('content')}
            placeholder="Hãy chia sẻ trải nghiệm, cảm xúc hoặc những tip hay về địa điểm này..."
            className="w-full min-h-[150px] p-3 rounded-lg border border-gray-200 outline-none focus:ring-2 ring-primary/20 text-sm leading-relaxed"
            disabled={isSubmitting}
          />
          {errors.content && (
            <p className="text-xs text-red-500 font-medium">
              {errors.content.message}
            </p>
          )}
        </div>

        <div className="space-y-2">
          <Label className="font-bold">Gắn thẻ địa điểm</Label>
          <Controller
            name="taggedPlaceIds"
            control={control}
            render={({ field }) => (
              <MultiSelect
                options={placeOptions}
                value={placeOptions.filter((opt) =>
                  field.value?.includes(opt.value)
                )}
                onChange={(val: any[]) =>
                  field.onChange(val.map((v) => v.value))
                }
                labelledBy="Tìm địa điểm..."
                overrideStrings={{
                  selectSomeItems: 'Tìm và gắn thẻ địa điểm...',
                  allItemsAreSelected: 'Tất cả địa điểm',
                  selectAll: 'Chọn tất cả',
                  search: 'Tìm kiếm...',
                }}
                className="post-place-select"
              />
            )}
          />
        </div>

        <div className="space-y-2">
          <Label className="font-bold">Hình ảnh trải nghiệm</Label>
          <div className="grid grid-cols-4 gap-2">
            {imagePreviews.map((url, idx) => (
              <div
                key={idx}
                className="relative aspect-square rounded-lg border overflow-hidden group"
              >
                <img
                  src={url}
                  alt="Preview"
                  className="w-full h-full object-cover"
                />
                <button
                  type="button"
                  onClick={() => removeImage(idx)}
                  className="absolute top-1 right-1 bg-black/50 text-white rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity"
                >
                  <X size={12} />
                </button>
              </div>
            ))}
            <label className="flex flex-col items-center justify-center aspect-square rounded-lg border-2 border-dashed border-gray-200 cursor-pointer hover:border-primary hover:bg-primary/5 transition-all">
              <ImageIcon size={24} className="text-gray-400" />
              <span className="text-[10px] font-bold text-gray-400 mt-1">
                Thêm ảnh
              </span>
              <input
                type="file"
                multiple
                accept="image/*"
                className="hidden"
                onChange={handleImageChange}
                disabled={isSubmitting}
              />
            </label>
          </div>
        </div>

        <div className="flex items-center gap-2 p-3 bg-blue-50 rounded-lg text-blue-700 border border-blue-100 mb-4">
          <Clock size={16} />
          <p className="text-[10px] font-medium italic">
            Bài viết của bạn sẽ được hiển thị sau khi quản trị viên phê duyệt.
          </p>
        </div>

        <div className="flex justify-end gap-3 pt-4 border-t">
          <Button
            type="button"
            variant="outline"
            onClick={onClose}
            disabled={isSubmitting}
          >
            Hủy
          </Button>
          <Button
            type="submit"
            className="bg-hanoi-red hover:bg-hanoi-red/90 px-8"
            disabled={isSubmitting}
          >
            {isSubmitting ? (
              <Loader2 className="animate-spin mr-2" size={16} />
            ) : (
              <Send size={16} className="mr-2" />
            )}
            Đăng bài
          </Button>
        </div>
      </form>

      {/* Global Style for MultiSelect */}
      <style jsx global>{`
        .post-place-select .dropdown-container {
          border-radius: 8px !important;
          border: 1px solid #e5e7eb !important;
          padding: 2px !important;
        }
        .post-place-select .dropdown-content {
          z-index: 9999 !important;
        }
      `}</style>
    </CrudModal>
  )
}
