// Users 分布数据服务 — 从 daily_aggregates 读取 retail_layer1/2/3 旭日图数据 (Prisma ORM)

import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { getDateRange } from '../../common/utils/date-range';
import { getRegionFilter } from '../../common/utils/region-filter-orm';

export interface DistributionNode {
  name: string;
  value: number;
  pct: number;
  children?: DistributionNode[];
}

@Injectable()
export class UsersService {
  constructor(private readonly prisma: PrismaService) {}

  async getDistributionData(
    timeRange: string,
    region: string,
  ): Promise<{ totalNewUsers: number; distribution: DistributionNode[] }> {
    const { startDate, endDate } = getDateRange(timeRange);
    const regionFilter = await getRegionFilter(region);

    const whereClause = {
      date: { gte: new Date(startDate), lte: new Date(endDate) },
      ...regionFilter,
    };

    // 按 retail_layer1 / layer2 / layer3 聚合注册人数
    // Prisma groupBy 不支持同时按三个字段分组后再聚合，
    // 但支持 by 多字段。不过 daily_aggregates 表的组合列可能很多，
    // 这里用 findMany + JS 聚合更可靠。
    const rows = await this.prisma.dailyAggregate.findMany({
      where: whereClause,
      select: {
        retailLayer1: true,
        retailLayer2: true,
        retailLayer3: true,
        registerCnt: true,
      },
    });

    // 构建树形结构
    const layer1Map = new Map<
      string,
      Map<string, Array<{ layer3: string; total: number }>>
    >();
    let totalNewUsers = 0;

    for (const row of rows) {
      const l1 = row.retailLayer1 ?? 'Unknown';
      const l2 = row.retailLayer2 ?? 'Unknown';
      const l3 = row.retailLayer3 ?? 'Unknown';
      const count = row.registerCnt ?? 0;
      totalNewUsers += count;

      if (!layer1Map.has(l1)) layer1Map.set(l1, new Map());
      const l2Map = layer1Map.get(l1)!;
      if (!l2Map.has(l2)) l2Map.set(l2, []);
      l2Map.get(l2)!.push({ layer3: l3, total: count });
    }

    const distribution: DistributionNode[] = [];

    for (const [l1Name, l2Map] of layer1Map) {
      let l1Total = 0;
      for (const l2Rows of l2Map.values()) {
        for (const r of l2Rows) l1Total += r.total;
      }

      const l2Children: DistributionNode[] = [];

      for (const [l2Name, l2Rows] of l2Map) {
        const l2Total = l2Rows.reduce((sum, r) => sum + r.total, 0);

        // Layer3 子节点 — 合并同名 layer3
        const l3Map = new Map<string, number>();
        for (const r of l2Rows) {
          l3Map.set(r.layer3, (l3Map.get(r.layer3) ?? 0) + r.total);
        }

        const l3Children: DistributionNode[] = [];
        for (const [l3Name, l3Val] of l3Map) {
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
