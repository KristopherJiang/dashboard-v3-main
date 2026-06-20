// Marketing ROI 数据服务 — 从 daily_aggregates 按月聚合计算 ROI 趋势

import { Injectable } from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { PrismaService } from '../../prisma/prisma.service';
import { getDateRange } from '../../common/utils/date-range';
import { regionWhereClause } from '../../common/utils/region-filter';

export interface WeeklyROI {
  week: string;
  spend: number;
  revenue: number;
  roi: number;
}

interface MonthlyRow {
  month: string;
  net_deposit: string;
  trading_volume: string;
  register_cnt: bigint;
  ftd_cnt: bigint;
}

@Injectable()
export class MarketingService {
  constructor(private readonly prisma: PrismaService) {}

  async getMarketingRoiData(
    timeRange: string,
    region: string,
  ): Promise<{
    weeks: WeeklyROI[];
    totalSpend: number;
    totalRevenue: number;
    avgRoi: number;
  }> {
    const { startDate, endDate } = getDateRange(timeRange);
    const regionSql = regionWhereClause(region);

    // 按月聚合：net_deposit 作为 spend（营销支出代理），
    // trading_volume 作为 revenue（交易收入代理）
    const sql = Prisma.sql`
      SELECT
        TO_CHAR(date, 'YYYY-MM')         AS month,
        COALESCE(SUM(net_deposit), 0)    AS net_deposit,
        COALESCE(SUM(trading_volume), 0) AS trading_volume,
        COALESCE(SUM(register_cnt), 0)::bigint AS register_cnt,
        COALESCE(SUM(ftd_cnt), 0)::bigint      AS ftd_cnt
      FROM daily_aggregates
      WHERE date >= ${startDate}::date AND date <= ${endDate}::date
      ${region ? Prisma.raw(regionSql) : Prisma.empty}
      GROUP BY TO_CHAR(date, 'YYYY-MM')
      ORDER BY month
    `;
    const rows = await this.prisma.$queryRaw<MonthlyRow[]>(sql);

    let totalSpend = 0;
    let totalRevenue = 0;

    const weeks: WeeklyROI[] = rows.map((row, index) => {
      // 使用 net_deposit 的绝对值作为营销支出估算
      // 使用 trading_volume 作为收入估算
      const spend = Math.abs(Number(row.net_deposit));
      const revenue = Number(row.trading_volume);
      const roi =
        spend > 0 ? parseFloat(((revenue / spend - 1) * 100).toFixed(1)) : 0;

      totalSpend += spend;
      totalRevenue += revenue;

      return {
        week: `M${index + 1}`, // 用月份序号作为 label
        spend: Math.round(spend),
        revenue: Math.round(revenue),
        roi,
      };
    });

    const avgRoi =
      totalSpend > 0
        ? parseFloat(((totalRevenue / totalSpend - 1) * 100).toFixed(1))
        : 0;

    return {
      weeks,
      totalSpend: Math.round(totalSpend),
      totalRevenue: Math.round(totalRevenue),
      avgRoi,
    };
  }
}
