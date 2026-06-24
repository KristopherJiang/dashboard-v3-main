import React from 'react';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from 'recharts';

const regionData = [
  { name: '北美 (NA)', value: 45, color: 'bg-blue-600' },
  { name: '欧洲 (EU)', value: 25, color: 'bg-blue-400' },
  { name: '亚太 (APAC)', value: 20, color: 'bg-blue-300' },
  { name: '其他', value: 10, color: 'bg-gray-200' },
];

const ageData = [
  { name: '18-24', value: 20, fill: '#cbd5e1' },
  { name: '25-34', value: 45, fill: '#3b82f6' },
  { name: '35-44', value: 25, fill: '#93c5fd' },
  { name: '45+', value: 10, fill: '#f1f5f9' },
];

export default function UserDemographics() {
  return (
    <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 h-full flex flex-col">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-lg font-semibold text-gray-900">用户画像与地域分布</h2>
        <span className="text-xs text-gray-500 bg-gray-100 px-2 py-1 rounded-full">Demographics</span>
      </div>

      <div className="grid grid-cols-2 gap-6 flex-1">
        {/* Regions */}
        <div className="flex flex-col justify-center gap-4">
          <div className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">Top Regions</div>
          {regionData.map((region) => (
            <div key={region.name} className="flex flex-col gap-1">
              <div className="flex justify-between text-xs">
                <span className="font-medium text-gray-700">{region.name}</span>
                <span className="text-gray-500">{region.value}%</span>
              </div>
              <div className="h-1.5 w-full bg-gray-100 rounded-full overflow-hidden">
                <div className={`h-full ${region.color} rounded-full`} style={{ width: `${region.value}%` }}></div>
              </div>
            </div>
          ))}
        </div>

        {/* Age Distribution */}
        <div className="flex flex-col items-center justify-center relative">
          <div className="text-xs font-semibold text-gray-500 uppercase tracking-wider absolute top-0 left-0">Age Dist.</div>
          <div className="w-full h-[120px] mt-6">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={ageData}
                  cx="50%"
                  cy="50%"
                  innerRadius={30}
                  outerRadius={50}
                  paddingAngle={2}
                  dataKey="value"
                  stroke="none"
                >
                  {ageData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.fill} />
                  ))}
                </Pie>
                <Tooltip 
                  content={({ active, payload }) => {
                    if (active && payload && payload.length) {
                      return (
                        <div className="bg-white p-2 shadow rounded border border-gray-100 text-xs">
                          <span className="font-medium">{payload[0].name}: </span>
                          <span>{payload[0].value}%</span>
                        </div>
                      );
                    }
                    return null;
                  }}
                />
              </PieChart>
            </ResponsiveContainer>
          </div>
          <div className="flex flex-wrap justify-center gap-2 mt-2">
            {ageData.map((item) => (
              <div key={item.name} className="flex items-center gap-1 text-[10px] text-gray-500">
                <div className="w-2 h-2 rounded-full" style={{ backgroundColor: item.fill }}></div>
                {item.name}
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
