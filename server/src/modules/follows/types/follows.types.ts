// ---------------------------------------------------------------------------
// Follow module types
// ---------------------------------------------------------------------------

export type FollowResult = {
  following: boolean;
  followers: number;
  followingCount: number;
};

export type FollowUserSummary = {
  id: string;
  username: string;
  name: string | null;
  avatarUrl: string | null;
};

export type FollowListItem = {
  user: FollowUserSummary;
  followedAt: Date;
};

export type FollowListQuery = {
  page?: number;
  limit?: number;
};

export type FollowCountResult = {
  followers: number;
  following: number;
};
