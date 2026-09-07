import type { Request, Response, NextFunction } from "express";
import { experienceService } from "../service/experience.service.js";

const param = (value: unknown): string =>
  Array.isArray(value) ? value[0] : (value as string);

export const experienceController = {
  async list(req: Request, res: Response, next: NextFunction) {
    try {
      const entries = await experienceService.list(req.user!.id);
      res.json({ success: true, data: entries });
    } catch (err) {
      next(err);
    }
  },

  async getById(req: Request, res: Response, next: NextFunction) {
    try {
      const id = param(req.params.id);
      const entry = await experienceService.getById(id);
      res.json({ success: true, data: entry });
    } catch (err) {
      next(err);
    }
  },

  async create(req: Request, res: Response, next: NextFunction) {
    try {
      const entry = await experienceService.create(req.user!.id, req.body);
      res.status(201).json({ success: true, data: entry });
    } catch (err) {
      next(err);
    }
  },

  async update(req: Request, res: Response, next: NextFunction) {
    try {
      const id = param(req.params.id);
      const entry = await experienceService.update(req.user!.id, id, req.body);
      res.json({ success: true, data: entry });
    } catch (err) {
      next(err);
    }
  },

  async remove(req: Request, res: Response, next: NextFunction) {
    try {
      const id = param(req.params.id);
      await experienceService.delete(req.user!.id, id);
      res.json({ success: true, message: "Experience entry deleted" });
    } catch (err) {
      next(err);
    }
  },

  async reorder(req: Request, res: Response, next: NextFunction) {
    try {
      await experienceService.reorder(req.user!.id, req.body.ids);
      res.json({ success: true, message: "Experience entries reordered" });
    } catch (err) {
      next(err);
    }
  },
};

export default experienceController;
