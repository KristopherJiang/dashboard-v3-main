import { defineConfig, devices } from '@playwright/test';

export default defineConfig({
  testDir: './e2e',
  timeout: 30_000,
  retries: 0,
  use: {
    baseURL: 'http://localhost:3000',
    // 使用 Edge 浏览器，有头模式（用户可以看到测试过程）
    browserName: 'msedge',
    headless: false,
    // 慢动作，让用户看清每一步
    launchOptions: {
      slowMo: 500,
    },
    screenshot: 'on',
    trace: 'on-first-retry',
  },
  // 不并行，方便观察
  workers: 1,
  reporter: [['list'], ['html', { open: 'never' }]],
});
