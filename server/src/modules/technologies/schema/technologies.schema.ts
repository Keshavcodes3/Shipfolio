import { z } from "zod";

// ---------------------------------------------------------------------------
// Create technology
// ---------------------------------------------------------------------------

export const createTechnologySchema = z.object({
  name: z
    .string()
    .min(1, "Name is required")
    .max(50, "Name must be at most 50 characters")
    .trim(),
  category: z.string().max(50).nullable().optional(),
});

// ---------------------------------------------------------------------------
// Update technology
// ---------------------------------------------------------------------------

export const updateTechnologySchema = z.object({
  name: z.string().min(1).max(50).trim().optional(),
  category: z.string().max(50).nullable().optional(),
});

// ---------------------------------------------------------------------------
// Attach user technology
// ---------------------------------------------------------------------------

export const attachUserTechnologySchema = z.object({
  technologyId: z.string().min(1, "Technology ID is required"),
  isPrimary: z.boolean().default(false),
});

// ---------------------------------------------------------------------------
// Attach project technology
// ---------------------------------------------------------------------------

export const attachProjectTechnologySchema = z.object({
  technologyId: z.string().min(1, "Technology ID is required"),
  isPrimary: z.boolean().default(false),
});

// ---------------------------------------------------------------------------
// Query schemas
// ---------------------------------------------------------------------------

export const technologiesQuerySchema = z.object({
  page: z.coerce.number().int().min(1).default(1),
  limit: z.coerce.number().int().min(1).max(100).default(20),
  search: z.string().max(100).optional(),
  category: z.string().max(50).optional(),
  sortBy: z.enum(["name", "createdAt", "category"]).default("name"),
  order: z.enum(["asc", "desc"]).default("asc"),
});

export const technologySearchSchema = z.object({
  q: z.string().min(1, "Search query is required").max(100),
  limit: z.coerce.number().int().min(1).max(50).default(20),
});

// ---------------------------------------------------------------------------
// Inferred types
// ---------------------------------------------------------------------------

export type CreateTechnologySchema = z.infer<typeof createTechnologySchema>;
export type UpdateTechnologySchema = z.infer<typeof updateTechnologySchema>;
export type AttachUserTechnologySchema = z.infer<typeof attachUserTechnologySchema>;
export type AttachProjectTechnologySchema = z.infer<typeof attachProjectTechnologySchema>;
export type TechnologiesQuerySchema = z.infer<typeof technologiesQuerySchema>;
export type TechnologySearchSchema = z.infer<typeof technologySearchSchema>;
