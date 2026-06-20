// Market Intelligence 数据服务 — SEO / GEO / ASO / Brand Ranking

import { getMultiplier } from '../data/scales.js';

interface SEOData {
  authorityScore: number;
  organicTraffic: number;
  organicKeywords: number;
  paidTraffic: number;
  paidKeywords: number;
}

interface GEOData {
  visibility: number;
  mentions: number;
  citedPages: number;
  aiSources: string[];
}

interface ASOSummary {
  cvr: number;
  organicRatio: number;
  totalKeywords: number;
  top3Keywords: number;
}

interface BrandRank {
  rank: number;
  name: string;
  change: number;
  score: number;
}

export interface MarketIntelligenceData {
  seo: SEOData;
  geo: GEOData;
  aso: ASOSummary;
  brandRanking: BrandRank[];
}

const SEO_BASE = {
  authorityScore: 72,
  organicTraffic: 285000,
  organicKeywords: 12400,
  paidTraffic: 68000,
  paidKeywords: 3200,
};

const GEO_BASE = {
  visibility: 68,
  mentions: 4200,
  citedPages: 156,
  aiSources: [
    'Google SGE',
    'Perplexity',
    'Bing Chat',
    'ChatGPT Search',
  ],
};

const ASO_BASE = {
  cvr: 12.8,
  organicRatio: 0.73,
  totalKeywords: 856,
  top3Keywords: 42,
};

const BRAND_RANKING_BASE: BrandRank[] = [
  { rank: 1, name: 'Exness', change: 0, score: 92 },
  { rank: 2, name: 'Vantage', change: 1, score: 85 },
  { rank: 3, name: 'IC Markets', change: -1, score: 82 },
  { rank: 4, name: 'Pepperstone', change: 0, score: 78 },
  { rank: 5, name: 'XM', change: -2, score: 74 },
];

export function getMarketIntelligenceData(
  timeRange: string,
  region: string,
): MarketIntelligenceData {
  const multiplier = getMultiplier(timeRange, region);

  const seo: SEOData = {
    authorityScore: SEO_BASE.authorityScore,
    organicTraffic: Math.round(SEO_BASE.organicTraffic * multiplier),
    organicKeywords: Math.round(SEO_BASE.organicKeywords * multiplier),
    paidTraffic: Math.round(SEO_BASE.paidTraffic * multiplier),
    paidKeywords: Math.round(SEO_BASE.paidKeywords * multiplier),
  };

  const geo: GEOData = {
    visibility: GEO_BASE.visibility,
    mentions: Math.round(GEO_BASE.mentions * multiplier),
    citedPages: Math.round(GEO_BASE.citedPages * multiplier),
    aiSources: [...GEO_BASE.aiSources],
  };

  const aso: ASOSummary = {
    cvr: ASO_BASE.cvr,
    organicRatio: ASO_BASE.organicRatio,
    totalKeywords: Math.round(ASO_BASE.totalKeywords * multiplier),
    top3Keywords: Math.round(ASO_BASE.top3Keywords * multiplier),
  };

  const brandRanking: BrandRank[] = BRAND_RANKING_BASE.map((b) => ({
    ...b,
    score: Math.round(b.score * Math.min(multiplier, 1.5)),
  }));

  return { seo, geo, aso, brandRanking };
}
