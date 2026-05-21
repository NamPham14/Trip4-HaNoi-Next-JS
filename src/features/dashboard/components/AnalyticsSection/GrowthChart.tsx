import React from 'react';
import { 
  LineChart, 
  Line, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  Legend
} from 'recharts';

interface GrowthChartProps {
  data: Record<string, number>;
  title: string;
  loading?: boolean;
  color?: string;
  isCurrency?: boolean;
}

export const GrowthChart: React.FC<GrowthChartProps> = ({ 
  data, 
  title, 
  loading, 
  color = "#3b82f6", 
  isCurrency = false 
}) => {
  // Convert Record<string, number> to Array<{ name: string, value: number }>
  const chartData = Object.entries(data).map(([key, value]) => ({
    name: key,
    value: value
  })).sort((a, b) => a.name.localeCompare(b.name));

  const formatValue = (val: number) => {
    if (isCurrency) {
      return new Intl.NumberFormat('vi-VN', { 
        style: 'currency', 
        currency: 'VND', 
        maximumFractionDigits: 0 
      }).format(val);
    }
    return val;
  };

  if (loading) {
    return (
      <div className="bg-white p-6 rounded-xl border shadow-sm h-[400px] flex flex-col animate-pulse">
        <div className="h-6 bg-gray-200 rounded w-1/3 mb-6"></div>
        <div className="flex-1 bg-gray-100 rounded"></div>
      </div>
    );
  }

  return (
    <div className="bg-white p-6 rounded-xl border shadow-sm h-[400px] flex flex-col">
      <h3 className="text-lg font-bold mb-6">{title}</h3>
      <div className="flex-1">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={chartData}>
            <CartesianGrid strokeDasharray="3 3" vertical={false} />
            <XAxis dataKey="name" />
            <YAxis tickFormatter={(value) => isCurrency ? `${value/1000}k` : value} />
            <Tooltip formatter={(value: number) => [formatValue(value), isCurrency ? "Doanh thu" : "Số lượng"]} />
            <Legend />
            <Line 
              type="monotone" 
              dataKey="value" 
              stroke={color} 
              strokeWidth={3} 
              name={isCurrency ? "Doanh thu" : "Số lượng"}
              activeDot={{ r: 8 }} 
            />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};
