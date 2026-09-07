import type { Request, Response, NextFunction } from "express";
import { educationService } from "../service/education.service.js";

const param = (value: unknown): string =>
  Array.isArray(value) ? value[0] : (value as string);

export const educationController = {
  async list(req: Request, res: Response, next: NextFunction) {
    try {
      const entries = await educationService.list(req.user!.id);
      res.json({ success: true, data: entries });
    } catch (err) {
      next(err);
    }
  },

  async getById(req: Request, res: Response, next: NextFunction) {
    try {
      const id = param(req.params.id);
      const entry = await educationService.getById(id);
      res.json({ success: true, data: entry });
    } catch (err) {
      next(err);
    }
  },

  async create(req: Request, res: Response, next: NextFunction) {
    try {
      const entry = await educationService.create(req.user!.id, req.body);
      res.status(201).json({ success: true, data: entry });
    } catch (err) {
      next(err);
    }
  },

  async update(req: Request, res: Response, next: NextFunction) {
    try {
      const id = param(req.params.id);
      const entry = await educationService.update(req.user!.id, id, req.body);
      res.json({ success: true, data: entry });
    } catch (err) {
      next(err);
    }
  },

  async remove(req: Request, res: Response, next: NextFunction) {
    try {
      const id = param(req.params.id);
      await educationService.delete(req.user!.id, id);
      res.json({ success: true, message: "Education entry deleted" });
    } catch (err) {
      next(err);
    }
  },

  async reorder(req: Request, res: Response, next: NextFunction) {
    try {
      await educationService.reorder(req.user!.id, req.body.ids);
      res.json({ success: true, message: "Education entries reordered" });
    } catch (err) {
      next(err);
    }
  },
};

export default educationController;
