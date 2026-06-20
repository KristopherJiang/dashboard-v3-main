// 时间范围计算工具 — 根据 timeRange 枚举计算实际的 startDate / endDate

import {
  startOfDay,
  subDays,
  startOfWeek,
  startOfMonth,
  subMonths,
  endOfMonth,
  startOfYear,
  format,
} from 'date-fns';

export interface DateRange {
  startDate: string; // ISO date string (yyyy-MM-dd)
  endDate: string;
}

/**
 * 根据 timeRange 枚举值计算日期区间
 * @param timeRange - 时间范围枚举
 * @param startDate - custom 模式下的开始日期 (yyyy-MM-dd)
 * @param endDate - custom 模式下的结束日期 (yyyy-MM-dd)
 */
export function getDateRange(
  timeRange: string,
  startDate?: string,
  endDate?: string,
): DateRange {
  const fmt = 'yyyy-MM-dd';
  const now = new Date();
  const today = startOfDay(now);

  switch (timeRange) {
    case 'today':
      return {
        startDate: format(today, fmt),
        endDate: format(today, fmt),
      };

    case 'yesterday': {
      const yesterday = subDays(today, 1);
      return {
        startDate: format(yesterday, fmt),
        endDate: format(yesterday, fmt),
      };
    }

    case 'thisWeek': {
      // 本周一到今天
      const weekStart = startOfWeek(today, { weekStartsOn: 1 });
      return {
        startDate: format(weekStart, fmt),
        endDate: format(today, fmt),
      };
    }

    case 'mtd': {
      // 本月 1 号到今天
      const monthStart = startOfMonth(today);
      return {
        startDate: format(monthStart, fmt),
        endDate: format(today, fmt),
      };
    }

    case 'lastMonth': {
      // 上月 1 号到上月最后一天
      const prevMonth = subMonths(today, 1);
      const lastMonthStart = startOfMonth(prevMonth);
      const lastMonthEnd = endOfMonth(prevMonth);
      return {
        startDate: format(lastMonthStart, fmt),
        endDate: format(lastMonthEnd, fmt),
      };
    }

    case 'ytd': {
      // 今年 1 月 1 号到今天
      const yearStart = startOfYear(today);
      return {
        startDate: format(yearStart, fmt),
        endDate: format(today, fmt),
      };
    }

    case 'last90': {
      // 今天往前 90 天
      const from = subDays(today, 90);
      return {
        startDate: format(from, fmt),
        endDate: format(today, fmt),
      };
    }

    case 'custom': {
      // 使用传入的 startDate/endDate，回退到最近 30 天
      const fallbackFrom = subDays(today, 30);
      return {
        startDate: startDate || format(fallbackFrom, fmt),
        endDate: endDate || format(today, fmt),
      };
    }

    default: {
      // 默认回退到本月
      const monthStart = startOfMonth(today);
      return {
        startDate: format(monthStart, fmt),
        endDate: format(today, fmt),
      };
    }
  }
}
