/**
 * Vitest 测试环境全局配置
 * - MSW (Mock Service Worker) 拦截网络请求
 * - Testing Library DOM 匹配器
 * - 浏览器 API 模拟
 */
import '@testing-library/jest-dom/vitest';
import { cleanup } from '@testing-library/react';
import { afterEach, beforeAll, afterAll } from 'vitest';
import { server } from './mocks/server';

// MSW：启动 mock server，拦截所有 fetch 请求
beforeAll(() =>
  server.listen({
    onUnhandledRequest: 'warn',
  }),
);

afterEach(() => {
  cleanup();
  server.resetHandlers();
});

afterAll(() => server.close());

// 模拟 matchMedia（Recharts 需要）
Object.defineProperty(window, 'matchMedia', {
  writable: true,
  value: (query: string) => ({
    matches: false,
    media: query,
    onchange: null,
    addListener: () => {},
    removeListener: () => {},
    addEventListener: () => {},
    removeEventListener: () => {},
    dispatchEvent: () => false,
  }),
});

// 模拟 ResizeObserver（图表组件需要）
globalThis.ResizeObserver = class ResizeObserver {
  observe() {}
  unobserve() {}
  disconnect() {}
};

// 模拟 IntersectionObserver
globalThis.IntersectionObserver = class IntersectionObserver {
  constructor() {}
  observe() {}
  unobserve() {}
  disconnect() {}
} as unknown as typeof IntersectionObserver;
