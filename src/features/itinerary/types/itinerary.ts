/* eslint-disable @typescript-eslint/no-explicit-any */
export interface ItineraryPlace {
  id: number;
  placeId: number;
  placeName: string;
  imageUrl?: string;
  latitude: number;
  longitude: number;
  address: string;
  dayNumber: number;
  orderIndex: number;
  session: string;
  estimatedCost: number;
  eventInfo?: any;
}

export interface DayItinerary {
  dayNumber: number;
  places: ItineraryPlace[];
}

export interface Itinerary {
  id: number;
  userId?: number;
  userName?: string;
  title: string;
  budget: number;
  days: number;
  numberOfPeople: number;
  isFeatured: boolean;
  isSample: boolean;
  description?: string;
  coverImage?: string;
  status: 'DRAFT' | 'PUBLISHED' | 'ARCHIVED';
  createdAt: string;
  itineraryDays: DayItinerary[];
}

export interface CreateItineraryRequest {
  title: string;
  budget: number;
  days: number;
  numberOfPeople: number;
  categoryNames?: string[];
  startDate?: string;
  description?: string;
  coverImage?: string;
  isSample?: boolean;
  status?: string;
}

export interface UpdateFullItineraryRequest {
  id: number;
  title: string;
  budget: number;
  days: number;
  numberOfPeople: number;
  itineraryDays: {
    dayNumber: number;
    places: {
      placeId: number;
      dayNumber: number;
      orderIndex: number;
    }[];
  }[];
}
