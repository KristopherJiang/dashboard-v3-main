import { chromium } from 'playwright';

async function main() {
  const browser = await chromium.launch({ headless: true });
  const page = await browser.newPage();

  const errors: string[] = [];
  const failedRequests: string[] = [];

  page.on('console', (msg) => {
    if (msg.type() === 'error') errors.push(msg.text());
  });
  page.on('pageerror', (err) => errors.push(err.message));
  page.on('response', (response) => {
    if (response.status() >= 400) {
      failedRequests.push(`${response.status()} ${response.url()}`);
    }
  });

  console.log('正在检查 Dashboard...');
  await page.goto('http://localhost:5173', {
    waitUntil: 'networkidle',
    timeout: 30000,
  });
  await page.waitForTimeout(3000);
  await page.screenshot({
    path: 'e2e/screenshots/dashboard-check.png',
    fullPage: true,
  });

  console.log('\n=== 控制台错误 ===');
  errors.length ? errors.forEach((e) => console.log('❌', e)) : console.log('✅ 无错误');

  console.log('\n=== 失败请求 ===');
  failedRequests.length
    ? failedRequests.forEach((r) => console.log('❌', r))
    : console.log('✅ 无失败请求');

  await browser.close();
}

main().catch(console.error);
