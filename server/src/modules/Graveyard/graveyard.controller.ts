import { Request, Response, NextFunction } from 'express';
import { graveyardRepository } from './graveyard.repository.js';

export const graveyardController = {
  getAll: (_req: Request, res: Response, next: NextFunction) => {
    try {
      const entries = graveyardRepository.findAll();
      res.json({ success: true, data: entries });
    } catch (err) { next(err); }
  },

  getBySlug: (req: Request, res: Response, next: NextFunction) => {
    try {
      const entry = graveyardRepository.findBySlug(req.params.slug as string);
      if (!entry) {
        res.status(404).json({ success: false, error: { code: 'NOT_FOUND', message: 'Entry not found' } });
        return;
      }
      res.json({ success: true, data: entry });
    } catch (err) { next(err); }
  },

  getByCategory: (req: Request, res: Response, next: NextFunction) => {
    try {
      const entries = graveyardRepository.findByCategory(req.params.category as string);
      res.json({ success: true, data: entries });
    } catch (err) { next(err); }
  },

  getCategories: (_req: Request, res: Response, next: NextFunction) => {
    try {
      const cats = graveyardRepository.getCategories();
      res.json({ success: true, data: cats });
    } catch (err) { next(err); }
  },

  getStats: (_req: Request, res: Response, next: NextFunction) => {
    try {
      const stats = graveyardRepository.getStats();
      res.json({ success: true, data: stats });
    } catch (err) { next(err); }
  },

  search: (req: Request, res: Response, next: NextFunction) => {
    try {
      const q = (req.query.q as string) || '';
      const entries = graveyardRepository.search(q);
      res.json({ success: true, data: entries });
    } catch (err) { next(err); }
  },

  getFeatured: (_req: Request, res: Response, next: NextFunction) => {
    try {
      const entries = graveyardRepository.getFeatured();
      res.json({ success: true, data: entries });
    } catch (err) { next(err); }
  },
};
