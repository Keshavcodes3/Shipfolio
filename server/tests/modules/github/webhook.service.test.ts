import { describe, it, expect, vi, beforeEach } from "vitest";
import { webhookService } from "../../../src/modules/github/service/webhook.service.js";
import { prisma } from "../../../src/config/database.js";
import { activityRepository } from "../../../src/modules/activity/repository/activity.repository.js";
import { githubRepository } from "../../../src/modules/github/repository/github.repository.js";

vi.mock("../../../src/modules/activity/repository/activity.repository.js", () => ({
  activityRepository: {
    create: vi.fn(),
    findOrCreateByExternalId: vi.fn(),
    findMany: vi.fn(),
    findById: vi.fn(),
    findByProjectId: vi.fn(),
    findByGithubRepoId: vi.fn(),
  },
}));

vi.mock("../../../src/modules/github/repository/github.repository.js", () => ({
  githubRepository: {
    findRepositoryByGithubRepoId: vi.fn(),
    findAccountByUserId: vi.fn(),
    findAccountByGithubUserId: vi.fn(),
    createAccount: vi.fn(),
    updateAccount: vi.fn(),
    upsertAccount: vi.fn(),
    deleteAccount: vi.fn(),
    findRepositoriesByAccountId: vi.fn(),
    findRepositoriesByUserId: vi.fn(),
    findRepoByIdForUser: vi.fn(),
    connectRepoToProject: vi.fn(),
    disconnectProjectGithub: vi.fn(),
    syncRepositories: vi.fn(),
    countByAccount: vi.fn(),
  },
}));

const mockPrisma = vi.mocked(prisma);
const mockActivityRepo = vi.mocked(activityRepository);
const mockGithubRepo = vi.mocked(githubRepository);

const DELIVERY_ID = "delivery-abc-123";

const REPO_ID = 12345;
const PROJECT_ID = "project-uuid-001";
const GITHUB_REPO_ID = "github-repo-uuid-001";

const REPO_CONNECTION = { projectId: PROJECT_ID, githubRepoId: GITHUB_REPO_ID };

const pushPayload = {
  ref: "refs/heads/main",
  after: "abc123",
  repository: { id: REPO_ID, full_name: "user/repo" },
  commits: [
    {
      id: "commit1",
      message: "feat: add login page",
      author: { name: "dev", email: "dev@test.com", username: "devuser" },
      url: "https://github.com/user/repo/commit/commit1",
      timestamp: "2024-01-15T10:00:00Z",
    },
  ],
};

const prPayload = {
  action: "opened",
  pull_request: {
    number: 42,
    title: "Add feature X",
    html_url: "https://github.com/user/repo/pull/42",
    user: { login: "dev" },
    created_at: "2024-01-15T10:00:00Z",
  },
  repository: { id: REPO_ID },
};

const releasePayload = {
  action: "published",
  release: {
    tag_name: "v1.0.0",
    name: "Release 1.0.0",
    html_url: "https://github.com/user/repo/releases/tag/v1.0.0",
    body: "Initial release",
    created_at: "2024-01-15T10:00:00Z",
  },
  repository: { id: REPO_ID },
};

const issuesPayload = {
  action: "opened",
  issue: {
    number: 1,
    title: "Bug: crash on startup",
    html_url: "https://github.com/user/repo/issues/1",
    user: { login: "user1" },
    created_at: "2024-01-15T10:00:00Z",
  },
  repository: { id: REPO_ID },
};

const starPayload = {
  action: "created",
  star: { starred_at: "2024-01-15T10:00:00Z" },
  sender: { login: "stargazer" },
  repository: { id: REPO_ID },
};

const unstarPayload = {
  action: "deleted",
  star: null,
  sender: { login: "stargazer" },
  repository: { id: REPO_ID },
};

const forkPayload = {
  forkee: {
    full_name: "other/repo",
    html_url: "https://github.com/other/repo",
  },
  repository: { id: REPO_ID },
};

function setupRepoConnection() {
  mockGithubRepo.findRepositoryByGithubRepoId.mockResolvedValue({
    id: GITHUB_REPO_ID,
  } as any);
  (mockPrisma.project.findFirst as ReturnType<typeof vi.fn>).mockResolvedValue({ id: PROJECT_ID } as any);
}

function setupActivityUpsert() {
  mockActivityRepo.findOrCreateByExternalId.mockResolvedValue({
    id: "activity-001",
    title: "test",
    description: null,
    url: null,
    actorUsername: null,
    occurredAt: new Date(),
  } as any);
}

describe("webhookService", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  // =========================================================================
  // processWebhook – push
  // =========================================================================

  describe("processWebhook – push", () => {
    it("processes push event and creates activity", async () => {
      setupRepoConnection();
      setupActivityUpsert();

      const result = await webhookService.processWebhook("push", DELIVERY_ID, pushPayload);

      expect(result).toEqual({ processed: true });
      expect(mockActivityRepo.findOrCreateByExternalId).toHaveBeenCalledWith(
        "COMMIT",
        `${DELIVERY_ID}-commit1`,
        expect.objectContaining({
          title: "feat: add login page",
        }),
      );
    });

    it("returns no_connected_project when repo is not linked", async () => {
      mockGithubRepo.findRepositoryByGithubRepoId.mockResolvedValue(null);

      const result = await webhookService.processWebhook("push", DELIVERY_ID, pushPayload);

      expect(result).toEqual({ processed: false, reason: "no_connected_project" });
      expect(mockActivityRepo.findOrCreateByExternalId).not.toHaveBeenCalled();
    });

    it("returns no_commits when push has no commits", async () => {
      setupRepoConnection();
      const emptyPayload = { ...pushPayload, commits: [] };

      const result = await webhookService.processWebhook("push", DELIVERY_ID, emptyPayload);

      expect(result).toEqual({ processed: false, reason: "no_commits" });
    });

    it("handles duplicate commits idempotently via upsert", async () => {
      setupRepoConnection();
      setupActivityUpsert();

      const result = await webhookService.processWebhook("push", DELIVERY_ID, pushPayload);

      expect(result).toEqual({ processed: true });
      // upsert is called — duplicate is handled by the DB constraint, not skipped
      expect(mockActivityRepo.findOrCreateByExternalId).toHaveBeenCalledTimes(1);
    });

    it("returns missing_repository when repository id is absent", async () => {
      const payload = { ...pushPayload, repository: undefined };

      const result = await webhookService.processWebhook("push", DELIVERY_ID, payload);

      expect(result).toEqual({ processed: false, reason: "missing_repository" });
    });
  });

  // =========================================================================
  // processWebhook – pull_request
  // =========================================================================

  describe("processWebhook – pull_request", () => {
    it("processes pull_request event and creates activity", async () => {
      setupRepoConnection();
      setupActivityUpsert();

      const result = await webhookService.processWebhook("pull_request", DELIVERY_ID, prPayload);

      expect(result).toEqual({ processed: true });
      expect(mockActivityRepo.findOrCreateByExternalId).toHaveBeenCalledWith(
        "PULL_REQUEST",
        DELIVERY_ID,
        expect.objectContaining({
          title: "opened PR #42: Add feature X",
        }),
      );
    });

    it("handles duplicate delivery idempotently via upsert", async () => {
      setupRepoConnection();
      setupActivityUpsert();

      // Process twice — upsert handles dedup
      await webhookService.processWebhook("pull_request", DELIVERY_ID, prPayload);
      await webhookService.processWebhook("pull_request", DELIVERY_ID, prPayload);

      expect(mockActivityRepo.findOrCreateByExternalId).toHaveBeenCalledTimes(2);
    });
  });

  // =========================================================================
  // processWebhook – release
  // =========================================================================

  describe("processWebhook – release", () => {
    it("processes release event and creates activity", async () => {
      setupRepoConnection();
      setupActivityUpsert();

      const result = await webhookService.processWebhook("release", DELIVERY_ID, releasePayload);

      expect(result).toEqual({ processed: true });
      expect(mockActivityRepo.findOrCreateByExternalId).toHaveBeenCalledWith(
        "RELEASE",
        DELIVERY_ID,
        expect.objectContaining({
          title: "published release v1.0.0: Release 1.0.0",
        }),
      );
    });
  });

  // =========================================================================
  // processWebhook – issues
  // =========================================================================

  describe("processWebhook – issues", () => {
    it("processes issues event and creates activity", async () => {
      setupRepoConnection();
      setupActivityUpsert();

      const result = await webhookService.processWebhook("issues", DELIVERY_ID, issuesPayload);

      expect(result).toEqual({ processed: true });
      expect(mockActivityRepo.findOrCreateByExternalId).toHaveBeenCalledWith(
        "ISSUE",
        DELIVERY_ID,
        expect.objectContaining({
          title: "opened issue #1: Bug: crash on startup",
        }),
      );
    });
  });

  // =========================================================================
  // processWebhook – star
  // =========================================================================

  describe("processWebhook – star", () => {
    it("processes star created event and creates activity", async () => {
      setupRepoConnection();
      setupActivityUpsert();

      const result = await webhookService.processWebhook("star", DELIVERY_ID, starPayload);

      expect(result).toEqual({ processed: true });
      expect(mockActivityRepo.findOrCreateByExternalId).toHaveBeenCalledWith(
        "STAR",
        DELIVERY_ID,
        expect.objectContaining({
          title: "Star by stargazer",
        }),
      );
    });

    it("ignores unstar (deleted) events", async () => {
      setupRepoConnection();
      setupActivityUpsert();

      const result = await webhookService.processWebhook("star", DELIVERY_ID, unstarPayload);

      expect(result).toEqual({ processed: false, reason: "ignored_action" });
      expect(mockActivityRepo.findOrCreateByExternalId).not.toHaveBeenCalled();
    });
  });

  // =========================================================================
  // processWebhook – fork
  // =========================================================================

  describe("processWebhook – fork", () => {
    it("processes fork event and creates activity", async () => {
      setupRepoConnection();
      setupActivityUpsert();

      const result = await webhookService.processWebhook("fork", DELIVERY_ID, forkPayload);

      expect(result).toEqual({ processed: true });
      expect(mockActivityRepo.findOrCreateByExternalId).toHaveBeenCalledWith(
        "FORK",
        DELIVERY_ID,
        expect.objectContaining({
          title: "Fork created: other/repo",
        }),
      );
    });
  });

  // =========================================================================
  // processWebhook – unknown repo
  // =========================================================================

  describe("processWebhook – unknown repo", () => {
    it("returns no_connected_project for unknown repository on any event", async () => {
      mockGithubRepo.findRepositoryByGithubRepoId.mockResolvedValue(null);

      const result = await webhookService.processWebhook("pull_request", DELIVERY_ID, prPayload);

      expect(result).toEqual({ processed: false, reason: "no_connected_project" });
    });
  });

  // =========================================================================
  // processWebhook – unsupported event
  // =========================================================================

  describe("processWebhook – unsupported event", () => {
    it("returns unsupported_event for unknown event type", async () => {
      const result = await webhookService.processWebhook("ping", DELIVERY_ID, {});

      expect(result).toEqual({ processed: false, reason: "unsupported_event" });
    });
  });

  // =========================================================================
  // findProjectByGithubRepoId (tested through processWebhook)
  // =========================================================================

  describe("findProjectByGithubRepoId", () => {
    it("finds connected project when repo exists", async () => {
      setupRepoConnection();
      setupActivityUpsert();

      await webhookService.processWebhook("pull_request", DELIVERY_ID, prPayload);

      expect(mockGithubRepo.findRepositoryByGithubRepoId).toHaveBeenCalledWith(String(REPO_ID));
      expect(mockPrisma.project.findFirst).toHaveBeenCalledWith({
        where: { githubRepoId: GITHUB_REPO_ID },
        select: { id: true },
      });
    });

    it("returns null for unknown repo", async () => {
      mockGithubRepo.findRepositoryByGithubRepoId.mockResolvedValue(null);

      const result = await webhookService.processWebhook("push", DELIVERY_ID, pushPayload);

      expect(result).toEqual({ processed: false, reason: "no_connected_project" });
      expect(mockPrisma.project.findFirst).not.toHaveBeenCalled();
    });
  });

  // =========================================================================
  // processWebhook – processing_error
  // =========================================================================

  describe("processWebhook – processing_error", () => {
    it("returns processing_error when handler throws", async () => {
      mockGithubRepo.findRepositoryByGithubRepoId.mockRejectedValue(new Error("DB failure"));

      const result = await webhookService.processWebhook("push", DELIVERY_ID, pushPayload);

      expect(result).toEqual({ processed: false, reason: "processing_error" });
    });
  });
});
