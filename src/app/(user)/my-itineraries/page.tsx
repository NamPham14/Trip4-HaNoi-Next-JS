"use client";

import React, { useEffect } from "react";
import { Navbar } from "@/shared/components/navbar";
import { useItinerary } from "@/features/itinerary/hooks/use-itinerary";
import { Calendar, Users, Wallet, Clock, ArrowRight, Trash2, MapPin } from "lucide-react";
import { Button } from "@/shared/components/ui/button";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/shared/components/ui/card";
import { Badge } from "@/shared/components/ui/badge";
import Link from "next/link";
import { Skeleton } from "@/shared/components/ui/skeleton";
import { itineraryService } from "@/features/itinerary/services/itinerary-api";
import { toast } from "sonner";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/shared/components/ui/alert-dialog";

export default function MyItinerariesPage() {
  const { myItineraries, fetchMyItineraries, isLoading } = useItinerary();

  useEffect(() => {
    fetchMyItineraries();
  }, []);

  const handleDelete = async (id: number) => {
    try {
      await itineraryService.deleteItinerary(id);
      toast.success("Đã xóa lịch trình");
      fetchMyItineraries();
    } catch (error) {
      toast.error("Lỗi khi xóa lịch trình");
    }
  };

  return (
    <div className="min-h-screen bg-hanoi-cream/30">
      <Navbar />

      <main className="container mx-auto py-10 px-4">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-10">
          <div>
            <h1 className="text-3xl font-bold text-zinc-900 mb-2">Lịch trình của tôi</h1>
            <p className="text-zinc-500 font-medium">Quản lý và xem lại các chuyến đi bạn đã lên kế hoạch</p>
          </div>
          <Link href="/planner">
            <Button className="bg-hanoi-red hover:bg-[#6D1616] font-bold rounded-full">
              Lên lịch trình mới
            </Button>
          </Link>
        </div>

        {isLoading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[1, 2, 3].map((i) => (
              <Skeleton key={i} className="h-[250px] w-full rounded-2xl" />
            ))}
          </div>
        ) : myItineraries.length === 0 ? (
          <div className="bg-white rounded-3xl p-20 text-center border border-dashed border-zinc-200">
            <div className="bg-hanoi-gold/20 w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-6">
              <Calendar className="h-10 w-10 text-hanoi-red" />
            </div>
            <h2 className="text-xl font-bold text-zinc-900 mb-2">Chưa có lịch trình nào</h2>
            <p className="text-zinc-500 mb-8 max-w-md mx-auto">Bạn chưa lưu bất kỳ lịch trình nào. Hãy thử trò chuyện với Local Buddy AI để tạo một chuyến đi thú vị nhé!</p>
            <Link href="/">
              <Button variant="outline" className="font-bold border-hanoi-red text-hanoi-red hover:bg-hanoi-red/5 px-8 rounded-full">
                Khám phá ngay
              </Button>
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {myItineraries.map((itinerary) => (
              <Card key={itinerary.id} className="overflow-hidden border-zinc-100 shadow-sm hover:shadow-xl transition-all duration-300 rounded-2xl group">
                <CardHeader className="bg-zinc-900 text-white p-5 md:p-6 relative min-h-[110px] md:min-h-[120px] flex flex-col justify-between">
                  <div className="flex justify-between items-start mb-2">
                    <Badge className="bg-hanoi-gold text-hanoi-red border-none font-bold text-[9px] md:text-[10px]">
                      {itinerary.days} NGÀY
                    </Badge>
                    <AlertDialog>
                      <AlertDialogTrigger asChild>
                        <button className="text-white/50 hover:text-hanoi-gold transition-colors p-1 -mr-1">
                          <Trash2 className="h-4 w-4" />
                        </button>
                      </AlertDialogTrigger>
                      <AlertDialogContent>
                        <AlertDialogHeader>
                          <AlertDialogTitle>Xóa lịch trình này?</AlertDialogTitle>
                          <AlertDialogDescription>
                            Hành động này không thể hoàn tác. Lịch trình &quot;{itinerary.title}&quot; sẽ bị xóa vĩnh viễn khỏi tài khoản của bạn.
                          </AlertDialogDescription>
                        </AlertDialogHeader>
                        <AlertDialogFooter>
                          <AlertDialogCancel className="rounded-xl font-bold">Hủy</AlertDialogCancel>
                          <AlertDialogAction 
                            onClick={() => handleDelete(itinerary.id)}
                            className="bg-hanoi-red hover:bg-[#6D1616] rounded-xl font-bold"
                          >
                            Xác nhận xóa
                          </AlertDialogAction>
                        </AlertDialogFooter>
                      </AlertDialogContent>
                    </AlertDialog>
                  </div>
                  <CardTitle className="text-lg md:text-xl font-bold group-hover:text-hanoi-gold transition-colors leading-tight line-clamp-2">
                    {itinerary.title}
                  </CardTitle>
                </CardHeader>
                <CardContent className="p-6 space-y-4 bg-white">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="flex items-center gap-2 text-zinc-500">
                      <Users className="h-4 w-4 text-hanoi-red" />
                      <span className="text-xs font-bold">{itinerary.numberOfPeople} người</span>
                    </div>
                    <div className="flex items-center gap-2 text-zinc-500">
                      <Wallet className="h-4 w-4 text-hanoi-red" />
                      <span className="text-xs font-bold">{itinerary.budget.toLocaleString()}đ</span>
                    </div>
                  </div>
                  
                  <div className="pt-4 border-t border-zinc-50">
                    <p className="text-[10px] font-bold text-zinc-400 uppercase tracking-widest mb-3">Điểm đến nổi bật</p>
                    <div className="flex flex-wrap gap-2">
                      {itinerary.itineraryDays?.[0]?.places?.slice(0, 3).map((p, idx) => (
                        <Badge key={idx} variant="secondary" className="bg-zinc-50 text-zinc-600 border-zinc-100 font-medium text-[10px]">
                          {p.placeName}
                        </Badge>
                      ))}
                      {(itinerary.itineraryDays?.[0]?.places?.length || 0) > 3 && (
                        <span className="text-[10px] text-zinc-400 font-bold">+{ (itinerary.itineraryDays?.[0]?.places?.length || 0) - 3}</span>
                      )}
                    </div>
                  </div>
                </CardContent>
                <CardFooter className="px-6 pb-6 pt-0 bg-white">
                  <Link href={`/itinerary-detail/${itinerary.id}`} className="w-full">
                    <Button className="w-full bg-hanoi-cream text-hanoi-red hover:bg-hanoi-red hover:text-white border border-hanoi-red/20 font-bold rounded-xl flex items-center justify-between px-4 transition-all group/btn">
                      Xem chi tiết 
                      <ArrowRight className="h-4 w-4 group-hover/btn:translate-x-1 transition-transform" />
                    </Button>
                  </Link>
                </CardFooter>
              </Card>
            ))}
          </div>
        )}
      </main>
    </div>
  );
}
