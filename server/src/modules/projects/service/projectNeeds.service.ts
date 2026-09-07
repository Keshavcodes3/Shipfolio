import { projectNeedsRepository } from "../repository/projectNeeds.repository.js";
import type {
  CreateProjectNeedInput,
  UpdateProjectNeedInput,
  ExpressInterestInput,
  ProjectNeedResponse,
  ProjectNeedWithInterestsResponse,
  DiscoverNeedItem,
  ProjectNeedsQuery,
  DiscoverNeedsQuery,
} from "../types/projectNeed.types.js";
import { NotFoundError, ConflictError, BadRequestError, ForbiddenError } from "../../../shared/errors/index.js";
import { getPagination, buildPaginatedResponse } from "../../../shared/utils/index.js";
import type { PaginatedResponse } from "../../../shared/types/index.js";

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

const toNeedResponse = (need: any): ProjectNeedResponse => ({
  id: need.id,
  projectId: need.projectId,
  type: need.type,
  note: need.note,
  interestCount: need._count?.interests ?? 0,
  createdAt: need.createdAt,
  updatedAt: need.updatedAt,
});

const toNeedWithInterestsResponse = (need: any): ProjectNeedWithInterestsResponse => ({
  id: need.id,
  projectId: need.projectId,
  type: need.type,
  note: need.note,
  interestCount: need.interests?.length ?? 0,
  createdAt: need.createdAt,
  updatedAt: need.updatedAt,
  interests: (need.interests ?? []).map((i: any) => ({
    id: i.id,
    needId: i.needId,
    userId: i.userId,
    message: i.message,
    createdAt: i.createdAt,
    user: {
      id: i.user.id,
      username: i.user.username,
      displayName: i.user.name,
      avatarUrl: i.user.avatarUrl,
    },
  })),
});

// ---------------------------------------------------------------------------
// Service
// ---------------------------------------------------------------------------

export const projectNeedsService = {
  // -------------------------------------------------------------------------
  // List needs for a project
  // -------------------------------------------------------------------------

  async listByProject(
    projectId: string,
    query: ProjectNeedsQuery,
  ): Promise<PaginatedResponse<ProjectNeedResponse>> {
    const { page, limit, skip, take } = getPagination(query.page, query.limit);

    const [needs, total] = await Promise.all([
      projectNeedsRepository.findByProjectId(projectId, query.type),
      projectNeedsRepository.countByProject(projectId),
    ]);

    // Apply manual pagination (small datasets)
    const paginated = needs.slice(skip, skip + take);

    return buildPaginatedResponse(
      paginated.map(toNeedResponse),
      total,
      page,
      limit,
    );
  },

  // -------------------------------------------------------------------------
  // Get a single need with interests
  // -------------------------------------------------------------------------

  async getById(id: string): Promise<ProjectNeedWithInterestsResponse> {
    const need = await projectNeedsRepository.findById(id);
    if (!need) throw new NotFoundError("Project need not found");
    return toNeedWithInterestsResponse(need);
  },

  // -------------------------------------------------------------------------
  // Create a need
  // -------------------------------------------------------------------------

  async create(
    projectId: string,
    userId: string,
    input: CreateProjectNeedInput,
  ): Promise<ProjectNeedResponse> {
    // Verify project exists and user owns it
    const project = await projectNeedsRepository.getProjectOwner(projectId);
    if (!project) throw new NotFoundError("Project not found");
    if (project.userId !== userId) throw new ForbiddenError("You can only add needs to your own projects");

    // Check uniqueness (one need per type per project)
    const existing = await projectNeedsRepository.findByProjectAndType(projectId, input.type);
    if (existing) throw new ConflictError(`You already have a "${input.type}" need for this project`);

    const need = await projectNeedsRepository.create({
      projectId,
      type: input.type,
      note: input.note ?? undefined,
    });

    return toNeedResponse({ ...need, _count: { interests: 0 } });
  },

  // -------------------------------------------------------------------------
  // Update a need (note only)
  // -------------------------------------------------------------------------

  async update(
    id: string,
    userId: string,
    input: UpdateProjectNeedInput,
  ): Promise<ProjectNeedResponse> {
    const existing = await projectNeedsRepository.findById(id);
    if (!existing) throw new NotFoundError("Project need not found");
    if (existing.project.userId !== userId) throw new ForbiddenError("You can only update your own project needs");

    const updated = await projectNeedsRepository.update(id, {
      note: input.note,
    });

    return toNeedResponse({ ...updated, _count: { interests: existing.interests?.length ?? 0 } });
  },

  // -------------------------------------------------------------------------
  // Delete a need
  // -------------------------------------------------------------------------

  async remove(id: string, userId: string): Promise<void> {
    const existing = await projectNeedsRepository.findById(id);
    if (!existing) throw new NotFoundError("Project need not found");
    if (existing.project.userId !== userId) throw new ForbiddenError("You can only delete your own project needs");

    await projectNeedsRepository.delete(id);
  },

  // -------------------------------------------------------------------------
  // Express interest ("I CAN HELP")
  // -------------------------------------------------------------------------

  async expressInterest(
    needId: string,
    userId: string,
    input: ExpressInterestInput,
  ): Promise<{ interest: any; notify: boolean }> {
    const need = await projectNeedsRepository.findById(needId);
    if (!need) throw new NotFoundError("Project need not found");

    // Cannot express interest in your own need
    if (need.project.userId === userId) {
      throw new BadRequestError("You cannot express interest in your own project's need");
    }

    // Check if already expressed interest
    const existing = await projectNeedsRepository.findInterest(needId, userId);
    if (existing) throw new ConflictError("You have already expressed interest in this need");

    const interest = await projectNeedsRepository.createInterest({
      needId,
      userId,
      message: input.message ?? undefined,
    });

    return { interest, notify: true };
  },

  // -------------------------------------------------------------------------
  // Withdraw interest
  // -------------------------------------------------------------------------

  async withdrawInterest(needId: string, userId: string): Promise<void> {
    const existing = await projectNeedsRepository.findInterest(needId, userId);
    if (!existing) throw new NotFoundError("Interest not found");

    await projectNeedsRepository.deleteInterest(needId, userId);
  },

  // -------------------------------------------------------------------------
  // Discover needs (public feed)
  // -------------------------------------------------------------------------

  async discoverNeeds(
    query: DiscoverNeedsQuery,
  ): Promise<PaginatedResponse<DiscoverNeedItem>> {
    const { page, limit, skip, take } = getPagination(query.page, query.limit);

    const where: any = {};
    if (query.type) where.type = query.type;
    if (query.technology) {
      where.project = {
        ...where.project,
        technologies: {
          some: {
            technology: {
              name: { equals: query.technology, mode: "insensitive" },
            },
          },
        },
      };
    }
    if (query.search) {
      where.OR = [
        { project: { name: { contains: query.search, mode: "insensitive" } } },
        { project: { description: { contains: query.search, mode: "insensitive" } } },
      ];
    }

    const [needs, total] = await Promise.all([
      projectNeedsRepository.findPublicNeeds({
        where,
        orderBy: { createdAt: "desc" },
        skip,
        take,
      }),
      projectNeedsRepository.countPublicNeeds(where),
    ]);

    const items: DiscoverNeedItem[] = needs.map((n: any) => ({
      need: toNeedResponse({ ...n, _count: { interests: 0 } }),
      project: {
        id: n.project.id,
        name: n.project.name,
        slug: n.project.slug,
        description: n.project.description,
        coverImageUrl: n.project.coverImageUrl,
        status: n.project.status,
        technologies: n.project.technologies.map((t: any) => t.technology),
      },
      owner: {
        id: n.project.user.id,
        username: n.project.user.username,
        displayName: n.project.user.name,
        avatarUrl: n.project.user.avatarUrl,
      },
    }));

    return buildPaginatedResponse(items, total, page, limit);
  },
};

export default projectNeedsService;
