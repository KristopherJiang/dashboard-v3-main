// App Market 数据服务 — 评分、趋势、差评原声、竞品对比

import { getMultiplier } from '../data/scales.js';
import { subMonths, format } from 'date-fns';

const BASE_RATING = 4.7;
const BASE_TOTAL_REVIEWS = 28500;
const FIVE_STAR_RATIO = 0.68;
const POSITIVE_RATIO = 0.82;

const NEGATIVE_REVIEWS = [
  { id: 'nr1', text: '提现速度太慢了，等了3天才到账', date: '2026-05-12', rating: 1, tag: '提现' },
  { id: 'nr2', text: 'App 经常闪退，特别是在查看持仓的时候', date: '2026-05-28', rating: 2, tag: '稳定性' },
  { id: 'nr3', text: '客服回复很慢，问题没有及时解决', date: '2026-06-02', rating: 2, tag: '客服' },
  { id: 'nr4', text: '入金手续费太高了，比其他平台贵', date: '2026-06-08', rating: 3, tag: '费用' },
  { id: 'nr5', text: '界面设计不够直观，新用户上手困难', date: '2026-06-15', rating: 3, tag: 'UX' },
];

const COMPETITORS_BASE = [
  { name: 'Exness', rating: 4.7, baseReviews: 28500, baseDownloads: 450000 },
  { name: 'Vantage', rating: 4.5, baseReviews: 18200, baseDownloads: 320000 },
  { name: 'IC Markets', rating: 4.3, baseReviews: 15800, baseDownloads: 280000 },
];

export interface AppMarketOverview {
  rating: number;
  totalReviews: number;
  fiveStarRatio: number;
  positiveRatio: number;
}

export interface TrendPoint {
  month: string;
  reviews: number;
  downloads: number;
  score: number;
  compReviews: number;
  compDownloads: number;
  compScore: number;
}

export interface NegativeReview {
  id: string;
  text: string;
  date: string;
  rating: number;
  tag: string;
}

export interface Competitor {
  name: string;
  rating: number;
  reviews: number;
  downloads: number;
}

export function getAppMarketData(
  timeRange: string,
  region: string,
): {
  overview: AppMarketOverview;
  trends: TrendPoint[];
  negativeReviews: NegativeReview[];
  competitors: Competitor[];
} {
  const multiplier = getMultiplier(timeRange, region);

  const overview: AppMarketOverview = {
    rating: BASE_RATING,
    totalReviews: Math.round(BASE_TOTAL_REVIEWS * multiplier),
    fiveStarRatio: FIVE_STAR_RATIO,
    positiveRatio: POSITIVE_RATIO,
  };

  // 12 个月趋势
  const now = new Date();
  const trends: TrendPoint[] = [];
  for (let i = 11; i >= 0; i--) {
    const monthDate = subMonths(now, i);
    const monthLabel = format(monthDate, 'yyyy-MM');
    const seasonFactor = 1 + 0.1 * Math.sin((i / 4) * Math.PI);

    trends.push({
      month: monthLabel,
      reviews: Math.round(2375 * multiplier * seasonFactor),
      downloads: Math.round(37500 * multiplier * seasonFactor),
      score: parseFloat((4.5 + 0.3 * Math.sin(i * 0.5)).toFixed(1)),
      compReviews: Math.round(1500 * multiplier * seasonFactor),
      compDownloads: Math.round(25000 * multiplier * seasonFactor),
      compScore: parseFloat((4.2 + 0.2 * Math.cos(i * 0.3)).toFixed(1)),
    });
  }

  const competitors: Competitor[] = COMPETITORS_BASE.map((c) => ({
    name: c.name,
    rating: c.rating,
    reviews: Math.round(c.baseReviews * multiplier),
    downloads: Math.round(c.baseDownloads * multiplier),
  }));

  return {
    overview,
    trends,
    negativeReviews: NEGATIVE_REVIEWS,
    competitors,
  };
}
