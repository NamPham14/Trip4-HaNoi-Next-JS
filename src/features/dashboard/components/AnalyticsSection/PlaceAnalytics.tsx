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
import { MapPin, Users } from 'lucide-react';
import { PlaceScoreDTO } from '../../types';

interface PlaceAnalyticsProps {
  topPlaces: PlaceScoreDTO[];
  sentimentData: Record<string, number>;
  loading?: boolean;
}

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884d8', '#82ca9d', '#ffc658', '#8dd1e1', '#a4de6c', '#d0ed57'];

export const PlaceAnalytics: React.FC<PlaceAnalyticsProps> = ({ 
  topPlaces, 
  sentimentData, 
  loading 
}) => {
  const pieData = Object.entries(sentimentData)
    .map(([name, value]) => ({
      name,
      value
    }))
    .sort((a, b) => b.value - a.value); // Sắp xếp để dễ nhìn hơn

  if (loading) {
    return (
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 animate-pulse">
        <div className="bg-white p-6 rounded-xl border shadow-sm h-[450px]"></div>
        <div className="bg-white p-6 rounded-xl border shadow-sm h-[450px]"></div>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
      {/* Top Places Bar Chart */}
      <div className="bg-white p-8 rounded-2xl border-none shadow-[var(--shadow-soft)] h-[500px] flex flex-col transition-all hover:shadow-lg">
        <div className="flex items-center justify-between mb-8">
            <h3 className="text-xl font-black text-gray-900 tracking-tight">Top 10 địa điểm yêu thích</h3>
            <div className="p-2 bg-emerald-50 text-emerald-600 rounded-lg">
                <MapPin size={20} />
            </div>
        </div>
        <div className="flex-1">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={topPlaces} layout="vertical" margin={{ left: 20, right: 20 }}>
              <CartesianGrid strokeDasharray="3 3" horizontal={false} stroke="#f5f5f5" />
              <XAxis type="number" hide />
              <YAxis dataKey="name" type="category" width={100} tick={{ fontSize: 11, fontWeight: '800', fill: '#64748b' }} axisLine={false} tickLine={false} />
              <Tooltip 
                cursor={{ fill: '#f8fafc' }}
                contentStyle={{ borderRadius: '16px', border: 'none', boxShadow: '0 20px 25px -5px rgb(0 0 0 / 0.1)' }}
              />
              <Bar dataKey="score" fill="#10b981" radius={[0, 8, 8, 0]} name="Điểm yêu thích" barSize={24} animationDuration={1500} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Sentiment Pie Chart */}
      <div className="bg-white p-8 rounded-2xl border-none shadow-[var(--shadow-soft)] h-[500px] flex flex-col transition-all hover:shadow-lg">
        <div className="flex items-center justify-between mb-8">
            <h3 className="text-xl font-black text-gray-900 tracking-tight">Tỉ lệ hài lòng theo danh mục</h3>
            <div className="p-2 bg-blue-50 text-blue-600 rounded-lg">
                <Users size={20} />
            </div>
        </div>
        <div className="flex-1 min-h-0">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={pieData}
                innerRadius={80}
                outerRadius={110}
                paddingAngle={4}
                dataKey="value"
                label={false}
                animationBegin={0}
                animationDuration={1500}
              >
                {pieData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} stroke="none" />
                ))}
              </Pie>
              <Tooltip 
                formatter={(value: any) => [`${value}%`, 'Mức độ hài lòng']}
                contentStyle={{ borderRadius: '16px', border: 'none', boxShadow: '0 20px 25px -5px rgb(0 0 0 / 0.1)' }}
              />
              <Legend 
                layout="horizontal" 
                verticalAlign="bottom" 
                align="center"
                iconType="circle"
                wrapperStyle={{ paddingTop: '30px', fontSize: '12px', fontWeight: 'bold', color: '#64748b' }}
              />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
};
