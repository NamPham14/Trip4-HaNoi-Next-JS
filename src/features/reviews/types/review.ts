export interface Review {
  id: number;
  userId: number;
  userName: string;
  placeId: number;
  placeName: string;
  rating: number;
  comment: string;
  imageUrl: string | null;
  createdAt: string;
}

export interface ReviewFilterParams {
  keyword?: string;
  rating?: number;
  page?: number;
  size?: number;
}
