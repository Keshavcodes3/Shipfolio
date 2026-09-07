import { z } from "zod";

// ---------------------------------------------------------------------------
// Username rules — shared between registration and profile update
// ---------------------------------------------------------------------------

const usernameRegex = /^[a-zA-Z0-9_-]+$/;

    export const usernameSchema = z
      .string()
      .min(3, "Username must be at least 3 characters")
      .max(30, "Username must be at most 30 characters")
      .regex(usernameRegex, "Username may only contain letters, numbers, _ and -");

    // ---------------------------------------------------------------------------
// Profile update
// ---------------------------------------------------------------------------

export const updateProfileSchema = z.object({
  name: z.string().min(1).max(100).optional(),
  username: usernameSchema.optional(),
  bio: z.string().max(500).nullable().optional(),
  location: z.string().max(100).nullable().optional(),
  websiteUrl: z.string().url("Must be a valid URL").max(200).nullable().optional(),
  avatarUrl: z.string().url("Must be a valid URL").max(500).nullable().optional(),
  linkedinUrl: z.string().url("Must be a valid URL").max(200).nullable().optional(),
});

// ---------------------------------------------------------------------------
// Username availability check
// ---------------------------------------------------------------------------

export const usernameAvailabilitySchema = z.object({
  username: usernameSchema,
});

// ---------------------------------------------------------------------------
// List / pagination queries
// ---------------------------------------------------------------------------

export const profilesQuerySchema = z.object({
  page: z.coerce.number().int().min(1).default(1),
  limit: z.coerce.number().int().min(1).max(100).default(20),
  search: z.string().max(100).optional(),
  sortBy: z.enum(["username", "createdAt", "projects"]).default("createdAt"),
  order: z.enum(["asc", "desc"]).default("desc"),
});

export const followersQuerySchema = z.object({
  page: z.coerce.number().int().min(1).default(1),
  limit: z.coerce.number().int().min(1).max(100).default(20),
});

export const followingQuerySchema = z.object({
  page: z.coerce.number().int().min(1).default(1),
  limit: z.coerce.number().int().min(1).max(100).default(20),
});

// ---------------------------------------------------------------------------
// Inferred types
// ---------------------------------------------------------------------------

export type UpdateProfileSchema = z.infer<typeof updateProfileSchema>;
export type UsernameAvailabilitySchema = z.infer<typeof usernameAvailabilitySchema>;
export type ProfilesQuerySchema = z.infer<typeof profilesQuerySchema>;
export type FollowersQuerySchema = z.infer<typeof followersQuerySchema>;
export type FollowingQuerySchema = z.infer<typeof followingQuerySchema>;
