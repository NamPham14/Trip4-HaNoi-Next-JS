import React from 'react';
import { AlertTriangle, Clock, ChevronRight } from 'lucide-react';
import { ReportResponse } from '../../types';
import Link from 'next/link';

interface ActivityFeedProps {
  pendingReports: ReportResponse[];
  loading?: boolean;
}

export const ActivityFeed: React.FC<ActivityFeedProps> = ({ pendingReports, loading }) => {
  if (loading) {
    return (
      <div className="bg-white p-6 rounded-xl border shadow-sm animate-pulse">
        <div className="h-6 bg-gray-200 rounded w-1/4 mb-6"></div>
        <div className="space-y-4">
          {[1, 2, 3].map(i => (
            <div key={i} className="h-16 bg-gray-100 rounded"></div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-xl border shadow-sm overflow-hidden">
      <div className="p-6 border-b flex justify-between items-center">
        <h3 className="text-lg font-bold">Báo cáo vi phạm chờ xử lý</h3>
        <Link 
          href="/admin/reports" 
          className="text-primary text-sm font-medium flex items-center hover:underline"
        >
          Xem tất cả <ChevronRight size={16} />
        </Link>
      </div>
      
      <div className="divide-y">
        {pendingReports.length > 0 ? (
          pendingReports.slice(0, 5).map((report) => (
            <div key={report.id} className="p-6 hover:bg-gray-50 transition-colors flex items-start gap-4">
              <div className="p-2 rounded-full bg-red-100 text-red-600">
                <AlertTriangle size={20} />
              </div>
              <div className="flex-1">
                <div className="flex justify-between items-start">
                  <p className="font-semibold text-sm">
                    {report.reporterName} đã báo cáo một {report.reportType.toLowerCase()}
                  </p>
                  <span className="text-xs text-gray-400 flex items-center gap-1">
                    <Clock size={12} /> {new Date(report.createdAt).toLocaleDateString()}
                  </span>
                </div>
                <p className="text-sm text-gray-600 mt-1 line-clamp-1">
                  Mục tiêu: <span className="font-medium">{report.targetTitle}</span>
                </p>
                <p className="text-sm text-red-500 mt-1 italic">
                  Lý do: {report.reason}
                </p>
              </div>
            </div>
          ))
        ) : (
          <div className="p-12 text-center text-gray-500">
            Không có báo cáo vi phạm nào cần xử lý.
          </div>
        )}
      </div>

      {pendingReports.length > 5 && (
        <div className="p-4 bg-gray-50 text-center">
          <p className="text-xs text-gray-500">Và {pendingReports.length - 5} báo cáo khác...</p>
        </div>
      )}
    </div>
  );
};
