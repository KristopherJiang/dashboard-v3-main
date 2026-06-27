// Prisma ORM Region 过滤工具 — 从 regions 表动态解析

import { resolveRegion } from './region-resolver';

/**
 * 将前端 region code 映射为 Prisma where 子句。
 * 数据从 regions 表读取，无需硬编码。
 */
export async function getRegionFilter(region: string): Promise<Record<string, string>> {
  if (!region || region === 'GLOBAL') return {};
  const resolved = await resolveRegion(region);
  if (!resolved) return {};
  const filter: Record<string, string> = { region: resolved.region };
  if (resolved.country) filter.country = resolved.country;
  return filter;
}

/**
 * 构建 raw SQL 的 region WHERE 片段（用于 $queryRawUnsafe）
 */
export async function buildRegionSql(region: string): Promise<string> {
  if (!region || region === 'GLOBAL') return '';
  const resolved = await resolveRegion(region);
  if (!resolved) return '';
  let sql = `AND region = '${resolved.region.replace(/'/g, "''")}'`;
  if (resolved.country) {
    sql += ` AND country = '${resolved.country.replace(/'/g, "''")}'`;
  }
  return sql;
}
