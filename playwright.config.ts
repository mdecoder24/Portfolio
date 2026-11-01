import { defineConfig, devices } from '@playwright/test';

const PORT = 3200;

export default defineConfig({
  testDir: 'tests/e2e',
  fullyParallel: true,
  // One retry on CI only, where shared runners stall at random; a retried test still shows as flaky in the report
  retries: process.env.CI ? 1 : 0,
  reporter: process.env.CI ? 'github' : 'list',
  use: { baseURL: `http://localhost:${PORT}` },
  projects: [
    {
      name: 'chromium',
      use: { ...devices['Desktop Chrome'], launchOptions: { args: ['--use-angle=swiftshader', '--enable-unsafe-swiftshader'] } },
    },
    { name: 'phone', use: { ...devices['Pixel 7'] }, testMatch: /layout\.spec/ },
  ],
  webServer: {
    command: `pnpm build && pnpm start -p ${PORT}`,
    port: PORT,
    reuseExistingServer: !process.env.CI,
    timeout: 180_000,
  },
});
