import { defineConfig } from 'vitest/config';

export default defineConfig({
  test: {
    globals: true,
    watchExclude: ['**/config.json'],
    coverage: {
      provider: 'v8',
    },
  },
});
