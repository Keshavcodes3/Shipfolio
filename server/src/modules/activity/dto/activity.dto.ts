import type { ActivityDto } from "../types/activity.types.js";

export const toActivityDto = (entity: any): ActivityDto => ({
  id: entity.id,
  ...entity,
});
