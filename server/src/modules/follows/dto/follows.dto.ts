import type { FollowResult, FollowUserSummary } from "../types/follows.types.js";

export const toFollowResult = (data: {
  following: boolean;
  followers: number;
  following: number;
}): FollowResult => ({
  following: data.following,
  followerCount: data.followers,
  followingCount: data.following,
});

export const toFollowUserSummary = (user: {
  id: string;
  username: string;
  name: string | null;
  avatarUrl: string | null;
}): FollowUserSummary => ({
  id: user.id,
  username: user.username,
  name: user.name,
  avatarUrl: user.avatarUrl,
});
