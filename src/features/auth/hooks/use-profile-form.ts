/* eslint-disable @typescript-eslint/no-explicit-any */
import { useState, useRef, useEffect } from "react";
import { useUpdateProfile } from "./use-auth";
import { toast } from "sonner";

export const useProfileForm = (user: any) => {
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    username: user?.username || "",
    nationality: user?.nationality || "Vietnam",
    language: user?.language || "vi",
  });
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  
  const updateProfileMutation = useUpdateProfile();

  const lastSyncedUserRef = useRef<any>(null);

  // Reset form when user info changes or editing is toggled
  useEffect(() => {
    // Chỉ đồng bộ khi có user, không trong chế độ edit, và user thực sự thay đổi (so sánh qua ref)
    if (user && !isEditing && user !== lastSyncedUserRef.current) {
      lastSyncedUserRef.current = user;
      setFormData({
        username: user.username || "",
        nationality: user.nationality || "Vietnam",
        language: user.language || "vi",
      });
    }
  }, [user, isEditing]);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setSelectedFile(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreviewUrl(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const startEditing = () => setIsEditing(true);
  
  const cancelEditing = () => {
    setIsEditing(false);
    setPreviewUrl(null);
    setSelectedFile(null);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;

    try {
      const updateData = {
        id: Number(user.id),
        email: user.email,
        username: user.username,
        nationality: formData.nationality,
        language: formData.language
      };
      
      await updateProfileMutation.mutateAsync({
        data: updateData,
        file: selectedFile || undefined
      });
      
      setIsEditing(false);
      setSelectedFile(null);
      setPreviewUrl(null);
      toast.success("Cập nhật hồ sơ thành công!");
    } catch (error: any) {
      console.error("Profile update error:", error);
      const msg = error.response?.data?.message || "Không thể cập nhật hồ sơ. Thử lại sau.";
      toast.error(msg);
    }
  };

  return {
    isEditing,
    formData,
    setFormData,
    previewUrl,
    fileInputRef,
    isPending: updateProfileMutation.isPending,
    handleFileChange,
    handleSubmit,
    startEditing,
    cancelEditing
  };
};
