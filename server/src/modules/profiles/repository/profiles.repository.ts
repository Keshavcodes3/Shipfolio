import { prisma } from "../../../config/database.js";
import type { Prisma } from "@prisma/client";

// ---------------------------------------------------------------------------
// Shared include fragment — the full profile data shape
// ---------------------------------------------------------------------------

const profileInclude = {
  projects: {
    where: { visibility: "PUBLIC" as const },
    orderBy: { updatedAt: "desc" as const },
    include: {
      technologies: { include: { technology: true } },
      githubRepo: {
        select: {
          id: true,
          name: true,
          fullName: true,
          htmlUrl: true,
          primaryLanguage: true,
          stars: true,
          forks: true,
        },
      },
    },
  },
  technologies: {
    include: { technology: true },
    orderBy: { isPrimary: "desc" as const },
  },
  education: {
    orderBy: { sortOrder: "asc" as const },
    select: {
      id: true,
      institution: true,
      degree: true,
      fieldOfStudy: true,
      startYear: true,
      endYear: true,
      description: true,
      sortOrder: true,
    },
  },
  experience: {
    orderBy: { sortOrder: "asc" as const },
    select: {
      id: true,
      company: true,
      role: true,
      startDate: true,
      endDate: true,
      description: true,
      technologies: true,
      sortOrder: true,
    },
  },
  githubAccount: {
    select: {
      username: true,
      repositories: {
        where: { isPrivate: false },
        orderBy: { stars: "desc" as const },
        select: {
          id: true,
          name: true,
          fullName: true,
          description: true,
          htmlUrl: true,
          primaryLanguage: true,
          stars: true,
          forks: true,
          isArchived: true,
        },
      },
    },
  },
  _count: {
    select: {
      followers: true,
      following: true,
      projects: true,
    },
  },
} satisfies Prisma.UserInclude;

// ---------------------------------------------------------------------------
// Repository
// ---------------------------------------------------------------------------

export const profilesRepository = {
  /**
   * Returns the full profile by username.
   * Also resolves via GitHub username if no User.username match is found.
   */
  findByUsername: async (username: string) => {
    let profile = await prisma.user.findUnique({
      where: { username },
      include: profileInclude,
    });

    // Fallback: try resolving by GitHub username
    if (!profile) {
      const ghAccount = await prisma.githubAccount.findFirst({
        where: { username },
        select: { userId: true },
      });
      if (ghAccount) {
        profile = await prisma.user.findUnique({
          where: { id: ghAccount.userId },
          include: profileInclude,
        });
      }
    }

    return profile;
  },

  /**
   * Returns the full profile by username, plus whether the viewer follows
   * this user (when `viewerId` is provided).
   * Also resolves via GitHub username if no User.username match is found.
   */
  findByUsernameWithFollowStatus: async (username: string, viewerId?: string) => {
    let profile = await prisma.user.findUnique({
      where: { username },
      include: profileInclude,
    });

    // Fallback: try resolving by GitHub username
    if (!profile) {
      const ghAccount = await prisma.githubAccount.findFirst({
        where: { username },
        select: { userId: true },
      });
      if (ghAccount) {
        profile = await prisma.user.findUnique({
          where: { id: ghAccount.userId },
          include: profileInclude,
        });
      }
    }

    if (!profile) return null;

    let isFollowing = false;
    if (viewerId && viewerId !== profile.id) {
      const follow = await prisma.follow.findUnique({
        where: {
          followerId_followingId: { followerId: viewerId, followingId: profile.id },
        },
        select: { followerId: true },
      });
      isFollowing = !!follow;
    }

    return { ...profile, isFollowing };
  },

  /**
   * Returns the user's own profile, including private data.
   */
  findOwnProfile: (userId: string) =>
    prisma.user.findUnique({
      where: { id: userId },
      include: {
        ...profileInclude,
        projects: {
          orderBy: { updatedAt: "desc" as const },
          include: {
            technologies: { include: { technology: true } },
            githubRepo: {
              select: {
                id: true,
                name: true,
                fullName: true,
                htmlUrl: true,
                primaryLanguage: true,
                stars: true,
                forks: true,
              },
            },
          },
        },
      },
    }),

  /**
   * Returns the currently-building project for a user.
   */
  findCurrentlyBuilding: (userId: string) =>
    prisma.project.findFirst({
      where: { userId, isCurrentlyBuilding: true, visibility: "PUBLIC" },
      include: {
        technologies: { include: { technology: true } },
        githubRepo: {
          select: {
            id: true,
            name: true,
            fullName: true,
            htmlUrl: true,
            primaryLanguage: true,
            stars: true,
            forks: true,
          },
        },
      },
    }),

  /**
   * Returns featured public projects for a user.
   */
  findFeaturedProjects: (userId: string) =>
    prisma.project.findMany({
      where: { userId, isFeatured: true, visibility: "PUBLIC" },
      orderBy: { updatedAt: "desc" },
      include: {
        technologies: { include: { technology: true } },
        githubRepo: {
          select: {
            id: true,
            name: true,
            fullName: true,
            htmlUrl: true,
            primaryLanguage: true,
            stars: true,
            forks: true,
          },
        },
      },
    }),

  /**
   * Count projects by status for a user (public projects only).
   */
  findProjectStatuses: async (userId: string) => {
    const counts = await prisma.project.groupBy({
      by: ["status"],
      where: { userId, visibility: "PUBLIC" },
      _count: { status: true },
    });

    const result: Record<string, number> = {
      BUILDING: 0,
      SHIPPED: 0,
      MAINTAINING: 0,
      PAUSED: 0,
      ARCHIVED: 0,
    };

    for (const c of counts) {
      result[c.status] = c._count.status;
    }

    return {
      building: result.BUILDING,
      shipped: result.SHIPPED,
      maintaining: result.MAINTAINING,
      paused: result.PAUSED,
      archived: result.ARCHIVED,
      total: counts.reduce((sum, c) => sum + c._count.status, 0),
    };
  },

  /**
   * Get technology usage stats across a user's public projects.
   */
  findTechnologyStack: (userId: string) =>
    prisma.projectTechnology.groupBy({
      by: ["technologyId"],
      where: {
        project: { userId, visibility: "PUBLIC" },
      },
      _count: { technologyId: true },
      orderBy: { _count: { technologyId: "desc" } },
    }),

  /**
   * Get GitHub activity summary grouped by type.
   */
  findGithubActivitySummary: (userId: string) =>
    prisma.projectActivity.groupBy({
      by: ["type"],
      where: {
        project: { userId, visibility: "PUBLIC" },
        githubRepoId: { not: null },
      },
      _count: { type: true },
      _max: { occurredAt: true },
      orderBy: { _count: { type: "desc" } },
    }),

  /**
   * Get build timeline — ordered list of projects with their statuses.
   */
  findBuildTimeline: (userId: string) =>
    prisma.project.findMany({
      where: { userId, visibility: "PUBLIC" },
      select: {
        id: true,
        name: true,
        slug: true,
        status: true,
        startedAt: true,
        updatedAt: true,
      },
      orderBy: { updatedAt: "desc" },
    }),

  /**
   * Returns recent activity for a user across all their projects.
   */
  findRecentActivity: (userId: string, limit = 10) =>
    prisma.projectActivity.findMany({
      where: { project: { userId } },
      orderBy: { occurredAt: "desc" },
      take: limit,
      include: {
        project: { select: { id: true, name: true, slug: true } },
      },
    }),

  usernameExists: (username: string) =>
    prisma.user.findUnique({
      where: { username },
      select: { id: true },
    }).then(Boolean),

  usernameExistsForOtherUser: (username: string, excludeUserId: string) =>
    prisma.user.findFirst({
      where: { username, id: { not: excludeUserId } },
      select: { id: true },
    }).then(Boolean),

  emailExistsForOtherUser: (email: string, excludeUserId: string) =>
    prisma.user.findFirst({
      where: { email, id: { not: excludeUserId } },
      select: { id: true },
    }).then(Boolean),

  findMany: (args: Prisma.UserFindManyArgs) =>
    prisma.user.findMany(args),

  count: (where?: Prisma.UserWhereInput) =>
    prisma.user.count({ where }),

  findFollowers: (userId: string, args: { skip: number; take: number }) =>
    prisma.follow.findMany({
      where: { followingId: userId },
      orderBy: { createdAt: "desc" },
      skip: args.skip,
      take: args.take,
      include: {
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

  countFollowers: (userId: string) =>
    prisma.follow.count({ where: { followingId: userId } }),

  findFollowing: (userId: string, args: { skip: number; take: number }) =>
    prisma.follow.findMany({
      where: { followerId: userId },
      orderBy: { createdAt: "desc" },
      skip: args.skip,
      take: args.take,
      include: {
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

  countFollowing: (userId: string) =>
    prisma.follow.count({ where: { followerId: userId } }),

  update: (id: string, data: Prisma.UserUpdateInput) =>
    prisma.user.update({ where: { id }, data }),
};

export default profilesRepository;
