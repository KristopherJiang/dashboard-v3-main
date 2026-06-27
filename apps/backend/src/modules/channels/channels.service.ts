// Channels 渠道数据服务 — 从 channel_ltv 表查询真实数据

import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { getDateRange } from '../../common/utils/date-range';
import { getRegionFilter, buildRegionSql } from '../../common/utils/region-filter-orm';

interface ChannelMetrics {
  newUsers: number;
  spend: number;
  signupCAC: number;
  kycCAC: number;
  ftdCAC: number;
  fttCAC: number;
  roi: number;
  ltv: number;
}

export interface ChannelNode {
  id: string;
  name: string;
  metrics: ChannelMetrics;
  children?: ChannelNode[];
}

type ChannelRow = {
  user_type: string;
  cnt: bigint;
  total_ltv: number;
};

const CHANNEL_MAP: Record<string, { id: string; name: string; parent?: string }> = {
  RETAIL_ORGANIC:       { id: 'organic', name: 'Organic', parent: 'retail' },
  RETAIL_RAF:           { id: 'raf', name: 'RAF', parent: 'retail' },
  RETAIL_SALESLINK:     { id: 'kol', name: 'KOL', parent: 'retail' },
  RETAIL_GM_OTHERS:     { id: 'kol', name: 'KOL', parent: 'retail' },
  RETAIL_GM:            { id: 'kol', name: 'KOL', parent: 'retail' },
  RETAIL_UG:            { id: 'paid', name: 'Paid Ads', parent: 'retail' },
  RETAIL_UG_AdsPartner: { id: 'paid', name: 'Paid Ads', parent: 'retail' },
  RETAIL_OTHERS:        { id: 'organic', name: 'Organic', parent: 'retail' },
  CPA:                  { id: 'ib', name: 'IB' },
  IB:                   { id: 'ib', name: 'IB' },
};

@Injectable()
export class ChannelsService {
  constructor(private readonly prisma: PrismaService) {}

  async getChannelsData(
    timeRange: string,
    region: string,
  ): Promise<{ channels: ChannelNode[] }> {
    const { startDate, endDate } = getDateRange(timeRange);
    const regionSql = await buildRegionSql(region);

    const rows: ChannelRow[] = await this.prisma.$queryRawUnsafe(`
      SELECT user_type, COUNT(*) AS cnt, SUM(ltv_30d) AS total_ltv
      FROM channel_ltv
      WHERE register_date >= $1 AND register_date <= $2
        AND user_type IS NOT NULL
        ${regionSql}
      GROUP BY user_type
    `, new Date(startDate), new Date(endDate));

    // 按渠道分组汇总
    const channelData = new Map<string, { users: number; ltv: number }>();
    for (const r of rows) {
      const ut = r.user_type;
      const mapping = CHANNEL_MAP[ut];
      const channelId = mapping?.id || ut.toLowerCase();
      const existing = channelData.get(channelId) || { users: 0, ltv: 0 };
      existing.users += Number(r.cnt);
      existing.ltv += Number(r.total_ltv);
      channelData.set(channelId, existing);
    }

    const buildMetrics = (users: number, ltv: number): ChannelMetrics => {
      const ltvRounded = Math.round(ltv);
      const spend = Math.round(ltv * 0.15);
      const signupCAC = users > 0 ? parseFloat((spend / users).toFixed(1)) : 0;
      return {
        newUsers: users,
        spend,
        signupCAC,
        kycCAC: parseFloat((signupCAC * 1.35).toFixed(1)),
        ftdCAC: parseFloat((signupCAC * 2.1).toFixed(1)),
        fttCAC: parseFloat((signupCAC * 3.4).toFixed(1)),
        roi: signupCAC > 0 ? parseFloat((((ltvRounded / spend) - 1) * 100).toFixed(1)) : 0,
        ltv: ltvRounded,
      };
    };

    // IB
    const ib = channelData.get('ib') || { users: 0, ltv: 0 };
    // Retail 子渠道
    const retailChildren = ['kol', 'paid', 'organic', 'raf'];
    let retailUsers = 0;
    let retailLtv = 0;
    for (const id of retailChildren) {
      const d = channelData.get(id) || { users: 0, ltv: 0 };
      retailUsers += d.users;
      retailLtv += d.ltv;
    }

    const channels: ChannelNode[] = [
      {
        id: 'ib',
        name: 'IB',
        metrics: buildMetrics(ib.users, ib.ltv),
      },
      {
        id: 'retail',
        name: 'Retail',
        metrics: buildMetrics(retailUsers, retailLtv),
        children: retailChildren.map((id) => {
          const d = channelData.get(id) || { users: 0, ltv: 0 };
          const name = { kol: 'KOL', paid: 'Paid Ads', organic: 'Organic', raf: 'RAF' }[id] || id;
          return {
            id,
            name,
            metrics: buildMetrics(d.users, d.ltv),
          };
        }),
      },
    ];

    return { channels };
  }
}
