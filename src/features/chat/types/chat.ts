export interface ScheduleItem {
  time: string;
  activity: string;
  placeId?: number;
  note?: string;
  estimatedCost?: number;
}

export interface ChatAIResponse {
  introduction: string;
  timeline: ScheduleItem[];
  summary: string;
  suggestedPlaceIds: number[];
}

export type ChatMessageType = 'USER' | 'STAFF' | 'SYSTEM';
export type ChatRoomStatus = 'PENDING' | 'ACTIVE' | 'CLOSED';

export interface ChatMessageResponse {
  id: number;
  content: string;
  type: ChatMessageType;
  senderId: number | null;
  senderName: string | null;
  senderAvatar: string | null;
  timestamp: string;
  mediaUrls?:string [];
}

export interface ChatRoomResponse {
  id: number;
  userId: number;
  userName: string;
  userAvatar: string | null;
  staffId: number | null;
  staffName: string | null;
  staffAvatar: string | null;
  status: ChatRoomStatus;
  createdAt: string;
  updatedAt: string;
  unreadCount?: number;
  lastMessage?: ChatMessageResponse;
}

export interface Message {
  id: string;
  role: 'user' | 'ai' | 'staff' | 'system';
  content: string | ChatAIResponse;
  mediaUrls?:string [];
  timestamp: number;
  senderName?: string;
  senderAvatar?: string;
}

export type ChatMode = 'AI' | 'LIVE';
