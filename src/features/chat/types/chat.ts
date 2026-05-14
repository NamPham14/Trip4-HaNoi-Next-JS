export interface ScheduleItem {
  time: string;
  activity: string;
  placeId?: number;
  note?: string;
  estimatedCost?: number;
}

export interface ChatResponse {
  introduction: string;
  timeline: ScheduleItem[];
  summary: string;
  suggestedPlaceIds: number[];
}

export interface Message {
  id: string;
  role: 'user' | 'ai';
  content: string | ChatResponse;
  timestamp: number;
}
