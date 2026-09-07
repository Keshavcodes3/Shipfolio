import { z } from "zod";

// ---------------------------------------------------------------------------
// Enums
// ---------------------------------------------------------------------------

const projectNeedTypeSchema = z.enum([
  "FEEDBACK",
  "BETA_TESTERS",
  "EARLY_USERS",
  "COLLABORATOR",
  "DESIGNER",
  "DEVELOPER",
  "TECHNICAL_ADVICE",
  "PRODUCT_ADVICE",
  "OPEN_SOURCE_CONTRIBUTORS",
  "OTHER",
]);

// ---------------------------------------------------------------------------
// Create project need
// ---------------------------------------------------------------------------

export const createProjectNeedSchema = z.object({
  type: projectNeedTypeSchema,
  note: z.string().max(280).nullable().optional(),
});

// ---------------------------------------------------------------------------
// Update project need (patch note only)
// ---------------------------------------------------------------------------

export const updateProjectNeedSchema = z.object({
  note: z.string().max(280).nullable().optional(),
});

// ---------------------------------------------------------------------------
// Express interest
// ---------------------------------------------------------------------------

export const expressInterestSchema = z.object({
  message: z.string().max(280).nullable().optional(),
});

// ---------------------------------------------------------------------------
// Query schemas
// ---------------------------------------------------------------------------

export const projectNeedsQuerySchema = z.object({
  type: projectNeedTypeSchema.optional(),
  page: z.coerce.number().int().min(1).default(1),
  limit: z.coerce.number().int().min(1).max(100).default(20),
});

export const discoverNeedsQuerySchema = z.object({
  type: projectNeedTypeSchema.optional(),
  technology: z.string().max(100).optional(),
  search: z.string().max(100).optional(),
  page: z.coerce.number().int().min(1).default(1),
  limit: z.coerce.number().int().min(1).max(100).default(20),
});

// ---------------------------------------------------------------------------
// Inferred types
// ---------------------------------------------------------------------------

export type CreateProjectNeedSchema = z.infer<typeof createProjectNeedSchema>;
export type UpdateProjectNeedSchema = z.infer<typeof updateProjectNeedSchema>;
export type ExpressInterestSchema = z.infer<typeof expressInterestSchema>;
export type ProjectNeedsQuerySchema = z.infer<typeof projectNeedsQuerySchema>;
export type DiscoverNeedsQuerySchema = z.infer<typeof discoverNeedsQuerySchema>;
