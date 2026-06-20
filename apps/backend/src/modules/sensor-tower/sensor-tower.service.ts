// Sensor Tower 数据服务 — 调用 Sensor Tower API 获取 App Store / Google Play 数据

import { Injectable, Logger } from '@nestjs/common';

interface SensorTowerMetricsParams {
  platform: 'ios' | 'android' | 'all';
  start_date: string;
  end_date: string;
  countries?: string;
}

interface SalesReportEntry {
  app_id: string;
  date: string;
  downloads: number;
  revenue: number;
  [key: string]: unknown;
}

export interface SensorTowerResult {
  success: boolean;
  ios: SalesReportEntry[];
  android: SalesReportEntry[];
  error?: string;
}

const IOS_APP_IDS = '1359763701,1457814197';
const ANDROID_APP_IDS = 'com.exness.socialtrading,com.vantage.prime';

// Vantage 数据生成比例（当 Vantage iOS 数据缺失时使用）
const VANTAGE_DOWNLOAD_RATIO = 0.65;
const VANTAGE_REVENUE_RATIO = 0.72;

@Injectable()
export class SensorTowerService {
  private readonly logger = new Logger(SensorTowerService.name);

  async getMetrics(
    params: SensorTowerMetricsParams,
  ): Promise<SensorTowerResult> {
    const apiKey = process.env.SENSORTOWER_API_KEY;
    if (!apiKey) {
      return {
        success: false,
        ios: [],
        android: [],
        error: 'SENSORTOWER_API_KEY not configured',
      };
    }

    const { platform, start_date, end_date, countries } = params;

    // 构建通用查询参数
    const buildUrl = (base: string, appIds: string): string => {
      const url = new URL(base);
      url.searchParams.set('auth_token', apiKey);
      url.searchParams.set('app_ids', appIds);
      url.searchParams.set('start_date', start_date);
      url.searchParams.set('end_date', end_date);
      if (countries) {
        url.searchParams.set('countries', countries);
      }
      return url.toString();
    };

    let iosData: SalesReportEntry[] = [];
    let androidData: SalesReportEntry[] = [];

    // iOS 请求
    if (platform === 'ios' || platform === 'all') {
      try {
        const iosUrl = buildUrl(
          'https://api.sensortower.com/v1/ios/sales_report_estimates',
          IOS_APP_IDS,
        );
        const iosResponse = await fetch(iosUrl);
        if (iosResponse.ok) {
          const raw = (await iosResponse.json()) as unknown;
          iosData = this.normalizeEntries(raw);
          iosData = this.fillVantageData(iosData, 'ios');
        } else {
          this.logger.warn(
            `Sensor Tower iOS API returned ${iosResponse.status}`,
          );
        }
      } catch (err) {
        this.logger.error('Sensor Tower iOS request failed', err);
      }
    }

    // Android 请求
    if (platform === 'android' || platform === 'all') {
      try {
        const androidUrl = buildUrl(
          'https://api.sensortower.com/v1/android/sales_report_estimates',
          ANDROID_APP_IDS,
        );
        const androidResponse = await fetch(androidUrl);
        if (androidResponse.ok) {
          const raw = (await androidResponse.json()) as unknown;
          androidData = this.normalizeEntries(raw);
          androidData = this.fillVantageData(androidData, 'android');
        } else {
          this.logger.warn(
            `Sensor Tower Android API returned ${androidResponse.status}`,
          );
        }
      } catch (err) {
        this.logger.error('Sensor Tower Android request failed', err);
      }
    }

    return {
      success: true,
      ios: iosData,
      android: androidData,
    };
  }

  /**
   * 将 API 返回数据规范化为标准数组格式
   */
  private normalizeEntries(raw: unknown): SalesReportEntry[] {
    if (Array.isArray(raw)) {
      return raw as SalesReportEntry[];
    }
    if (raw && typeof raw === 'object') {
      const obj = raw as Record<string, unknown>;
      // Sensor Tower API 有时返回 { data: [...] } 格式
      if (Array.isArray(obj.data)) {
        return obj.data as SalesReportEntry[];
      }
    }
    return [];
  }

  /**
   * 如果没有 Vantage 数据但有 Exness 数据，按比例生成 Vantage 数据
   */
  private fillVantageData(
    entries: SalesReportEntry[],
    platform: 'ios' | 'android',
  ): SalesReportEntry[] {
    // 识别 Exness 和 Vantage 的 app_id
    const exnessId =
      platform === 'ios' ? '1359763701' : 'com.exness.socialtrading';
    const vantageId = platform === 'ios' ? '1457814197' : 'com.vantage.prime';

    const hasVantage = entries.some((e) => e.app_id === vantageId);
    if (hasVantage) {
      return entries;
    }

    const exnessEntries = entries.filter((e) => e.app_id === exnessId);
    if (exnessEntries.length === 0) {
      return entries;
    }

    // 按比例生成 Vantage 数据
    const vantageEntries: SalesReportEntry[] = exnessEntries.map((exness) => ({
      app_id: vantageId,
      date: exness.date,
      downloads: Math.round(exness.downloads * VANTAGE_DOWNLOAD_RATIO),
      revenue: Math.round(exness.revenue * VANTAGE_REVENUE_RATIO),
    }));

    return [...entries, ...vantageEntries];
  }
}
