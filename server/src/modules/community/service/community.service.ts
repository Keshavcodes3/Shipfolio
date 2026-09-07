import { communityRepository } from '../repository/community.repository.js';
import { NotFoundError, ForbiddenError } from '../../../shared/errors/index.js';
import type {
  CreatePostInput,
  UpdatePostInput,
  CreateCommentInput,
  CommunityPostQuery,
  CommunityPostResponse,
  CommunityCommentResponse,
  CommunityStatsResponse,
} from '../types/community.types.js';

function mapPost(post: any, viewerId?: string): CommunityPostResponse {
  return {
    id: post.id,
    type: post.type,
    title: post.title,
    content: post.content,
    category: post.category,
    tags: post.tags ?? [],
    isPinned: post.isPinned,
    upvoteCount: post.upvoteCount,
    commentCount: post.commentCount,
    createdAt: post.createdAt,
    updatedAt: post.updatedAt,
    author: {
      id: post.author.id,
      username: post.author.username,
      displayName: post.author.name,
      avatarUrl: post.author.avatarUrl,
    },
    isUpvoted: viewerId ? (post.upvotes?.length ?? 0) > 0 : undefined,
  };
}

function mapComment(comment: any): CommunityCommentResponse {
  return {
    id: comment.id,
    content: comment.content,
    createdAt: comment.createdAt,
    updatedAt: comment.updatedAt,
    author: {
      id: comment.author.id,
      username: comment.author.username,
      displayName: comment.author.name,
      avatarUrl: comment.author.avatarUrl,
    },
  };
}

export const communityService = {
  createPost: async (authorId: string, input: CreatePostInput) => {
    const post = await communityRepository.createPost(authorId, {
      title: input.title,
      content: input.content,
      type: input.type ?? 'DISCUSSION',
      category: input.category,
      tags: input.tags ?? [],
    });
    return mapPost(post);
  },

  getPosts: async (query: CommunityPostQuery, viewerId?: string) => {
    const [posts, total] = await Promise.all([
      communityRepository.findPosts(query, viewerId),
      communityRepository.countPosts(query),
    ]);
    return {
      posts: posts.map((p: any) => mapPost(p, viewerId)),
      total,
      page: query.page ?? 1,
      limit: query.limit ?? 12,
      totalPages: Math.ceil(total / (query.limit ?? 12)),
    };
  },

  getPost: async (id: string, viewerId?: string) => {
    const post = await communityRepository.findPostById(id);
    if (!post) return null;

    let isUpvoted = false;
    if (viewerId) {
      const upvote = await communityRepository.isUpvoted(viewerId, id);
      isUpvoted = !!upvote;
    }

    return { ...mapPost(post), isUpvoted };
  },

  updatePost: async (id: string, authorId: string, input: UpdatePostInput) => {
    const post = await communityRepository.findPostById(id);
    if (!post) throw new NotFoundError('Post not found');
    if (post.authorId !== authorId) throw new ForbiddenError('Unauthorized');

    const updated = await communityRepository.updatePost(id, input);
    return mapPost(updated);
  },

  deletePost: async (id: string, authorId: string) => {
    const post = await communityRepository.findPostById(id);
    if (!post) throw new NotFoundError('Post not found');
    if (post.authorId !== authorId) throw new ForbiddenError('Unauthorized');
    await communityRepository.deletePost(id);
  },

  togglePin: async (id: string) => {
    const post = await communityRepository.findPostById(id);
    if (!post) throw new NotFoundError('Post not found');
    return communityRepository.togglePin(id, !post.isPinned);
  },

  toggleUpvote: async (userId: string, postId: string) => {
    const existing = await communityRepository.isUpvoted(userId, postId);
    if (existing) {
      await communityRepository.removeUpvote(userId, postId);
      await communityRepository.decrementUpvote(postId);
      return { upvoted: false };
    }
    await communityRepository.upvote(userId, postId);
    await communityRepository.incrementUpvote(postId);

    // Notify the post author (fire-and-forget — notify() never throws)
    try {
      const post = await communityRepository.findPostById(postId);
      if (post && post.authorId !== userId) {
        const { prisma } = await import("../../../config/database.js");
        const actor = await prisma.user.findUnique({
          where: { id: userId },
          select: { username: true },
        });
        const { notificationsService } = await import("../../notifications/service/notifications.service.js");
        await notificationsService.notify({
          userId: post.authorId,
          actorId: userId,
          type: "COMMUNITY_UPVOTE",
          title: "Post upvoted",
          message: `${actor?.username ?? "Someone"} upvoted your post "${post.title}"`,
          link: `/community/${postId}`,
        });
      }
    } catch {
      // notification failures must never break the upvote flow
    }

    return { upvoted: true };
  },

  getComments: async (postId: string, page: number = 1, limit: number = 20) => {
    const [comments, total] = await Promise.all([
      communityRepository.findComments(postId, page, limit),
      communityRepository.countComments(postId),
    ]);
    return {
      comments: comments.map(mapComment),
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit),
    };
  },

  createComment: async (authorId: string, postId: string, input: CreateCommentInput) => {
    const post = await communityRepository.findPostById(postId);
    if (!post) throw new NotFoundError('Post not found');

    const comment = await communityRepository.createComment(authorId, postId, input.content);
    await communityRepository.incrementCommentCount(postId);

    // Notify the post author (fire-and-forget — notify() never throws)
    try {
      if (post.authorId !== authorId) {
        const { prisma } = await import("../../../config/database.js");
        const actor = await prisma.user.findUnique({
          where: { id: authorId },
          select: { username: true },
        });
        const { notificationsService } = await import("../../notifications/service/notifications.service.js");
        await notificationsService.notify({
          userId: post.authorId,
          actorId: authorId,
          type: "COMMUNITY_COMMENT",
          title: "New comment",
          message: `${actor?.username ?? "Someone"} commented on your post "${post.title}"`,
          link: `/community/${postId}`,
        });
      }
    } catch {
      // notification failures must never break the comment flow
    }

    return mapComment(comment);
  },

  deleteComment: async (id: string, authorId: string) => {
    const comment = await communityRepository.findCommentById(id);
    if (!comment) throw new NotFoundError('Comment not found');
    if (comment.authorId !== authorId) throw new ForbiddenError('Unauthorized');
    await communityRepository.deleteComment(id);
    await communityRepository.decrementCommentCount(comment.postId);
  },

  getStats: async (): Promise<CommunityStatsResponse> => {
    return communityRepository.getStats();
  },

  getCategories: async () => {
    const cats = await communityRepository.findCategories();
    return cats.map((c: any) => ({ name: c.category, count: c._count.category }));
  },

  getRecentAuthors: async () => {
    return communityRepository.findRecentAuthors();
  },
};
