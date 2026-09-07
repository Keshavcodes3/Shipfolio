import { technologiesRepository } from "../repository/technologies.repository.js";
import { projectsRepository } from "../../projects/repository/projects.repository.js";
import {
  toTechnologyResponse,
  toUserTechnologyResponse,
  toProjectTechnologyResponse,
} from "../dto/technologies.dto.js";
import type {
  CreateTechnologyInput,
  UpdateTechnologyInput,
  AttachUserTechnologyInput,
  AttachProjectTechnologyInput,
  TechnologyListQuery,
  TechnologyResponse,
  UserTechnologyResponse,
  ProjectTechnologyResponse,
} from "../types/technologies.types.js";
import {
  NotFoundError,
  ConflictError,
  ForbiddenError,
  BadRequestError,
} from "../../../shared/errors/index.js";
import { slugify, getPagination, buildPaginatedResponse } from "../../../shared/utils/index.js";
import { emitEvent } from "../../../shared/events/eventBus.js";
import { TechnologyEvents } from "../events/technologies.events.js";
import type { PaginatedResponse } from "../../../shared/types/index.js";

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

/**
 * Normalize a technology name: trim, collapse whitespace, title-case.
 * "  react  " → "React", "NODE JS" → "Node Js"
 */
const normalizeTechName = (name: string): string =>
  name
    .trim()
    .replace(/\s+/g, " ")
    .replace(/\b\w/g, (c) => c.toUpperCase());

/**
 * Generate a slug from a technology name.
 * "Node.js" → "nodejs", "C++" → "c", "React Native" → "react-native"
 */
const normalizeSlug = (name: string): string =>
  slugify(name.replace(/[^a-zA-Z0-9]+/g, ""));

// ---------------------------------------------------------------------------
// Service
// ---------------------------------------------------------------------------

export const technologiesService = {
  // -------------------------------------------------------------------------
  // Technology CRUD
  // -------------------------------------------------------------------------

  /**
   * Create a new technology. Normalizes name and slug to prevent duplicates.
   * Uses PostgreSQL unique constraint on `name` as the source of truth.
   */
  async create(input: CreateTechnologyInput): Promise<TechnologyResponse> {
    const normalizedName = normalizeTechName(input.name);
    const slug = normalizeSlug(normalizedName);

    // Check for existing technology with the same normalized name (case-insensitive)
    const existing = await technologiesRepository.findByName(normalizedName);
    if (existing) {
      throw new ConflictError(`Technology "${normalizedName}" already exists`);
    }

    // Also check by slug in case slug generation produces a collision
    const existingBySlug = await technologiesRepository.findBySlug(slug);
    if (existingBySlug) {
      throw new ConflictError(`Technology with similar name already exists`);
    }

    const tech = await technologiesRepository.create({
      name: normalizedName,
      slug,
      category: input.category ?? null,
    });

    emitEvent(TechnologyEvents.CREATED, { technologyId: tech.id, name: tech.name });

    return toTechnologyResponse(tech);
  },

  /**
   * Find or create a technology by name. Used when attaching technologies
   * to users/projects where the technology might not exist yet.
   */
  async findOrCreate(name: string, category?: string): Promise<TechnologyResponse> {
    const normalizedName = normalizeTechName(name);
    const slug = normalizeSlug(normalizedName);

    const tech = await technologiesRepository.findOrCreate(normalizedName, slug, category);
    return toTechnologyResponse(tech);
  },

  /**
   * Get a technology by ID.
   */
  async getById(id: string): Promise<TechnologyResponse> {
    const tech = await technologiesRepository.findById(id);
    if (!tech) throw new NotFoundError("Technology not found");
    return toTechnologyResponse(tech);
  },

  /**
   * List technologies with pagination, search, and filtering.
   */
  async list(query: TechnologyListQuery): Promise<PaginatedResponse<TechnologyResponse>> {
    const { page, limit, skip, take } = getPagination(query.page, query.limit);

    const where: any = {};

    if (query.search) {
      where.OR = [
        { name: { contains: query.search, mode: "insensitive" } },
        { slug: { contains: query.search, mode: "insensitive" } },
      ];
    }

    if (query.category) {
      where.category = query.category;
    }

    const orderBy = { [query.sortBy ?? "name"]: query.order ?? "asc" } as const;

    const [technologies, total] = await Promise.all([
      technologiesRepository.findAll({ where, orderBy, skip, take }),
      technologiesRepository.count(where),
    ]);

    return buildPaginatedResponse(
      technologies.map(toTechnologyResponse),
      total,
      page,
      limit,
    );
  },

  /**
   * Search technologies by name or slug.
   */
  async search(q: string, limit = 20): Promise<TechnologyResponse[]> {
    const results = await technologiesRepository.search(q, limit);
    return results.map(toTechnologyResponse);
  },

  /**
   * Update a technology.
   */
  async update(id: string, input: UpdateTechnologyInput): Promise<TechnologyResponse> {
    const existing = await technologiesRepository.findById(id);
    if (!existing) throw new NotFoundError("Technology not found");

    const data: Record<string, unknown> = {};

    if (input.name !== undefined) {
      const normalizedName = normalizeTechName(input.name);
      if (normalizedName !== existing.name) {
        // Check for name conflict
        const conflict = await technologiesRepository.findByName(normalizedName);
        if (conflict && conflict.id !== id) {
          throw new ConflictError(`Technology "${normalizedName}" already exists`);
        }
        data.name = normalizedName;
        data.slug = normalizeSlug(normalizedName);
      }
    }

    if (input.category !== undefined) {
      data.category = input.category;
    }

    if (Object.keys(data).length === 0) {
      throw new BadRequestError("No fields to update");
    }

    const updated = await technologiesRepository.update(id, data);

    emitEvent(TechnologyEvents.UPDATED, { technologyId: id });

    return toTechnologyResponse(updated);
  },

  /**
   * Delete a technology.
   */
  async remove(id: string): Promise<void> {
    const existing = await technologiesRepository.findById(id);
    if (!existing) throw new NotFoundError("Technology not found");

    await technologiesRepository.delete(id);

    emitEvent(TechnologyEvents.DELETED, { technologyId: id, name: existing.name });
  },

  // -------------------------------------------------------------------------
  // User–Technology relationships
  // -------------------------------------------------------------------------

  /**
   * Get all technologies for a user.
   */
  async getUserTechnologies(userId: string): Promise<UserTechnologyResponse[]> {
    const userTechs = await technologiesRepository.getUserTechnologies(userId);
    return userTechs.map(toUserTechnologyResponse);
  },

  /**
   * Attach a technology to a user. Prevents duplicate relationships.
   */
  async attachToUser(
    userId: string,
    input: AttachUserTechnologyInput,
  ): Promise<UserTechnologyResponse> {
    // Verify technology exists
    const tech = await technologiesRepository.findById(input.technologyId);
    if (!tech) throw new NotFoundError("Technology not found");

    // Check if already attached
    const exists = await technologiesRepository.hasUserTechnology(userId, input.technologyId);
    if (exists && !input.isPrimary) {
      // Already attached and not trying to set primary — just return existing
      const userTechs = await technologiesRepository.getUserTechnologies(userId);
      const existing = userTechs.find((ut) => ut.technologyId === input.technologyId);
      if (existing) return toUserTechnologyResponse(existing);
    }

    // If setting as primary, clear other primary technologies first
    if (input.isPrimary) {
      await technologiesRepository.clearPrimaryUserTechnologies(userId);
    }

    const result = await technologiesRepository.addUserTechnology(
      userId,
      input.technologyId,
      input.isPrimary,
    );

    // Re-fetch with technology included
    const userTechs = await technologiesRepository.getUserTechnologies(userId);
    const userTech = userTechs.find((ut) => ut.technologyId === input.technologyId);
    if (!userTech) throw new NotFoundError("Failed to attach technology");

    return toUserTechnologyResponse(userTech);
  },

  /**
   * Remove a technology from a user.
   */
  async detachFromUser(userId: string, technologyId: string): Promise<void> {
    const exists = await technologiesRepository.hasUserTechnology(userId, technologyId);
    if (!exists) {
      throw new NotFoundError("Technology not attached to this user");
    }

    await technologiesRepository.removeUserTechnology(userId, technologyId);
  },

  /**
   * Set a technology as primary for a user.
   * Clears primary status on all other user technologies.
   */
  async setPrimaryUserTechnology(userId: string, technologyId: string): Promise<UserTechnologyResponse> {
    // Verify the technology is attached to the user
    const exists = await technologiesRepository.hasUserTechnology(userId, technologyId);
    if (!exists) {
      throw new NotFoundError("Technology not attached to this user");
    }

    await technologiesRepository.setPrimaryUserTechnology(userId, technologyId);

    // Re-fetch
    const userTechs = await technologiesRepository.getUserTechnologies(userId);
    const userTech = userTechs.find((ut) => ut.technologyId === technologyId);
    if (!userTech) throw new NotFoundError("Failed to set primary technology");

    return toUserTechnologyResponse(userTech);
  },

  // -------------------------------------------------------------------------
  // Project–Technology relationships
  // -------------------------------------------------------------------------

  /**
   * Get all technologies for a project.
   */
  async getProjectTechnologies(projectId: string): Promise<ProjectTechnologyResponse[]> {
    const projectTechs = await technologiesRepository.getProjectTechnologies(projectId);
    return projectTechs.map(toProjectTechnologyResponse);
  },

  /**
   * Attach a technology to a project.
   * Verifies that the authenticated user owns the project.
   */
  async attachToProject(
    projectId: string,
    userId: string,
    input: AttachProjectTechnologyInput,
  ): Promise<ProjectTechnologyResponse> {
    // Verify project exists and user owns it
    const project = await projectsRepository.findById(projectId);
    if (!project) throw new NotFoundError("Project not found");
    if (project.userId !== userId) {
      throw new ForbiddenError("You can only modify your own projects");
    }

    // Verify technology exists
    const tech = await technologiesRepository.findById(input.technologyId);
    if (!tech) throw new NotFoundError("Technology not found");

    // Check if already attached
    const exists = await technologiesRepository.hasProjectTechnology(projectId, input.technologyId);
    if (exists && !input.isPrimary) {
      const projectTechs = await technologiesRepository.getProjectTechnologies(projectId);
      const existing = projectTechs.find((pt) => pt.technologyId === input.technologyId);
      if (existing) return toProjectTechnologyResponse(existing);
    }

    // If setting as primary, clear other primary technologies first
    if (input.isPrimary) {
      await technologiesRepository.clearPrimaryProjectTechnologies(projectId);
    }

    await technologiesRepository.addProjectTechnology(
      projectId,
      input.technologyId,
      input.isPrimary,
    );

    // Re-fetch
    const projectTechs = await technologiesRepository.getProjectTechnologies(projectId);
    const projectTech = projectTechs.find((pt) => pt.technologyId === input.technologyId);
    if (!projectTech) throw new NotFoundError("Failed to attach technology");

    return toProjectTechnologyResponse(projectTech);
  },

  /**
   * Remove a technology from a project.
   * Verifies that the authenticated user owns the project.
   */
  async detachFromProject(projectId: string, userId: string, technologyId: string): Promise<void> {
    // Verify project exists and user owns it
    const project = await projectsRepository.findById(projectId);
    if (!project) throw new NotFoundError("Project not found");
    if (project.userId !== userId) {
      throw new ForbiddenError("You can only modify your own projects");
    }

    const exists = await technologiesRepository.hasProjectTechnology(projectId, technologyId);
    if (!exists) {
      throw new NotFoundError("Technology not attached to this project");
    }

    await technologiesRepository.removeProjectTechnology(projectId, technologyId);
  },

  /**
   * Set a technology as primary for a project.
   * Verifies that the authenticated user owns the project.
   */
  async setPrimaryProjectTechnology(
    projectId: string,
    userId: string,
    technologyId: string,
  ): Promise<ProjectTechnologyResponse> {
    // Verify project exists and user owns it
    const project = await projectsRepository.findById(projectId);
    if (!project) throw new NotFoundError("Project not found");
    if (project.userId !== userId) {
      throw new ForbiddenError("You can only modify your own projects");
    }

    // Verify the technology is attached to the project
    const exists = await technologiesRepository.hasProjectTechnology(projectId, technologyId);
    if (!exists) {
      throw new NotFoundError("Technology not attached to this project");
    }

    await technologiesRepository.setPrimaryProjectTechnology(projectId, technologyId);

    // Re-fetch
    const projectTechs = await technologiesRepository.getProjectTechnologies(projectId);
    const projectTech = projectTechs.find((pt) => pt.technologyId === technologyId);
    if (!projectTech) throw new NotFoundError("Failed to set primary technology");

    return toProjectTechnologyResponse(projectTech);
  },
};

export default technologiesService;
