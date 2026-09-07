import type { UserListItem, UserDetail } from "../types/users.types.js";

// ---------------------------------------------------------------------------
// Response DTOs — shape raw Prisma results into safe response objects
// ---------------------------------------------------------------------------

/**
 * Minimal user representation for lists.
 * Never exposes email, passwords, or OAuth tokens.
 */
export const toUserListItem = (user: {
  id: string;
  username: string;
  name: string | null;
  avatarUrl: string | null;
  createdAt: Date;
}): UserListItem => ({
  id: user.id,
  username: user.username,
  name: user.name,
  avatarUrl: user.avatarUrl,
  createdAt: user.createdAt,
});

/**
 * Full user detail for the authenticated owner.
 * Includes email — must never be sent to other users.
 */
export const toUserDetail = (user: {
  id: string;
  username: string;
  email: string;
  name: string | null;
  avatarUrl: string | null;
  bio: string | null;
  location: string | null;
  websiteUrl: string | null;
  createdAt: Date;
  updatedAt: Date;
}): UserDetail => ({
  id: user.id,
  username: user.username,
  email: user.email,
  name: user.name,
  avatarUrl: user.avatarUrl,
  bio: user.bio,
  location: user.location,
  websiteUrl: user.websiteUrl,
  createdAt: user.createdAt,
  updatedAt: user.updatedAt,
});
