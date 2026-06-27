// KPI 核心指标数据服务 — 从 daily_aggregates + ftt_retention 读取真实数据

import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { getDateRange } from '../../common/utils/date-range';
import { getRegionFilter, buildRegionSql } from '../../common/utils/region-filter-orm';

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
    const regionFilter = await getRegionFilter(region);

    // ---- 汇总 KPI (使用 Prisma aggregate，不会 OOM) ----
    const dateWhere = {
      date: { gte: new Date(startDate), lte: new Date(endDate) },
      ...regionFilter,
    };

    const [aggResult, retentionResult, conversionResult] = await Promise.all([
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
          ...regionFilter,
        },
        _sum: { fttUserId: true, fttTrade30d: true },
      }),
      this.prisma.ftdFttConversion.aggregate({
        where: {
          ftdDate: { gte: new Date(startDate), lte: new Date(endDate) },
          ...regionFilter,
        },
        _sum: { ftdUserId: true, ftdFtt7d: true },
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

    // FTD→FTT 转化率：使用 ftd_ftt_conversion 表（cohort 转化，7天内）
    const convFtd = conversionResult._sum?.ftdUserId ?? 0;
    const convFtt7d = conversionResult._sum?.ftdFtt7d ?? 0;
    const ftdFttCvr =
      convFtd > 0
        ? Math.min(parseFloat(((convFtt7d / convFtd) * 100).toFixed(1)), 100)
        : 0;

    // ---- 根据时间范围决定聚合粒度 ----
    const diffDays = Math.round(
      (new Date(endDate).getTime() - new Date(startDate).getTime()) / 86400000,
    );
    let granularity: 'daily' | 'weekly' | 'monthly' = 'monthly';
    let groupExpr: string;
    let labelExpr: string;
    if (diffDays <= 1) {
      granularity = 'daily';
      groupExpr = 'date';
      labelExpr = "TO_CHAR(date, 'MM-DD')";
    } else if (diffDays <= 84) {
      granularity = 'weekly';
      groupExpr = "DATE_TRUNC('week', date)";
      labelExpr = "CONCAT('W', EXTRACT(WEEK FROM date) - EXTRACT(WEEK FROM DATE_TRUNC('month', date)) + 1)";
    } else {
      groupExpr = "DATE_TRUNC('month', date)";
      labelExpr = "TO_CHAR(date, 'YYYY-MM')";
    }

    const regionSql = await buildRegionSql(region);

    const monthlyRows: MonthlyRow[] = await this.prisma.$queryRawUnsafe(`
      SELECT
        ${labelExpr} AS month,
        SUM(register_cnt) AS registration,
        SUM(ftd_cnt) AS ftd,
        SUM(ftt_cnt) AS ftt,
        SUM(net_deposit) AS "netDeposit",
        SUM(trading_volume) AS "tradingVolume"
      FROM daily_aggregates
      WHERE date >= $1 AND date <= $2 ${regionSql}
      GROUP BY ${groupExpr}, ${labelExpr}
      ORDER BY ${groupExpr} ASC
    `, new Date(startDate), new Date(endDate));

    const monthly = monthlyRows.map((r) => ({
      month: r.month,
      registration: Number(r.registration),
      ftd: Number(r.ftd),
      ftt: Number(r.ftt),
      netDeposit: Number(r.netDeposit),
      tradingVolume: Number(r.tradingVolume),
    }));

    // 留存聚合（同样粒度）
    const retGroupExpr = granularity === 'weekly'
      ? "DATE_TRUNC('week', ftt_date)"
      : granularity === 'daily'
        ? 'ftt_date'
        : "DATE_TRUNC('month', ftt_date)";

    const retentionRows: RetentionMonthlyRow[] = await this.prisma.$queryRawUnsafe(`
      SELECT
        ${labelExpr.replace(/date/g, 'ftt_date')} AS month,
        SUM(ftt_user_id) AS total,
        SUM(ftt_trade_30d) AS retained
      FROM ftt_retention
      WHERE ftt_date >= $1 AND ftt_date <= $2 ${regionSql}
      GROUP BY ${retGroupExpr}, ${labelExpr.replace(/date/g, 'ftt_date')}
      ORDER BY ${retGroupExpr} ASC
    `, new Date(startDate), new Date(endDate));

    const retentionMap = new Map<string, { total: number; retained: number }>();
    for (const r of retentionRows) {
      retentionMap.set(r.month, {
        total: Number(r.total),
        retained: Number(r.retained),
      });
    }

    // FTD→FTT 转化率月度数据（从 ftd_ftt_conversion 表）
    const convRows: { month: string; ftd_total: bigint; ftt_7d: bigint }[] =
      await this.prisma.$queryRawUnsafe(`
        SELECT
          ${labelExpr.replace(/date/g, 'ftd_date')} AS month,
          SUM(ftd_user_id) AS ftd_total,
          SUM(ftd_ftt_7d) AS ftt_7d
        FROM ftd_ftt_conversion
        WHERE ftd_date >= $1 AND ftd_date <= $2 ${regionSql}
        GROUP BY ${groupExpr.replace(/date/g, 'ftd_date')}, ${labelExpr.replace(/date/g, 'ftd_date')}
        ORDER BY ${groupExpr.replace(/date/g, 'ftd_date')} ASC
      `, new Date(startDate), new Date(endDate));

    const convMap = new Map<string, { ftd: number; ftt7d: number }>();
    for (const r of convRows) {
      convMap.set(r.month, { ftd: Number(r.ftd_total), ftt7d: Number(r.ftt_7d) });
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
      const cm = convMap.get(row.month);
      const val = cm && cm.ftd > 0
        ? Math.min(parseFloat(((cm.ftt7d / cm.ftd) * 100).toFixed(1)), 100)
        : 0;
      const prevRow = i > 0 ? monthly[i - 1] : null;
      const prevCm = prevRow ? convMap.get(prevRow.month) : null;
      const prev = prevCm && prevCm.ftd > 0
        ? Math.min(parseFloat(((prevCm.ftt7d / prevCm.ftd) * 100).toFixed(1)), 100)
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
}
