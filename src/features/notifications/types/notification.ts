export interface Notification {
  id: number;
  message: string;
  targetUrl?: string;
  status: 'READ' | 'UNREAD';
  createdAt: string;
  eventId?: number;
}

export interface NotificationResponse {
  status: number;
  code: number;
  message: string;
  data: Notification[];
}
