import type { Request, Response, NextFunction } from "express";
import { projectNeedsService } from "../service/projectNeeds.service.js";

/** Safely extract a single string from an Express 5 param (which may be string | string[]). */
const param = (value: unknown): string =>
  Array.isArray(value) ? value[0] : (value as string);

/** Check if the error is because a Prisma table doesn't exist yet. */
const isMissingTable = (err: any): boolean =>
  err?.code === "P2021" || err?.message?.includes("does not exist");

export const projectNeedsController = {
  // -------------------------------------------------------------------------
  // List needs for a project
  // -------------------------------------------------------------------------

  async list(req: Request, res: Response, next: NextFunction) {
    try {
      const projectId = param(req.params.id);
      const result = await projectNeedsService.listByProject(projectId, req.query as any);
      res.json({ success: true, data: result.data, pagination: result.pagination });
    } catch (err) {
      if (isMissingTable(err)) {
        return res.json({ success: true, data: [], pagination: { page: 1, limit: 20, total: 0, totalPages: 0 } });
      }
      next(err);
    }
  },

  // -------------------------------------------------------------------------
  // Get a single need with interests
  // -------------------------------------------------------------------------

  async getById(req: Request, res: Response, next: NextFunction) {
    try {
      const needId = param(req.params.needId);
      const data = await projectNeedsService.getById(needId);
      res.json({ success: true, data });
    } catch (err) {
      if (isMissingTable(err)) {
        return res.status(404).json({ success: false, message: "Not found" });
      }
      next(err);
    }
  },

  // -------------------------------------------------------------------------
  // Create a need
  // -------------------------------------------------------------------------

  async create(req: Request, res: Response, next: NextFunction) {
    try {
      const projectId = param(req.params.id);
      const data = await projectNeedsService.create(projectId, req.user!.id, req.body);
      res.status(201).json({ success: true, data });
    } catch (err) {
      if (isMissingTable(err)) {
        return res.status(503).json({ success: false, message: "Project needs feature is not available yet. Please run the database migration." });
      }
      next(err);
    }
  },

  // -------------------------------------------------------------------------
  // Update a need
  // -------------------------------------------------------------------------

  async update(req: Request, res: Response, next: NextFunction) {
    try {
      const needId = param(req.params.needId);
      const data = await projectNeedsService.update(needId, req.user!.id, req.body);
      res.json({ success: true, data });
    } catch (err) {
      if (isMissingTable(err)) {
        return res.status(503).json({ success: false, message: "Project needs feature is not available yet." });
      }
      next(err);
    }
  },

  // -------------------------------------------------------------------------
  // Delete a need
  // -------------------------------------------------------------------------

  async remove(req: Request, res: Response, next: NextFunction) {
    try {
      const needId = param(req.params.needId);
      await projectNeedsService.remove(needId, req.user!.id);
      res.json({ success: true, message: "Need deleted" });
    } catch (err) {
      if (isMissingTable(err)) {
        return res.status(503).json({ success: false, message: "Project needs feature is not available yet." });
      }
      next(err);
    }
  },

  // -------------------------------------------------------------------------
  // Express interest ("I CAN HELP")
  // -------------------------------------------------------------------------

  async expressInterest(req: Request, res: Response, next: NextFunction) {
    try {
      const needId = param(req.params.needId);
      const { interest, notify } = await projectNeedsService.expressInterest(
        needId,
        req.user!.id,
        req.body,
      );

      // Fire-and-forget notification to project owner
      if (notify) {
        try {
          const { notificationsService } = await import(
            "../../notifications/service/notifications.service.js"
          );
          const { projectNeedsRepository } = await import(
            "../repository/projectNeeds.repository.js"
          );
          const need = await projectNeedsRepository.findById(needId);
          if (need && need.project.userId !== req.user!.id) {
            const typeLabels: Record<string, string> = {
              FEEDBACK: "Feedback",
              BETA_TESTERS: "Beta Testing",
              EARLY_USERS: "Early Users",
              COLLABORATOR: "Collaboration",
              DESIGNER: "Design",
              DEVELOPER: "Development",
              TECHNICAL_ADVICE: "Technical Advice",
              PRODUCT_ADVICE: "Product Advice",
              OPEN_SOURCE_CONTRIBUTORS: "Open Source",
              OTHER: "Help",
            };
            await notificationsService.notify({
              userId: need.project.userId,
              actorId: req.user!.id,
              type: "NEED_INTEREST",
              title: `${typeLabels[need.type] ?? "Help"} needed`,
              message: `${req.user!.username} wants to help with your "${need.type}" request on ${need.project.name}`,
              link: `/projects/${need.project.id}`,
              projectId: need.projectId,
            });
          }
        } catch {
          // notification failures must never break the flow
        }
      }

      res.status(201).json({ success: true, data: interest });
    } catch (err) {
      if (isMissingTable(err)) {
        return res.status(503).json({ success: false, message: "Project needs feature is not available yet." });
      }
      next(err);
    }
  },

  // -------------------------------------------------------------------------
  // Withdraw interest
  // -------------------------------------------------------------------------

  async withdrawInterest(req: Request, res: Response, next: NextFunction) {
    try {
      const needId = param(req.params.needId);
      await projectNeedsService.withdrawInterest(needId, req.user!.id);
      res.json({ success: true, message: "Interest withdrawn" });
    } catch (err) {
      if (isMissingTable(err)) {
        return res.status(503).json({ success: false, message: "Project needs feature is not available yet." });
      }
      next(err);
    }
  },

  // -------------------------------------------------------------------------
  // Discover needs (public)
  // -------------------------------------------------------------------------

  async discoverNeeds(req: Request, res: Response, next: NextFunction) {
    try {
      const result = await projectNeedsService.discoverNeeds(req.query as any);
      res.json({ success: true, data: result.data, pagination: result.pagination });
    } catch (err) {
      if (isMissingTable(err)) {
        return res.json({ success: true, data: [], pagination: { page: 1, limit: 20, total: 0, totalPages: 0 } });
      }
      next(err);
    }
  },
};

export default projectNeedsController;
