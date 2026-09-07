import { describe, it, expect, vi, beforeEach } from "vitest";
import { prisma } from "../../../../src/config/database.js";
import { followsService } from "../../../../src/modules/follows/service/follows.service.js";
import { followsRepository } from "../../../../src/modules/follows/repository/follows.repository.js";
import { emitEvent } from "../../../../src/shared/events/eventBus.js";
import { FollowEvents } from "../../../../src/modules/follows/events/follows.events.js";

vi.mock("../../../../src/modules/follows/repository/follows.repository.js", () => ({
  followsRepository: {
    isFollowing: vi.fn(),
    follow: vi.fn(),
    unfollow: vi.fn(),
    countFollowers: vi.fn(),
    countFollowing: vi.fn(),
    getFollowCounts: vi.fn(),
    listFollowers: vi.fn(),
    listFollowing: vi.fn(),
    getFollowedIds: vi.fn(),
    deleteByFollower: vi.fn(),
    deleteByFollowing: vi.fn(),
  },
}));

const mockPrisma = vi.mocked(prisma);
const mockRepo = vi.mocked(followsRepository);
const mockEmitEvent = vi.mocked(emitEvent);

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

const targetUser = { id: "target-1", username: "targetuser" };
const followerUser = { id: "follower-1", username: "followeruser" };

const makeFollowCounts = (overrides = {}) => ({
  followers: 10,
  following: 5,
  ...overrides,
});

const makeFollowResult = (overrides = {}) => ({
  following: true,
  followerCount: 10,
  followingCount: 5,
  ...overrides,
});

const makeFollowListItem = (userId: string, username: string, overrides = {}) => ({
  createdAt: new Date("2024-06-01"),
  follower: { id: userId, username, name: `${username}_name`, avatarUrl: null, ...overrides },
});

const makeFollowingListItem = (userId: string, username: string, overrides = {}) => ({
  createdAt: new Date("2024-06-01"),
  following: { id: userId, username, name: `${username}_name`, avatarUrl: null, ...overrides },
});

// ---------------------------------------------------------------------------
// Tests
// ---------------------------------------------------------------------------

describe("followsService", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  // =========================================================================
  // follow
  // =========================================================================

  describe("follow", () => {
    it("follows a user successfully", async () => {
      mockPrisma.user.findUnique.mockResolvedValue(targetUser as any);
      mockRepo.isFollowing.mockResolvedValue(false as any);
      mockRepo.follow.mockResolvedValue({} as any);
      mockRepo.getFollowCounts.mockResolvedValue(makeFollowCounts());

      const result = await followsService.follow("follower-1", "targetuser");

      expect(result.following).toBe(true);
      expect(mockRepo.follow).toHaveBeenCalledWith("follower-1", "target-1");
      expect(mockEmitEvent).toHaveBeenCalledWith(FollowEvents.USER_FOLLOWED, {
        followerId: "follower-1",
        followingId: "target-1",
      });
    });

    it("prevents self-follow", async () => {
      mockPrisma.user.findUnique.mockResolvedValue({ id: "follower-1" } as any);

      await expect(
        followsService.follow("follower-1", "followeruser")
      ).rejects.toMatchObject({ statusCode: 400 });

      expect(mockRepo.follow).not.toHaveBeenCalled();
    });

    it("throws NotFoundError when target user does not exist", async () => {
      mockPrisma.user.findUnique.mockResolvedValue(null);

      await expect(
        followsService.follow("follower-1", "nonexistent")
      ).rejects.toMatchObject({ statusCode: 404 });
    });

    it("is idempotent when already following", async () => {
      mockPrisma.user.findUnique.mockResolvedValue(targetUser as any);
      mockRepo.isFollowing.mockResolvedValue(true as any);
      mockRepo.getFollowCounts.mockResolvedValue(makeFollowCounts());

      const result = await followsService.follow("follower-1", "targetuser");

      expect(result.following).toBe(true);
      expect(mockRepo.follow).not.toHaveBeenCalled();
      expect(mockEmitEvent).not.toHaveBeenCalled();
    });

    it("handles P2002 unique constraint violation as idempotent success", async () => {
      mockPrisma.user.findUnique.mockResolvedValue(targetUser as any);
      mockRepo.isFollowing.mockResolvedValue(false as any);
      const p2002Error = Object.assign(new Error("Unique constraint"), { code: "P2002" });
      mockRepo.follow.mockRejectedValue(p2002Error);
      mockRepo.getFollowCounts.mockResolvedValue(makeFollowCounts());

      const result = await followsService.follow("follower-1", "targetuser");

      expect(result.following).toBe(true);
      expect(mockEmitEvent).not.toHaveBeenCalled();
    });

    it("re-throws non-P2002 database errors", async () => {
      mockPrisma.user.findUnique.mockResolvedValue(targetUser as any);
      mockRepo.isFollowing.mockResolvedValue(false as any);
      const dbError = Object.assign(new Error("DB connection"), { code: "P1001" });
      mockRepo.follow.mockRejectedValue(dbError);

      await expect(
        followsService.follow("follower-1", "targetuser")
      ).rejects.toThrow("DB connection");
    });

    it("emits USER_FOLLOWED event with correct payload", async () => {
      mockPrisma.user.findUnique.mockResolvedValue(targetUser as any);
      mockRepo.isFollowing.mockResolvedValue(false as any);
      mockRepo.follow.mockResolvedValue({} as any);
      mockRepo.getFollowCounts.mockResolvedValue(makeFollowCounts());

      await followsService.follow("follower-1", "targetuser");

      expect(mockEmitEvent).toHaveBeenCalledTimes(1);
      expect(mockEmitEvent).toHaveBeenCalledWith(FollowEvents.USER_FOLLOWED, {
        followerId: "follower-1",
        followingId: "target-1",
      });
    });
  });

  // =========================================================================
  // unfollow
  // =========================================================================

  describe("unfollow", () => {
    it("unfollows a user successfully", async () => {
      mockPrisma.user.findUnique.mockResolvedValue(targetUser as any);
      mockRepo.unfollow.mockResolvedValue(true);
      mockRepo.getFollowCounts.mockResolvedValue(makeFollowCounts());

      const result = await followsService.unfollow("follower-1", "targetuser");

      expect(result.following).toBe(false);
      expect(mockRepo.unfollow).toHaveBeenCalledWith("follower-1", "target-1");
      expect(mockEmitEvent).toHaveBeenCalledWith(FollowEvents.USER_UNFOLLOWED, {
        followerId: "follower-1",
        followingId: "target-1",
      });
    });

    it("is idempotent when not following", async () => {
      mockPrisma.user.findUnique.mockResolvedValue(targetUser as any);
      mockRepo.unfollow.mockResolvedValue(false);
      mockRepo.getFollowCounts.mockResolvedValue(makeFollowCounts());

      const result = await followsService.unfollow("follower-1", "targetuser");

      expect(result.following).toBe(false);
      expect(mockEmitEvent).not.toHaveBeenCalled();
    });

    it("throws NotFoundError when target user does not exist", async () => {
      mockPrisma.user.findUnique.mockResolvedValue(null);

      await expect(
        followsService.unfollow("follower-1", "nonexistent")
      ).rejects.toMatchObject({ statusCode: 404 });
    });

    it("emits USER_UNFOLLOWED event only when a follow was removed", async () => {
      mockPrisma.user.findUnique.mockResolvedValue(targetUser as any);
      mockRepo.unfollow.mockResolvedValue(true);
      mockRepo.getFollowCounts.mockResolvedValue(makeFollowCounts());

      await followsService.unfollow("follower-1", "targetuser");

      expect(mockEmitEvent).toHaveBeenCalledTimes(1);
      expect(mockEmitEvent).toHaveBeenCalledWith(FollowEvents.USER_UNFOLLOWED, {
        followerId: "follower-1",
        followingId: "target-1",
      });
    });

    it("does not emit event when no follow was removed", async () => {
      mockPrisma.user.findUnique.mockResolvedValue(targetUser as any);
      mockRepo.unfollow.mockResolvedValue(false);
      mockRepo.getFollowCounts.mockResolvedValue(makeFollowCounts());

      await followsService.unfollow("follower-1", "targetuser");

      expect(mockEmitEvent).not.toHaveBeenCalled();
    });
  });

  // =========================================================================
  // getFollowStatus
  // =========================================================================

  describe("getFollowStatus", () => {
    it("returns following status", async () => {
      mockPrisma.user.findUnique.mockResolvedValue(targetUser as any);
      mockRepo.isFollowing.mockResolvedValue(true as any);
      mockRepo.getFollowCounts.mockResolvedValue(makeFollowCounts());

      const result = await followsService.getFollowStatus("follower-1", "targetuser");

      expect(result.following).toBe(true);
      expect(result.followerCount).toBe(10);
      expect(result.followingCount).toBe(5);
    });

    it("returns false when not following", async () => {
      mockPrisma.user.findUnique.mockResolvedValue(targetUser as any);
      mockRepo.isFollowing.mockResolvedValue(false as any);
      mockRepo.getFollowCounts.mockResolvedValue(makeFollowCounts());

      const result = await followsService.getFollowStatus("follower-1", "targetuser");

      expect(result.following).toBe(false);
    });

    it("throws NotFoundError when target user does not exist", async () => {
      mockPrisma.user.findUnique.mockResolvedValue(null);

      await expect(
        followsService.getFollowStatus("follower-1", "nonexistent")
      ).rejects.toMatchObject({ statusCode: 404 });
    });
  });

  // =========================================================================
  // getFollowCounts
  // =========================================================================

  describe("getFollowCounts", () => {
    it("returns follower and following counts", async () => {
      mockRepo.getFollowCounts.mockResolvedValue({ followers: 42, following: 17 });

      const result = await followsService.getFollowCounts("user-1");

      expect(result.followers).toBe(42);
      expect(result.following).toBe(17);
      expect(mockRepo.getFollowCounts).toHaveBeenCalledWith("user-1");
    });
  });

  // =========================================================================
  // listFollowers
  // =========================================================================

  describe("listFollowers", () => {
    const followers = [
      makeFollowListItem("user-2", "alice"),
      makeFollowListItem("user-3", "bob"),
    ];

    it("returns paginated followers", async () => {
      mockPrisma.user.findUnique.mockResolvedValue({ id: "user-1" } as any);
      mockRepo.listFollowers.mockResolvedValue(followers as any);
      mockRepo.countFollowers.mockResolvedValue(25);

      const result = await followsService.listFollowers("targetuser", { page: 1, limit: 20 });

      expect(result.data).toHaveLength(2);
      expect(result.data[0].user.username).toBe("alice");
      expect(result.pagination.total).toBe(25);
      expect(result.pagination.totalPages).toBe(2);
      expect(result.pagination.page).toBe(1);
      expect(result.pagination.limit).toBe(20);
    });

    it("enriches with isFollowing when viewer is authenticated", async () => {
      mockPrisma.user.findUnique.mockResolvedValue({ id: "user-1" } as any);
      mockRepo.listFollowers.mockResolvedValue(followers as any);
      mockRepo.countFollowers.mockResolvedValue(2);
      mockRepo.getFollowedIds.mockResolvedValue(new Set(["user-2"]));

      const result = await followsService.listFollowers("targetuser", { page: 1, limit: 20 }, "viewer-1");

      expect(result.data[0].isFollowing).toBe(true);
      expect(result.data[1].isFollowing).toBe(false);
      expect(mockRepo.getFollowedIds).toHaveBeenCalledWith("viewer-1", ["user-2", "user-3"]);
    });

    it("does not call getFollowedIds when no viewer", async () => {
      mockPrisma.user.findUnique.mockResolvedValue({ id: "user-1" } as any);
      mockRepo.listFollowers.mockResolvedValue(followers as any);
      mockRepo.countFollowers.mockResolvedValue(2);

      const result = await followsService.listFollowers("targetuser", { page: 1, limit: 20 });

      expect(result.data[0]).not.toHaveProperty("isFollowing");
      expect(mockRepo.getFollowedIds).not.toHaveBeenCalled();
    });

    it("does not call getFollowedIds when list is empty", async () => {
      mockPrisma.user.findUnique.mockResolvedValue({ id: "user-1" } as any);
      mockRepo.listFollowers.mockResolvedValue([]);
      mockRepo.countFollowers.mockResolvedValue(0);

      const result = await followsService.listFollowers("targetuser", { page: 1, limit: 20 }, "viewer-1");

      expect(result.data).toHaveLength(0);
      expect(mockRepo.getFollowedIds).not.toHaveBeenCalled();
    });

    it("defaults page to 1 and limit to 20", async () => {
      mockPrisma.user.findUnique.mockResolvedValue({ id: "user-1" } as any);
      mockRepo.listFollowers.mockResolvedValue([]);
      mockRepo.countFollowers.mockResolvedValue(0);

      await followsService.listFollowers("targetuser", {});

      expect(mockRepo.listFollowers).toHaveBeenCalledWith("user-1", { skip: 0, take: 20 });
    });

    it("enforces max limit of 100", async () => {
      mockPrisma.user.findUnique.mockResolvedValue({ id: "user-1" } as any);
      mockRepo.listFollowers.mockResolvedValue([]);
      mockRepo.countFollowers.mockResolvedValue(0);

      await followsService.listFollowers("targetuser", { page: 1, limit: 200 });

      expect(mockRepo.listFollowers).toHaveBeenCalledWith("user-1", { skip: 0, take: 100 });
    });

    it("calculates skip from page and limit", async () => {
      mockPrisma.user.findUnique.mockResolvedValue({ id: "user-1" } as any);
      mockRepo.listFollowers.mockResolvedValue([]);
      mockRepo.countFollowers.mockResolvedValue(50);

      await followsService.listFollowers("targetuser", { page: 3, limit: 10 });

      expect(mockRepo.listFollowers).toHaveBeenCalledWith("user-1", { skip: 20, take: 10 });
    });

    it("throws NotFoundError when user does not exist", async () => {
      mockPrisma.user.findUnique.mockResolvedValue(null);

      await expect(
        followsService.listFollowers("nonexistent", { page: 1, limit: 20 })
      ).rejects.toMatchObject({ statusCode: 404 });
    });
  });

  // =========================================================================
  // listFollowing
  // =========================================================================

  describe("listFollowing", () => {
    const following = [
      makeFollowingListItem("user-2", "alice"),
      makeFollowingListItem("user-3", "bob"),
    ];

    it("returns paginated following", async () => {
      mockPrisma.user.findUnique.mockResolvedValue({ id: "user-1" } as any);
      mockRepo.listFollowing.mockResolvedValue(following as any);
      mockRepo.countFollowing.mockResolvedValue(15);

      const result = await followsService.listFollowing("targetuser", { page: 1, limit: 20 });

      expect(result.data).toHaveLength(2);
      expect(result.data[0].user.username).toBe("alice");
      expect(result.pagination.total).toBe(15);
      expect(result.pagination.totalPages).toBe(1);
    });

    it("enriches with isFollowing when viewer is authenticated", async () => {
      mockPrisma.user.findUnique.mockResolvedValue({ id: "user-1" } as any);
      mockRepo.listFollowing.mockResolvedValue(following as any);
      mockRepo.countFollowing.mockResolvedValue(2);
      mockRepo.getFollowedIds.mockResolvedValue(new Set(["user-3"]));

      const result = await followsService.listFollowing("targetuser", { page: 1, limit: 20 }, "viewer-1");

      expect(result.data[0].isFollowing).toBe(false);
      expect(result.data[1].isFollowing).toBe(true);
      expect(mockRepo.getFollowedIds).toHaveBeenCalledWith("viewer-1", ["user-2", "user-3"]);
    });

    it("does not call getFollowedIds when no viewer", async () => {
      mockPrisma.user.findUnique.mockResolvedValue({ id: "user-1" } as any);
      mockRepo.listFollowing.mockResolvedValue(following as any);
      mockRepo.countFollowing.mockResolvedValue(2);

      const result = await followsService.listFollowing("targetuser", { page: 1, limit: 20 });

      expect(result.data[0]).not.toHaveProperty("isFollowing");
      expect(mockRepo.getFollowedIds).not.toHaveBeenCalled();
    });

    it("does not call getFollowedIds when list is empty", async () => {
      mockPrisma.user.findUnique.mockResolvedValue({ id: "user-1" } as any);
      mockRepo.listFollowing.mockResolvedValue([]);
      mockRepo.countFollowing.mockResolvedValue(0);

      const result = await followsService.listFollowing("targetuser", { page: 1, limit: 20 }, "viewer-1");

      expect(result.data).toHaveLength(0);
      expect(mockRepo.getFollowedIds).not.toHaveBeenCalled();
    });

    it("defaults page to 1 and limit to 20", async () => {
      mockPrisma.user.findUnique.mockResolvedValue({ id: "user-1" } as any);
      mockRepo.listFollowing.mockResolvedValue([]);
      mockRepo.countFollowing.mockResolvedValue(0);

      await followsService.listFollowing("targetuser", {});

      expect(mockRepo.listFollowing).toHaveBeenCalledWith("user-1", { skip: 0, take: 20 });
    });

    it("enforces max limit of 100", async () => {
      mockPrisma.user.findUnique.mockResolvedValue({ id: "user-1" } as any);
      mockRepo.listFollowing.mockResolvedValue([]);
      mockRepo.countFollowing.mockResolvedValue(0);

      await followsService.listFollowing("targetuser", { page: 1, limit: 200 });

      expect(mockRepo.listFollowing).toHaveBeenCalledWith("user-1", { skip: 0, take: 100 });
    });

    it("calculates skip from page and limit", async () => {
      mockPrisma.user.findUnique.mockResolvedValue({ id: "user-1" } as any);
      mockRepo.listFollowing.mockResolvedValue([]);
      mockRepo.countFollowing.mockResolvedValue(50);

      await followsService.listFollowing("targetuser", { page: 4, limit: 5 });

      expect(mockRepo.listFollowing).toHaveBeenCalledWith("user-1", { skip: 15, take: 5 });
    });

    it("throws NotFoundError when user does not exist", async () => {
      mockPrisma.user.findUnique.mockResolvedValue(null);

      await expect(
        followsService.listFollowing("nonexistent", { page: 1, limit: 20 })
      ).rejects.toMatchObject({ statusCode: 404 });
    });
  });
});
