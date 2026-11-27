import { defineConfig, devices } from '@playwright/test';
export default defineConfig({
  testDir: './test/e2e', fullyParallel: false, workers: 1, retries: 0, timeout: 45000,
  reporter: [['list'], ['html', { open: 'never' }], ['junit', { outputFile: 'test-results/e2e.xml' }]],
  use: { baseURL: 'http://127.0.0.1:4300', trace: 'retain-on-failure', screenshot: 'only-on-failure' },
  projects: [{ name: 'chromium', use: { ...devices['Desktop Chrome'] } }],
  webServer: [
    { command: 'node scripts/ci/start-backend.cjs', url: 'http://127.0.0.1:3023/health', timeout: 90000, reuseExistingServer: false },
    { command: 'node node_modules/@angular/cli/bin/ng.js serve --configuration e2e --host 127.0.0.1 --port 4300',
      url: 'http://127.0.0.1:4300/login', timeout: 120000, reuseExistingServer: false },
  ],
});
