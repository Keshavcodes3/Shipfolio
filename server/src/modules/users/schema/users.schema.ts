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
// Schemas
// ---------------------------------------------------------------------------

export const updateUserSchema = z.object({
  name: z.string().min(1).max(100).optional(),
  email: z.string().email().optional(),
  username: usernameSchema.optional(),
});

export const usersQuerySchema = z.object({
  page: z.coerce.number().int().min(1).default(1),
  limit: z.coerce.number().int().min(1).max(100).default(20),
  search: z.string().max(100).optional(),
  sortBy: z.enum(["username", "createdAt"]).default("createdAt"),
  order: z.enum(["asc", "desc"]).default("desc"),
});

export type UpdateUserSchema = z.infer<typeof updateUserSchema>;
export type UsersQuerySchema = z.infer<typeof usersQuerySchema>;
