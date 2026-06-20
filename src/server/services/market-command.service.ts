// Market Command 数据服务 — 13 国家市场指挥数据

import { getMultiplier } from '../data/scales.js';

interface MarketMetric {
  val: number;
  delta: number;
  growth: number;
}

export interface CountryData {
  id: string;
  name: string;
  coords: { top: number; left: number };
  tier: 1 | 2;
  aso: MarketMetric;
  geo: MarketMetric;
  seo: MarketMetric;
  comps: string[];
}

const COUNTRIES_BASE: CountryData[] = [
  {
    id: 'us',
    name: '美国',
    coords: { top: 30, left: 22 },
    tier: 1,
    aso: { val: 85, delta: 3.2, growth: 12.5 },
    geo: { val: 72, delta: 2.1, growth: 8.3 },
    seo: { val: 90, delta: 1.5, growth: 6.2 },
    comps: ['Exness', 'Vantage', 'IC Markets'],
  },
  {
    id: 'gb',
    name: '英国',
    coords: { top: 25, left: 47 },
    tier: 1,
    aso: { val: 78, delta: 2.8, growth: 10.1 },
    geo: { val: 68, delta: 1.9, growth: 7.5 },
    seo: { val: 82, delta: 2.2, growth: 9.0 },
    comps: ['Exness', 'Pepperstone', 'XM'],
  },
  {
    id: 'de',
    name: '德国',
    coords: { top: 28, left: 51 },
    tier: 1,
    aso: { val: 72, delta: -1.2, growth: 5.8 },
    geo: { val: 65, delta: 1.5, growth: 6.2 },
    seo: { val: 76, delta: 0.8, growth: 4.5 },
    comps: ['Exness', 'IC Markets', 'XM'],
  },
  {
    id: 'ae',
    name: '阿联酋',
    coords: { top: 45, left: 58 },
    tier: 1,
    aso: { val: 68, delta: 4.5, growth: 18.2 },
    geo: { val: 60, delta: 3.2, growth: 14.5 },
    seo: { val: 55, delta: 2.8, growth: 12.0 },
    comps: ['Exness', 'Vantage', 'XM'],
  },
  {
    id: 'vn',
    name: '越南',
    coords: { top: 52, left: 78 },
    tier: 2,
    aso: { val: 62, delta: 5.8, growth: 22.5 },
    geo: { val: 50, delta: 4.1, growth: 18.0 },
    seo: { val: 45, delta: 3.5, growth: 15.5 },
    comps: ['Exness', 'IC Markets', 'XM'],
  },
  {
    id: 'in',
    name: '印度',
    coords: { top: 48, left: 66 },
    tier: 2,
    aso: { val: 58, delta: 6.2, growth: 25.0 },
    geo: { val: 48, delta: 5.0, growth: 20.5 },
    seo: { val: 42, delta: 4.2, growth: 18.0 },
    comps: ['Exness', 'Vantage', 'IC Markets'],
  },
  {
    id: 'au',
    name: '澳大利亚',
    coords: { top: 72, left: 82 },
    tier: 1,
    aso: { val: 80, delta: 1.0, growth: 5.5 },
    geo: { val: 70, delta: 0.8, growth: 4.2 },
    seo: { val: 85, delta: 1.2, growth: 5.8 },
    comps: ['IC Markets', 'Pepperstone', 'Exness'],
  },
  {
    id: 'ng',
    name: '尼日利亚',
    coords: { top: 55, left: 48 },
    tier: 2,
    aso: { val: 35, delta: 8.5, growth: 32.0 },
    geo: { val: 28, delta: 6.0, growth: 25.0 },
    seo: { val: 25, delta: 5.2, growth: 22.0 },
    comps: ['Exness', 'XM', 'OctaFX'],
  },
  {
    id: 'br',
    name: '巴西',
    coords: { top: 65, left: 32 },
    tier: 2,
    aso: { val: 52, delta: 3.8, growth: 15.0 },
    geo: { val: 45, delta: 2.5, growth: 12.0 },
    seo: { val: 48, delta: 3.0, growth: 10.5 },
    comps: ['Exness', 'XM', 'Vantage'],
  },
  {
    id: 'jp',
    name: '日本',
    coords: { top: 38, left: 85 },
    tier: 1,
    aso: { val: 75, delta: 0.5, growth: 3.0 },
    geo: { val: 70, delta: 0.8, growth: 3.5 },
    seo: { val: 78, delta: 0.6, growth: 2.8 },
    comps: ['Exness', 'XM', 'IG'],
  },
  {
    id: 'za',
    name: '南非',
    coords: { top: 72, left: 52 },
    tier: 2,
    aso: { val: 42, delta: 4.5, growth: 18.5 },
    geo: { val: 38, delta: 3.2, growth: 14.0 },
    seo: { val: 35, delta: 2.8, growth: 12.0 },
    comps: ['Exness', 'XM', 'Vantage'],
  },
  {
    id: 'sg',
    name: '新加坡',
    coords: { top: 55, left: 76 },
    tier: 1,
    aso: { val: 82, delta: 2.0, growth: 8.5 },
    geo: { val: 75, delta: 1.5, growth: 6.5 },
    seo: { val: 80, delta: 1.8, growth: 7.0 },
    comps: ['Exness', 'IC Markets', 'IG'],
  },
  {
    id: 'ph',
    name: '菲律宾',
    coords: { top: 52, left: 80 },
    tier: 2,
    aso: { val: 55, delta: 5.0, growth: 20.0 },
    geo: { val: 48, delta: 3.8, growth: 16.5 },
    seo: { val: 42, delta: 3.2, growth: 14.0 },
    comps: ['Exness', 'XM', 'Vantage'],
  },
];

export function getMarketCommandData(
  timeRange: string,
  region: string,
): { countries: CountryData[] } {
  const multiplier = getMultiplier(timeRange, region);

  const countries: CountryData[] = COUNTRIES_BASE.map((c) => ({
    ...c,
    aso: {
      val: Math.round(c.aso.val * Math.min(multiplier, 2)),
      delta: c.aso.delta,
      growth: c.aso.growth,
    },
    geo: {
      val: Math.round(c.geo.val * Math.min(multiplier, 2)),
      delta: c.geo.delta,
      growth: c.geo.growth,
    },
    seo: {
      val: Math.round(c.seo.val * Math.min(multiplier, 2)),
      delta: c.seo.delta,
      growth: c.seo.growth,
    },
  }));

  return { countries };
}
