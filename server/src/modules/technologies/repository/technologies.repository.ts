import { prisma } from "../../../config/database.js";
import type { Prisma } from "@prisma/client";

// ---------------------------------------------------------------------------
// Shared include fragment
// ---------------------------------------------------------------------------

const technologyInclude = {
  technology: true,
} satisfies Prisma.UserTechnologyInclude;

const projectTechnologyInclude = {
  technology: true,
} satisfies Prisma.ProjectTechnologyInclude;

// ---------------------------------------------------------------------------
// Repository
// ---------------------------------------------------------------------------

export const technologiesRepository = {
  // -------------------------------------------------------------------------
  // Technology CRUD
  // -------------------------------------------------------------------------

  findAll: (args?: Prisma.TechnologyFindManyArgs) =>
    prisma.technology.findMany(args),

  findById: (id: string) =>
    prisma.technology.findUnique({ where: { id } }),

  findBySlug: (slug: string) =>
    prisma.technology.findUnique({ where: { slug } }),

  findByName: (name: string) =>
    prisma.technology.findUnique({ where: { name } }),

  /**
   * Find or create a technology by name. Name is used for uniqueness
   * (PostgreSQL unique constraint) and slug is derived from the name.
   */
  findOrCreate: async (name: string, slug: string, category?: string) => {
    const existing = await prisma.technology.findUnique({ where: { name } });
    if (existing) return existing;
    return prisma.technology.create({ data: { name, slug, category } });
  },

  create: (data: Prisma.TechnologyCreateInput) =>
    prisma.technology.create({ data }),

  createMany: (data: Prisma.TechnologyCreateManyInput[]) =>
    prisma.technology.createMany({ data, skipDuplicates: true }),

  update: (id: string, data: Prisma.TechnologyUpdateInput) =>
    prisma.technology.update({ where: { id }, data }),

  delete: (id: string) =>
    prisma.technology.delete({ where: { id } }),

  count: (where?: Prisma.TechnologyWhereInput) =>
    prisma.technology.count({ where }),

  search: (query: string, limit?: number) =>
    prisma.technology.findMany({
      where: {
        OR: [
          { name: { contains: query, mode: "insensitive" } },
          { slug: { contains: query, mode: "insensitive" } },
        ],
      },
      take: limit ?? 20,
      orderBy: { name: "asc" },
    }),

  // -------------------------------------------------------------------------
  // User–Technology relationships
  // -------------------------------------------------------------------------

  getUserTechnologies: (userId: string) =>
    prisma.userTechnology.findMany({
      where: { userId },
      include: technologyInclude,
      orderBy: { isPrimary: "desc" },
    }),

  addUserTechnology: (userId: string, technologyId: string, isPrimary?: boolean) =>
    prisma.userTechnology.upsert({
      where: { userId_technologyId: { userId, technologyId } },
      create: { userId, technologyId, isPrimary: isPrimary ?? false },
      update: { isPrimary: isPrimary ?? false },
    }),

  removeUserTechnology: (userId: string, technologyId: string) =>
    prisma.userTechnology.delete({
      where: { userId_technologyId: { userId, technologyId } },
    }),

  hasUserTechnology: (userId: string, technologyId: string) =>
    prisma.userTechnology.findUnique({
      where: { userId_technologyId: { userId, technologyId } },
    }).then(Boolean),

  /**
   * Set a technology as primary for a user.
   * Clears isPrimary on all other user technologies, then sets this one.
   */
  setPrimaryUserTechnology: (userId: string, technologyId: string) =>
    prisma.$transaction([
      prisma.userTechnology.updateMany({
        where: { userId, isPrimary: true },
        data: { isPrimary: false },
      }),
      prisma.userTechnology.upsert({
        where: { userId_technologyId: { userId, technologyId } },
        create: { userId, technologyId, isPrimary: true },
        update: { isPrimary: true },
      }),
    ]),

  /**
   * Clear primary status for all user technologies.
   */
  clearPrimaryUserTechnologies: (userId: string) =>
    prisma.userTechnology.updateMany({
      where: { userId, isPrimary: true },
      data: { isPrimary: false },
    }),

  // -------------------------------------------------------------------------
  // Project–Technology relationships
  // -------------------------------------------------------------------------

  getProjectTechnologies: (projectId: string) =>
    prisma.projectTechnology.findMany({
      where: { projectId },
      include: projectTechnologyInclude,
      orderBy: { isPrimary: "desc" },
    }),

  addProjectTechnology: (projectId: string, technologyId: string, isPrimary?: boolean) =>
    prisma.projectTechnology.upsert({
      where: { projectId_technologyId: { projectId, technologyId } },
      create: { projectId, technologyId, isPrimary: isPrimary ?? false },
      update: { isPrimary: isPrimary ?? false },
    }),

  removeProjectTechnology: (projectId: string, technologyId: string) =>
    prisma.projectTechnology.delete({
      where: { projectId_technologyId: { projectId, technologyId } },
    }),

  hasProjectTechnology: (projectId: string, technologyId: string) =>
    prisma.projectTechnology.findUnique({
      where: { projectId_technologyId: { projectId, technologyId } },
    }).then(Boolean),

  /**
   * Set a technology as primary for a project.
   * Clears isPrimary on all other project technologies, then sets this one.
   */
  setPrimaryProjectTechnology: (projectId: string, technologyId: string) =>
    prisma.$transaction([
      prisma.projectTechnology.updateMany({
        where: { projectId, isPrimary: true },
        data: { isPrimary: false },
      }),
      prisma.projectTechnology.upsert({
        where: { projectId_technologyId: { projectId, technologyId } },
        create: { projectId, technologyId, isPrimary: true },
        update: { isPrimary: true },
      }),
    ]),

  /**
   * Clear primary status for all project technologies.
   */
  clearPrimaryProjectTechnologies: (projectId: string) =>
    prisma.projectTechnology.updateMany({
      where: { projectId, isPrimary: true },
      data: { isPrimary: false },
    }),

  // -------------------------------------------------------------------------
  // Sync operations (full replace)
  // -------------------------------------------------------------------------

  syncUserTechnologies: async (userId: string, technologies: { technologyId: string; isPrimary?: boolean }[]) => {
    await prisma.userTechnology.deleteMany({ where: { userId } });
    if (technologies.length === 0) return [];
    return prisma.userTechnology.createMany({
      data: technologies.map((t) => ({ userId, technologyId: t.technologyId, isPrimary: t.isPrimary ?? false })),
    });
  },

  syncProjectTechnologies: async (projectId: string, technologies: { technologyId: string; isPrimary?: boolean }[]) => {
    await prisma.projectTechnology.deleteMany({ where: { projectId } });
    if (technologies.length === 0) return [];
    return prisma.projectTechnology.createMany({
      data: technologies.map((t) => ({ projectId, technologyId: t.technologyId, isPrimary: t.isPrimary ?? false })),
    });
  },
};

export default technologiesRepository;
