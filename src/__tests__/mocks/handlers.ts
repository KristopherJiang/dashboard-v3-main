/**
 * MSW 请求处理器
 * 模拟所有后端 API 端点，用于前端组件测试
 */
import { http, HttpResponse } from 'msw';

// 缩放系数（与后端 scales.ts 保持一致）
const TIME_SCALE: Record<string, number> = {
  today: 0.03,
  yesterday: 0.035,
  thisWeek: 0.21,
  mtd: 1.0,
  lastMonth: 0.95,
  ytd: 4.8,
  last90: 2.9,
  custom: 1.2,
};
const REGION_SCALE: Record<string, number> = {
  GLOBAL: 1.0,
  ASIA_VN: 0.15,
  EU_UK: 0.12,
  ASIA_IN: 0.2,
  MENA_AE: 0.08,
  GS_AU: 0.06,
};

function getMultiplier(timeRange: string, region: string) {
  return (TIME_SCALE[timeRange] || 1.0) * (REGION_SCALE[region] || 0.04);
}

export const handlers = [
  // 健康检查
  http.get('/api/health', () => {
    return HttpResponse.json({ status: 'ok' });
  }),

  // KPI 指标
  http.get('/api/v1/kpi', ({ request }) => {
    const url = new URL(request.url);
    const timeRange = url.searchParams.get('timeRange') || 'mtd';
    const region = url.searchParams.get('region') || 'GLOBAL';
    const m = getMultiplier(timeRange, region);

    return HttpResponse.json({
      success: true,
      data: {
        registrationUsers: {
          value: Math.round(18420 * m),
          trendPoP: 12.5,
          trendYoY: 28.3,
          chartData: Array.from({ length: 12 }, (_, i) => ({
            name: `${i + 1}月`,
            value: Math.round((1200 + i * 200) * m),
            previous: Math.round((1000 + i * 180) * m),
          })),
        },
        ftdUsers: {
          value: Math.round(8640 * m),
          trendPoP: 8.2,
          trendYoY: 22.1,
          chartData: [],
        },
        fttUsers: {
          value: Math.round(5120 * m),
          trendPoP: 15.3,
          trendYoY: 35.7,
          chartData: [],
        },
        netDeposit: {
          value: Math.round(4250000 * m),
          trendPoP: 6.8,
          trendYoY: 41.2,
          chartData: [],
        },
        tradingVolume: {
          value: Math.round(128000000 * m),
          trendPoP: 18.5,
          trendYoY: 52.3,
          chartData: [],
        },
        signupToFtdCVR: {
          value: 46.9,
          trendPoP: 2.1,
          trendYoY: 5.8,
          chartData: [],
        },
        ftdToFttCVR: {
          value: 59.3,
          trendPoP: 3.5,
          trendYoY: 8.2,
          chartData: [],
        },
        d30Retention: {
          value: 21.5,
          trendPoP: 0.8,
          trendYoY: 3.2,
          chartData: [],
        },
      },
      meta: { timestamp: new Date().toISOString(), region, timeRange },
    });
  }),

  // 渠道效率
  http.get('/api/v1/channels', ({ request }) => {
    const url = new URL(request.url);
    const timeRange = url.searchParams.get('timeRange') || 'mtd';
    const region = url.searchParams.get('region') || 'GLOBAL';
    const m = getMultiplier(timeRange, region);

    return HttpResponse.json({
      success: true,
      data: {
        channels: [
          {
            id: 'ib_affiliate',
            channel: 'IB & Affiliate',
            level: 1,
            newUsers: Math.round(3825 * m),
            spend: Math.round(19890 * m),
            signupCAC: 5.2,
            kycCAC: 12.0,
            ftdCAC: 42.0,
            fttCAC: 55.0,
            roi: 920,
            ltv: 8.5,
          },
          {
            id: 'retail',
            channel: 'Retail',
            level: 1,
            newUsers: Math.round(7425 * m),
            spend: Math.round(107662 * m),
            signupCAC: 14.5,
            kycCAC: 28.0,
            ftdCAC: 98.0,
            fttCAC: 132.0,
            roi: 508,
            ltv: 3.9,
            children: [
              {
                id: 'kol',
                channel: 'KOL',
                level: 2,
                newUsers: Math.round(2025 * m),
                spend: Math.round(17212 * m),
                signupCAC: 8.5,
                kycCAC: 18.0,
                ftdCAC: 65.0,
                fttCAC: 82.0,
                roi: 720,
                ltv: 5.8,
              },
              {
                id: 'organic',
                channel: 'Organic',
                level: 2,
                newUsers: Math.round(1800 * m),
                spend: Math.round(7560 * m),
                signupCAC: 4.2,
                kycCAC: 8.5,
                ftdCAC: 35.0,
                fttCAC: 48.0,
                roi: 1120,
                ltv: 9.5,
              },
              {
                id: 'raf',
                channel: 'RAF',
                level: 2,
                newUsers: Math.round(1125 * m),
                spend: Math.round(6187 * m),
                signupCAC: 5.5,
                kycCAC: 12.0,
                ftdCAC: 45.0,
                fttCAC: 58.0,
                roi: 890,
                ltv: 8.2,
              },
            ],
          },
        ],
      },
    });
  }),

  // 用户分布
  http.get('/api/v1/users/distribution', ({ request }) => {
    const url = new URL(request.url);
    const timeRange = url.searchParams.get('timeRange') || 'mtd';
    const region = url.searchParams.get('region') || 'GLOBAL';
    const m = getMultiplier(timeRange, region);
    const total = Math.round(11250 * m);

    return HttpResponse.json({
      success: true,
      data: {
        totalNewUsers: total,
        retail: { val: Math.round(total * 0.66), formatPct: '66%' },
        ib: { val: Math.round(total * 0.34), formatPct: '34%' },
      },
    });
  }),

  // Sensor Tower 数据（已有端点）
  http.get('/api/sensortower/metrics', () => {
    return HttpResponse.json({
      success: true,
      ios: [],
      android: [],
    });
  }),
];
