import { followsRepository } from "../repository/follows.repository.js";
import { emitEvent } from "../../../shared/events/eventBus.js";
import { FollowEvents } from "../events/follows.events.js";
import { NotFoundError, BadRequestError } from "../../../shared/errors/index.js";
import { invalidateProfileCache } from "../../../shared/cache.js";
import type { FollowResult, FollowListQuery, FollowCountResult } from "../types/follows.types.js";
import type { PaginatedResponse } from "../../../shared/types/index.js";
import { createLogger } from "../../../shared/logger.js";

const log = createLogger("follows-service");

export const followsService = {
  /**
   * Follow a user. Idempotent — if already following, returns current state.
   * Prevents self-follows.
   */
  async follow(followerId: string, targetUsername: string): Promise<FollowResult> {
    // Resolve target user
    const { prisma } = await import("../../../config/database.js");
    const target = await prisma.user.findUnique({
      where: { username: targetUsername },
      select: { id: true },
    });
    if (!target) throw new NotFoundError("User not found");

    // Self-follow prevention
    if (followerId === target.id) {
      throw new BadRequestError("You cannot follow yourself");
    }

    // Idempotent: check if already following
    const alreadyFollowing = await followsRepository.isFollowing(followerId, target.id);
    if (alreadyFollowing) {
      const counts = await followsRepository.getFollowCounts(target.id);
      return { following: true, followers: counts.followers, followingCount: counts.following };
    }

    // Create follow — unique constraint prevents duplicates at DB level
    try {
      await followsRepository.follow(followerId, target.id);
    } catch (err: any) {
      // P2002 = unique constraint violation — treat as idempotent success
      if (err?.code === "P2002") {
        const counts = await followsRepository.getFollowCounts(target.id);
        return { following: true, followers: counts.followers, followingCount: counts.following };
      }
      throw err;
    }

    log.info({ followerId, followingId: target.id }, "User followed");

    const counts = await followsRepository.getFollowCounts(target.id);

    invalidateProfileCache(targetUsername).catch(() => {});

    emitEvent(FollowEvents.USER_FOLLOWED, {
      followerId,
      followingId: target.id,
    });

    return { following: true, followers: counts.followers, followingCount: counts.following };
  },

  /**
   * Unfollow a user. Idempotent — if not following, returns current state.
   */
  async unfollow(followerId: string, targetUsername: string): Promise<FollowResult> {
    const { prisma } = await import("../../../config/database.js");
    const target = await prisma.user.findUnique({
      where: { username: targetUsername },
      select: { id: true },
    });
    if (!target) throw new NotFoundError("User not found");

    const removed = await followsRepository.unfollow(followerId, target.id);

    if (removed) {
      log.info({ followerId, followingId: target.id }, "User unfollowed");
      invalidateProfileCache(targetUsername).catch(() => {});
      emitEvent(FollowEvents.USER_UNFOLLOWED, {
        followerId,
        followingId: target.id,
      });
    }

    const counts = await followsRepository.getFollowCounts(target.id);
    return { following: false, followers: counts.followers, followingCount: counts.following };
  },

  /**
   * Check if the authenticated user follows the target.
   */
  async getFollowStatus(followerId: string, targetUsername: string): Promise<FollowResult> {
    const { prisma } = await import("../../../config/database.js");
    const target = await prisma.user.findUnique({
      where: { username: targetUsername },
      select: { id: true },
    });
    if (!target) throw new NotFoundError("User not found");

    const isFollowing = await followsRepository.isFollowing(followerId, target.id);
    const counts = await followsRepository.getFollowCounts(target.id);
    return { following: isFollowing, followers: counts.followers, followingCount: counts.following };
  },

  /**
   * Get follower/following counts for a user.
   */
  async getFollowCounts(userId: string): Promise<FollowCountResult> {
    return followsRepository.getFollowCounts(userId);
  },

  /**
   * List followers with pagination.
   */
  async listFollowers(
    username: string,
    query: FollowListQuery,
    viewerId?: string,
  ): Promise<PaginatedResponse<{ user: { id: string; username: string; name: string | null; avatarUrl: string | null }; followedAt: Date; isFollowing?: boolean }>> {
    const { prisma } = await import("../../../config/database.js");
    const user = await prisma.user.findUnique({
      where: { username },
      select: { id: true },
    });
    if (!user) throw new NotFoundError("User not found");

    const page = query.page ?? 1;
    const limit = Math.min(query.limit ?? 20, 100);
    const skip = (page - 1) * limit;

    const [follows, total] = await Promise.all([
      followsRepository.listFollowers(user.id, { skip, take: limit }),
      followsRepository.countFollowers(user.id),
    ]);

    // Enrich with isFollowing if viewer is authenticated
    let enriched = follows.map((f) => ({
      user: f.follower,
      followedAt: f.createdAt,
    }));

    if (viewerId && enriched.length > 0) {
      const followerIds = enriched.map((e) => e.user.id);
      const followedIds = await followsRepository.getFollowedIds(viewerId, followerIds);
      enriched = enriched.map((e) => ({
        ...e,
        isFollowing: followedIds.has(e.user.id),
      }));
    }

    return {
      data: enriched,
      pagination: { page, limit, total, totalPages: Math.ceil(total / limit) },
    };
  },

  /**
   * List following with pagination.
   */
  async listFollowing(
    username: string,
    query: FollowListQuery,
    viewerId?: string,
  ): Promise<PaginatedResponse<{ user: { id: string; username: string; name: string | null; avatarUrl: string | null }; followedAt: Date; isFollowing?: boolean }>> {
    const { prisma } = await import("../../../config/database.js");
    const user = await prisma.user.findUnique({
      where: { username },
      select: { id: true },
    });
    if (!user) throw new NotFoundError("User not found");

    const page = query.page ?? 1;
    const limit = Math.min(query.limit ?? 20, 100);
    const skip = (page - 1) * limit;

    const [follows, total] = await Promise.all([
      followsRepository.listFollowing(user.id, { skip, take: limit }),
      followsRepository.countFollowing(user.id),
    ]);

    let enriched = follows.map((f) => ({
      user: f.following,
      followedAt: f.createdAt,
    }));

    if (viewerId && enriched.length > 0) {
      const followingIds = enriched.map((e) => e.user.id);
      const followedIds = await followsRepository.getFollowedIds(viewerId, followingIds);
      enriched = enriched.map((e) => ({
        ...e,
        isFollowing: followedIds.has(e.user.id),
      }));
    }

    return {
      data: enriched,
      pagination: { page, limit, total, totalPages: Math.ceil(total / limit) },
    };
  },
};

export default followsService;
