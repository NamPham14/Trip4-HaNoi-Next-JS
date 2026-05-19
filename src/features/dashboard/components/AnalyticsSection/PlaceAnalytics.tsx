import React from 'react';
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  Legend
} from 'recharts';
import { PlaceScoreDTO } from '../../types';

interface PlaceAnalyticsProps {
  topPlaces: PlaceScoreDTO[];
  sentimentData: Record<string, number>;
  loading?: boolean;
}

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884d8'];

export const PlaceAnalytics: React.FC<PlaceAnalyticsProps> = ({ 
  topPlaces, 
  sentimentData, 
  loading 
}) => {
  const pieData = Object.entries(sentimentData).map(([name, value]) => ({
    name,
    value
  }));

  if (loading) {
    return (
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 animate-pulse">
        <div className="bg-white p-6 rounded-xl border shadow-sm h-[400px]"></div>
        <div className="bg-white p-6 rounded-xl border shadow-sm h-[400px]"></div>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
      {/* Top Places Bar Chart */}
      <div className="bg-white p-6 rounded-xl border shadow-sm h-[400px] flex flex-col">
        <h3 className="text-lg font-bold mb-6">Top 10 địa điểm yêu thích</h3>
        <div className="flex-1">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={topPlaces} layout="vertical">
              <CartesianGrid strokeDasharray="3 3" horizontal={false} />
              <XAxis type="number" />
              <YAxis dataKey="name" type="category" width={150} tick={{ fontSize: 12 }} />
              <Tooltip />
              <Bar dataKey="score" fill="#10b981" radius={[0, 4, 4, 0]} name="Điểm yêu thích" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Sentiment Pie Chart */}
      <div className="bg-white p-6 rounded-xl border shadow-sm h-[400px] flex flex-col">
        <h3 className="text-lg font-bold mb-6">Tỉ lệ hài lòng theo danh mục</h3>
        <div className="flex-1">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={pieData}
                innerRadius={60}
                outerRadius={100}
                paddingAngle={5}
                dataKey="value"
                label={({ name, percent }) => `${name} ${percent ? (percent * 100).toFixed(0) : 0}%`}
              >
                {pieData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip />
              <Legend />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
};
