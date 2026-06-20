// Funnel 漏斗数据服务 — 7 步转化漏斗

import { getMultiplier } from '../data/scales.js';

const FUNNEL_BASE_STEPS = [
  { step: 1, title: '注册', baseUsers: 18420 },
  { step: 2, title: 'KYC', baseUsers: 13815 },
  { step: 3, title: 'FTD', baseUsers: 8640 },
  { step: 4, title: 'FTT', baseUsers: 5120 },
  { step: 5, title: '二次入金', baseUsers: 3840 },
  { step: 6, title: '活跃交易', baseUsers: 2688 },
  { step: 7, title: 'VIP', baseUsers: 940 },
];

export interface FunnelStep {
  step: number;
  title: string;
  users: number;
  pctOfTotal: number;
  stepCVR: number;
  cumCVR: number;
  dropoff: number;
  dropoffPct: number;
}

export function getFunnelData(
  timeRange: string,
  region: string,
): { steps: FunnelStep[] } {
  const multiplier = getMultiplier(timeRange, region);
  const totalBaseUsers = FUNNEL_BASE_STEPS[0].baseUsers;

  const steps: FunnelStep[] = FUNNEL_BASE_STEPS.map((base, index) => {
    const users = Math.round(base.baseUsers * multiplier);
    const pctOfTotal = parseFloat(
      ((base.baseUsers / totalBaseUsers) * 100).toFixed(1),
    );
    const stepCVR =
      index === 0
        ? 100
        : parseFloat(
            (
              (base.baseUsers /
                FUNNEL_BASE_STEPS[index - 1].baseUsers) *
              100
            ).toFixed(1),
          );
    const cumCVR = parseFloat(
      ((base.baseUsers / totalBaseUsers) * 100).toFixed(1),
    );
    const dropoff =
      index === 0
        ? 0
        : Math.round(
            (FUNNEL_BASE_STEPS[index - 1].baseUsers - base.baseUsers) *
              multiplier,
          );
    const dropoffPct =
      index === 0
        ? 0
        : parseFloat(
            (
              (1 -
                base.baseUsers /
                  FUNNEL_BASE_STEPS[index - 1].baseUsers) *
              100
            ).toFixed(1),
          );

    return {
      step: base.step,
      title: base.title,
      users,
      pctOfTotal,
      stepCVR,
      cumCVR,
      dropoff,
      dropoffPct,
    };
  });

  return { steps };
}
