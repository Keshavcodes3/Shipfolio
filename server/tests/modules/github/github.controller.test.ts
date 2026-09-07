import { describe, it, expect, vi, beforeEach } from "vitest";
import { githubController } from "../../../src/modules/github/controller/github.controller.js";
import { githubService } from "../../../src/modules/github/service/github.service.js";

vi.mock("../../../src/modules/github/service/github.service.js", () => ({
  githubService: {
    initiateOAuth: vi.fn(),
    handleOAuthCallback: vi.fn(),
    getLinkedAccount: vi.fn(),
    linkAccount: vi.fn(),
    unlinkAccount: vi.fn(),
    syncRepositories: vi.fn(),
    getRepositories: vi.fn(),
    getRepository: vi.fn(),
    connectRepo: vi.fn(),
    disconnectRepo: vi.fn(),
  },
}));

const mockService = vi.mocked(githubService);

const mockReq = (overrides: Record<string, any> = {}) =>
  ({
    body: {},
    params: {},
    query: {},
    cookies: {},
    user: undefined,
    ...overrides,
  }) as any;

const mockRes = () => {
  const res: any = {
    status: vi.fn().mockReturnThis(),
    json: vi.fn().mockReturnThis(),
    cookie: vi.fn().mockReturnThis(),
    clearCookie: vi.fn().mockReturnThis(),
  };
  return res;
};

const mockNext = vi.fn();

describe("githubController", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  // =========================================================================
  // initiateOAuth
  // =========================================================================

  describe("initiateOAuth", () => {
    it("returns the OAuth URL and state", () => {
      mockService.initiateOAuth.mockReturnValue({
        url: "https://github.com/login/oauth/authorize?...",
        state: "signed-state",
      });

      const req = mockReq({ body: {} });
      const res = mockRes();

      githubController.initiateOAuth(req, res, mockNext);

      expect(res.json).toHaveBeenCalledWith(
        expect.objectContaining({
          success: true,
          data: expect.objectContaining({ url: expect.stringContaining("github.com") }),
        }),
      );
    });

    it("passes redirect through to service", () => {
      mockService.initiateOAuth.mockReturnValue({ url: "...", state: "..." });

      const req = mockReq({ body: { redirect: "/dashboard" } });
      const res = mockRes();

      githubController.initiateOAuth(req, res, mockNext);

      expect(mockService.initiateOAuth).toHaveBeenCalledWith("/dashboard");
    });

    it("calls next on error", () => {
      mockService.initiateOAuth.mockImplementation(() => {
        throw new Error("fail");
      });

      const req = mockReq();
      const res = mockRes();

      githubController.initiateOAuth(req, res, mockNext);

      expect(mockNext).toHaveBeenCalledWith(expect.any(Error));
    });
  });

  // =========================================================================
  // handleOAuthCallback
  // =========================================================================

  describe("handleOAuthCallback", () => {
    it("returns 400 when code is missing", async () => {
      const req = mockReq({ query: { state: "state-123" } });
      const res = mockRes();

      await githubController.handleOAuthCallback(req, res, mockNext);

      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.json).toHaveBeenCalledWith(
        expect.objectContaining({ success: false }),
      );
    });

    it("returns 400 when state is missing", async () => {
      const req = mockReq({ query: { code: "code-123" } });
      const res = mockRes();

      await githubController.handleOAuthCallback(req, res, mockNext);

      expect(res.status).toHaveBeenCalledWith(400);
    });

    it("delegates to service and returns account", async () => {
      mockService.handleOAuthCallback.mockResolvedValue({
        user: { id: "acc-1", username: "testuser" },
        isNewUser: true,
      });

      const req = mockReq({ query: { code: "code-abc", state: "state-xyz" } });
      const res = mockRes();

      await githubController.handleOAuthCallback(req, res, mockNext);

      expect(res.json).toHaveBeenCalledWith(
        expect.objectContaining({
          success: true,
          data: expect.objectContaining({ isNewUser: true }),
        }),
      );
    });

    it("calls next on error", async () => {
      mockService.handleOAuthCallback.mockRejectedValue(new Error("fail"));

      const req = mockReq({ query: { code: "code-abc", state: "state-xyz" } });
      const res = mockRes();

      await githubController.handleOAuthCallback(req, res, mockNext);

      expect(mockNext).toHaveBeenCalledWith(expect.any(Error));
    });
  });

  // =========================================================================
  // getLinkedAccount
  // =========================================================================

  describe("getLinkedAccount", () => {
    it("returns the linked account", async () => {
      mockService.getLinkedAccount.mockResolvedValue({
        id: "acc-1",
        username: "testuser",
      } as any);

      const req = mockReq({ user: { id: "user-1" } });
      const res = mockRes();

      await githubController.getLinkedAccount(req, res, mockNext);

      expect(res.json).toHaveBeenCalledWith(
        expect.objectContaining({ success: true }),
      );
    });

    it("calls next on error", async () => {
      mockService.getLinkedAccount.mockRejectedValue(new Error("not found"));

      const req = mockReq({ user: { id: "user-1" } });
      const res = mockRes();

      await githubController.getLinkedAccount(req, res, mockNext);

      expect(mockNext).toHaveBeenCalledWith(expect.any(Error));
    });
  });

  // =========================================================================
  // linkAccount
  // =========================================================================

  describe("linkAccount", () => {
    it("links account and returns 201", async () => {
      mockService.linkAccount.mockResolvedValue({
        id: "acc-1",
        username: "testuser",
      } as any);

      const req = mockReq({
        user: { id: "user-1" },
        body: { code: "code-xyz" },
      });
      const res = mockRes();

      await githubController.linkAccount(req, res, mockNext);

      expect(res.status).toHaveBeenCalledWith(201);
      expect(res.json).toHaveBeenCalledWith(
        expect.objectContaining({ success: true }),
      );
    });

    it("calls next on error", async () => {
      mockService.linkAccount.mockRejectedValue(new Error("conflict"));

      const req = mockReq({
        user: { id: "user-1" },
        body: { code: "code-xyz" },
      });
      const res = mockRes();

      await githubController.linkAccount(req, res, mockNext);

      expect(mockNext).toHaveBeenCalledWith(expect.any(Error));
    });
  });

  // =========================================================================
  // unlinkAccount
  // =========================================================================

  describe("unlinkAccount", () => {
    it("unlinks and returns success", async () => {
      mockService.unlinkAccount.mockResolvedValue({
        message: "GitHub account unlinked successfully",
      });

      const req = mockReq({ user: { id: "user-1" } });
      const res = mockRes();

      await githubController.unlinkAccount(req, res, mockNext);

      expect(res.json).toHaveBeenCalledWith(
        expect.objectContaining({ success: true }),
      );
    });

    it("calls next on error", async () => {
      mockService.unlinkAccount.mockRejectedValue(new Error("not found"));

      const req = mockReq({ user: { id: "user-1" } });
      const res = mockRes();

      await githubController.unlinkAccount(req, res, mockNext);

      expect(mockNext).toHaveBeenCalledWith(expect.any(Error));
    });
  });

  // =========================================================================
  // syncRepositories
  // =========================================================================

  describe("syncRepositories", () => {
    it("syncs repos and returns result", async () => {
      mockService.syncRepositories.mockResolvedValue({
        syncedCount: 5,
        removedCount: 1,
        syncedAt: new Date(),
      });

      const req = mockReq({ user: { id: "user-1" } });
      const res = mockRes();

      await githubController.syncRepositories(req, res, mockNext);

      expect(res.json).toHaveBeenCalledWith(
        expect.objectContaining({
          success: true,
          data: expect.objectContaining({ syncedCount: 5 }),
        }),
      );
    });

    it("calls next on error", async () => {
      mockService.syncRepositories.mockRejectedValue(new Error("fail"));

      const req = mockReq({ user: { id: "user-1" } });
      const res = mockRes();

      await githubController.syncRepositories(req, res, mockNext);

      expect(mockNext).toHaveBeenCalledWith(expect.any(Error));
    });
  });

  // =========================================================================
  // getRepositories
  // =========================================================================

  describe("getRepositories", () => {
    it("returns the list of repos", async () => {
      mockService.getRepositories.mockResolvedValue([
        { id: "repo-1", name: "my-repo" },
      ] as any);

      const req = mockReq({ user: { id: "user-1" } });
      const res = mockRes();

      await githubController.getRepositories(req, res, mockNext);

      expect(res.json).toHaveBeenCalledWith(
        expect.objectContaining({ success: true, data: expect.any(Array) }),
      );
    });

    it("passes projectId filter to service", async () => {
      mockService.getRepositories.mockResolvedValue([]);

      const req = mockReq({ user: { id: "user-1" }, query: { projectId: "proj-1" } });
      const res = mockRes();

      await githubController.getRepositories(req, res, mockNext);

      expect(mockService.getRepositories).toHaveBeenCalledWith("user-1", "proj-1");
    });

    it("calls next on error", async () => {
      mockService.getRepositories.mockRejectedValue(new Error("fail"));

      const req = mockReq({ user: { id: "user-1" } });
      const res = mockRes();

      await githubController.getRepositories(req, res, mockNext);

      expect(mockNext).toHaveBeenCalledWith(expect.any(Error));
    });
  });

  // =========================================================================
  // getRepository
  // =========================================================================

  describe("getRepository", () => {
    it("returns a single repository", async () => {
      mockService.getRepository.mockResolvedValue({
        id: "repo-1",
        name: "my-repo",
        projectId: null,
      } as any);

      const req = mockReq({ user: { id: "user-1" }, params: { repoId: "repo-1" } });
      const res = mockRes();

      await githubController.getRepository(req, res, mockNext);

      expect(mockService.getRepository).toHaveBeenCalledWith("user-1", "repo-1");
      expect(res.json).toHaveBeenCalledWith(
        expect.objectContaining({ success: true }),
      );
    });

    it("calls next on error", async () => {
      mockService.getRepository.mockRejectedValue(new Error("not found"));

      const req = mockReq({ user: { id: "user-1" }, params: { repoId: "repo-1" } });
      const res = mockRes();

      await githubController.getRepository(req, res, mockNext);

      expect(mockNext).toHaveBeenCalledWith(expect.any(Error));
    });
  });

  // =========================================================================
  // connectRepository
  // =========================================================================

  describe("connectRepository", () => {
    it("connects a repo to a project", async () => {
      mockService.connectRepo.mockResolvedValue({
        id: "proj-1",
        githubRepo: { id: "repo-1", name: "my-repo" },
      } as any);

      const req = mockReq({
        user: { id: "user-1" },
        params: { repoId: "repo-1" },
        body: { projectId: "proj-1" },
      });
      const res = mockRes();

      await githubController.connectRepository(req, res, mockNext);

      expect(mockService.connectRepo).toHaveBeenCalledWith("user-1", "repo-1", "proj-1");
      expect(res.json).toHaveBeenCalledWith(
        expect.objectContaining({ success: true }),
      );
    });

    it("calls next on error", async () => {
      mockService.connectRepo.mockRejectedValue(new Error("conflict"));

      const req = mockReq({
        user: { id: "user-1" },
        params: { repoId: "repo-1" },
        body: { projectId: "proj-1" },
      });
      const res = mockRes();

      await githubController.connectRepository(req, res, mockNext);

      expect(mockNext).toHaveBeenCalledWith(expect.any(Error));
    });
  });

  // =========================================================================
  // disconnectRepository
  // =========================================================================

  describe("disconnectRepository", () => {
    it("disconnects a repo from a project", async () => {
      mockService.disconnectRepo.mockResolvedValue({
        message: "GitHub repository disconnected successfully",
      });

      const req = mockReq({
        user: { id: "user-1" },
        params: { id: "proj-1" },
      });
      const res = mockRes();

      await githubController.disconnectRepository(req, res, mockNext);

      expect(mockService.disconnectRepo).toHaveBeenCalledWith("user-1", "proj-1");
      expect(res.json).toHaveBeenCalledWith(
        expect.objectContaining({ success: true }),
      );
    });

    it("calls next on error", async () => {
      mockService.disconnectRepo.mockRejectedValue(new Error("not found"));

      const req = mockReq({
        user: { id: "user-1" },
        params: { id: "proj-1" },
      });
      const res = mockRes();

      await githubController.disconnectRepository(req, res, mockNext);

      expect(mockNext).toHaveBeenCalledWith(expect.any(Error));
    });
  });
});
