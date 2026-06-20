// Channels 渠道数据服务 — 树形结构 IB / Retail 渠道

import { getMultiplier } from '../data/scales.js';
import { COST_SCALE } from '../data/scales.js';

interface ChannelMetrics {
  newUsers: number;
  spend: number;
  signupCAC: number;
  kycCAC: number;
  ftdCAC: number;
  fttCAC: number;
  roi: number;
  ltv: number;
}

export interface ChannelNode {
  id: string;
  name: string;
  metrics: ChannelMetrics;
  children?: ChannelNode[];
}

const CHANNEL_BASES: Array<{
  id: string;
  name: string;
  baseUsers: number;
  baseSpend: number;
  baseCAC: number;
  baseLTV: number;
  children?: Array<{
    id: string;
    name: string;
    baseUsers: number;
    baseSpend: number;
    baseCAC: number;
    baseLTV: number;
    children?: Array<{
      id: string;
      name: string;
      baseUsers: number;
      baseSpend: number;
      baseCAC: number;
      baseLTV: number;
    }>;
  }>;
}> = [
  {
    id: 'ib',
    name: 'IB',
    baseUsers: 6263,
    baseSpend: 32600,
    baseCAC: 5.2,
    baseLTV: 850,
    children: [],
  },
  {
    id: 'retail',
    name: 'Retail',
    baseUsers: 12157,
    baseSpend: 176200,
    baseCAC: 14.5,
    baseLTV: 620,
    children: [
      {
        id: 'kol',
        name: 'KOL',
        baseUsers: 2188,
        baseSpend: 18600,
        baseCAC: 8.5,
        baseLTV: 720,
      },
      {
        id: 'paid',
        name: 'Paid Ads',
        baseUsers: 2674,
        baseSpend: 48700,
        baseCAC: 18.2,
        baseLTV: 580,
        children: [
          {
            id: 'dsp',
            name: 'DSP',
            baseUsers: 535,
            baseSpend: 8030,
            baseCAC: 15.0,
            baseLTV: 540,
          },
          {
            id: 'asa',
            name: 'ASA',
            baseUsers: 1123,
            baseSpend: 24700,
            baseCAC: 22.0,
            baseLTV: 610,
          },
          {
            id: 'google',
            name: 'Google Ads',
            baseUsers: 1016,
            baseSpend: 12700,
            baseCAC: 12.5,
            baseLTV: 570,
          },
        ],
      },
      {
        id: 'organic',
        name: 'Organic',
        baseUsers: 1800,
        baseSpend: 7560,
        baseCAC: 4.2,
        baseLTV: 690,
      },
      {
        id: 'raf',
        name: 'RAF',
        baseUsers: 1125,
        baseSpend: 6190,
        baseCAC: 5.5,
        baseLTV: 770,
      },
    ],
  },
];

function buildMetrics(
  baseUsers: number,
  baseSpend: number,
  baseCAC: number,
  baseLTV: number,
  multiplier: number,
  costMultiplier: number,
): ChannelMetrics {
  const newUsers = Math.round(baseUsers * multiplier);
  const spend = Math.round(baseSpend * multiplier * costMultiplier);
  const signupCAC = parseFloat(
    ((baseCAC * costMultiplier) / Math.max(multiplier, 0.5)).toFixed(1),
  );
  const kycCAC = parseFloat((signupCAC * 1.35).toFixed(1));
  const ftdCAC = parseFloat((signupCAC * 2.1).toFixed(1));
  const fttCAC = parseFloat((signupCAC * 3.4).toFixed(1));
  const roi = parseFloat(
    (((baseLTV * multiplier) / (baseCAC * costMultiplier) - 1) * 100).toFixed(1),
  );
  const ltv = Math.round(baseLTV * multiplier);

  return { newUsers, spend, signupCAC, kycCAC, ftdCAC, fttCAC, roi, ltv };
}

export function getChannelsData(
  timeRange: string,
  region: string,
): { channels: ChannelNode[] } {
  const multiplier = getMultiplier(timeRange, region);
  const costMultiplier = COST_SCALE[region] || 1.0;

  const channels: ChannelNode[] = CHANNEL_BASES.map((ch) => {
    const node: ChannelNode = {
      id: ch.id,
      name: ch.name,
      metrics: buildMetrics(
        ch.baseUsers,
        ch.baseSpend,
        ch.baseCAC,
        ch.baseLTV,
        multiplier,
        costMultiplier,
      ),
    };

    if (ch.children && ch.children.length > 0) {
      node.children = ch.children.map((child) => {
        const childNode: ChannelNode = {
          id: child.id,
          name: child.name,
          metrics: buildMetrics(
            child.baseUsers,
            child.baseSpend,
            child.baseCAC,
            child.baseLTV,
            multiplier,
            costMultiplier,
          ),
        };

        if (child.children && child.children.length > 0) {
          childNode.children = child.children.map((sub) => ({
            id: sub.id,
            name: sub.name,
            metrics: buildMetrics(
              sub.baseUsers,
              sub.baseSpend,
              sub.baseCAC,
              sub.baseLTV,
              multiplier,
              costMultiplier,
            ),
          }));
        }

        return childNode;
      });
    }

    return node;
  });

  return { channels };
}
