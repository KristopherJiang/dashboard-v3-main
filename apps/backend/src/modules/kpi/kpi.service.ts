// KPI 核心指标数据服务 — 从 daily_aggregates + ftt_retention 读取真实数据

import { Injectable } from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { PrismaService } from '../../prisma/prisma.service';
import { getDateRange } from '../../common/utils/date-range';
import { regionWhereClause } from '../../common/utils/region-filter';

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

interface AggRow {
  registration: bigint;
  ftd: bigint;
  ftt: bigint;
  net_deposit: string; // Prisma decimal → string
  trading_volume: string;
}

interface MonthlyRow {
  month: string;
  registration: bigint;
  ftd: bigint;
  ftt: bigint;
  net_deposit: string;
  trading_volume: string;
}

interface RetentionRow {
  total_ftt: bigint;
  retained_30d: bigint;
}

@Injectable()
export class KpiService {
  constructor(private readonly prisma: PrismaService) {}

  async getKPIData(
    timeRange: string,
    region: string,
  ): Promise<{ cards: KPICard[] }> {
    const { startDate, endDate } = getDateRange(timeRange);
    const regionSql = regionWhereClause(region);

    // ---- 汇总 KPI ----
    const aggSql = Prisma.sql`
      SELECT
        COALESCE(SUM(register_cnt), 0)::bigint AS registration,
        COALESCE(SUM(ftd_cnt), 0)::bigint      AS ftd,
        COALESCE(SUM(ftt_cnt), 0)::bigint      AS ftt,
        COALESCE(SUM(net_deposit), 0)           AS net_deposit,
        COALESCE(SUM(trading_volume), 0)        AS trading_volume
      FROM daily_aggregates
      WHERE date >= ${startDate}::date AND date <= ${endDate}::date
      ${region ? Prisma.raw(regionSql) : Prisma.empty}
    `;
    const [agg] = await this.prisma.$queryRaw<AggRow[]>(aggSql);

    const registration = Number(agg?.registration ?? 0);
    const ftd = Number(agg?.ftd ?? 0);
    const ftt = Number(agg?.ftt ?? 0);
    const netDeposit = Number(agg?.net_deposit ?? 0);
    const tradingVolume = Number(agg?.trading_volume ?? 0);

    // ---- D30 留存率 ----
    const retentionSql = Prisma.sql`
      SELECT
        COALESCE(COUNT(*), 0)::bigint         AS total_ftt,
        COALESCE(SUM(ftt_trade_30d), 0)::bigint AS retained_30d
      FROM ftt_retention
      WHERE ftt_date >= ${startDate}::date AND ftt_date <= ${endDate}::date
      ${region ? Prisma.raw(regionSql) : Prisma.empty}
    `;
    const [retRow] = await this.prisma.$queryRaw<RetentionRow[]>(retentionSql);
    const totalFtt = Number(retRow?.total_ftt ?? 0);
    const retained30d = Number(retRow?.retained_30d ?? 0);
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
    const monthlySql = Prisma.sql`
      SELECT
        TO_CHAR(date, 'YYYY-MM')              AS month,
        COALESCE(SUM(register_cnt), 0)::bigint AS registration,
        COALESCE(SUM(ftd_cnt), 0)::bigint      AS ftd,
        COALESCE(SUM(ftt_cnt), 0)::bigint      AS ftt,
        COALESCE(SUM(net_deposit), 0)           AS net_deposit,
        COALESCE(SUM(trading_volume), 0)        AS trading_volume
      FROM daily_aggregates
      WHERE date >= ${startDate}::date AND date <= ${endDate}::date
      ${region ? Prisma.raw(regionSql) : Prisma.empty}
      GROUP BY TO_CHAR(date, 'YYYY-MM')
      ORDER BY month
    `;
    const monthlyRows = await this.prisma.$queryRaw<MonthlyRow[]>(monthlySql);

    // 留存月度数据
    const retentionMonthlySql = Prisma.sql`
      SELECT
        TO_CHAR(ftt_date, 'YYYY-MM')            AS month,
        COALESCE(COUNT(*), 0)::bigint           AS total_ftt,
        COALESCE(SUM(ftt_trade_30d), 0)::bigint  AS retained_30d
      FROM ftt_retention
      WHERE ftt_date >= ${startDate}::date AND ftt_date <= ${endDate}::date
      ${region ? Prisma.raw(regionSql) : Prisma.empty}
      GROUP BY TO_CHAR(ftt_date, 'YYYY-MM')
      ORDER BY month
    `;
    const retentionMonthlyRows =
      await this.prisma.$queryRaw<(RetentionRow & { month: string })[]>(
        retentionMonthlySql,
      );

    const retentionByMonth = new Map<
      string,
      { total: number; retained: number }
    >();
    for (const r of retentionMonthlyRows) {
      retentionByMonth.set(r.month, {
        total: Number(r.total_ftt),
        retained: Number(r.retained_30d),
      });
    }

    // 生成 chartData: 当前月 vs 上月
    const chartDataMap = new Map<
      string,
      { current: number; previous: number }[]
    >();

    const buildChart = (
      rows: MonthlyRow[],
      field: keyof MonthlyRow,
      isPercentage = false,
    ): KPIChartPoint[] => {
      const points: KPIChartPoint[] = [];
      for (let i = 0; i < rows.length; i++) {
        const curr = Number(rows[i][field]);
        const prev = i > 0 ? Number(rows[i - 1][field]) : 0;
        if (isPercentage) {
          // 对于百分比指标，直接用当月计算值
          points.push({
            month: rows[i].month,
            current: curr,
            previous: prev,
          });
        } else {
          points.push({
            month: rows[i].month,
            current: curr,
            previous: prev,
          });
        }
      }
      return points;
    };

    // 月度转化率 chart
    const cvrChart: KPIChartPoint[] = monthlyRows.map((row, i) => {
      const reg = Number(row.registration);
      const currFtd = Number(row.ftd);
      const currFtt = Number(row.ftt);
      return {
        month: row.month,
        current: reg > 0 ? parseFloat(((currFtd / reg) * 100).toFixed(1)) : 0,
        previous: 0, // 留空，前端看绝对值
      };
    });

    const ftdFttCvrChart: KPIChartPoint[] = monthlyRows.map((row) => {
      const currFtd = Number(row.ftd);
      const currFtt = Number(row.ftt);
      return {
        month: row.month,
        current:
          currFtd > 0 ? parseFloat(((currFtt / currFtd) * 100).toFixed(1)) : 0,
        previous: 0,
      };
    });

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

    const regChart = buildChart(monthlyRows, 'registration');
    const ftdChart = buildChart(monthlyRows, 'ftd');
    const fttChart = buildChart(monthlyRows, 'ftt');
    const depositChart = buildChart(monthlyRows, 'net_deposit');
    const volumeChart = buildChart(monthlyRows, 'trading_volume');

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
        value: netDeposit,
        trendPoP: calcMoM(depositChart),
        trendYoY: 0,
        chartData: depositChart,
      },
      {
        key: 'tradingVolume',
        value: tradingVolume,
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
