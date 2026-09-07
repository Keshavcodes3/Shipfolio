import type { Request, Response, NextFunction } from "express";
import { notificationsService } from "../service/notifications.service.js";

/** Safely extract a single string from an Express 5 param. */
const param = (value: unknown): string =>
  Array.isArray(value) ? value[0] : (value as string);

export const notificationsController = {
  /**
   * GET /notifications?page&limit&unreadOnly
   * Paginated inbox for the authenticated user, newest first.
   */
  async list(req: Request, res: Response, next: NextFunction) {
    try {
      const result = await notificationsService.list(req.user!.id, req.query as any);
      res.json({ success: true, data: result.data, pagination: result.pagination });
    } catch (err) {
      next(err);
    }
  },

  /**
   * GET /notifications/unread-count
   * Badge count for the authenticated user.
   */
  async getUnreadCount(req: Request, res: Response, next: NextFunction) {
    try {
      const result = await notificationsService.getUnreadCount(req.user!.id);
      res.json({ success: true, data: result });
    } catch (err) {
      next(err);
    }
  },

  /**
   * PATCH /notifications/:id/read
   * Mark a single notification as read.
   */
  async markRead(req: Request, res: Response, next: NextFunction) {
    try {
      const result = await notificationsService.markRead(req.user!.id, param(req.params.id));
      res.json({ success: true, data: result });
    } catch (err) {
      next(err);
    }
  },

  /**
   * POST /notifications/read-all
   * Mark every notification as read.
   */
  async markAllRead(req: Request, res: Response, next: NextFunction) {
    try {
      const result = await notificationsService.markAllRead(req.user!.id);
      res.json({ success: true, data: result });
    } catch (err) {
      next(err);
    }
  },

  /**
   * DELETE /notifications/:id
   * Delete a notification.
   */
  async remove(req: Request, res: Response, next: NextFunction) {
    try {
      await notificationsService.remove(req.user!.id, param(req.params.id));
      res.json({ success: true, message: "Deleted" });
    } catch (err) {
      next(err);
    }
  },
};

export default notificationsController;
