export interface PlaceImage {
  id: number;
  imageUrl: string;
}

export interface Review {
  id: number;
  userId: number;
  userName: string;
  placeId: number;
  placeName: string;
  rating: number;
  comment: string;
  imageUrl?: string;
  createdAt: string;
}

export interface Event {
  id: number;
  name: string;
  description: string;
  placeId: number;
  placeName: string;
  startTime: string;
  endTime: string;
  status: 'UPCOMING' | 'ONGOING' | 'ENDED';
  images: PlaceImage[];
}

export interface Place {
  id: number;
  name: string;
  description: string;
  categoryId: number;
  categoryName: string;
  address: string;
  district: string;
  latitude: number;
  longitude: number;
  priceAvg: number;
  ratingAvg: number;
  viewCount: number;
  favoriteCount: number;
  images: PlaceImage[];
  distance: number;
  isRecommended: boolean;
  hasActiveEvent: boolean;
}

export interface PlaceDetailResponse extends Omit<Place, 'distance'> {
  reviews: Review[];
  events: Event[];
  distance?: number;
}

export interface PlaceFilterParams {
// ...

  categoryId?: number;
  district?: string;
  userLat?: number;
  userLng?: number;
  radius?: number;
  page?: number;
  size?: number;
  sort?: string;
}
