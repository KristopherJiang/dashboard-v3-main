// Marketing ROI 数据服务 — 从 daily_aggregates 按月聚合计算 ROI 趋势 (Prisma ORM)

import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { getDateRange } from '../../common/utils/date-range';
import { getRegionFilter } from '../../common/utils/region-filter-orm';

export interface WeeklyROI {
  week: string;
  spend: number;
  revenue: number;
  roi: number;
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
    const regionFilter = getRegionFilter(region);

    // 按月聚合：net_deposit 作为 spend（营销支出代理），
    // trading_volume 作为 revenue（交易收入代理）
    const dailyRows = await this.prisma.dailyAggregate.findMany({
      where: {
        date: { gte: new Date(startDate), lte: new Date(endDate) },
        ...regionFilter,
      },
      select: {
        date: true,
        netDeposit: true,
        tradingVolume: true,
        registerCnt: true,
        ftdCnt: true,
      },
      orderBy: { date: 'asc' },
    });

    // 按月汇总
    type MonthAcc = {
      month: string;
      netDeposit: number;
      tradingVolume: number;
      registerCnt: number;
      ftdCnt: number;
    };

    const monthlyMap = new Map<string, MonthAcc>();
    for (const row of dailyRows) {
      const month = row.date.toISOString().slice(0, 7); // YYYY-MM
      if (!monthlyMap.has(month)) {
        monthlyMap.set(month, {
          month,
          netDeposit: 0,
          tradingVolume: 0,
          registerCnt: 0,
          ftdCnt: 0,
        });
      }
      const acc = monthlyMap.get(month)!;
      acc.netDeposit += row.netDeposit ?? 0;
      acc.tradingVolume += row.tradingVolume ?? 0;
      acc.registerCnt += row.registerCnt ?? 0;
      acc.ftdCnt += row.ftdCnt ?? 0;
    }
    const rows = Array.from(monthlyMap.values()).sort((a, b) =>
      a.month.localeCompare(b.month),
    );

    let totalSpend = 0;
    let totalRevenue = 0;

    const weeks: WeeklyROI[] = rows.map((row, index) => {
      // 使用 net_deposit 的绝对值作为营销支出估算
      // 使用 trading_volume 作为收入估算
      const spend = Math.abs(row.netDeposit);
      const revenue = row.tradingVolume;
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
