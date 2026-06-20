// KPI 核心指标数据服务 — 从 daily_aggregates + ftt_retention 读取真实数据 (Prisma ORM)

import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { getDateRange } from '../../common/utils/date-range';
import { getRegionFilter } from '../../common/utils/region-filter-orm';

export interface KPIChartPoint {
  month: string;
  current: number;
  previous: number;
}

export interface KPICard {
  key: string;
  value: number;
  trendPoP: number;
  trendYoY: number;
  chartData: KPIChartPoint[];
}

@Injectable()
export class KpiService {
  constructor(private readonly prisma: PrismaService) {}

  async getKPIData(
    timeRange: string,
    region: string,
  ): Promise<{ cards: KPICard[] }> {
    const { startDate, endDate } = getDateRange(timeRange);
    const regionFilter = getRegionFilter(region);

    const dateWhere = {
      date: { gte: new Date(startDate), lte: new Date(endDate) },
      ...regionFilter,
    };

    // ---- 汇总 KPI ----
    const aggResult = await this.prisma.dailyAggregate.aggregate({
      where: dateWhere,
      _sum: {
        registerCnt: true,
        ftdCnt: true,
        fttCnt: true,
        netDeposit: true,
        tradingVolume: true,
      },
    });

    const registration = aggResult._sum.registerCnt ?? 0;
    const ftd = aggResult._sum.ftdCnt ?? 0;
    const ftt = aggResult._sum.fttCnt ?? 0;
    const netDeposit = aggResult._sum.netDeposit ?? 0;
    const tradingVolume = aggResult._sum.tradingVolume ?? 0;

    // ---- D30 留存率 ----
    const retentionResult = await this.prisma.fttRetention.aggregate({
      where: {
        fttDate: { gte: new Date(startDate), lte: new Date(endDate) },
        ...regionFilter,
      },
      _sum: {
        fttUserId: true,
        fttTrade30d: true,
      },
    });

    const totalFtt = retentionResult._sum?.fttUserId ?? 0;
    const retained30d = retentionResult._sum?.fttTrade30d ?? 0;
    const d30Retention =
      totalFtt > 0
        ? parseFloat(((retained30d / totalFtt) * 100).toFixed(1))
        : 0;

    // ---- 转化率 ----
    const signupFtdCvr =
      registration > 0
        ? parseFloat(((ftd / registration) * 100).toFixed(1))
        : 0;
    const ftdFttCvr = ftd > 0 ? parseFloat(((ftt / ftd) * 100).toFixed(1)) : 0;

    // ---- 月度趋势图数据 ----
    // Prisma groupBy 不支持 TO_CHAR，需用 findMany 后在 JS 中按月分组
    const dailyRows = await this.prisma.dailyAggregate.findMany({
      where: dateWhere,
      select: {
        date: true,
        registerCnt: true,
        ftdCnt: true,
        fttCnt: true,
        netDeposit: true,
        tradingVolume: true,
      },
      orderBy: { date: 'asc' },
    });

    // 按月汇总
    type MonthlyAcc = {
      month: string;
      registration: number;
      ftd: number;
      ftt: number;
      netDeposit: number;
      tradingVolume: number;
    };

    const monthlyMap = new Map<string, MonthlyAcc>();
    for (const row of dailyRows) {
      const month = row.date.toISOString().slice(0, 7); // YYYY-MM
      if (!monthlyMap.has(month)) {
        monthlyMap.set(month, {
          month,
          registration: 0,
          ftd: 0,
          ftt: 0,
          netDeposit: 0,
          tradingVolume: 0,
        });
      }
      const acc = monthlyMap.get(month)!;
      acc.registration += row.registerCnt ?? 0;
      acc.ftd += row.ftdCnt ?? 0;
      acc.ftt += row.fttCnt ?? 0;
      acc.netDeposit += row.netDeposit ?? 0;
      acc.tradingVolume += row.tradingVolume ?? 0;
    }
    const monthlyRows = Array.from(monthlyMap.values()).sort((a, b) =>
      a.month.localeCompare(b.month),
    );

    // 留存月度数据
    const retentionRows = await this.prisma.fttRetention.findMany({
      where: {
        fttDate: { gte: new Date(startDate), lte: new Date(endDate) },
        ...regionFilter,
      },
      select: { fttDate: true, fttUserId: true, fttTrade30d: true },
      orderBy: { fttDate: 'asc' },
    });

    const retentionByMonth = new Map<
      string,
      { total: number; retained: number }
    >();
    for (const r of retentionRows) {
      const month = r.fttDate.toISOString().slice(0, 7);
      if (!retentionByMonth.has(month)) {
        retentionByMonth.set(month, { total: 0, retained: 0 });
      }
      const acc = retentionByMonth.get(month)!;
      acc.total += r.fttUserId ?? 0;
      acc.retained += r.fttTrade30d ?? 0;
    }

    // ---- 构建 chartData ----
    const buildChart = (
      rows: MonthlyAcc[],
      field: keyof MonthlyAcc,
    ): KPIChartPoint[] => {
      return rows.map((row, i) => ({
        month: row.month,
        current: Number(row[field]),
        previous: i > 0 ? Number(rows[i - 1][field]) : 0,
      }));
    };

    const regChart = buildChart(monthlyRows, 'registration');
    const ftdChart = buildChart(monthlyRows, 'ftd');
    const fttChart = buildChart(monthlyRows, 'ftt');
    const depositChart = buildChart(monthlyRows, 'netDeposit');
    const volumeChart = buildChart(monthlyRows, 'tradingVolume');

    // 月度转化率 chart
    const cvrChart: KPIChartPoint[] = monthlyRows.map((row) => ({
      month: row.month,
      current:
        row.registration > 0
          ? parseFloat(((row.ftd / row.registration) * 100).toFixed(1))
          : 0,
      previous: 0,
    }));

    const ftdFttCvrChart: KPIChartPoint[] = monthlyRows.map((row) => ({
      month: row.month,
      current:
        row.ftd > 0 ? parseFloat(((row.ftt / row.ftd) * 100).toFixed(1)) : 0,
      previous: 0,
    }));

    const d30RetentionChart: KPIChartPoint[] = monthlyRows.map((row) => {
      const rm = retentionByMonth.get(row.month);
      const pct =
        rm && rm.total > 0
          ? parseFloat(((rm.retained / rm.total) * 100).toFixed(1))
          : 0;
      return { month: row.month, current: pct, previous: 0 };
    });

    // ---- Trend 计算 (MoM) ----
    const calcMoM = (chart: KPIChartPoint[]): number => {
      if (chart.length < 2) return 0;
      const last = chart[chart.length - 1].current;
      const prev = chart[chart.length - 2].current;
      if (prev === 0) return 0;
      return parseFloat((((last - prev) / prev) * 100).toFixed(1));
    };

    // ---- 组装卡片 ----
    const cards: KPICard[] = [
      {
        key: 'registrationUsers',
        value: registration,
        trendPoP: calcMoM(regChart),
        trendYoY: 0,
        chartData: regChart,
      },
      {
        key: 'ftdUsers',
        value: ftd,
        trendPoP: calcMoM(ftdChart),
        trendYoY: 0,
        chartData: ftdChart,
      },
      {
        key: 'fttUsers',
        value: ftt,
        trendPoP: calcMoM(fttChart),
        trendYoY: 0,
        chartData: fttChart,
      },
      {
        key: 'netDeposit',
        value: Math.round(netDeposit),
        trendPoP: calcMoM(depositChart),
        trendYoY: 0,
        chartData: depositChart,
      },
      {
        key: 'tradingVolume',
        value: Math.round(tradingVolume),
        trendPoP: calcMoM(volumeChart),
        trendYoY: 0,
        chartData: volumeChart,
      },
      {
        key: 'signupToFtdCVR',
        value: signupFtdCvr,
        trendPoP: calcMoM(cvrChart),
        trendYoY: 0,
        chartData: cvrChart,
      },
      {
        key: 'ftdToFttCVR',
        value: ftdFttCvr,
        trendPoP: calcMoM(ftdFttCvrChart),
        trendYoY: 0,
        chartData: ftdFttCvrChart,
      },
      {
        key: 'd30Retention',
        value: d30Retention,
        trendPoP: calcMoM(d30RetentionChart),
        trendYoY: 0,
        chartData: d30RetentionChart,
      },
    ];

    return { cards };
  }
}
