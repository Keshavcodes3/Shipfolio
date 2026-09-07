import { prisma } from "../../../config/database.js";
import type { Prisma } from "@prisma/client";

// ---------------------------------------------------------------------------
// Shared include fragment — technologies for every project query
// ---------------------------------------------------------------------------

const projectTechnologiesInclude = {
  technologies: {
    include: { technology: { select: { id: true, name: true, slug: true, category: true } } },
    orderBy: { isPrimary: "desc" as const },
  },
} satisfies Prisma.ProjectInclude;

const projectDetailInclude = {
  ...projectTechnologiesInclude,
  user: {
    select: {
      id: true,
      username: true,
      name: true,
      avatarUrl: true,
    },
  },
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
  _count: { select: { activities: true } },
} satisfies Prisma.ProjectInclude;

const projectDetailWithActivityInclude = {
  ...projectDetailInclude,
  activities: {
    orderBy: { occurredAt: "desc" as const },
    take: 20,
  },
} satisfies Prisma.ProjectInclude;

// ---------------------------------------------------------------------------
// Repository
// ---------------------------------------------------------------------------

export const projectsRepository = {
  // -------------------------------------------------------------------------
  // Reads
  // -------------------------------------------------------------------------

  findAll: (args?: Prisma.ProjectFindManyArgs) =>
    prisma.project.findMany(args),

  findById: (id: string, include?: Prisma.ProjectInclude) =>
    prisma.project.findUnique({ where: { id }, include }),

  findByUserAndSlug: (userId: string, slug: string, include?: Prisma.ProjectInclude) =>
    prisma.project.findUnique({
      where: { userId_slug: { userId, slug } },
      include,
    }),

  findByUserId: (userId: string, args?: Prisma.ProjectFindManyArgs) =>
    prisma.project.findMany({
      where: { userId },
      ...args,
    }),

  findFeaturedByUserId: (userId: string) =>
    prisma.project.findMany({
      where: { userId, isFeatured: true, visibility: "PUBLIC" },
      orderBy: { updatedAt: "desc" },
      include: {
        ...projectTechnologiesInclude,
        user: { select: { id: true, username: true, name: true, avatarUrl: true } },
      },
    }),

  /**
   * Global featured public projects across all users.
   */
  findGlobalFeatured: () =>
    prisma.project.findMany({
      where: { isFeatured: true, visibility: "PUBLIC" },
      orderBy: { updatedAt: "desc" },
      take: 10,
      include: {
        ...projectTechnologiesInclude,
        user: { select: { id: true, username: true, name: true, avatarUrl: true } },
        githubRepo: {
          select: { stars: true },
        },
      },
    }),

  /**
   * Top builders — users with the most public projects and followers.
   */
  findTopBuilders: (take: number = 10) =>
    prisma.user.findMany({
      take,
      orderBy: { projects: { _count: "desc" } },
      select: {
        id: true,
        username: true,
        name: true,
        avatarUrl: true,
        bio: true,
        _count: {
          select: {
            projects: { where: { visibility: "PUBLIC" } },
            followers: true,
          },
        },
      },
    }),

  findCurrentlyBuilding: (userId: string) =>
    prisma.project.findFirst({
      where: { userId, isCurrentlyBuilding: true, visibility: "PUBLIC" },
      include: projectTechnologiesInclude,
    }),

  /**
   * Public projects only, paginated with technologies + user.
   * Merges visibility: "PUBLIC" into the caller's where clause.
   */
  findPublicProjects: (args: Prisma.ProjectFindManyArgs) =>
    prisma.project.findMany({
      ...args,
      where: { ...args.where, visibility: "PUBLIC" },
      include: {
        ...projectTechnologiesInclude,
        user: { select: { id: true, username: true, name: true, avatarUrl: true } },
      },
    }),

  /**
   * All projects for a specific user (owner view — includes private).
   */
  findUserProjects: (userId: string, args: Prisma.ProjectFindManyArgs) =>
    prisma.project.findMany({
      where: { userId },
      ...args,
      include: projectTechnologiesInclude,
    }),

  /**
   * Full project detail by id — technologies + github + activity count.
   */
  findDetailById: (id: string) =>
    prisma.project.findUnique({
      where: { id },
      include: projectDetailInclude,
    }),

  /**
   * Full project detail by id with recent activities — for owner view.
   */
  findDetailByIdWithActivities: (id: string) =>
    prisma.project.findUnique({
      where: { id },
      include: projectDetailWithActivityInclude,
    }),

  count: (where?: Prisma.ProjectWhereInput) =>
    prisma.project.count({ where }),

  countByUserId: (userId: string, where?: Prisma.ProjectWhereInput) =>
    prisma.project.count({ where: { userId, ...where } }),

  slugExists: (userId: string, slug: string) =>
    prisma.project.findUnique({
      where: { userId_slug: { userId, slug } },
      select: { id: true },
    }).then(Boolean),

  slugExistsExcluding: (userId: string, slug: string, excludeId: string) =>
    prisma.project.findFirst({
      where: { userId, slug, id: { not: excludeId } },
      select: { id: true },
    }).then(Boolean),

  /**
   * Simple update without transaction — for single-field updates like
   * connecting/disconnecting a GitHub repo.
   */
  update: (id: string, data: Prisma.ProjectUpdateInput) =>
    prisma.project.update({ where: { id }, data }),

  // -------------------------------------------------------------------------
  // Writes — transactions for multi-step operations
  // -------------------------------------------------------------------------

  /**
   * Create a project with its technology associations in a single transaction.
   */
  createWithTechnologies: (
    data: Omit<Prisma.ProjectUncheckedCreateInput, "technologies">,
    technologyMeta: Array<{ technologyId: string; isPrimary: boolean }>,
  ) =>
    prisma.$transaction(async (tx) => {
      const project = await tx.project.create({
        data: {
          ...data,
          technologies: {
            create: technologyMeta.map((t) => ({
              technology: { connect: { id: t.technologyId } },
              isPrimary: t.isPrimary,
            })),
          },
        },
        include: projectTechnologiesInclude,
      });
      return project;
    }),

  /**
   * Update a project and sync its technology associations in a transaction.
   * When `technologyIds` is provided, replaces all existing associations.
   */
  updateWithTechnologies: (
    id: string,
    data: Prisma.ProjectUpdateInput,
    technologyMeta?: Array<{ technologyId: string; isPrimary: boolean }>,
  ) =>
    prisma.$transaction(async (tx) => {
      // If technologies are being replaced, delete old ones first
      if (technologyMeta !== undefined) {
        await tx.projectTechnology.deleteMany({ where: { projectId: id } });
      }

      const project = await tx.project.update({
        where: { id },
        data: {
          ...data,
          ...(technologyMeta !== undefined
            ? {
                technologies: {
                  create: technologyMeta.map((t) => ({
                    technology: { connect: { id: t.technologyId } },
                    isPrimary: t.isPrimary,
                  })),
                },
              }
            : {}),
        },
        include: projectTechnologiesInclude,
      });
      return project;
    }),

  /**
   * Clear isCurrentlyBuilding for all of a user's projects.
   * Used before setting a new currently-building project.
   */
  clearCurrentlyBuilding: (userId: string) =>
    prisma.project.updateMany({
      where: { userId, isCurrentlyBuilding: true },
      data: { isCurrentlyBuilding: false },
    }),

  /**
   * Atomically clear existing currently-building and set a new one.
   * Prevents race conditions where two concurrent requests could both
   * clear and then both set different projects.
   */
  setCurrentlyBuilding: (userId: string, projectId: string) =>
    prisma.$transaction(async (tx) => {
      // Clear all currently-building for this user
      await tx.project.updateMany({
        where: { userId, isCurrentlyBuilding: true },
        data: { isCurrentlyBuilding: false },
      });
      // Set the new one
      return tx.project.update({
        where: { id: projectId },
        data: { isCurrentlyBuilding: true },
      });
    }),

  unlinkGithubRepo: (id: string) =>
    prisma.project.update({
      where: { id },
      data: { githubRepo: { disconnect: true } },
    }),

  delete: (id: string) =>
    prisma.project.delete({ where: { id } }),

  deleteByOwner: (id: string, userId: string) =>
    prisma.project.deleteMany({
      where: { id, userId },
    }).then((result) => result.count > 0),
};

export default projectsRepository;
