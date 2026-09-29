import { defineConfig } from 'vitest/config';

// The first test runner in this monorepo, kept deliberately small. It covers
// this package only — pure schema and helper logic, no DOM — so it needs no
// jsdom, no React testing library, and no per-app configuration.
export default defineConfig({
  test: {
    environment: 'node',
    include: ['src/**/*.spec.ts'],
  },
});
