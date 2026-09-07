import { vi } from "vitest";
import path from "node:path";

// Load test env
import dotenv from "dotenv";
dotenv.config({ path: path.resolve(import.meta.dirname, ".env") });

// Mock prisma before any imports that depend on it
vi.mock("../src/config/database.js", () => ({
  prisma: {
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
      deleteMany: vi.fn(),
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
      findUnique: vi.fn(),
      findMany: vi.fn(),
      count: vi.fn(),
      groupBy: vi.fn(),
      upsert: vi.fn(),
      create: vi.fn(),
      update: vi.fn(),
      updateMany: vi.fn(),
      delete: vi.fn(),
      deleteMany: vi.fn(),
    },
    technology: {
      findUnique: vi.fn(),
      findMany: vi.fn(),
      count: vi.fn(),
    },
    $transaction: vi.fn(),
  },
}));

vi.mock("../src/infrastructure/github/github.client.js", () => ({
  githubClient: {
    exchangeCodeForToken: vi.fn(),
    getAuthenticatedUser: vi.fn(),
    getUserRepos: vi.fn(),
    getAllUserRepos: vi.fn(),
    getRepo: vi.fn(),
    request: vi.fn(),
    authenticatedRequest: vi.fn(),
    getRateLimit: vi.fn(),
  },
}));

vi.mock("../src/shared/events/eventBus.js", () => ({
  emitEvent: vi.fn(),
  eventBus: { on: vi.fn(), emit: vi.fn() },
}));

vi.mock("../src/infrastructure/queue/queues/activity.queue.js", () => ({
  enqueueActivity: vi.fn(),
}));
