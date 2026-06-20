/**
 * Dashboard V3 E2E 测试
 * 使用 Edge 浏览器有头模式，用户可以看到测试过程
 */
import { test, expect } from '@playwright/test';

test.describe('Dashboard V3 完整流程', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
    // 等待页面加载完成
    await page.waitForLoadState('networkidle');
  });

  test('首页加载并显示标题', async ({ page }) => {
    // 验证页面标题
    await expect(page.locator('h1')).toContainText('Copilot Data Dashboard');

    // 截图记录
    await page.screenshot({ path: 'e2e/screenshots/01-homepage.png', fullPage: true });
  });

  test('KPI 卡片显示数据', async ({ page }) => {
    // 等待 KPI 区域加载
    const kpiSection = page.locator('section').first();
    await expect(kpiSection).toBeVisible();

    await page.screenshot({ path: 'e2e/screenshots/02-kpi-cards.png', fullPage: true });
  });

  test('切换时间范围', async ({ page }) => {
    // 点击时间选择器
    const timePicker = page.locator('button').filter({ hasText: /时间维度|本月/ });
    await timePicker.click();

    // 等待下拉菜单出现
    await page.waitForTimeout(500);

    await page.screenshot({ path: 'e2e/screenshots/03-time-picker-open.png', fullPage: true });

    // 选择"今年以来"
    const ytdOption = page.locator('button').filter({ hasText: /YTD|今年以来/ });
    if (await ytdOption.isVisible()) {
      await ytdOption.click();
      await page.waitForTimeout(1000);
      await page.screenshot({ path: 'e2e/screenshots/04-after-ytd-select.png', fullPage: true });
    }
  });

  test('切换地区', async ({ page }) => {
    // 点击地区选择器
    const regionPicker = page.locator('button').filter({ hasText: /GLOBAL|全球/ });
    await regionPicker.click();
    await page.waitForTimeout(500);

    await page.screenshot({ path: 'e2e/screenshots/05-region-picker-open.png', fullPage: true });
  });

  test('打开 AI 告警抽屉', async ({ page }) => {
    // 点击铃铛按钮
    const bellButton = page.locator('button').filter({ has: page.locator('svg') }).nth(1);
    await bellButton.click();
    await page.waitForTimeout(500);

    await page.screenshot({ path: 'e2e/screenshots/06-alert-drawer.png', fullPage: true });
  });

  test('打开 AI 诊断弹窗', async ({ page }) => {
    // 点击"智能分析"按钮
    const aiButton = page.locator('button').filter({ hasText: /智能分析/ });
    await aiButton.click();

    // 等待弹窗加载
    await page.waitForTimeout(3000);

    await page.screenshot({ path: 'e2e/screenshots/07-ai-diagnostic.png', fullPage: true });
  });
});
