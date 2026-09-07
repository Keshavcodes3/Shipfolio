import { z } from "zod";

// ---------------------------------------------------------------------------
// Enums
// ---------------------------------------------------------------------------

const projectStatusSchema = z.enum(["BUILDING", "SHIPPED", "MAINTAINING", "PAUSED", "ARCHIVED"]);
const projectVisibilitySchema = z.enum(["PUBLIC", "PRIVATE"]);

// ---------------------------------------------------------------------------
// URL validation — reject non-http(s) schemes to prevent XSS via javascript: URLs
// ---------------------------------------------------------------------------

const safeUrl = z
  .string()
  .url("Must be a valid URL")
  .refine(
    (url) => /^https?:\/\//i.test(url),
    "Only http and https URLs are allowed",
  )
  .max(500);

// ---------------------------------------------------------------------------
// Create project
// ---------------------------------------------------------------------------

export const createProjectSchema = z.object({
  name: z
    .string()
    .min(1, "Name is required")
    .max(100, "Name must be at most 100 characters"),
  description: z.string().max(2000).nullable().optional(),
  coverImageUrl: safeUrl.nullable().optional(),
  status: projectStatusSchema.default("BUILDING"),
  visibility: projectVisibilitySchema.default("PUBLIC"),
  liveUrl: safeUrl.nullable().optional(),
  demoUrl: safeUrl.nullable().optional(),
  githubRepoId: z.string().nullable().optional(),
  startedAt: z.string().datetime({ offset: true }).nullable().optional(),
  isFeatured: z.boolean().default(false),
  isCurrentlyBuilding: z.boolean().default(false),
  technologyIds: z.array(z.string()).max(20).default([]),
});

// ---------------------------------------------------------------------------
// Update project
// ---------------------------------------------------------------------------

export const updateProjectSchema = z.object({
  name: z.string().min(1).max(100).optional(),
  description: z.string().max(2000).nullable().optional(),
  coverImageUrl: safeUrl.nullable().optional(),
  status: projectStatusSchema.optional(),
  visibility: projectVisibilitySchema.optional(),
  liveUrl: safeUrl.nullable().optional(),
  demoUrl: safeUrl.nullable().optional(),
  githubRepoId: z.string().nullable().optional(),
  startedAt: z.string().datetime({ offset: true }).nullable().optional(),
  isFeatured: z.boolean().optional(),
  isCurrentlyBuilding: z.boolean().optional(),
  technologyIds: z.array(z.string()).max(20).optional(),
});

// ---------------------------------------------------------------------------
// Project query (list endpoints)
// ---------------------------------------------------------------------------

export const projectsQuerySchema = z.object({
  page: z.coerce.number().int().min(1).default(1),
  limit: z.coerce.number().int().min(1).max(100).default(20),
  status: projectStatusSchema.optional(),
  visibility: projectVisibilitySchema.optional(),
  sortBy: z.enum(["createdAt", "updatedAt", "name", "startedAt"]).default("updatedAt"),
  order: z.enum(["asc", "desc"]).default("desc"),
  search: z.string().max(100).optional(),
  userId: z.string().optional(),
  featured: z.coerce.boolean().optional(),
  technology: z.string().max(100).optional(),
});

// ---------------------------------------------------------------------------
// Inferred types
// ---------------------------------------------------------------------------

export type CreateProjectSchema = z.infer<typeof createProjectSchema>;
export type UpdateProjectSchema = z.infer<typeof updateProjectSchema>;
export type ProjectsQuerySchema = z.infer<typeof projectsQuerySchema>;
