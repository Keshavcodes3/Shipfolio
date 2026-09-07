import type { Request, Response, NextFunction } from "express";
import { technologiesService } from "../service/technologies.service.js";

/** Safely extract a single string from an Express 5 param (which may be string | string[]). */
const param = (value: unknown): string =>
  Array.isArray(value) ? value[0] : (value as string);

export const technologiesController = {
  // -------------------------------------------------------------------------
  // Technology CRUD
  // -------------------------------------------------------------------------

  /**
   * GET /technologies
   * List technologies with pagination, search, and filtering.
   */
  async list(req: Request, res: Response, next: NextFunction) {
    try {
      const result = await technologiesService.list(req.query as any);
      res.json({ success: true, data: result.data, pagination: result.pagination });
    } catch (err) {
      next(err);
    }
  },

  /**
   * GET /technologies/search
   * Search technologies by name or slug.
   */
  async search(req: Request, res: Response, next: NextFunction) {
    try {
      const q = req.query.q as string;
      const limit = req.query.limit ? Number(req.query.limit) : 20;
      const data = await technologiesService.search(q, limit);
      res.json({ success: true, data });
    } catch (err) {
      next(err);
    }
  },

  /**
   * GET /technologies/:id
   * Get a technology by ID.
   */
  async getById(req: Request, res: Response, next: NextFunction) {
    try {
      const id = param(req.params.id);
      const data = await technologiesService.getById(id);
      res.json({ success: true, data });
    } catch (err) {
      next(err);
    }
  },

  /**
   * POST /technologies
   * Create a new technology. Auth required.
   */
  async create(req: Request, res: Response, next: NextFunction) {
    try {
      const data = await technologiesService.create(req.body);
      res.status(201).json({ success: true, data });
    } catch (err) {
      next(err);
    }
  },

  /**
   * PATCH /technologies/:id
   * Update a technology. Auth required.
   */
  async update(req: Request, res: Response, next: NextFunction) {
    try {
      const id = param(req.params.id);
      const data = await technologiesService.update(id, req.body);
      res.json({ success: true, data });
    } catch (err) {
      next(err);
    }
  },

  /**
   * DELETE /technologies/:id
   * Delete a technology. Auth required.
   */
  async remove(req: Request, res: Response, next: NextFunction) {
    try {
      const id = param(req.params.id);
      await technologiesService.remove(id);
      res.json({ success: true, message: "Technology deleted" });
    } catch (err) {
      next(err);
    }
  },

  // -------------------------------------------------------------------------
  // User–Technology relationships
  // -------------------------------------------------------------------------

  /**
   * GET /technologies/user/:userId
   * Get technologies for a user.
   */
  async getUserTechnologies(req: Request, res: Response, next: NextFunction) {
    try {
      const userId = param(req.params.userId);
      const data = await technologiesService.getUserTechnologies(userId);
      res.json({ success: true, data });
    } catch (err) {
      next(err);
    }
  },

  /**
   * POST /technologies/user/attach
   * Attach a technology to the authenticated user.
   */
  async attachToUser(req: Request, res: Response, next: NextFunction) {
    try {
      const data = await technologiesService.attachToUser(req.user!.id, req.body);
      res.status(201).json({ success: true, data });
    } catch (err) {
      next(err);
    }
  },

  /**
   * DELETE /technologies/user/:technologyId
   * Remove a technology from the authenticated user.
   */
  async detachFromUser(req: Request, res: Response, next: NextFunction) {
    try {
      const technologyId = param(req.params.technologyId);
      await technologiesService.detachFromUser(req.user!.id, technologyId);
      res.json({ success: true, message: "Technology removed from user" });
    } catch (err) {
      next(err);
    }
  },

  /**
   * PATCH /technologies/user/:technologyId/primary
   * Set a technology as primary for the authenticated user.
   */
  async setPrimaryUserTechnology(req: Request, res: Response, next: NextFunction) {
    try {
      const technologyId = param(req.params.technologyId);
      const data = await technologiesService.setPrimaryUserTechnology(req.user!.id, technologyId);
      res.json({ success: true, data });
    } catch (err) {
      next(err);
    }
  },

  // -------------------------------------------------------------------------
  // Project–Technology relationships
  // -------------------------------------------------------------------------

  /**
   * GET /technologies/project/:projectId
   * Get technologies for a project.
   */
  async getProjectTechnologies(req: Request, res: Response, next: NextFunction) {
    try {
      const projectId = param(req.params.projectId);
      const data = await technologiesService.getProjectTechnologies(projectId);
      res.json({ success: true, data });
    } catch (err) {
      next(err);
    }
  },

  /**
   * POST /technologies/project/:projectId/attach
   * Attach a technology to a project. Owner only.
   */
  async attachToProject(req: Request, res: Response, next: NextFunction) {
    try {
      const projectId = param(req.params.projectId);
      const data = await technologiesService.attachToProject(
        projectId,
        req.user!.id,
        req.body,
      );
      res.status(201).json({ success: true, data });
    } catch (err) {
      next(err);
    }
  },

  /**
   * DELETE /technologies/project/:projectId/:technologyId
   * Remove a technology from a project. Owner only.
   */
  async detachFromProject(req: Request, res: Response, next: NextFunction) {
    try {
      const projectId = param(req.params.projectId);
      const technologyId = param(req.params.technologyId);
      await technologiesService.detachFromProject(projectId, req.user!.id, technologyId);
      res.json({ success: true, message: "Technology removed from project" });
    } catch (err) {
      next(err);
    }
  },

  /**
   * PATCH /technologies/project/:projectId/:technologyId/primary
   * Set a technology as primary for a project. Owner only.
   */
  async setPrimaryProjectTechnology(req: Request, res: Response, next: NextFunction) {
    try {
      const projectId = param(req.params.projectId);
      const technologyId = param(req.params.technologyId);
      const data = await technologiesService.setPrimaryProjectTechnology(
        projectId,
        req.user!.id,
        technologyId,
      );
      res.json({ success: true, data });
    } catch (err) {
      next(err);
    }
  },
};

export default technologiesController;
