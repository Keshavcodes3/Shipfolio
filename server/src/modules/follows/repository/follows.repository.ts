import { prisma } from "../../../config/database.js";
import type { Prisma } from "@prisma/client";

// ---------------------------------------------------------------------------
// Repository
// ---------------------------------------------------------------------------

export const followsRepository = {
  /**
   * Check if followerId follows followingId.
   */
  isFollowing: (followerId: string, followingId: string) =>
    prisma.follow.findUnique({
      where: { followerId_followingId: { followerId, followingId } },
      select: { followerId: true },
    }).then(Boolean),

  /**
   * Follow a user. The composite unique constraint on (followerId, followingId)
   * prevents duplicates at the database level.
   */
  follow: (followerId: string, followingId: string) =>
    prisma.follow.create({
      data: { followerId, followingId },
      select: { followerId: true, followingId: true, createdAt: true },
    }),

  /**
   * Unfollow a user. Returns true if a follow was deleted, false if none existed.
   */
  unfollow: async (followerId: string, followingId: string): Promise<boolean> => {
    const result = await prisma.follow.deleteMany({
      where: { followerId, followingId },
    });
    return result.count > 0;
  },

  /**
   * Get follower count for a user.
   */
  countFollowers: (userId: string) =>
    prisma.follow.count({ where: { followingId: userId } }),

  /**
   * Get following count for a user.
   */
  countFollowing: (userId: string) =>
    prisma.follow.count({ where: { followerId: userId } }),

  /**
   * Get both follower and following counts in a single query.
   */
  getFollowCounts: async (userId: string) => {
    const [followers, following] = await Promise.all([
      prisma.follow.count({ where: { followingId: userId } }),
      prisma.follow.count({ where: { followerId: userId } }),
    ]);
    return { followers, following };
  },

  /**
   * List followers with pagination. Avoids N+1 by selecting only needed fields.
   */
  listFollowers: (userId: string, args: { skip: number; take: number }) =>
    prisma.follow.findMany({
      where: { followingId: userId },
      orderBy: { createdAt: "desc" },
      skip: args.skip,
      take: args.take,
      select: {
        createdAt: true,
        follower: {
          select: {
            id: true,
            username: true,
            name: true,
            avatarUrl: true,
          },
        },
      },
    }),

  /**
   * List following with pagination.
   */
  listFollowing: (userId: string, args: { skip: number; take: number }) =>
    prisma.follow.findMany({
      where: { followerId: userId },
      orderBy: { createdAt: "desc" },
      skip: args.skip,
      take: args.take,
      select: {
        createdAt: true,
        following: {
          select: {
            id: true,
            username: true,
            name: true,
            avatarUrl: true,
          },
        },
      },
    }),

  /**
   * Check if viewer follows a list of user IDs.
   * Returns a Set of followed user IDs.
   */
  getFollowedIds: async (followerId: string, userIds: string[]): Promise<Set<string>> => {
    if (userIds.length === 0) return new Set();
    const follows = await prisma.follow.findMany({
      where: {
        followerId,
        followingId: { in: userIds },
      },
      select: { followingId: true },
    });
    return new Set(follows.map((f) => f.followingId));
  },

  /**
   * Delete all follows where the user is the follower (used during account deletion).
   */
  deleteByFollower: (followerId: string) =>
    prisma.follow.deleteMany({ where: { followerId } }),

  /**
   * Delete all follows where the user is being followed (used during account deletion).
   */
  deleteByFollowing: (followingId: string) =>
    prisma.follow.deleteMany({ where: { followingId } }),
};

export default followsRepository;
