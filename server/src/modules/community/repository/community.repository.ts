import { prisma } from '../../../config/database.js';
import type { CommunityPostQuery } from '../types/community.types.js';

const AUTHOR_SELECT = {
  id: true,
  username: true,
  name: true,
  avatarUrl: true,
} as const;

export const communityRepository = {
  createPost: (authorId: string, data: {
    title: string;
    content: string;
    type: string;
    category: string;
    tags: string[];
  }) =>
    prisma.communityPost.create({
      data: { authorId, ...data, type: data.type as any },
      include: { author: { select: AUTHOR_SELECT } },
    }),

  findPostById: (id: string) =>
    prisma.communityPost.findUnique({
      where: { id },
      include: { author: { select: AUTHOR_SELECT } },
    }),

  findPosts: (query: CommunityPostQuery, viewerId?: string) => {
    const { page = 1, limit = 12, type, category, sort, search, authorId } = query;
    const skip = (page - 1) * limit;

    const where: any = {};
    if (type) where.type = type;
    if (category) where.category = category;
    if (authorId) where.authorId = authorId;
    if (search) {
      where.OR = [
        { title: { contains: search, mode: 'insensitive' } },
        { content: { contains: search, mode: 'insensitive' } },
      ];
    }

    const orderBy: any =
      sort === 'popular'
        ? { upvoteCount: 'desc' }
        : sort === 'discussed'
        ? { commentCount: 'desc' }
        : [{ isPinned: 'desc' }, { createdAt: 'desc' }];

    return prisma.communityPost.findMany({
      where,
      orderBy,
      skip,
      take: limit,
      include: {
        author: { select: AUTHOR_SELECT },
        ...(viewerId
          ? {
              upvotes: {
                where: { userId: viewerId },
                select: { userId: true },
                take: 1,
              },
            }
          : {}),
      },
    });
  },

  countPosts: (query: CommunityPostQuery) => {
    const { type, category, search, authorId } = query;
    const where: any = {};
    if (type) where.type = type;
    if (category) where.category = category;
    if (authorId) where.authorId = authorId;
    if (search) {
      where.OR = [
        { title: { contains: search, mode: 'insensitive' } },
        { content: { contains: search, mode: 'insensitive' } },
      ];
    }
    return prisma.communityPost.count({ where });
  },

  updatePost: (id: string, data: { title?: string; content?: string; category?: string; tags?: string[] }) =>
    prisma.communityPost.update({
      where: { id },
      data,
      include: { author: { select: AUTHOR_SELECT } },
    }),

  deletePost: (id: string) =>
    prisma.communityPost.delete({ where: { id } }),

  togglePin: (id: string, isPinned: boolean) =>
    prisma.communityPost.update({
      where: { id },
      data: { isPinned },
    }),

  incrementUpvote: (postId: string) =>
    prisma.communityPost.update({
      where: { id: postId },
      data: { upvoteCount: { increment: 1 } },
    }),

  decrementUpvote: (postId: string) =>
    prisma.communityPost.update({
      where: { id: postId },
      data: { upvoteCount: { decrement: 1 } },
    }),

  incrementCommentCount: (postId: string) =>
    prisma.communityPost.update({
      where: { id: postId },
      data: { commentCount: { increment: 1 } },
    }),

  decrementCommentCount: (postId: string) =>
    prisma.communityPost.update({
      where: { id: postId },
      data: { commentCount: { decrement: 1 } },
    }),

  upvote: (userId: string, postId: string) =>
    prisma.communityUpvote.create({ data: { userId, postId } }),

  removeUpvote: (userId: string, postId: string) =>
    prisma.communityUpvote.deleteMany({ where: { userId, postId } }),

  isUpvoted: (userId: string, postId: string) =>
    prisma.communityUpvote.findUnique({
      where: { userId_postId: { userId, postId } },
    }),

  createComment: (authorId: string, postId: string, content: string) =>
    prisma.communityComment.create({
      data: { authorId, postId, content },
      include: { author: { select: AUTHOR_SELECT } },
    }),

  findComments: (postId: string, page: number = 1, limit: number = 20) => {
    const skip = (page - 1) * limit;
    return prisma.communityComment.findMany({
      where: { postId },
      orderBy: { createdAt: 'asc' },
      skip,
      take: limit,
      include: { author: { select: AUTHOR_SELECT } },
    });
  },

  countComments: (postId: string) =>
    prisma.communityComment.count({ where: { postId } }),

  deleteComment: (id: string) =>
    prisma.communityComment.delete({ where: { id } }),

  findCommentById: (id: string) =>
    prisma.communityComment.findUnique({
      where: { id },
      select: { id: true, authorId: true, postId: true, content: true, createdAt: true, updatedAt: true },
    }),

  getStats: async () => {
    const now = new Date();
    const startOfDay = new Date(now.getFullYear(), now.getMonth(), now.getDate());

    const [totalPosts, totalComments, activeBuilders, postsToday] = await Promise.all([
      prisma.communityPost.count(),
      prisma.communityComment.count(),
      prisma.user.count({ where: { communityPosts: { some: {} } } }),
      prisma.communityPost.count({ where: { createdAt: { gte: startOfDay } } }),
    ]);

    return { totalPosts, totalComments, activeBuilders, postsToday };
  },

  findCategories: () =>
    prisma.communityPost.groupBy({
      by: ['category'],
      _count: { category: true },
      orderBy: { _count: { category: 'desc' } },
      take: 10,
    }),

  findRecentAuthors: (take: number = 5) =>
    prisma.user.findMany({
      take,
      where: { communityPosts: { some: {} } },
      orderBy: { communityPosts: { _count: 'desc' } },
      select: {
        id: true,
        username: true,
        name: true,
        avatarUrl: true,
        _count: { select: { communityPosts: true } },
      },
    }),
};
