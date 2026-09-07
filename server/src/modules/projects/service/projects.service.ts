import { projectsRepository } from "../repository/projects.repository.js";
import { toProjectResponse, toProjectDetailResponse } from "../dto/projects.dto.js";
import type {
  CreateProjectInput,
  UpdateProjectInput,
  ProjectListQuery,
  ProjectResponse,
  ProjectDetailResponse,
} from "../types/projects.types.js";
import { NotFoundError, ConflictError, BadRequestError, ForbiddenError } from "../../../shared/errors/index.js";
import { slugify, getPagination, buildPaginatedResponse } from "../../../shared/utils/index.js";
import { emitEvent } from "../../../shared/events/eventBus.js";
import { ProjectEvents } from "../events/projects.events.js";
import { invalidateProfileCache } from "../../../shared/cache.js";
import type { PaginatedResponse } from "../../../shared/types/index.js";

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

/**
 * Generate a unique slug for a user's project.
 * Appends -2, -3, etc. on collision.
 */
const generateUniqueSlug = async (userId: string, name: string, excludeId?: string): Promise<string> => {
  let base = slugify(name);
  if (!base) base = "project";

  let slug = base;
  let counter = 2;

  const checkExists = excludeId
    ? (s: string) => projectsRepository.slugExistsExcluding(userId, s, excludeId)
    : (s: string) => projectsRepository.slugExists(userId, s);

  while (await checkExists(slug)) {
    slug = `${base}-${counter++}`;
  }

  return slug;
};

/**
 * Invalidate profile cache for the project owner.
 */
const invalidateOwnerProfileCache = async (userId: string) => {
  const { prisma } = await import("../../../config/database.js");
  const user = await prisma.user.findUnique({ where: { id: userId }, select: { username: true } });
  if (user) {
    await invalidateProfileCache(user.username).catch(() => {});
  }
};

/**
 * Enforce at most one currently-building project per user.
 * Clears the flag on any existing currently-building project.
 */
const enforceCurrentlyBuilding = async (userId: string, enable: boolean, projectId?: string) => {
  if (!enable) return;
  // Clear any other currently-building project first
  await projectsRepository.clearCurrentlyBuilding(userId);
};

/**
 * Build technology metadata array from IDs.
 * First technology is marked as primary by default.
 */
const buildTechnologyMeta = (technologyIds: string[]) =>
  technologyIds.map((id, index) => ({
    technologyId: id,
    isPrimary: index === 0,
  }));

// ---------------------------------------------------------------------------
// Service
// ---------------------------------------------------------------------------

export const projectsService = {
  // -------------------------------------------------------------------------
  // Create
  // -------------------------------------------------------------------------

  async create(userId: string, input: CreateProjectInput): Promise<ProjectDetailResponse> {
    const slug = await generateUniqueSlug(userId, input.name);

    const technologyMeta = input.technologyIds?.length
      ? buildTechnologyMeta(input.technologyIds)
      : [];

    const project = await projectsRepository.createWithTechnologies(
      {
        name: input.name,
        slug,
        description: input.description ?? null,
        coverImageUrl: input.coverImageUrl ?? null,
        status: input.status ?? "BUILDING",
        visibility: input.visibility ?? "PUBLIC",
        liveUrl: input.liveUrl ?? null,
        demoUrl: input.demoUrl ?? null,
        startedAt: input.startedAt ? new Date(input.startedAt) : null,
        isFeatured: input.isFeatured ?? false,
        isCurrentlyBuilding: false, // always false initially; set atomically below
        userId,
      },
      technologyMeta,
    );

    // Atomically enforce currently-building constraint (prevents race condition)
    if (input.isCurrentlyBuilding) {
      await projectsRepository.setCurrentlyBuilding(userId, project.id);
    }

    emitEvent(ProjectEvents.CREATED, { projectId: project.id, userId, slug: project.slug });

    invalidateOwnerProfileCache(userId).catch(() => {});

    return toProjectDetailResponse(project as any);
  },

  // -------------------------------------------------------------------------
  // Read
  // -------------------------------------------------------------------------

  async getById(id: string, userId?: string): Promise<ProjectDetailResponse> {
    // If userId is provided, try owner view first (includes private projects + activities)
    if (userId) {
      const ownerProject = await projectsRepository.findDetailByIdWithActivities(id);
      if (ownerProject && ownerProject.userId === userId) {
        return toProjectDetailResponse(ownerProject as any);
      }
    }

    const project = await projectsRepository.findDetailById(id);
    if (!project) throw new NotFoundError("Project not found");

    // Private projects can only be viewed by the owner
    if (project.visibility === "PRIVATE" && project.userId !== userId) {
      throw new NotFoundError("Project not found");
    }

    return toProjectDetailResponse(project as any);
  },

  /**
   * List public projects with pagination, filters, and sorting.
   */
  async listPublic(query: ProjectListQuery): Promise<PaginatedResponse<ProjectResponse>> {
    const { page, limit, skip, take } = getPagination(query.page, query.limit);

    const where: any = { visibility: "PUBLIC" };

    if (query.status) where.status = query.status;
    if (query.search) {
      where.OR = [
        { name: { contains: query.search, mode: "insensitive" } },
        { description: { contains: query.search, mode: "insensitive" } },
      ];
    }
    if (query.userId) where.userId = query.userId;
    if (query.featured) where.isFeatured = true;
    if (query.technology) {
      where.technologies = {
        some: {
          technology: {
            name: { equals: query.technology, mode: "insensitive" },
          },
        },
      };
    }

    const orderBy = { [query.sortBy ?? "updatedAt"]: query.order ?? "desc" } as const;

    const [projects, total] = await Promise.all([
      projectsRepository.findPublicProjects({ where, orderBy, skip, take }),
      projectsRepository.count(where),
    ]);

    return buildPaginatedResponse(
      projects.map((p) => toProjectResponse(p as any)),
      total,
      page,
      limit,
    );
  },

  /**
   * List the authenticated user's own projects (includes private).
   */
  async listOwn(userId: string, query: ProjectListQuery): Promise<PaginatedResponse<ProjectResponse>> {
    const { page, limit, skip, take } = getPagination(query.page, query.limit);

    const where: any = { userId };

    if (query.status) where.status = query.status;
    if (query.visibility) where.visibility = query.visibility;
    if (query.search) {
      where.OR = [
        { name: { contains: query.search, mode: "insensitive" } },
        { description: { contains: query.search, mode: "insensitive" } },
      ];
    }
    if (query.featured) where.isFeatured = true;

    const orderBy = { [query.sortBy ?? "updatedAt"]: query.order ?? "desc" } as const;

    const [projects, total] = await Promise.all([
      projectsRepository.findUserProjects(userId, { where, orderBy, skip, take }),
      projectsRepository.countByUserId(userId, where),
    ]);

    return buildPaginatedResponse(
      projects.map((p) => toProjectResponse(p as any)),
      total,
      page,
      limit,
    );
  },

  /**
   * List featured public projects for a user.
   */
  async listFeatured(userId: string): Promise<ProjectResponse[]> {
    const projects = await projectsRepository.findFeaturedByUserId(userId);
    return projects.map((p) => toProjectResponse(p as any));
  },

  /**
   * List global featured public projects (no userId required).
   */
  async listGlobalFeatured(): Promise<ProjectResponse[]> {
    const projects = await projectsRepository.findGlobalFeatured();
    return projects.map((p) => toProjectResponse(p as any));
  },

  /**
   * Get top builders — users with the most public projects and followers.
   */
  async getTopBuilders(take?: number): Promise<
    Array<{
      id: string;
      username: string;
      displayName: string | null;
      avatarUrl: string | null;
      bio: string | null;
      projectCount: number;
      followerCount: number;
    }>
  > {
    const builders = await projectsRepository.findTopBuilders(take);
    return builders.map((b) => ({
      id: b.id,
      username: b.username,
      displayName: b.name,
      avatarUrl: b.avatarUrl,
      bio: b.bio,
      projectCount: b._count.projects,
      followerCount: b._count.followers,
    }));
  },

  /**
   * Get the user's currently-building project.
   */
  async getCurrentlyBuilding(userId: string): Promise<ProjectResponse | null> {
    const project = await projectsRepository.findCurrentlyBuilding(userId);
    if (!project) return null;
    return toProjectResponse(project as any);
  },

  // -------------------------------------------------------------------------
  // Update
  // -------------------------------------------------------------------------

  async update(
    id: string,
    userId: string,
    input: UpdateProjectInput,
  ): Promise<ProjectDetailResponse> {
    const existing = await projectsRepository.findDetailById(id);
    if (!existing) throw new NotFoundError("Project not found");
    if (existing.userId !== userId) throw new ForbiddenError("You can only update your own projects");

    // Regenerate slug if name changed
    let slug = existing.slug;
    if (input.name && input.name !== existing.name) {
      slug = await generateUniqueSlug(userId, input.name, id);
    }

    // Enforce currently-building constraint atomically
    const wantCurrentlyBuilding = input.isCurrentlyBuilding ?? existing.isCurrentlyBuilding;
    if (wantCurrentlyBuilding && !existing.isCurrentlyBuilding) {
      // Will be set after the main update
    } else if (input.isCurrentlyBuilding === false && existing.isCurrentlyBuilding) {
      // User explicitly disabling — will be handled in the update data
    }

    // Build update data — never overwrite creator-owned fields from GitHub
    const data: Record<string, unknown> = {};
    if (input.name !== undefined) data.name = input.name;
    if (slug !== existing.slug) data.slug = slug;
    if (input.description !== undefined) data.description = input.description;
    if (input.coverImageUrl !== undefined) data.coverImageUrl = input.coverImageUrl;
    if (input.status !== undefined) data.status = input.status;
    if (input.visibility !== undefined) data.visibility = input.visibility;
    if (input.liveUrl !== undefined) data.liveUrl = input.liveUrl;
    if (input.demoUrl !== undefined) data.demoUrl = input.demoUrl;
    if (input.startedAt !== undefined) {
      data.startedAt = input.startedAt ? new Date(input.startedAt) : null;
    }
    if (input.isFeatured !== undefined) data.isFeatured = input.isFeatured;
    // Never set isCurrentlyBuilding directly in the update — use atomic method below
    if (input.isCurrentlyBuilding === false) data.isCurrentlyBuilding = false;

    // Technology sync
    const technologyMeta =
      input.technologyIds !== undefined ? buildTechnologyMeta(input.technologyIds) : undefined;

    if (Object.keys(data).length === 0 && technologyMeta === undefined) {
      throw new BadRequestError("No fields to update");
    }

    const project = await projectsRepository.updateWithTechnologies(id, data, technologyMeta);

    // Atomically enforce currently-building after the main update
    if (input.isCurrentlyBuilding && !existing.isCurrentlyBuilding) {
      await projectsRepository.setCurrentlyBuilding(userId, id);
    }

    // If githubRepoId is being set, connect it; if null, disconnect
    if (input.githubRepoId !== undefined) {
      if (input.githubRepoId) {
        await projectsRepository.update(id, {
          githubRepo: { connect: { id: input.githubRepoId } },
        });
      } else if (existing.githubRepoId) {
        await projectsRepository.unlinkGithubRepo(id);
      }
    }

    emitEvent(ProjectEvents.UPDATED, { projectId: id, userId });

    // Notify followers when a project is newly shipped (fire-and-forget)
    if (input.status === "SHIPPED" && existing.status !== "SHIPPED") {
      try {
        const { prisma } = await import("../../../config/database.js");
        const [followers, owner] = await Promise.all([
          prisma.follow.findMany({
            where: { followingId: userId },
            select: { followerId: true },
          }),
          prisma.user.findUnique({ where: { id: userId }, select: { username: true } }),
        ]);
        if (followers.length > 0) {
          const { notificationsService } = await import("../../notifications/service/notifications.service.js");
          await Promise.all(
            followers.map((f) =>
              notificationsService.notify({
                userId: f.followerId,
                actorId: userId,
                type: "PROJECT_SHIPPED",
                title: "Project shipped",
                message: `${owner?.username ?? "Someone"} shipped ${project.name}`,
                link: `/projects/${project.slug}`,
                projectId: id,
              }),
            ),
          );
        }
      } catch {
        // notification failures must never break the update flow
      }
    }

    invalidateOwnerProfileCache(userId).catch(() => {});

    // Re-fetch with full includes
    const updated = await projectsRepository.findDetailById(id);
    return toProjectDetailResponse(updated as any);
  },

  // -------------------------------------------------------------------------
  // Delete
  // -------------------------------------------------------------------------

  async remove(id: string, userId: string): Promise<void> {
    const existing = await projectsRepository.findDetailById(id);
    if (!existing) throw new NotFoundError("Project not found");
    if (existing.userId !== userId) throw new ForbiddenError("You can only delete your own projects");

    await projectsRepository.delete(id);

    emitEvent(ProjectEvents.DELETED, { projectId: id, userId });

    invalidateOwnerProfileCache(userId).catch(() => {});
  },
};

export default projectsService;
