// Users 画像数据服务 — 地区分布 + 年龄分布

import { getMultiplier } from '../data/scales.js';

const REGION_BASE_PCT = {
  NA: 45,
  EU: 25,
  APAC: 20,
  MENA: 10,
} as const;

const AGE_BASE_PCT = {
  '18-24': 15,
  '25-34': 35,
  '35-44': 28,
  '45-54': 15,
  '55+': 7,
} as const;

const BASE_TOTAL = 11250;

export interface DemographicItem {
  label: string;
  count: number;
  pct: number;
}

export function getUsersDemographicsData(
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

  const ageDistribution: DemographicItem[] = Object.entries(
    AGE_BASE_PCT,
  ).map(([label, pct]) => ({
    label,
    count: Math.round(total * (pct / 100)),
    pct,
  }));

  return { total, regionDistribution, ageDistribution };
}
