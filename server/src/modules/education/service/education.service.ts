import { educationRepository } from "../repository/education.repository.js";
import { toEducationEntry, toEducationEntries } from "../dto/education.dto.js";
import type { CreateEducationInput, UpdateEducationInput, EducationEntry } from "../types/education.types.js";
import { NotFoundError, ForbiddenError, BadRequestError } from "../../../shared/errors/index.js";
import { createLogger } from "../../../shared/logger.js";

const log = createLogger("education-service");

const MAX_EDUCATION_ENTRIES = 20;

export const educationService = {
  async list(userId: string): Promise<EducationEntry[]> {
    const entries = await educationRepository.findByUserId(userId);
    return toEducationEntries(entries);
  },

  async getById(educationId: string): Promise<EducationEntry> {
    const entry = await educationRepository.findById(educationId);
    if (!entry) throw new NotFoundError("Education entry not found");
    return toEducationEntry(entry);
  },

  async create(userId: string, input: CreateEducationInput): Promise<EducationEntry> {
    const count = await educationRepository.count(userId);
    if (count >= MAX_EDUCATION_ENTRIES) {
      throw new BadRequestError(`Maximum of ${MAX_EDUCATION_ENTRIES} education entries allowed`);
    }

    const maxSort = await educationRepository.getMaxSortOrder(userId);
    const sortOrder = input.sortOrder ?? (maxSort._max.sortOrder ?? -1) + 1;

    const entry = await educationRepository.create(userId, {
      institution: input.institution,
      degree: input.degree ?? null,
      fieldOfStudy: input.fieldOfStudy ?? null,
      startYear: input.startYear,
      endYear: input.endYear ?? null,
      description: input.description ?? null,
      sortOrder,
    });

    log.info({ userId, educationId: entry.id }, "Education entry created");
    return toEducationEntry(entry);
  },

  async update(userId: string, educationId: string, input: UpdateEducationInput): Promise<EducationEntry> {
    const existing = await educationRepository.findById(educationId);
    if (!existing) throw new NotFoundError("Education entry not found");
    if (existing.userId !== userId) throw new ForbiddenError("You can only edit your own education entries");

    const data: Record<string, unknown> = {};
    if (input.institution !== undefined) data.institution = input.institution;
    if (input.degree !== undefined) data.degree = input.degree;
    if (input.fieldOfStudy !== undefined) data.fieldOfStudy = input.fieldOfStudy;
    if (input.startYear !== undefined) data.startYear = input.startYear;
    if (input.endYear !== undefined) data.endYear = input.endYear;
    if (input.description !== undefined) data.description = input.description;
    if (input.sortOrder !== undefined) data.sortOrder = input.sortOrder;

    if (Object.keys(data).length === 0) throw new BadRequestError("No fields to update");

    const entry = await educationRepository.update(educationId, data);
    log.info({ userId, educationId }, "Education entry updated");
    return toEducationEntry(entry);
  },

  async delete(userId: string, educationId: string): Promise<void> {
    const existing = await educationRepository.findById(educationId);
    if (!existing) throw new NotFoundError("Education entry not found");
    if (existing.userId !== userId) throw new ForbiddenError("You can only delete your own education entries");

    await educationRepository.delete(educationId);
    log.info({ userId, educationId }, "Education entry deleted");
  },

  async reorder(userId: string, orderedIds: string[]): Promise<void> {
    const entries = await educationRepository.findByUserId(userId);
    const validIds = new Set(entries.map((e) => e.id));
    const allValid = orderedIds.every((id) => validIds.has(id));
    if (!allValid || orderedIds.length !== entries.length) {
      throw new BadRequestError("Invalid reorder data: IDs must match existing education entries");
    }

    await educationRepository.reorder(userId, orderedIds);
    log.info({ userId }, "Education entries reordered");
  },
};

export default educationService;
