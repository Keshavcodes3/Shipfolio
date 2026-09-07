import type { Request, Response, NextFunction } from "express";
import { activityService } from "../service/activity.service.js";

export const activityController = {
  async list(req: Request, res: Response, next: NextFunction) {
    try {
      const data = await activityService.list(req.query);
      res.json({ success: true, data });
    } catch (err) { next(err); }
  },
  async getById(req: Request, res: Response, next: NextFunction) {
    try {
      const id = Array.isArray(req.params.id) ? req.params.id[0] : req.params.id;
      const data = await activityService.getById(id);
      res.json({ success: true, data });
    } catch (err) { next(err); }
  },
  async create(req: Request, res: Response, next: NextFunction) {
    try {
      const data = await activityService.create(req.body);
      res.status(201).json({ success: true, data });
    } catch (err) { next(err); }
  },
  async update(req: Request, res: Response, next: NextFunction) {
    try {
      const id = Array.isArray(req.params.id) ? req.params.id[0] : req.params.id;
      const data = await activityService.update(id, req.user!.id, req.body);
      res.json({ success: true, data });
    } catch (err) { next(err); }
  },
  async remove(req: Request, res: Response, next: NextFunction) {
    try {
      const id = Array.isArray(req.params.id) ? req.params.id[0] : req.params.id;
      await activityService.remove(id, req.user!.id);
      res.json({ success: true, message: "Deleted" });
    } catch (err) { next(err); }
  },
};

export default activityController;
