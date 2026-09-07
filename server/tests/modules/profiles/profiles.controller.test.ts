import { describe, it, expect, vi, beforeEach } from "vitest";
import { profilesController } from "../../../src/modules/profiles/controller/profiles.controller.js";
import { profilesService } from "../../../src/modules/profiles/service/profiles.service.js";

vi.mock("../../../src/modules/profiles/service/profiles.service.js");

const mockService = vi.mocked(profilesService);

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

describe("profilesController", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  // =========================================================================
  // getByUsername — public profile
  // =========================================================================

  describe("getByUsername", () => {
    it("returns public profile without sensitive fields", async () => {
      const publicProfile = {
        id: "user-1",
        username: "johndoe",
        name: "John Doe",
        bio: "Dev",
        email: undefined, // must NOT be present
        recentActivity: undefined, // must NOT be present
      };
      mockService.getPublicProfile.mockResolvedValue(publicProfile as any);

      const req = mockReq({ params: { username: "johndoe" } });
      const res = mockRes();

      await profilesController.getByUsername(req, res, mockNext);

      expect(res.json).toHaveBeenCalledWith({
        success: true,
        data: publicProfile,
      });
    });

    it("passes viewerId when user is authenticated", async () => {
      mockService.getPublicProfile.mockResolvedValue({} as any);

      const req = mockReq({
        params: { username: "johndoe" },
        user: { id: "viewer-1", email: "v@x.com", username: "viewer" },
      });
      const res = mockRes();

      await profilesController.getByUsername(req, res, mockNext);

      expect(mockService.getPublicProfile).toHaveBeenCalledWith("johndoe", "viewer-1");
    });

    it("passes undefined viewerId when not authenticated", async () => {
      mockService.getPublicProfile.mockResolvedValue({} as any);

      const req = mockReq({ params: { username: "johndoe" } });
      const res = mockRes();

      await profilesController.getByUsername(req, res, mockNext);

      expect(mockService.getPublicProfile).toHaveBeenCalledWith("johndoe", undefined);
    });

    it("calls next on error", async () => {
      mockService.getPublicProfile.mockRejectedValue(new Error("Not found"));

      const req = mockReq({ params: { username: "johndoe" } });
      const res = mockRes();

      await profilesController.getByUsername(req, res, mockNext);

      expect(mockNext).toHaveBeenCalledWith(expect.any(Error));
    });
  });

  // =========================================================================
  // getOwn — private profile
  // =========================================================================

  describe("getOwn", () => {
    it("returns private profile with email", async () => {
      const privateProfile = {
        id: "user-1",
        username: "johndoe",
        email: "john@example.com",
        recentActivity: [],
      };
      mockService.getOwnProfile.mockResolvedValue(privateProfile as any);

      const req = mockReq({ user: { id: "user-1", email: "john@example.com", username: "johndoe" } });
      const res = mockRes();

      await profilesController.getOwn(req, res, mockNext);

      expect(res.json).toHaveBeenCalledWith({
        success: true,
        data: privateProfile,
      });
    });

    it("calls next when service throws", async () => {
      mockService.getOwnProfile.mockRejectedValue(new Error("Not found"));

      const req = mockReq({ user: { id: "user-1", email: "a@b.com", username: "u" } });
      const res = mockRes();

      await profilesController.getOwn(req, res, mockNext);

      expect(mockNext).toHaveBeenCalled();
    });
  });

  // =========================================================================
  // updateOwn
  // =========================================================================

  describe("updateOwn", () => {
    it("calls service with user id and body", async () => {
      mockService.updateProfile.mockResolvedValue(undefined);

      const req = mockReq({
        user: { id: "user-1", email: "a@b.com", username: "u" },
        body: { bio: "New bio" },
      });
      const res = mockRes();

      await profilesController.updateOwn(req, res, mockNext);

      expect(mockService.updateProfile).toHaveBeenCalledWith("user-1", { bio: "New bio" });
      expect(res.json).toHaveBeenCalledWith({
        success: true,
        message: "Profile updated",
      });
    });
  });

  // =========================================================================
  // checkUsernameAvailability
  // =========================================================================

  describe("checkUsernameAvailability", () => {
    it("returns availability result", async () => {
      mockService.checkUsernameAvailability.mockResolvedValue({
        available: true,
        username: "unique",
      });

      const req = mockReq({ params: { username: "unique" } });
      const res = mockRes();

      await profilesController.checkUsernameAvailability(req, res, mockNext);

      expect(res.json).toHaveBeenCalledWith({
        success: true,
        data: { available: true, username: "unique" },
      });
    });
  });

  // =========================================================================
  // list
  // =========================================================================

  describe("list", () => {
    it("returns paginated users", async () => {
      mockService.listUsers.mockResolvedValue({
        data: [{ id: "u1", username: "alice" }],
        pagination: { page: 1, limit: 20, total: 1, totalPages: 1 },
      });

      const req = mockReq({ query: { page: 1, limit: 20 } });
      const res = mockRes();

      await profilesController.list(req, res, mockNext);

      expect(res.json).toHaveBeenCalledWith({
        success: true,
        data: [{ id: "u1", username: "alice" }],
        pagination: { page: 1, limit: 20, total: 1, totalPages: 1 },
      });
    });
  });

  // =========================================================================
  // getFollowers / getFollowing
  // =========================================================================

  describe("getFollowers", () => {
    it("returns paginated followers", async () => {
      mockService.getFollowers.mockResolvedValue({
        data: [{ id: "u2", username: "bob" }],
        pagination: { page: 1, limit: 20, total: 1, totalPages: 1 },
      });

      const req = mockReq({ params: { username: "johndoe" }, query: {} });
      const res = mockRes();

      await profilesController.getFollowers(req, res, mockNext);

      expect(mockService.getFollowers).toHaveBeenCalledWith("johndoe", {});
      expect(res.json).toHaveBeenCalled();
    });
  });

  describe("getFollowing", () => {
    it("returns paginated following", async () => {
      mockService.getFollowing.mockResolvedValue({
        data: [{ id: "u3", username: "charlie" }],
        pagination: { page: 1, limit: 20, total: 1, totalPages: 1 },
      });

      const req = mockReq({ params: { username: "johndoe" }, query: {} });
      const res = mockRes();

      await profilesController.getFollowing(req, res, mockNext);

      expect(mockService.getFollowing).toHaveBeenCalledWith("johndoe", {});
    });
  });
});
