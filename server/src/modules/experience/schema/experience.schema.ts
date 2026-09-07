import { z } from "zod";

export const createExperienceSchema = z.object({
  company: z.string().min(1, "Company is required").max(200),
  role: z.string().min(1, "Role is required").max(200),
  startDate: z.string().or(z.date()),
  endDate: z.string().or(z.date()).nullable().optional(),
  description: z.string().max(2000).nullable().optional(),
  technologies: z.array(z.string().max(100)).max(20).optional(),
  sortOrder: z.number().int().min(0).optional(),
}).refine(
  (data) => {
    if (data.endDate !== null && data.endDate !== undefined) {
      const start = new Date(data.startDate);
      const end = new Date(data.endDate);
      return start <= end;
    }
    return true;
  },
  { message: "startDate must be before or equal to endDate", path: ["endDate"] }
);

export const updateExperienceSchema = z.object({
  company: z.string().min(1).max(200).optional(),
  role: z.string().min(1).max(200).optional(),
  startDate: z.string().or(z.date()).optional(),
  endDate: z.string().or(z.date()).nullable().optional(),
  description: z.string().max(2000).nullable().optional(),
  technologies: z.array(z.string().max(100)).max(20).optional(),
  sortOrder: z.number().int().min(0).optional(),
}).refine(
  (data) => {
    if (data.startDate !== undefined && data.endDate !== undefined) {
      if (data.endDate !== null) {
        const start = new Date(data.startDate);
        const end = new Date(data.endDate);
        return start <= end;
      }
    }
    return true;
  },
  { message: "startDate must be before or equal to endDate", path: ["endDate"] }
);

export const reorderExperienceSchema = z.object({
  ids: z.array(z.string()).min(1, "At least one ID is required"),
});

export type CreateExperienceSchema = z.infer<typeof createExperienceSchema>;
export type UpdateExperienceSchema = z.infer<typeof updateExperienceSchema>;
export type ReorderExperienceSchema = z.infer<typeof reorderExperienceSchema>;
