import { defineConfig } from "vitest/config";
import path from "node:path";

export default defineConfig({
  test: {
    globals: true,
    environment: "node",
    include: ["tests/**/*.test.ts"],
    setupFiles: ["tests/setup.ts"],
    env: {
      DATABASE_URL: "postgresql://user:password@localhost:5432/shipfolio_test?schema=public",
      REDIS_URL: "redis://localhost:6379",
      JWT_SECRET: "test-secret-key-for-testing-min-32-chars!!",
      JWT_EXPIRES_IN: "1h",
      JWT_REFRESH_SECRET: "test-refresh-secret-min-32-chars!!",
      JWT_REFRESH_EXPIRES_IN: "30d",
      GITHUB_STATE_SECRET: "test-github-oauth-state-secret-min32!!",
      TOKEN_ENCRYPTION_KEY: "test-token-encryption-key-32chars!!",
      NODE_ENV: "test",
    },
    coverage: {
      provider: "v8",
      include: ["src/modules/auth/**/*.ts"],
    },
  },
  resolve: {
    alias: {
      "@": path.resolve(import.meta.dirname, "src"),
    },
  },
});
