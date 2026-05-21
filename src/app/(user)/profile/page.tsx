/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import React from "react";
import { Navbar } from "@/shared/components/navbar";
import { useUser } from "@/features/auth/hooks/use-auth";
import { useProfileForm } from "@/features/auth/hooks/use-profile-form";
import { useMyReviews, useSavedPlaces } from "@/features/places/hooks/use-places";
import { useItinerary } from "@/features/itinerary/hooks/use-itinerary";
import { Button } from "@/shared/components/ui/button";
import { Tabs, TabsContent, TabsTrigger, TabsList } from "@/shared/components/ui/tabs";
import { 
  User as UserIcon, 
  Shield, 
  Calendar, 
  Check, 
  Loader2, 
  Bookmark
} from "lucide-react";
import Link from "next/link";
import { ProfileHeader } from "@/features/auth/components/profile/ProfileHeader";
import { ProfileStats } from "@/features/auth/components/profile/ProfileStats";
import { ProfileInfoTab } from "@/features/auth/components/profile/ProfileInfoTab";
import { SecurityTab } from "@/features/auth/components/profile/SecurityTab";

export default function ProfilePage() {
  const { user, isAuthenticated } = useUser();
  const { data: savedPlaces } = useSavedPlaces();
  const { data: myReviews } = useMyReviews(isAuthenticated);
  const { myItineraries } = useItinerary();
  
  const {
    isEditing,
    formData,
    setFormData,
    previewUrl,
    fileInputRef,
    isPending,
    handleFileChange,
    handleSubmit,
    startEditing,
    cancelEditing
  } = useProfileForm(user);

  if (!isAuthenticated) return <NotAuthenticatedView />;

  return (
    <div className="min-h-screen bg-[#FDFCFB] flex flex-col pb-20 md:pb-0">
      <Navbar />

      <main className="flex-1 container mx-auto px-0 md:px-4 py-0 md:py-8 max-w-5xl">
        <div className="bg-white md:rounded-[40px] shadow-sm md:shadow-xl md:shadow-zinc-200/50 md:border border-zinc-100 overflow-hidden mb-0 md:mb-10 transition-all">
          <ProfileHeader 
            user={user}
            isEditing={isEditing}
            previewUrl={previewUrl}
            isPending={isPending}
            onStartEditing={startEditing}
            onCancelEditing={cancelEditing}
            onSave={handleSubmit}
            onFileClick={() => fileInputRef.current?.click()}
            onFileChange={handleFileChange}
            fileInputRef={fileInputRef}
          />
          <ProfileStats 
            itinerariesCount={myItineraries.length}
            savedPlacesCount={savedPlaces?.length || 0}
            reviewsCount={myReviews?.length || 0}
          />
        </div>

        <div className="px-4 md:px-0">
          <Tabs defaultValue="info" className="w-full">
            <div className="flex justify-center w-full">
              <TabsList className="bg-white p-1.5 rounded-[24px] border border-zinc-100 mb-6 md:mb-10 h-14 md:h-18 flex items-center justify-center w-full md:w-max shadow-sm">
                <TabsTrigger value="info" className="flex-1 md:flex-none rounded-2xl px-4 md:px-10 h-full font-black text-[10px] md:text-base data-[state=active]:bg-zinc-900 data-[state=active]:text-white transition-all flex items-center justify-center gap-2 md:gap-2.5">
                  <UserIcon className="h-3.5 w-3.5 md:h-5 md:w-5" /> <span>Thông tin</span>
                </TabsTrigger>
                <TabsTrigger value="security" className="flex-1 md:flex-none rounded-2xl px-4 md:px-10 h-full font-black text-[10px] md:text-base data-[state=active]:bg-zinc-900 data-[state=active]:text-white transition-all flex items-center justify-center gap-2 md:gap-2.5">
                  <Shield className="h-3.5 w-3.5 md:h-5 md:w-5" /> Bảo mật
                </TabsTrigger>
                <TabsTrigger value="activity" className="flex-1 md:flex-none rounded-2xl px-4 md:px-10 h-full font-black text-[10px] md:text-base data-[state=active]:bg-zinc-900 data-[state=active]:text-white transition-all flex items-center justify-center gap-2 md:gap-2.5">
                  <Calendar className="h-3.5 w-3.5 md:h-5 md:w-5" /> Hoạt động
                </TabsTrigger>
              </TabsList>
            </div>

            <TabsContent value="info">
              <ProfileInfoTab 
                user={user}
                isEditing={isEditing}
                formData={formData}
                setFormData={setFormData}
              />
            </TabsContent>
            
            <TabsContent value="security">
              <SecurityTab user={user} />
            </TabsContent>
            
            <TabsContent value="activity">
              <ActivityPlaceholder />
            </TabsContent>
          </Tabs>
        </div>
      </main>

      {isEditing && (
        <MobileActionBar 
          isPending={isPending}
          onCancel={cancelEditing}
          onSave={handleSubmit}
        />
      )}
    </div>
  );
}

const NotAuthenticatedView = () => (
  <div className="min-h-screen bg-hanoi-cream flex flex-col items-center justify-center p-4">
    <div className="bg-white p-8 rounded-[40px] shadow-2xl shadow-zinc-200 text-center max-w-sm w-full">
      <div className="bg-hanoi-red/10 w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-6">
        <UserIcon className="h-10 w-10 text-hanoi-red" />
      </div>
      <h2 className="text-2xl font-black text-zinc-900 mb-2">Bạn cần đăng nhập</h2>
      <p className="text-zinc-500 mb-8 font-medium">Vui lòng đăng nhập để xem thông tin cá nhân và quản lý lịch trình.</p>
      <Link href="/login" className="block w-full">
        <Button className="w-full bg-hanoi-red hover:bg-hanoi-red/90 text-white font-black h-14 rounded-2xl shadow-xl shadow-hanoi-red/20">
          Đăng nhập ngay
        </Button>
      </Link>
    </div>
  </div>
);

const ActivityPlaceholder = () => (
  <div className="text-center py-32 md:py-48 bg-white rounded-[32px] md:rounded-[48px] border border-dashed border-zinc-200">
    <div className="w-24 h-24 bg-zinc-50 rounded-full flex items-center justify-center mx-auto mb-8">
      <Calendar className="h-12 w-12 text-zinc-200" />
    </div>
    <h3 className="text-xl font-black text-zinc-900 mb-2">Chưa có hoạt động</h3>
    <p className="text-zinc-400 font-medium max-w-xs mx-auto">Mọi hoạt động của bạn sẽ được lưu giữ tại đây.</p>
  </div>
);

const MobileActionBar = ({ isPending, onCancel, onSave }: any) => (
  <div className="md:hidden fixed bottom-0 left-0 right-0 bg-white/80 backdrop-blur-xl border-t border-zinc-100 p-4 z-50">
    <div className="flex items-center gap-3">
      <Button variant="ghost" onClick={onCancel} className="flex-1 font-black text-zinc-500 h-14">Hủy</Button>
      <Button onClick={onSave} disabled={isPending} className="flex-[2] bg-hanoi-red text-white font-black h-14">
        {isPending ? <Loader2 className="h-5 w-5 animate-spin mr-2" /> : <Check className="h-5 w-5 mr-2" />}
        Lưu hồ sơ
      </Button>
    </div>
  </div>
);
