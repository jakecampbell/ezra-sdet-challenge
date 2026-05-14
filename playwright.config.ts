import { defineConfig, devices } from '@playwright/test';
import dotenv from 'dotenv';
import path from "node:path";
import * as fs from "node:fs";

/**
 * Read env vars from .env.pw
 */
const dotEnvPath = path.resolve(__dirname, '.env.pw');
if (fs.existsSync(dotEnvPath)) {
  dotenv.config({ path: dotEnvPath });
}

export default defineConfig({
  testDir: './tests',
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 2 : 0,
  workers: process.env.CI ? 4 : undefined,
  reporter: [
    ['html', { outputFolder: 'playwright-report', open: 'never' }],
    ['list'],
    ...(process.env.CI ? [['junit', { outputFile: 'results/junit.xml' }] as const] : []),
  ],
  use: {
    baseURL: process.env.BASE_URL,
    trace: 'on-first-retry',
    screenshot: 'only-on-failure',
    video: 'on-first-retry',
    actionTimeout: 10_000,
    navigationTimeout: 30_000,
  },
  projects: [
    {
      name: 'chromium',
      use: { ...devices['Desktop Chrome'] },
    },
    {
      name: 'firefox',
      use: { ...devices['Desktop Firefox'] },
    },
    {
      name: 'mobile-chrome',
      use: { ...devices['Pixel 5'] },
    },
  ],
  outputDir: 'test-results',
});
