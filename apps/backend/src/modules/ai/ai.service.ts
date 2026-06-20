// AI 告警数据服务 — 智能分析告警

import { Injectable } from '@nestjs/common';
import { getMultiplier } from '../../common/scaling/scales';

export type AlertType = 'critical' | 'warning' | 'optimize';

export interface AIAlert {
  id: string;
  type: AlertType;
  title: string;
  value: string;
  region: string;
  timestamp: string;
  description: string;
  action: string;
}

const ALERTS_BASE: Omit<AIAlert, 'timestamp'>[] = [
  {
    id: 'alert-001',
    type: 'critical',
    title: 'FTD 转化率骤降',
    value: '-18.5%',
    region: 'ASIA_IN',
    description:
      '印度市场 FTD 转化率近 3 天下降 18.5%，疑似 KYC 审核流程变更导致用户流失',
    action: '检查 KYC 流程并联系印度市场负责人',
  },
  {
    id: 'alert-002',
    type: 'critical',
    title: '出金延迟告警',
    value: '3.2x',
    region: 'GLOBAL',
    description: '全球平均出金时间较上周增长 3.2 倍，用户投诉率上升 45%',
    action: '立即排查支付通道状态并通知运营团队',
  },
  {
    id: 'alert-003',
    type: 'warning',
    title: 'ASA CPA 超标',
    value: '$28.5',
    region: 'EU_UK',
    description: '英国 Apple Search Ads CPA 升至 $28.5，超出目标值 24%',
    action: '调整出价策略并暂停低效关键词',
  },
  {
    id: 'alert-004',
    type: 'warning',
    title: 'App 评分下滑',
    value: '4.5→4.2',
    region: 'MENA_AE',
    description: '阿联酋 App Store 评分从 4.5 降至 4.2，差评主要集中在闪退问题',
    action: '优先修复高频闪退 Bug 并回复差评',
  },
  {
    id: 'alert-005',
    type: 'optimize',
    title: 'KOL ROI 异常高',
    value: '340%',
    region: 'ASIA_VN',
    description: '越南 KOL 渠道 ROI 达 340%，建议增加预算分配',
    action: '增加 KOL 合作预算 30% 并复制策略到其他市场',
  },
  {
    id: 'alert-006',
    type: 'optimize',
    title: '自然流量爆发',
    value: '+125%',
    region: 'GLOBAL',
    description: '品牌词自然搜索流量较上月增长 125%，SEO 策略效果显著',
    action: '持续优化内容策略，扩大 SEO 投入',
  },
  {
    id: 'alert-007',
    type: 'warning',
    title: 'D30 留存下降',
    value: '-5.2%',
    region: 'GS_AU',
    description: '澳洲市场 D30 留存率下降 5.2%，新手引导完成率偏低',
    action: '优化新手引导流程并增加 Day 3/7 触发推送',
  },
];

@Injectable()
export class AiService {
  getAIAlertsData(timeRange: string, region: string): { alerts: AIAlert[] } {
    const multiplier = getMultiplier(timeRange, region);
    const now = new Date();

    // 基于 multiplier 调整告警数量（更多的数据 = 更多的告警）
    const alertCount = Math.min(
      ALERTS_BASE.length,
      Math.max(3, Math.round(ALERTS_BASE.length * Math.min(multiplier, 1))),
    );

    const alerts: AIAlert[] = ALERTS_BASE.slice(0, alertCount).map(
      (alert, index) => ({
        ...alert,
        timestamp: new Date(
          now.getTime() - index * 3600000 * (2 + Math.random() * 4),
        ).toISOString(),
      }),
    );

    return { alerts };
  }
}
