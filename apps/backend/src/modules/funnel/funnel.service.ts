// Funnel 漏斗数据服务 — 从 user_funnel 表读取 7 步转化漏斗 (Prisma ORM)

import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { getDateRange } from '../../common/utils/date-range';
import { getRegionFilter } from '../../common/utils/region-filter-orm';

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

const STEP_TITLES = [
  '注册',
  'Live 7D',
  'KYC 7D',
  'FTD 7D',
  'FTT 7D',
  'Live 30D',
  'FTD 30D',
];

@Injectable()
export class FunnelService {
  constructor(private readonly prisma: PrismaService) {}

  async getFunnelData(
    timeRange: string,
    region: string,
  ): Promise<{ steps: FunnelStep[] }> {
    const { startDate, endDate } = getDateRange(timeRange);
    const regionFilter = await getRegionFilter(region);

    const result = await this.prisma.userFunnel.aggregate({
      where: {
        registerDate: { gte: new Date(startDate), lte: new Date(endDate) },
        ...regionFilter,
      },
      _sum: {
        regUserId: true,
        regLive7d: true,
        regLiveKyc7d: true,
        regFtd7d: true,
        regFtt7d: true,
        regLive30d: true,
        regFtd30d: true,
      },
    });

    const s = result._sum;
    const rawValues = [
      s?.regUserId ?? 0,
      s?.regLive7d ?? 0,
      s?.regLiveKyc7d ?? 0,
      s?.regFtd7d ?? 0,
      s?.regFtt7d ?? 0,
      s?.regLive30d ?? 0,
      s?.regFtd30d ?? 0,
    ];

    const totalBaseUsers = rawValues[0] || 1;

    const steps: FunnelStep[] = rawValues.map((users, index) => {
      const pctOfTotal = parseFloat(
        ((users / totalBaseUsers) * 100).toFixed(1),
      );
      const stepCVR =
        index === 0
          ? 100
          : parseFloat(
              ((users / (rawValues[index - 1] || 1)) * 100).toFixed(1),
            );
      const cumCVR = pctOfTotal;
      const dropoff = index === 0 ? 0 : rawValues[index - 1] - users;
      const dropoffPct =
        index === 0
          ? 0
          : parseFloat(
              ((1 - users / (rawValues[index - 1] || 1)) * 100).toFixed(1),
            );

      return {
        step: index + 1,
        title: STEP_TITLES[index],
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
}
