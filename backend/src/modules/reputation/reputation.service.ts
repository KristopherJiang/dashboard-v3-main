// Reputation 舆情数据服务 — 散点图数据

import { Injectable } from '@nestjs/common';
import { getMultiplier } from '../../common/scaling/scales';

export interface ReputationPoint {
  id: string;
  name: string;
  x: number; // -100~100 情感分数
  y: number; // 0~100 影响力
  z: number; // 声量
  sentiment: 'positive' | 'neutral' | 'negative';
  platform: string;
  insight: string;
  action: string;
}

interface ReputationBase {
  id: string;
  name: string;
  x: number;
  y: number;
  baseVolume: number;
  sentiment: 'positive' | 'neutral' | 'negative';
  platform: string;
  insight: string;
  action: string;
}

const REPUTATION_BASE: ReputationBase[] = [
  {
    id: 'rp1',
    name: 'App Store 评价',
    x: 72,
    y: 85,
    baseVolume: 4200,
    sentiment: 'positive',
    platform: 'App Store',
    insight: '用户对交易体验好评居多',
    action: '继续保持并优化交易流程',
  },
  {
    id: 'rp2',
    name: 'Twitter 品牌提及',
    x: 45,
    y: 70,
    baseVolume: 3500,
    sentiment: 'positive',
    platform: 'Twitter',
    insight: 'KOL 推广带来正面曝光',
    action: '增加 KOL 合作频次',
  },
  {
    id: 'rp3',
    name: 'Reddit 讨论',
    x: -25,
    y: 55,
    baseVolume: 1800,
    sentiment: 'negative',
    platform: 'Reddit',
    insight: '出金延迟被频繁吐槽',
    action: '优化出金流程并主动回复',
  },
  {
    id: 'rp4',
    name: 'Trustpilot 评价',
    x: 60,
    y: 62,
    baseVolume: 2100,
    sentiment: 'positive',
    platform: 'Trustpilot',
    insight: '客服响应获好评',
    action: '展示好评案例到官网',
  },
  {
    id: 'rp5',
    name: 'Twitter 提现投诉',
    x: -55,
    y: 40,
    baseVolume: 900,
    sentiment: 'negative',
    platform: 'Twitter',
    insight: '少数用户集中投诉提现',
    action: '私信跟进并公开回复',
  },
  {
    id: 'rp6',
    name: 'App Store 稳定性',
    x: 30,
    y: 78,
    baseVolume: 2800,
    sentiment: 'neutral',
    platform: 'App Store',
    insight: '闪退问题偶发但影响面大',
    action: '排查高频机型适配问题',
  },
  {
    id: 'rp7',
    name: 'Reddit 新手推荐',
    x: 80,
    y: 35,
    baseVolume: 1200,
    sentiment: 'positive',
    platform: 'Reddit',
    insight: '新手用户推荐 Exness',
    action: '优化新手引导流程',
  },
  {
    id: 'rp8',
    name: 'Trustpilot 费用',
    x: -10,
    y: 48,
    baseVolume: 1500,
    sentiment: 'neutral',
    platform: 'Trustpilot',
    insight: '费用透明度中等评价',
    action: '优化费用说明页面',
  },
  {
    id: 'rp9',
    name: 'Twitter 产品更新',
    x: 55,
    y: 65,
    baseVolume: 2400,
    sentiment: 'positive',
    platform: 'Twitter',
    insight: '产品更新获正面反馈',
    action: '持续发布产品动态',
  },
];

@Injectable()
export class ReputationService {
  getReputationData(
    timeRange: string,
    region: string,
  ): { points: ReputationPoint[] } {
    const multiplier = getMultiplier(timeRange, region);

    const points: ReputationPoint[] = REPUTATION_BASE.map((item) => ({
      id: item.id,
      name: item.name,
      x: item.x,
      y: item.y,
      z: Math.round(item.baseVolume * multiplier),
      sentiment: item.sentiment,
      platform: item.platform,
      insight: item.insight,
      action: item.action,
    }));

    return { points };
  }
}
