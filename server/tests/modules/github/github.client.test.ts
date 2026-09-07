import { describe, it, expect, vi, beforeEach } from "vitest";
import type { RawGithubRepo } from "../../../src/infrastructure/github/normalizer.js";

// ---------------------------------------------------------------------------
// Mock axios at the module level so the client's real retry/pagination logic
// executes against controlled responses.
// ---------------------------------------------------------------------------

const mockAxiosRequest = vi.fn();
const mockAxiosCreate = vi.fn(() => ({
  request: mockAxiosRequest,
  defaults: { headers: { common: {} } },
}));

vi.mock("axios", () => ({
  default: {
    create: mockAxiosCreate,
    post: vi.fn(),
    get: vi.fn(),
    defaults: { headers: { common: {} } },
  },
}));

vi.mock("../../../src/config/github.js", () => ({
  githubConfig: {
    clientId: "test-client-id",
    clientSecret: "test-client-secret",
    callbackUrl: "http://localhost:4000/api/v1/github/oauth/callback",
    token: "",
    apiBaseUrl: "https://api.github.com",
    oauthAuthorizeUrl: "https://github.com/login/oauth/authorize",
    oauthTokenUrl: "https://github.com/login/oauth/access_token",
    scope: "read:user user:email repo",
  },
}));

// Import AFTER mocks are set up
const { githubClient } = await vi.importActual<typeof import("../../../src/infrastructure/github/github.client.js")>(
  "../../../src/infrastructure/github/github.client.js",
);

const makeRawRepo = (overrides: Partial<RawGithubRepo> = {}): RawGithubRepo => ({
  id: 1,
  name: "repo-1",
  full_name: "user/repo-1",
  description: null,
  html_url: "https://github.com/user/repo-1",
  language: "TypeScript",
  stargazers_count: 0,
  forks_count: 0,
  open_issues_count: 0,
  private: false,
  archived: false,
  fork: false,
  pushed_at: null,
  ...overrides,
});

describe("GithubClient", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    // Speed up retries by making sleep instant
    vi.spyOn(githubClient as any, "sleep").mockResolvedValue(undefined);
  });

  // =========================================================================
  // exchangeCodeForToken
  // =========================================================================

  describe("exchangeCodeForToken", () => {
    it("posts to the OAuth token URL", async () => {
      const mockPost = vi.fn().mockResolvedValue({
        data: { access_token: "gho_test123", scope: "read:user", token_type: "bearer" },
      });
      // Replace the axios.post used by the client
      const axiosMod = await import("axios");
      (axiosMod.default.post as any) = mockPost;

      const result = await githubClient.exchangeCodeForToken("auth-code-abc");

      expect(result.access_token).toBe("gho_test123");
      expect(mockPost).toHaveBeenCalledWith(
        expect.stringContaining("github.com/login/oauth/access_token"),
        expect.objectContaining({ code: "auth-code-abc" }),
        expect.anything(),
      );
    });
  });

  // =========================================================================
  // getUserRepos (single page)
  // =========================================================================

  describe("getUserRepos", () => {
    it("fetches a single page of repos", async () => {
      const repos = [makeRawRepo({ id: 1, name: "repo-1" })];
      mockAxiosRequest.mockResolvedValue({ data: repos, headers: {} });

      const result = await githubClient.getUserRepos("token-123");

      expect(result).toEqual(repos);
      expect(mockAxiosRequest).toHaveBeenCalledWith(
        expect.objectContaining({
          method: "GET",
          url: "/user/repos",
          params: expect.objectContaining({ page: 1, per_page: 100 }),
        }),
      );
    });

    it("accepts custom page and perPage", async () => {
      mockAxiosRequest.mockResolvedValue({ data: [], headers: {} });

      await githubClient.getUserRepos("token-123", 3, 50);

      expect(mockAxiosRequest).toHaveBeenCalledWith(
        expect.objectContaining({
          params: expect.objectContaining({ page: 3, per_page: 50 }),
        }),
      );
    });
  });

  // =========================================================================
  // getAllUserRepos (pagination)
  // =========================================================================

  describe("getAllUserRepos", () => {
    it("paginates through all repos", async () => {
      const page1 = Array.from({ length: 100 }, (_, i) => makeRawRepo({ id: i + 1, name: `repo-${i + 1}` }));
      const page2 = [makeRawRepo({ id: 101, name: "repo-101" })];

      mockAxiosRequest
        .mockResolvedValueOnce({ data: page1, headers: {} })
        .mockResolvedValueOnce({ data: page2, headers: {} });

      const result = await githubClient.getAllUserRepos("token-123");

      expect(result).toHaveLength(101);
      expect(mockAxiosRequest).toHaveBeenCalledTimes(2);
    });

    it("stops when page returns fewer items than per_page", async () => {
      const page1 = Array.from({ length: 50 }, (_, i) => makeRawRepo({ id: i + 1 }));

      mockAxiosRequest.mockResolvedValueOnce({ data: page1, headers: {} });

      const result = await githubClient.getAllUserRepos("token-123");

      expect(result).toHaveLength(50);
      expect(mockAxiosRequest).toHaveBeenCalledTimes(1);
    });

    it("returns empty array when no repos exist", async () => {
      mockAxiosRequest.mockResolvedValue({ data: [], headers: {} });

      const result = await githubClient.getAllUserRepos("token-123");

      expect(result).toEqual([]);
      expect(mockAxiosRequest).toHaveBeenCalledTimes(1);
    });

    it("respects maxPages limit", async () => {
      const page = Array.from({ length: 100 }, (_, i) => makeRawRepo({ id: i + 1 }));
      mockAxiosRequest.mockResolvedValue({ data: page, headers: {} });

      const result = await githubClient.getAllUserRepos("token-123", 2);

      expect(result).toHaveLength(200);
      expect(mockAxiosRequest).toHaveBeenCalledTimes(2);
    });
  });

  // =========================================================================
  // Retry behavior
  // =========================================================================

  describe("retry behavior", () => {
    it("retries on 429 (rate limit) and succeeds", async () => {
      const error429 = {
        response: {
          status: 429,
          headers: { "x-ratelimit-remaining": "0", "retry-after": "1" },
          data: { message: "rate limit" },
        },
      };
      const successResponse = { data: { id: 1 }, headers: {} };

      mockAxiosRequest
        .mockRejectedValueOnce(error429)
        .mockResolvedValueOnce(successResponse);

      const result = await githubClient.authenticatedRequest("token", {
        method: "GET",
        url: "/user",
      });

      expect(result.data).toEqual({ id: 1 });
      expect(mockAxiosRequest).toHaveBeenCalledTimes(2);
    });

    it("retries on 500 and succeeds", async () => {
      const error500 = {
        response: { status: 500, headers: {}, data: { message: "Server Error" } },
      };

      mockAxiosRequest
        .mockRejectedValueOnce(error500)
        .mockResolvedValueOnce({ data: { id: 1 }, headers: {} });

      const result = await githubClient.authenticatedRequest("token", {
        method: "GET",
        url: "/user",
      });

      expect(result.data).toEqual({ id: 1 });
      expect(mockAxiosRequest).toHaveBeenCalledTimes(2);
    });

    it("retries on 502 and succeeds", async () => {
      mockAxiosRequest
        .mockRejectedValueOnce({ response: { status: 502, headers: {}, data: { message: "Bad Gateway" } } })
        .mockResolvedValueOnce({ data: { id: 1 }, headers: {} });

      const result = await githubClient.authenticatedRequest("token", { method: "GET", url: "/user" });
      expect(result.data).toEqual({ id: 1 });
    });

    it("retries on 503 and succeeds", async () => {
      mockAxiosRequest
        .mockRejectedValueOnce({ response: { status: 503, headers: {}, data: { message: "Unavailable" } } })
        .mockResolvedValueOnce({ data: { id: 1 }, headers: {} });

      const result = await githubClient.authenticatedRequest("token", { method: "GET", url: "/user" });
      expect(result.data).toEqual({ id: 1 });
    });

    it("retries on network timeout (ECONNABORTED)", async () => {
      mockAxiosRequest
        .mockRejectedValueOnce({ code: "ECONNABORTED", message: "timeout of 10000ms exceeded" })
        .mockResolvedValueOnce({ data: { id: 1 }, headers: {} });

      const result = await githubClient.authenticatedRequest("token", { method: "GET", url: "/user" });
      expect(result.data).toEqual({ id: 1 });
    });

    it("does NOT retry on 401 (auth error)", async () => {
      mockAxiosRequest.mockRejectedValue({
        response: { status: 401, headers: {}, data: { message: "Bad credentials" } },
      });

      await expect(
        githubClient.authenticatedRequest("token", { method: "GET", url: "/user" }),
      ).rejects.toMatchObject({ status: 401 });

      expect(mockAxiosRequest).toHaveBeenCalledTimes(1);
    });

    it("does NOT retry on 404 (not found)", async () => {
      mockAxiosRequest.mockRejectedValue({
        response: { status: 404, headers: {}, data: { message: "Not Found" } },
      });

      await expect(
        githubClient.authenticatedRequest("token", { method: "GET", url: "/user" }),
      ).rejects.toMatchObject({ status: 404 });

      expect(mockAxiosRequest).toHaveBeenCalledTimes(1);
    });

    it("does NOT retry on 422 (validation error)", async () => {
      mockAxiosRequest.mockRejectedValue({
        response: { status: 422, headers: {}, data: { message: "Validation Failed" } },
      });

      await expect(
        githubClient.authenticatedRequest("token", { method: "GET", url: "/user" }),
      ).rejects.toMatchObject({ status: 422 });

      expect(mockAxiosRequest).toHaveBeenCalledTimes(1);
    });

    it("gives up after max retries (1 + 3 = 4 attempts)", async () => {
      const error500 = {
        response: { status: 500, headers: {}, data: { message: "Server Error" } },
      };
      mockAxiosRequest.mockRejectedValue(error500);

      await expect(
        githubClient.authenticatedRequest("token", { method: "GET", url: "/user" }),
      ).rejects.toMatchObject({ status: 500 });

      expect(mockAxiosRequest).toHaveBeenCalledTimes(4);
    });
  });

  // =========================================================================
  // Rate limit tracking
  // =========================================================================

  describe("rate limit tracking", () => {
    it("updates from successful response headers", async () => {
      const resetsAt = Math.floor(Date.now() / 1000) + 3600;
      mockAxiosRequest.mockResolvedValue({
        data: {},
        headers: {
          "x-ratelimit-limit": "5000",
          "x-ratelimit-remaining": "4999",
          "x-ratelimit-reset": String(resetsAt),
        },
      });

      await githubClient.authenticatedRequest("token", { method: "GET", url: "/user" });

      const rl = githubClient.getRateLimit();
      expect(rl.limit).toBe(5000);
      expect(rl.remaining).toBe(4999);
      expect(rl.resetsAt).toBeInstanceOf(Date);
    });

    it("updates from error response headers", async () => {
      const resetsAt = Math.floor(Date.now() / 1000) + 3600;
      mockAxiosRequest.mockRejectedValue({
        response: {
          status: 403,
          headers: {
            "x-ratelimit-limit": "5000",
            "x-ratelimit-remaining": "0",
            "x-ratelimit-reset": String(resetsAt),
          },
          data: { message: "rate limit" },
        },
      });

      await expect(
        githubClient.authenticatedRequest("token", { method: "GET", url: "/user" }),
      ).rejects.toThrow();

      const rl = githubClient.getRateLimit();
      expect(rl.remaining).toBe(0);
      expect(rl.limit).toBe(5000);
    });
  });

  // =========================================================================
  // authenticatedRequest
  // =========================================================================

  describe("authenticatedRequest", () => {
    it("adds Bearer token to headers", async () => {
      mockAxiosRequest.mockResolvedValue({ data: { id: 1 }, headers: {} });

      await githubClient.authenticatedRequest("ghp_test123", { method: "GET", url: "/user" });

      expect(mockAxiosRequest).toHaveBeenCalledWith(
        expect.objectContaining({
          headers: expect.objectContaining({
            Authorization: "Bearer ghp_test123",
          }),
        }),
      );
    });
  });

  // =========================================================================
  // getRepo
  // =========================================================================

  describe("getRepo", () => {
    it("fetches a repo by full name with token", async () => {
      mockAxiosRequest.mockResolvedValue({ data: { id: 1, name: "repo" }, headers: {} });

      await githubClient.getRepo("owner/repo", "token-123");

      expect(mockAxiosRequest).toHaveBeenCalledWith(
        expect.objectContaining({
          method: "GET",
          url: "/repos/owner/repo",
          headers: expect.objectContaining({ Authorization: "Bearer token-123" }),
        }),
      );
    });

    it("fetches a repo without token", async () => {
      mockAxiosRequest.mockResolvedValue({ data: { id: 1, name: "repo" }, headers: {} });

      await githubClient.getRepo("owner/repo");

      expect(mockAxiosRequest).toHaveBeenCalledWith(
        expect.objectContaining({
          method: "GET",
          url: "/repos/owner/repo",
        }),
      );
    });
  });

  // =========================================================================
  // getRateLimit (initial state)
  // =========================================================================

  describe("getRateLimit", () => {
    it("returns default rate limit info", () => {
      const rl = githubClient.getRateLimit();
      expect(rl).toHaveProperty("limit");
      expect(rl).toHaveProperty("remaining");
      expect(rl).toHaveProperty("resetsAt");
      expect(rl).toHaveProperty("retryAfter");
    });
  });
});
