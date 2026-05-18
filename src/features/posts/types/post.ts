import { PostStatus } from "@/features/places/types/post-management";

export interface Post {
  id: number;
  title: string;
  content: string;
  status: PostStatus;
  viewCount: number;
  likeCount: number;
  commentCount: number;
  isLiked?: boolean;
  createdAt: string;
  updatedAt: string;
  username: string;
  userAvatar: string;
  images: PostImage[];
  taggedPlaces?: TaggedPlace[];
}

export interface PostImage {
  id: number;
  imageUrl: string;
}

export interface TaggedPlace {
  id: number;
  name: string;
}

export interface PostCreateRequest {
  title: string;
  content: string;
  taggedPlaceIds?: number[];
}
