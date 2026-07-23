import { defineConfig } from 'vitest/config';

export default defineConfig({
  test: {
    environment: 'jsdom',
    include: ['assets/tests/**/*.test.js'],
    restoreMocks: true,
  },
});
