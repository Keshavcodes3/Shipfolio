import { describe, it, expect, vi, beforeEach } from "vitest";
import { followsController } from "../../../../src/modules/follows/controller/follows.controller.js";
import { followsService } from "../../../../src/modules/follows/service/follows.service.js";
import { prisma } from "../../../../src/config/database.js";

vi.mock("../../../../src/modules/follows/service/follows.service.js", () => ({
  followsService: {
    follow: vi.fn(),
    unfollow: vi.fn(),
    getFollowStatus: vi.fn(),
    getFollowCounts: vi.fn(),
    listFollowers: vi.fn(),
    listFollowing: vi.fn(),
  },
}));

const mockService = vi.mocked(followsService);
const mockPrisma = vi.mocked(prisma);

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

const mockReq = (overrides: Record<string, any> = {}): any => ({
  params: {},
  query: {},
  body: {},
  user: undefined,
  ...overrides,
});

const mockRes = () => {
  const res: any = {};
  res.status = vi.fn().mockReturnValue(res);
  res.json = vi.fn().mockReturnValue(res);
  return res;
};

const mockNext = vi.fn();

// ---------------------------------------------------------------------------
// Tests
// ---------------------------------------------------------------------------

describe("followsController", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  // =========================================================================
  // follow
  // =========================================================================

  describe("follow", () => {
    it("returns success with follow result", async () => {
      const followResult = {
        following: true,
        followerCount: 5,
        followingCount: 3,
      };
      mockService.follow.mockResolvedValue(followResult);

      const req = mockReq({ params: { username: "targetuser" }, user: { id: "follower-1" } });
      const res = mockRes();

      await followsController.follow(req, res, mockNext);

      expect(mockService.follow).toHaveBeenCalledWith("follower-1", "targetuser");
      expect(res.json).toHaveBeenCalledWith({ success: true, data: followResult });
    });

    it("calls next on error", async () => {
      mockService.follow.mockRejectedValue(new Error("Not found"));

      const req = mockReq({ params: { username: "targetuser" }, user: { id: "follower-1" } });
      const res = mockRes();

      await followsController.follow(req, res, mockNext);

      expect(mockNext).toHaveBeenCalledWith(expect.any(Error));
    });

    it("handles Express 5 array params", async () => {
      mockService.follow.mockResolvedValue({ following: true, followerCount: 0, followingCount: 0 });

      const req = mockReq({ params: { username: ["targetuser"] }, user: { id: "follower-1" } });
      const res = mockRes();

      await followsController.follow(req, res, mockNext);

      expect(mockService.follow).toHaveBeenCalledWith("follower-1", "targetuser");
    });
  });

  // =========================================================================
  // unfollow
  // =========================================================================

  describe("unfollow", () => {
    it("returns success with unfollow result", async () => {
      const unfollowResult = {
        following: false,
        followerCount: 4,
        followingCount: 3,
      };
      mockService.unfollow.mockResolvedValue(unfollowResult);

      const req = mockReq({ params: { username: "targetuser" }, user: { id: "follower-1" } });
      const res = mockRes();

      await followsController.unfollow(req, res, mockNext);

      expect(mockService.unfollow).toHaveBeenCalledWith("follower-1", "targetuser");
      expect(res.json).toHaveBeenCalledWith({ success: true, data: unfollowResult });
    });

    it("calls next on error", async () => {
      mockService.unfollow.mockRejectedValue(new Error("Not found"));

      const req = mockReq({ params: { username: "targetuser" }, user: { id: "follower-1" } });
      const res = mockRes();

      await followsController.unfollow(req, res, mockNext);

      expect(mockNext).toHaveBeenCalledWith(expect.any(Error));
    });
  });

  // =========================================================================
  // getFollowStatus
  // =========================================================================

  describe("getFollowStatus", () => {
    it("returns follow status", async () => {
      const statusResult = {
        following: true,
        followerCount: 10,
        followingCount: 5,
      };
      mockService.getFollowStatus.mockResolvedValue(statusResult);

      const req = mockReq({ params: { username: "targetuser" }, user: { id: "viewer-1" } });
      const res = mockRes();

      await followsController.getFollowStatus(req, res, mockNext);

      expect(mockService.getFollowStatus).toHaveBeenCalledWith("viewer-1", "targetuser");
      expect(res.json).toHaveBeenCalledWith({ success: true, data: statusResult });
    });

    it("calls next on error", async () => {
      mockService.getFollowStatus.mockRejectedValue(new Error("Not found"));

      const req = mockReq({ params: { username: "targetuser" }, user: { id: "viewer-1" } });
      const res = mockRes();

      await followsController.getFollowStatus(req, res, mockNext);

      expect(mockNext).toHaveBeenCalledWith(expect.any(Error));
    });
  });

  // =========================================================================
  // listFollowers
  // =========================================================================

  describe("listFollowers", () => {
    it("returns paginated followers with data and pagination", async () => {
      const followersResult = {
        data: [{ user: { id: "u1", username: "alice", name: "Alice", avatarUrl: null }, followedAt: new Date() }],
        pagination: { page: 1, limit: 20, total: 1, totalPages: 1 },
      };
      mockService.listFollowers.mockResolvedValue(followersResult as any);

      const req = mockReq({
        params: { username: "targetuser" },
        query: { page: "1", limit: "20" },
        user: { id: "viewer-1" },
      });
      const res = mockRes();

      await followsController.listFollowers(req, res, mockNext);

      expect(mockService.listFollowers).toHaveBeenCalledWith("targetuser", { page: "1", limit: "20" }, "viewer-1");
      expect(res.json).toHaveBeenCalledWith({
        success: true,
        data: followersResult.data,
        pagination: followersResult.pagination,
      });
    });

    it("passes undefined viewerId when not authenticated", async () => {
      mockService.listFollowers.mockResolvedValue({
        data: [],
        pagination: { page: 1, limit: 20, total: 0, totalPages: 0 },
      } as any);

      const req = mockReq({ params: { username: "targetuser" }, query: {} });
      const res = mockRes();

      await followsController.listFollowers(req, res, mockNext);

      expect(mockService.listFollowers).toHaveBeenCalledWith("targetuser", {}, undefined);
    });

    it("calls next on error", async () => {
      mockService.listFollowers.mockRejectedValue(new Error("Not found"));

      const req = mockReq({ params: { username: "targetuser" }, query: {} });
      const res = mockRes();

      await followsController.listFollowers(req, res, mockNext);

      expect(mockNext).toHaveBeenCalledWith(expect.any(Error));
    });
  });

  // =========================================================================
  // listFollowing
  // =========================================================================

  describe("listFollowing", () => {
    it("returns paginated following with data and pagination", async () => {
      const followingResult = {
        data: [{ user: { id: "u1", username: "alice", name: "Alice", avatarUrl: null }, followedAt: new Date() }],
        pagination: { page: 1, limit: 20, total: 1, totalPages: 1 },
      };
      mockService.listFollowing.mockResolvedValue(followingResult as any);

      const req = mockReq({
        params: { username: "targetuser" },
        query: { page: "1", limit: "20" },
        user: { id: "viewer-1" },
      });
      const res = mockRes();

      await followsController.listFollowing(req, res, mockNext);

      expect(mockService.listFollowing).toHaveBeenCalledWith("targetuser", { page: "1", limit: "20" }, "viewer-1");
      expect(res.json).toHaveBeenCalledWith({
        success: true,
        data: followingResult.data,
        pagination: followingResult.pagination,
      });
    });

    it("passes undefined viewerId when not authenticated", async () => {
      mockService.listFollowing.mockResolvedValue({
        data: [],
        pagination: { page: 1, limit: 20, total: 0, totalPages: 0 },
      } as any);

      const req = mockReq({ params: { username: "targetuser" }, query: {} });
      const res = mockRes();

      await followsController.listFollowing(req, res, mockNext);

      expect(mockService.listFollowing).toHaveBeenCalledWith("targetuser", {}, undefined);
    });

    it("calls next on error", async () => {
      mockService.listFollowing.mockRejectedValue(new Error("Not found"));

      const req = mockReq({ params: { username: "targetuser" }, query: {} });
      const res = mockRes();

      await followsController.listFollowing(req, res, mockNext);

      expect(mockNext).toHaveBeenCalledWith(expect.any(Error));
    });
  });

  // =========================================================================
  // getFollowCounts
  // =========================================================================

  describe("getFollowCounts", () => {
    it("returns follower and following counts", async () => {
      mockPrisma.user.findUnique.mockResolvedValue({ id: "user-1" } as any);
      mockService.getFollowCounts.mockResolvedValue({ followers: 42, following: 17 });

      const req = mockReq({ params: { username: "targetuser" } });
      const res = mockRes();

      await followsController.getFollowCounts(req, res, mockNext);

      expect(mockPrisma.user.findUnique).toHaveBeenCalledWith({
        where: { username: "targetuser" },
        select: { id: true },
      });
      expect(mockService.getFollowCounts).toHaveBeenCalledWith("user-1");
      expect(res.json).toHaveBeenCalledWith({
        success: true,
        data: { followers: 42, following: 17 },
      });
    });

    it("returns 404 when user does not exist", async () => {
      mockPrisma.user.findUnique.mockResolvedValue(null);

      const req = mockReq({ params: { username: "nonexistent" } });
      const res = mockRes();

      await followsController.getFollowCounts(req, res, mockNext);

      expect(res.status).toHaveBeenCalledWith(404);
      expect(res.json).toHaveBeenCalledWith({
        success: false,
        message: "User not found",
      });
      expect(mockService.getFollowCounts).not.toHaveBeenCalled();
    });

    it("calls next on error", async () => {
      mockPrisma.user.findUnique.mockRejectedValue(new Error("DB error"));

      const req = mockReq({ params: { username: "targetuser" } });
      const res = mockRes();

      await followsController.getFollowCounts(req, res, mockNext);

      expect(mockNext).toHaveBeenCalledWith(expect.any(Error));
    });

    it("handles Express 5 array params", async () => {
      mockPrisma.user.findUnique.mockResolvedValue({ id: "user-1" } as any);
      mockService.getFollowCounts.mockResolvedValue({ followers: 0, following: 0 });

      const req = mockReq({ params: { username: ["targetuser"] } });
      const res = mockRes();

      await followsController.getFollowCounts(req, res, mockNext);

      expect(mockPrisma.user.findUnique).toHaveBeenCalledWith({
        where: { username: "targetuser" },
        select: { id: true },
      });
    });
  });
});
