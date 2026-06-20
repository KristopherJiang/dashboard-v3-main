// Users 分布数据服务 — 从 daily_aggregates 读取 retail_layer1/2/3 旭日图数据

import { Injectable } from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { PrismaService } from '../../prisma/prisma.service';
import { getDateRange } from '../../common/utils/date-range';
import { regionWhereClause } from '../../common/utils/region-filter';

export interface DistributionNode {
  name: string;
  value: number;
  pct: number;
  children?: DistributionNode[];
}

interface LayerRow {
  layer1: string | null;
  layer2: string | null;
  layer3: string | null;
  total: bigint;
}

@Injectable()
export class UsersService {
  constructor(private readonly prisma: PrismaService) {}

  async getDistributionData(
    timeRange: string,
    region: string,
  ): Promise<{ totalNewUsers: number; distribution: DistributionNode[] }> {
    const { startDate, endDate } = getDateRange(timeRange);
    const regionSql = regionWhereClause(region);

    // 按 retail_layer1 / layer2 / layer3 聚合注册人数
    const sql = Prisma.sql`
      SELECT
        retail_layer1 AS layer1,
        retail_layer2 AS layer2,
        retail_layer3 AS layer3,
        COALESCE(SUM(register_cnt), 0)::bigint AS total
      FROM daily_aggregates
      WHERE date >= ${startDate}::date AND date <= ${endDate}::date
      ${region ? Prisma.raw(regionSql) : Prisma.empty}
      GROUP BY retail_layer1, retail_layer2, retail_layer3
      ORDER BY retail_layer1, retail_layer2, retail_layer3
    `;
    const rows = await this.prisma.$queryRaw<LayerRow[]>(sql);

    // 构建树形结构
    const layer1Map = new Map<string, Map<string, LayerRow[]>>();
    let totalNewUsers = 0;

    for (const row of rows) {
      const l1 = row.layer1 ?? 'Unknown';
      const l2 = row.layer2 ?? 'Unknown';
      const count = Number(row.total);
      totalNewUsers += count;

      if (!layer1Map.has(l1)) layer1Map.set(l1, new Map());
      const l2Map = layer1Map.get(l1)!;
      if (!l2Map.has(l2)) l2Map.set(l2, []);
      l2Map.get(l2)!.push(row);
    }

    const distribution: DistributionNode[] = [];

    for (const [l1Name, l2Map] of layer1Map) {
      let l1Total = 0;
      for (const rows of l2Map.values()) {
        for (const r of rows) l1Total += Number(r.total);
      }

      const l2Children: DistributionNode[] = [];

      for (const [l2Name, l2Rows] of l2Map) {
        let l2Total = 0;
        for (const r of l2Rows) l2Total += Number(r.total);

        // Layer3 子节点
        const l3Children: DistributionNode[] = [];
        for (const r of l2Rows) {
          const l3Name = r.layer3 ?? 'Unknown';
          const l3Val = Number(r.total);
          if (l3Val > 0) {
            l3Children.push({
              name: l3Name,
              value: l3Val,
              pct:
                l2Total > 0
                  ? parseFloat(((l3Val / l2Total) * 100).toFixed(1))
                  : 0,
            });
          }
        }

        if (l2Total > 0) {
          const l2Node: DistributionNode = {
            name: l2Name,
            value: l2Total,
            pct:
              l1Total > 0
                ? parseFloat(((l2Total / l1Total) * 100).toFixed(1))
                : 0,
          };
          if (l3Children.length > 0) {
            l2Node.children = l3Children;
          }
          l2Children.push(l2Node);
        }
      }

      if (l1Total > 0) {
        const l1Node: DistributionNode = {
          name: l1Name,
          value: l1Total,
          pct:
            totalNewUsers > 0
              ? parseFloat(((l1Total / totalNewUsers) * 100).toFixed(1))
              : 0,
        };
        if (l2Children.length > 0) {
          l1Node.children = l2Children;
        }
        distribution.push(l1Node);
      }
    }

    return { totalNewUsers, distribution };
  }
}
