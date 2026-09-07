import { experienceRepository } from "../repository/experience.repository.js";
import { toExperienceEntry, toExperienceEntries } from "../dto/experience.dto.js";
import type { CreateExperienceInput, UpdateExperienceInput, ExperienceEntry } from "../types/experience.types.js";
import { NotFoundError, ForbiddenError, BadRequestError } from "../../../shared/errors/index.js";
import { createLogger } from "../../../shared/logger.js";

const log = createLogger("experience-service");

const MAX_EXPERIENCE_ENTRIES = 30;

export const experienceService = {
  async list(userId: string): Promise<ExperienceEntry[]> {
    const entries = await experienceRepository.findByUserId(userId);
    return toExperienceEntries(entries);
  },

  async getById(experienceId: string): Promise<ExperienceEntry> {
    const entry = await experienceRepository.findById(experienceId);
    if (!entry) throw new NotFoundError("Experience entry not found");
    return toExperienceEntry(entry);
  },

  async create(userId: string, input: CreateExperienceInput): Promise<ExperienceEntry> {
    const count = await experienceRepository.count(userId);
    if (count >= MAX_EXPERIENCE_ENTRIES) {
      throw new BadRequestError(`Maximum of ${MAX_EXPERIENCE_ENTRIES} experience entries allowed`);
    }

    const maxSort = await experienceRepository.getMaxSortOrder(userId);
    const sortOrder = input.sortOrder ?? (maxSort._max.sortOrder ?? -1) + 1;

    const entry = await experienceRepository.create(userId, {
      company: input.company,
      role: input.role,
      startDate: new Date(input.startDate),
      endDate: input.endDate ? new Date(input.endDate) : null,
      description: input.description ?? null,
      technologies: input.technologies ?? [],
      sortOrder,
    });

    log.info({ userId, experienceId: entry.id }, "Experience entry created");
    return toExperienceEntry(entry);
  },

  async update(userId: string, experienceId: string, input: UpdateExperienceInput): Promise<ExperienceEntry> {
    const existing = await experienceRepository.findById(experienceId);
    if (!existing) throw new NotFoundError("Experience entry not found");
    if (existing.userId !== userId) throw new ForbiddenError("You can only edit your own experience entries");

    const data: Record<string, unknown> = {};
    if (input.company !== undefined) data.company = input.company;
    if (input.role !== undefined) data.role = input.role;
    if (input.startDate !== undefined) data.startDate = new Date(input.startDate);
    if (input.endDate !== undefined) data.endDate = input.endDate ? new Date(input.endDate) : null;
    if (input.description !== undefined) data.description = input.description;
    if (input.technologies !== undefined) data.technologies = input.technologies;
    if (input.sortOrder !== undefined) data.sortOrder = input.sortOrder;

    if (Object.keys(data).length === 0) throw new BadRequestError("No fields to update");

    const entry = await experienceRepository.update(experienceId, data);
    log.info({ userId, experienceId }, "Experience entry updated");
    return toExperienceEntry(entry);
  },

  async delete(userId: string, experienceId: string): Promise<void> {
    const existing = await experienceRepository.findById(experienceId);
    if (!existing) throw new NotFoundError("Experience entry not found");
    if (existing.userId !== userId) throw new ForbiddenError("You can only delete your own experience entries");

    await experienceRepository.delete(experienceId);
    log.info({ userId, experienceId }, "Experience entry deleted");
  },

  async reorder(userId: string, orderedIds: string[]): Promise<void> {
    const entries = await experienceRepository.findByUserId(userId);
    const validIds = new Set(entries.map((e) => e.id));
    const allValid = orderedIds.every((id) => validIds.has(id));
    if (!allValid || orderedIds.length !== entries.length) {
      throw new BadRequestError("Invalid reorder data: IDs must match existing experience entries");
    }

    await experienceRepository.reorder(userId, orderedIds);
    log.info({ userId }, "Experience entries reordered");
  },
};

export default experienceService;
