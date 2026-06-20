import React from 'react';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from 'recharts';
import { useApi } from '../lib/hooks/useApi';
import { fetchUserDemographics, type DemographicItem } from '../lib/api';
import { SkeletonLoader, ApiError } from './shared/ApiStates';

// 颜色映射：前 4 个地区依次分配 CSS class
const REGION_COLORS = ['bg-blue-600', 'bg-blue-400', 'bg-blue-300', 'bg-gray-200'];

interface RegionWithColor extends DemographicItem {
  color: string;
}

const FALLBACK_REGIONS: DemographicItem[] = [
  { label: '北美 (NA)', count: 0, pct: 45 },
  { label: '欧洲 (EU)', count: 0, pct: 25 },
  { label: '亚太 (APAC)', count: 0, pct: 20 },
  { label: '其他', count: 0, pct: 10 },
];

const FALLBACK_AGES: DemographicItem[] = [
  { label: '18-24', count: 0, pct: 20 },
  { label: '25-34', count: 0, pct: 45 },
  { label: '35-44', count: 0, pct: 25 },
  { label: '45+', count: 0, pct: 10 },
];

const AGE_FILLS = ['#cbd5e1', '#3b82f6', '#93c5fd', '#f1f5f9'];

function mapRegions(items: DemographicItem[]): RegionWithColor[] {
  return items.map((r, i) => ({
    ...r,
    color: REGION_COLORS[i] ?? 'bg-gray-200',
  }));
}

function mapAgeGroups(items: DemographicItem[]) {
  return items.map((a, i) => ({
    name: a.label,
    value: a.pct,
    fill: AGE_FILLS[i] ?? '#f1f5f9',
  }));
}

export default function UserDemographics() {
  const { data, loading, error } = useApi(fetchUserDemographics);

  if (loading) return <SkeletonLoader />;
  if (error) return <ApiError message={error} />;

  const regionData = mapRegions(data?.regionDistribution ?? FALLBACK_REGIONS);
  const ageData = mapAgeGroups(data?.ageDistribution ?? FALLBACK_AGES);

  return (
    <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 h-full flex flex-col">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-lg font-semibold text-gray-900">用户画像与地域分布</h2>
        <span className="text-xs text-gray-500 bg-gray-100 px-2 py-1 rounded-full">
          Demographics
        </span>
      </div>

      <div className="grid grid-cols-2 gap-6 flex-1">
        {/* Regions */}
        <div className="flex flex-col justify-center gap-4">
          <div className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">
            Top Regions
          </div>
          {regionData.map((region) => (
            <div key={region.label} className="flex flex-col gap-1">
              <div className="flex justify-between text-xs">
                <span className="font-medium text-gray-700">{region.label}</span>
                <span className="text-gray-500">{region.pct}%</span>
              </div>
              <div className="h-1.5 w-full bg-gray-100 rounded-full overflow-hidden">
                <div
                  className={`h-full ${region.color} rounded-full`}
                  style={{ width: `${region.pct}%` }}
                ></div>
              </div>
            </div>
          ))}
        </div>

        {/* Age Distribution */}
        <div className="flex flex-col items-center justify-center relative">
          <div className="text-xs font-semibold text-gray-500 uppercase tracking-wider absolute top-0 left-0">
            Age Dist.
          </div>
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
