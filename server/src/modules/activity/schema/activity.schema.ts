import { z } from "zod";

export const createActivitySchema = z.object({});
export const updateActivitySchema = z.object({});
export const activityQuerySchema = z.object({
  page: z.coerce.number().optional(),
  limit: z.coerce.number().optional(),
});
