import { defineConfig } from 'vitest/config';

export default defineConfig({
  test: {
    coverage: {
      exclude: ['assets/dist/**', 'assets/tests/**'],
      include: ['assets/src/**'],
      provider: 'v8',
      reporter: ['text', 'cobertura'],
      reportsDirectory: 'coverage/javascript',
    },
    environment: 'jsdom',
    include: ['assets/tests/**/*.test.js'],
    restoreMocks: true,
  },
});
