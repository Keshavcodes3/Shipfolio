import type { Request, Response, NextFunction } from "express";
import { usersService } from "../service/users.service.js";

export const usersController = {
  /**
   * GET /users
   * List users (paginated).
   */
  async list(req: Request, res: Response, next: NextFunction) {
    try {
      const result = await usersService.list(req.query as any);
      res.json({ success: true, data: result.data, pagination: result.pagination });
    } catch (err) {
      next(err);
    }
  },

  /**
   * GET /users/:id
   * Get user by ID (private detail — requires auth + self).
   */
  async getById(req: Request, res: Response, next: NextFunction) {
    try {
      const raw = req.params.id;
      const id = Array.isArray(raw) ? raw[0] : raw;
      const data = await usersService.getById(id);
      res.json({ success: true, data });
    } catch (err) {
      next(err);
    }
  },

  /**
   * PATCH /users/:id
   * Update own account. Requires auth + self.
   */
  async update(req: Request, res: Response, next: NextFunction) {
    try {
      const raw = req.params.id;
      const id = Array.isArray(raw) ? raw[0] : raw;
      await usersService.updateOwn(id, req.body);
      res.json({ success: true, message: "Account updated" });
    } catch (err) {
      next(err);
    }
  },

  /**
   * DELETE /users/:id
   * Delete own account. Requires auth + self.
   */
  async remove(req: Request, res: Response, next: NextFunction) {
    try {
      const raw = req.params.id;
      const id = Array.isArray(raw) ? raw[0] : raw;
      await usersService.deleteOwn(id);
      res.json({ success: true, message: "Account deleted" });
    } catch (err) {
      next(err);
    }
  },
};

export default usersController;
