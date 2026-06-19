import React from 'react';
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from 'recharts';

const data = [
  { name: 'W1', spend: 4000, revenue: 2400, roi: 1.6 },
  { name: 'W2', spend: 3000, revenue: 1398, roi: 1.4 },
  { name: 'W3', spend: 2000, revenue: 9800, roi: 4.9 },
  { name: 'W4', spend: 2780, revenue: 3908, roi: 1.4 },
  { name: 'W5', spend: 1890, revenue: 4800, roi: 2.5 },
  { name: 'W6', spend: 2390, revenue: 3800, roi: 1.6 },
  { name: 'W7', spend: 3490, revenue: 4300, roi: 1.2 },
];

const getWeekDateRange = (weekName: string) => {
  const weekNum = parseInt(weekName.replace('W', ''), 10);
  if (isNaN(weekNum)) return '';

  const today = new Date();
  const dayOffset_W7_end = today.getDay() === 0 ? 7 : today.getDay();
  const endDate = new Date(today);
  endDate.setDate(today.getDate() - dayOffset_W7_end - (7 - weekNum) * 7);

  const startDate = new Date(endDate);
  startDate.setDate(endDate.getDate() - 6);

  const formatDate = (d: Date) => `${d.getMonth() + 1}月${d.getDate()}日`;
  return `${formatDate(startDate)} - ${formatDate(endDate)}`;
};

const CustomTooltip = ({ active, payload, label }: any) => {
  if (active && payload && payload.length) {
    const dataObj = payload[0].payload;
    const weekRange = getWeekDateRange(label);
    return (
      <div className="bg-gray-900 border border-gray-800 text-white p-3 rounded-xl shadow-xl text-[11px] min-w-[170px]">
        <div className="text-gray-400 font-bold mb-0.5">{label}</div>
        <div className="text-[10px] text-gray-500 mb-2 border-b border-gray-800 pb-1.5">
          {weekRange}
        </div>
        <div className="flex justify-between mb-1 gap-4">
          <span className="text-gray-300">Revenue (收入):</span>
          <span className="font-bold text-emerald-400">${dataObj.revenue.toLocaleString()}</span>
        </div>
        <div className="flex justify-between mb-1 gap-4">
          <span className="text-gray-300">Spend (支出):</span>
          <span className="font-bold text-rose-400">${dataObj.spend.toLocaleString()}</span>
        </div>
        <div className="flex justify-between border-t border-gray-800 pt-1.5 mt-1.5 gap-4">
          <span className="text-gray-300 font-medium">ROI:</span>
          <span className="font-bold text-blue-400">{dataObj.roi}x</span>
        </div>
      </div>
    );
  }
  return null;
};

export default function MarketingROI() {
  return (
    <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 h-full flex flex-col">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h2 className="text-lg font-semibold text-gray-900">营销 ROI 趋势</h2>
          <p className="text-xs text-gray-500 uppercase tracking-wider">Marketing ROI Trend</p>
        </div>
        <div className="flex gap-4">
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-full bg-blue-500"></div>
            <span className="text-xs text-gray-600">Revenue</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-full bg-rose-400"></div>
            <span className="text-xs text-gray-600">Spend</span>
          </div>
        </div>
      </div>

      <div className="flex-1 min-h-[250px] w-full">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={data} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
            <defs>
              <linearGradient id="colorRevenue" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.3} />
                <stop offset="95%" stopColor="#3b82f6" stopOpacity={0} />
              </linearGradient>
              <linearGradient id="colorSpend" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#fb7185" stopOpacity={0.3} />
                <stop offset="95%" stopColor="#fb7185" stopOpacity={0} />
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
            <XAxis
              dataKey="name"
              axisLine={false}
              tickLine={false}
              tick={{ fontSize: 12, fill: '#64748b' }}
              dy={10}
            />
            <YAxis
              axisLine={false}
              tickLine={false}
              tick={{ fontSize: 12, fill: '#64748b' }}
              tickFormatter={(value) => `$${value / 1000}k`}
            />
            <Tooltip content={<CustomTooltip />} />
            <Area
              type="monotone"
              dataKey="revenue"
              stroke="#3b82f6"
              strokeWidth={2}
              fillOpacity={1}
              fill="url(#colorRevenue)"
            />
            <Area
              type="monotone"
              dataKey="spend"
              stroke="#fb7185"
              strokeWidth={2}
              fillOpacity={1}
              fill="url(#colorSpend)"
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
