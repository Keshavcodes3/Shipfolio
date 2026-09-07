import { profilesRepository } from "../repository/profiles.repository.js";
import { prisma } from "../../../config/database.js";
import { toPublicProfile, toPrivateProfile } from "../dto/profiles.dto.js";
import type {
  UpdateProfileInput,
  UsernameAvailabilityResult,
  ProfilesListQuery,
  ProfileFollowersQuery,
  ProfileFollowingQuery,
} from "../types/profiles.types.js";
import { NotFoundError, ConflictError, BadRequestError } from "../../../shared/errors/index.js";
import { PaginatedResponse } from "../../../shared/types/index.js";
import { createLogger } from "../../../shared/logger.js";
import { getCachedProfile, setCachedProfile, invalidateProfileCache } from "../../../shared/cache.js";

const log = createLogger("profiles-service");

const USERNAME_REGEX = /^[a-zA-Z0-9_-]+$/;

export const profilesService = {
  /**
   * Get a public profile by username.
   * Uses Redis cache with 5-minute TTL. Cache is invalidated on profile update,
   * project changes, and follow/unfollow events.
   */
  async getPublicProfile(username: string, viewerId?: string) {
    // Try cache first (only for unauthenticated or consistent views)
    const cacheKey = `${username}:${viewerId ?? "anon"}`;
    const cached = await getCachedProfile<any>(cacheKey);
    if (cached && !viewerId) {
      return cached;
    }

    const profile = await profilesRepository.findByUsernameWithFollowStatus(username, viewerId);
    if (!profile) throw new NotFoundError("User not found");

    // Fetch aggregated data in parallel — all scoped to this user
    const [
      currentlyBuilding,
      featuredProjects,
      projectStatuses,
      technologyStackRaw,
      githubActivityRaw,
      buildTimeline,
    ] = await Promise.all([
      profilesRepository.findCurrentlyBuilding(profile.id),
      profilesRepository.findFeaturedProjects(profile.id),
      profilesRepository.findProjectStatuses(profile.id),
      profilesRepository.findTechnologyStack(profile.id),
      profilesRepository.findGithubActivitySummary(profile.id),
      profilesRepository.findBuildTimeline(profile.id),
    ]);

    // Resolve technology names for the stack
    const techIds = technologyStackRaw.map((t) => t.technologyId);
    const technologies = techIds.length > 0
      ? await prisma.technology.findMany({
          where: { id: { in: techIds } },
          select: { id: true, name: true, slug: true },
        })
      : [];

    const techMap = new Map(technologies.map((t) => [t.id, t]));

    const technologyStack = technologyStackRaw
      .filter((t) => techMap.has(t.technologyId))
      .map((t) => ({
        ...techMap.get(t.technologyId)!,
        projectCount: t._count.technologyId,
        isPrimary: false,
      }));

    const githubActivity = githubActivityRaw.map((g) => ({
      type: g.type,
      count: g._count.type,
      latestAt: g._max.occurredAt,
    }));

    const result = toPublicProfile(profile, {
      isFollowing: profile.isFollowing,
      isOwnProfile: false,
      currentlyBuilding,
      featuredProjects,
      projectStatuses,
      technologyStack,
      githubActivity,
      buildTimeline,
    });

    // Cache the result (only for anonymous views to avoid stale isFollowing)
    if (!viewerId) {
      await setCachedProfile(cacheKey, result);
    }

    return result;
  },

  /**
   * Get the authenticated user's own private profile.
   */
  async getOwnProfile(userId: string) {
    const profile = await profilesRepository.findOwnProfile(userId);
    if (!profile) throw new NotFoundError("User not found");

    const recentActivity = await profilesRepository.findRecentActivity(userId, 10);

    // Also fetch aggregation data for own profile
    const [
      currentlyBuilding,
      featuredProjects,
      projectStatuses,
      technologyStackRaw,
      githubActivityRaw,
      buildTimeline,
    ] = await Promise.all([
      profilesRepository.findCurrentlyBuilding(userId),
      profilesRepository.findFeaturedProjects(userId),
      profilesRepository.findProjectStatuses(userId),
      profilesRepository.findTechnologyStack(userId),
      profilesRepository.findGithubActivitySummary(userId),
      profilesRepository.findBuildTimeline(userId),
    ]);

    const techIds = technologyStackRaw.map((t) => t.technologyId);
    const technologies = techIds.length > 0
      ? await prisma.technology.findMany({
          where: { id: { in: techIds } },
          select: { id: true, name: true, slug: true },
        })
      : [];

    const techMap = new Map(technologies.map((t) => [t.id, t]));
    const technologyStack = technologyStackRaw
      .filter((t) => techMap.has(t.technologyId))
      .map((t) => ({
        ...techMap.get(t.technologyId)!,
        projectCount: t._count.technologyId,
        isPrimary: false,
      }));

    const githubActivity = githubActivityRaw.map((g) => ({
      type: g.type,
      count: g._count.type,
      latestAt: g._max.occurredAt,
    }));

    return toPrivateProfile(profile, recentActivity, {
      isOwnProfile: true,
      currentlyBuilding,
      featuredProjects,
      projectStatuses,
      technologyStack,
      githubActivity,
      buildTimeline,
    });
  },

  /**
   * Update the authenticated user's profile.
   */
  async updateProfile(userId: string, input: UpdateProfileInput) {
    if (input.username) {
      const taken = await profilesRepository.usernameExistsForOtherUser(input.username, userId);
      if (taken) throw new ConflictError("Username already taken");
    }

    const data: Record<string, unknown> = {};
    if (input.username !== undefined) data.username = input.username;
    if (input.name !== undefined) data.name = input.name;
    if (input.bio !== undefined) data.bio = input.bio;
    if (input.location !== undefined) data.location = input.location;
    if (input.websiteUrl !== undefined) data.websiteUrl = input.websiteUrl;
    if (input.avatarUrl !== undefined) data.avatarUrl = input.avatarUrl;
    if (input.linkedinUrl !== undefined) data.linkedinUrl = input.linkedinUrl;

    if (Object.keys(data).length === 0) throw new BadRequestError("No fields to update");

    await profilesRepository.update(userId, data);

    // Invalidate profile cache by username and userId
    await invalidateProfileCache(userId).catch(() => {});
    if (input.username) {
      await invalidateProfileCache(input.username).catch(() => {});
    }
  },

  /**
   * Check if a username is available.
   */
  async checkUsernameAvailability(username: string): Promise<UsernameAvailabilityResult> {
    if (username.length < 3 || username.length > 30) {
      return { available: false, username };
    }
    if (!USERNAME_REGEX.test(username)) {
      return { available: false, username };
    }
    const taken = await profilesRepository.usernameExists(username);
    return { available: !taken, username };
  },

  /**
   * List users (paginated, for discovery / search).
   */
  async listUsers(query: ProfilesListQuery): Promise<PaginatedResponse<{
    id: string;
    username: string;
    name: string | null;
    avatarUrl: string | null;
    createdAt: Date;
  }>> {
    const page = query.page ?? 1;
    const limit = query.limit ?? 20;
    const skip = (page - 1) * limit;

    const where = query.search
      ? {
          OR: [
            { username: { contains: query.search, mode: "insensitive" as const } },
            { name: { contains: query.search, mode: "insensitive" as const } },
          ],
        }
      : undefined;

    const orderBy = { [query.sortBy ?? "createdAt"]: query.order ?? "desc" } as const;

    const [users, total] = await Promise.all([
      profilesRepository.findMany({
        where,
        orderBy,
        skip,
        take: limit,
        select: {
          id: true,
          username: true,
          name: true,
          avatarUrl: true,
          createdAt: true,
        },
      }),
      profilesRepository.count(where),
    ]);

    return {
      data: users,
      pagination: { page, limit, total, totalPages: Math.ceil(total / limit) },
    };
  },

  /**
   * Get a user's followers (paginated).
   */
  async getFollowers(
    username: string,
    query: ProfileFollowersQuery,
  ): Promise<PaginatedResponse<{
    id: string;
    username: string;
    name: string | null;
    avatarUrl: string | null;
  }>> {
    const profile = await profilesRepository.findByUsername(username);
    if (!profile) throw new NotFoundError("User not found");

    const page = query.page ?? 1;
    const limit = query.limit ?? 20;
    const skip = (page - 1) * limit;

    const [follows, total] = await Promise.all([
      profilesRepository.findFollowers(profile.id, { skip, take: limit }),
      profilesRepository.countFollowers(profile.id),
    ]);

    return {
      data: follows.map((f) => f.follower),
      pagination: { page, limit, total, totalPages: Math.ceil(total / limit) },
    };
  },

  /**
   * Get users this user is following (paginated).
   */
  async getFollowing(
    username: string,
    query: ProfileFollowingQuery,
  ): Promise<PaginatedResponse<{
    id: string;
    username: string;
    name: string | null;
    avatarUrl: string | null;
  }>> {
    const profile = await profilesRepository.findByUsername(username);
    if (!profile) throw new NotFoundError("User not found");

    const page = query.page ?? 1;
    const limit = query.limit ?? 20;
    const skip = (page - 1) * limit;

    const [follows, total] = await Promise.all([
      profilesRepository.findFollowing(profile.id, { skip, take: limit }),
      profilesRepository.countFollowing(profile.id),
    ]);

    return {
      data: follows.map((f) => f.following),
      pagination: { page, limit, total, totalPages: Math.ceil(total / limit) },
    };
  },
};

export default profilesService;
