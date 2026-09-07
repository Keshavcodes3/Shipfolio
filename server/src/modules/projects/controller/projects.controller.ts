import type { Request, Response, NextFunction } from "express";
import { projectsService } from "../service/projects.service.js";

/** Safely extract a single string from an Express 5 param (which may be string | string[]). */
const param = (value: unknown): string =>
  Array.isArray(value) ? value[0] : (value as string);

export const projectsController = {
  // -------------------------------------------------------------------------
  // Public reads
  // -------------------------------------------------------------------------

  /**
   * GET /projects
   * List public projects with pagination, filters, and sorting.
   */
  async list(req: Request, res: Response, next: NextFunction) {
    try {
      const result = await projectsService.listPublic(req.query as any);
      res.json({ success: true, data: result.data, pagination: result.pagination });
    } catch (err) {
      next(err);
    }
  },

  /**
   * GET /projects/featured/:userId
   * List featured public projects for a user.
   */
  async listFeatured(req: Request, res: Response, next: NextFunction) {
    try {
      const userId = param(req.params.userId);
      const data = await projectsService.listFeatured(userId);
      res.json({ success: true, data });
    } catch (err) {
      next(err);
    }
  },

  /**
   * GET /projects/featured
   * List global featured public projects (no userId required).
   */
  async listGlobalFeatured(req: Request, res: Response, next: NextFunction) {
    try {
      const data = await projectsService.listGlobalFeatured();
      res.json({ success: true, data });
    } catch (err) {
      next(err);
    }
  },

  /**
   * GET /discover/builders
   * Get top builders with follower and project counts.
   */
  async getTopBuilders(req: Request, res: Response, next: NextFunction) {
    try {
      const take = req.query.limit ? Number(req.query.limit) : undefined;
      const data = await projectsService.getTopBuilders(take);
      res.json({ success: true, data });
    } catch (err) {
      next(err);
    }
  },

  /**
   * GET /projects/building/:userId
   * Get a user's currently-building project.
   */
  async getCurrentlyBuilding(req: Request, res: Response, next: NextFunction) {
    try {
      const userId = param(req.params.userId);
      const data = await projectsService.getCurrentlyBuilding(userId);
      res.json({ success: true, data });
    } catch (err) {
      next(err);
    }
  },

  /**
   * GET /projects/:id
   * Get a single project by ID. Private projects only visible to owner.
   */
  async getById(req: Request, res: Response, next: NextFunction) {
    try {
      const id = param(req.params.id);
      const data = await projectsService.getById(id, req.user?.id);
      res.json({ success: true, data });
    } catch (err) {
      next(err);
    }
  },

  // -------------------------------------------------------------------------
  // Authenticated reads
  // -------------------------------------------------------------------------

  /**
   * GET /projects/mine
   * List the authenticated user's own projects (includes private).
   */
  async listMine(req: Request, res: Response, next: NextFunction) {
    try {
      const result = await projectsService.listOwn(req.user!.id, req.query as any);
      res.json({ success: true, data: result.data, pagination: result.pagination });
    } catch (err) {
      next(err);
    }
  },

  // -------------------------------------------------------------------------
  // Writes (auth required)
  // -------------------------------------------------------------------------

  /**
   * POST /projects
   * Create a new project.
   */
  async create(req: Request, res: Response, next: NextFunction) {
    try {
      const data = await projectsService.create(req.user!.id, req.body);
      res.status(201).json({ success: true, data });
    } catch (err) {
      next(err);
    }
  },

  /**
   * PATCH /projects/:id
   * Update a project. Owner only.
   */
  async update(req: Request, res: Response, next: NextFunction) {
    try {
      const id = param(req.params.id);
      const data = await projectsService.update(id, req.user!.id, req.body);
      res.json({ success: true, data });
    } catch (err) {
      next(err);
    }
  },

  /**
   * DELETE /projects/:id
   * Delete a project. Owner only.
   */
  async remove(req: Request, res: Response, next: NextFunction) {
    try {
      const id = param(req.params.id);
      await projectsService.remove(id, req.user!.id);
      res.json({ success: true, message: "Project deleted" });
    } catch (err) {
      next(err);
    }
  },
};

export default projectsController;
