// 日期范围工具 — 将 timeRange 映射为 SQL 可用的 startDate / endDate

/**
 * 根据 timeRange 和真实今天计算起止日期。
 * 数据库没有对应范围的数据时，调用方应返回空数组。
 */
export function getDateRange(
  timeRange: string,
  customStart?: string,
  customEnd?: string,
): { startDate: string; endDate: string } {
  const today = new Date();

  let start: Date;
  let end: Date;

  if (timeRange === 'custom' && customStart && customEnd) {
    start = new Date(customStart);
    end = new Date(customEnd);
  } else {
    end = new Date(today);
    start = new Date(today);

    switch (timeRange) {
      case 'today':
        break;
      case 'yesterday':
        start.setDate(start.getDate() - 1);
        end.setDate(end.getDate() - 1);
        break;
      case 'thisWeek':
        start.setDate(start.getDate() - 7);
        break;
      case 'mtd':
        start.setDate(1);
        break;
      case 'lastMonth':
        start = new Date(today);
        start.setMonth(start.getMonth() - 1, 1);
        end = new Date(today.getFullYear(), today.getMonth(), 0);
        break;
      case 'ytd':
        start = new Date(today.getFullYear(), 0, 1);
        break;
      case 'last90':
        start.setDate(start.getDate() - 90);
        break;
      default:
        start.setDate(1);
        break;
    }
  }

  const fmt = (d: Date) => d.toISOString().split('T')[0];
  return { startDate: fmt(start), endDate: fmt(end) };
}
