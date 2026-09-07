import type { Request, Response, NextFunction } from "express";
import { followsService } from "../service/follows.service.js";

/** Safely extract a single string from an Express 5 param. */
const param = (value: unknown): string =>
  Array.isArray(value) ? value[0] : (value as string);

export const followsController = {
  /**
   * POST /follows/:username/follow
   * Follow a user.
   */
  async follow(req: Request, res: Response, next: NextFunction) {
    try {
      const username = param(req.params.username);
      const result = await followsService.follow(req.user!.id, username);
      res.json({ success: true, data: result });
    } catch (err) {
      next(err);
    }
  },

  /**
   * DELETE /follows/:username/follow
   * Unfollow a user.
   */
  async unfollow(req: Request, res: Response, next: NextFunction) {
    try {
      const username = param(req.params.username);
      const result = await followsService.unfollow(req.user!.id, username);
      res.json({ success: true, data: result });
    } catch (err) {
      next(err);
    }
  },

  /**
   * GET /follows/:username/status
   * Check follow status (requires auth).
   */
  async getFollowStatus(req: Request, res: Response, next: NextFunction) {
    try {
      const username = param(req.params.username);
      const result = await followsService.getFollowStatus(req.user!.id, username);
      res.json({ success: true, data: result });
    } catch (err) {
      next(err);
    }
  },

  /**
   * GET /follows/:username/followers
   * List followers (paginated, public).
   */
  async listFollowers(req: Request, res: Response, next: NextFunction) {
    try {
      const username = param(req.params.username);
      const result = await followsService.listFollowers(username, req.query as any, req.user?.id);
      res.json({ success: true, data: result.data, pagination: result.pagination });
    } catch (err) {
      next(err);
    }
  },

  /**
   * GET /follows/:username/following
   * List following (paginated, public).
   */
  async listFollowing(req: Request, res: Response, next: NextFunction) {
    try {
      const username = param(req.params.username);
      const result = await followsService.listFollowing(username, req.query as any, req.user?.id);
      res.json({ success: true, data: result.data, pagination: result.pagination });
    } catch (err) {
      next(err);
    }
  },

  /**
   * GET /follows/:username/counts
   * Get follower/following counts (public).
   */
  async getFollowCounts(req: Request, res: Response, next: NextFunction) {
    try {
      const { prisma } = await import("../../../config/database.js");
      const username = param(req.params.username);
      const user = await prisma.user.findUnique({
        where: { username },
        select: { id: true },
      });
      if (!user) return res.status(404).json({ success: false, message: "User not found" });

      const counts = await followsService.getFollowCounts(user.id);
      res.json({ success: true, data: counts });
    } catch (err) {
      next(err);
    }
  },
};

export default followsController;
