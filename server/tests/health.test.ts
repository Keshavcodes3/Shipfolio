import { describe, it, expect, vi, beforeEach } from "vitest";
import request from "supertest";

vi.mock("../src/config/database.js", () => ({
  prisma: {
    $queryRaw: vi.fn(),
    user: {
      findUnique: vi.fn(),
      findFirst: vi.fn(),
      findMany: vi.fn(),
      count: vi.fn(),
      create: vi.fn(),
      update: vi.fn(),
      updateMany: vi.fn(),
      delete: vi.fn(),
      deleteMany: vi.fn(),
    },
    session: {
      findUnique: vi.fn(),
      findMany: vi.fn(),
      create: vi.fn(),
      delete: vi.fn(),
      deleteMany: vi.fn(),
    },
    follow: {
      findUnique: vi.fn(),
      findMany: vi.fn(),
      count: vi.fn(),
      create: vi.fn(),
      delete: vi.fn(),
    },
    githubAccount: {
      findUnique: vi.fn(),
      findFirst: vi.fn(),
      upsert: vi.fn(),
      create: vi.fn(),
      update: vi.fn(),
      delete: vi.fn(),
    },
    githubRepository: {
      findUnique: vi.fn(),
      findFirst: vi.fn(),
      findMany: vi.fn(),
      upsert: vi.fn(),
      create: vi.fn(),
      update: vi.fn(),
      delete: vi.fn(),
      deleteMany: vi.fn(),
      count: vi.fn(),
    },
    project: {
      findUnique: vi.fn(),
      findFirst: vi.fn(),
      findMany: vi.fn(),
      count: vi.fn(),
      create: vi.fn(),
      update: vi.fn(),
      updateMany: vi.fn(),
      delete: vi.fn(),
      deleteMany: vi.fn(),
      groupBy: vi.fn(),
    },
    projectTechnology: {
      findMany: vi.fn(),
      deleteMany: vi.fn(),
      groupBy: vi.fn(),
    },
    projectActivity: {
      findMany: vi.fn(),
      findUnique: vi.fn(),
      count: vi.fn(),
      groupBy: vi.fn(),
    },
    technology: {
      findUnique: vi.fn(),
      findMany: vi.fn(),
      count: vi.fn(),
    },
    $transaction: vi.fn(),
  },
}));

vi.mock("../src/config/redis.js", () => ({
  redis: {
    status: "ready",
    ping: vi.fn().mockResolvedValue("PONG"),
    get: vi.fn(),
    set: vi.fn(),
    setex: vi.fn(),
    del: vi.fn(),
    keys: vi.fn(),
    connect: vi.fn(),
    disconnect: vi.fn(),
  },
}));

vi.mock("../src/config/env.js", () => ({
  env: {
    NODE_ENV: "test",
    PORT: 4000,
    API_PREFIX: "/api/v1",
    DATABASE_URL: "postgresql://test:test@localhost:5432/test",
    REDIS_URL: "redis://localhost:6379",
    JWT_SECRET: "test-secret",
    JWT_EXPIRES_IN: "1h",
    JWT_REFRESH_SECRET: "test-refresh",
    JWT_REFRESH_EXPIRES_IN: "30d",
    GITHUB_CLIENT_ID: "test-client-id",
    GITHUB_CLIENT_SECRET: "test-client-secret",
    GITHUB_CALLBACK_URL: "http://localhost:4000/github/callback",
    GITHUB_WEBHOOK_SECRET: "test-webhook-secret",
    GITHUB_STATE_SECRET: "test-state",
    GITHUB_TOKEN: "",
    TOKEN_ENCRYPTION_KEY: "test-encryption-key-32bytes-long!!",
    CORS_ORIGIN: "http://localhost:3000",
    RATE_LIMIT_WINDOW_MS: 900000,
    RATE_LIMIT_MAX: 100,
  },
}));

import { createApp } from "../src/app.js";
import { prisma } from "../src/config/database.js";
import { redis } from "../src/config/redis.js";

const mockPrisma = vi.mocked(prisma);
const mockRedis = vi.mocked(redis);

const app = createApp();

describe("Health endpoints", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    (mockRedis as any).status = "ready";
  });

  describe("GET /health", () => {
    it("returns success with uptime", async () => {
      const res = await request(app).get("/health");

      expect(res.status).toBe(200);
      expect(res.body.success).toBe(true);
      expect(res.body.message).toBe("ShipFolio API is running");
      expect(res.body.uptime).toBeGreaterThan(0);
    });
  });

  describe("GET /api/v1/health", () => {
    it("returns success", async () => {
      const res = await request(app).get("/api/v1/health");

      expect(res.status).toBe(200);
      expect(res.body.success).toBe(true);
      expect(res.body.message).toBe("ShipFolio API is running");
    });
  });

  describe("GET /api/v1/ready", () => {
    it("returns 200 when all checks pass", async () => {
      mockPrisma.$queryRaw.mockResolvedValue([{ "?column?": 1 }]);
      mockRedis.ping.mockResolvedValue("PONG");

      const res = await request(app).get("/api/v1/ready");

      expect(res.status).toBe(200);
      expect(res.body.success).toBe(true);
      expect(res.body.checks.database).toBe("ok");
      expect(res.body.checks.redis).toBe("ok");
    });

    it("returns 503 when database is down", async () => {
      mockPrisma.$queryRaw.mockRejectedValue(new Error("DB connection failed"));
      mockRedis.ping.mockResolvedValue("PONG");

      const res = await request(app).get("/api/v1/ready");

      expect(res.status).toBe(503);
      expect(res.body.success).toBe(false);
      expect(res.body.checks.database).toBe("down");
      expect(res.body.checks.redis).toBe("ok");
    });

    it("returns 503 when redis is down", async () => {
      mockPrisma.$queryRaw.mockResolvedValue([{ "?column?": 1 }]);
      (mockRedis as any).status = "disconnected";

      const res = await request(app).get("/api/v1/ready");

      expect(res.status).toBe(503);
      expect(res.body.success).toBe(false);
      expect(res.body.checks.redis).toBe("down");
    });

    it("returns 503 when both checks fail", async () => {
      mockPrisma.$queryRaw.mockRejectedValue(new Error("DB error"));
      (mockRedis as any).status = "disconnected";

      const res = await request(app).get("/api/v1/ready");

      expect(res.status).toBe(503);
      expect(res.body.success).toBe(false);
      expect(res.body.checks.database).toBe("down");
      expect(res.body.checks.redis).toBe("down");
    });

    it("returns redis down when ping throws", async () => {
      mockPrisma.$queryRaw.mockResolvedValue([{ "?column?": 1 }]);
      mockRedis.ping.mockRejectedValue(new Error("Redis error"));

      const res = await request(app).get("/api/v1/ready");

      expect(res.status).toBe(503);
      expect(res.body.checks.redis).toBe("down");
    });
  });
});
