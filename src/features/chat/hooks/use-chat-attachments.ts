import { useState, useRef, useEffect } from 'react'
import { toast } from 'sonner'

export const useChatAttachments = (maxFiles = 5) => {
  const [selectedFiles, setSelectedFiles] = useState<File[]>([])
  const [previewUrls, setPreviewUrls] = useState<string[]>([])
  const fileInputRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    return () => {
      previewUrls.forEach((url) => URL.revokeObjectURL(url))
    }
  }, [previewUrls])

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files) return

    const newFiles = Array.from(e.target.files)

    if (selectedFiles.length + newFiles.length > maxFiles) {
      toast.error(`Bạn chỉ được gửi tối đa ${maxFiles} ảnh cùng lúc.`)
      return
    }

    setSelectedFiles((prev) => [...prev, ...newFiles])

    const newPreviewUrls = newFiles.map((file) => URL.createObjectURL(file))
    setPreviewUrls((prev) => [...prev, ...newPreviewUrls])

    if (fileInputRef.current) {
      fileInputRef.current.value = ''
    }
  }

  const removeFile = (indexToRemove: number) => {
    setSelectedFiles((prev) => prev.filter((_, idx) => idx !== indexToRemove))
    
    setPreviewUrls((prev) => {
      const newUrls = [...prev]
      URL.revokeObjectURL(newUrls[indexToRemove])
      newUrls.splice(indexToRemove, 1)
      return newUrls
    })
  }

  const clearAttachments = () => {
    setSelectedFiles([])
    previewUrls.forEach((url) => URL.revokeObjectURL(url))
    setPreviewUrls([])
  }

  return {
    selectedFiles,
    previewUrls,
    fileInputRef,
    handleFileSelect,
    removeFile,
    clearAttachments
  }
}
