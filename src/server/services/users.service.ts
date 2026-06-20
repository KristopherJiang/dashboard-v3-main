// Users 分布数据服务 — 旭日图（retail / ib 层级）

import { getMultiplier } from '../data/scales.js';

interface DistributionNode {
  name: string;
  value: number;
  pct: number;
  children?: DistributionNode[];
}

export function getUsersDistributionData(
  timeRange: string,
  region: string,
): {
  totalNewUsers: number;
  distribution: DistributionNode[];
} {
  const multiplier = getMultiplier(timeRange, region);
  const total = Math.round(11250 * multiplier);

  const retailChildren: DistributionNode[] = [
    {
      name: 'KOL',
      value: Math.round(total * 0.66 * 0.18),
      pct: 18,
    },
    {
      name: 'Paid Ads',
      value: Math.round(total * 0.66 * 0.22),
      pct: 22,
      children: [
        {
          name: 'DSP',
          value: Math.round(total * 0.66 * 0.22 * 0.2),
          pct: 20,
        },
        {
          name: 'ASA',
          value: Math.round(total * 0.66 * 0.22 * 0.42),
          pct: 42,
        },
        {
          name: 'Google Ads',
          value: Math.round(total * 0.66 * 0.22 * 0.38),
          pct: 38,
        },
      ],
    },
    {
      name: 'Organic',
      value: Math.round(total * 0.66 * 0.16),
      pct: 16,
    },
    {
      name: 'RAF',
      value: Math.round(total * 0.66 * 0.1),
      pct: 10,
    },
  ];

  const distribution: DistributionNode[] = [
    {
      name: 'Retail',
      value: Math.round(total * 0.66),
      pct: 66,
      children: retailChildren,
    },
    {
      name: 'IB',
      value: Math.round(total * 0.34),
      pct: 34,
    },
  ];

  return { totalNewUsers: total, distribution };
}
