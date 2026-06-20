/**
 * SensorTower API 客户端单元测试
 * 验证数据转换逻辑的正确性
 */
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { fetchSensorTowerData } from '@/lib/sensorTowerApi';

describe('fetchSensorTowerData', () => {
  beforeEach(() => {
    vi.restoreAllMocks();
  });

  it('should return 12 months of data', async () => {
    // MSW 会拦截 /api/sensortower/metrics 请求
    const result = await fetchSensorTowerData('App Store', 'GLOBAL', 'mtd');
    expect(result).toHaveLength(12);
  });

  it('should have correct data structure', async () => {
    const result = await fetchSensorTowerData('App Store', 'GLOBAL', 'mtd');
    const firstMonth = result[0];

    expect(firstMonth).toHaveProperty('name');
    expect(firstMonth).toHaveProperty('downloads');
    expect(firstMonth).toHaveProperty('reviews');
    expect(firstMonth).toHaveProperty('score');
    expect(firstMonth).toHaveProperty('compDownloads');
    expect(firstMonth).toHaveProperty('compReviews');
    expect(firstMonth).toHaveProperty('compScore');
  });

  it('should scale data by region', async () => {
    const globalData = await fetchSensorTowerData('App Store', 'GLOBAL', 'mtd');
    const vnData = await fetchSensorTowerData('App Store', 'ASIA_VN', 'mtd');

    // ASIA_VN 的数据量应小于 GLOBAL
    expect(vnData[0].downloads).toBeLessThan(globalData[0].downloads);
  });

  it('should scale data by timeRange', async () => {
    const mtdData = await fetchSensorTowerData('App Store', 'GLOBAL', 'mtd');
    const todayData = await fetchSensorTowerData('App Store', 'GLOBAL', 'today');

    // today 的数据量应远小于 mtd
    expect(todayData[0].downloads).toBeLessThan(mtdData[0].downloads);
  });

  it('should fallback to mock data on API error', async () => {
    // 模拟 fetch 失败
    vi.spyOn(globalThis, 'fetch').mockRejectedValueOnce(new Error('Network error'));

    const result = await fetchSensorTowerData('App Store', 'GLOBAL', 'mtd');
    expect(result).toHaveLength(12);
    expect(result[0].downloads).toBeGreaterThan(0);
  });

  it('should return month names in Chinese', async () => {
    const result = await fetchSensorTowerData('App Store', 'GLOBAL', 'mtd');
    expect(result[0].name).toBe('1月');
    expect(result[11].name).toBe('12月');
  });
});
