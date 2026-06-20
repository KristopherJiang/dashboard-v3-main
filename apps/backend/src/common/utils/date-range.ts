// 日期范围工具 — 将 timeRange 映射为 SQL 可用的 startDate / endDate

/**
 * 根据 timeRange 计算起止日期。
 * 数据范围: 2025-01-01 ~ 2025-04-01，以该范围为基准做 clamping。
 */
export function getDateRange(
  timeRange: string,
  customStart?: string,
  customEnd?: string,
): { startDate: string; endDate: string } {
  // 数据集的边界
  const DATA_MIN = new Date('2025-01-01');
  const DATA_MAX = new Date('2025-04-01');

  let start: Date;
  let end: Date;

  if (timeRange === 'custom' && customStart && customEnd) {
    start = new Date(customStart);
    end = new Date(customEnd);
  } else {
    // 以 DATA_MAX 为"今天"
    end = new Date(DATA_MAX);
    start = new Date(DATA_MAX);

    switch (timeRange) {
      case 'today':
        // 仅当天
        break;
      case 'yesterday':
        start.setDate(start.getDate() - 1);
        end.setDate(end.getDate() - 1);
        break;
      case 'thisWeek':
        start.setDate(start.getDate() - 7);
        break;
      case 'mtd':
        start.setDate(1); // 当月 1 号
        break;
      case 'lastMonth':
        start = new Date(DATA_MAX);
        start.setMonth(start.getMonth() - 1);
        start.setDate(1);
        end = new Date(DATA_MAX);
        end.setDate(0); // 上月最后一天
        break;
      case 'ytd':
        start = new Date(DATA_MAX.getFullYear(), 0, 1);
        break;
      case 'last90':
        start.setDate(start.getDate() - 90);
        break;
      default:
        // mtd 作为默认
        start.setDate(1);
        break;
    }
  }

  // Clamp 到数据范围
  if (start < DATA_MIN) start = new Date(DATA_MIN);
  if (end > DATA_MAX) end = new Date(DATA_MAX);

  const fmt = (d: Date) => d.toISOString().split('T')[0];
  return { startDate: fmt(start), endDate: fmt(end) };
}
