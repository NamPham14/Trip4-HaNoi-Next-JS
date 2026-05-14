import { useState } from 'react';
import { itineraryService } from '../services/itinerary-api';
import { Itinerary, CreateItineraryRequest, UpdateFullItineraryRequest } from '../types/itinerary';
import { toast } from 'sonner';

export const useItinerary = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [myItineraries, setMyItineraries] = useState<Itinerary[]>([]);

  const fetchMyItineraries = async () => {
    setIsLoading(true);
    try {
      const data = await itineraryService.getMyItineraries();
      setMyItineraries(data);
    } catch (error) {
      console.error('Failed to fetch itineraries', error);
      toast.error('Không thể tải danh sách lịch trình');
    } finally {
      setIsLoading(false);
    }
  };

  const saveAIItinerary = async (title: string, timeline: any[]) => {
    setIsLoading(true);
    try {
      const saved = await itineraryService.saveAIItinerary(
        title || `Lịch trình AI - ${new Date().toLocaleDateString('vi-VN')}`,
        timeline
      );
      toast.success('Đã lưu lịch trình thành công!');
      return saved;
    } catch (error) {
      console.error('Failed to save AI itinerary', error);
      toast.error('Lỗi khi lưu lịch trình');
      return null;
    } finally {
      setIsLoading(false);
    }
  };

  return {
    isLoading,
    myItineraries,
    fetchMyItineraries,
    saveAIItinerary
  };
};
