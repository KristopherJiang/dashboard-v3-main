/**
 * API 端点集成测试
 * 通过 MSW 验证前端 API 调用与后端响应的集成
 */
import { describe, it, expect } from 'vitest';

describe('API Integration', () => {
  describe('GET /api/health', () => {
    it('should return ok status', async () => {
      const res = await fetch('/api/health');
      const data = await res.json();
      expect(data.status).toBe('ok');
    });
  });

  describe('GET /api/v1/kpi', () => {
    it('should return KPI data with default params', async () => {
      const res = await fetch('/api/v1/kpi');
      const data = await res.json();

      expect(data.success).toBe(true);
      expect(data.data).toHaveProperty('registrationUsers');
      expect(data.data).toHaveProperty('ftdUsers');
      expect(data.data).toHaveProperty('fttUsers');
      expect(data.data.registrationUsers.value).toBeGreaterThan(0);
    });

    it('should respect timeRange parameter', async () => {
      const mtdRes = await fetch('/api/v1/kpi?timeRange=mtd');
      const todayRes = await fetch('/api/v1/kpi?timeRange=today');
      const mtd = await mtdRes.json();
      const today = await todayRes.json();

      expect(today.data.registrationUsers.value).toBeLessThan(mtd.data.registrationUsers.value);
    });

    it('should respect region parameter', async () => {
      const globalRes = await fetch('/api/v1/kpi?region=GLOBAL');
      const vnRes = await fetch('/api/v1/kpi?region=ASIA_VN');
      const global = await globalRes.json();
      const vn = await vnRes.json();

      expect(vn.data.registrationUsers.value).toBeLessThan(global.data.registrationUsers.value);
    });
  });

  describe('GET /api/v1/channels', () => {
    it('should return channel hierarchy', async () => {
      const res = await fetch('/api/v1/channels');
      const data = await res.json();

      expect(data.success).toBe(true);
      expect(data.data.channels).toHaveLength(2);
      expect(data.data.channels[0].id).toBe('ib_affiliate');
      expect(data.data.channels[1].children).toBeDefined();
    });
  });

  describe('GET /api/v1/users/distribution', () => {
    it('should return user distribution data', async () => {
      const res = await fetch('/api/v1/users/distribution');
      const data = await res.json();

      expect(data.success).toBe(true);
      expect(data.data.totalNewUsers).toBeGreaterThan(0);
      expect(data.data.retail).toBeDefined();
      expect(data.data.ib).toBeDefined();
    });
  });
});
