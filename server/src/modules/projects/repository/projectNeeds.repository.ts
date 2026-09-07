import { prisma } from "../../../config/database.js";
import type { Prisma, ProjectNeedType } from "@prisma/client";

// ---------------------------------------------------------------------------
// Include fragment for need with interests + project + user
// ---------------------------------------------------------------------------

const needWithInterestsInclude = {
  interests: {
    include: {
      user: {
        select: { id: true, username: true, name: true, avatarUrl: true },
      },
    },
    orderBy: { createdAt: "desc" as const },
  },
} satisfies Prisma.ProjectNeedInclude;

const needWithProjectInclude = {
  project: {
    select: {
      id: true,
      name: true,
      slug: true,
      description: true,
      coverImageUrl: true,
      status: true,
      technologies: {
        select: {
          technology: { select: { id: true, name: true, slug: true } },
        },
      },
      user: {
        select: { id: true, username: true, name: true, avatarUrl: true },
      },
    },
  },
} satisfies Prisma.ProjectNeedInclude;

// ---------------------------------------------------------------------------
// Repository
// ---------------------------------------------------------------------------

export const projectNeedsRepository = {
  // -------------------------------------------------------------------------
  // Reads
  // -------------------------------------------------------------------------

  findByProjectId: (projectId: string, type?: ProjectNeedType) =>
    prisma.projectNeed.findMany({
      where: { projectId, ...(type ? { type } : {}) },
      orderBy: { createdAt: "desc" },
      include: {
        _count: { select: { interests: true } },
      },
    }),

  findById: (id: string) =>
    prisma.projectNeed.findUnique({
      where: { id },
      include: {
        ...needWithInterestsInclude,
        project: { select: { id: true, name: true, slug: true, userId: true } },
      },
    }),

  findByProjectAndType: (projectId: string, type: ProjectNeedType) =>
    prisma.projectNeed.findUnique({
      where: { projectId_type: { projectId, type } },
    }),

  countByProject: (projectId: string) =>
    prisma.projectNeed.count({ where: { projectId } }),

  // -------------------------------------------------------------------------
  // Discover — public needs across all projects
  // -------------------------------------------------------------------------

  findPublicNeeds: (
    args: Prisma.ProjectNeedFindManyArgs & { where?: Prisma.ProjectNeedWhereInput },
  ) =>
    prisma.projectNeed.findMany({
      ...args,
      where: {
        ...args.where,
        project: { visibility: "PUBLIC" },
      },
      include: needWithProjectInclude,
    }),

  countPublicNeeds: (where?: Prisma.ProjectNeedWhereInput) =>
    prisma.projectNeed.count({
      where: {
        ...where,
        project: { visibility: "PUBLIC" },
      },
    }),

  // -------------------------------------------------------------------------
  // Interest reads
  // -------------------------------------------------------------------------

  findInterest: (needId: string, userId: string) =>
    prisma.needInterest.findUnique({
      where: { needId_userId: { needId, userId } },
    }),

  findInterestsByUser: (userId: string) =>
    prisma.needInterest.findMany({
      where: { userId },
      include: {
        need: {
          include: {
            project: {
              select: { id: true, name: true, slug: true, coverImageUrl: true },
            },
          },
        },
      },
      orderBy: { createdAt: "desc" },
    }),

  countInterestsByNeed: (needId: string) =>
    prisma.needInterest.count({ where: { needId } }),

  // -------------------------------------------------------------------------
  // Writes
  // -------------------------------------------------------------------------

  create: (data: { projectId: string; type: ProjectNeedType; note?: string }) =>
    prisma.projectNeed.create({ data }),

  update: (id: string, data: { note?: string | null }) =>
    prisma.projectNeed.update({ where: { id }, data }),

  delete: (id: string) =>
    prisma.projectNeed.delete({ where: { id } }),

  deleteByProject: (projectId: string) =>
    prisma.projectNeed.deleteMany({ where: { projectId } }),

  createInterest: (data: { needId: string; userId: string; message?: string }) =>
    prisma.needInterest.create({ data }),

  deleteInterest: (needId: string, userId: string) =>
    prisma.needInterest.delete({
      where: { needId_userId: { needId, userId } },
    }),

  getProjectOwner: (projectId: string) =>
    prisma.project.findUnique({
      where: { id: projectId },
      select: { userId: true, name: true, slug: true },
    }),
};

export default projectNeedsRepository;
