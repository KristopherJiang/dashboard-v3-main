// Region 过滤工具 — 将前端 region 枚举映射为 SQL WHERE 条件

export interface RegionFilter {
  sql: string;
  params: unknown[];
}

/**
 * 前端 region 值 → SQL WHERE 子句片段 + 参数。
 * GLOBAL 不加任何 region 过滤。
 */
export function buildRegionFilter(region: string): RegionFilter {
  switch (region) {
    case 'GLOBAL':
      return { sql: '', params: [] };
    case 'ASIA_VN':
      return {
        sql: " AND region = 'Asia' AND country = 'Vietnam'",
        params: [],
      };
    case 'EU_UK':
      return { sql: " AND region = 'EU'", params: [] };
    case 'ASIA_IN':
      return { sql: " AND region = 'Asia' AND country = 'India'", params: [] };
    case 'MENA_AE':
      return { sql: " AND region = 'MENA'", params: [] };
    case 'GS_AU':
      return { sql: " AND region = 'GS-Others'", params: [] };
    default:
      // 如果传入的恰好是数据库中的 region 值
      return { sql: ' AND region = $1', params: [region] };
  }
}

/**
 * 为 $queryRaw 构建完整的 WHERE 条件。
 * 返回 Prisma SQL 模板用的 Prisma.Sql 片段。
 * 注意: 这个函数生成原始 SQL 字符串，调用方需用 $queryRawUnsafe 或拼接 Prisma.sql。
 */
export function regionWhereClause(region: string): string {
  switch (region) {
    case 'GLOBAL':
      return '';
    case 'ASIA_VN':
      return " AND region = 'Asia' AND country = 'Vietnam'";
    case 'EU_UK':
      return " AND region = 'EU'";
    case 'ASIA_IN':
      return " AND region = 'Asia' AND country = 'India'";
    case 'MENA_AE':
      return " AND region = 'MENA'";
    case 'GS_AU':
      return " AND region = 'GS-Others'";
    default:
      return '';
  }
}
