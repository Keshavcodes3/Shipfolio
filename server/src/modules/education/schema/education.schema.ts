import { z } from "zod";

export const createEducationSchema = z.object({
  institution: z.string().min(1, "Institution is required").max(200),
  degree: z.string().max(200).nullable().optional(),
  fieldOfStudy: z.string().max(200).nullable().optional(),
  startYear: z.number().int().min(1900).max(2100),
  endYear: z.number().int().min(1900).max(2100).nullable().optional(),
  description: z.string().max(1000).nullable().optional(),
  sortOrder: z.number().int().min(0).optional(),
}).refine(
  (data) => {
    if (data.endYear !== null && data.endYear !== undefined) {
      return data.startYear <= data.endYear;
    }
    return true;
  },
  { message: "startYear must be before or equal to endYear", path: ["endYear"] }
);

export const updateEducationSchema = z.object({
  institution: z.string().min(1).max(200).optional(),
  degree: z.string().max(200).nullable().optional(),
  fieldOfStudy: z.string().max(200).nullable().optional(),
  startYear: z.number().int().min(1900).max(2100).optional(),
  endYear: z.number().int().min(1900).max(2100).nullable().optional(),
  description: z.string().max(1000).nullable().optional(),
  sortOrder: z.number().int().min(0).optional(),
}).refine(
  (data) => {
    if (data.startYear !== undefined && data.endYear !== undefined) {
      if (data.endYear !== null) {
        return data.startYear <= data.endYear;
      }
    }
    return true;
  },
  { message: "startYear must be before or equal to endYear", path: ["endYear"] }
);

export const reorderEducationSchema = z.object({
  ids: z.array(z.string()).min(1, "At least one ID is required"),
});

export type CreateEducationSchema = z.infer<typeof createEducationSchema>;
export type UpdateEducationSchema = z.infer<typeof updateEducationSchema>;
export type ReorderEducationSchema = z.infer<typeof reorderEducationSchema>;
