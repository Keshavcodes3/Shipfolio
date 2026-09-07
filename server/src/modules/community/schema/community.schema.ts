import { z } from 'zod';

const PostTypeSchema = z.enum(['PROJECT_UPDATE', 'ASK_FOR_REVIEW', 'DISCUSSION', 'SHIP']);

export const createPostSchema = z.object({
  title: z.string().min(1).max(200),
  content: z.string().min(1),
  type: PostTypeSchema.default('DISCUSSION'),
  category: z.string().min(1).max(50),
  tags: z.array(z.string().max(30)).max(5).optional().default([]),
});

export const updatePostSchema = z.object({
  title: z.string().min(1).max(200).optional(),
  content: z.string().min(1).optional(),
  category: z.string().min(1).max(50).optional(),
  tags: z.array(z.string().max(30)).max(5).optional(),
});

export const createCommentSchema = z.object({
  content: z.string().min(1),
});

export const communityQuerySchema = z.object({
  page: z.coerce.number().int().min(1).default(1),
  limit: z.coerce.number().int().min(1).max(50).default(12),
  type: PostTypeSchema.optional(),
  category: z.string().optional(),
  sort: z.enum(['recent', 'popular', 'discussed']).default('recent'),
  search: z.string().max(100).optional(),
});

export const commentQuerySchema = z.object({
  page: z.coerce.number().int().min(1).default(1),
  limit: z.coerce.number().int().min(1).max(50).default(20),
});
