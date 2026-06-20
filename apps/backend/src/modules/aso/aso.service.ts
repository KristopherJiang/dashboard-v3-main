// ASO 数据服务 — App Store Optimization

import { Injectable } from '@nestjs/common';
import { getMultiplier } from '../../common/scaling/scales';

export interface ASOKPI {
  cvr: number;
  organicRatio: number;
  totalKeywords: number;
  top3Keywords: number;
}

export interface RankDistribution {
  month: string;
  top1_3: number;
  top4_10: number;
  top10_50: number;
  tail: number;
}

export interface SemanticKeyword {
  name: string;
  rank: number;
  downloads: number;
}

const ASO_BASE = {
  cvr: 12.8,
  organicRatio: 0.73,
  totalKeywords: 856,
  top3Keywords: 42,
};

const SEMANTIC_KEYWORDS_BASE: Array<{
  name: string;
  rank: number;
  baseDownloads: number;
}> = [
  { name: 'forex trading', rank: 1, baseDownloads: 45000 },
  { name: 'trading app', rank: 2, baseDownloads: 38000 },
  { name: 'stock trading', rank: 3, baseDownloads: 32000 },
  { name: 'online broker', rank: 4, baseDownloads: 28000 },
  { name: 'CFD trading', rank: 5, baseDownloads: 22000 },
  { name: 'investing app', rank: 6, baseDownloads: 18000 },
  { name: 'crypto trading', rank: 7, baseDownloads: 15000 },
  { name: 'MT4 MT5', rank: 8, baseDownloads: 12000 },
  { name: 'copy trading', rank: 9, baseDownloads: 10000 },
  { name: 'leverage trading', rank: 10, baseDownloads: 8500 },
  { name: 'forex signals', rank: 11, baseDownloads: 7200 },
  { name: 'demo trading', rank: 12, baseDownloads: 6500 },
  { name: 'social trading', rank: 13, baseDownloads: 5800 },
  { name: 'gold trading', rank: 14, baseDownloads: 5200 },
  { name: 'forex broker', rank: 15, baseDownloads: 4800 },
];

@Injectable()
export class AsoService {
  getASOData(
    timeRange: string,
    region: string,
  ): {
    kpi: ASOKPI;
    rankDistribution: RankDistribution[];
    semanticKeywords: SemanticKeyword[];
  } {
    const multiplier = getMultiplier(timeRange, region);

    const kpi: ASOKPI = {
      cvr: ASO_BASE.cvr,
      organicRatio: ASO_BASE.organicRatio,
      totalKeywords: Math.round(ASO_BASE.totalKeywords * multiplier),
      top3Keywords: Math.round(ASO_BASE.top3Keywords * multiplier),
    };

    // 12 个月排名分布
    const now = new Date();
    const rankDistribution: RankDistribution[] = [];
    for (let i = 11; i >= 0; i--) {
      const monthDate = new Date(now);
      monthDate.setMonth(monthDate.getMonth() - i);
      const monthLabel = `${monthDate.getFullYear()}-${String(monthDate.getMonth() + 1).padStart(2, '0')}`;
      const factor = 1 + 0.08 * Math.sin((i / 3) * Math.PI);

      rankDistribution.push({
        month: monthLabel,
        top1_3: Math.round(42 * multiplier * factor),
        top4_10: Math.round(85 * multiplier * factor),
        top10_50: Math.round(210 * multiplier * factor),
        tail: Math.round(519 * multiplier * factor),
      });
    }

    const semanticKeywords: SemanticKeyword[] = SEMANTIC_KEYWORDS_BASE.map(
      (kw) => ({
        name: kw.name,
        rank: kw.rank,
        downloads: Math.round(kw.baseDownloads * multiplier),
      }),
    );

    return { kpi, rankDistribution, semanticKeywords };
  }
}
