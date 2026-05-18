export type PostStatus = 'PENDING' | 'APPROVED' | 'REJECTED';

export interface PostManagement {
  id: number;
  title: string;
  content: string;
  status: PostStatus;
  viewCount: number;
  createdAt: string;
  updatedAt: string;
  username: string;
  userAvatar: string;
  images: { id: number; imageUrl: string }[];
  taggedPlaces?: { id: number; name: string }[];
}
