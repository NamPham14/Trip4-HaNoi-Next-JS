export interface EventImage {
  id: number;
  imageUrl: string;
}

export interface Event {
  id: number;
  name: string;
  description: string;
  startTime: string;
  endTime: string;
  location?: string;
  images: EventImage[];
  status: string;
  placeId: number;
  placeName?: string;
  isFollowed?: boolean;
  followCount?: number;
}

export interface EventResponse {
  content: Event[];
  pageNo: number;
  pageSize: number;
  totalElements: number;
  totalPages: number;
  last: boolean;
}

export interface EventFollowRequest {
  eventId: number;
}
