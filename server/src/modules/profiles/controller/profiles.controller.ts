import type { Request, Response, NextFunction } from "express";
import { profilesService } from "../service/profiles.service.js";

/** Safely extract a single string from an Express 5 param (which may be string | string[]). */
const param = (value: unknown): string =>
  Array.isArray(value) ? value[0] : (value as string);

export const profilesController = {
  /**
   * GET /profiles/:username
   * Public profile view. Optional auth — if authenticated, includes `isFollowing`.
   */
  async getByUsername(req: Request, res: Response, next: NextFunction) {
    try {
      const username = param(req.params.username);
      const viewerId = req.user?.id;
      const profile = await profilesService.getPublicProfile(username, viewerId);
      res.json({ success: true, data: profile });
    } catch (err) {
      next(err);
    }
  },

  /**
   * GET /profiles/me
   * Authenticated user's own private profile.
   */
  async getOwn(req: Request, res: Response, next: NextFunction) {
    try {
      const profile = await profilesService.getOwnProfile(req.user!.id);
      res.json({ success: true, data: profile });
    } catch (err) {
      next(err);
    }
  },

  /**
   * PATCH /profiles/me
   * Update the authenticated user's profile.
   */
  async updateOwn(req: Request, res: Response, next: NextFunction) {
    try {
      await profilesService.updateProfile(req.user!.id, req.body);
      res.json({ success: true, message: "Profile updated" });
    } catch (err) {
      next(err);
    }
  },

  /**
   * GET /profiles/:username/availability
   * Check if a username is available.
   */
  async checkUsernameAvailability(req: Request, res: Response, next: NextFunction) {
    try {
      const username = param(req.params.username);
      const result = await profilesService.checkUsernameAvailability(username);
      res.json({ success: true, data: result });
    } catch (err) {
      next(err);
    }
  },

  /**
   * GET /profiles
   * List users (paginated, for discovery / search).
   */
  async list(req: Request, res: Response, next: NextFunction) {
    try {
      const result = await profilesService.listUsers(req.query as any);
      res.json({ success: true, data: result.data, pagination: result.pagination });
    } catch (err) {
      next(err);
    }
  },

  /**
   * GET /profiles/:username/followers
   * List a user's followers (paginated).
   */
  async getFollowers(req: Request, res: Response, next: NextFunction) {
    try {
      const username = param(req.params.username);
      const result = await profilesService.getFollowers(username, req.query as any);
      res.json({ success: true, data: result.data, pagination: result.pagination });
    } catch (err) {
      next(err);
    }
  },

  /**
   * GET /profiles/:username/following
   * List users this user is following (paginated).
   */
  async getFollowing(req: Request, res: Response, next: NextFunction) {
    try {
      const username = param(req.params.username);
      const result = await profilesService.getFollowing(username, req.query as any);
      res.json({ success: true, data: result.data, pagination: result.pagination });
    } catch (err) {
      next(err);
    }
  },
};

export default profilesController;
