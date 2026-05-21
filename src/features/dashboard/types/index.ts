export interface LocationCoordinateDTO {
  lat: number;
  lng: number;
}

export interface PlaceScoreDTO {
  placeId: number;
  name: string;
  score: number;
  viewCount?: number;
  ratingAvg?: number;
}

export interface PostEngagementDTO {
  postId: number;
  title: string;
  author: string;
  viralRate: number;
}

export interface EventHotnessDTO {
  eventId: number;
  name: string;
  hotnessScore: number;
  status: string;
}

export interface DashboardSummary {
  totalUsers: number;
  totalPlaces: number;
  totalPosts: number;
  totalItineraries: number;
  totalRevenue: number;
  proUserCount: number;
  usersByRole: Record<string, number>;
  conversionRate: number;
  heatmap: LocationCoordinateDTO[];
}

export interface PlaceAnalytics {
  top10Places: PlaceScoreDTO[];
  abandonedPlaces: PlaceScoreDTO[];
  sentimentByCategory: Record<string, number>;
}

export interface SocialAnalytics {
  topViralPosts: PostEngagementDTO[];
  postGrowthByMonth: Record<string, number>;
  hotEvents: EventHotnessDTO[];
}

export interface OperationAnalytics {
  chatVolumeByHour: Record<number, number>;
  revenueGrowth: Record<string, number>;
  aiTopKeywords: string[];
}

export interface ItineraryAnalytics {
  avgTripDuration: number;
  avgCompletionRate: number;
}

export interface ReportResponse {
  id: number;
  reporterId: number;
  reporterName: string;
  reportType: string;
  targetId: number;
  targetTitle: string;
  reason: string;
  status: string;
  createdAt: string;
}

export interface DashboardData {
  summary: DashboardSummary;
  places: PlaceAnalytics;
  social: SocialAnalytics;
  operations: OperationAnalytics;
  itinerary: ItineraryAnalytics;
}
