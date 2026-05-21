/* eslint-disable @typescript-eslint/no-explicit-any */
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { itineraryService } from '../services/itinerary-api';
import { toast } from 'sonner';

export const useItinerary = () => {
  const queryClient = useQueryClient();

  // Query lấy danh sách lịch trình của tôi
  const { data: myItineraries = [], isLoading, refetch } = useQuery({
    queryKey: ['my-itineraries'],
    queryFn: itineraryService.getMyItineraries,
    staleTime: 5 * 60 * 1000, // 5 phút
  });

  // Mutation lưu lịch trình AI
  const saveAIItineraryMutation = useMutation({
    mutationFn: (variables: { title: string, timeline: any[] }) => 
      itineraryService.saveAIItinerary(
        variables.title || `Lịch trình AI - ${new Date().toLocaleDateString('vi-VN')}`,
        variables.timeline
      ),
    onSuccess: () => {
      toast.success('Đã lưu lịch trình thành công!');
      queryClient.invalidateQueries({ queryKey: ['my-itineraries'] });
    },
    onError: (error) => {
      console.error('Failed to save AI itinerary', error);
      toast.error('Lỗi khi lưu lịch trình');
    }
  });

  return {
    isLoading,
    myItineraries,
    fetchMyItineraries: refetch,
    saveAIItinerary: saveAIItineraryMutation.mutateAsync,
    isSaving: saveAIItineraryMutation.isPending
  };
};
