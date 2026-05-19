import axiosInstance from "@/shared/api/axios-instance";

export interface Report {
  id: number;
  reporterId: number;
  reporterName: string;
  reportType: 'POST' | 'COMMENT' | 'USER' | 'REVIEW';
  targetId: number;
  targetTitle?: string;
  reason: string;
  status: 'PENDING' | 'RESOLVED' | 'DISMISSED';
  createdAt: string;
}

export const reportService = {
  getAllReports: async (): Promise<Report[]> => {
    const response = await axiosInstance.get('/reports');
    return response.data.data;
  },

  getPendingReports: async (): Promise<Report[]> => {
    const response = await axiosInstance.get('/reports/pending');
    return response.data.data;
  },

  updateReportStatus: async (id: number, status: string): Promise<Report> => {
    const response = await axiosInstance.patch(`/reports/${id}/status?status=${status}`);
    return response.data.data;
  }
};
