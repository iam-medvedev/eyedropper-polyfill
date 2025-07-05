import { defineConfig } from 'vitest/config';

export default defineConfig({
  test: {
    projects: [
      {
        test: {
          include: ['**/*.unit.test.ts'],
          name: 'unit',
          environment: 'happy-dom',
          clearMocks: true,
          mockReset: true,
          restoreMocks: true,
        },
      },
      {
        test: {
          include: ['**/*.browser.test.ts'],
          name: 'browser',
          browser: {
            enabled: true,
            headless: true,
            provider: 'playwright',
            instances: [{ browser: 'chromium' }, { browser: 'webkit' }],
          },
          clearMocks: true,
          mockReset: true,
          restoreMocks: true,
        },
      },
    ],
  },
});
