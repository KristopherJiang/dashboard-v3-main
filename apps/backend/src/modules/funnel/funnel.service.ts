// Funnel 漏斗数据服务 — 从 user_funnel 表读取 7 步转化漏斗

import { Injectable } from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { PrismaService } from '../../prisma/prisma.service';
import { getDateRange } from '../../common/utils/date-range';
import { regionWhereClause } from '../../common/utils/region-filter';

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

interface FunnelAggRow {
  registration: bigint;
  live_7d: bigint;
  kyc_7d: bigint;
  ftd_7d: bigint;
  ftt_7d: bigint;
  live_30d: bigint;
  ftd_30d: bigint;
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
    const regionSql = regionWhereClause(region);

    const sql = Prisma.sql`
      SELECT
        COALESCE(SUM(reg_user_id), 0)::bigint    AS registration,
        COALESCE(SUM(reg_live_7d), 0)::bigint     AS live_7d,
        COALESCE(SUM(reg_live_kyc_7d), 0)::bigint AS kyc_7d,
        COALESCE(SUM(reg_ftd_7d), 0)::bigint      AS ftd_7d,
        COALESCE(SUM(reg_ftt_7d), 0)::bigint      AS ftt_7d,
        COALESCE(SUM(reg_live_30d), 0)::bigint     AS live_30d,
        COALESCE(SUM(reg_ftd_30d), 0)::bigint      AS ftd_30d
      FROM user_funnel
      WHERE register_date >= ${startDate}::date AND register_date <= ${endDate}::date
      ${region ? Prisma.raw(regionSql) : Prisma.empty}
    `;
    const [row] = await this.prisma.$queryRaw<FunnelAggRow[]>(sql);

    const rawValues = [
      Number(row?.registration ?? 0),
      Number(row?.live_7d ?? 0),
      Number(row?.kyc_7d ?? 0),
      Number(row?.ftd_7d ?? 0),
      Number(row?.ftt_7d ?? 0),
      Number(row?.live_30d ?? 0),
      Number(row?.ftd_30d ?? 0),
    ];

    const totalBaseUsers = rawValues[0] || 1; // 避免除零

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
