import type { Request, Response, NextFunction } from "express";
import { ForbiddenError, NotFoundError } from "../shared/errors/index.js";

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

/** A function that looks up a resource by id and returns its owner's userId. */
export type OwnershipLookup = (id: string) => Promise<{ userId: string } | null>;

/** Extracts the resource id from the request (default: `req.params.id`). */
export type IdExtractor = (req: Request) => string;

// ---------------------------------------------------------------------------
// Core authorization middleware
// ---------------------------------------------------------------------------

/**
 * Returns a middleware that enforces resource ownership.
 *
 * 1. Resolves the resource id via `extractId` (defaults to `req.params.id`).
 * 2. Calls `lookup` to fetch the resource's `userId`.
 * 3. If the resource does not exist → 404 (avoids leaking existence).
 * 4. If the authenticated user does not own the resource → 403.
 * 5. Otherwise calls `next()`.
 *
 * Both 404 and 403 use the same "not found" message to an unauthenticated
 * caller when the resource truly does not exist, but when the user IS
 * authenticated we return 403 so the caller knows they lack permission.
 */
export const requireOwnership =
  (lookup: OwnershipLookup, extractId?: IdExtractor) =>
  async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const raw = extractId ? extractId(req) : req.params.id;
      const id = Array.isArray(raw) ? raw[0] : raw;
      if (!id) return next(new NotFoundError());

      const resource = await lookup(id);
      if (!resource) return next(new NotFoundError());

      if (!req.user) return next(new ForbiddenError());

      if (resource.userId !== req.user.id) return next(new ForbiddenError());

      next();
    } catch (err) {
      next(err);
    }
  };

// ---------------------------------------------------------------------------
// Convenience factories for common resources
// ---------------------------------------------------------------------------

/** Check that the authenticated user owns the project identified by `req.params.id`. */
export const requireProjectOwnership: ReturnType<typeof requireOwnership> =
  requireOwnership(async (id) => {
    const { prisma } = await import("../config/database.js");
    return prisma.project.findUnique({ where: { id }, select: { userId: true } });
  });

/** Check that the authenticated user owns the profile (user) identified by `req.params.id`. */
export const requireUserOwnership: ReturnType<typeof requireOwnership> =
  requireOwnership(async (id) => {
    const { prisma } = await import("../config/database.js");
    const user = await prisma.user.findUnique({ where: { id }, select: { id: true } });
    // User IS the resource — map `id` → `userId` so the generic ownership check works
    return user ? { userId: user.id } : null;
  });

/**
 * Check ownership of a follow record.
 *
 * The follow is identified by the pair (followerId, followingId) which may
 * arrive as route params or request body.  This helper only allows the
 * **follower** to modify their own follow relationship.
 */
export const requireFollowOwnership = async (
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<void> => {
  try {
    if (!req.user) return next(new ForbiddenError());

    // The follower is always the authenticated user — we never trust
    // `followerId` from the request body.
    const followerId = req.user.id;
    const followingId = (req.params.followingId ?? req.body.followingId) as string | undefined;

    if (!followingId) return next(new NotFoundError());

    const { prisma } = await import("../config/database.js");
    const follow = await prisma.follow.findUnique({
      where: { followerId_followingId: { followerId, followingId } },
      select: { followerId: true },
    });

    if (!follow) return next(new NotFoundError());

    // Only the follower can delete / modify their own follow
    if (follow.followerId !== req.user.id) return next(new ForbiddenError());

    next();
  } catch (err) {
    next(err);
  }
};

/**
 * Ensures the authenticated user is the same user identified by `:id` in the
 * route params.  Useful for user-profile / account routes.
 */
export const requireSelf = async (
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<void> => {
  try {
    if (!req.user) return next(new ForbiddenError());
    const raw = req.params.id;
    const id = Array.isArray(raw) ? raw[0] : raw;
    if (id !== req.user.id) return next(new ForbiddenError());
    next();
  } catch (err) {
    next(err);
  }
};
