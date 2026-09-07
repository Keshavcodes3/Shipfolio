export type PostType = 'PROJECT_UPDATE' | 'ASK_FOR_REVIEW' | 'DISCUSSION' | 'SHIP';

export interface CreatePostInput {
  title: string;
  content: string;
  type?: PostType;
  category: string;
  tags?: string[];
}

export interface UpdatePostInput {
  title?: string;
  content?: string;
  category?: string;
  tags?: string[];
}

export interface CreateCommentInput {
  content: string;
}

export interface CommunityPostQuery {
  page?: number;
  limit?: number;
  type?: PostType;
  category?: string;
  sort?: 'recent' | 'popular' | 'discussed';
  search?: string;
  authorId?: string;
}

export interface CommunityPostResponse {
  id: string;
  type: PostType;
  title: string;
  content: string;
  category: string;
  tags: string[];
  isPinned: boolean;
  upvoteCount: number;
  commentCount: number;
  createdAt: Date;
  updatedAt: Date;
  author: {
    id: string;
    username: string;
    displayName: string | null;
    avatarUrl: string | null;
  };
  isUpvoted?: boolean;
}

export interface CommunityCommentResponse {
  id: string;
  content: string;
  createdAt: Date;
  updatedAt: Date;
  author: {
    id: string;
    username: string;
    displayName: string | null;
    avatarUrl: string | null;
  };
}

export interface CommunityStatsResponse {
  totalPosts: number;
  totalComments: number;
  activeBuilders: number;
  postsToday: number;
}
