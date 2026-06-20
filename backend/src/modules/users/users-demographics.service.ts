// Users 画像数据服务 — 地区分布 + 年龄分布

import { Injectable } from '@nestjs/common';
import { getMultiplier } from '../../common/scaling/scales';

const REGION_BASE_PCT: Record<string, number> = {
  NA: 45,
  EU: 25,
  APAC: 20,
  MENA: 10,
};

const AGE_BASE_PCT: Record<string, number> = {
  '18-24': 15,
  '25-34': 35,
  '35-44': 28,
  '45-54': 15,
  '55+': 7,
};

const BASE_TOTAL = 11250;

export interface DemographicItem {
  label: string;
  count: number;
  pct: number;
}

@Injectable()
export class UsersDemographicsService {
  getDemographicsData(
    timeRange: string,
    region: string,
  ): {
    total: number;
    regionDistribution: DemographicItem[];
    ageDistribution: DemographicItem[];
  } {
    const multiplier = getMultiplier(timeRange, region);
    const total = Math.round(BASE_TOTAL * multiplier);

    const regionDistribution: DemographicItem[] = Object.entries(
      REGION_BASE_PCT,
    ).map(([label, pct]) => ({
      label,
      count: Math.round(total * (pct / 100)),
      pct,
    }));

    const ageDistribution: DemographicItem[] = Object.entries(AGE_BASE_PCT).map(
      ([label, pct]) => ({
        label,
        count: Math.round(total * (pct / 100)),
        pct,
      }),
    );

    return { total, regionDistribution, ageDistribution };
  }
}
