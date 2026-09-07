import { activityRepository } from "../repository/activity.repository.js";
import { prisma } from "../../../config/database.js";
import { NotFoundError } from "../../../shared/errors/index.js";

export const activityService = {
  async list(query: any) {
    // Only return activities belonging to PUBLIC projects
    const where = {
      ...query.where,
      project: { visibility: "PUBLIC" as const },
    };
    return activityRepository.findAll({ ...query, where });
  },
  async getById(id: string) {
    const entity = await activityRepository.findById(id);
    if (!entity) throw new NotFoundError("Activity not found");
    // Verify the parent project is public
    const project = await prisma.project.findUnique({
      where: { id: entity.projectId },
      select: { visibility: true },
    });
    if (!project || project.visibility !== "PUBLIC") {
      throw new NotFoundError("Activity not found");
    }
    return entity;
  },
  async create(data: any) {
    return activityRepository.create(data);
  },
  async update(id: string, userId: string, data: any) {
    const updated = await activityRepository.updateByOwner(id, userId, data);
    if (!updated) throw new NotFoundError("Activity not found");
    return activityRepository.findById(id);
  },
  async remove(id: string, userId: string) {
    const deleted = await activityRepository.deleteByOwner(id, userId);
    if (!deleted) throw new NotFoundError("Activity not found");
  },
};

export default activityService;
