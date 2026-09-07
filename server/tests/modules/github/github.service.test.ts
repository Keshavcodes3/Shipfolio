import { describe, it, expect, vi, beforeEach } from "vitest";
import { githubService } from "../../../src/modules/github/service/github.service.js";
import { githubRepository } from "../../../src/modules/github/repository/github.repository.js";
import { githubClient } from "../../../src/infrastructure/github/github.client.js";
import { validateOAuthState, generateOAuthState } from "../../../src/modules/github/utils/csrf.js";
import { authRepository } from "../../../src/modules/auth/repository/auth.repository.js";

vi.mock("../../../src/modules/github/repository/github.repository.js", () => ({
  githubRepository: {
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

vi.mock("../../../src/modules/auth/repository/auth.repository.js", () => ({
  authRepository: {
    findById: vi.fn(),
    findByEmail: vi.fn(),
    findByUsername: vi.fn(),
    create: vi.fn(),
  },
}));

vi.mock("../../../src/modules/github/utils/csrf.js", () => ({
  generateOAuthState: vi.fn(),
  validateOAuthState: vi.fn(),
}));

vi.mock("../../../src/modules/github/utils/token-encryption.js", () => ({
  encryptToken: vi.fn((v: string) => `enc:${v}`),
  decryptToken: vi.fn((v: string) => v.replace(/^enc:/, "")),
  isEncryptedToken: vi.fn((v: string) => typeof v === "string" && v.startsWith("enc:")),
}));

vi.mock("../../../src/infrastructure/github/normalizer.js", () => ({
  normalizeGithubRepos: vi.fn((repos: any[]) =>
    repos.map((r: any) => ({
      githubRepoId: String(r.id),
      name: r.name,
      fullName: r.full_name,
      description: r.description,
      url: r.html_url,
      htmlUrl: r.html_url,
      primaryLanguage: r.language,
      stars: r.stargazers_count ?? 0,
      forks: r.forks_count ?? 0,
      openIssues: r.open_issues_count ?? 0,
      isPrivate: r.private ?? false,
      isArchived: r.archived ?? false,
      isFork: r.fork ?? false,
      pushedAt: r.pushed_at ? new Date(r.pushed_at) : null,
    })),
  ),
}));

const mockRepo = vi.mocked(githubRepository);
const mockClient = vi.mocked(githubClient);
const mockValidateState = vi.mocked(validateOAuthState);
const mockAuthRepo = vi.mocked(authRepository);

const makeGithubUser = (overrides = {}) => ({
  id: 12345,
  login: "testuser",
  avatar_url: "https://avatars.githubusercontent.com/u/12345",
  name: "Test User",
  email: "test@github.com",
  bio: null,
  ...overrides,
});

const makeAccount = (overrides = {}) => ({
  id: "acc-1",
  userId: "user-1",
  githubUserId: "12345",
  username: "testuser",
  avatarUrl: "https://avatars.githubusercontent.com/u/12345",
  accessToken: "gh-token-123",
  refreshToken: null,
  tokenExpiresAt: null,
  connectedAt: new Date(),
  updatedAt: new Date(),
  ...overrides,
});

const makeUser = (overrides = {}) => ({
  id: "user-1",
  email: "test@github.com",
  username: "testuser",
  password: null,
  name: "Test User",
  avatarUrl: "https://avatars.githubusercontent.com/u/12345",
  bio: null,
  location: null,
  websiteUrl: null,
  createdAt: new Date(),
  updatedAt: new Date(),
  ...overrides,
});

describe("githubService", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  // =========================================================================
  // initiateOAuth
  // =========================================================================

  describe("initiateOAuth", () => {
    it("returns a GitHub authorization URL and state", () => {
      vi.mocked(generateOAuthState).mockReturnValue("test-state");

      const result = githubService.initiateOAuth();

      expect(result.url).toContain("github.com/login/oauth/authorize");
      expect(result.url).toContain("client_id=");
      expect(result.state).toBe("test-state");
    });

    it("includes redirect in the state when provided", () => {
      vi.mocked(generateOAuthState).mockReturnValue("state-with-redirect");

      const result = githubService.initiateOAuth("/dashboard");

      expect(generateOAuthState).toHaveBeenCalledWith("/dashboard");
      expect(result.state).toBe("state-with-redirect");
    });
  });

  // =========================================================================
  // handleOAuthCallback
  // =========================================================================

  describe("handleOAuthCallback", () => {
    it("throws for invalid state", async () => {
      mockValidateState.mockImplementation(() => {
        throw new Error("Invalid state");
      });

      await expect(
        githubService.handleOAuthCallback("code-123", "bad-state"),
      ).rejects.toThrow();
    });

    it("exchanges code for token and returns account", async () => {
      mockValidateState.mockReturnValue({ nonce: "n", timestamp: Date.now() });
      mockClient.exchangeCodeForToken.mockResolvedValue({
        access_token: "gh-access-token",
        scope: "read:user",
        token_type: "bearer",
      });
      mockClient.getAuthenticatedUser.mockResolvedValue(makeGithubUser());
      mockRepo.findAccountByGithubUserId.mockResolvedValue(null);
      mockAuthRepo.findByEmail.mockResolvedValue(null);
      mockAuthRepo.create.mockResolvedValue(makeUser() as any);
      mockRepo.upsertAccount.mockResolvedValue(makeAccount() as any);
      mockRepo.findAccountByUserId.mockResolvedValue(makeAccount() as any);

      const result = await githubService.handleOAuthCallback("code-abc", "state-xyz");

      expect(mockClient.exchangeCodeForToken).toHaveBeenCalledWith("code-abc");
      expect(mockClient.getAuthenticatedUser).toHaveBeenCalledWith("gh-access-token");
      expect(mockRepo.upsertAccount).toHaveBeenCalled();
      expect(result.user).toBeDefined();
    });

    it("throws UnauthorizedError when token exchange fails", async () => {
      mockValidateState.mockReturnValue({ nonce: "n", timestamp: Date.now() });
      mockClient.exchangeCodeForToken.mockResolvedValue({
        access_token: "",
        scope: "",
        token_type: "",
      });

      await expect(
        githubService.handleOAuthCallback("code-abc", "state-xyz"),
      ).rejects.toMatchObject({ statusCode: 401 });
    });

    it("creates a new user when no existing match is found", async () => {
      mockValidateState.mockReturnValue({ nonce: "n", timestamp: Date.now() });
      mockClient.exchangeCodeForToken.mockResolvedValue({
        access_token: "gh-token",
        scope: "read:user",
        token_type: "bearer",
      });
      mockClient.getAuthenticatedUser.mockResolvedValue(makeGithubUser());
      mockRepo.findAccountByGithubUserId.mockResolvedValue(null);
      mockAuthRepo.findByEmail.mockResolvedValue(null);
      mockAuthRepo.create.mockResolvedValue(makeUser() as any);
      mockRepo.upsertAccount.mockResolvedValue(makeAccount() as any);
      mockRepo.findAccountByUserId.mockResolvedValue(makeAccount() as any);

      const result = await githubService.handleOAuthCallback("code-abc", "state-xyz");

      expect(mockAuthRepo.create).toHaveBeenCalled();
      expect(result.isNewUser).toBe(true);
    });

    it("links to existing user when email matches", async () => {
      mockValidateState.mockReturnValue({ nonce: "n", timestamp: Date.now() });
      mockClient.exchangeCodeForToken.mockResolvedValue({
        access_token: "gh-token",
        scope: "read:user",
        token_type: "bearer",
      });
      mockClient.getAuthenticatedUser.mockResolvedValue(makeGithubUser());
      mockRepo.findAccountByGithubUserId.mockResolvedValue(null);
      mockAuthRepo.findByEmail.mockResolvedValue(makeUser({ id: "existing-user" }) as any);
      mockRepo.upsertAccount.mockResolvedValue(makeAccount({ userId: "existing-user" }) as any);
      mockRepo.findAccountByUserId.mockResolvedValue(makeAccount({ userId: "existing-user" }) as any);

      const result = await githubService.handleOAuthCallback("code-abc", "state-xyz");

      expect(mockAuthRepo.create).not.toHaveBeenCalled();
      expect(result.isNewUser).toBe(false);
    });

    it("returns existing user when GitHub account already exists", async () => {
      mockValidateState.mockReturnValue({ nonce: "n", timestamp: Date.now() });
      mockClient.exchangeCodeForToken.mockResolvedValue({
        access_token: "gh-token",
        scope: "read:user",
        token_type: "bearer",
      });
      mockClient.getAuthenticatedUser.mockResolvedValue(makeGithubUser());
      mockRepo.findAccountByGithubUserId.mockResolvedValue(makeAccount() as any);
      mockAuthRepo.findById.mockResolvedValue(makeUser() as any);
      mockRepo.upsertAccount.mockResolvedValue(makeAccount() as any);
      mockRepo.findAccountByUserId.mockResolvedValue(makeAccount() as any);

      const result = await githubService.handleOAuthCallback("code-abc", "state-xyz");

      expect(mockAuthRepo.create).not.toHaveBeenCalled();
      expect(result.isNewUser).toBe(false);
    });
  });

  // =========================================================================
  // linkAccount
  // =========================================================================

  describe("linkAccount", () => {
    it("links a GitHub account to an authenticated user", async () => {
      mockRepo.findAccountByUserId.mockResolvedValue(null);
      mockClient.exchangeCodeForToken.mockResolvedValue({
        access_token: "gh-token",
        scope: "read:user",
        token_type: "bearer",
      });
      mockClient.getAuthenticatedUser.mockResolvedValue(makeGithubUser());
      mockRepo.findAccountByGithubUserId.mockResolvedValue(null);
      mockRepo.createAccount.mockResolvedValue(makeAccount() as any);

      const result = await githubService.linkAccount("user-1", "code-xyz");

      expect(mockRepo.createAccount).toHaveBeenCalled();
      expect(result.username).toBe("testuser");
    });

    it("throws ConflictError when account already linked", async () => {
      mockRepo.findAccountByUserId.mockResolvedValue(makeAccount() as any);

      await expect(
        githubService.linkAccount("user-1", "code-xyz"),
      ).rejects.toMatchObject({ statusCode: 409 });
    });

    it("throws ConflictError when GitHub account linked to another user", async () => {
      mockRepo.findAccountByUserId.mockResolvedValue(null);
      mockClient.exchangeCodeForToken.mockResolvedValue({
        access_token: "gh-token",
        scope: "read:user",
        token_type: "bearer",
      });
      mockClient.getAuthenticatedUser.mockResolvedValue(makeGithubUser());
      mockRepo.findAccountByGithubUserId.mockResolvedValue(
        makeAccount({ userId: "other-user" }) as any,
      );

      await expect(
        githubService.linkAccount("user-1", "code-xyz"),
      ).rejects.toMatchObject({ statusCode: 409 });
    });

    it("throws UnauthorizedError when token exchange fails", async () => {
      mockRepo.findAccountByUserId.mockResolvedValue(null);
      mockClient.exchangeCodeForToken.mockResolvedValue({
        access_token: "",
        scope: "",
        token_type: "",
      });

      await expect(
        githubService.linkAccount("user-1", "code-xyz"),
      ).rejects.toMatchObject({ statusCode: 401 });
    });
  });

  // =========================================================================
  // unlinkAccount
  // =========================================================================

  describe("unlinkAccount", () => {
    it("unlinks a GitHub account", async () => {
      mockRepo.findAccountByUserId.mockResolvedValue(makeAccount() as any);
      mockRepo.deleteAccount.mockResolvedValue(undefined as any);

      const result = await githubService.unlinkAccount("user-1");

      expect(mockRepo.deleteAccount).toHaveBeenCalledWith("user-1");
      expect(result.message).toContain("unlinked");
    });

    it("throws NotFoundError when no account linked", async () => {
      mockRepo.findAccountByUserId.mockResolvedValue(null);

      await expect(
        githubService.unlinkAccount("user-1"),
      ).rejects.toMatchObject({ statusCode: 404 });
    });
  });

  // =========================================================================
  // getLinkedAccount
  // =========================================================================

  describe("getLinkedAccount", () => {
    it("returns the linked account", async () => {
      mockRepo.findAccountByUserId.mockResolvedValue(makeAccount() as any);

      const result = await githubService.getLinkedAccount("user-1");

      expect(result.username).toBe("testuser");
      expect(result).not.toHaveProperty("accessToken");
    });

    it("throws NotFoundError when no account linked", async () => {
      mockRepo.findAccountByUserId.mockResolvedValue(null);

      await expect(
        githubService.getLinkedAccount("user-1"),
      ).rejects.toMatchObject({ statusCode: 404 });
    });
  });

  // =========================================================================
  // syncRepositories
  // =========================================================================

  describe("syncRepositories", () => {
    it("syncs repositories from GitHub", async () => {
      mockRepo.findAccountByUserId.mockResolvedValue(makeAccount() as any);
      mockClient.getAuthenticatedUser.mockResolvedValue(makeGithubUser());
      mockClient.getAllUserRepos.mockResolvedValue([
        {
          id: 1,
          name: "repo-1",
          full_name: "testuser/repo-1",
          description: "A test repo",
          html_url: "https://github.com/testuser/repo-1",
          language: "TypeScript",
          stargazers_count: 10,
          forks_count: 2,
          open_issues_count: 0,
          private: false,
          archived: false,
          fork: false,
          pushed_at: "2024-01-01T00:00:00Z",
        },
      ]);
      mockRepo.syncRepositories.mockResolvedValue({
        results: [{}],
        deletedCount: 0,
      });

      const result = await githubService.syncRepositories("user-1");

      expect(result.syncedCount).toBe(1);
      expect(result.removedCount).toBe(0);
      expect(mockClient.getAllUserRepos).toHaveBeenCalledWith("gh-token-123");
    });

    it("throws NotFoundError when no account linked", async () => {
      mockRepo.findAccountByUserId.mockResolvedValue(null);

      await expect(
        githubService.syncRepositories("user-1"),
      ).rejects.toMatchObject({ statusCode: 404 });
    });

    it("throws UnauthorizedError when no access token", async () => {
      mockRepo.findAccountByUserId.mockResolvedValue(
        makeAccount({ accessToken: null }) as any,
      );

      await expect(
        githubService.syncRepositories("user-1"),
      ).rejects.toMatchObject({ statusCode: 401 });
    });

    it("handles auth error from GitHub API (token revoked)", async () => {
      const { GithubAuthError } = await import("../../../src/infrastructure/github/github-errors.js");
      mockRepo.findAccountByUserId.mockResolvedValue(makeAccount() as any);
      mockClient.getAuthenticatedUser.mockRejectedValue(new GithubAuthError());

      await expect(
        githubService.syncRepositories("user-1"),
      ).rejects.toMatchObject({ statusCode: 401 });
    });

    it("handles rate limit error from GitHub API", async () => {
      const { GithubRateLimitError } = await import("../../../src/infrastructure/github/github-errors.js");
      mockRepo.findAccountByUserId.mockResolvedValue(makeAccount() as any);
      mockClient.getAuthenticatedUser.mockResolvedValue(makeGithubUser());
      mockClient.getAllUserRepos.mockRejectedValue(new GithubRateLimitError());

      await expect(
        githubService.syncRepositories("user-1"),
      ).rejects.toMatchObject({ statusCode: 400 });
    });
  });

  // =========================================================================
  // isAccountLinked
  // =========================================================================

  describe("isAccountLinked", () => {
    it("returns true when account exists", async () => {
      mockRepo.findAccountByUserId.mockResolvedValue(makeAccount() as any);

      const result = await githubService.isAccountLinked("user-1");

      expect(result).toBe(true);
    });

    it("returns false when no account exists", async () => {
      mockRepo.findAccountByUserId.mockResolvedValue(null);

      const result = await githubService.isAccountLinked("user-1");

      expect(result).toBe(false);
    });
  });

  // =========================================================================
  // getRepositories
  // =========================================================================

  describe("getRepositories", () => {
    it("returns repositories with projectId", async () => {
      mockRepo.findAccountByUserId.mockResolvedValue(makeAccount() as any);
      mockRepo.findRepositoriesByAccountId.mockResolvedValue([
        {
          id: "repo-1",
          githubAccountId: "acc-1",
          githubRepoId: "12345",
          name: "my-repo",
          fullName: "testuser/my-repo",
          description: null,
          url: "https://api.github.com/repos/testuser/my-repo",
          htmlUrl: "https://github.com/testuser/my-repo",
          primaryLanguage: "TypeScript",
          stars: 5,
          forks: 1,
          openIssues: 0,
          isPrivate: false,
          isArchived: false,
          isFork: false,
          pushedAt: null,
          lastSyncedAt: new Date(),
          project: { id: "proj-1", name: "My Project", slug: "my-project" },
        },
      ]);

      const result = await githubService.getRepositories("user-1");

      expect(result).toHaveLength(1);
      expect(result[0].projectId).toBe("proj-1");
    });

    it("filters by projectId", async () => {
      mockRepo.findAccountByUserId.mockResolvedValue(makeAccount() as any);
      mockRepo.findRepositoriesByAccountId.mockResolvedValue([
        {
          id: "repo-1",
          githubAccountId: "acc-1",
          githubRepoId: "12345",
          name: "my-repo",
          fullName: "testuser/my-repo",
          description: null,
          url: "https://api.github.com/repos/testuser/my-repo",
          htmlUrl: "https://github.com/testuser/my-repo",
          primaryLanguage: null,
          stars: 0,
          forks: 0,
          openIssues: 0,
          isPrivate: false,
          isArchived: false,
          isFork: false,
          pushedAt: null,
          lastSyncedAt: new Date(),
          project: { id: "proj-1", name: "My Project", slug: "my-project" },
        },
        {
          id: "repo-2",
          githubAccountId: "acc-1",
          githubRepoId: "67890",
          name: "other-repo",
          fullName: "testuser/other-repo",
          description: null,
          url: "https://api.github.com/repos/testuser/other-repo",
          htmlUrl: "https://github.com/testuser/other-repo",
          primaryLanguage: null,
          stars: 0,
          forks: 0,
          openIssues: 0,
          isPrivate: false,
          isArchived: false,
          isFork: false,
          pushedAt: null,
          lastSyncedAt: new Date(),
          project: null,
        },
      ]);

      const result = await githubService.getRepositories("user-1", "proj-1");

      expect(result).toHaveLength(1);
      expect(result[0].projectId).toBe("proj-1");
    });

    it("returns empty array when no account linked", async () => {
      mockRepo.findAccountByUserId.mockResolvedValue(null);

      await expect(
        githubService.getRepositories("user-1"),
      ).rejects.toMatchObject({ statusCode: 404 });
    });
  });

  // =========================================================================
  // getRepository
  // =========================================================================

  describe("getRepository", () => {
    it("returns a single repository", async () => {
      mockRepo.findAccountByUserId.mockResolvedValue(makeAccount() as any);
      mockRepo.findRepoByIdForUser.mockResolvedValue({
        id: "repo-1",
        githubAccountId: "acc-1",
        githubRepoId: "12345",
        name: "my-repo",
        fullName: "testuser/my-repo",
        description: "A repo",
        url: "https://api.github.com/repos/testuser/my-repo",
        htmlUrl: "https://github.com/testuser/my-repo",
        primaryLanguage: "TypeScript",
        stars: 10,
        forks: 3,
        openIssues: 1,
        isPrivate: false,
        isArchived: false,
        isFork: false,
        pushedAt: new Date(),
        lastSyncedAt: new Date(),
        project: null,
      } as any);

      const result = await githubService.getRepository("user-1", "repo-1");

      expect(result.name).toBe("my-repo");
      expect(result.projectId).toBeNull();
      expect(mockRepo.findRepoByIdForUser).toHaveBeenCalledWith("repo-1", "user-1");
    });

    it("throws NotFoundError when repo not found", async () => {
      mockRepo.findAccountByUserId.mockResolvedValue(makeAccount() as any);
      mockRepo.findRepoByIdForUser.mockResolvedValue(null);

      await expect(
        githubService.getRepository("user-1", "nonexistent"),
      ).rejects.toMatchObject({ statusCode: 404 });
    });

    it("throws NotFoundError when no account linked", async () => {
      mockRepo.findAccountByUserId.mockResolvedValue(null);

      await expect(
        githubService.getRepository("user-1", "repo-1"),
      ).rejects.toMatchObject({ statusCode: 404 });
    });
  });

  // =========================================================================
  // connectRepo
  // =========================================================================

  describe("connectRepo", () => {
    it("connects a repository to a project", async () => {
      mockRepo.connectRepoToProject.mockResolvedValue({
        project: {
          id: "proj-1",
          githubRepo: {
            id: "repo-1",
            name: "my-repo",
            fullName: "testuser/my-repo",
            htmlUrl: "https://github.com/testuser/my-repo",
            primaryLanguage: "TypeScript",
            stars: 10,
            forks: 3,
          },
        },
      });

      const result = await githubService.connectRepo("user-1", "repo-1", "proj-1");

      expect(result.githubRepo).toBeDefined();
      expect(result.githubRepo.id).toBe("repo-1");
      expect(mockRepo.connectRepoToProject).toHaveBeenCalledWith("repo-1", "proj-1", "user-1");
    });

    it("throws NotFoundError when repo not found", async () => {
      mockRepo.connectRepoToProject.mockResolvedValue({ error: "REPO_NOT_FOUND" });

      await expect(
        githubService.connectRepo("user-1", "nonexistent", "proj-1"),
      ).rejects.toMatchObject({ statusCode: 404 });
    });

    it("throws NotFoundError when project not found", async () => {
      mockRepo.connectRepoToProject.mockResolvedValue({ error: "PROJECT_NOT_FOUND" });

      await expect(
        githubService.connectRepo("user-1", "repo-1", "nonexistent"),
      ).rejects.toMatchObject({ statusCode: 404 });
    });

    it("throws ConflictError when repo already connected to another project", async () => {
      mockRepo.connectRepoToProject.mockResolvedValue({
        error: "REPO_ALREADY_CONNECTED",
        connectedProjectId: "other-proj",
      });

      await expect(
        githubService.connectRepo("user-1", "repo-1", "proj-1"),
      ).rejects.toMatchObject({ statusCode: 409 });
    });

    it("throws ConflictError when project already has a different repo", async () => {
      mockRepo.connectRepoToProject.mockResolvedValue({
        error: "PROJECT_ALREADY_HAS_REPO",
      });

      await expect(
        githubService.connectRepo("user-1", "repo-1", "proj-1"),
      ).rejects.toMatchObject({ statusCode: 409 });
    });
  });

  // =========================================================================
  // disconnectRepo
  // =========================================================================

  describe("disconnectRepo", () => {
    it("disconnects a repository from a project", async () => {
      mockRepo.disconnectProjectGithub.mockResolvedValue({
        project: { id: "proj-1", githubRepoId: null },
      });

      const result = await githubService.disconnectRepo("user-1", "proj-1");

      expect(result.message).toContain("disconnected");
      expect(mockRepo.disconnectProjectGithub).toHaveBeenCalledWith("proj-1", "user-1");
    });

    it("throws NotFoundError when project not found", async () => {
      mockRepo.disconnectProjectGithub.mockResolvedValue({ error: "PROJECT_NOT_FOUND" });

      await expect(
        githubService.disconnectRepo("user-1", "nonexistent"),
      ).rejects.toMatchObject({ statusCode: 404 });
    });

    it("throws BadRequestError when project has no GitHub repo", async () => {
      mockRepo.disconnectProjectGithub.mockResolvedValue({ error: "NO_GITHUB_REPO" });

      await expect(
        githubService.disconnectRepo("user-1", "proj-1"),
      ).rejects.toMatchObject({ statusCode: 400 });
    });
  });
});
