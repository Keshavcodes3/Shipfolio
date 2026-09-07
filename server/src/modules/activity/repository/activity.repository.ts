import { prisma } from "../../../config/database.js";
import type { Prisma } from "@prisma/client";
import { ActivityType } from "@prisma/client";

export const activityRepository = {
  findAll: (args?: Prisma.ProjectActivityFindManyArgs) =>
    prisma.projectActivity.findMany(args),

  findById: (id: string, include?: Prisma.ProjectActivityInclude) =>
    prisma.projectActivity.findUnique({ where: { id }, include }),

  findByProjectId: (projectId: string, args?: Prisma.ProjectActivityFindManyArgs) =>
    prisma.projectActivity.findMany({
      where: { projectId },
      ...args,
    }),

  findByGithubRepoId: (githubRepoId: string, args?: Prisma.ProjectActivityFindManyArgs) =>
    prisma.projectActivity.findMany({
      where: { githubRepoId },
      ...args,
    }),

  findOrCreateByExternalId: (
    type: ActivityType,
    externalId: string,
    data: Omit<Prisma.ProjectActivityCreateInput, "type" | "externalId">
  ) =>
    prisma.projectActivity.upsert({
      where: { type_externalId: { type, externalId } },
      create: { type, externalId, ...data },
      update: data,
    }),

  create: (data: Prisma.ProjectActivityCreateInput) =>
    prisma.projectActivity.create({ data }),

  createMany: (data: Prisma.ProjectActivityCreateManyInput[]) =>
    prisma.projectActivity.createMany({ data, skipDuplicates: true }),

  update: (id: string, data: Prisma.ProjectActivityUpdateInput) =>
    prisma.projectActivity.update({ where: { id }, data }),

  /**
   * Updates an activity only if the project it belongs to is owned by the
   * specified user.  Returns `false` when the activity does not exist or
   * the ownership check fails.
   */
  updateByOwner: (id: string, userId: string, data: Prisma.ProjectActivityUpdateInput) =>
    prisma.projectActivity.updateMany({
      where: { id, project: { userId } },
      data,
    }).then((result) => result.count > 0),

  delete: (id: string) =>
    prisma.projectActivity.delete({ where: { id } }),

  /**
   * Deletes an activity only if the project it belongs to is owned by the
   * specified user.  Returns `false` when the activity does not exist or
   * the ownership check fails.
   */
  deleteByOwner: (id: string, userId: string) =>
    prisma.projectActivity.deleteMany({
      where: { id, project: { userId } },
    }).then((result) => result.count > 0),

  /**
   * Finds an activity by id, scoped to a specific user via the parent project.
   * Returns `null` when the activity does not exist or the user does not own
   * the parent project.
   */
  findByIdAndUser: (id: string, userId: string, include?: Prisma.ProjectActivityInclude) =>
    prisma.projectActivity.findFirst({
      where: { id, project: { userId } },
      include,
    }),

  deleteByProjectId: (projectId: string) =>
    prisma.projectActivity.deleteMany({ where: { projectId } }),

  count: (where?: Prisma.ProjectActivityWhereInput) =>
    prisma.projectActivity.count({ where }),

  getRecentByProjectId: (projectId: string, limit?: number) =>
    prisma.projectActivity.findMany({
      where: { projectId },
      orderBy: { occurredAt: "desc" },
      take: limit ?? 10,
    }),
};

export default activityRepository;
