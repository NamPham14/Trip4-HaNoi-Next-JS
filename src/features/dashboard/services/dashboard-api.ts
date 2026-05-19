/* eslint-disable @typescript-eslint/no-explicit-any */
import axiosInstance from "@/shared/api/axios-instance";
import { 
  DashboardSummary, 
  PlaceAnalytics, 
  SocialAnalytics, 
  OperationAnalytics, 
  ItineraryAnalytics,
  ReportResponse 
} from "../types";

const DASHBOARD_BASE_URL = "/v1/dashboard";

export const dashboardApi = {
  getSummary: async () => {
    const response = await axiosInstance.get<any>(`${DASHBOARD_BASE_URL}/summary`);
    return response.data.data as DashboardSummary;
  },

  getPlaceAnalytics: async () => {
    const response = await axiosInstance.get<any>(`${DASHBOARD_BASE_URL}/places`);
    return response.data.data as PlaceAnalytics;
  },

  getSocialAnalytics: async () => {
    const response = await axiosInstance.get<any>(`${DASHBOARD_BASE_URL}/social`);
    return response.data.data as SocialAnalytics;
  },

  getOperationAnalytics: async () => {
    const response = await axiosInstance.get<any>(`${DASHBOARD_BASE_URL}/operations`);
    return response.data.data as OperationAnalytics;
  },

  getItineraryAnalytics: async () => {
    const response = await axiosInstance.get<any>(`${DASHBOARD_BASE_URL}/itinerary`);
    return response.data.data as ItineraryAnalytics;
  },

  getPendingReports: async () => {
    const response = await axiosInstance.get<any>("/reports/pending");
    return response.data.data as ReportResponse[];
  }
};
