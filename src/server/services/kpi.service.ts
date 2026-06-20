// KPI 核心指标数据服务 — 8 张 KPI 卡片 + 12 个月趋势

import { getMultiplier } from '../data/scales.js';
import { subMonths, format } from 'date-fns';

const KPI_BASE_VALUES = {
  registrationUsers: 18420,
  ftdUsers: 8640,
  fttUsers: 5120,
  netDeposit: 4250000,
  tradingVolume: 128000000,
  signupToFtdCVR: 46.9,
  ftdToFttCVR: 59.3,
  d30Retention: 21.5,
} as const;

const KPI_TREND_DATA = {
  registrationUsers: { trendPoP: 8.2, trendYoY: 15.4 },
  ftdUsers: { trendPoP: 5.1, trendYoY: 12.8 },
  fttUsers: { trendPoP: -2.3, trendYoY: 7.6 },
  netDeposit: { trendPoP: 12.5, trendYoY: 22.1 },
  tradingVolume: { trendPoP: 6.8, trendYoY: 18.9 },
  signupToFtdCVR: { trendPoP: 1.2, trendYoY: 3.5 },
  ftdToFttCVR: { trendPoP: -0.8, trendYoY: 2.1 },
  d30Retention: { trendPoP: 0.6, trendYoY: 1.8 },
} as const;

export interface KPIChartPoint {
  month: string;
  current: number;
  previous: number;
}

export interface KPICard {
  key: string;
  value: number;
  trendPoP: number;
  trendYoY: number;
  chartData: KPIChartPoint[];
}

function generateChartData(
  baseValue: number,
  multiplier: number,
): KPIChartPoint[] {
  const now = new Date();
  const data: KPIChartPoint[] = [];

  for (let i = 11; i >= 0; i--) {
    const monthDate = subMonths(now, i);
    const monthLabel = format(monthDate, 'yyyy-MM');

    // 模拟月度波动：±15% 范围内随机
    const seasonalFactor = 1 + 0.15 * Math.sin((i / 3) * Math.PI);
    const noise = 0.95 + Math.random() * 0.1;
    const current = Math.round(baseValue * multiplier * seasonalFactor * noise);
    const prevNoise = 0.9 + Math.random() * 0.1;
    const previous = Math.round(
      baseValue * multiplier * 0.85 * seasonalFactor * prevNoise,
    );

    data.push({ month: monthLabel, current, previous });
  }

  return data;
}

export function getKPIData(
  timeRange: string,
  region: string,
): { cards: KPICard[] } {
  const multiplier = getMultiplier(timeRange, region);

  const isPercentage = (
    key: string,
  ): key is 'signupToFtdCVR' | 'ftdToFttCVR' | 'd30Retention' =>
    ['signupToFtdCVR', 'ftdToFttCVR', 'd30Retention'].includes(key);

  const cards: KPICard[] = Object.entries(KPI_BASE_VALUES).map(
    ([key, baseValue]) => {
      const scaled = isPercentage(key)
        ? parseFloat((baseValue + (multiplier - 1) * 0.5).toFixed(1))
        : Math.round(baseValue * multiplier);

      const trend = KPI_TREND_DATA[key as keyof typeof KPI_TREND_DATA];

      return {
        key,
        value: scaled,
        trendPoP: trend.trendPoP,
        trendYoY: trend.trendYoY,
        chartData: generateChartData(
          isPercentage(key) ? baseValue * 100 : baseValue,
          isPercentage(key) ? 1 : multiplier,
        ),
      };
    },
  );

  return { cards };
}
