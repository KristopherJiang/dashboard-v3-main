/**
 * MSW Browser Worker — 用于开发环境 mock
 */
import { setupWorker } from 'msw/browser';
import { handlers } from './handlers';

export const worker = setupWorker(...handlers);
