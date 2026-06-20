// Marketing ROI 数据服务 — 7 周投资回报率

import { Injectable } from '@nestjs/common';
import { getMultiplier } from '../../common/scaling/scales';

const WEEKLY_BASE = [
  { week: 'W1', baseSpend: 50000, baseRevenue: 180000 },
  { week: 'W2', baseSpend: 55000, baseRevenue: 198000 },
  { week: 'W3', baseSpend: 48000, baseRevenue: 172800 },
  { week: 'W4', baseSpend: 62000, baseRevenue: 229400 },
  { week: 'W5', baseSpend: 58000, baseRevenue: 220400 },
  { week: 'W6', baseSpend: 53000, baseRevenue: 201400 },
  { week: 'W7', baseSpend: 67000, baseRevenue: 261300 },
];

export interface WeeklyROI {
  week: string;
  spend: number;
  revenue: number;
  roi: number;
}

@Injectable()
export class MarketingService {
  getMarketingRoiData(
    timeRange: string,
    region: string,
  ): {
    weeks: WeeklyROI[];
    totalSpend: number;
    totalRevenue: number;
    avgRoi: number;
  } {
    const multiplier = getMultiplier(timeRange, region);

    const weeks: WeeklyROI[] = WEEKLY_BASE.map((w) => {
      const spend = Math.round(w.baseSpend * multiplier);
      const revenue = Math.round(w.baseRevenue * multiplier);
      const roi = parseFloat(((revenue / spend - 1) * 100).toFixed(1));
      return { week: w.week, spend, revenue, roi };
    });

    const totalSpend = weeks.reduce((s, w) => s + w.spend, 0);
    const totalRevenue = weeks.reduce((s, w) => s + w.revenue, 0);
    const avgRoi = parseFloat(
      ((totalRevenue / totalSpend - 1) * 100).toFixed(1),
    );

    return { weeks, totalSpend, totalRevenue, avgRoi };
  }
}
