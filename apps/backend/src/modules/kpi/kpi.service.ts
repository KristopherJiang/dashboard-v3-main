// KPI 核心指标数据服务 — 从 daily_aggregates + ftt_retention 读取真实数据

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

type MonthlyRow = {
  month: string;
  registration: bigint;
  ftd: bigint;
  ftt: bigint;
  netDeposit: number;
  tradingVolume: number;
};

type RetentionMonthlyRow = {
  month: string;
  total: bigint;
  retained: bigint;
};

@Injectable()
export class KpiService {
  constructor(private readonly prisma: PrismaService) {}

  async getKPIData(
    timeRange: string,
    region: string,
  ): Promise<{ cards: KPICard[] }> {
    const { startDate, endDate } = getDateRange(timeRange);

    // ---- 汇总 KPI (使用 Prisma aggregate，不会 OOM) ----
    const dateWhere = {
      date: { gte: new Date(startDate), lte: new Date(endDate) },
      ...getRegionFilter(region),
    };

    const [aggResult, retentionResult] = await Promise.all([
      this.prisma.dailyAggregate.aggregate({
        where: dateWhere,
        _sum: {
          registerCnt: true,
          ftdCnt: true,
          fttCnt: true,
          netDeposit: true,
          tradingVolume: true,
        },
      }),
      this.prisma.fttRetention.aggregate({
        where: {
          fttDate: { gte: new Date(startDate), lte: new Date(endDate) },
          ...getRegionFilter(region),
        },
        _sum: { fttUserId: true, fttTrade30d: true },
      }),
    ]);

    const registration = aggResult._sum.registerCnt ?? 0;
    const ftd = aggResult._sum.ftdCnt ?? 0;
    const ftt = aggResult._sum.fttCnt ?? 0;
    const netDeposit = aggResult._sum.netDeposit ?? 0;
    const tradingVolume = aggResult._sum.tradingVolume ?? 0;

    const totalFtt = retentionResult._sum?.fttUserId ?? 0;
    const retained30d = retentionResult._sum?.fttTrade30d ?? 0;
    const d30Retention =
      totalFtt > 0
        ? parseFloat(((retained30d / totalFtt) * 100).toFixed(1))
        : 0;

    const signupFtdCvr =
      registration > 0
        ? parseFloat(((ftd / registration) * 100).toFixed(1))
        : 0;
    const ftdFttCvr =
      ftd > 0
        ? Math.min(parseFloat(((ftt / ftd) * 100).toFixed(1)), 100)
        : 0;

    // ---- 月度聚合 (SQL 层面完成，避免 fetch 200K 行到内存) ----
    const regionSql = this.buildRegionSql(region);

    const monthlyRows: MonthlyRow[] = await this.prisma.$queryRawUnsafe(`
      SELECT
        TO_CHAR(date, 'YYYY-MM') AS month,
        SUM(register_cnt) AS registration,
        SUM(ftd_cnt) AS ftd,
        SUM(ftt_cnt) AS ftt,
        SUM(net_deposit) AS "netDeposit",
        SUM(trading_volume) AS "tradingVolume"
      FROM daily_aggregates
      WHERE date >= $1 AND date <= $2 ${regionSql}
      GROUP BY TO_CHAR(date, 'YYYY-MM')
      ORDER BY month ASC
    `, new Date(startDate), new Date(endDate));

    const monthly = monthlyRows.map((r) => ({
      month: r.month,
      registration: Number(r.registration),
      ftd: Number(r.ftd),
      ftt: Number(r.ftt),
      netDeposit: Number(r.netDeposit),
      tradingVolume: Number(r.tradingVolume),
    }));

    // 留存月度聚合
    const retentionRows: RetentionMonthlyRow[] = await this.prisma.$queryRawUnsafe(`
      SELECT
        TO_CHAR(ftt_date, 'YYYY-MM') AS month,
        SUM(ftt_user_id) AS total,
        SUM(ftt_trade_30d) AS retained
      FROM ftt_retention
      WHERE ftt_date >= $1 AND ftt_date <= $2 ${regionSql}
      GROUP BY TO_CHAR(ftt_date, 'YYYY-MM')
      ORDER BY month ASC
    `, new Date(startDate), new Date(endDate));

    const retentionMap = new Map<string, { total: number; retained: number }>();
    for (const r of retentionRows) {
      retentionMap.set(r.month, {
        total: Number(r.total),
        retained: Number(r.retained),
      });
    }

    // ---- 构建 chartData ----
    const buildChart = (field: keyof (typeof monthly)[0]): KPIChartPoint[] =>
      monthly.map((row, i) => ({
        month: row.month,
        current: Number(row[field]),
        previous: i > 0 ? Number(monthly[i - 1][field]) : 0,
      }));

    const regChart = buildChart('registration');
    const ftdChart = buildChart('ftd');
    const fttChart = buildChart('ftt');
    const depositChart = buildChart('netDeposit');
    const volumeChart = buildChart('tradingVolume');

    const cvrChart: KPIChartPoint[] = monthly.map((row, i) => {
      const val =
        row.registration > 0
          ? parseFloat(((row.ftd / row.registration) * 100).toFixed(1))
          : 0;
      const prev = i > 0 && monthly[i - 1].registration > 0
        ? parseFloat(((monthly[i - 1].ftd / monthly[i - 1].registration) * 100).toFixed(1))
        : 0;
      return { month: row.month, current: val, previous: prev };
    });

    const ftdFttCvrChart: KPIChartPoint[] = monthly.map((row, i) => {
      const val = row.ftd > 0
        ? Math.min(parseFloat(((row.ftt / row.ftd) * 100).toFixed(1)), 100)
        : 0;
      const prev = i > 0 && monthly[i - 1].ftd > 0
        ? Math.min(parseFloat(((monthly[i - 1].ftt / monthly[i - 1].ftd) * 100).toFixed(1)), 100)
        : 0;
      return { month: row.month, current: val, previous: prev };
    });

    const d30RetentionChart: KPIChartPoint[] = monthly.map((row, i) => {
      const rm = retentionMap.get(row.month);
      const pct = rm && rm.total > 0
        ? parseFloat(((rm.retained / rm.total) * 100).toFixed(1))
        : 0;
      const prevRm = i > 0 ? retentionMap.get(monthly[i - 1].month) : null;
      const prevPct = prevRm && prevRm.total > 0
        ? parseFloat(((prevRm.retained / prevRm.total) * 100).toFixed(1))
        : 0;
      return { month: row.month, current: pct, previous: prevPct };
    });

    // ---- Trend 计算 ----
    const calcMoM = (chart: KPIChartPoint[]): number => {
      if (chart.length < 2) return 0;
      const last = chart[chart.length - 1].current;
      const prev = chart[chart.length - 2].current;
      if (prev === 0) return 0;
      return parseFloat((((last - prev) / prev) * 100).toFixed(1));
    };

    const calcYoY = (chart: KPIChartPoint[]): number => {
      if (chart.length < 2) return 0;
      const first = chart[0].current;
      const last = chart[chart.length - 1].current;
      if (first === 0) return 0;
      return parseFloat((((last - first) / first) * 100).toFixed(1));
    };

    // ---- 组装卡片 ----
    const cards: KPICard[] = [
      { key: 'registrationUsers', value: registration, trendPoP: calcMoM(regChart), trendYoY: calcYoY(regChart), chartData: regChart },
      { key: 'ftdUsers', value: ftd, trendPoP: calcMoM(ftdChart), trendYoY: calcYoY(ftdChart), chartData: ftdChart },
      { key: 'fttUsers', value: ftt, trendPoP: calcMoM(fttChart), trendYoY: calcYoY(fttChart), chartData: fttChart },
      { key: 'netDeposit', value: Math.round(netDeposit), trendPoP: calcMoM(depositChart), trendYoY: calcYoY(depositChart), chartData: depositChart },
      { key: 'tradingVolume', value: Math.round(tradingVolume), trendPoP: calcMoM(volumeChart), trendYoY: calcYoY(volumeChart), chartData: volumeChart },
      { key: 'signupToFtdCVR', value: signupFtdCvr, trendPoP: calcMoM(cvrChart), trendYoY: calcYoY(cvrChart), chartData: cvrChart },
      { key: 'ftdToFttCVR', value: ftdFttCvr, trendPoP: calcMoM(ftdFttCvrChart), trendYoY: calcYoY(ftdFttCvrChart), chartData: ftdFttCvrChart },
      { key: 'd30Retention', value: d30Retention, trendPoP: calcMoM(d30RetentionChart), trendYoY: calcYoY(d30RetentionChart), chartData: d30RetentionChart },
    ];

    return { cards };
  }

  private buildRegionSql(region: string): string {
    if (!region || region === 'GLOBAL') return '';
    return `AND region = '${region.replace(/'/g, "''")}'`;
  }
}
