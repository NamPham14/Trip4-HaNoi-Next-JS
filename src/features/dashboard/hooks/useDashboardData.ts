/* eslint-disable @typescript-eslint/no-explicit-any */
import { useState, useEffect } from 'react';
import { dashboardApi } from '../services/dashboard-api';
import { DashboardData, ReportResponse } from '../types';

export const useDashboardData = () => {
  const [data, setData] = useState<DashboardData | null>(null);
  const [pendingReports, setPendingReports] = useState<ReportResponse[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchAllData = async () => {
      try {
        setLoading(true);
        const [
          summary, 
          places, 
          social, 
          operations, 
          itinerary,
          reports
        ] = await Promise.all([
          dashboardApi.getSummary(),
          dashboardApi.getPlaceAnalytics(),
          dashboardApi.getSocialAnalytics(),
          dashboardApi.getOperationAnalytics(),
          dashboardApi.getItineraryAnalytics(),
          dashboardApi.getPendingReports().catch(() => []) // Fallback if report API fails
        ]);

        setData({
          summary,
          places,
          social,
          operations,
          itinerary
        });
        setPendingReports(reports);
      } catch (err: any) {
        console.error("Dashboard Fetch Error:", err);
        setError(err.message || "Failed to fetch dashboard data");
      } finally {
        setLoading(false);
      }
    };

    fetchAllData();
  }, []);

  return { data, pendingReports, loading, error };
};
