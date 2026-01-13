import { defineConfig } from '@playwright/test';

export default defineConfig({
  testDir: './tests',
  use: {
    headless: true,
    acceptDownloads: true,
    viewport: { width: 1280, height: 720 },
  },
  reporter: [['html', { outputFolder: 'playwright-report', open: 'always' }]],
});
