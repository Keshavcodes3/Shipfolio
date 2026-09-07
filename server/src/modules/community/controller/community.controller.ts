import { Request, Response, NextFunction } from 'express';
import { communityService } from '../service/community.service.js';
import { createPostSchema, updatePostSchema, createCommentSchema, communityQuerySchema, commentQuerySchema } from '../schema/community.schema.js';

export const communityController = {
  createPost: async (req: Request, res: Response, next: NextFunction) => {
    try {
      const input = createPostSchema.parse(req.body);
      const post = await communityService.createPost(req.user!.id, input);
      res.status(201).json({ success: true, data: post });
    } catch (err) { next(err); }
  },

  getPosts: async (req: Request, res: Response, next: NextFunction) => {
    try {
      const query = communityQuerySchema.parse(req.query);
      const result = await communityService.getPosts(query, req.user?.id);
      res.json({ success: true, data: result });
    } catch (err) { next(err); }
  },

  getPost: async (req: Request, res: Response, next: NextFunction) => {
    try {
      const id = req.params.id as string;
      const post = await communityService.getPost(id, req.user?.id);
      if (!post) {
        res.status(404).json({ success: false, error: { code: 'POST_NOT_FOUND', message: 'Post not found' } });
        return;
      }
      res.json({ success: true, data: post });
    } catch (err) { next(err); }
  },

  updatePost: async (req: Request, res: Response, next: NextFunction) => {
    try {
      const input = updatePostSchema.parse(req.body);
      const post = await communityService.updatePost(req.params.id as string, req.user!.id, input);
      res.json({ success: true, data: post });
    } catch (err) { next(err); }
  },

  deletePost: async (req: Request, res: Response, next: NextFunction) => {
    try {
      await communityService.deletePost(req.params.id as string, req.user!.id);
      res.status(204).send();
    } catch (err) { next(err); }
  },

  togglePin: async (req: Request, res: Response, next: NextFunction) => {
    try {
      const post = await communityService.togglePin(req.params.id as string);
      res.json({ success: true, data: post });
    } catch (err) { next(err); }
  },

  toggleUpvote: async (req: Request, res: Response, next: NextFunction) => {
    try {
      const result = await communityService.toggleUpvote(req.user!.id, req.params.id as string);
      res.json({ success: true, data: result });
    } catch (err) { next(err); }
  },

  getComments: async (req: Request, res: Response, next: NextFunction) => {
    try {
      const query = commentQuerySchema.parse(req.query);
      const result = await communityService.getComments(req.params.id as string, query.page, query.limit);
      res.json({ success: true, data: result });
    } catch (err) { next(err); }
  },

  createComment: async (req: Request, res: Response, next: NextFunction) => {
    try {
      const input = createCommentSchema.parse(req.body);
      const comment = await communityService.createComment(req.user!.id, req.params.id as string, input);
      res.status(201).json({ success: true, data: comment });
    } catch (err) { next(err); }
  },

  deleteComment: async (req: Request, res: Response, next: NextFunction) => {
    try {
      await communityService.deleteComment(req.params.commentId as string, req.user!.id);
      res.status(204).send();
    } catch (err) { next(err); }
  },

  getStats: async (_req: Request, res: Response, next: NextFunction) => {
    try {
      const stats = await communityService.getStats();
      res.json({ success: true, data: stats });
    } catch (err) { next(err); }
  },

  getCategories: async (_req: Request, res: Response, next: NextFunction) => {
    try {
      const cats = await communityService.getCategories();
      res.json({ success: true, data: cats });
    } catch (err) { next(err); }
  },

  getRecentAuthors: async (_req: Request, res: Response, next: NextFunction) => {
    try {
      const authors = await communityService.getRecentAuthors();
      res.json({ success: true, data: authors });
    } catch (err) { next(err); }
  },
};
